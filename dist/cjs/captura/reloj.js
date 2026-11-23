"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extraerYoutubeId = exports.leerSegundos = exports.formatearSegundos = exports.partidoACamara = exports.camaraAPartido = void 0;
const tramoMasCercano = (tramos, s, clave) => {
    var _a;
    return (_a = tramos.find((t) => s >= clave(t)[0] && s <= clave(t)[1])) !== null && _a !== void 0 ? _a : tramos.reduce((m, t) => (Math.abs(clave(t)[0] - s) < Math.abs(clave(m)[0] - s) ? t : m));
};
function camaraAPartido(video, segCamara) {
    var _a;
    const tramos = (_a = video.tramos) !== null && _a !== void 0 ? _a : [];
    if (!tramos.length)
        return segCamara;
    return segCamara + tramoMasCercano(tramos, segCamara, (t) => t.cam).d;
}
exports.camaraAPartido = camaraAPartido;
/** null si esa cámara no tiene imagen en ese segundo de partido. */
function partidoACamara(video, segPartido) {
    var _a;
    const tramos = (_a = video.tramos) !== null && _a !== void 0 ? _a : [];
    if (!tramos.length)
        return segPartido >= 0 ? segPartido : null;
    const dentro = tramos.find((t) => segPartido >= t.cam[0] + t.d && segPartido <= t.cam[1] + t.d);
    return dentro ? segPartido - dentro.d : null;
}
exports.partidoACamara = partidoACamara;
/** "1:05:03" / "4:07" */
function formatearSegundos(s) {
    if (s == null || !Number.isFinite(s))
        return '–';
    const neg = s < 0;
    const a = Math.abs(Math.round(s));
    const h = Math.floor(a / 3600);
    const m = Math.floor((a % 3600) / 60);
    const ss = String(a % 60).padStart(2, '0');
    return `${neg ? '-' : ''}${h ? `${h}:${String(m).padStart(2, '0')}` : m}:${ss}`;
}
exports.formatearSegundos = formatearSegundos;
/** "4:07", "1:05:03" o "247" → segundos; null si no se entiende. */
function leerSegundos(texto) {
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
exports.leerSegundos = leerSegundos;
/** Extrae el ID de YouTube de cualquier forma de link (watch?v=, youtu.be, /live/, /embed/...). */
function extraerYoutubeId(input) {
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
exports.extraerYoutubeId = extraerYoutubeId;
//# sourceMappingURL=reloj.js.map