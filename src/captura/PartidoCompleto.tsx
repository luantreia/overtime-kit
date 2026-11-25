import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ApiCaptura, GanadorSet, RefSet, TiempoSet } from './api';
import CamarasPartido from './CamarasPartido';
import ReproductorPartido, { type ReproductorPartidoHandle } from './ReproductorPartido';
import { formatearSegundos, leerSegundos, type VideoPartido } from './reloj';

/**
 * El partido entero sobre el video, como la pestaña Partido del panel de análisis: una línea de
 * tiempo con todos los sets, y para cada uno cuándo empieza, cuándo termina y quién lo ganó.
 * Es el primer paso; los jugadores y las marcas de cada set van después, set por set
 * (`CapturaSet`).
 *
 * No sabe de dónde salen los sets: la app le pasa la lista y cómo crear uno (en una planilla es
 * POST /planillas-equipo/:id/sets; en un partido oficial, /set-partido). Tiempo y ganador se
 * guardan por /api/eventos-set, igual para los dos.
 */

export interface SetDelPartido {
  id: string;
  numeroSet: number;
  ganadorSet: GanadorSet;
  tiempo?: TiempoSet | null;
}

export interface PartidoCompletoProps {
  api: ApiCaptura;
  /** Cámaras con las que se mira el partido. Vacío = no hay video (no se puede marcar tiempo). */
  videos: VideoPartido[];
  /** Dónde se guardan las cámaras si se agregan desde acá. Uno de los dos. */
  destinoCamaras: { planillaId: string } | { partidoId: string };
  onVideos?: (videos: VideoPartido[]) => void;
  equipos: { local: { id: string; nombre: string }; visitante: { id: string; nombre: string } };
  sets: SetDelPartido[];
  /** El RefSet de un set de esta lista (planillaSet o setPartido). */
  refDe: (setId: string) => RefSet;
  /** Crea el set N y devuelve su id. */
  crearSet: (numeroSet: number) => Promise<string>;
  /** Después de cualquier cambio: la app recarga `sets`. */
  onCambio: () => void | Promise<void>;
  soloLectura?: boolean;
  className?: string;
}

const COLOR_GANADOR: Record<GanadorSet, string> = {
  local: 'bg-sky-500',
  visitante: 'bg-amber-500',
  empate: 'bg-slate-500',
  pendiente: 'bg-slate-300',
};

const PartidoCompleto: React.FC<PartidoCompletoProps> = ({
  api, videos, destinoCamaras, onVideos, equipos, sets, refDe, crearSet, onCambio, soloLectura, className = '',
}) => {
  const reproductor = useRef<ReproductorPartidoHandle>(null);
  const [ahora, setAhora] = useState(0);
  const [inicioPendiente, setInicioPendiente] = useState<number | null>(null);
  const [editando, setEditando] = useState<{ id: string; desde: string; hasta: string; error?: string } | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verCamaras, setVerCamaras] = useState(false);

  // El cursor sigue al video.
  useEffect(() => {
    if (!videos.length) return undefined;
    const t = window.setInterval(() => setAhora(reproductor.current?.segundoPartido() ?? 0), 500);
    return () => window.clearInterval(t);
  }, [videos.length]);

  const ordenados = useMemo(() => [...sets].sort((a, b) => a.numeroSet - b.numeroSet), [sets]);
  const siguiente = (ordenados[ordenados.length - 1]?.numeroSet ?? 0) + 1;
  const segundo = () => Math.round((reproductor.current?.segundoPartido() ?? 0) * 10) / 10;

  // Largo de la línea: el video más largo conocido o, si no, hasta el último set marcado.
  const largo = Math.max(
    60,
    ...videos.map((v) => v.duracion ?? 0),
    ...ordenados.map((s) => s.tiempo?.hasta ?? 0),
    ahora + 30,
    inicioPendiente ?? 0,
  );
  const pct = (t: number) => `${Math.max(0, Math.min(100, (t / largo) * 100))}%`;
  const nombre = (g: GanadorSet) =>
    g === 'local' ? equipos.local.nombre : g === 'visitante' ? equipos.visitante.nombre : g === 'empate' ? 'Empate' : 'Sin definir';

  const correr = async (fn: () => Promise<unknown>) => {
    setGuardando(true);
    setError(null);
    try {
      await fn();
      await onCambio();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar');
    } finally {
      setGuardando(false);
    }
  };

  const guardarTiempo = (id: string, desde: number, hasta: number) =>
    api.guardarTiempo(refDe(id), { desde, hasta, origen: 'manual', confirmado: true });

  const terminarAca = () => {
    if (inicioPendiente == null) return;
    const fin = segundo();
    if (fin <= inicioPendiente) {
      setError('El fin tiene que ser después del inicio: avanzá el video.');
      return;
    }
    const desde = inicioPendiente;
    setInicioPendiente(null);
    void correr(async () => {
      const id = await crearSet(siguiente);
      await guardarTiempo(id, desde, fin);
    });
  };

  const marcarExtremo = (s: SetDelPartido, cual: 'desde' | 'hasta') => {
    const t = segundo();
    const desde = cual === 'desde' ? t : s.tiempo?.desde ?? t;
    const hasta = cual === 'hasta' ? t : s.tiempo?.hasta ?? t + 1;
    if (hasta <= desde) {
      setError(`El fin del set ${s.numeroSet} tiene que ser después del inicio.`);
      return;
    }
    void correr(() => guardarTiempo(s.id, desde, hasta));
  };

  const guardarEdicion = () => {
    if (!editando) return;
    const desde = leerSegundos(editando.desde);
    const hasta = leerSegundos(editando.hasta);
    if (desde == null || hasta == null || hasta <= desde) {
      setEditando({ ...editando, error: 'Poné inicio y fin en m:ss, con el fin después del inicio.' });
      return;
    }
    const id = editando.id;
    setEditando(null);
    void correr(() => guardarTiempo(id, desde, hasta));
  };

  const conTiempo = ordenados.filter((s) => s.tiempo);
  const totalJugado = conTiempo.reduce((acc, s) => acc + ((s.tiempo?.hasta ?? 0) - (s.tiempo?.desde ?? 0)), 0);
  const ganados = (g: GanadorSet) => ordenados.filter((s) => s.ganadorSet === g).length;

  return (
    <div className={`space-y-4 text-sm ${className}`}>
      {videos.length > 0 ? (
        <ReproductorPartido ref={reproductor} videos={videos} />
      ) : (
        <p className="rounded-lg bg-slate-50 p-3 text-muted">
          Este partido no tiene video. Agregá uno en «Cámaras» para marcar dónde está cada set; sin video
          igual podés cargar los sets y sus ganadores.
        </p>
      )}

      <div>
        <button type="button" onClick={() => setVerCamaras((v) => !v)} className="text-brand-700 hover:underline">
          {verCamaras ? 'Ocultar cámaras' : `Cámaras (${videos.length})`}
        </button>
        {verCamaras && (
          <div className="mt-2">
            <CamarasPartido
              api={api}
              {...destinoCamaras}
              videos={videos}
              onGuardado={(v) => onVideos?.(v)}
              soloLectura={soloLectura}
            />
          </div>
        )}
      </div>

      {/* Línea de tiempo del partido */}
      <section aria-label="Línea de tiempo del partido" className="rounded-lg border border-slate-200 p-3">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-semibold">
            {equipos.local.nombre} {ganados('local')} – {ganados('visitante')} {equipos.visitante.nombre}
          </p>
          <p className="tabular-nums text-muted">
            {ordenados.length} set{ordenados.length === 1 ? '' : 's'} · jugado {formatearSegundos(totalJugado)}
          </p>
        </div>
        <div className="relative h-8 overflow-hidden rounded bg-slate-100">
          {conTiempo.map((s) => (
            <button
              key={s.id}
              type="button"
              title={`Set ${s.numeroSet}: ${formatearSegundos(s.tiempo!.desde)} → ${formatearSegundos(s.tiempo!.hasta)} · ${nombre(s.ganadorSet)}`}
              aria-label={`Ir al set ${s.numeroSet}`}
              onClick={() => reproductor.current?.irA(s.tiempo!.desde)}
              className={`absolute top-0 h-full ${COLOR_GANADOR[s.ganadorSet]} text-2xs font-bold text-white hover:opacity-80`}
              style={{ left: pct(s.tiempo!.desde), width: pct(s.tiempo!.hasta - s.tiempo!.desde) }}
            >
              {s.numeroSet}
            </button>
          ))}
          {inicioPendiente != null && (
            <div
              className="absolute top-0 h-full bg-brand-300/70"
              style={{ left: pct(inicioPendiente), width: pct(Math.max(0, ahora - inicioPendiente)) }}
            />
          )}
          {videos.length > 0 && <div className="absolute top-0 h-full w-0.5 bg-red-600" style={{ left: pct(ahora) }} />}
        </div>
        <div className="mt-1 flex justify-between text-2xs tabular-nums text-muted">
          <span>0:00</span>
          <span>{formatearSegundos(ahora)}</span>
          <span>{formatearSegundos(largo)}</span>
        </div>

        {!soloLectura && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {videos.length > 0 && inicioPendiente == null && (
              <button
                type="button"
                disabled={guardando}
                onClick={() => setInicioPendiente(segundo())}
                className="rounded bg-slate-800 px-3 py-1.5 font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
              >
                Empieza el set {siguiente} acá
              </button>
            )}
            {inicioPendiente != null && (
              <>
                <span className="tabular-nums text-muted">Set {siguiente} desde {formatearSegundos(inicioPendiente)}…</span>
                <button
                  type="button"
                  disabled={guardando}
                  onClick={terminarAca}
                  className="rounded bg-slate-800 px-3 py-1.5 font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                >
                  Termina acá
                </button>
                <button type="button" onClick={() => setInicioPendiente(null)} className="px-2 py-1 text-muted hover:underline">
                  Cancelar
                </button>
              </>
            )}
            <button
              type="button"
              disabled={guardando}
              onClick={() => void correr(() => crearSet(siguiente))}
              className="rounded px-2 py-1.5 text-brand-700 hover:underline disabled:opacity-50"
            >
              + Set {siguiente} sin tiempo
            </button>
          </div>
        )}
        {error && <p role="alert" className="mt-2 text-red-700">{error}</p>}
      </section>

      {/* Un renglón por set */}
      {ordenados.length > 0 && (
        <ol className="divide-y divide-slate-100 rounded-lg border border-slate-200">
          {ordenados.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2">
              <span className="w-12 font-semibold">Set {s.numeroSet}</span>

              {editando?.id === s.id ? (
                <form
                  className="flex flex-wrap items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    guardarEdicion();
                  }}
                  onKeyDown={(e) => e.key === 'Escape' && setEditando(null)}
                >
                  <label className="sr-only" htmlFor={`pc-desde-${s.id}`}>Inicio del set {s.numeroSet}</label>
                  <input
                    id={`pc-desde-${s.id}`}
                    autoFocus
                    value={editando.desde}
                    onChange={(e) => setEditando({ ...editando, desde: e.target.value, error: undefined })}
                    className="w-16 rounded border border-slate-300 px-1.5 py-0.5 tabular-nums"
                  />
                  <span aria-hidden>→</span>
                  <label className="sr-only" htmlFor={`pc-hasta-${s.id}`}>Fin del set {s.numeroSet}</label>
                  <input
                    id={`pc-hasta-${s.id}`}
                    value={editando.hasta}
                    onChange={(e) => setEditando({ ...editando, hasta: e.target.value, error: undefined })}
                    className="w-16 rounded border border-slate-300 px-1.5 py-0.5 tabular-nums"
                  />
                  <button type="submit" className="rounded bg-brand-600 px-2 py-0.5 font-semibold text-white">Guardar</button>
                  <button type="button" onClick={() => setEditando(null)} className="text-muted hover:underline">Cancelar</button>
                  {editando.error && <span role="alert" className="w-full text-xs text-red-700">{editando.error}</span>}
                </form>
              ) : (
                <span className="flex flex-wrap items-center gap-2 tabular-nums">
                  {s.tiempo ? (
                    <button type="button" onClick={() => reproductor.current?.irA(s.tiempo!.desde)} className="hover:underline">
                      {formatearSegundos(s.tiempo.desde)} → {formatearSegundos(s.tiempo.hasta)}{' '}
                      <span className="text-muted">({formatearSegundos(s.tiempo.hasta - s.tiempo.desde)})</span>
                    </button>
                  ) : (
                    <span className="text-muted">sin tiempo</span>
                  )}
                  {!soloLectura && videos.length > 0 && (
                    <>
                      <button type="button" disabled={guardando} onClick={() => marcarExtremo(s, 'desde')} className="text-2xs text-brand-700 hover:underline">
                        inicio = ahora
                      </button>
                      <button type="button" disabled={guardando} onClick={() => marcarExtremo(s, 'hasta')} className="text-2xs text-brand-700 hover:underline">
                        fin = ahora
                      </button>
                    </>
                  )}
                  {!soloLectura && (
                    <button
                      type="button"
                      onClick={() =>
                        setEditando({
                          id: s.id,
                          desde: s.tiempo ? formatearSegundos(s.tiempo.desde) : '',
                          hasta: s.tiempo ? formatearSegundos(s.tiempo.hasta) : '',
                        })
                      }
                      className="text-2xs text-brand-700 hover:underline"
                    >
                      editar
                    </button>
                  )}
                </span>
              )}

              <span className="ml-auto flex flex-wrap items-center gap-1" role="group" aria-label={`Ganador del set ${s.numeroSet}`}>
                {(['local', 'visitante', 'empate'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    disabled={soloLectura || guardando}
                    aria-pressed={s.ganadorSet === g}
                    onClick={() => void correr(() => api.guardarGanador(refDe(s.id), s.ganadorSet === g ? 'pendiente' : g))}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 transition disabled:cursor-default ${
                      s.ganadorSet === g
                        ? `${COLOR_GANADOR[g]} text-white ring-transparent`
                        : 'bg-white text-slate-600 ring-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {nombre(g)}
                  </button>
                ))}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default PartidoCompleto;
