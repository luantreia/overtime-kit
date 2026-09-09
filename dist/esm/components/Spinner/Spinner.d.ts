import type { HTMLAttributes, ReactNode } from 'react';
/**
 * Componente Spinner reutilizable con múltiples variantes
 */
type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'white';
export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
    size?: SpinnerSize;
    variant?: SpinnerVariant;
    message?: ReactNode;
    className?: string;
    showMessage?: boolean;
}
declare const Spinner: ({ size, variant, className, message, showMessage, ...props }: SpinnerProps) => import("react").JSX.Element;
export default Spinner;
//# sourceMappingURL=Spinner.d.ts.map