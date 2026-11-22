import { useMemo, useState, type ReactNode } from 'react';
import { ChevronDownIcon, ChevronUpIcon, ChevronUpDownIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export type DataTableSort = { columna: string; direccion: 'asc' | 'desc' } | null;

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
}

const comparar = (a: unknown, b: unknown) => {
  if (a == null && b == null) return 0;
  if (a == null) return 1; // vacíos al final, en cualquier dirección
  if (b == null) return -1;
  if (a instanceof Date || b instanceof Date) return new Date(a as any).getTime() - new Date(b as any).getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), 'es', { numeric: true, sensitivity: 'base' });
};

const ALIGN = { left: 'text-left', right: 'text-right', center: 'text-center' } as const;

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
function DataTable<T>({
  columns,
  data,
  rowKey,
  loading = false,
  error,
  onRetry,
  empty,
  onRowClick,
  caption,
  toolbar,
  pageSize = 25,
  sort: sortProp,
  defaultSort = null,
  onSortChange,
  page: pageProp,
  onPageChange,
  mobile = 'cards',
}: DataTableProps<T>) {
  const [sortInterno, setSortInterno] = useState<DataTableSort>(defaultSort);
  const [pageInterna, setPageInterna] = useState(1);
  const sort = sortProp !== undefined ? sortProp : sortInterno;
  const page = pageProp !== undefined ? pageProp : pageInterna;

  const setSort = (s: DataTableSort) => {
    if (sortProp === undefined) setSortInterno(s);
    onSortChange?.(s);
    setPage(1);
  };
  const setPage = (p: number) => {
    if (pageProp === undefined) setPageInterna(p);
    onPageChange?.(p);
  };

  const ordenadas = useMemo(() => {
    if (!sort) return data;
    const col = columns.find((c) => c.id === sort.columna);
    if (!col?.sortValue) return data;
    const factor = sort.direccion === 'asc' ? 1 : -1;
    return [...data].sort((a, b) => {
      const va = col.sortValue!(a);
      const vb = col.sortValue!(b);
      // Los vacíos quedan al final también en descendente.
      if (va == null || vb == null) return comparar(va, vb);
      return comparar(va, vb) * factor;
    });
  }, [data, sort, columns]);

  const totalPaginas = pageSize > 0 ? Math.max(1, Math.ceil(ordenadas.length / pageSize)) : 1;
  const paginaSegura = Math.min(Math.max(1, page), totalPaginas);
  const visibles = pageSize > 0 ? ordenadas.slice((paginaSegura - 1) * pageSize, paginaSegura * pageSize) : ordenadas;

  const alternarOrden = (col: DataTableColumn<T>) => {
    if (!col.sortValue) return;
    if (!sort || sort.columna !== col.id) setSort({ columna: col.id, direccion: 'asc' });
    else if (sort.direccion === 'asc') setSort({ columna: col.id, direccion: 'desc' });
    else setSort(null);
  };

  const clickable = onRowClick
    ? 'cursor-pointer hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none'
    : '';
  const filaProps = (fila: T) =>
    onRowClick
      ? {
          onClick: () => onRowClick(fila),
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onRowClick(fila);
            }
          },
          tabIndex: 0,
        }
      : {};

  const tabla = (
    <table className="w-full text-sm">
      <caption className="sr-only">{caption}</caption>
      <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
        <tr>
          {columns.map((col) => {
            const activa = sort?.columna === col.id;
            const ariaSort = activa ? (sort!.direccion === 'asc' ? 'ascending' : 'descending') : col.sortValue ? 'none' : undefined;
            const Icono = !activa ? ChevronUpDownIcon : sort!.direccion === 'asc' ? ChevronUpIcon : ChevronDownIcon;
            return (
              <th key={col.id} scope="col" aria-sort={ariaSort} className={`px-3 py-2 ${ALIGN[col.align ?? 'left']} ${col.className ?? ''}`}>
                {col.sortValue ? (
                  <button
                    type="button"
                    onClick={() => alternarOrden(col)}
                    className={`inline-flex items-center gap-1 rounded uppercase hover:text-slate-900 ${activa ? 'text-slate-900' : ''}`}
                  >
                    {col.header}
                    <Icono className={`h-3.5 w-3.5 ${activa ? '' : 'opacity-40'}`} aria-hidden="true" />
                  </button>
                ) : (
                  col.header
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white">
        {loading
          ? Array.from({ length: Math.min(pageSize || 5, 5) }).map((_, i) => (
              <tr key={`sk-${i}`} aria-hidden="true">
                {columns.map((col) => (
                  <td key={col.id} className="px-3 py-3">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                  </td>
                ))}
              </tr>
            ))
          : visibles.map((fila) => (
              <tr key={rowKey(fila)} className={clickable} {...filaProps(fila)}>
                {columns.map((col) => (
                  <td key={col.id} className={`px-3 py-2.5 text-slate-800 ${ALIGN[col.align ?? 'left']} ${col.className ?? ''}`}>
                    {col.cell(fila)}
                  </td>
                ))}
              </tr>
            ))}
      </tbody>
    </table>
  );

  const tarjetas = (
    <ul className="divide-y divide-slate-100 bg-white" aria-label={caption}>
      {loading
        ? Array.from({ length: 3 }).map((_, i) => (
            <li key={`skm-${i}`} className="space-y-2 p-3" aria-hidden="true">
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200" />
            </li>
          ))
        : visibles.map((fila) => {
            const [principal, ...resto] = columns.filter((c) => !c.hideOnMobile);
            return (
              <li key={rowKey(fila)} className={`p-3 ${clickable}`} {...filaProps(fila)}>
                {principal ? <div className="font-semibold text-slate-900">{principal.cell(fila)}</div> : null}
                {resto.length > 0 ? (
                  <dl className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                    {resto.map((col) => (
                      <div key={col.id} className="min-w-0">
                        <dt className="text-xs text-slate-500">{col.header}</dt>
                        <dd className="truncate text-slate-800">{col.cell(fila)}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </li>
            );
          })}
    </ul>
  );

  let cuerpo: ReactNode;
  if (error && !loading) {
    cuerpo = (
      <div role="alert" className="flex flex-col items-center gap-3 px-4 py-10 text-center text-sm text-red-800">
        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
        <div>{error}</div>
        {onRetry ? (
          <button type="button" onClick={onRetry} className="min-h-[40px] rounded-lg border border-red-300 bg-white px-4 font-semibold hover:bg-red-50">
            Reintentar
          </button>
        ) : null}
      </div>
    );
  } else if (!loading && data.length === 0) {
    cuerpo = <div className="px-4 py-10 text-center text-sm text-slate-600">{empty}</div>;
  } else if (mobile === 'cards') {
    cuerpo = (
      <>
        <div className="sm:hidden">{tarjetas}</div>
        <div className="hidden overflow-x-auto sm:block">{tabla}</div>
      </>
    );
  } else {
    cuerpo = <div className="overflow-x-auto">{tabla}</div>;
  }

  const mostrarPaginador = !loading && !error && pageSize > 0 && ordenadas.length > pageSize;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-busy={loading || undefined}>
      {toolbar ? <div className="border-b border-slate-200 p-3">{toolbar}</div> : null}
      {cuerpo}
      {mostrarPaginador ? (
        <nav aria-label="Paginación" className="flex items-center justify-between gap-3 border-t border-slate-200 px-3 py-2 text-sm text-slate-600">
          <span>
            {(paginaSegura - 1) * pageSize + 1}–{Math.min(paginaSegura * pageSize, ordenadas.length)} de {ordenadas.length}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage(paginaSegura - 1)}
              disabled={paginaSegura <= 1}
              className="min-h-[36px] rounded-lg border border-slate-300 px-3 font-medium hover:bg-slate-50 disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setPage(paginaSegura + 1)}
              disabled={paginaSegura >= totalPaginas}
              className="min-h-[36px] rounded-lg border border-slate-300 px-3 font-medium hover:bg-slate-50 disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}

export default DataTable;
