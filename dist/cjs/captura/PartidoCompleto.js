"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const CamarasPartido_1 = __importDefault(require("./CamarasPartido"));
const ReproductorPartido_1 = __importDefault(require("./ReproductorPartido"));
const reloj_1 = require("./reloj");
const COLOR_GANADOR = {
    local: 'bg-sky-500',
    visitante: 'bg-amber-500',
    empate: 'bg-slate-500',
    pendiente: 'bg-slate-300',
};
const PartidoCompleto = ({ api, videos, destinoCamaras, onVideos, equipos, sets, refDe, crearSet, onCambio, soloLectura, className = '', }) => {
    var _a, _b;
    const reproductor = (0, react_1.useRef)(null);
    const [ahora, setAhora] = (0, react_1.useState)(0);
    const [inicioPendiente, setInicioPendiente] = (0, react_1.useState)(null);
    const [editando, setEditando] = (0, react_1.useState)(null);
    const [guardando, setGuardando] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [verCamaras, setVerCamaras] = (0, react_1.useState)(false);
    // El cursor sigue al video.
    (0, react_1.useEffect)(() => {
        if (!videos.length)
            return undefined;
        const t = window.setInterval(() => { var _a, _b; return setAhora((_b = (_a = reproductor.current) === null || _a === void 0 ? void 0 : _a.segundoPartido()) !== null && _b !== void 0 ? _b : 0); }, 500);
        return () => window.clearInterval(t);
    }, [videos.length]);
    const ordenados = (0, react_1.useMemo)(() => [...sets].sort((a, b) => a.numeroSet - b.numeroSet), [sets]);
    const siguiente = ((_b = (_a = ordenados[ordenados.length - 1]) === null || _a === void 0 ? void 0 : _a.numeroSet) !== null && _b !== void 0 ? _b : 0) + 1;
    const segundo = () => { var _a, _b; return Math.round(((_b = (_a = reproductor.current) === null || _a === void 0 ? void 0 : _a.segundoPartido()) !== null && _b !== void 0 ? _b : 0) * 10) / 10; };
    // Largo de la línea: el video más largo conocido o, si no, hasta el último set marcado.
    const largo = Math.max(60, ...videos.map((v) => { var _a; return (_a = v.duracion) !== null && _a !== void 0 ? _a : 0; }), ...ordenados.map((s) => { var _a, _b; return (_b = (_a = s.tiempo) === null || _a === void 0 ? void 0 : _a.hasta) !== null && _b !== void 0 ? _b : 0; }), ahora + 30, inicioPendiente !== null && inicioPendiente !== void 0 ? inicioPendiente : 0);
    const pct = (t) => `${Math.max(0, Math.min(100, (t / largo) * 100))}%`;
    const nombre = (g) => g === 'local' ? equipos.local.nombre : g === 'visitante' ? equipos.visitante.nombre : g === 'empate' ? 'Empate' : 'Sin definir';
    const correr = async (fn) => {
        setGuardando(true);
        setError(null);
        try {
            await fn();
            await onCambio();
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'No se pudo guardar');
        }
        finally {
            setGuardando(false);
        }
    };
    const guardarTiempo = (id, desde, hasta) => api.guardarTiempo(refDe(id), { desde, hasta, origen: 'manual', confirmado: true });
    const terminarAca = () => {
        if (inicioPendiente == null)
            return;
        const fin = segundo();
        if (fin <= inicioPendiente) {
            setError('El fin tiene que ser después del inicio: avanzá el video.');
            return;
        }
        const desde = inicioPendiente;
        setInicioPendiente(null);
        void correr(async () => {
            const id = await crearSet(siguiente);
            await guardarTiempo(id, desde, fin);
        });
    };
    const marcarExtremo = (s, cual) => {
        var _a, _b, _c, _d;
        const t = segundo();
        const desde = cual === 'desde' ? t : (_b = (_a = s.tiempo) === null || _a === void 0 ? void 0 : _a.desde) !== null && _b !== void 0 ? _b : t;
        const hasta = cual === 'hasta' ? t : (_d = (_c = s.tiempo) === null || _c === void 0 ? void 0 : _c.hasta) !== null && _d !== void 0 ? _d : t + 1;
        if (hasta <= desde) {
            setError(`El fin del set ${s.numeroSet} tiene que ser después del inicio.`);
            return;
        }
        void correr(() => guardarTiempo(s.id, desde, hasta));
    };
    const guardarEdicion = () => {
        if (!editando)
            return;
        const desde = (0, reloj_1.leerSegundos)(editando.desde);
        const hasta = (0, reloj_1.leerSegundos)(editando.hasta);
        if (desde == null || hasta == null || hasta <= desde) {
            setEditando({ ...editando, error: 'Poné inicio y fin en m:ss, con el fin después del inicio.' });
            return;
        }
        const id = editando.id;
        setEditando(null);
        void correr(() => guardarTiempo(id, desde, hasta));
    };
    const conTiempo = ordenados.filter((s) => s.tiempo);
    const totalJugado = conTiempo.reduce((acc, s) => { var _a, _b, _c, _d; return acc + (((_b = (_a = s.tiempo) === null || _a === void 0 ? void 0 : _a.hasta) !== null && _b !== void 0 ? _b : 0) - ((_d = (_c = s.tiempo) === null || _c === void 0 ? void 0 : _c.desde) !== null && _d !== void 0 ? _d : 0)); }, 0);
    const ganados = (g) => ordenados.filter((s) => s.ganadorSet === g).length;
    return ((0, jsx_runtime_1.jsxs)("div", { className: `space-y-4 text-sm ${className}`, children: [videos.length > 0 ? ((0, jsx_runtime_1.jsx)(ReproductorPartido_1.default, { ref: reproductor, videos: videos })) : ((0, jsx_runtime_1.jsx)("p", { className: "rounded-lg bg-slate-50 p-3 text-muted", children: "Este partido no tiene video. Agreg\u00E1 uno en \u00ABC\u00E1maras\u00BB para marcar d\u00F3nde est\u00E1 cada set; sin video igual pod\u00E9s cargar los sets y sus ganadores." })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setVerCamaras((v) => !v), className: "text-brand-700 hover:underline", children: verCamaras ? 'Ocultar cámaras' : `Cámaras (${videos.length})` }), verCamaras && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2", children: (0, jsx_runtime_1.jsx)(CamarasPartido_1.default, { api: api, ...destinoCamaras, videos: videos, onGuardado: (v) => onVideos === null || onVideos === void 0 ? void 0 : onVideos(v), soloLectura: soloLectura }) }))] }), (0, jsx_runtime_1.jsxs)("section", { "aria-label": "L\u00EDnea de tiempo del partido", className: "rounded-lg border border-slate-200 p-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-2 flex flex-wrap items-baseline justify-between gap-2", children: [(0, jsx_runtime_1.jsxs)("p", { className: "font-semibold", children: [equipos.local.nombre, " ", ganados('local'), " \u2013 ", ganados('visitante'), " ", equipos.visitante.nombre] }), (0, jsx_runtime_1.jsxs)("p", { className: "tabular-nums text-muted", children: [ordenados.length, " set", ordenados.length === 1 ? '' : 's', " \u00B7 jugado ", (0, reloj_1.formatearSegundos)(totalJugado)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative h-8 overflow-hidden rounded bg-slate-100", children: [conTiempo.map((s) => ((0, jsx_runtime_1.jsx)("button", { type: "button", title: `Set ${s.numeroSet}: ${(0, reloj_1.formatearSegundos)(s.tiempo.desde)} → ${(0, reloj_1.formatearSegundos)(s.tiempo.hasta)} · ${nombre(s.ganadorSet)}`, "aria-label": `Ir al set ${s.numeroSet}`, onClick: () => { var _a; return (_a = reproductor.current) === null || _a === void 0 ? void 0 : _a.irA(s.tiempo.desde); }, className: `absolute top-0 h-full ${COLOR_GANADOR[s.ganadorSet]} text-2xs font-bold text-white hover:opacity-80`, style: { left: pct(s.tiempo.desde), width: pct(s.tiempo.hasta - s.tiempo.desde) }, children: s.numeroSet }, s.id))), inicioPendiente != null && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 h-full bg-brand-300/70", style: { left: pct(inicioPendiente), width: pct(Math.max(0, ahora - inicioPendiente)) } })), videos.length > 0 && (0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 h-full w-0.5 bg-red-600", style: { left: pct(ahora) } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-1 flex justify-between text-2xs tabular-nums text-muted", children: [(0, jsx_runtime_1.jsx)("span", { children: "0:00" }), (0, jsx_runtime_1.jsx)("span", { children: (0, reloj_1.formatearSegundos)(ahora) }), (0, jsx_runtime_1.jsx)("span", { children: (0, reloj_1.formatearSegundos)(largo) })] }), !soloLectura && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-3 flex flex-wrap items-center gap-2", children: [videos.length > 0 && inicioPendiente == null && ((0, jsx_runtime_1.jsxs)("button", { type: "button", disabled: guardando, onClick: () => setInicioPendiente(segundo()), className: "rounded bg-slate-800 px-3 py-1.5 font-semibold text-white hover:bg-slate-700 disabled:opacity-50", children: ["Empieza el set ", siguiente, " ac\u00E1"] })), inicioPendiente != null && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("span", { className: "tabular-nums text-muted", children: ["Set ", siguiente, " desde ", (0, reloj_1.formatearSegundos)(inicioPendiente), "\u2026"] }), (0, jsx_runtime_1.jsx)("button", { type: "button", disabled: guardando, onClick: terminarAca, className: "rounded bg-slate-800 px-3 py-1.5 font-semibold text-white hover:bg-slate-700 disabled:opacity-50", children: "Termina ac\u00E1" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setInicioPendiente(null), className: "px-2 py-1 text-muted hover:underline", children: "Cancelar" })] })), (0, jsx_runtime_1.jsxs)("button", { type: "button", disabled: guardando, onClick: () => void correr(() => crearSet(siguiente)), className: "rounded px-2 py-1.5 text-brand-700 hover:underline disabled:opacity-50", children: ["+ Set ", siguiente, " sin tiempo"] })] })), error && (0, jsx_runtime_1.jsx)("p", { role: "alert", className: "mt-2 text-red-700", children: error })] }), ordenados.length > 0 && ((0, jsx_runtime_1.jsx)("ol", { className: "divide-y divide-slate-100 rounded-lg border border-slate-200", children: ordenados.map((s) => ((0, jsx_runtime_1.jsxs)("li", { className: "flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "w-12 font-semibold", children: ["Set ", s.numeroSet] }), (editando === null || editando === void 0 ? void 0 : editando.id) === s.id ? ((0, jsx_runtime_1.jsxs)("form", { className: "flex flex-wrap items-center gap-2", onSubmit: (e) => {
                                e.preventDefault();
                                guardarEdicion();
                            }, onKeyDown: (e) => e.key === 'Escape' && setEditando(null), children: [(0, jsx_runtime_1.jsxs)("label", { className: "sr-only", htmlFor: `pc-desde-${s.id}`, children: ["Inicio del set ", s.numeroSet] }), (0, jsx_runtime_1.jsx)("input", { id: `pc-desde-${s.id}`, autoFocus: true, value: editando.desde, onChange: (e) => setEditando({ ...editando, desde: e.target.value, error: undefined }), className: "w-16 rounded border border-slate-300 px-1.5 py-0.5 tabular-nums" }), (0, jsx_runtime_1.jsx)("span", { "aria-hidden": true, children: "\u2192" }), (0, jsx_runtime_1.jsxs)("label", { className: "sr-only", htmlFor: `pc-hasta-${s.id}`, children: ["Fin del set ", s.numeroSet] }), (0, jsx_runtime_1.jsx)("input", { id: `pc-hasta-${s.id}`, value: editando.hasta, onChange: (e) => setEditando({ ...editando, hasta: e.target.value, error: undefined }), className: "w-16 rounded border border-slate-300 px-1.5 py-0.5 tabular-nums" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "rounded bg-brand-600 px-2 py-0.5 font-semibold text-white", children: "Guardar" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setEditando(null), className: "text-muted hover:underline", children: "Cancelar" }), editando.error && (0, jsx_runtime_1.jsx)("span", { role: "alert", className: "w-full text-xs text-red-700", children: editando.error })] })) : ((0, jsx_runtime_1.jsxs)("span", { className: "flex flex-wrap items-center gap-2 tabular-nums", children: [s.tiempo ? ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => { var _a; return (_a = reproductor.current) === null || _a === void 0 ? void 0 : _a.irA(s.tiempo.desde); }, className: "hover:underline", children: [(0, reloj_1.formatearSegundos)(s.tiempo.desde), " \u2192 ", (0, reloj_1.formatearSegundos)(s.tiempo.hasta), ' ', (0, jsx_runtime_1.jsxs)("span", { className: "text-muted", children: ["(", (0, reloj_1.formatearSegundos)(s.tiempo.hasta - s.tiempo.desde), ")"] })] })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-muted", children: "sin tiempo" })), !soloLectura && videos.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { type: "button", disabled: guardando, onClick: () => marcarExtremo(s, 'desde'), className: "text-2xs text-brand-700 hover:underline", children: "inicio = ahora" }), (0, jsx_runtime_1.jsx)("button", { type: "button", disabled: guardando, onClick: () => marcarExtremo(s, 'hasta'), className: "text-2xs text-brand-700 hover:underline", children: "fin = ahora" })] })), !soloLectura && ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setEditando({
                                        id: s.id,
                                        desde: s.tiempo ? (0, reloj_1.formatearSegundos)(s.tiempo.desde) : '',
                                        hasta: s.tiempo ? (0, reloj_1.formatearSegundos)(s.tiempo.hasta) : '',
                                    }), className: "text-2xs text-brand-700 hover:underline", children: "editar" }))] })), (0, jsx_runtime_1.jsx)("span", { className: "ml-auto flex flex-wrap items-center gap-1", role: "group", "aria-label": `Ganador del set ${s.numeroSet}`, children: ['local', 'visitante', 'empate'].map((g) => ((0, jsx_runtime_1.jsx)("button", { type: "button", disabled: soloLectura || guardando, "aria-pressed": s.ganadorSet === g, onClick: () => void correr(() => api.guardarGanador(refDe(s.id), s.ganadorSet === g ? 'pendiente' : g)), className: `rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 transition disabled:cursor-default ${s.ganadorSet === g
                                    ? `${COLOR_GANADOR[g]} text-white ring-transparent`
                                    : 'bg-white text-slate-600 ring-slate-300 hover:bg-slate-50'}`, children: nombre(g) }, g))) })] }, s.id))) }))] }));
};
exports.default = PartidoCompleto;
//# sourceMappingURL=PartidoCompleto.js.map