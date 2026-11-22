import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
const ToastContext = createContext(undefined);
let contador = 0;
const genId = () => `t${Date.now().toString(36)}${(contador++).toString(36)}`;
const ESTILO = {
    success: { caja: 'border-emerald-200 bg-emerald-50 text-emerald-900', icono: CheckCircleIcon, colorIcono: 'text-emerald-600' },
    error: { caja: 'border-red-200 bg-red-50 text-red-900', icono: ExclamationTriangleIcon, colorIcono: 'text-red-600' },
    warning: { caja: 'border-amber-200 bg-amber-50 text-amber-900', icono: ExclamationTriangleIcon, colorIcono: 'text-amber-600' },
    info: { caja: 'border-slate-200 bg-white text-slate-900', icono: InformationCircleIcon, colorIcono: 'text-slate-500' },
};
/**
 * Toasts compartidos. Misma API que las seis copias que vivían en cada app (`addToast` /
 * `removeToast`), así que migrar es cambiar el import.
 *
 * Decisiones que antes variaban por app y ahora no:
 * - Abajo en mobile, arriba a la derecha desde `sm` (lo había resuelto dodgeballmanager: arriba
 *   en un celular tapaban la hamburguesa y la campanita).
 * - Los errores se anuncian con `role="alert"` (interrumpe al lector de pantalla); el resto con
 *   `role="status"`.
 * - Un mismo mensaje repetido no se apila: se reemplaza.
 */
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const timers = useRef(new Map());
    const removeToast = useCallback((id) => {
        const t = timers.current.get(id);
        if (t)
            window.clearTimeout(t);
        timers.current.delete(id);
        setToasts((prev) => prev.filter((x) => x.id !== id));
    }, []);
    const addToast = useCallback((toast) => {
        const id = genId();
        const t = { id, duration: toast.type === 'error' ? 6000 : 3500, ...toast };
        setToasts((prev) => [
            ...prev.filter((x) => !(x.type === t.type && x.title === t.title && x.message === t.message)),
            t,
        ].slice(-4));
        if (t.duration && t.duration > 0) {
            timers.current.set(id, window.setTimeout(() => removeToast(id), t.duration));
        }
        return id;
    }, [removeToast]);
    const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);
    return (_jsxs(ToastContext.Provider, { value: value, children: [children, _jsx("div", { className: "pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col gap-2 sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-4 sm:w-96 sm:max-w-[calc(100%-2rem)]", children: toasts.map((t) => {
                    var _a;
                    const e = (_a = ESTILO[t.type]) !== null && _a !== void 0 ? _a : ESTILO.info;
                    const Icono = e.icono;
                    return (_jsxs("div", { role: t.type === 'error' ? 'alert' : 'status', className: `pointer-events-auto flex items-start gap-3 rounded-xl border p-3 shadow-lg ${e.caja}`, children: [_jsx(Icono, { className: `mt-0.5 h-5 w-5 shrink-0 ${e.colorIcono}`, "aria-hidden": "true" }), _jsxs("div", { className: "min-w-0 flex-1", children: [t.title ? _jsx("p", { className: "text-sm font-semibold", children: t.title }) : null, t.message ? _jsx("p", { className: "text-sm opacity-90", children: t.message }) : null] }), _jsx("button", { type: "button", onClick: () => removeToast(t.id), "aria-label": "Cerrar aviso", className: "-m-1 rounded-md p-1 opacity-60 hover:bg-black/5 hover:opacity-100", children: _jsx(XMarkIcon, { className: "h-4 w-4", "aria-hidden": "true" }) })] }, t.id));
                }) })] }));
};
export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx)
        throw new Error('useToast debe usarse dentro de ToastProvider');
    return ctx;
};
export default ToastProvider;
//# sourceMappingURL=ToastProvider.js.map