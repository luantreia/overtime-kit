"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const outline_1 = require("@heroicons/react/24/outline");
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
const VISIBLE_FROM = {
    sm: 'hidden sm:table-cell',
    md: 'hidden md:table-cell',
    lg: 'hidden lg:table-cell',
    xl: 'hidden xl:table-cell',
};
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
function DataTable({ columns, data, rowKey, loading = false, error, onRetry, empty, onRowClick, caption, toolbar, pageSize = 25, sort: sortProp, defaultSort = null, onSortChange, page: pageProp, onPageChange, mobile = 'cards', rowClassName, stickyHeader = false, stickyFirstColumn = false, maxHeightClassName = '', renderExpanded, }) {
    const [expandidas, setExpandidas] = (0, react_1.useState)(() => new Set());
    const alternarExpandida = (key) => setExpandidas((prev) => {
        const next = new Set(prev);
        if (next.has(key))
            next.delete(key);
        else
            next.add(key);
        return next;
    });
    const celdaClase = (col, i, fondo) => {
        var _a, _b;
        return [
            ALIGN[(_a = col.align) !== null && _a !== void 0 ? _a : 'left'],
            (_b = col.className) !== null && _b !== void 0 ? _b : '',
            col.visibleFrom ? VISIBLE_FROM[col.visibleFrom] : '',
            stickyFirstColumn && i === 0 ? `sticky left-0 z-[1] ${fondo}` : '',
        ].join(' ');
    };
    const hayFooter = columns.some((c) => c.footer);
    const [sortInterno, setSortInterno] = (0, react_1.useState)(defaultSort);
    const [pageInterna, setPageInterna] = (0, react_1.useState)(1);
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
    const ordenadas = (0, react_1.useMemo)(() => {
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
    /** Botón de expandir, dentro de la primera celda (así no corre la columna fija). */
    const botonExpandir = (fila) => {
        if (!renderExpanded || renderExpanded(fila) == null)
            return null;
        const key = rowKey(fila);
        const abierta = expandidas.has(key);
        return ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: (e) => {
                e.stopPropagation();
                alternarExpandida(key);
            }, "aria-expanded": abierta, "aria-label": abierta ? 'Ocultar detalle' : 'Ver detalle', className: "-my-1 mr-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md align-middle text-slate-500 hover:bg-slate-100", children: (0, jsx_runtime_1.jsx)(outline_1.ChevronDownIcon, { className: `h-4 w-4 transition-transform ${abierta ? 'rotate-180' : ''}`, "aria-hidden": "true" }) }));
    };
    const tabla = ((0, jsx_runtime_1.jsxs)("table", { className: "w-full text-sm", children: [(0, jsx_runtime_1.jsx)("caption", { className: "sr-only", children: caption }), (0, jsx_runtime_1.jsx)("thead", { className: `border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600 ${stickyHeader ? 'sticky top-0 z-[2]' : ''}`, children: (0, jsx_runtime_1.jsx)("tr", { children: columns.map((col, i) => {
                        const activa = (sort === null || sort === void 0 ? void 0 : sort.columna) === col.id;
                        const ariaSort = activa ? (sort.direccion === 'asc' ? 'ascending' : 'descending') : col.sortValue ? 'none' : undefined;
                        const Icono = !activa ? outline_1.ChevronUpDownIcon : sort.direccion === 'asc' ? outline_1.ChevronUpIcon : outline_1.ChevronDownIcon;
                        return ((0, jsx_runtime_1.jsx)("th", { scope: "col", "aria-sort": ariaSort, className: `px-3 py-2 ${celdaClase(col, i, 'bg-slate-50')}`, children: col.sortValue ? ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => alternarOrden(col), className: `inline-flex items-center gap-1 rounded uppercase hover:text-slate-900 ${activa ? 'text-slate-900' : ''}`, children: [col.header, (0, jsx_runtime_1.jsx)(Icono, { className: `h-3.5 w-3.5 ${activa ? '' : 'opacity-40'}`, "aria-hidden": "true" })] })) : (col.header) }, col.id));
                    }) }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "divide-y divide-slate-100 bg-white", children: loading
                    ? Array.from({ length: Math.min(pageSize || 5, 5) }).map((_, i) => ((0, jsx_runtime_1.jsx)("tr", { "aria-hidden": "true", children: columns.map((col, i) => ((0, jsx_runtime_1.jsx)("td", { className: `px-3 py-3 ${celdaClase(col, i, 'bg-white')}`, children: (0, jsx_runtime_1.jsx)("div", { className: "h-4 w-3/4 animate-pulse rounded bg-slate-200" }) }, col.id))) }, `sk-${i}`)))
                    : visibles.map((fila) => {
                        const key = rowKey(fila);
                        // La celda fija hereda el fondo de la fila (bg-inherit): sin fondo propio en la fila,
                        // el contenido que pasa por debajo al hacer scroll se vería a través.
                        const extra = (rowClassName === null || rowClassName === void 0 ? void 0 : rowClassName(fila)) || 'bg-white';
                        const detalle = renderExpanded && expandidas.has(key) ? renderExpanded(fila) : null;
                        return ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("tr", { className: `${clickable} ${extra}`, ...filaProps(fila), children: columns.map((col, i) => ((0, jsx_runtime_1.jsxs)("td", { className: `px-3 py-2.5 text-slate-800 ${celdaClase(col, i, 'bg-inherit')}`, children: [i === 0 ? botonExpandir(fila) : null, col.cell(fila)] }, col.id))) }), detalle != null ? ((0, jsx_runtime_1.jsx)("tr", { className: "bg-slate-50/60", children: (0, jsx_runtime_1.jsx)("td", { colSpan: columns.length, className: "px-3 py-3", children: detalle }) })) : null] }, key));
                    }) }), hayFooter && !loading ? ((0, jsx_runtime_1.jsx)("tfoot", { className: "border-t-2 border-slate-200 bg-slate-50 font-semibold text-slate-900", children: (0, jsx_runtime_1.jsx)("tr", { children: columns.map((col, i) => ((0, jsx_runtime_1.jsx)("td", { className: `px-3 py-2 ${celdaClase(col, i, 'bg-slate-50')}`, children: col.footer ? col.footer(ordenadas) : null }, col.id))) }) })) : null] }));
    const tarjetas = ((0, jsx_runtime_1.jsx)("ul", { className: "divide-y divide-slate-100 bg-white", "aria-label": caption, children: loading
            ? Array.from({ length: 3 }).map((_, i) => ((0, jsx_runtime_1.jsxs)("li", { className: "space-y-2 p-3", "aria-hidden": "true", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 w-1/2 animate-pulse rounded bg-slate-200" }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 w-3/4 animate-pulse rounded bg-slate-200" })] }, `skm-${i}`)))
            : visibles.map((fila) => {
                var _a;
                const [principal, ...resto] = columns.filter((c) => !c.hideOnMobile);
                const key = rowKey(fila);
                const detalle = renderExpanded && expandidas.has(key) ? renderExpanded(fila) : null;
                return ((0, jsx_runtime_1.jsxs)("li", { className: `p-3 ${clickable} ${(_a = rowClassName === null || rowClassName === void 0 ? void 0 : rowClassName(fila)) !== null && _a !== void 0 ? _a : ''}`, ...filaProps(fila), children: [principal ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start font-semibold text-slate-900", children: [botonExpandir(fila), (0, jsx_runtime_1.jsx)("div", { className: "min-w-0 flex-1", children: principal.cell(fila) })] })) : null, resto.length > 0 ? ((0, jsx_runtime_1.jsx)("dl", { className: "mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-sm", children: resto.map((col) => ((0, jsx_runtime_1.jsxs)("div", { className: "min-w-0", children: [(0, jsx_runtime_1.jsx)("dt", { className: "text-xs text-slate-500", children: col.header }), (0, jsx_runtime_1.jsx)("dd", { className: "break-words text-slate-800", children: col.cell(fila) })] }, col.id))) })) : null, detalle != null ? (0, jsx_runtime_1.jsx)("div", { className: "mt-2 rounded-lg bg-slate-50 p-2", children: detalle }) : null] }, key));
            }) }));
    let cuerpo;
    if (error && !loading) {
        cuerpo = ((0, jsx_runtime_1.jsxs)("div", { role: "alert", className: "flex flex-col items-center gap-3 px-4 py-10 text-center text-sm text-red-800", children: [(0, jsx_runtime_1.jsx)(outline_1.ExclamationTriangleIcon, { className: "h-6 w-6 text-red-600", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("div", { children: error }), onRetry ? ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onRetry, className: "min-h-[40px] rounded-lg border border-red-300 bg-white px-4 font-semibold hover:bg-red-50", children: "Reintentar" })) : null] }));
    }
    else if (!loading && data.length === 0) {
        cuerpo = (0, jsx_runtime_1.jsx)("div", { className: "px-4 py-10 text-center text-sm text-slate-600", children: empty });
    }
    else if (mobile === 'cards') {
        cuerpo = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "sm:hidden", children: tarjetas }), (0, jsx_runtime_1.jsx)("div", { className: `hidden overflow-auto sm:block ${maxHeightClassName}`, children: tabla })] }));
    }
    else {
        cuerpo = (0, jsx_runtime_1.jsx)("div", { className: `overflow-auto ${maxHeightClassName}`, children: tabla });
    }
    const mostrarPaginador = !loading && !error && pageSize > 0 && ordenadas.length > pageSize;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm", "aria-busy": loading || undefined, children: [toolbar ? (0, jsx_runtime_1.jsx)("div", { className: "border-b border-slate-200 p-3", children: toolbar }) : null, cuerpo, mostrarPaginador ? ((0, jsx_runtime_1.jsxs)("nav", { "aria-label": "Paginaci\u00F3n", className: "flex items-center justify-between gap-3 border-t border-slate-200 px-3 py-2 text-sm text-slate-600", children: [(0, jsx_runtime_1.jsxs)("span", { children: [(paginaSegura - 1) * pageSize + 1, "\u2013", Math.min(paginaSegura * pageSize, ordenadas.length), " de ", ordenadas.length] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setPage(paginaSegura - 1), disabled: paginaSegura <= 1, className: "min-h-[36px] rounded-lg border border-slate-300 px-3 font-medium hover:bg-slate-50 disabled:opacity-40", children: "Anterior" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setPage(paginaSegura + 1), disabled: paginaSegura >= totalPaginas, className: "min-h-[36px] rounded-lg border border-slate-300 px-3 font-medium hover:bg-slate-50 disabled:opacity-40", children: "Siguiente" })] })] })) : null] }));
}
exports.default = DataTable;
//# sourceMappingURL=DataTable.js.map