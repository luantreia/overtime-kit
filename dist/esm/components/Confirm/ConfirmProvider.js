import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useRef, useState } from 'react';
import Overlay from '../Overlay/Overlay';
const ConfirmContext = createContext(undefined);
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
export const ConfirmProvider = ({ children }) => {
    var _a, _b;
    const [actual, setActual] = useState(null);
    const resolver = useRef(null);
    const cerrar = useCallback((valor) => {
        var _a;
        (_a = resolver.current) === null || _a === void 0 ? void 0 : _a.call(resolver, valor);
        resolver.current = null;
        setActual(null);
    }, []);
    const confirm = useCallback((opciones) => {
        var _a;
        // Si había otra abierta, se resuelve como cancelada: nunca queda una promesa colgada.
        (_a = resolver.current) === null || _a === void 0 ? void 0 : _a.call(resolver, false);
        setActual(opciones);
        return new Promise((resolve) => {
            resolver.current = resolve;
        });
    }, []);
    return (_jsxs(ConfirmContext.Provider, { value: confirm, children: [children, _jsx(Overlay, { isOpen: !!actual, onClose: () => cerrar(false), presentacion: "confirmacion", size: "sm", title: actual === null || actual === void 0 ? void 0 : actual.title, footer: _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { type: "button", onClick: () => cerrar(false), className: "min-h-[40px] rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50", children: (_a = actual === null || actual === void 0 ? void 0 : actual.cancelLabel) !== null && _a !== void 0 ? _a : 'Cancelar' }), _jsx("button", { type: "button", onClick: () => cerrar(true), className: `min-h-[40px] rounded-lg px-4 text-sm font-semibold text-white ${(actual === null || actual === void 0 ? void 0 : actual.danger) ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-600 hover:bg-brand-700'}`, children: (_b = actual === null || actual === void 0 ? void 0 : actual.confirmLabel) !== null && _b !== void 0 ? _b : 'Confirmar' })] }), children: (actual === null || actual === void 0 ? void 0 : actual.message) ? (_jsx("div", { className: "text-sm text-slate-700", children: typeof actual.message === 'string' ? _jsx("p", { children: actual.message }) : actual.message })) : null })] }));
};
export const useConfirm = () => {
    const ctx = useContext(ConfirmContext);
    if (!ctx)
        throw new Error('useConfirm debe usarse dentro de ConfirmProvider');
    return ctx;
};
export default ConfirmProvider;
//# sourceMappingURL=ConfirmProvider.js.map