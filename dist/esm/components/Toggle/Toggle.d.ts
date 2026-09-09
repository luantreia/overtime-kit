import type { ButtonHTMLAttributes } from 'react';
type ToggleSize = 'sm' | 'md';
type ToggleColor = 'emerald' | 'amber';
export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type' | 'onChange'> {
    checked: boolean;
    onChange: (checked: boolean) => void;
    size?: ToggleSize;
    /** Color del track cuando está activo. Por defecto 'emerald'. */
    activeColor?: ToggleColor;
}
declare const Toggle: ({ checked, onChange, size, activeColor, disabled, className, ...props }: ToggleProps) => import("react").JSX.Element;
export default Toggle;
//# sourceMappingURL=Toggle.d.ts.map