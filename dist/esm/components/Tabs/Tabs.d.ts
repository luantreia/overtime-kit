import type { HTMLAttributes, ReactNode } from 'react';
/**
 * Cómo se ve la tira. Son las tres formas que ya existían escritas a mano en las apps:
 *
 * - `pildora`     botones sueltos, el activo relleno. Navegación de página (detalle de competencia).
 * - `segmentado`  un riel gris con el activo "levantado". Pocas opciones que se reparten el ancho,
 *                 o alternar vistas del mismo contenido (Lista / Calendario).
 * - `subrayado`   texto con línea debajo del activo. Listados densos, estilo panel de admin.
 */
export type TabsVariante = 'pildora' | 'segmentado' | 'subrayado';
export type TabsSize = 'sm' | 'md';
export interface TabItem<T extends string = string> {
    id: T;
    label: ReactNode;
    /** Contador o marca al lado del label (p. ej. cantidad de pendientes). */
    badge?: ReactNode;
    disabled?: boolean;
}
export interface TabsProps<T extends string = string> extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'role'> {
    items: ReadonlyArray<TabItem<T>>;
    value: T;
    onChange: (id: T) => void;
    /** Obligatorio: es lo que anuncia el lector de pantalla al entrar a la tira ("Secciones de la competencia"). */
    'aria-label': string;
    variante?: TabsVariante;
    size?: TabsSize;
    /** Las pestañas se reparten el ancho disponible en partes iguales. */
    fullWidth?: boolean;
    /**
     * Prefijo de ids para conectar cada pestaña con su `<TabPanel>` (`aria-controls` /
     * `aria-labelledby`). Opcional: sin él la tira funciona igual, sólo sin esa relación.
     */
    idBase?: string;
}
export declare const tabId: (idBase: string, id: string) => string;
export declare const tabPanelId: (idBase: string, id: string) => string;
/**
 * Tira de pestañas. Controlada: el padre decide de dónde sale `value`.
 *
 * Eso es a propósito. En una página, la pestaña tiene que vivir en la URL (`?tab=`) para que se
 * pueda linkear, recargar y volver con "atrás". Adentro de un modal, en cambio, es estado local.
 * El componente no elige por vos: recibe `value` y avisa `onChange`.
 *
 * Teclado (patrón WAI-ARIA de tabs, activación automática): Tab entra a la pestaña activa y sale
 * de la tira; ← → recorren, Home/End van a los extremos, y moverse ya selecciona.
 */
declare function Tabs<T extends string = string>({ items, value, onChange, variante, size, fullWidth, idBase, className, ...props }: TabsProps<T>): import("react").JSX.Element;
export interface TabPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'id'> {
    /** El mismo `idBase` que se le pasó a `<Tabs>`. */
    idBase: string;
    /** El `id` de la pestaña a la que pertenece este panel. */
    id: string;
    children: ReactNode;
}
/**
 * Contenedor de una pestaña, conectado a su botón para lectores de pantalla. Renderizalo sólo para
 * la pestaña activa (`{tab === 'x' && <TabPanel …>}`): no oculta nada por su cuenta.
 */
export declare function TabPanel({ idBase, id, children, ...props }: TabPanelProps): import("react").JSX.Element;
export default Tabs;
//# sourceMappingURL=Tabs.d.ts.map