import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
import CamarasPartido from './CamarasPartido';
import ReproductorPartido from './ReproductorPartido';
import { cortarDesde, formatearSegundos, leerSegundos } from './reloj';
const COLOR_GANADOR = {
    local: 'bg-sky-500',
    visitante: 'bg-amber-500',
    empate: 'bg-slate-500',
    pendiente: 'bg-slate-300',
};
const PartidoCompleto = ({ api, videos, destinoCamaras, onVideos, equipos, sets, ventana = null, refDe, crearSet, onCambio, soloLectura, className = '', }) => {
    var _a, _b;
    const reproductor = useRef(null);
    const [ahora, setAhora] = useState(0);
    const [inicioPendiente, setInicioPendiente] = useState(null);
    const [editando, setEditando] = useState(null);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState(null);
    const [verCamaras, setVerCamaras] = useState(false);
    // El cursor sigue al video.
    useEffect(() => {
        if (!videos.length)
            return undefined;
        const t = window.setInterval(() => { var _a, _b; return setAhora((_b = (_a = reproductor.current) === null || _a === void 0 ? void 0 : _a.segundoPartido()) !== null && _b !== void 0 ? _b : 0); }, 500);
        return () => window.clearInterval(t);
    }, [videos.length]);
    const ordenados = useMemo(() => [...sets].sort((a, b) => a.numeroSet - b.numeroSet), [sets]);
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
    /** Un set que ubicó la consola, revisado: queda confirmado donde está. */
    const confirmarConsola = (s) => void correr(() => api.guardarTiempo(refDe(s.id), { ...s.tiempo, origen: 'en_vivo', confirmado: true }, { marcarAhora: false }));
    /** Inicio o fin del partido en el cabezal (diferido). */
    const marcarVentana = (cual) => {
        var _a, _b;
        const t = segundo();
        const v = { desde: (_a = ventana === null || ventana === void 0 ? void 0 : ventana.desde) !== null && _a !== void 0 ? _a : null, hasta: (_b = ventana === null || ventana === void 0 ? void 0 : ventana.hasta) !== null && _b !== void 0 ? _b : null };
        v[cual] = t;
        if (v.desde != null && v.hasta != null && v.hasta <= v.desde) {
            setError('El fin del partido tiene que ser después del inicio.');
            return;
        }
        void correr(() => api.guardarVentana(destinoCamaras, v));
    };
    /**
     * El video perdió un pedazo antes de este set (se cortó la transmisión, se editó): el set empieza
     * en el segundo de video que se está viendo. Desde un poco antes de acá, la cámara actual se corre
     * para que coincida; lo anterior no se mueve. Los sets y marcas no cambian: cambia el video.
     */
    const videoCortadoAca = (s) => {
        var _a;
        const cam = (_a = reproductor.current) === null || _a === void 0 ? void 0 : _a.camaraActual();
        if (!cam || !s.tiempo)
            return;
        const video = videos[cam.indice];
        const nuevoD = s.tiempo.desde - cam.segundoCamara;
        const tramos = cortarDesde(video, Math.max(0, cam.segundoCamara - 5), nuevoD);
        const lista = videos.map((v, i) => (i === cam.indice ? { ...v, tramos } : v));
        void correr(async () => {
            const r = 'planillaId' in destinoCamaras
                ? await api.guardarVideosPlanilla(destinoCamaras.planillaId, lista)
                : await api.guardarVideos(destinoCamaras.partidoId, lista);
            onVideos === null || onVideos === void 0 ? void 0 : onVideos(r.videos);
        });
    };
    const deConsola = (s) => { var _a; return ((_a = s.tiempo) === null || _a === void 0 ? void 0 : _a.origen) === 'en_vivo' && !s.tiempo.confirmado; };
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
        const desde = leerSegundos(editando.desde);
        const hasta = leerSegundos(editando.hasta);
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
    return (_jsxs("div", { className: `space-y-4 text-sm ${className}`, children: [videos.length > 0 ? (_jsx(ReproductorPartido, { ref: reproductor, videos: videos })) : (_jsx("p", { className: "rounded-lg bg-slate-50 p-3 text-muted", children: "Este partido no tiene video. Agreg\u00E1 uno en \u00ABC\u00E1maras\u00BB para marcar d\u00F3nde est\u00E1 cada set; sin video igual pod\u00E9s cargar los sets y sus ganadores." })), _jsxs("div", { children: [_jsx("button", { type: "button", onClick: () => setVerCamaras((v) => !v), className: "text-brand-700 hover:underline", children: verCamaras ? 'Ocultar cámaras' : `Cámaras (${videos.length})` }), verCamaras && (_jsx("div", { className: "mt-2", children: _jsx(CamarasPartido, { api: api, ...destinoCamaras, videos: videos, onGuardado: (v) => onVideos === null || onVideos === void 0 ? void 0 : onVideos(v), soloLectura: soloLectura }) }))] }), _jsxs("section", { "aria-label": "L\u00EDnea de tiempo del partido", className: "rounded-lg border border-slate-200 p-3", children: [_jsxs("div", { className: "mb-2 flex flex-wrap items-baseline justify-between gap-2", children: [_jsxs("p", { className: "font-semibold", children: [equipos.local.nombre, " ", ganados('local'), " \u2013 ", ganados('visitante'), " ", equipos.visitante.nombre] }), _jsxs("p", { className: "tabular-nums text-muted", children: [ordenados.length, " set", ordenados.length === 1 ? '' : 's', " \u00B7 jugado ", formatearSegundos(totalJugado)] })] }), _jsxs("div", { className: "relative h-8 overflow-hidden rounded bg-slate-100", children: [(ventana === null || ventana === void 0 ? void 0 : ventana.desde) != null && (_jsx("div", { title: "Antes de que empiece el partido", className: "absolute top-0 h-full bg-slate-300/60", style: { left: 0, width: pct(ventana.desde) } })), (ventana === null || ventana === void 0 ? void 0 : ventana.hasta) != null && (_jsx("div", { title: "Despu\u00E9s de que termina el partido", className: "absolute top-0 h-full bg-slate-300/60", style: { left: pct(ventana.hasta), right: 0 } })), conTiempo.map((s) => (_jsx("button", { type: "button", title: `Set ${s.numeroSet}: ${formatearSegundos(s.tiempo.desde)} → ${formatearSegundos(s.tiempo.hasta)} · ${nombre(s.ganadorSet)}`, "aria-label": `Ir al set ${s.numeroSet}`, onClick: () => { var _a; return (_a = reproductor.current) === null || _a === void 0 ? void 0 : _a.irA(s.tiempo.desde); }, className: `absolute top-0 h-full ${COLOR_GANADOR[s.ganadorSet]} text-2xs font-bold text-white hover:opacity-80 ${deConsola(s) ? 'border-2 border-dashed border-white opacity-70' : ''}`, style: { left: pct(s.tiempo.desde), width: pct(s.tiempo.hasta - s.tiempo.desde) }, children: s.numeroSet }, s.id))), inicioPendiente != null && (_jsx("div", { className: "absolute top-0 h-full bg-brand-300/70", style: { left: pct(inicioPendiente), width: pct(Math.max(0, ahora - inicioPendiente)) } })), videos.length > 0 && _jsx("div", { className: "absolute top-0 h-full w-0.5 bg-red-600", style: { left: pct(ahora) } })] }), _jsxs("div", { className: "mt-1 flex justify-between text-2xs tabular-nums text-muted", children: [_jsx("span", { children: "0:00" }), _jsx("span", { children: formatearSegundos(ahora) }), _jsx("span", { children: formatearSegundos(largo) })] }), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2 text-xs", children: [_jsx("span", { className: "font-semibold text-slate-700", children: "Partido:" }), _jsxs("span", { className: "tabular-nums", children: [(ventana === null || ventana === void 0 ? void 0 : ventana.desde) != null ? formatearSegundos(ventana.desde) : '¿inicio?', " \u2192 ", (ventana === null || ventana === void 0 ? void 0 : ventana.hasta) != null ? formatearSegundos(ventana.hasta) : '¿fin?', (ventana === null || ventana === void 0 ? void 0 : ventana.desde) != null && (ventana === null || ventana === void 0 ? void 0 : ventana.hasta) != null && _jsxs("span", { className: "text-muted", children: [" (", formatearSegundos(ventana.hasta - ventana.desde), ")"] })] }), ventana && (_jsxs("span", { className: "rounded-full bg-slate-100 px-2 py-0.5 text-2xs text-slate-600", children: [ventana.origen === 'en_vivo' ? 'en vivo (consola)' : ventana.origen === 'cv' ? 'propuesto' : 'diferido', !ventana.confirmado && ' · sin confirmar'] })), !soloLectura && videos.length > 0 && (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", disabled: guardando, onClick: () => marcarVentana('desde'), className: "text-brand-700 hover:underline", children: "El partido empieza ac\u00E1" }), _jsx("button", { type: "button", disabled: guardando, onClick: () => marcarVentana('hasta'), className: "text-brand-700 hover:underline", children: "termina ac\u00E1" })] }))] }), !soloLectura && (_jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2", children: [videos.length > 0 && inicioPendiente == null && (_jsxs("button", { type: "button", disabled: guardando, onClick: () => setInicioPendiente(segundo()), className: "rounded bg-slate-800 px-3 py-1.5 font-semibold text-white hover:bg-slate-700 disabled:opacity-50", children: ["Empieza el set ", siguiente, " ac\u00E1"] })), inicioPendiente != null && (_jsxs(_Fragment, { children: [_jsxs("span", { className: "tabular-nums text-muted", children: ["Set ", siguiente, " desde ", formatearSegundos(inicioPendiente), "\u2026"] }), _jsx("button", { type: "button", disabled: guardando, onClick: terminarAca, className: "rounded bg-slate-800 px-3 py-1.5 font-semibold text-white hover:bg-slate-700 disabled:opacity-50", children: "Termina ac\u00E1" }), _jsx("button", { type: "button", onClick: () => setInicioPendiente(null), className: "px-2 py-1 text-muted hover:underline", children: "Cancelar" })] })), _jsxs("button", { type: "button", disabled: guardando, onClick: () => void correr(() => crearSet(siguiente)), className: "rounded px-2 py-1.5 text-brand-700 hover:underline disabled:opacity-50", children: ["+ Set ", siguiente, " sin tiempo"] })] })), error && _jsx("p", { role: "alert", className: "mt-2 text-red-700", children: error })] }), ordenados.length > 0 && (_jsx("ol", { className: "divide-y divide-slate-100 rounded-lg border border-slate-200", children: ordenados.map((s) => (_jsxs("li", { className: "flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2", children: [_jsxs("span", { className: "w-12 font-semibold", children: ["Set ", s.numeroSet] }), deConsola(s) && (_jsx("span", { title: "Lo ubic\u00F3 la consola de Overtime-Partido con la hora real: revisalo y confirmalo", className: "rounded-full bg-amber-100 px-2 py-0.5 text-2xs font-semibold text-amber-800", children: "consola" })), (editando === null || editando === void 0 ? void 0 : editando.id) === s.id ? (_jsxs("form", { className: "flex flex-wrap items-center gap-2", onSubmit: (e) => {
                                e.preventDefault();
                                guardarEdicion();
                            }, onKeyDown: (e) => e.key === 'Escape' && setEditando(null), children: [_jsxs("label", { className: "sr-only", htmlFor: `pc-desde-${s.id}`, children: ["Inicio del set ", s.numeroSet] }), _jsx("input", { id: `pc-desde-${s.id}`, autoFocus: true, value: editando.desde, onChange: (e) => setEditando({ ...editando, desde: e.target.value, error: undefined }), className: "w-16 rounded border border-slate-300 px-1.5 py-0.5 tabular-nums" }), _jsx("span", { "aria-hidden": true, children: "\u2192" }), _jsxs("label", { className: "sr-only", htmlFor: `pc-hasta-${s.id}`, children: ["Fin del set ", s.numeroSet] }), _jsx("input", { id: `pc-hasta-${s.id}`, value: editando.hasta, onChange: (e) => setEditando({ ...editando, hasta: e.target.value, error: undefined }), className: "w-16 rounded border border-slate-300 px-1.5 py-0.5 tabular-nums" }), _jsx("button", { type: "submit", className: "rounded bg-brand-600 px-2 py-0.5 font-semibold text-white", children: "Guardar" }), _jsx("button", { type: "button", onClick: () => setEditando(null), className: "text-muted hover:underline", children: "Cancelar" }), editando.error && _jsx("span", { role: "alert", className: "w-full text-xs text-red-700", children: editando.error })] })) : (_jsxs("span", { className: "flex flex-wrap items-center gap-2 tabular-nums", children: [s.tiempo ? (_jsxs("button", { type: "button", onClick: () => { var _a; return (_a = reproductor.current) === null || _a === void 0 ? void 0 : _a.irA(s.tiempo.desde); }, className: "hover:underline", children: [formatearSegundos(s.tiempo.desde), " \u2192 ", formatearSegundos(s.tiempo.hasta), ' ', _jsxs("span", { className: "text-muted", children: ["(", formatearSegundos(s.tiempo.hasta - s.tiempo.desde), ")"] })] })) : (_jsx("span", { className: "text-muted", children: "sin tiempo" })), !soloLectura && deConsola(s) && (_jsx("button", { type: "button", disabled: guardando, onClick: () => confirmarConsola(s), className: "text-2xs font-semibold text-emerald-700 hover:underline", children: "\u2713 confirmar" })), !soloLectura && videos.length > 0 && s.tiempo && (_jsx("button", { type: "button", disabled: guardando, onClick: () => videoCortadoAca(s), title: "El video perdi\u00F3 un pedazo antes de este set: llev\u00E1 el video al arranque real del set y toc\u00E1 esto. Se corre el video desde ac\u00E1, no el set", className: "text-2xs text-brand-700 hover:underline", children: "el video se cort\u00F3: empieza ac\u00E1" })), !soloLectura && videos.length > 0 && (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", disabled: guardando, onClick: () => marcarExtremo(s, 'desde'), className: "text-2xs text-brand-700 hover:underline", children: "inicio = ahora" }), _jsx("button", { type: "button", disabled: guardando, onClick: () => marcarExtremo(s, 'hasta'), className: "text-2xs text-brand-700 hover:underline", children: "fin = ahora" })] })), !soloLectura && (_jsx("button", { type: "button", onClick: () => setEditando({
                                        id: s.id,
                                        desde: s.tiempo ? formatearSegundos(s.tiempo.desde) : '',
                                        hasta: s.tiempo ? formatearSegundos(s.tiempo.hasta) : '',
                                    }), className: "text-2xs text-brand-700 hover:underline", children: "editar" }))] })), _jsx("span", { className: "ml-auto flex flex-wrap items-center gap-1", role: "group", "aria-label": `Ganador del set ${s.numeroSet}`, children: ['local', 'visitante', 'empate'].map((g) => (_jsx("button", { type: "button", disabled: soloLectura || guardando, "aria-pressed": s.ganadorSet === g, onClick: () => void correr(() => api.guardarGanador(refDe(s.id), s.ganadorSet === g ? 'pendiente' : g)), className: `rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 transition disabled:cursor-default ${s.ganadorSet === g
                                    ? `${COLOR_GANADOR[g]} text-white ring-transparent`
                                    : 'bg-white text-slate-600 ring-slate-300 hover:bg-slate-50'}`, children: nombre(g) }, g))) })] }, s.id))) }))] }));
};
export default PartidoCompleto;
//# sourceMappingURL=PartidoCompleto.js.map