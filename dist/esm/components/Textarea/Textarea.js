import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ui/Textarea/Textarea.tsx
import { forwardRef, useId } from 'react';
const Textarea = forwardRef(({ label, error, helperText, variant = 'default', disabled = false, required = false, className = '', containerClassName = '', id, rows = 3, ...props }, ref) => {
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
    const textareaClasses = [
        baseClasses,
        variants[error ? 'error' : variant],
        className
    ].filter(Boolean).join(' ');
    const containerClasses = [
        'mb-4',
        containerClassName
    ].filter(Boolean).join(' ');
    return (_jsxs("div", { className: containerClasses, children: [label && (_jsxs("label", { htmlFor: campoId, className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [label, required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), _jsx("textarea", { ref: ref, disabled: disabled, className: textareaClasses, id: campoId, rows: rows, "aria-invalid": error ? 'true' : 'false', "aria-describedby": error ? `${campoId}-error` : helperText ? `${campoId}-helper` : undefined, ...props }), error && (_jsx("p", { id: `${campoId}-error`, className: "mt-1 text-sm text-red-600 dark:text-red-400", children: error })), helperText && !error && (_jsx("p", { id: `${campoId}-helper`, className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: helperText }))] }));
});
Textarea.displayName = 'Textarea';
export default Textarea;
//# sourceMappingURL=Textarea.js.map