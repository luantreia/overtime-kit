"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const trackSizes = {
    sm: 'h-5 w-10',
    md: 'h-6 w-11'
};
const thumbSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4'
};
const thumbTranslate = {
    sm: 'translate-x-6',
    md: 'translate-x-6'
};
const activeTrackColors = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500'
};
const Toggle = ({ checked, onChange, size = 'sm', activeColor = 'emerald', disabled = false, className = '', ...props }) => {
    return ((0, jsx_runtime_1.jsx)("button", { type: "button", role: "switch", "aria-checked": checked, disabled: disabled, onClick: () => onChange(!checked), className: [
            'relative inline-flex items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
            trackSizes[size],
            checked ? activeTrackColors[activeColor] : 'bg-slate-200',
            className
        ].filter(Boolean).join(' '), ...props, children: (0, jsx_runtime_1.jsx)("span", { className: [
                'inline-block transform rounded-full bg-white transition-transform',
                thumbSizes[size],
                checked ? thumbTranslate[size] : 'translate-x-1'
            ].filter(Boolean).join(' ') }) }));
};
exports.default = Toggle;
//# sourceMappingURL=Toggle.js.map