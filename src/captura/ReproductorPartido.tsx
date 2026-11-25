import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { camaraAPartido, formatearSegundos, partidoACamara, type VideoPartido } from './reloj';

/**
 * Reproductor de YouTube con el reloj de partido: varias cámaras, cambiar entre ellas sin
 * perder el momento, y saber en qué "segundo de partido" está la imagen. Es la referencia de
 * tiempo de la captura (sets y marcas se guardan en segundos de partido).
 */

interface YTPlayer {
  loadVideoById(o: { videoId: string; startSeconds?: number }): void;
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

let cargaApi: Promise<YTApi> | null = null;
function cargarApiYoutube(): Promise<YTApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (cargaApi) return cargaApi;
  cargaApi = new Promise((resolve, reject) => {
    const previo = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previo?.();
      if (window.YT) resolve(window.YT);
    };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.async = true;
    s.onerror = () => {
      cargaApi = null;
      reject(new Error('No se pudo cargar YouTube'));
    };
    document.head.appendChild(s);
  });
  return cargaApi;
}

export interface ReproductorPartidoHandle {
  /** Segundo de partido de la imagen actual (null si el player no está listo). */
  segundoPartido(): number | null;
  /** Lleva la cámara actual a ese segundo de partido (si esa cámara lo tiene). */
  irA(segPartido: number): void;
  pausar(): void;
  /** Cámara que se está viendo y su propio segundo (para cortar sus tramos). null si no cargó. */
  camaraActual: () => { indice: number; segundoCamara: number } | null;
}

export interface ReproductorPartidoProps {
  videos: VideoPartido[];
  className?: string;
  /** Se llama ~4 veces por segundo con el segundo de partido actual. */
  onTiempo?: (segPartido: number) => void;
}

const ReproductorPartido = forwardRef<ReproductorPartidoHandle, ReproductorPartidoProps>(
  ({ videos, className = '', onTiempo }, ref) => {
    const [camara, setCamara] = useState(0);
    const [listo, setListo] = useState(false);
    const [ahora, setAhora] = useState<number | null>(null);
    const [sinImagen, setSinImagen] = useState(false);
    const contenedor = useRef<HTMLDivElement>(null);
    const player = useRef<YTPlayer | null>(null);
    const camaraRef = useRef(camara);
    camaraRef.current = camara;
    const onTiempoRef = useRef(onTiempo);
    onTiempoRef.current = onTiempo;

    const video = videos[camara];
    const primerId = videos[0]?.youtubeId;

    useImperativeHandle(ref, () => ({
      segundoPartido: () => {
        const p = player.current;
        const v = videos[camaraRef.current];
        return p && v && listo ? camaraAPartido(v, p.getCurrentTime()) : null;
      },
      irA: (s) => {
        const v = videos[camaraRef.current];
        const c = v ? partidoACamara(v, s) : null;
        if (c != null) player.current?.seekTo(c, true);
      },
      pausar: () => player.current?.pauseVideo(),
      camaraActual: () => {
        const p = player.current;
        return p && listo && videos[camaraRef.current] ? { indice: camaraRef.current, segundoCamara: p.getCurrentTime() } : null;
      },
    }), [videos, listo]);

    useEffect(() => {
      if (!primerId || !contenedor.current) return undefined;
      let cancelado = false;
      const destino = document.createElement('div');
      contenedor.current.appendChild(destino);
      cargarApiYoutube()
        .then((YT) => {
          if (cancelado) return;
          player.current = new YT.Player(destino, {
            host: 'https://www.youtube-nocookie.com',
            videoId: primerId,
            playerVars: { playsinline: 1, rel: 0, modestbranding: 1 },
            events: { onReady: () => setListo(true) },
          });
        })
        .catch(() => undefined);
      return () => {
        cancelado = true;
        player.current?.destroy();
        player.current = null;
        setListo(false);
        destino.remove();
      };
    }, [primerId]);

    useEffect(() => {
      if (!listo) return undefined;
      const t = window.setInterval(() => {
        const p = player.current;
        const v = videos[camaraRef.current];
        if (!p || !v) return;
        const s = camaraAPartido(v, p.getCurrentTime());
        setAhora(s);
        onTiempoRef.current?.(s);
      }, 250);
      return () => window.clearInterval(t);
    }, [listo, videos]);

    const cambiarCamara = (i: number) => {
      const p = player.current;
      const destinoV = videos[i];
      if (!p || !destinoV || i === camara) return;
      const s = ahora ?? 0;
      const c = partidoACamara(destinoV, s);
      setSinImagen(c == null);
      p.loadVideoById({ videoId: destinoV.youtubeId, startSeconds: Math.max(0, c ?? 0) });
      setCamara(i);
    };

    if (!videos.length) return null;

    return (
      <div className={`overflow-hidden rounded-lg bg-black text-white ${className}`}>
        <div className="relative aspect-video w-full [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full">
          <div ref={contenedor} className="absolute inset-0" />
          {sinImagen && (
            <p className="absolute inset-x-0 top-2 z-10 mx-auto w-fit rounded bg-black/80 px-2 py-1 text-xs">
              Esta cámara no tiene imagen en ese momento del partido
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-3 py-2 text-xs">
          <div className="flex flex-wrap gap-1" role="group" aria-label="Cámara">
            {videos.map((v, i) => (
              <button
                key={v._id ?? `${v.youtubeId}-${i}`}
                type="button"
                onClick={() => cambiarCamara(i)}
                aria-pressed={i === camara}
                className={`rounded px-2 py-1 font-semibold ${i === camara ? 'bg-brand-600' : 'bg-white/10 hover:bg-white/20'}`}
              >
                {v.etiqueta || `Cámara ${i + 1}`}
              </button>
            ))}
          </div>
          <span className="tabular-nums text-slate-300" title="Segundo de partido (común a todas las cámaras)">
            Partido {formatearSegundos(ahora)}
            {video?.etiqueta ? ` · ${video.etiqueta}` : ''}
          </span>
        </div>
      </div>
    );
  },
);

ReproductorPartido.displayName = 'ReproductorPartido';
export default ReproductorPartido;
