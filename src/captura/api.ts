import type { Evento, MotivoOut, TipoEvento } from './supervivencia';
import type { VideoPartido } from './reloj';

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

export interface EstadoSet {
  set: { _id: string; numeroSet: number; tiempo: TiempoSet | null };
  alineacion: { jugador: string; equipo: string }[];
  alineacionCargada: boolean;
  eventos: (Evento & { _id: string })[];
  sync?: { sincronizado: boolean; jugadores?: number };
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
    guardarTiempo: (ref: RefSet, tiempo: TiempoSet | null) =>
      fetcher<EstadoSet>('/eventos-set/tiempo', json('PUT', { ...ref, tiempo })),
    guardarVideos: (partidoId: string, videos: VideoPartido[]) =>
      fetcher<{ videos: VideoPartido[]; videoUrl: string }>(`/eventos-set/videos/${partidoId}`, json('PUT', { videos })),
  };
}

export type ApiCaptura = ReturnType<typeof crearApiCaptura>;
