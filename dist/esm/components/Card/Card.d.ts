import type { HTMLAttributes, ReactNode } from 'react';
type CardVariant = 'default' | 'outlined' | 'filled' | 'success' | 'warning' | 'danger';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';
type CardShadow = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    children: ReactNode;
    title?: ReactNode;
    subtitle?: ReactNode;
    actions?: ReactNode;
    headerClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
    variant?: CardVariant;
    padding?: CardPadding;
    shadow?: CardShadow;
}
/**
 * Componente Card reutilizable para mostrar contenido en tarjetas
 */
declare const Card: React.FC<CardProps>;
export default Card;
//# sourceMappingURL=Card.d.ts.map