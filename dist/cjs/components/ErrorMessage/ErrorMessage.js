"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const outline_1 = require("@heroicons/react/24/outline");
const ErrorMessage = ({ message, title = 'Error', onRetry, showIcon = true, className = '', }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: `bg-red-50 border border-red-200 rounded-lg p-4 ${className}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start", children: [showIcon && ((0, jsx_runtime_1.jsx)(outline_1.ExclamationTriangleIcon, { className: "w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" })), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [title ? ((0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-red-800 mb-1", children: title })) : null, (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-700 mb-3", children: message }), onRetry && ((0, jsx_runtime_1.jsx)("button", { onClick: onRetry, className: "inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors", children: "Intentar nuevamente" }))] })] }) }));
};
exports.default = react_1.default.memo(ErrorMessage);
//# sourceMappingURL=ErrorMessage.js.map