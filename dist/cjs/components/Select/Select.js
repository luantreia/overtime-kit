"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
/**
 * Componente Select reutilizable con opciones avanzadas
 */
const Select = ({ label, options = [], value, onChange, placeholder = 'Seleccionar...', disabled = false, error, helperText, variant = 'default', size = 'md', required = false, className = '', containerClassName = '', multiple = false, id, ...props }) => {
    // Sin id explícito, el <label> quedaba sin asociar al control (tocar el texto no enfocaba el
    // campo y el lector de pantalla no lo nombraba) y todos los mensajes de error compartían id.
    const autoId = (0, react_1.useId)();
    const campoId = id !== null && id !== void 0 ? id : autoId;
    const baseClasses = 'block w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:cursor-not-allowed dark:disabled:bg-slate-800';
    const variants = {
        default: 'border-slate-300 focus:border-brand-500 focus:ring-brand-500 dark:border-slate-600 dark:focus:border-brand-400',
        error: 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-400',
        success: 'border-green-300 focus:border-green-500 focus:ring-green-500 dark:border-green-600 dark:focus:border-green-400'
    };
    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-4 py-3 text-base'
    };
    const selectClasses = [
        baseClasses,
        variants[error ? 'error' : variant],
        sizes[size],
        className
    ].filter(Boolean).join(' ');
    const containerClasses = [
        'mb-4',
        containerClassName
    ].filter(Boolean).join(' ');
    return ((0, jsx_runtime_1.jsxs)("div", { className: containerClasses, children: [label && ((0, jsx_runtime_1.jsxs)("label", { htmlFor: campoId, className: "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2", children: [label, required && (0, jsx_runtime_1.jsx)("span", { className: "text-red-500 ml-1", children: "*" })] })), (0, jsx_runtime_1.jsxs)("select", { value: value, onChange: onChange, disabled: disabled, multiple: multiple, className: selectClasses, id: campoId, "aria-invalid": error ? 'true' : 'false', "aria-describedby": error ? `${campoId}-error` : helperText ? `${campoId}-helper` : undefined, ...props, children: [placeholder && !multiple && ((0, jsx_runtime_1.jsx)("option", { value: "", disabled: true, children: placeholder })), options.map((option) => ((0, jsx_runtime_1.jsx)("option", { value: option.value, children: option.label }, option.value)))] }), error && ((0, jsx_runtime_1.jsx)("p", { id: `${campoId}-error`, className: "mt-1 text-sm text-red-600 dark:text-red-400", children: error })), helperText && !error && ((0, jsx_runtime_1.jsx)("p", { id: `${campoId}-helper`, className: "mt-1 text-sm text-slate-500 dark:text-slate-400", children: helperText }))] }));
};
exports.default = Select;
//# sourceMappingURL=Select.js.map