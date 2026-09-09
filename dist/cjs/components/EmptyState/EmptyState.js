"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyState = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const EmptyState = ({ message, icon = '📭', action, }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border border-slate-200 bg-slate-50 p-8 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-3 text-4xl", children: icon }), (0, jsx_runtime_1.jsx)("p", { className: "mb-4 text-slate-600", children: message }), action && ((0, jsx_runtime_1.jsx)("button", { onClick: action.onClick, className: "rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700", children: action.label }))] }));
};
exports.EmptyState = EmptyState;
exports.default = exports.EmptyState;
//# sourceMappingURL=EmptyState.js.map