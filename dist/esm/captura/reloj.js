const tramoMasCercano = (tramos, s, clave) => {
    var _a;
    return (_a = tramos.find((t) => s >= clave(t)[0] && s <= clave(t)[1])) !== null && _a !== void 0 ? _a : tramos.reduce((m, t) => (Math.abs(clave(t)[0] - s) < Math.abs(clave(m)[0] - s) ? t : m));
};
export function camaraAPartido(video, segCamara) {
    var _a;
    const tramos = (_a = video.tramos) !== null && _a !== void 0 ? _a : [];
    if (!tramos.length)
        return segCamara;
    return segCamara + tramoMasCercano(tramos, segCamara, (t) => t.cam).d;
}
/** null si esa cámara no tiene imagen en ese segundo de partido. */
export function partidoACamara(video, segPartido) {
    var _a;
    const tramos = (_a = video.tramos) !== null && _a !== void 0 ? _a : [];
    if (!tramos.length)
        return segPartido >= 0 ? segPartido : null;
    const dentro = tramos.find((t) => segPartido >= t.cam[0] + t.d && segPartido <= t.cam[1] + t.d);
    return dentro ? segPartido - dentro.d : null;
}
/** "1:05:03" / "4:07" */
export function formatearSegundos(s) {
    if (s == null || !Number.isFinite(s))
        return '–';
    const neg = s < 0;
    const a = Math.abs(Math.round(s));
    const h = Math.floor(a / 3600);
    const m = Math.floor((a % 3600) / 60);
    const ss = String(a % 60).padStart(2, '0');
    return `${neg ? '-' : ''}${h ? `${h}:${String(m).padStart(2, '0')}` : m}:${ss}`;
}
/** "4:07", "1:05:03" o "247" → segundos; null si no se entiende. */
export function leerSegundos(texto) {
    const t = texto.trim();
    if (!t)
        return null;
    if (/^\d+(\.\d+)?$/.test(t))
        return Number(t);
    const partes = t.split(':').map(Number);
    if (partes.some((x) => !Number.isFinite(x)) || partes.length > 3)
        return null;
    return partes.reduce((acc, x) => acc * 60 + x, 0);
}
/** Extrae el ID de YouTube de cualquier forma de link (watch?v=, youtu.be, /live/, /embed/...). */
export function extraerYoutubeId(input) {
    const texto = (input !== null && input !== void 0 ? input : '').trim();
    if (!texto)
        return null;
    if (/^[\w-]{11}$/.test(texto))
        return texto;
    let url;
    try {
        url = new URL(texto.startsWith('http') ? texto : `https://${texto}`);
    }
    catch {
        return null;
    }
    const host = url.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
        const id = url.pathname.slice(1).split('/')[0];
        return /^[\w-]{11}$/.test(id) ? id : null;
    }
    if (!/(^|\.)youtube(-nocookie)?\.com$/.test(host))
        return null;
    const v = url.searchParams.get('v');
    if (v && /^[\w-]{11}$/.test(v))
        return v;
    const m = url.pathname.match(/\/(?:embed|shorts|live|v)\/([\w-]{11})/);
    return m ? m[1] : null;
}
const msDe = (d) => new Date(d).getTime();
/** Hora real (ms) de un segundo del video, según el reloj en vivo. */
export const horaDeSegundo = (reloj, segundo) => msDe(reloj.ancla) + (segundo - reloj.segundo) * 1000;
/** Segundo del video de una hora real, según el reloj en vivo. */
export const segundoDeHora = (reloj, hora) => reloj.segundo + (msDe(hora) - msDe(reloj.ancla)) / 1000;
/**
 * Estado del reloj de juego a una hora real. null si a esa hora todavía no había arrancado.
 * Igual que tiempoDeJuegoEnHora en el backend (utils/relojJuego.js).
 */
export function tiempoDeJuegoEnHora(registros, hora) {
    const previos = registros.filter((x) => msDe(x.hora) <= hora).sort((a, b) => msDe(a.hora) - msDe(b.hora));
    if (!previos.some((x) => x.tipo === 'inicio'))
        return null;
    const ultimo = previos[previos.length - 1];
    const corriendo = ultimo.tipo === 'inicio' || ultimo.tipo === 'reanuda' || (ultimo.tipo === 'ajuste' && Boolean(ultimo.corriendo));
    const transcurrido = corriendo ? (hora - msDe(ultimo.hora)) / 1000 : 0;
    return { periodo: ultimo.periodo, restante: Math.max(0, Math.round((ultimo.restante - transcurrido) * 10) / 10), corriendo };
}
/** "1T 12:34" para un segundo del video, o null si no hay reloj de juego en ese momento. */
export function etiquetaTiempoDeJuego(registros, reloj, segundo) {
    if (!reloj || !(registros === null || registros === void 0 ? void 0 : registros.length))
        return null;
    const e = tiempoDeJuegoEnHora(registros, horaDeSegundo(reloj, segundo));
    return e ? `${e.periodo}T ${formatearSegundos(e.restante)}` : null;
}
//# sourceMappingURL=reloj.js.map