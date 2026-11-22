import { type ReactNode } from 'react';
export type DataTableSort = {
    columna: string;
    direccion: 'asc' | 'desc';
} | null;
export interface DataTableColumn<T> {
    /** Identificador estable: se usa para el orden (y para guardarlo en la URL). */
    id: string;
    header: ReactNode;
    /** Qué se pinta en la celda. */
    cell: (fila: T) => ReactNode;
    /**
     * Valor para ordenar. Sin esto la columna no es ordenable. Se pide aparte de `cell` porque
     * casi nunca coinciden: la celda es un nombre con escudo, el orden es el string del nombre.
     */
    sortValue?: (fila: T) => string | number | Date | null | undefined;
    align?: 'left' | 'right' | 'center';
    /** En la vista de tarjetas (mobile) no se muestra. Para columnas secundarias. */
    hideOnMobile?: boolean;
    /** Ancho fijo opcional, en clases de Tailwind (`w-24`). */
    className?: string;
    /**
     * En la vista de TABLA, desde qué ancho se muestra la columna (antes queda oculta). Para tablas
     * anchas que en tablet no entran enteras. Distinto de `hideOnMobile`, que es para las tarjetas.
     */
    visibleFrom?: 'sm' | 'md' | 'lg' | 'xl';
    /** Celda de la fila de totales (`<tfoot>`). Recibe todas las filas, no sólo la página. */
    footer?: (filas: T[]) => ReactNode;
}
export interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    data: T[];
    rowKey: (fila: T) => string;
    loading?: boolean;
    /** Si hay error se muestra en lugar de la tabla, con reintentar si se pasa `onRetry`. */
    error?: ReactNode;
    onRetry?: () => void;
    /** Lo que se ve cuando `data` está vacío. Obligatorio a propósito: "No hay datos" no le dice a nadie qué hacer. */
    empty: ReactNode;
    onRowClick?: (fila: T) => void;
    /** Etiqueta accesible de la tabla. */
    caption: string;
    /** Barra arriba de la tabla (búsqueda, filtros, acciones). */
    toolbar?: ReactNode;
    /** Filas por página. 0 = sin paginar. */
    pageSize?: number;
    /**
     * Orden y página pueden ser no controlados (los maneja la tabla) o controlados (los maneja la
     * app, típicamente desde la URL para que un link compartido abra la misma vista). Si se pasa
     * `sort` o `page`, hay que pasar también su `on…Change`.
     */
    sort?: DataTableSort;
    defaultSort?: DataTableSort;
    onSortChange?: (sort: DataTableSort) => void;
    page?: number;
    onPageChange?: (page: number) => void;
    /** `cards` (default): en pantallas chicas cada fila es una tarjeta. `scroll`: tabla con scroll horizontal. */
    mobile?: 'cards' | 'scroll';
    /** Clases extra por fila (tabla y tarjeta): clasificados, fila propia, seleccionada. */
    rowClassName?: (fila: T) => string | undefined;
    /**
     * Encabezado fijo al hacer scroll vertical. Requiere una altura máxima para el área de scroll:
     * pasá `maxHeightClassName` (p. ej. `max-h-[70vh]`, escrito en la app para que Tailwind lo genere).
     */
    stickyHeader?: boolean;
    /** Primera columna fija al hacer scroll horizontal (tablas cruzadas con muchas columnas). */
    stickyFirstColumn?: boolean;
    maxHeightClassName?: string;
    /**
     * Filas expandibles: si devuelve algo, la fila suma un botón para mostrar ese contenido debajo.
     * Devolvé `null` para las filas que no tienen detalle.
     */
    renderExpanded?: (fila: T) => ReactNode | null;
}
/**
 * La tabla de las seis apps. Existe porque había `<table>` escrito a mano en ~80 archivos, cada
 * uno con su propio orden, paginación, estado vacío y scroll en mobile (o sin ninguno de ellos),
 * mientras el `Table` del kit no lo usaba nadie: sólo recibía filas de ReactNode.
 *
 * Qué resuelve siempre igual: carga (filas esqueleto), error con reintentar, vacío obligatorio,
 * orden por columna con `aria-sort`, paginación, y tarjetas en mobile en vez de scroll lateral.
 * Qué NO resuelve: filtros y búsqueda, que dependen de cada pantalla — van en `toolbar` y la app
 * le pasa `data` ya filtrada.
 */
declare function DataTable<T>({ columns, data, rowKey, loading, error, onRetry, empty, onRowClick, caption, toolbar, pageSize, sort: sortProp, defaultSort, onSortChange, page: pageProp, onPageChange, mobile, rowClassName, stickyHeader, stickyFirstColumn, maxHeightClassName, renderExpanded, }: DataTableProps<T>): import("react").JSX.Element;
export default DataTable;
//# sourceMappingURL=DataTable.d.ts.map