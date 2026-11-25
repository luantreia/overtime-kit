import React from 'react';
/**
 * Navegación principal en mobile: barra fija abajo, al alcance del pulgar, con un panel «Más».
 *
 * Estaba copiada en Manager, dodgeballmanager y Organizaciones con cambios menores (íconos, el
 * breakpoint, el badge de pendientes). Acá cada app pasa sólo sus destinos.
 *
 * No depende del router: recibe el `Link` de la app y la ruta actual. Así el kit no arrastra
 * react-router como dependencia.
 *
 * El `pb-[env(safe-area-inset-bottom)]` no es opcional: con `viewport-fit=cover` la fila de
 * etiquetas queda debajo de la barra de gestos sin él.
 */
export interface TabBarItem {
    to: string;
    label: string;
    /** Un ícono de heroicons ya renderizado o un emoji. */
    icon: React.ReactNode;
    /** Número a mostrar al lado (pendientes). 0 o ausente = nada. */
    badge?: number;
}
/** Cualquier componente de link que acepte `to` (el `Link` de react-router, típicamente). */
export type LinkLike = React.ElementType;
export interface MobileTabBarProps {
    tabs: TabBarItem[];
    more?: TabBarItem[];
    /** `Link` de react-router (o cualquier componente con `to`). */
    LinkComponent: LinkLike;
    /** `useLocation().pathname`. */
    currentPath: string;
    onLogout?: () => void;
    /** Desde dónde se oculta, que es donde el Navbar de la app muestra sus propios enlaces. */
    ocultarDesde?: 'md' | 'lg' | 'xl';
    /**
     * Pendientes a marcar con un punto en «Más». Por defecto, la suma de los `badge` de `more`; se
     * pasa explícito cuando lo pendiente no es un destino del panel (p. ej. vive en el dashboard).
     */
    pendientesMas?: number;
}
export default function MobileTabBar({ tabs, more, LinkComponent: L, currentPath, onLogout, ocultarDesde, pendientesMas, }: MobileTabBarProps): React.JSX.Element;
//# sourceMappingURL=MobileTabBar.d.ts.map