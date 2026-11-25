/**
 * Reloj de partido: cómo se alinea cada cámara con una línea de tiempo común.
 * Dentro de un tramo `cam: [desde, hasta]` (segundos de cámara), segundo de partido =
 * segundo de cámara + d. Sin tramos, la cámara está alineada con d = 0.
 * Ver `overtime/src/models/Partido/tiempoVideo.js`.
 */
export interface TramoCamara {
    cam: [number, number];
    d: number;
}
export interface VideoPartido {
    _id?: string;
    youtubeId: string;
    etiqueta?: string;
    duracion?: number | null;
    tramos?: TramoCamara[];
}
export declare function camaraAPartido(video: VideoPartido, segCamara: number): number;
/** null si esa cámara no tiene imagen en ese segundo de partido. */
export declare function partidoACamara(video: VideoPartido, segPartido: number): number | null;
/** "1:05:03" / "4:07" */
export declare function formatearSegundos(s: number | null | undefined): string;
/** "4:07", "1:05:03" o "247" → segundos; null si no se entiende. */
export declare function leerSegundos(texto: string): number | null;
/** Extrae el ID de YouTube de cualquier forma de link (watch?v=, youtu.be, /live/, /embed/...). */
export declare function extraerYoutubeId(input?: string | null): string | null;
/**
 * Reloj de juego registrado por Overtime-Partido (Partido.relojJuego): cada arranque, pausa,
 * reanudación, ajuste y cambio de tiempo con la hora real del servidor.
 */
export interface RegistroRelojJuego {
    tipo: 'inicio' | 'pausa' | 'reanuda' | 'ajuste' | 'cambio_tiempo';
    periodo: number;
    hora: string;
    restante: number;
    corriendo?: boolean;
    motivo?: 'time_out' | 'revision' | 'otro' | null;
    lado?: 'local' | 'visitante' | null;
}
export interface RelojEnVivo {
    ancla: string;
    segundo: number;
    alineado: boolean;
}
/** Hora real (ms) de un segundo del video, según el reloj en vivo. */
export declare const horaDeSegundo: (reloj: RelojEnVivo, segundo: number) => number;
/** Segundo del video de una hora real, según el reloj en vivo. */
export declare const segundoDeHora: (reloj: RelojEnVivo, hora: string | number | Date) => number;
/**
 * Estado del reloj de juego a una hora real. null si a esa hora todavía no había arrancado.
 * Igual que tiempoDeJuegoEnHora en el backend (utils/relojJuego.js).
 */
export declare function tiempoDeJuegoEnHora(registros: RegistroRelojJuego[], hora: number): {
    periodo: number;
    restante: number;
    corriendo: boolean;
} | null;
/** "1T 12:34" para un segundo del video, o null si no hay reloj de juego en ese momento. */
export declare function etiquetaTiempoDeJuego(registros: RegistroRelojJuego[] | undefined, reloj: RelojEnVivo | null | undefined, segundo: number): string | null;
/**
 * Inicio y fin del partido en el tiempo del partido (el eje de todo). origen 'en_vivo' = lo marcó la
 * consola; 'manual' = marcado en diferido sobre un video; 'cv' = propuesto por un modelo.
 * `hasta` null mientras no terminó. Ver overtime/src/models/Partido/tiempoVideo.js.
 */
export interface VentanaPartido {
    desde: number | null;
    hasta: number | null;
    origen?: 'manual' | 'cv' | 'en_vivo';
    confirmado?: boolean;
}
/**
 * El video perdió un pedazo (se cortó la transmisión, se editó un tiempo muerto): desde el segundo
 * de cámara `desde` en adelante, segundo de partido = segundo de cámara + `nuevoD`. Lo anterior
 * queda como estaba. Un video sin tramos tiene uno implícito con d = 0 que se vuelve explícito.
 * Puro: devuelve los tramos nuevos.
 */
export declare function cortarDesde(video: VideoPartido, desde: number, nuevoD: number): TramoCamara[];
//# sourceMappingURL=reloj.d.ts.map