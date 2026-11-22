"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConfirm = exports.ConfirmProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Overlay_1 = __importDefault(require("../Overlay/Overlay"));
const ConfirmContext = (0, react_1.createContext)(undefined);
/**
 * `const ok = await confirm({ title: '¿Eliminar?', danger: true })`.
 *
 * Reemplaza el patrón de cada pantalla con su `useState(aEliminar)` + `<ConfirmModal isOpen=…>`
 * + handler partido en dos. Una confirmación es una pregunta con respuesta: modelarla como
 * promesa deja el flujo en un solo lugar y legible de arriba a abajo.
 *
 * Usa `Overlay presentacion="confirmacion"` (sin X: la salida son los botones, que dicen qué
 * pasa con cada opción). Escape y click afuera cuentan como cancelar.
 */
const ConfirmProvider = ({ children }) => {
    var _a, _b;
    const [actual, setActual] = (0, react_1.useState)(null);
    const resolver = (0, react_1.useRef)(null);
    const cerrar = (0, react_1.useCallback)((valor) => {
        var _a;
        (_a = resolver.current) === null || _a === void 0 ? void 0 : _a.call(resolver, valor);
        resolver.current = null;
        setActual(null);
    }, []);
    const confirm = (0, react_1.useCallback)((opciones) => {
        var _a;
        // Si había otra abierta, se resuelve como cancelada: nunca queda una promesa colgada.
        (_a = resolver.current) === null || _a === void 0 ? void 0 : _a.call(resolver, false);
        setActual(opciones);
        return new Promise((resolve) => {
            resolver.current = resolve;
        });
    }, []);
    return ((0, jsx_runtime_1.jsxs)(ConfirmContext.Provider, { value: confirm, children: [children, (0, jsx_runtime_1.jsx)(Overlay_1.default, { isOpen: !!actual, onClose: () => cerrar(false), presentacion: "confirmacion", size: "sm", title: actual === null || actual === void 0 ? void 0 : actual.title, footer: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-3", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => cerrar(false), className: "min-h-[40px] rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50", children: (_a = actual === null || actual === void 0 ? void 0 : actual.cancelLabel) !== null && _a !== void 0 ? _a : 'Cancelar' }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => cerrar(true), className: `min-h-[40px] rounded-lg px-4 text-sm font-semibold text-white ${(actual === null || actual === void 0 ? void 0 : actual.danger) ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-600 hover:bg-brand-700'}`, children: (_b = actual === null || actual === void 0 ? void 0 : actual.confirmLabel) !== null && _b !== void 0 ? _b : 'Confirmar' })] }), children: (actual === null || actual === void 0 ? void 0 : actual.message) ? ((0, jsx_runtime_1.jsx)("div", { className: "text-sm text-slate-700", children: typeof actual.message === 'string' ? (0, jsx_runtime_1.jsx)("p", { children: actual.message }) : actual.message })) : null })] }));
};
exports.ConfirmProvider = ConfirmProvider;
const useConfirm = () => {
    const ctx = (0, react_1.useContext)(ConfirmContext);
    if (!ctx)
        throw new Error('useConfirm debe usarse dentro de ConfirmProvider');
    return ctx;
};
exports.useConfirm = useConfirm;
exports.default = exports.ConfirmProvider;
//# sourceMappingURL=ConfirmProvider.js.map