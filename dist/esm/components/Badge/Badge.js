import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Componente Badge reutilizable para mostrar etiquetas pequeñas
 */
const Badge = ({ children, variant = 'primary', size = 'md', className = '', rounded = true, ...props }) => {
    const variants = {
        primary: 'bg-brand-100 text-brand-800 dark:bg-brand-900/20 dark:text-brand-300',
        secondary: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
        success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
        danger: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
        info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300'
    };
    const sizes = {
        xs: 'px-1.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-sm'
    };
    const badgeClasses = [
        'inline-flex items-center font-medium',
        variants[variant],
        sizes[size],
        rounded ? 'rounded-full' : 'rounded-md',
        className
    ].filter(Boolean).join(' ');
    return (_jsx("span", { className: badgeClasses, ...props, children: children }));
};
export default Badge;
//# sourceMappingURL=Badge.js.map