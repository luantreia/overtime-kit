import type { Evento, MotivoOut, TipoEvento } from './supervivencia';
import type { VideoPartido } from './reloj';
/**
 * Cliente de `/api/eventos-set`. El kit no sabe de URLs ni de tokens: cada app le pasa su
 * propio `fetch` autenticado (el `fetchWithAuth` que ya tiene), con rutas relativas a `/api`.
 */
export type Fetcher = <T>(ruta: string, init?: {
    method?: string;
    body?: string;
}) => Promise<T>;
/** El set sobre el que se captura: uno oficial o el de una planilla. */
export type RefSet = {
    setPartido: string;
    planillaSet?: undefined;
} | {
    planillaSet: string;
    setPartido?: undefined;
};
export interface TiempoSet {
    desde: number;
    hasta: number;
    origen?: 'manual' | 'cv' | 'en_vivo';
    confirmado?: boolean;
}
export interface EstadoSet {
    set: {
        _id: string;
        numeroSet: number;
        tiempo: TiempoSet | null;
    };
    alineacion: {
        jugador: string;
        equipo: string;
    }[];
    alineacionCargada: boolean;
    eventos: (Evento & {
        _id: string;
    })[];
    sync?: {
        sincronizado: boolean;
        jugadores?: number;
    };
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
export declare function crearApiCaptura(fetcher: Fetcher): {
    leer: (ref: RefSet) => Promise<EstadoSet>;
    agregarEvento: (ref: RefSet, e: NuevoEvento) => Promise<EstadoSet>;
    borrarEvento: (id: string) => Promise<EstadoSet>;
    guardarAlineacion: (ref: RefSet, alineacion: {
        jugador: string;
        equipo: string;
    }[]) => Promise<EstadoSet>;
    guardarTiempo: (ref: RefSet, tiempo: TiempoSet | null) => Promise<EstadoSet>;
    guardarVideos: (partidoId: string, videos: VideoPartido[]) => Promise<{
        videos: VideoPartido[];
        videoUrl: string;
    }>;
    /** Cámaras propias de una planilla: no tocan el partido; se suman al oficializar. */
    guardarVideosPlanilla: (planillaId: string, videos: VideoPartido[]) => Promise<{
        videos: VideoPartido[];
        videoUrl: string;
    }>;
};
export type ApiCaptura = ReturnType<typeof crearApiCaptura>;
//# sourceMappingURL=api.d.ts.map