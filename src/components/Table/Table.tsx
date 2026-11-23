// src/components/ui/Table/Table.tsx
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
const Table = ({
  children,
  headers = [],
  data = [],
  loading = false,
  error = null,
  emptyMessage = 'No hay datos disponibles',
  className = '',
  striped = false,
  hover = true,
  compact = false,
  ...props
}: TableProps) => {
  const tableClasses = [
    'w-full text-sm text-left text-slate-500 dark:text-slate-400',
    striped && 'divide-y divide-slate-200 dark:divide-slate-700',
    hover && 'hover:bg-slate-50 dark:hover:bg-slate-600',
    compact && 'text-xs',
    className
  ].filter(Boolean).join(' ');

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        <span className="ml-3 text-slate-600 dark:text-slate-400">Cargando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600 dark:text-red-400">
        Error: {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center p-8 text-slate-500 dark:text-slate-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={tableClasses} {...props}>
        {headers.length > 0 && (
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-6 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="bg-white dark:bg-slate-800">
          {children || data.map((row, index) => (
            <tr key={index} className="border-b dark:border-slate-700">
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
