import React, { useState } from 'react';
import type { ApiCaptura } from './api';
import { camaraAPartido, extraerYoutubeId, formatearSegundos, leerSegundos, type VideoPartido } from './reloj';

/**
 * Las cámaras (videos) de un partido: agregar otra, alinearla, sacarla.
 *
 * Alinear = decir el mismo momento en las dos: "el silbato del set 1 está en 3:12 de la
 * principal y en 0:41 de esta". De ahí sale d (segundo de partido = segundo de cámara + d).
 * Un d por cámara alcanza para videos sin cortes; los relojes con tramos (cortes, reanudaciones)
 * llegan desde el panel de análisis.
 */
export interface CamarasPartidoProps {
  api: ApiCaptura;
  partidoId: string;
  videos: VideoPartido[];
  onGuardado?: (videos: VideoPartido[]) => void;
  soloLectura?: boolean;
}

const CamarasPartido: React.FC<CamarasPartidoProps> = ({ api, partidoId, videos, onGuardado, soloLectura }) => {
  const [abierto, setAbierto] = useState(false);
  const [link, setLink] = useState('');
  const [etiqueta, setEtiqueta] = useState('');
  const [enPrincipal, setEnPrincipal] = useState('');
  const [enEsta, setEnEsta] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const guardar = async (lista: VideoPartido[]) => {
    setGuardando(true);
    setError(null);
    try {
      const r = await api.guardarVideos(partidoId, lista);
      onGuardado?.(r.videos);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar');
      return false;
    } finally {
      setGuardando(false);
    }
  };

  const agregar = async () => {
    const youtubeId = extraerYoutubeId(link);
    if (!youtubeId) return setError('No reconozco ese link de YouTube');
    if (videos.some((v) => v.youtubeId === youtubeId)) return setError('Ese video ya está en el partido');

    let tramos: VideoPartido['tramos'] = [];
    if (videos.length > 0) {
      const a = leerSegundos(enPrincipal);
      const b = leerSegundos(enEsta);
      if (a == null || b == null) return setError('Indicá el mismo momento en las dos cámaras (m:ss) para alinearlas');
      const d = camaraAPartido(videos[0], a) - b;
      tramos = [{ cam: [0, 86_400], d: Math.round(d * 10) / 10 }];
    }
    const nuevo: VideoPartido = {
      youtubeId,
      etiqueta: etiqueta.trim() || (videos.length ? `Cámara ${videos.length + 1}` : 'Cámara principal'),
      duracion: null,
      tramos,
    };
    if (await guardar([...videos, nuevo])) {
      setAbierto(false);
      setLink('');
      setEtiqueta('');
      setEnPrincipal('');
      setEnEsta('');
    }
    return undefined;
  };

  return (
    <div className="space-y-2 text-sm">
      <ul className="space-y-1">
        {videos.map((v, i) => (
          <li key={v._id ?? v.youtubeId} className="flex items-center gap-2 rounded border border-slate-200 px-2 py-1">
            <span className="font-semibold">{v.etiqueta || `Cámara ${i + 1}`}</span>
            <span className="truncate text-2xs text-muted">{v.youtubeId}</span>
            <span className="text-2xs text-muted">
              {i === 0 ? 'referencia' : v.tramos?.length === 1 ? `desfase ${formatearSegundos(v.tramos[0].d)}` : v.tramos?.length ? `${v.tramos.length} tramos` : 'sin alinear'}
            </span>
            {!soloLectura && i > 0 && (
              <button
                type="button"
                disabled={guardando}
                onClick={() => void guardar(videos.filter((_, k) => k !== i))}
                className="ml-auto text-2xs text-red-700 hover:underline"
              >
                Quitar
              </button>
            )}
          </li>
        ))}
        {videos.length === 0 && <li className="text-muted">El partido todavía no tiene video.</li>}
      </ul>

      {!soloLectura && !abierto && (
        <button type="button" onClick={() => setAbierto(true)} className="text-brand-700 hover:underline">
          + {videos.length ? 'Agregar otra cámara' : 'Agregar video'}
        </button>
      )}

      {abierto && (
        <div className="space-y-2 rounded-lg border border-slate-200 p-3">
          <label className="block">
            <span className="text-xs font-semibold">Link de YouTube</span>
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://youtu.be/…" className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold">Nombre</span>
            <input value={etiqueta} onChange={(e) => setEtiqueta(e.target.value)} placeholder={videos.length ? 'Cámara 2, Tribuna…' : 'Cámara principal'} className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1" />
          </label>
          {videos.length > 0 && (
            <fieldset>
              <legend className="text-xs font-semibold">Un mismo momento en las dos (p. ej. el silbato del set 1)</legend>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-1">
                  en {videos[0].etiqueta || 'la principal'}
                  <input value={enPrincipal} onChange={(e) => setEnPrincipal(e.target.value)} placeholder="3:12" className="w-20 rounded border border-slate-300 px-2 py-1 tabular-nums" />
                </label>
                <label className="flex items-center gap-1">
                  en esta
                  <input value={enEsta} onChange={(e) => setEnEsta(e.target.value)} placeholder="0:41" className="w-20 rounded border border-slate-300 px-2 py-1 tabular-nums" />
                </label>
              </div>
            </fieldset>
          )}
          {error && <p className="text-red-700" role="alert">{error}</p>}
          <div className="flex gap-2">
            <button type="button" disabled={guardando} onClick={() => void agregar()} className="rounded bg-brand-600 px-3 py-1.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
              Guardar
            </button>
            <button type="button" onClick={() => { setAbierto(false); setError(null); }} className="rounded px-3 py-1.5 hover:bg-slate-100">Cancelar</button>
          </div>
        </div>
      )}
      {!abierto && error && <p className="text-red-700" role="alert">{error}</p>}
    </div>
  );
};

export default CamarasPartido;
