import type { HTMLAttributes, ReactNode } from 'react';
type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    children: ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    rounded?: boolean;
}
/**
 * Componente Badge reutilizable para mostrar etiquetas pequeñas
 */
declare const Badge: React.FC<BadgeProps>;
export default Badge;
//# sourceMappingURL=Badge.d.ts.map