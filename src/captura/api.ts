import type { Evento, MotivoOut, TipoEvento } from './supervivencia';
import type { RegistroRelojJuego, RelojEnVivo, VentanaPartido, VideoPartido } from './reloj';

/**
 * Cliente de `/api/eventos-set`. El kit no sabe de URLs ni de tokens: cada app le pasa su
 * propio `fetch` autenticado (el `fetchWithAuth` que ya tiene), con rutas relativas a `/api`.
 */
export type Fetcher = <T>(ruta: string, init?: { method?: string; body?: string }) => Promise<T>;

/** El set sobre el que se captura: uno oficial o el de una planilla. */
export type RefSet = { setPartido: string; planillaSet?: undefined } | { planillaSet: string; setPartido?: undefined };

export interface TiempoSet {
  desde: number;
  hasta: number;
  origen?: 'manual' | 'cv' | 'en_vivo';
  confirmado?: boolean;
}

export type GanadorSet = 'local' | 'visitante' | 'empate' | 'pendiente';

export interface EstadoSet {
  set: { _id: string; numeroSet: number; tiempo: TiempoSet | null; ganadorSet?: GanadorSet };
  /** Ganador según las marcas: una sugerencia, no se aplica solo. Opcional en backends viejos. */
  ganadorSugerido?: {
    ganador: 'local' | 'visitante' | null;
    motivo: 'eliminacion' | 'mas_vivos' | null;
    vivos: { local: number; visitante: number };
    equipo: string | null;
  };
  alineacion: { jugador: string; equipo: string }[];
  alineacionCargada: boolean;
  eventos: (Evento & { _id: string })[];
  sync?: { sincronizado: boolean; jugadores?: number };
  /**
   * Reloj de las marcas en vivo del partido: segundo = segundo + (hora − ancla) / 1000.
   * null mientras no haya ninguna marca en vivo. Opcional en backends viejos.
   */
  relojEnVivo?: RelojEnVivo | null;
  /** Reloj de juego registrado en Overtime-Partido (vacío si no se usó). Opcional en backends viejos. */
  relojJuego?: RegistroRelojJuego[];
  /** Hora del servidor al responder (ms), para calcular el "ahora" en vivo igual que él. */
  ahoraServidor?: number;
}

export interface NuevoEvento {
  t: number;
  tipo: TipoEvento;
  jugador: string;
  equipo: string;
  motivo?: MotivoOut | null;
  por?: string | null;
  entra?: string | null;
  origen?: 'manual' | 'cv' | 'en_vivo';
}

const qs = (ref: RefSet) => (ref.setPartido ? `setPartido=${ref.setPartido}` : `planillaSet=${ref.planillaSet}`);
const json = (method: string, body: unknown) => ({ method, body: JSON.stringify(body) });

export function crearApiCaptura(fetcher: Fetcher) {
  return {
    leer: (ref: RefSet) => fetcher<EstadoSet>(`/eventos-set?${qs(ref)}`),
    agregarEvento: (ref: RefSet, e: NuevoEvento) => fetcher<EstadoSet>('/eventos-set', json('POST', { ...ref, ...e })),
    borrarEvento: (id: string) => fetcher<EstadoSet>(`/eventos-set/${id}`, { method: 'DELETE' }),
    guardarAlineacion: (ref: RefSet, alineacion: { jugador: string; equipo: string }[]) =>
      fetcher<EstadoSet>('/eventos-set/alineacion', json('PUT', { ...ref, alineacion })),
    /** `marcarAhora: false`: con origen 'en_vivo', guardar los segundos tal cual (no "ahora"). */
    guardarTiempo: (ref: RefSet, tiempo: TiempoSet | null, opciones?: { marcarAhora?: boolean }) =>
      fetcher<EstadoSet>('/eventos-set/tiempo', json('PUT', { ...ref, tiempo, ...(opciones ?? {}) })),
    /** "Esta marca en vivo está en este segundo del video": alinea todas las del partido. */
    alinearEnVivo: (eventoId: string, segundo: number) =>
      fetcher<EstadoSet>('/eventos-set/reloj-en-vivo', json('PUT', { eventoId, segundo })),
    /** Lo mismo, pero con un momento del reloj de juego (p. ej. el inicio del 1T). */
    alinearEnVivoConReloj: (setPartido: string, hora: string, segundo: number) =>
      fetcher<EstadoSet>('/eventos-set/reloj-en-vivo', json('PUT', { setPartido, hora, segundo })),
    /** Inicio y fin del partido marcados en diferido, en la planilla o en el partido. */
    guardarVentana: (destino: { planillaId: string } | { partidoId: string }, ventana: VentanaPartido | null) =>
      fetcher<{ ventana: VentanaPartido | null }>('/eventos-set/ventana', json('PUT', { ...destino, ventana })),
    guardarGanador: (ref: RefSet, ganadorSet: GanadorSet) =>
      fetcher<EstadoSet>('/eventos-set/ganador', json('PUT', { ...ref, ganadorSet })),
    guardarVideos: (partidoId: string, videos: VideoPartido[]) =>
      fetcher<{ videos: VideoPartido[]; videoUrl: string }>(`/eventos-set/videos/${partidoId}`, json('PUT', { videos })),
    /** Cámaras propias de una planilla: no tocan el partido; se suman al oficializar. */
    guardarVideosPlanilla: (planillaId: string, videos: VideoPartido[]) =>
      fetcher<{ videos: VideoPartido[]; videoUrl: string }>(`/eventos-set/videos-planilla/${planillaId}`, json('PUT', { videos })),
  };
}

export type ApiCaptura = ReturnType<typeof crearApiCaptura>;
