import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ApiCaptura, Fetcher } from './api';
import CamarasPartido from './CamarasPartido';
import CapturaSet, { type EquipoCaptura, type JugadorCaptura } from './CapturaSet';
import ReproductorPartido, { type ReproductorPartidoHandle } from './ReproductorPartido';
import { extraerYoutubeId, type VideoPartido } from './reloj';

/**
 * Captura con video de un set OFICIAL (SetPartido), lista para montar en un modal: carga el
 * partido y su convocatoria (JugadorPartido) y arma reproductor + cámaras + captura.
 * La usan Manager y Organizaciones desde "Gestionar sets". Para el set de una planilla, cada app
 * arma lo suyo con `CapturaSet` (los jugadores salen de los presentes de la planilla).
 *
 * `obtenerTiempo` reemplaza al video como reloj (Overtime-Partido: el reloj en vivo).
 */
export interface CapturaSetOficialProps {
  api: ApiCaptura;
  fetcher: Fetcher;
  partidoId: string;
  setPartidoId: string;
  soloLectura?: boolean;
  obtenerTiempo?: () => number | null;
  /** 'en_vivo' cuando el reloj es el del partido en curso. */
  origen?: 'manual' | 'en_vivo';
  onCambio?: () => void;
}

type Ref = string | { _id: string; nombre?: string; alias?: string; apellido?: string } | null | undefined;
const idDe = (r: Ref) => (r && typeof r === 'object' ? r._id : r ?? '');

interface PartidoMin {
  equipoLocal?: Ref;
  equipoVisitante?: Ref;
  videos?: VideoPartido[];
  videoUrl?: string;
}
interface JugadorPartidoMin {
  jugador?: Ref;
  equipo?: Ref;
  numero?: number;
  rol?: string;
}

const CapturaSetOficial: React.FC<CapturaSetOficialProps> = ({
  api, fetcher, partidoId, setPartidoId, soloLectura, obtenerTiempo, origen, onCambio,
}) => {
  const [partido, setPartido] = useState<PartidoMin | null>(null);
  const [convocados, setConvocados] = useState<JugadorPartidoMin[]>([]);
  const [videos, setVideos] = useState<VideoPartido[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [verCamaras, setVerCamaras] = useState(false);
  const reproductor = useRef<ReproductorPartidoHandle>(null);

  useEffect(() => {
    let vivo = true;
    Promise.all([
      fetcher<PartidoMin>(`/partidos/${partidoId}`),
      fetcher<JugadorPartidoMin[] | { items: JugadorPartidoMin[] }>(`/jugador-partido?partido=${partidoId}`),
    ])
      .then(([p, jp]) => {
        if (!vivo) return;
        setPartido(p);
        setConvocados(Array.isArray(jp) ? jp : jp.items ?? []);
        const id = extraerYoutubeId(p.videoUrl);
        setVideos(p.videos?.length ? p.videos : id ? [{ youtubeId: id, etiqueta: 'Cámara principal', tramos: [] }] : []);
      })
      .catch((e) => vivo && setError(e instanceof Error ? e.message : 'No se pudo cargar el partido'));
    return () => {
      vivo = false;
    };
  }, [fetcher, partidoId]);

  const equipos: EquipoCaptura[] = useMemo(() => {
    if (!partido) return [];
    return [partido.equipoLocal, partido.equipoVisitante]
      .filter(Boolean)
      .map((e, i) => ({ id: idDe(e), nombre: (typeof e === 'object' && e?.nombre) || (i === 0 ? 'Local' : 'Visitante') }));
  }, [partido]);

  const jugadores: JugadorCaptura[] = useMemo(
    () =>
      convocados
        .filter((c) => c.rol !== 'entrenador' && idDe(c.jugador))
        .map((c) => {
          const j = c.jugador;
          const nombre = typeof j === 'object' && j ? j.alias || [j.nombre, j.apellido].filter(Boolean).join(' ') : '';
          return { id: idDe(j), nombre: nombre || 'Jugador', numero: c.numero ?? null, equipo: idDe(c.equipo) };
        }),
    [convocados],
  );

  if (error) return <p className="text-sm text-red-700">{error}</p>;
  if (!partido) return <p className="text-sm text-muted">Cargando partido…</p>;

  // En vivo (Overtime-Partido) no se muestra video: el tiempo sale del reloj en vivo del partido.
  const enVivo = origen === 'en_vivo';
  const sinVideo = enVivo || Boolean(obtenerTiempo);
  const reloj = obtenerTiempo ?? (!enVivo && videos.length ? () => reproductor.current?.segundoPartido() ?? null : undefined);

  return (
    <div className="space-y-3">
      {!sinVideo && videos.length > 0 && <ReproductorPartido ref={reproductor} videos={videos} />}
      {!sinVideo && videos.length === 0 && (
        <p className="rounded-lg bg-slate-50 p-3 text-sm text-muted">El partido no tiene video: los tiempos se toman con el cronómetro del set.</p>
      )}
      {!sinVideo && (
        <div>
          <button type="button" onClick={() => setVerCamaras((v) => !v)} className="text-sm text-brand-700 hover:underline">
            {verCamaras ? 'Ocultar cámaras' : `Cámaras del partido (${videos.length})`}
          </button>
          {verCamaras && (
            <div className="mt-2">
              <CamarasPartido api={api} partidoId={partidoId} videos={videos} onGuardado={setVideos} soloLectura={soloLectura} />
            </div>
          )}
        </div>
      )}
      {jugadores.length === 0 && (
        <p className="text-sm text-amber-700">El partido no tiene jugadores convocados: cargá la convocatoria para poder marcar outs.</p>
      )}
      <CapturaSet
        api={api}
        refSet={{ setPartido: setPartidoId }}
        equipos={equipos}
        jugadores={jugadores}
        obtenerTiempo={reloj}
        irA={sinVideo ? undefined : (s) => reproductor.current?.irA(s)}
        soloLectura={soloLectura}
        origen={origen}
        onCambio={() => onCambio?.()}
      />
    </div>
  );
};

export default CapturaSetOficial;
