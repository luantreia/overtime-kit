import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Componente Card reutilizable para mostrar contenido en tarjetas
 */
const Card = ({ children, title, subtitle, actions, className = '', headerClassName = '', bodyClassName = '', footerClassName = '', variant = 'default', padding = 'md', shadow = 'md', ...props }) => {
    const variants = {
        default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        outlined: 'bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700',
        filled: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700',
        success: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700',
        danger: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
    };
    const paddings = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6'
    };
    const shadows = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl'
    };
    const cardClasses = [
        'rounded-lg transition-all duration-200',
        variants[variant],
        paddings[padding],
        shadows[shadow],
        className
    ].filter(Boolean).join(' ');
    return (_jsxs("div", { className: cardClasses, ...props, children: [(title || subtitle || actions) && (_jsx("div", { className: `border-b border-gray-200 dark:border-gray-700 pb-3 mb-3 ${headerClassName}`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [title && (_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: title })), subtitle && (_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: subtitle }))] }), actions && (_jsx("div", { className: "flex items-center space-x-2", children: actions }))] }) })), _jsx("div", { className: bodyClassName, children: children })] }));
};
export default Card;
//# sourceMappingURL=Card.js.map