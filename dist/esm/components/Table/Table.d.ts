import type { ReactNode, TableHTMLAttributes } from 'react';
type TableRow = Record<string, ReactNode>;
export interface TableProps extends Omit<TableHTMLAttributes<HTMLTableElement>, 'headers'> {
    children?: ReactNode;
    headers?: ReactNode[];
    data?: TableRow[];
    loading?: boolean;
    error?: ReactNode;
    emptyMessage?: ReactNode;
    striped?: boolean;
    hover?: boolean;
    compact?: boolean;
}
/**
 * Componente Table reutilizable con opciones avanzadas
 */
declare const Table: ({ children, headers, data, loading, error, emptyMessage, className, striped, hover, compact, ...props }: TableProps) => import("react").JSX.Element;
export default Table;
//# sourceMappingURL=Table.d.ts.map