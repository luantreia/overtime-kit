"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Spinner = ({ size = 'md', variant = 'primary', className = '', message = 'Cargando...', showMessage = true, ...props }) => {
    const sizes = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    };
    const variants = {
        primary: 'text-brand-600 border-brand-200',
        secondary: 'text-slate-600 border-slate-200',
        success: 'text-green-600 border-green-200',
        danger: 'text-red-600 border-red-200',
        warning: 'text-yellow-600 border-yellow-200',
        white: 'text-white border-white/30'
    };
    const containerClasses = [
        'flex flex-col items-center justify-center',
        className
    ].filter(Boolean).join(' ');
    const spinnerClasses = [
        'animate-spin rounded-full border-2',
        variants[variant],
        sizes[size]
    ].filter(Boolean).join(' ');
    return ((0, jsx_runtime_1.jsxs)("div", { className: containerClasses, role: "status", ...props, children: [(0, jsx_runtime_1.jsx)("div", { className: spinnerClasses, "aria-label": "Cargando", children: (0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "Cargando..." }) }), showMessage && message && ((0, jsx_runtime_1.jsx)("p", { className: `mt-2 text-sm text-slate-600 dark:text-slate-400`, children: message }))] }));
};
exports.default = Spinner;
//# sourceMappingURL=Spinner.js.map