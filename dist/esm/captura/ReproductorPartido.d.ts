/// <reference types="react" />
import { type VideoPartido } from './reloj';
/**
 * Reproductor de YouTube con el reloj de partido: varias cámaras, cambiar entre ellas sin
 * perder el momento, y saber en qué "segundo de partido" está la imagen. Es la referencia de
 * tiempo de la captura (sets y marcas se guardan en segundos de partido).
 */
interface YTPlayer {
    loadVideoById(o: {
        videoId: string;
        startSeconds?: number;
    }): void;
    seekTo(s: number, allowSeekAhead: boolean): void;
    getCurrentTime(): number;
    playVideo(): void;
    pauseVideo(): void;
    getPlayerState(): number;
    destroy(): void;
}
interface YTApi {
    Player: new (el: HTMLElement, o: Record<string, unknown>) => YTPlayer;
}
declare global {
    interface Window {
        YT?: YTApi;
        onYouTubeIframeAPIReady?: () => void;
    }
}
export interface ReproductorPartidoHandle {
    /** Segundo de partido de la imagen actual (null si el player no está listo). */
    segundoPartido(): number | null;
    /** Lleva la cámara actual a ese segundo de partido (si esa cámara lo tiene). */
    irA(segPartido: number): void;
    pausar(): void;
    /** Cámara que se está viendo y su propio segundo (para cortar sus tramos). null si no cargó. */
    camaraActual: () => {
        indice: number;
        segundoCamara: number;
    } | null;
}
export interface ReproductorPartidoProps {
    videos: VideoPartido[];
    className?: string;
    /** Se llama ~4 veces por segundo con el segundo de partido actual. */
    onTiempo?: (segPartido: number) => void;
}
declare const ReproductorPartido: import("react").ForwardRefExoticComponent<ReproductorPartidoProps & import("react").RefAttributes<ReproductorPartidoHandle>>;
export default ReproductorPartido;
//# sourceMappingURL=ReproductorPartido.d.ts.map