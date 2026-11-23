"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const CamarasPartido_1 = __importDefault(require("./CamarasPartido"));
const CapturaSet_1 = __importDefault(require("./CapturaSet"));
const ReproductorPartido_1 = __importDefault(require("./ReproductorPartido"));
const reloj_1 = require("./reloj");
const idDe = (r) => (r && typeof r === 'object' ? r._id : r !== null && r !== void 0 ? r : '');
const CapturaSetOficial = ({ api, fetcher, partidoId, setPartidoId, soloLectura, obtenerTiempo, origen, onCambio, }) => {
    const [partido, setPartido] = (0, react_1.useState)(null);
    const [convocados, setConvocados] = (0, react_1.useState)([]);
    const [videos, setVideos] = (0, react_1.useState)([]);
    const [error, setError] = (0, react_1.useState)(null);
    const [verCamaras, setVerCamaras] = (0, react_1.useState)(false);
    const reproductor = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        let vivo = true;
        Promise.all([
            fetcher(`/partidos/${partidoId}`),
            fetcher(`/jugador-partido?partido=${partidoId}`),
        ])
            .then(([p, jp]) => {
            var _a, _b;
            if (!vivo)
                return;
            setPartido(p);
            setConvocados(Array.isArray(jp) ? jp : (_a = jp.items) !== null && _a !== void 0 ? _a : []);
            const id = (0, reloj_1.extraerYoutubeId)(p.videoUrl);
            setVideos(((_b = p.videos) === null || _b === void 0 ? void 0 : _b.length) ? p.videos : id ? [{ youtubeId: id, etiqueta: 'Cámara principal', tramos: [] }] : []);
        })
            .catch((e) => vivo && setError(e instanceof Error ? e.message : 'No se pudo cargar el partido'));
        return () => {
            vivo = false;
        };
    }, [fetcher, partidoId]);
    const equipos = (0, react_1.useMemo)(() => {
        if (!partido)
            return [];
        return [partido.equipoLocal, partido.equipoVisitante]
            .filter(Boolean)
            .map((e, i) => ({ id: idDe(e), nombre: (typeof e === 'object' && (e === null || e === void 0 ? void 0 : e.nombre)) || (i === 0 ? 'Local' : 'Visitante') }));
    }, [partido]);
    const jugadores = (0, react_1.useMemo)(() => convocados
        .filter((c) => c.rol !== 'entrenador' && idDe(c.jugador))
        .map((c) => {
        var _a;
        const j = c.jugador;
        const nombre = typeof j === 'object' && j ? j.alias || [j.nombre, j.apellido].filter(Boolean).join(' ') : '';
        return { id: idDe(j), nombre: nombre || 'Jugador', numero: (_a = c.numero) !== null && _a !== void 0 ? _a : null, equipo: idDe(c.equipo) };
    }), [convocados]);
    if (error)
        return (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-700", children: error });
    if (!partido)
        return (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted", children: "Cargando partido\u2026" });
    const reloj = obtenerTiempo !== null && obtenerTiempo !== void 0 ? obtenerTiempo : (videos.length ? () => { var _a, _b; return (_b = (_a = reproductor.current) === null || _a === void 0 ? void 0 : _a.segundoPartido()) !== null && _b !== void 0 ? _b : null; } : undefined);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [!obtenerTiempo && videos.length > 0 && (0, jsx_runtime_1.jsx)(ReproductorPartido_1.default, { ref: reproductor, videos: videos }), !obtenerTiempo && videos.length === 0 && ((0, jsx_runtime_1.jsx)("p", { className: "rounded-lg bg-slate-50 p-3 text-sm text-muted", children: "El partido no tiene video: los tiempos se toman con el cron\u00F3metro del set." })), !obtenerTiempo && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setVerCamaras((v) => !v), className: "text-sm text-brand-700 hover:underline", children: verCamaras ? 'Ocultar cámaras' : `Cámaras del partido (${videos.length})` }), verCamaras && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2", children: (0, jsx_runtime_1.jsx)(CamarasPartido_1.default, { api: api, partidoId: partidoId, videos: videos, onGuardado: setVideos, soloLectura: soloLectura }) }))] })), jugadores.length === 0 && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-amber-700", children: "El partido no tiene jugadores convocados: carg\u00E1 la convocatoria para poder marcar outs." })), (0, jsx_runtime_1.jsx)(CapturaSet_1.default, { api: api, refSet: { setPartido: setPartidoId }, equipos: equipos, jugadores: jugadores, obtenerTiempo: reloj, irA: obtenerTiempo ? undefined : (s) => { var _a; return (_a = reproductor.current) === null || _a === void 0 ? void 0 : _a.irA(s); }, soloLectura: soloLectura, origen: origen, onCambio: () => onCambio === null || onCambio === void 0 ? void 0 : onCambio() })] }));
};
exports.default = CapturaSetOficial;
//# sourceMappingURL=CapturaSetOficial.js.map