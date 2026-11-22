import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
/**
 * Componente Select reutilizable con opciones avanzadas
 */
const Select = ({ label, options = [], value, onChange, placeholder = 'Seleccionar...', disabled = false, error, helperText, variant = 'default', size = 'md', required = false, className = '', containerClassName = '', multiple = false, id, ...props }) => {
    // Sin id explícito, el <label> quedaba sin asociar al control (tocar el texto no enfocaba el
    // campo y el lector de pantalla no lo nombraba) y todos los mensajes de error compartían id.
    const autoId = useId();
    const campoId = id !== null && id !== void 0 ? id : autoId;
    const baseClasses = 'block w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed dark:disabled:bg-gray-800';
    const variants = {
        default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-400',
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
    return (_jsxs("div", { className: containerClasses, children: [label && (_jsxs("label", { htmlFor: campoId, className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [label, required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), _jsxs("select", { value: value, onChange: onChange, disabled: disabled, multiple: multiple, className: selectClasses, id: campoId, "aria-invalid": error ? 'true' : 'false', "aria-describedby": error ? `${campoId}-error` : helperText ? `${campoId}-helper` : undefined, ...props, children: [placeholder && !multiple && (_jsx("option", { value: "", disabled: true, children: placeholder })), options.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value)))] }), error && (_jsx("p", { id: `${campoId}-error`, className: "mt-1 text-sm text-red-600 dark:text-red-400", children: error })), helperText && !error && (_jsx("p", { id: `${campoId}-helper`, className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: helperText }))] }));
};
export default Select;
//# sourceMappingURL=Select.js.map