/**
 * Supervivencia: quién está en cancha en cada momento de un set, a partir de las marcas.
 * Misma lógica que el backend (`overtime/src/utils/supervivencia.js`, con tests) y que el panel
 * de análisis. Si cambia una, cambian las tres.
 */
export type TipoEvento = 'out' | 'reingreso' | 'cambio';
export type MotivoOut = 'hit' | 'catch' | 'linea' | 'otro';
export declare const MOTIVOS: {
    id: MotivoOut;
    label: string;
    atajo: string;
}[];
export interface Evento {
    _id?: string;
    t: number;
    tipo: TipoEvento;
    jugador: string;
    equipo: string;
    motivo?: MotivoOut | null;
    por?: string | null;
    entra?: string | null;
    origen?: 'manual' | 'cv' | 'en_vivo';
    /** Sólo marcas en vivo: hora real (ISO) en que la recibió el servidor. */
    hora?: string | null;
}
export interface JugadorAlineado {
    id: string;
    /** id del equipo */
    lado: string;
}
export interface FilaVivo extends JugadorAlineado {
    entra?: boolean;
    /** [desde, hasta|null] en segundos */
    tramos: [number, number | null][];
}
export declare function lineaDeTiempo(jugadores: JugadorAlineado[], eventos: Evento[], inicio?: number): FilaVivo[];
export declare const estaVivo: (f: FilaVivo, t: number) => boolean;
export declare function vivosPorLado(filas: FilaVivo[], t: number): Record<string, number>;
/** Tras un catch de `lado` en t: quién debería volver (el primero que salió y sigue afuera). */
export declare function sugerirReingreso(filas: FilaVivo[], lado: string, t: number): string | null;
//# sourceMappingURL=supervivencia.d.ts.map