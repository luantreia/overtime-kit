"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Componente Table reutilizable con opciones avanzadas
 */
const Table = ({ children, headers = [], data = [], loading = false, error = null, emptyMessage = 'No hay datos disponibles', className = '', striped = false, hover = true, compact = false, ...props }) => {
    const tableClasses = [
        'w-full text-sm text-left text-gray-500 dark:text-gray-400',
        striped && 'divide-y divide-gray-200 dark:divide-gray-700',
        hover && 'hover:bg-gray-50 dark:hover:bg-gray-600',
        compact && 'text-xs',
        className
    ].filter(Boolean).join(' ');
    if (loading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center p-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600 dark:text-gray-400", children: "Cargando..." })] }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "text-center p-8 text-red-600 dark:text-red-400", children: ["Error: ", error] }));
    }
    if (data.length === 0) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "text-center p-8 text-gray-500 dark:text-gray-400", children: emptyMessage }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: tableClasses, ...props, children: [headers.length > 0 && ((0, jsx_runtime_1.jsx)("thead", { className: "text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400", children: (0, jsx_runtime_1.jsx)("tr", { children: headers.map((header, index) => ((0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 font-medium", children: header }, index))) }) })), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white dark:bg-gray-800", children: children || data.map((row, index) => ((0, jsx_runtime_1.jsx)("tr", { className: "border-b dark:border-gray-700", children: Object.values(row).map((cell, cellIndex) => ((0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: cell }, cellIndex))) }, index))) })] }) }));
};
exports.default = Table;
//# sourceMappingURL=Table.js.map