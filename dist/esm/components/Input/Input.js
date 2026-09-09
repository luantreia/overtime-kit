import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ui/Input/Input.tsx
import { forwardRef } from 'react';
const Input = forwardRef(({ label, error, helperText, variant = 'default', size = 'md', disabled = false, required = false, className = '', containerClassName = '', id, ...props }, ref) => {
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
    const inputClasses = [
        baseClasses,
        variants[error ? 'error' : variant],
        sizes[size],
        className
    ].filter(Boolean).join(' ');
    const containerClasses = [
        'mb-4',
        containerClassName
    ].filter(Boolean).join(' ');
    return (_jsxs("div", { className: containerClasses, children: [label && (_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [label, required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), _jsx("input", { ref: ref, disabled: disabled, className: inputClasses, id: id, "aria-invalid": error ? 'true' : 'false', "aria-describedby": error ? `${id || 'input'}-error` : helperText ? `${id || 'input'}-helper` : undefined, ...props }), error && (_jsx("p", { id: `${id || 'input'}-error`, className: "mt-1 text-sm text-red-600 dark:text-red-400", children: error })), helperText && !error && (_jsx("p", { id: `${id || 'input'}-helper`, className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: helperText }))] }));
});
Input.displayName = 'Input';
export default Input;
//# sourceMappingURL=Input.js.map