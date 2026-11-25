"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const reloj_1 = require("./reloj");
let cargaApi = null;
function cargarApiYoutube() {
    var _a;
    if ((_a = window.YT) === null || _a === void 0 ? void 0 : _a.Player)
        return Promise.resolve(window.YT);
    if (cargaApi)
        return cargaApi;
    cargaApi = new Promise((resolve, reject) => {
        const previo = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            previo === null || previo === void 0 ? void 0 : previo();
            if (window.YT)
                resolve(window.YT);
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
const ReproductorPartido = (0, react_1.forwardRef)(({ videos, className = '', onTiempo }, ref) => {
    var _a;
    const [camara, setCamara] = (0, react_1.useState)(0);
    const [listo, setListo] = (0, react_1.useState)(false);
    const [ahora, setAhora] = (0, react_1.useState)(null);
    const [sinImagen, setSinImagen] = (0, react_1.useState)(false);
    const contenedor = (0, react_1.useRef)(null);
    const player = (0, react_1.useRef)(null);
    const camaraRef = (0, react_1.useRef)(camara);
    camaraRef.current = camara;
    const onTiempoRef = (0, react_1.useRef)(onTiempo);
    onTiempoRef.current = onTiempo;
    const video = videos[camara];
    const primerId = (_a = videos[0]) === null || _a === void 0 ? void 0 : _a.youtubeId;
    (0, react_1.useImperativeHandle)(ref, () => ({
        segundoPartido: () => {
            const p = player.current;
            const v = videos[camaraRef.current];
            return p && v && listo ? (0, reloj_1.camaraAPartido)(v, p.getCurrentTime()) : null;
        },
        irA: (s) => {
            var _a;
            const v = videos[camaraRef.current];
            const c = v ? (0, reloj_1.partidoACamara)(v, s) : null;
            if (c != null)
                (_a = player.current) === null || _a === void 0 ? void 0 : _a.seekTo(c, true);
        },
        pausar: () => { var _a; return (_a = player.current) === null || _a === void 0 ? void 0 : _a.pauseVideo(); },
        camaraActual: () => {
            const p = player.current;
            return p && listo && videos[camaraRef.current] ? { indice: camaraRef.current, segundoCamara: p.getCurrentTime() } : null;
        },
    }), [videos, listo]);
    (0, react_1.useEffect)(() => {
        if (!primerId || !contenedor.current)
            return undefined;
        let cancelado = false;
        const destino = document.createElement('div');
        contenedor.current.appendChild(destino);
        cargarApiYoutube()
            .then((YT) => {
            if (cancelado)
                return;
            player.current = new YT.Player(destino, {
                host: 'https://www.youtube-nocookie.com',
                videoId: primerId,
                playerVars: { playsinline: 1, rel: 0, modestbranding: 1 },
                events: { onReady: () => setListo(true) },
            });
        })
            .catch(() => undefined);
        return () => {
            var _a;
            cancelado = true;
            (_a = player.current) === null || _a === void 0 ? void 0 : _a.destroy();
            player.current = null;
            setListo(false);
            destino.remove();
        };
    }, [primerId]);
    (0, react_1.useEffect)(() => {
        if (!listo)
            return undefined;
        const t = window.setInterval(() => {
            var _a;
            const p = player.current;
            const v = videos[camaraRef.current];
            if (!p || !v)
                return;
            const s = (0, reloj_1.camaraAPartido)(v, p.getCurrentTime());
            setAhora(s);
            (_a = onTiempoRef.current) === null || _a === void 0 ? void 0 : _a.call(onTiempoRef, s);
        }, 250);
        return () => window.clearInterval(t);
    }, [listo, videos]);
    const cambiarCamara = (i) => {
        const p = player.current;
        const destinoV = videos[i];
        if (!p || !destinoV || i === camara)
            return;
        const s = ahora !== null && ahora !== void 0 ? ahora : 0;
        const c = (0, reloj_1.partidoACamara)(destinoV, s);
        setSinImagen(c == null);
        p.loadVideoById({ videoId: destinoV.youtubeId, startSeconds: Math.max(0, c !== null && c !== void 0 ? c : 0) });
        setCamara(i);
    };
    if (!videos.length)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: `overflow-hidden rounded-lg bg-black text-white ${className}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative aspect-video w-full [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full", children: [(0, jsx_runtime_1.jsx)("div", { ref: contenedor, className: "absolute inset-0" }), sinImagen && ((0, jsx_runtime_1.jsx)("p", { className: "absolute inset-x-0 top-2 z-10 mx-auto w-fit rounded bg-black/80 px-2 py-1 text-xs", children: "Esta c\u00E1mara no tiene imagen en ese momento del partido" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-3 py-2 text-xs", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1", role: "group", "aria-label": "C\u00E1mara", children: videos.map((v, i) => {
                            var _a;
                            return ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => cambiarCamara(i), "aria-pressed": i === camara, className: `rounded px-2 py-1 font-semibold ${i === camara ? 'bg-brand-600' : 'bg-white/10 hover:bg-white/20'}`, children: v.etiqueta || `Cámara ${i + 1}` }, (_a = v._id) !== null && _a !== void 0 ? _a : `${v.youtubeId}-${i}`));
                        }) }), (0, jsx_runtime_1.jsxs)("span", { className: "tabular-nums text-slate-300", title: "Segundo de partido (com\u00FAn a todas las c\u00E1maras)", children: ["Partido ", (0, reloj_1.formatearSegundos)(ahora), (video === null || video === void 0 ? void 0 : video.etiqueta) ? ` · ${video.etiqueta}` : ''] })] })] }));
});
ReproductorPartido.displayName = 'ReproductorPartido';
exports.default = ReproductorPartido;
//# sourceMappingURL=ReproductorPartido.js.map