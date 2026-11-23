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
//# sourceMappingURL=reloj.d.ts.map