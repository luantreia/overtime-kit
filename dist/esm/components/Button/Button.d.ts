import type { ButtonHTMLAttributes, ReactNode } from 'react';
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
}
declare const Button: ({ children, variant, size, disabled, loading, onClick, type, className, ...props }: ButtonProps) => import("react").JSX.Element;
export default Button;
//# sourceMappingURL=Button.d.ts.map