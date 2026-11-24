"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const reloj_1 = require("./reloj");
const supervivencia_1 = require("./supervivencia");
const COLORES = ['bg-sky-500', 'bg-amber-500'];
const TEXTO = ['text-sky-700', 'text-amber-700'];
const etiquetaJugador = (j) => (j ? `${j.numero != null ? `#${j.numero} ` : ''}${j.nombre}` : '¿?');
function useCronometro() {
    const [base, setBase] = (0, react_1.useState)(0);
    const [desde, setDesde] = (0, react_1.useState)(null);
    const [, forzar] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        if (desde == null)
            return undefined;
        const t = window.setInterval(() => forzar((x) => x + 1), 500);
        return () => window.clearInterval(t);
    }, [desde]);
    const valor = () => base + (desde != null ? (Date.now() - desde) / 1000 : 0);
    return {
        corriendo: desde != null,
        valor,
        alternar: () => {
            if (desde != null) {
                setBase(valor());
                setDesde(null);
            }
            else
                setDesde(Date.now());
        },
        fijar: (s) => {
            setBase(s);
            if (desde != null)
                setDesde(Date.now());
        },
    };
}
const CapturaSet = ({ api, refSet, equipos, jugadores, obtenerTiempo, irA, soloLectura, origen = 'manual', onCambio, className = '', }) => {
    var _a, _b, _c, _d, _e, _f;
    const [estado, setEstado] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const [guardando, setGuardando] = (0, react_1.useState)(false);
    const [pendiente, setPendiente] = (0, react_1.useState)(null);
    const [editandoAlineacion, setEditandoAlineacion] = (0, react_1.useState)(false);
    const [borradorAlineacion, setBorradorAlineacion] = (0, react_1.useState)(new Set());
    /** Editor en línea del tiempo del set (inicio y duración en m:ss). null = cerrado. */
    const [editTiempo, setEditTiempo] = (0, react_1.useState)(null);
    const crono = useCronometro();
    const enVivo = origen === 'en_vivo';
    // En vivo el "ahora" es la hora real del servidor pasada por el reloj del partido (no el reloj
    // de juego, que se frena en pausas): así el cursor coincide con donde el servidor guarda la marca.
    const desfaseServidor = (0, react_1.useRef)(0);
    const [, latir] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        if (!enVivo)
            return undefined;
        const t = window.setInterval(() => latir((x) => x + 1), 1000);
        return () => window.clearInterval(t);
    }, [enVivo]);
    const claveSet = (_a = refSet.setPartido) !== null && _a !== void 0 ? _a : refSet.planillaSet;
    const onCambioRef = (0, react_1.useRef)(onCambio);
    onCambioRef.current = onCambio;
    const aplicar = (0, react_1.useCallback)((e) => {
        var _a;
        if (e.ahoraServidor)
            desfaseServidor.current = e.ahoraServidor - Date.now();
        setEstado(e);
        setError(null);
        (_a = onCambioRef.current) === null || _a === void 0 ? void 0 : _a.call(onCambioRef, e);
    }, []);
    const correr = (0, react_1.useCallback)(async (fn) => {
        setGuardando(true);
        try {
            aplicar(await fn());
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'No se pudo guardar');
        }
        finally {
            setGuardando(false);
        }
    }, [aplicar]);
    (0, react_1.useEffect)(() => {
        let vivo = true;
        setEstado(null);
        api.leer(refSet)
            .then((e) => {
            if (!vivo)
                return;
            if (e.ahoraServidor)
                desfaseServidor.current = e.ahoraServidor - Date.now();
            setEstado(e);
        })
            .catch((e) => vivo && setError(e instanceof Error ? e.message : 'No se pudo cargar el set'));
        return () => {
            vivo = false;
        };
        // refSet es un objeto nuevo en cada render del padre: la identidad del set es la clave.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api, claveSet]);
    const porId = (0, react_1.useMemo)(() => new Map(jugadores.map((j) => [j.id, j])), [jugadores]);
    const tiempo = (_b = estado === null || estado === void 0 ? void 0 : estado.set.tiempo) !== null && _b !== void 0 ? _b : null;
    const inicio = (_c = tiempo === null || tiempo === void 0 ? void 0 : tiempo.desde) !== null && _c !== void 0 ? _c : 0;
    const segundoEnVivo = () => {
        const reloj = estado === null || estado === void 0 ? void 0 : estado.relojEnVivo;
        if (!reloj)
            return 0; // la primera marca en vivo ancla el reloj en 0
        const ahoraMs = Date.now() + desfaseServidor.current;
        return Math.max(0, Math.round((reloj.segundo + (ahoraMs - new Date(reloj.ancla).getTime()) / 1000) * 10) / 10);
    };
    /** Segundo "ahora": en vivo, el reloj del partido; si no, el del video o el cronómetro. */
    const ahora = () => {
        if (enVivo)
            return segundoEnVivo();
        const v = obtenerTiempo === null || obtenerTiempo === void 0 ? void 0 : obtenerTiempo();
        if (v != null)
            return Math.round(v * 10) / 10;
        return Math.round((inicio + crono.valor()) * 10) / 10;
    };
    const alineados = (0, react_1.useMemo)(() => { var _a; return ((_a = estado === null || estado === void 0 ? void 0 : estado.alineacion) !== null && _a !== void 0 ? _a : []).map((a) => ({ id: a.jugador, lado: a.equipo })); }, [estado]);
    const filas = (0, react_1.useMemo)(() => (estado ? (0, supervivencia_1.lineaDeTiempo)(alineados, estado.eventos, inicio) : []), [estado, alineados, inicio]);
    const tRef = enVivo ? segundoEnVivo() : obtenerTiempo ? ((_d = obtenerTiempo()) !== null && _d !== void 0 ? _d : inicio) : inicio + crono.valor();
    const vivos = (0, supervivencia_1.vivosPorLado)(filas, tRef);
    // --- acciones -------------------------------------------------------------------------------
    const marcarTiempo = (cual, valor = ahora()) => {
        var _a, _b;
        const nuevo = { desde: (_a = tiempo === null || tiempo === void 0 ? void 0 : tiempo.desde) !== null && _a !== void 0 ? _a : valor, hasta: (_b = tiempo === null || tiempo === void 0 ? void 0 : tiempo.hasta) !== null && _b !== void 0 ? _b : valor + 1, origen, confirmado: true };
        nuevo[cual] = valor;
        if (nuevo.hasta <= nuevo.desde) {
            if (cual === 'desde')
                nuevo.hasta = nuevo.desde + 1;
            else
                return setError('El fin tiene que ser después del inicio');
        }
        return correr(() => api.guardarTiempo(refSet, nuevo));
    };
    const marcarOut = (jugador, equipo, motivo) => {
        const t = ahora();
        if (motivo === 'hit' || motivo === 'catch') {
            setPendiente({ jugador, equipo, motivo, t });
            return;
        }
        void correr(() => api.agregarEvento(refSet, { t, tipo: 'out', jugador, equipo, motivo, origen }));
    };
    const confirmarPor = (por) => {
        if (!pendiente)
            return;
        const { jugador, equipo, motivo, t } = pendiente;
        setPendiente(null);
        void correr(() => api.agregarEvento(refSet, { t, tipo: 'out', jugador, equipo, motivo, por, origen }));
    };
    const reingreso = (jugador, equipo) => correr(() => api.agregarEvento(refSet, { t: ahora(), tipo: 'reingreso', jugador, equipo, origen }));
    const abrirAlineacion = () => {
        setBorradorAlineacion(new Set((estado === null || estado === void 0 ? void 0 : estado.alineacionCargada) ? estado.alineacion.map((a) => a.jugador) : []));
        setEditandoAlineacion(true);
    };
    const guardarAlineacion = () => {
        const lista = jugadores.filter((j) => borradorAlineacion.has(j.id)).map((j) => ({ jugador: j.id, equipo: j.equipo }));
        setEditandoAlineacion(false);
        void correr(() => api.guardarAlineacion(refSet, lista));
    };
    // --- render ---------------------------------------------------------------------------------
    if (error && !estado)
        return (0, jsx_runtime_1.jsx)("p", { className: `text-sm text-red-700 ${className}`, children: error });
    if (!estado)
        return (0, jsx_runtime_1.jsx)("p", { className: `text-sm text-muted ${className}`, children: "Cargando set\u2026" });
    const fin = (_e = tiempo === null || tiempo === void 0 ? void 0 : tiempo.hasta) !== null && _e !== void 0 ? _e : Math.max(inicio + 60, ...estado.eventos.map((e) => e.t + 5), tRef);
    const dur = Math.max(1, fin - inicio);
    const pct = (t) => `${Math.max(0, Math.min(100, ((t - inicio) / dur) * 100))}%`;
    const idxEquipo = (id) => Math.max(0, equipos.findIndex((e) => e.id === id));
    const ultimoCatch = [...estado.eventos].reverse().find((e) => e.tipo === 'out' && e.motivo === 'catch');
    return ((0, jsx_runtime_1.jsxs)("div", { className: `space-y-4 text-sm ${className}`, children: [(0, jsx_runtime_1.jsxs)("section", { className: "flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 p-3", children: [(0, jsx_runtime_1.jsxs)("span", { className: "font-semibold", children: ["Set ", estado.set.numeroSet] }), (0, jsx_runtime_1.jsx)("span", { className: "tabular-nums text-muted", children: tiempo ? `${(0, reloj_1.formatearSegundos)(tiempo.desde)} → ${(0, reloj_1.formatearSegundos)(tiempo.hasta)} · dura ${(0, reloj_1.formatearSegundos)(tiempo.hasta - tiempo.desde)}` : 'sin tiempo marcado' }), !soloLectura && ((0, jsx_runtime_1.jsxs)("span", { className: "ml-auto flex flex-wrap items-center gap-2", children: [!obtenerTiempo && !enVivo && ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: crono.alternar, className: "rounded bg-slate-100 px-2 py-1 font-semibold hover:bg-slate-200", children: [crono.corriendo ? '⏸' : '▶', " ", (0, reloj_1.formatearSegundos)(crono.valor())] })), (0, jsx_runtime_1.jsx)("button", { type: "button", disabled: guardando, onClick: () => void marcarTiempo('desde'), className: "rounded bg-slate-800 px-2 py-1 font-semibold text-white hover:bg-slate-700 disabled:opacity-50", children: "Empieza ac\u00E1" }), (0, jsx_runtime_1.jsx)("button", { type: "button", disabled: guardando, onClick: () => void marcarTiempo('hasta'), className: "rounded bg-slate-800 px-2 py-1 font-semibold text-white hover:bg-slate-700 disabled:opacity-50", children: "Termina ac\u00E1" }), !editTiempo && ((0, jsx_runtime_1.jsx)("button", { type: "button", className: "rounded px-2 py-1 text-brand-700 hover:underline", onClick: () => {
                                    var _a;
                                    return setEditTiempo({
                                        desde: (0, reloj_1.formatearSegundos)((_a = tiempo === null || tiempo === void 0 ? void 0 : tiempo.desde) !== null && _a !== void 0 ? _a : inicio),
                                        dura: tiempo ? (0, reloj_1.formatearSegundos)(tiempo.hasta - tiempo.desde) : '',
                                    });
                                }, children: tiempo ? 'Editar tiempo' : 'Cargar duración' }))] })), !soloLectura && editTiempo && ((0, jsx_runtime_1.jsxs)("form", { className: "flex w-full flex-wrap items-end gap-2 border-t border-slate-100 pt-2", onSubmit: (ev) => {
                            ev.preventDefault();
                            const d0 = (0, reloj_1.leerSegundos)(editTiempo.desde);
                            const d = (0, reloj_1.leerSegundos)(editTiempo.dura);
                            if (d0 == null || d0 < 0)
                                return setEditTiempo({ ...editTiempo, error: 'El inicio tiene que ser m:ss (por ejemplo 3:12).' });
                            if (d == null || d <= 0)
                                return setEditTiempo({ ...editTiempo, error: 'La duración tiene que ser m:ss y mayor a 0.' });
                            setEditTiempo(null);
                            void correr(() => api.guardarTiempo(refSet, { desde: d0, hasta: d0 + d, origen, confirmado: true }));
                        }, onKeyDown: (ev) => ev.key === 'Escape' && setEditTiempo(null), children: [(0, jsx_runtime_1.jsxs)("label", { className: "flex flex-col text-2xs font-semibold text-muted", children: ["Empieza (m:ss)", (0, jsx_runtime_1.jsx)("input", { autoFocus: true, inputMode: "numeric", value: editTiempo.desde, onChange: (ev) => setEditTiempo({ ...editTiempo, desde: ev.target.value, error: undefined }), className: "w-20 rounded border border-slate-300 px-2 py-1 text-sm font-normal tabular-nums text-slate-900" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "flex flex-col text-2xs font-semibold text-muted", children: ["Dura (m:ss)", (0, jsx_runtime_1.jsx)("input", { inputMode: "numeric", placeholder: "3:00", value: editTiempo.dura, onChange: (ev) => setEditTiempo({ ...editTiempo, dura: ev.target.value, error: undefined }), className: "w-20 rounded border border-slate-300 px-2 py-1 text-sm font-normal tabular-nums text-slate-900" })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: guardando, className: "rounded bg-brand-600 px-2 py-1 font-semibold text-white hover:bg-brand-700 disabled:opacity-50", children: "Guardar" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setEditTiempo(null), className: "rounded px-2 py-1 text-muted hover:underline", children: "Cancelar" }), editTiempo.error && ((0, jsx_runtime_1.jsx)("p", { role: "alert", className: "w-full text-xs text-red-700", children: editTiempo.error }))] }))] }), error && (0, jsx_runtime_1.jsx)("p", { className: "text-red-700", role: "alert", children: error }), (editandoAlineacion || (!estado.alineacionCargada && !soloLectura)) ? ((0, jsx_runtime_1.jsxs)("section", { className: "rounded-lg border border-slate-200 p-3", children: [(0, jsx_runtime_1.jsx)("p", { className: "mb-2 font-semibold", children: "\u00BFQui\u00E9nes arrancan el set?" }), (0, jsx_runtime_1.jsx)("div", { className: "grid gap-3 sm:grid-cols-2", children: equipos.map((eq, i) => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: `mb-1 text-xs font-semibold uppercase ${TEXTO[i]}`, children: eq.nombre }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1", children: jugadores.filter((j) => j.equipo === eq.id).map((j) => {
                                        const sel = borradorAlineacion.has(j.id);
                                        return ((0, jsx_runtime_1.jsx)("button", { type: "button", "aria-pressed": sel, onClick: () => setBorradorAlineacion((prev) => {
                                                const n = new Set(prev);
                                                if (sel)
                                                    n.delete(j.id);
                                                else
                                                    n.add(j.id);
                                                return n;
                                            }), className: `rounded-full border px-2 py-0.5 ${sel ? 'border-transparent bg-slate-800 text-white' : 'border-slate-300 hover:bg-slate-50'}`, children: etiquetaJugador(j) }, j.id));
                                    }) }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-2xs text-muted", children: [jugadores.filter((j) => j.equipo === eq.id && borradorAlineacion.has(j.id)).length, " elegidos"] })] }, eq.id))) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-3 flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: guardarAlineacion, disabled: guardando, className: "rounded bg-brand-600 px-3 py-1.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-50", children: "Guardar alineaci\u00F3n" }), estado.alineacionCargada && ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setEditandoAlineacion(false), className: "rounded px-3 py-1.5 hover:bg-slate-100", children: "Cancelar" }))] }), !estado.alineacionCargada && ((0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-2xs text-muted", children: "Mientras no la cargues, se usan todos los presentes (la cuenta de vivos puede no dar)." }))] })) : null, (0, jsx_runtime_1.jsx)("section", { className: "grid gap-3 sm:grid-cols-2", children: equipos.map((eq, i) => {
                    var _a;
                    const propias = filas.filter((f) => f.lado === eq.id);
                    const sugerido = ultimoCatch && ultimoCatch.equipo !== eq.id ? (0, supervivencia_1.sugerirReingreso)(filas, eq.id, ultimoCatch.t) : null;
                    return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border border-slate-200 p-3", children: [(0, jsx_runtime_1.jsxs)("p", { className: "mb-2 flex items-baseline justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: `font-semibold ${TEXTO[i]}`, children: eq.nombre }), (0, jsx_runtime_1.jsxs)("span", { className: "tabular-nums text-lg font-bold", children: [(_a = vivos[eq.id]) !== null && _a !== void 0 ? _a : 0, " ", (0, jsx_runtime_1.jsx)("span", { className: "text-2xs font-normal text-muted", children: "vivos" })] })] }), (0, jsx_runtime_1.jsx)("ul", { className: "space-y-1", children: propias.map((f) => {
                                    const j = porId.get(f.id);
                                    const vivo = (0, supervivencia_1.estaVivo)(f, tRef);
                                    return ((0, jsx_runtime_1.jsxs)("li", { className: `flex items-center gap-2 rounded px-1 py-0.5 ${vivo ? '' : 'opacity-60'}`, children: [(0, jsx_runtime_1.jsx)("span", { className: `h-2 w-2 shrink-0 rounded-full ${vivo ? COLORES[i] : 'bg-slate-300'}`, "aria-hidden": "true" }), (0, jsx_runtime_1.jsxs)("span", { className: "min-w-0 flex-1 truncate", children: [etiquetaJugador(j), f.entra ? ' (entró)' : ''] }), !soloLectura && vivo && supervivencia_1.MOTIVOS.map((m) => ((0, jsx_runtime_1.jsx)("button", { type: "button", disabled: guardando, onClick: () => marcarOut(f.id, eq.id, m.id), title: `Out por ${m.label}`, "aria-label": `${etiquetaJugador(j)}: out por ${m.label}`, className: "w-7 rounded bg-red-50 py-0.5 text-2xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50", children: m.atajo }, m.id))), !soloLectura && !vivo && ((0, jsx_runtime_1.jsx)("button", { type: "button", disabled: guardando, onClick: () => void reingreso(f.id, eq.id), className: `rounded px-2 py-0.5 text-2xs font-semibold ${sugerido === f.id ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'}`, title: sugerido === f.id ? 'Le toca volver por el último catch' : 'Vuelve a la cancha', children: "Vuelve" }))] }, f.id));
                                }) })] }, eq.id));
                }) }), !soloLectura && estado.alineacionCargada && ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: abrirAlineacion, className: "text-xs text-brand-700 hover:underline", children: "Editar alineaci\u00F3n" })), pendiente && ((0, jsx_runtime_1.jsxs)("section", { className: "rounded-lg border-2 border-red-300 bg-red-50 p-3", role: "dialog", "aria-label": "Qui\u00E9n lo sac\u00F3", children: [(0, jsx_runtime_1.jsxs)("p", { className: "mb-2 font-semibold", children: [pendiente.motivo === 'hit' ? '¿Quién tiró?' : '¿Quién atajó?', ' ', (0, jsx_runtime_1.jsxs)("span", { className: "font-normal text-muted", children: ["(", etiquetaJugador(porId.get(pendiente.jugador)), " \u00B7 ", (0, reloj_1.formatearSegundos)(pendiente.t), ")"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-1", children: [filas.filter((f) => f.lado !== pendiente.equipo && (0, supervivencia_1.estaVivo)(f, pendiente.t)).map((f) => ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => confirmarPor(f.id), className: "rounded-full border border-slate-300 bg-white px-2 py-0.5 hover:bg-slate-50", children: etiquetaJugador(porId.get(f.id)) }, f.id))), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => confirmarPor(null), className: "rounded-full px-2 py-0.5 text-muted hover:bg-white", children: "No s\u00E9" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setPendiente(null), className: "rounded-full px-2 py-0.5 text-red-700 hover:bg-white", children: "Cancelar" })] })] })), (0, jsx_runtime_1.jsxs)("section", { className: "rounded-lg border border-slate-200 p-3", children: [(0, jsx_runtime_1.jsx)("p", { className: "mb-2 font-semibold", children: "L\u00EDnea de tiempo" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: filas.map((f) => {
                            const i = idxEquipo(f.lado);
                            const marcas = estado.eventos.filter((e) => e.jugador === f.id && e.tipo === 'out');
                            return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: `w-28 shrink-0 truncate text-2xs ${TEXTO[i]}`, children: etiquetaJugador(porId.get(f.id)) }), (0, jsx_runtime_1.jsxs)("div", { className: "relative h-3 flex-1 rounded bg-slate-100", children: [f.tramos.map(([a, b], k) => ((0, jsx_runtime_1.jsx)("i", { className: `absolute inset-y-0 rounded ${COLORES[i]}`, style: { left: pct(a), width: `calc(${pct(b !== null && b !== void 0 ? b : fin)} - ${pct(a)})` } }, k))), marcas.map((m) => ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => irA === null || irA === void 0 ? void 0 : irA(m.t), title: `${(0, reloj_1.formatearSegundos)(m.t)} · out por ${m.motivo}`, className: "absolute -top-0.5 h-4 w-1.5 -translate-x-1/2 rounded-sm bg-red-600", style: { left: pct(m.t) } }, m._id)))] })] }, f.id));
                        }) }), !enVivo && !soloLectura && obtenerTiempo && estado.relojEnVivo && !estado.relojEnVivo.alineado
                        && estado.eventos.some((e) => e.hora) && ((0, jsx_runtime_1.jsx)("p", { className: "mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900", children: "Las marcas en vivo (\u25CF) todav\u00EDa no est\u00E1n alineadas con el video. Llev\u00E1 el video al momento exacto de una de ellas y toc\u00E1 \u00ABEs ac\u00E1\u00BB en esa marca: se corren todas las del partido." })), estado.eventos.length > 0 && ((0, jsx_runtime_1.jsx)("ol", { className: "mt-3 flex flex-wrap gap-1", children: estado.eventos.map((e) => ((0, jsx_runtime_1.jsxs)("li", { className: "flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-2xs", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => irA === null || irA === void 0 ? void 0 : irA(e.t), className: "tabular-nums hover:underline", children: (0, reloj_1.formatearSegundos)(e.t) }), (0, jsx_runtime_1.jsxs)("span", { children: [etiquetaJugador(porId.get(e.jugador)), ' ', e.tipo === 'out' ? `· out ${e.motivo}${e.por ? ` · ${etiquetaJugador(porId.get(e.por))}` : ''}` : `· ${e.tipo}`] }), e.hora && (0, jsx_runtime_1.jsx)("span", { title: "Marcada en vivo", className: "text-amber-600", children: "\u25CF" }), !enVivo && !soloLectura && obtenerTiempo && e.hora && estado.relojEnVivo && !estado.relojEnVivo.alineado && ((0, jsx_runtime_1.jsx)("button", { type: "button", disabled: guardando, onClick: () => {
                                        const s = obtenerTiempo();
                                        if (s != null)
                                            void correr(() => api.alinearEnVivo(e._id, Math.max(0, s)));
                                    }, className: "font-semibold text-amber-700 hover:underline disabled:opacity-50", children: "Es ac\u00E1" })), !soloLectura && ((0, jsx_runtime_1.jsx)("button", { type: "button", "aria-label": "Borrar marca", onClick: () => void correr(() => api.borrarEvento(e._id)), className: "text-muted hover:text-red-700", children: "\u2715" }))] }, e._id))) })), (0, jsx_runtime_1.jsx)(GanadorSugerido, { estado: estado, equipos: equipos, soloLectura: soloLectura, guardando: guardando, onAplicar: (g) => void correr(() => api.guardarGanador(refSet, g)) }), ((_f = estado.sync) === null || _f === void 0 ? void 0 : _f.sincronizado) && ((0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-2xs text-muted", children: "Estad\u00EDsticas del set actualizadas desde las marcas." }))] })] }));
};
/**
 * El ganador que dicen las marcas, contra el cargado. Se aplica con un clic y nunca solo: las
 * marcas pueden estar incompletas, y el ganador de un set mueve el marcador y la tabla.
 */
const GanadorSugerido = ({ estado, equipos, soloLectura, guardando, onAplicar }) => {
    var _a, _b, _c;
    const s = estado.ganadorSugerido;
    if (!(s === null || s === void 0 ? void 0 : s.ganador))
        return null;
    const nombre = (_b = (_a = equipos.find((e) => e.id === s.equipo)) === null || _a === void 0 ? void 0 : _a.nombre) !== null && _b !== void 0 ? _b : (s.ganador === 'local' ? 'Local' : 'Visitante');
    const cargado = (_c = estado.set.ganadorSet) !== null && _c !== void 0 ? _c : 'pendiente';
    const coincide = cargado === s.ganador;
    const por = s.motivo === 'eliminacion' ? 'dejó al rival sin jugadores' : `terminó con más vivos (${s.vivos.local} a ${s.vivos.visitante})`;
    return ((0, jsx_runtime_1.jsx)("div", { className: `mt-3 rounded-lg px-3 py-2 text-sm ${coincide ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`, children: coincide ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Gan\u00F3 ", (0, jsx_runtime_1.jsx)("b", { children: nombre }), ", como dicen las marcas."] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Seg\u00FAn las marcas gan\u00F3 ", (0, jsx_runtime_1.jsx)("b", { children: nombre }), ": ", por, ".", cargado !== 'pendiente' && (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: " Hoy el set dice otra cosa." })] }), !soloLectura && ((0, jsx_runtime_1.jsxs)("button", { type: "button", disabled: guardando, onClick: () => onAplicar(s.ganador), className: "rounded-md bg-amber-600 px-2 py-1 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50", children: ["Marcar ganador a ", nombre] }))] })) }));
};
exports.default = CapturaSet;
//# sourceMappingURL=CapturaSet.js.map