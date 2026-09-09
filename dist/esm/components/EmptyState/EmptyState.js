import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const EmptyState = ({ message, icon = '📭', action, }) => {
    return (_jsxs("div", { className: "rounded-lg border border-slate-200 bg-slate-50 p-8 text-center", children: [_jsx("div", { className: "mb-3 text-4xl", children: icon }), _jsx("p", { className: "mb-4 text-slate-600", children: message }), action && (_jsx("button", { onClick: action.onClick, className: "rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700", children: action.label }))] }));
};
export default EmptyState;
//# sourceMappingURL=EmptyState.js.map