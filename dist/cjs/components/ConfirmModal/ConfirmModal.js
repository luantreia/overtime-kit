"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ModalBase_1 = __importDefault(require("../ModalBase/ModalBase"));
/**
 * Compatibilidad con el `ConfirmModal` copiado en las seis apps.
 *
 * De las dos versiones que existían, ésta es la de Admin/Organizaciones/Partido, que es un
 * superconjunto estricto de la otra: agrega `showCancel`, `showConfirm` y `size`, y sus valores
 * por defecto dan exactamente el comportamiento de la versión corta. Ninguna app pierde nada.
 *
 * @deprecated Para código nuevo usá `<Overlay presentacion="confirmacion">`, que además evita la
 * X de cerrar en la esquina: en una confirmación la salida son los botones, que dicen qué pasa
 * con cada opción.
 */
const ConfirmModal = ({ isOpen, title = 'Confirmar', message = '¿Desea continuar?', confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', onConfirm, onCancel, variant = 'default', showCancel = true, showConfirm = true, size = 'sm', }) => {
    const confirmClasses = variant === 'danger'
        ? 'bg-rose-600 hover:bg-rose-700'
        : variant === 'primary'
            ? 'bg-brand-600 hover:bg-brand-700'
            : 'bg-slate-600 hover:bg-slate-700';
    return ((0, jsx_runtime_1.jsx)(ModalBase_1.default, { isOpen: isOpen, onClose: onCancel, title: title, size: size, children: (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-slate-700", children: typeof message === 'string' ? (0, jsx_runtime_1.jsx)("p", { children: message }) : message }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 flex justify-end gap-3", children: [showCancel ? ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onCancel, className: "rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900", children: cancelLabel })) : null, showConfirm ? ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onConfirm, className: `rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${confirmClasses}`, children: confirmLabel })) : null] })] }) }));
};
exports.default = ConfirmModal;
//# sourceMappingURL=ConfirmModal.js.map