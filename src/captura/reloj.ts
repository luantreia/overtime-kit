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

const tramoMasCercano = (tramos: TramoCamara[], s: number, clave: (t: TramoCamara) => [number, number]) =>
  tramos.find((t) => s >= clave(t)[0] && s <= clave(t)[1])
  ?? tramos.reduce((m, t) => (Math.abs(clave(t)[0] - s) < Math.abs(clave(m)[0] - s) ? t : m));

export function camaraAPartido(video: VideoPartido, segCamara: number): number {
  const tramos = video.tramos ?? [];
  if (!tramos.length) return segCamara;
  return segCamara + tramoMasCercano(tramos, segCamara, (t) => t.cam).d;
}

/** null si esa cámara no tiene imagen en ese segundo de partido. */
export function partidoACamara(video: VideoPartido, segPartido: number): number | null {
  const tramos = video.tramos ?? [];
  if (!tramos.length) return segPartido >= 0 ? segPartido : null;
  const dentro = tramos.find((t) => segPartido >= t.cam[0] + t.d && segPartido <= t.cam[1] + t.d);
  return dentro ? segPartido - dentro.d : null;
}

/** "1:05:03" / "4:07" */
export function formatearSegundos(s: number | null | undefined): string {
  if (s == null || !Number.isFinite(s)) return '–';
  const neg = s < 0;
  const a = Math.abs(Math.round(s));
  const h = Math.floor(a / 3600);
  const m = Math.floor((a % 3600) / 60);
  const ss = String(a % 60).padStart(2, '0');
  return `${neg ? '-' : ''}${h ? `${h}:${String(m).padStart(2, '0')}` : m}:${ss}`;
}

/** "4:07", "1:05:03" o "247" → segundos; null si no se entiende. */
export function leerSegundos(texto: string): number | null {
  const t = texto.trim();
  if (!t) return null;
  if (/^\d+(\.\d+)?$/.test(t)) return Number(t);
  const partes = t.split(':').map(Number);
  if (partes.some((x) => !Number.isFinite(x)) || partes.length > 3) return null;
  return partes.reduce((acc, x) => acc * 60 + x, 0);
}

/** Extrae el ID de YouTube de cualquier forma de link (watch?v=, youtu.be, /live/, /embed/...). */
export function extraerYoutubeId(input?: string | null): string | null {
  const texto = (input ?? '').trim();
  if (!texto) return null;
  if (/^[\w-]{11}$/.test(texto)) return texto;
  let url: URL;
  try {
    url = new URL(texto.startsWith('http') ? texto : `https://${texto}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, '');
  if (host === 'youtu.be') {
    const id = url.pathname.slice(1).split('/')[0];
    return /^[\w-]{11}$/.test(id) ? id : null;
  }
  if (!/(^|\.)youtube(-nocookie)?\.com$/.test(host)) return null;
  const v = url.searchParams.get('v');
  if (v && /^[\w-]{11}$/.test(v)) return v;
  const m = url.pathname.match(/\/(?:embed|shorts|live|v)\/([\w-]{11})/);
  return m ? m[1] : null;
}
