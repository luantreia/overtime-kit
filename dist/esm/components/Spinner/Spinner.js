import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("div", { className: containerClasses, role: "status", ...props, children: [_jsx("div", { className: spinnerClasses, "aria-label": "Cargando", children: _jsx("span", { className: "sr-only", children: "Cargando..." }) }), showMessage && message && (_jsx("p", { className: `mt-2 text-sm text-slate-600 dark:text-slate-400`, children: message }))] }));
};
export default Spinner;
//# sourceMappingURL=Spinner.js.map