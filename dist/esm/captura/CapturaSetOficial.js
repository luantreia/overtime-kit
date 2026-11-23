import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
import CamarasPartido from './CamarasPartido';
import CapturaSet from './CapturaSet';
import ReproductorPartido from './ReproductorPartido';
import { extraerYoutubeId } from './reloj';
const idDe = (r) => (r && typeof r === 'object' ? r._id : r !== null && r !== void 0 ? r : '');
const CapturaSetOficial = ({ api, fetcher, partidoId, setPartidoId, soloLectura, obtenerTiempo, origen, onCambio, }) => {
    const [partido, setPartido] = useState(null);
    const [convocados, setConvocados] = useState([]);
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState(null);
    const [verCamaras, setVerCamaras] = useState(false);
    const reproductor = useRef(null);
    useEffect(() => {
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
            const id = extraerYoutubeId(p.videoUrl);
            setVideos(((_b = p.videos) === null || _b === void 0 ? void 0 : _b.length) ? p.videos : id ? [{ youtubeId: id, etiqueta: 'Cámara principal', tramos: [] }] : []);
        })
            .catch((e) => vivo && setError(e instanceof Error ? e.message : 'No se pudo cargar el partido'));
        return () => {
            vivo = false;
        };
    }, [fetcher, partidoId]);
    const equipos = useMemo(() => {
        if (!partido)
            return [];
        return [partido.equipoLocal, partido.equipoVisitante]
            .filter(Boolean)
            .map((e, i) => ({ id: idDe(e), nombre: (typeof e === 'object' && (e === null || e === void 0 ? void 0 : e.nombre)) || (i === 0 ? 'Local' : 'Visitante') }));
    }, [partido]);
    const jugadores = useMemo(() => convocados
        .filter((c) => c.rol !== 'entrenador' && idDe(c.jugador))
        .map((c) => {
        var _a;
        const j = c.jugador;
        const nombre = typeof j === 'object' && j ? j.alias || [j.nombre, j.apellido].filter(Boolean).join(' ') : '';
        return { id: idDe(j), nombre: nombre || 'Jugador', numero: (_a = c.numero) !== null && _a !== void 0 ? _a : null, equipo: idDe(c.equipo) };
    }), [convocados]);
    if (error)
        return _jsx("p", { className: "text-sm text-red-700", children: error });
    if (!partido)
        return _jsx("p", { className: "text-sm text-muted", children: "Cargando partido\u2026" });
    const reloj = obtenerTiempo !== null && obtenerTiempo !== void 0 ? obtenerTiempo : (videos.length ? () => { var _a, _b; return (_b = (_a = reproductor.current) === null || _a === void 0 ? void 0 : _a.segundoPartido()) !== null && _b !== void 0 ? _b : null; } : undefined);
    return (_jsxs("div", { className: "space-y-3", children: [!obtenerTiempo && videos.length > 0 && _jsx(ReproductorPartido, { ref: reproductor, videos: videos }), !obtenerTiempo && videos.length === 0 && (_jsx("p", { className: "rounded-lg bg-slate-50 p-3 text-sm text-muted", children: "El partido no tiene video: los tiempos se toman con el cron\u00F3metro del set." })), !obtenerTiempo && (_jsxs("div", { children: [_jsx("button", { type: "button", onClick: () => setVerCamaras((v) => !v), className: "text-sm text-brand-700 hover:underline", children: verCamaras ? 'Ocultar cámaras' : `Cámaras del partido (${videos.length})` }), verCamaras && (_jsx("div", { className: "mt-2", children: _jsx(CamarasPartido, { api: api, partidoId: partidoId, videos: videos, onGuardado: setVideos, soloLectura: soloLectura }) }))] })), jugadores.length === 0 && (_jsx("p", { className: "text-sm text-amber-700", children: "El partido no tiene jugadores convocados: carg\u00E1 la convocatoria para poder marcar outs." })), _jsx(CapturaSet, { api: api, refSet: { setPartido: setPartidoId }, equipos: equipos, jugadores: jugadores, obtenerTiempo: reloj, irA: obtenerTiempo ? undefined : (s) => { var _a; return (_a = reproductor.current) === null || _a === void 0 ? void 0 : _a.irA(s); }, soloLectura: soloLectura, origen: origen, onCambio: () => onCambio === null || onCambio === void 0 ? void 0 : onCambio() })] }));
};
export default CapturaSetOficial;
//# sourceMappingURL=CapturaSetOficial.js.map