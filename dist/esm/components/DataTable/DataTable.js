import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, ChevronUpDownIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
const comparar = (a, b) => {
    if (a == null && b == null)
        return 0;
    if (a == null)
        return 1; // vacíos al final, en cualquier dirección
    if (b == null)
        return -1;
    if (a instanceof Date || b instanceof Date)
        return new Date(a).getTime() - new Date(b).getTime();
    if (typeof a === 'number' && typeof b === 'number')
        return a - b;
    return String(a).localeCompare(String(b), 'es', { numeric: true, sensitivity: 'base' });
};
const ALIGN = { left: 'text-left', right: 'text-right', center: 'text-center' };
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
function DataTable({ columns, data, rowKey, loading = false, error, onRetry, empty, onRowClick, caption, toolbar, pageSize = 25, sort: sortProp, defaultSort = null, onSortChange, page: pageProp, onPageChange, mobile = 'cards', }) {
    const [sortInterno, setSortInterno] = useState(defaultSort);
    const [pageInterna, setPageInterna] = useState(1);
    const sort = sortProp !== undefined ? sortProp : sortInterno;
    const page = pageProp !== undefined ? pageProp : pageInterna;
    const setSort = (s) => {
        if (sortProp === undefined)
            setSortInterno(s);
        onSortChange === null || onSortChange === void 0 ? void 0 : onSortChange(s);
        setPage(1);
    };
    const setPage = (p) => {
        if (pageProp === undefined)
            setPageInterna(p);
        onPageChange === null || onPageChange === void 0 ? void 0 : onPageChange(p);
    };
    const ordenadas = useMemo(() => {
        if (!sort)
            return data;
        const col = columns.find((c) => c.id === sort.columna);
        if (!(col === null || col === void 0 ? void 0 : col.sortValue))
            return data;
        const factor = sort.direccion === 'asc' ? 1 : -1;
        return [...data].sort((a, b) => {
            const va = col.sortValue(a);
            const vb = col.sortValue(b);
            // Los vacíos quedan al final también en descendente.
            if (va == null || vb == null)
                return comparar(va, vb);
            return comparar(va, vb) * factor;
        });
    }, [data, sort, columns]);
    const totalPaginas = pageSize > 0 ? Math.max(1, Math.ceil(ordenadas.length / pageSize)) : 1;
    const paginaSegura = Math.min(Math.max(1, page), totalPaginas);
    const visibles = pageSize > 0 ? ordenadas.slice((paginaSegura - 1) * pageSize, paginaSegura * pageSize) : ordenadas;
    const alternarOrden = (col) => {
        if (!col.sortValue)
            return;
        if (!sort || sort.columna !== col.id)
            setSort({ columna: col.id, direccion: 'asc' });
        else if (sort.direccion === 'asc')
            setSort({ columna: col.id, direccion: 'desc' });
        else
            setSort(null);
    };
    const clickable = onRowClick
        ? 'cursor-pointer hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none'
        : '';
    const filaProps = (fila) => onRowClick
        ? {
            onClick: () => onRowClick(fila),
            onKeyDown: (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onRowClick(fila);
                }
            },
            tabIndex: 0,
        }
        : {};
    const tabla = (_jsxs("table", { className: "w-full text-sm", children: [_jsx("caption", { className: "sr-only", children: caption }), _jsx("thead", { className: "border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600", children: _jsx("tr", { children: columns.map((col) => {
                        var _a, _b;
                        const activa = (sort === null || sort === void 0 ? void 0 : sort.columna) === col.id;
                        const ariaSort = activa ? (sort.direccion === 'asc' ? 'ascending' : 'descending') : col.sortValue ? 'none' : undefined;
                        const Icono = !activa ? ChevronUpDownIcon : sort.direccion === 'asc' ? ChevronUpIcon : ChevronDownIcon;
                        return (_jsx("th", { scope: "col", "aria-sort": ariaSort, className: `px-3 py-2 ${ALIGN[(_a = col.align) !== null && _a !== void 0 ? _a : 'left']} ${(_b = col.className) !== null && _b !== void 0 ? _b : ''}`, children: col.sortValue ? (_jsxs("button", { type: "button", onClick: () => alternarOrden(col), className: `inline-flex items-center gap-1 rounded uppercase hover:text-slate-900 ${activa ? 'text-slate-900' : ''}`, children: [col.header, _jsx(Icono, { className: `h-3.5 w-3.5 ${activa ? '' : 'opacity-40'}`, "aria-hidden": "true" })] })) : (col.header) }, col.id));
                    }) }) }), _jsx("tbody", { className: "divide-y divide-slate-100 bg-white", children: loading
                    ? Array.from({ length: Math.min(pageSize || 5, 5) }).map((_, i) => (_jsx("tr", { "aria-hidden": "true", children: columns.map((col) => (_jsx("td", { className: "px-3 py-3", children: _jsx("div", { className: "h-4 w-3/4 animate-pulse rounded bg-slate-200" }) }, col.id))) }, `sk-${i}`)))
                    : visibles.map((fila) => (_jsx("tr", { className: clickable, ...filaProps(fila), children: columns.map((col) => {
                            var _a, _b;
                            return (_jsx("td", { className: `px-3 py-2.5 text-slate-800 ${ALIGN[(_a = col.align) !== null && _a !== void 0 ? _a : 'left']} ${(_b = col.className) !== null && _b !== void 0 ? _b : ''}`, children: col.cell(fila) }, col.id));
                        }) }, rowKey(fila)))) })] }));
    const tarjetas = (_jsx("ul", { className: "divide-y divide-slate-100 bg-white", "aria-label": caption, children: loading
            ? Array.from({ length: 3 }).map((_, i) => (_jsxs("li", { className: "space-y-2 p-3", "aria-hidden": "true", children: [_jsx("div", { className: "h-4 w-1/2 animate-pulse rounded bg-slate-200" }), _jsx("div", { className: "h-3 w-3/4 animate-pulse rounded bg-slate-200" })] }, `skm-${i}`)))
            : visibles.map((fila) => {
                const [principal, ...resto] = columns.filter((c) => !c.hideOnMobile);
                return (_jsxs("li", { className: `p-3 ${clickable}`, ...filaProps(fila), children: [principal ? _jsx("div", { className: "font-semibold text-slate-900", children: principal.cell(fila) }) : null, resto.length > 0 ? (_jsx("dl", { className: "mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-sm", children: resto.map((col) => (_jsxs("div", { className: "min-w-0", children: [_jsx("dt", { className: "text-xs text-slate-500", children: col.header }), _jsx("dd", { className: "truncate text-slate-800", children: col.cell(fila) })] }, col.id))) })) : null] }, rowKey(fila)));
            }) }));
    let cuerpo;
    if (error && !loading) {
        cuerpo = (_jsxs("div", { role: "alert", className: "flex flex-col items-center gap-3 px-4 py-10 text-center text-sm text-red-800", children: [_jsx(ExclamationTriangleIcon, { className: "h-6 w-6 text-red-600", "aria-hidden": "true" }), _jsx("div", { children: error }), onRetry ? (_jsx("button", { type: "button", onClick: onRetry, className: "min-h-[40px] rounded-lg border border-red-300 bg-white px-4 font-semibold hover:bg-red-50", children: "Reintentar" })) : null] }));
    }
    else if (!loading && data.length === 0) {
        cuerpo = _jsx("div", { className: "px-4 py-10 text-center text-sm text-slate-600", children: empty });
    }
    else if (mobile === 'cards') {
        cuerpo = (_jsxs(_Fragment, { children: [_jsx("div", { className: "sm:hidden", children: tarjetas }), _jsx("div", { className: "hidden overflow-x-auto sm:block", children: tabla })] }));
    }
    else {
        cuerpo = _jsx("div", { className: "overflow-x-auto", children: tabla });
    }
    const mostrarPaginador = !loading && !error && pageSize > 0 && ordenadas.length > pageSize;
    return (_jsxs("div", { className: "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm", "aria-busy": loading || undefined, children: [toolbar ? _jsx("div", { className: "border-b border-slate-200 p-3", children: toolbar }) : null, cuerpo, mostrarPaginador ? (_jsxs("nav", { "aria-label": "Paginaci\u00F3n", className: "flex items-center justify-between gap-3 border-t border-slate-200 px-3 py-2 text-sm text-slate-600", children: [_jsxs("span", { children: [(paginaSegura - 1) * pageSize + 1, "\u2013", Math.min(paginaSegura * pageSize, ordenadas.length), " de ", ordenadas.length] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", onClick: () => setPage(paginaSegura - 1), disabled: paginaSegura <= 1, className: "min-h-[36px] rounded-lg border border-slate-300 px-3 font-medium hover:bg-slate-50 disabled:opacity-40", children: "Anterior" }), _jsx("button", { type: "button", onClick: () => setPage(paginaSegura + 1), disabled: paginaSegura >= totalPaginas, className: "min-h-[36px] rounded-lg border border-slate-300 px-3 font-medium hover:bg-slate-50 disabled:opacity-40", children: "Siguiente" })] })] })) : null] }));
}
export default DataTable;
//# sourceMappingURL=DataTable.js.map