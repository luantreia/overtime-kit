"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// Clases literales para que Tailwind las encuentre.
const OCULTAR = { md: 'md:hidden', lg: 'lg:hidden', xl: 'xl:hidden' };
const esActiva = (to, path) => path === to || path.startsWith(`${to}/`);
function MobileTabBar({ tabs, more = [], LinkComponent: L, currentPath, onLogout, ocultarDesde = 'lg', pendientesMas, }) {
    const [abierto, setAbierto] = (0, react_1.useState)(false);
    const oculto = OCULTAR[ocultarDesde];
    const pendientesEnMas = pendientesMas !== null && pendientesMas !== void 0 ? pendientesMas : more.reduce((n, i) => { var _a; return n + ((_a = i.badge) !== null && _a !== void 0 ? _a : 0); }, 0);
    const hayMas = more.length > 0 || !!onLogout;
    // Con el panel abierto: Escape lo cierra y el fondo no scrollea.
    (0, react_1.useEffect)(() => {
        if (!abierto)
            return;
        const previo = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const alTeclado = (e) => {
            if (e.key === 'Escape')
                setAbierto(false);
        };
        document.addEventListener('keydown', alTeclado);
        return () => {
            document.body.style.overflow = previo;
            document.removeEventListener('keydown', alTeclado);
        };
    }, [abierto]);
    // Navegar cierra el panel.
    (0, react_1.useEffect)(() => setAbierto(false), [currentPath]);
    const claseTab = (activa) => `relative flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-0.5 text-2xs font-bold [touch-action:manipulation] ${activa ? 'text-brand-600' : 'text-muted'}`;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [abierto && ((0, jsx_runtime_1.jsx)("button", { type: "button", "aria-label": "Cerrar men\u00FA", className: `fixed inset-0 z-40 bg-slate-900/30 ${oculto}`, onClick: () => setAbierto(false) })), abierto && ((0, jsx_runtime_1.jsxs)("div", { id: "mobile-tabbar-mas", className: `fixed inset-x-3 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-50 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg ${oculto}`, children: [more.map((item) => ((0, jsx_runtime_1.jsxs)(L, { to: item.to, onClick: () => setAbierto(false), "aria-current": esActiva(item.to, currentPath) ? 'page' : undefined, className: "flex min-h-[2.75rem] items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-700 [touch-action:manipulation] hover:bg-slate-50", children: [(0, jsx_runtime_1.jsx)("span", { "aria-hidden": true, className: "flex h-5 w-5 shrink-0 items-center justify-center text-base text-slate-500 [&>svg]:h-5 [&>svg]:w-5", children: item.icon }), item.label, item.badge ? ((0, jsx_runtime_1.jsx)("span", { className: "ml-auto inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-brand-600 px-1.5 py-0.5 text-2xs font-bold text-white", children: item.badge })) : null] }, item.to))), onLogout && ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => {
                            setAbierto(false);
                            onLogout();
                        }, className: "flex min-h-[2.75rem] w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-rose-600 [touch-action:manipulation] hover:bg-rose-50", children: [(0, jsx_runtime_1.jsx)("svg", { "aria-hidden": true, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, className: "h-5 w-5 shrink-0", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" }) }), "Cerrar sesi\u00F3n"] }))] })), (0, jsx_runtime_1.jsxs)("nav", { "aria-label": "Navegaci\u00F3n principal", className: `fixed inset-x-0 bottom-0 z-30 flex border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur ${oculto}`, children: [tabs.map((tab) => {
                        const activa = esActiva(tab.to, currentPath);
                        return ((0, jsx_runtime_1.jsxs)(L, { to: tab.to, "aria-current": activa ? 'page' : undefined, className: claseTab(activa), children: [(0, jsx_runtime_1.jsx)("span", { "aria-hidden": true, className: "flex h-6 items-center text-lg leading-none [&>svg]:h-6 [&>svg]:w-6", children: tab.icon }), tab.label, tab.badge ? ((0, jsx_runtime_1.jsx)("span", { className: "absolute right-[calc(50%-1.1rem)] top-1.5 h-2 w-2 rounded-full bg-brand-600" })) : null] }, tab.to));
                    }), hayMas && ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => setAbierto((v) => !v), "aria-expanded": abierto, "aria-controls": "mobile-tabbar-mas", className: claseTab(abierto), children: [(0, jsx_runtime_1.jsx)("svg", { "aria-hidden": true, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, className: "h-6 w-6", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" }) }), "M\u00E1s", pendientesEnMas > 0 && !abierto && ((0, jsx_runtime_1.jsx)("span", { "aria-label": `${pendientesEnMas} solicitudes pendientes`, className: "absolute right-[calc(50%-1.1rem)] top-1.5 h-2 w-2 rounded-full bg-brand-600" }))] }))] })] }));
}
exports.default = MobileTabBar;
//# sourceMappingURL=MobileTabBar.js.map