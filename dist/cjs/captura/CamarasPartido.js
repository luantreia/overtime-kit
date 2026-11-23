"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const reloj_1 = require("./reloj");
const CamarasPartido = ({ api, partidoId, videos, onGuardado, soloLectura }) => {
    const [abierto, setAbierto] = (0, react_1.useState)(false);
    const [link, setLink] = (0, react_1.useState)('');
    const [etiqueta, setEtiqueta] = (0, react_1.useState)('');
    const [enPrincipal, setEnPrincipal] = (0, react_1.useState)('');
    const [enEsta, setEnEsta] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)(null);
    const [guardando, setGuardando] = (0, react_1.useState)(false);
    const guardar = async (lista) => {
        setGuardando(true);
        setError(null);
        try {
            const r = await api.guardarVideos(partidoId, lista);
            onGuardado === null || onGuardado === void 0 ? void 0 : onGuardado(r.videos);
            return true;
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'No se pudo guardar');
            return false;
        }
        finally {
            setGuardando(false);
        }
    };
    const agregar = async () => {
        const youtubeId = (0, reloj_1.extraerYoutubeId)(link);
        if (!youtubeId)
            return setError('No reconozco ese link de YouTube');
        if (videos.some((v) => v.youtubeId === youtubeId))
            return setError('Ese video ya está en el partido');
        let tramos = [];
        if (videos.length > 0) {
            const a = (0, reloj_1.leerSegundos)(enPrincipal);
            const b = (0, reloj_1.leerSegundos)(enEsta);
            if (a == null || b == null)
                return setError('Indicá el mismo momento en las dos cámaras (m:ss) para alinearlas');
            const d = (0, reloj_1.camaraAPartido)(videos[0], a) - b;
            tramos = [{ cam: [0, 86400], d: Math.round(d * 10) / 10 }];
        }
        const nuevo = {
            youtubeId,
            etiqueta: etiqueta.trim() || (videos.length ? `Cámara ${videos.length + 1}` : 'Cámara principal'),
            duracion: null,
            tramos,
        };
        if (await guardar([...videos, nuevo])) {
            setAbierto(false);
            setLink('');
            setEtiqueta('');
            setEnPrincipal('');
            setEnEsta('');
        }
        return undefined;
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 text-sm", children: [(0, jsx_runtime_1.jsxs)("ul", { className: "space-y-1", children: [videos.map((v, i) => {
                        var _a, _b, _c;
                        return ((0, jsx_runtime_1.jsxs)("li", { className: "flex items-center gap-2 rounded border border-slate-200 px-2 py-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-semibold", children: v.etiqueta || `Cámara ${i + 1}` }), (0, jsx_runtime_1.jsx)("span", { className: "truncate text-2xs text-muted", children: v.youtubeId }), (0, jsx_runtime_1.jsx)("span", { className: "text-2xs text-muted", children: i === 0 ? 'referencia' : ((_a = v.tramos) === null || _a === void 0 ? void 0 : _a.length) === 1 ? `desfase ${(0, reloj_1.formatearSegundos)(v.tramos[0].d)}` : ((_b = v.tramos) === null || _b === void 0 ? void 0 : _b.length) ? `${v.tramos.length} tramos` : 'sin alinear' }), !soloLectura && i > 0 && ((0, jsx_runtime_1.jsx)("button", { type: "button", disabled: guardando, onClick: () => void guardar(videos.filter((_, k) => k !== i)), className: "ml-auto text-2xs text-red-700 hover:underline", children: "Quitar" }))] }, (_c = v._id) !== null && _c !== void 0 ? _c : v.youtubeId));
                    }), videos.length === 0 && (0, jsx_runtime_1.jsx)("li", { className: "text-muted", children: "El partido todav\u00EDa no tiene video." })] }), !soloLectura && !abierto && ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => setAbierto(true), className: "text-brand-700 hover:underline", children: ["+ ", videos.length ? 'Agregar otra cámara' : 'Agregar video'] })), abierto && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 rounded-lg border border-slate-200 p-3", children: [(0, jsx_runtime_1.jsxs)("label", { className: "block", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold", children: "Link de YouTube" }), (0, jsx_runtime_1.jsx)("input", { value: link, onChange: (e) => setLink(e.target.value), placeholder: "https://youtu.be/\u2026", className: "mt-0.5 w-full rounded border border-slate-300 px-2 py-1" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "block", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold", children: "Nombre" }), (0, jsx_runtime_1.jsx)("input", { value: etiqueta, onChange: (e) => setEtiqueta(e.target.value), placeholder: videos.length ? 'Cámara 2, Tribuna…' : 'Cámara principal', className: "mt-0.5 w-full rounded border border-slate-300 px-2 py-1" })] }), videos.length > 0 && ((0, jsx_runtime_1.jsxs)("fieldset", { children: [(0, jsx_runtime_1.jsx)("legend", { className: "text-xs font-semibold", children: "Un mismo momento en las dos (p. ej. el silbato del set 1)" }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-1 flex flex-wrap items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("label", { className: "flex items-center gap-1", children: ["en ", videos[0].etiqueta || 'la principal', (0, jsx_runtime_1.jsx)("input", { value: enPrincipal, onChange: (e) => setEnPrincipal(e.target.value), placeholder: "3:12", className: "w-20 rounded border border-slate-300 px-2 py-1 tabular-nums" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center gap-1", children: ["en esta", (0, jsx_runtime_1.jsx)("input", { value: enEsta, onChange: (e) => setEnEsta(e.target.value), placeholder: "0:41", className: "w-20 rounded border border-slate-300 px-2 py-1 tabular-nums" })] })] })] })), error && (0, jsx_runtime_1.jsx)("p", { className: "text-red-700", role: "alert", children: error }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", disabled: guardando, onClick: () => void agregar(), className: "rounded bg-brand-600 px-3 py-1.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-50", children: "Guardar" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => { setAbierto(false); setError(null); }, className: "rounded px-3 py-1.5 hover:bg-slate-100", children: "Cancelar" })] })] })), !abierto && error && (0, jsx_runtime_1.jsx)("p", { className: "text-red-700", role: "alert", children: error })] }));
};
exports.default = CamarasPartido;
//# sourceMappingURL=CamarasPartido.js.map