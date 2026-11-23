import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ApiCaptura, EstadoSet, RefSet } from './api';
import { formatearSegundos, leerSegundos } from './reloj';
import {
  estaVivo,
  lineaDeTiempo,
  MOTIVOS,
  sugerirReingreso,
  vivosPorLado,
  type FilaVivo,
  type MotivoOut,
} from './supervivencia';

/**
 * Captura de un set "como en el panel de análisis": cuándo empieza y termina, quiénes arrancan,
 * y cada out (motivo, quién lo sacó) o reingreso, con la línea de vivos del set.
 *
 * El tiempo sale del video (`obtenerTiempo`, normalmente `ReproductorPartido`) o, sin video, de
 * un cronómetro propio del set. Igual para un set oficial o el de una planilla (`refSet`).
 */

export interface EquipoCaptura {
  id: string;
  nombre: string;
}
export interface JugadorCaptura {
  id: string;
  nombre: string;
  numero?: number | null;
  equipo: string;
}

export interface CapturaSetProps {
  api: ApiCaptura;
  refSet: RefSet;
  equipos: EquipoCaptura[];
  /** Candidatos (presentes del partido o de la planilla), de los dos equipos. */
  jugadores: JugadorCaptura[];
  /** Segundo de partido actual del video. Sin esto, se usa un cronómetro. */
  obtenerTiempo?: () => number | null;
  /** Llevar el video a un segundo de partido (al tocar una marca). */
  irA?: (segPartido: number) => void;
  soloLectura?: boolean;
  /** De dónde salen los tiempos: 'manual' (video o cronómetro) o 'en_vivo' (Overtime-Partido). */
  origen?: 'manual' | 'en_vivo';
  /** Se llama después de cada cambio guardado (p. ej. para refrescar estadísticas). */
  onCambio?: (estado: EstadoSet) => void;
  className?: string;
}

const COLORES = ['bg-sky-500', 'bg-amber-500'];
const TEXTO = ['text-sky-700', 'text-amber-700'];

const etiquetaJugador = (j?: JugadorCaptura) => (j ? `${j.numero != null ? `#${j.numero} ` : ''}${j.nombre}` : '¿?');

function useCronometro() {
  const [base, setBase] = useState(0);
  const [desde, setDesde] = useState<number | null>(null);
  const [, forzar] = useState(0);
  useEffect(() => {
    if (desde == null) return undefined;
    const t = window.setInterval(() => forzar((x) => x + 1), 500);
    return () => window.clearInterval(t);
  }, [desde]);
  const valor = () => base + (desde != null ? (Date.now() - desde) / 1000 : 0);
  return {
    corriendo: desde != null,
    valor,
    alternar: () => {
      if (desde != null) {
        setBase(valor());
        setDesde(null);
      } else setDesde(Date.now());
    },
    fijar: (s: number) => {
      setBase(s);
      if (desde != null) setDesde(Date.now());
    },
  };
}

const CapturaSet: React.FC<CapturaSetProps> = ({
  api, refSet, equipos, jugadores, obtenerTiempo, irA, soloLectura, origen = 'manual', onCambio, className = '',
}) => {
  const [estado, setEstado] = useState<EstadoSet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [pendiente, setPendiente] = useState<{ jugador: string; equipo: string; motivo: MotivoOut; t: number } | null>(null);
  const [editandoAlineacion, setEditandoAlineacion] = useState(false);
  const [borradorAlineacion, setBorradorAlineacion] = useState<Set<string>>(new Set());
  const crono = useCronometro();
  const claveSet = refSet.setPartido ?? refSet.planillaSet;

  const onCambioRef = useRef(onCambio);
  onCambioRef.current = onCambio;

  const aplicar = useCallback((e: EstadoSet) => {
    setEstado(e);
    setError(null);
    onCambioRef.current?.(e);
  }, []);

  const correr = useCallback(async (fn: () => Promise<EstadoSet>) => {
    setGuardando(true);
    try {
      aplicar(await fn());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar');
    } finally {
      setGuardando(false);
    }
  }, [aplicar]);

  useEffect(() => {
    let vivo = true;
    setEstado(null);
    api.leer(refSet)
      .then((e) => vivo && setEstado(e))
      .catch((e) => vivo && setError(e instanceof Error ? e.message : 'No se pudo cargar el set'));
    return () => {
      vivo = false;
    };
    // refSet es un objeto nuevo en cada render del padre: la identidad del set es la clave.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, claveSet]);

  const porId = useMemo(() => new Map(jugadores.map((j) => [j.id, j])), [jugadores]);
  const tiempo = estado?.set.tiempo ?? null;
  const inicio = tiempo?.desde ?? 0;

  /** Segundo "ahora": el del video, o el cronómetro sumado al inicio del set. */
  const ahora = (): number => {
    const v = obtenerTiempo?.();
    if (v != null) return Math.round(v * 10) / 10;
    return Math.round((inicio + crono.valor()) * 10) / 10;
  };

  const alineados = useMemo(
    () => (estado?.alineacion ?? []).map((a) => ({ id: a.jugador, lado: a.equipo })),
    [estado],
  );
  const filas: FilaVivo[] = useMemo(
    () => (estado ? lineaDeTiempo(alineados, estado.eventos, inicio) : []),
    [estado, alineados, inicio],
  );
  const tRef = obtenerTiempo ? (obtenerTiempo() ?? inicio) : inicio + crono.valor();
  const vivos = vivosPorLado(filas, tRef);

  // --- acciones -------------------------------------------------------------------------------
  const marcarTiempo = (cual: 'desde' | 'hasta', valor = ahora()) => {
    const nuevo = { desde: tiempo?.desde ?? valor, hasta: tiempo?.hasta ?? valor + 1, origen, confirmado: true };
    nuevo[cual] = valor;
    if (nuevo.hasta <= nuevo.desde) {
      if (cual === 'desde') nuevo.hasta = nuevo.desde + 1;
      else return setError('El fin tiene que ser después del inicio');
    }
    return correr(() => api.guardarTiempo(refSet, nuevo));
  };

  const marcarOut = (jugador: string, equipo: string, motivo: MotivoOut) => {
    const t = ahora();
    if (motivo === 'hit' || motivo === 'catch') {
      setPendiente({ jugador, equipo, motivo, t });
      return;
    }
    void correr(() => api.agregarEvento(refSet, { t, tipo: 'out', jugador, equipo, motivo, origen }));
  };

  const confirmarPor = (por: string | null) => {
    if (!pendiente) return;
    const { jugador, equipo, motivo, t } = pendiente;
    setPendiente(null);
    void correr(() => api.agregarEvento(refSet, { t, tipo: 'out', jugador, equipo, motivo, por, origen }));
  };

  const reingreso = (jugador: string, equipo: string) =>
    correr(() => api.agregarEvento(refSet, { t: ahora(), tipo: 'reingreso', jugador, equipo, origen }));

  const abrirAlineacion = () => {
    setBorradorAlineacion(new Set(estado?.alineacionCargada ? estado.alineacion.map((a) => a.jugador) : []));
    setEditandoAlineacion(true);
  };
  const guardarAlineacion = () => {
    const lista = jugadores.filter((j) => borradorAlineacion.has(j.id)).map((j) => ({ jugador: j.id, equipo: j.equipo }));
    setEditandoAlineacion(false);
    void correr(() => api.guardarAlineacion(refSet, lista));
  };

  // --- render ---------------------------------------------------------------------------------
  if (error && !estado) return <p className={`text-sm text-red-700 ${className}`}>{error}</p>;
  if (!estado) return <p className={`text-sm text-muted ${className}`}>Cargando set…</p>;

  const fin = tiempo?.hasta ?? Math.max(inicio + 60, ...estado.eventos.map((e) => e.t + 5), tRef);
  const dur = Math.max(1, fin - inicio);
  const pct = (t: number) => `${Math.max(0, Math.min(100, ((t - inicio) / dur) * 100))}%`;
  const idxEquipo = (id: string) => Math.max(0, equipos.findIndex((e) => e.id === id));
  const ultimoCatch = [...estado.eventos].reverse().find((e) => e.tipo === 'out' && e.motivo === 'catch');

  return (
    <div className={`space-y-4 text-sm ${className}`}>
      {/* Tiempo del set */}
      <section className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 p-3">
        <span className="font-semibold">Set {estado.set.numeroSet}</span>
        <span className="tabular-nums text-muted">
          {tiempo ? `${formatearSegundos(tiempo.desde)} → ${formatearSegundos(tiempo.hasta)} · dura ${formatearSegundos(tiempo.hasta - tiempo.desde)}` : 'sin tiempo marcado'}
        </span>
        {!soloLectura && (
          <span className="ml-auto flex flex-wrap items-center gap-2">
            {!obtenerTiempo && (
              <button type="button" onClick={crono.alternar} className="rounded bg-slate-100 px-2 py-1 font-semibold hover:bg-slate-200">
                {crono.corriendo ? '⏸' : '▶'} {formatearSegundos(crono.valor())}
              </button>
            )}
            <button type="button" disabled={guardando} onClick={() => void marcarTiempo('desde')} className="rounded bg-slate-800 px-2 py-1 font-semibold text-white hover:bg-slate-700 disabled:opacity-50">
              Empieza acá
            </button>
            <button type="button" disabled={guardando} onClick={() => void marcarTiempo('hasta')} className="rounded bg-slate-800 px-2 py-1 font-semibold text-white hover:bg-slate-700 disabled:opacity-50">
              Termina acá
            </button>
            <button
              type="button"
              className="rounded px-2 py-1 text-brand-700 hover:underline"
              onClick={() => {
                const d = leerSegundos(window.prompt('Duración del set (m:ss)', tiempo ? formatearSegundos(tiempo.hasta - tiempo.desde) : '') ?? '');
                if (d != null && d > 0) void correr(() => api.guardarTiempo(refSet, { desde: inicio, hasta: inicio + d, origen, confirmado: true }));
              }}
            >
              Cargar duración
            </button>
          </span>
        )}
      </section>

      {error && <p className="text-red-700" role="alert">{error}</p>}

      {/* Alineación */}
      {(editandoAlineacion || (!estado.alineacionCargada && !soloLectura)) ? (
        <section className="rounded-lg border border-slate-200 p-3">
          <p className="mb-2 font-semibold">¿Quiénes arrancan el set?</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {equipos.map((eq, i) => (
              <div key={eq.id}>
                <p className={`mb-1 text-xs font-semibold uppercase ${TEXTO[i]}`}>{eq.nombre}</p>
                <div className="flex flex-wrap gap-1">
                  {jugadores.filter((j) => j.equipo === eq.id).map((j) => {
                    const sel = borradorAlineacion.has(j.id);
                    return (
                      <button
                        key={j.id}
                        type="button"
                        aria-pressed={sel}
                        onClick={() => setBorradorAlineacion((prev) => {
                          const n = new Set(prev);
                          if (sel) n.delete(j.id);
                          else n.add(j.id);
                          return n;
                        })}
                        className={`rounded-full border px-2 py-0.5 ${sel ? 'border-transparent bg-slate-800 text-white' : 'border-slate-300 hover:bg-slate-50'}`}
                      >
                        {etiquetaJugador(j)}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1 text-2xs text-muted">
                  {jugadores.filter((j) => j.equipo === eq.id && borradorAlineacion.has(j.id)).length} elegidos
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={guardarAlineacion} disabled={guardando} className="rounded bg-brand-600 px-3 py-1.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
              Guardar alineación
            </button>
            {estado.alineacionCargada && (
              <button type="button" onClick={() => setEditandoAlineacion(false)} className="rounded px-3 py-1.5 hover:bg-slate-100">Cancelar</button>
            )}
          </div>
          {!estado.alineacionCargada && (
            <p className="mt-2 text-2xs text-muted">Mientras no la cargues, se usan todos los presentes (la cuenta de vivos puede no dar).</p>
          )}
        </section>
      ) : null}

      {/* Marcar: un panel por equipo */}
      <section className="grid gap-3 sm:grid-cols-2">
        {equipos.map((eq, i) => {
          const propias = filas.filter((f) => f.lado === eq.id);
          const sugerido = ultimoCatch && ultimoCatch.equipo !== eq.id ? sugerirReingreso(filas, eq.id, ultimoCatch.t) : null;
          return (
            <div key={eq.id} className="rounded-lg border border-slate-200 p-3">
              <p className="mb-2 flex items-baseline justify-between">
                <span className={`font-semibold ${TEXTO[i]}`}>{eq.nombre}</span>
                <span className="tabular-nums text-lg font-bold">{vivos[eq.id] ?? 0} <span className="text-2xs font-normal text-muted">vivos</span></span>
              </p>
              <ul className="space-y-1">
                {propias.map((f) => {
                  const j = porId.get(f.id);
                  const vivo = estaVivo(f, tRef);
                  return (
                    <li key={f.id} className={`flex items-center gap-2 rounded px-1 py-0.5 ${vivo ? '' : 'opacity-60'}`}>
                      <span className={`h-2 w-2 shrink-0 rounded-full ${vivo ? COLORES[i] : 'bg-slate-300'}`} aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate">{etiquetaJugador(j)}{f.entra ? ' (entró)' : ''}</span>
                      {!soloLectura && vivo && MOTIVOS.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          disabled={guardando}
                          onClick={() => marcarOut(f.id, eq.id, m.id)}
                          title={`Out por ${m.label}`}
                          aria-label={`${etiquetaJugador(j)}: out por ${m.label}`}
                          className="w-7 rounded bg-red-50 py-0.5 text-2xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
                        >
                          {m.atajo}
                        </button>
                      ))}
                      {!soloLectura && !vivo && (
                        <button
                          type="button"
                          disabled={guardando}
                          onClick={() => void reingreso(f.id, eq.id)}
                          className={`rounded px-2 py-0.5 text-2xs font-semibold ${sugerido === f.id ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'}`}
                          title={sugerido === f.id ? 'Le toca volver por el último catch' : 'Vuelve a la cancha'}
                        >
                          Vuelve
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </section>

      {!soloLectura && estado.alineacionCargada && (
        <button type="button" onClick={abrirAlineacion} className="text-xs text-brand-700 hover:underline">Editar alineación</button>
      )}

      {/* ¿Quién lo sacó? */}
      {pendiente && (
        <section className="rounded-lg border-2 border-red-300 bg-red-50 p-3" role="dialog" aria-label="Quién lo sacó">
          <p className="mb-2 font-semibold">
            {pendiente.motivo === 'hit' ? '¿Quién tiró?' : '¿Quién atajó?'}{' '}
            <span className="font-normal text-muted">({etiquetaJugador(porId.get(pendiente.jugador))} · {formatearSegundos(pendiente.t)})</span>
          </p>
          <div className="flex flex-wrap gap-1">
            {filas.filter((f) => f.lado !== pendiente.equipo && estaVivo(f, pendiente.t)).map((f) => (
              <button key={f.id} type="button" onClick={() => confirmarPor(f.id)} className="rounded-full border border-slate-300 bg-white px-2 py-0.5 hover:bg-slate-50">
                {etiquetaJugador(porId.get(f.id))}
              </button>
            ))}
            <button type="button" onClick={() => confirmarPor(null)} className="rounded-full px-2 py-0.5 text-muted hover:bg-white">No sé</button>
            <button type="button" onClick={() => setPendiente(null)} className="rounded-full px-2 py-0.5 text-red-700 hover:bg-white">Cancelar</button>
          </div>
        </section>
      )}

      {/* Línea de tiempo de vivos */}
      <section className="rounded-lg border border-slate-200 p-3">
        <p className="mb-2 font-semibold">Línea de tiempo</p>
        <div className="space-y-1">
          {filas.map((f) => {
            const i = idxEquipo(f.lado);
            const marcas = estado.eventos.filter((e) => e.jugador === f.id && e.tipo === 'out');
            return (
              <div key={f.id} className="flex items-center gap-2">
                <span className={`w-28 shrink-0 truncate text-2xs ${TEXTO[i]}`}>{etiquetaJugador(porId.get(f.id))}</span>
                <div className="relative h-3 flex-1 rounded bg-slate-100">
                  {f.tramos.map(([a, b], k) => (
                    <i key={k} className={`absolute inset-y-0 rounded ${COLORES[i]}`} style={{ left: pct(a), width: `calc(${pct(b ?? fin)} - ${pct(a)})` }} />
                  ))}
                  {marcas.map((m) => (
                    <button
                      key={m._id}
                      type="button"
                      onClick={() => irA?.(m.t)}
                      title={`${formatearSegundos(m.t)} · out por ${m.motivo}`}
                      className="absolute -top-0.5 h-4 w-1.5 -translate-x-1/2 rounded-sm bg-red-600"
                      style={{ left: pct(m.t) }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {estado.eventos.length > 0 && (
          <ol className="mt-3 flex flex-wrap gap-1">
            {estado.eventos.map((e) => (
              <li key={e._id} className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-2xs">
                <button type="button" onClick={() => irA?.(e.t)} className="tabular-nums hover:underline">{formatearSegundos(e.t)}</button>
                <span>
                  {etiquetaJugador(porId.get(e.jugador))}{' '}
                  {e.tipo === 'out' ? `· out ${e.motivo}${e.por ? ` · ${etiquetaJugador(porId.get(e.por))}` : ''}` : `· ${e.tipo}`}
                </span>
                {!soloLectura && (
                  <button type="button" aria-label="Borrar marca" onClick={() => void correr(() => api.borrarEvento(e._id))} className="text-muted hover:text-red-700">✕</button>
                )}
              </li>
            ))}
          </ol>
        )}
        <GanadorSugerido
          estado={estado}
          equipos={equipos}
          soloLectura={soloLectura}
          guardando={guardando}
          onAplicar={(g) => void correr(() => api.guardarGanador(refSet, g))}
        />
        {estado.sync?.sincronizado && (
          <p className="mt-2 text-2xs text-muted">Estadísticas del set actualizadas desde las marcas.</p>
        )}
      </section>
    </div>
  );
};

/**
 * El ganador que dicen las marcas, contra el cargado. Se aplica con un clic y nunca solo: las
 * marcas pueden estar incompletas, y el ganador de un set mueve el marcador y la tabla.
 */
const GanadorSugerido: React.FC<{
  estado: EstadoSet;
  equipos: EquipoCaptura[];
  soloLectura?: boolean;
  guardando: boolean;
  onAplicar: (g: 'local' | 'visitante') => void;
}> = ({ estado, equipos, soloLectura, guardando, onAplicar }) => {
  const s = estado.ganadorSugerido;
  if (!s?.ganador) return null;
  const nombre = equipos.find((e) => e.id === s.equipo)?.nombre ?? (s.ganador === 'local' ? 'Local' : 'Visitante');
  const cargado = estado.set.ganadorSet ?? 'pendiente';
  const coincide = cargado === s.ganador;
  const por = s.motivo === 'eliminacion' ? 'dejó al rival sin jugadores' : `terminó con más vivos (${s.vivos.local} a ${s.vivos.visitante})`;
  return (
    <div className={`mt-3 rounded-lg px-3 py-2 text-sm ${coincide ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>
      {coincide ? (
        <>Ganó <b>{nombre}</b>, como dicen las marcas.</>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <span>
            Según las marcas ganó <b>{nombre}</b>: {por}.
            {cargado !== 'pendiente' && <> Hoy el set dice otra cosa.</>}
          </span>
          {!soloLectura && (
            <button
              type="button"
              disabled={guardando}
              onClick={() => onAplicar(s.ganador as 'local' | 'visitante')}
              className="rounded-md bg-amber-600 px-2 py-1 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
            >
              Marcar ganador a {nombre}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CapturaSet;
