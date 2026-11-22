import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
export const tabId = (idBase, id) => `${idBase}-tab-${id}`;
export const tabPanelId = (idBase, id) => `${idBase}-panel-${id}`;
const riel = {
    pildora: 'flex gap-2 overflow-x-auto',
    segmentado: 'flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1 dark:bg-slate-800',
    subrayado: 'flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-700',
};
const base = 'inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 [touch-action:manipulation]';
const tamanos = {
    sm: 'min-h-[2.25rem] px-3 text-xs',
    md: 'min-h-[2.5rem] px-4 text-sm',
};
const estado = {
    pildora: {
        activa: 'rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200',
        inactiva: 'rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800',
    },
    segmentado: {
        activa: 'rounded-md bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white',
        inactiva: 'rounded-md text-muted hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
    },
    subrayado: {
        activa: '-mb-px border-b-2 border-brand-600 text-brand-700 dark:border-brand-400 dark:text-brand-300',
        inactiva: '-mb-px border-b-2 border-transparent text-muted hover:border-slate-300 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
    },
};
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
function Tabs({ items, value, onChange, variante = 'pildora', size = 'md', fullWidth = false, idBase, className = '', ...props }) {
    var _a;
    const refs = useRef([]);
    const habilitadas = items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0);
    // Si `value` no coincide con ninguna (p. ej. un ?tab= viejo), la primera habilitada recibe el foco.
    const activaIdx = items.findIndex((it) => it.id === value);
    const focoIdx = activaIdx >= 0 && !items[activaIdx].disabled ? activaIdx : (_a = habilitadas[0]) !== null && _a !== void 0 ? _a : -1;
    const ir = (idx) => {
        var _a;
        const item = items[idx];
        if (!item)
            return;
        (_a = refs.current[idx]) === null || _a === void 0 ? void 0 : _a.focus();
        if (item.id !== value)
            onChange(item.id);
    };
    const onKeyDown = (e, idx) => {
        const pos = habilitadas.indexOf(idx);
        if (pos < 0 || habilitadas.length === 0)
            return;
        let destino;
        if (e.key === 'ArrowRight')
            destino = habilitadas[(pos + 1) % habilitadas.length];
        else if (e.key === 'ArrowLeft')
            destino = habilitadas[(pos - 1 + habilitadas.length) % habilitadas.length];
        else if (e.key === 'Home')
            destino = habilitadas[0];
        else if (e.key === 'End')
            destino = habilitadas[habilitadas.length - 1];
        if (destino === undefined)
            return;
        e.preventDefault();
        ir(destino);
    };
    return (_jsx("div", { role: "tablist", "aria-orientation": "horizontal", className: [riel[variante], fullWidth ? 'w-full' : '', className].filter(Boolean).join(' '), ...props, children: items.map((item, idx) => {
            const activa = item.id === value;
            return (_jsxs("button", { ref: (el) => { refs.current[idx] = el; }, type: "button", role: "tab", id: idBase ? tabId(idBase, item.id) : undefined, "aria-controls": idBase ? tabPanelId(idBase, item.id) : undefined, "aria-selected": activa, tabIndex: idx === focoIdx ? 0 : -1, disabled: item.disabled, onClick: () => onChange(item.id), onKeyDown: (e) => onKeyDown(e, idx), className: [
                    base,
                    tamanos[size],
                    activa ? estado[variante].activa : estado[variante].inactiva,
                    fullWidth ? 'flex-1' : '',
                ].filter(Boolean).join(' '), children: [item.label, item.badge !== undefined && item.badge !== null ? (_jsx("span", { className: "rounded-full bg-slate-200 px-1.5 text-2xs font-semibold text-slate-700 dark:bg-slate-600 dark:text-slate-100", children: item.badge })) : null] }, item.id));
        }) }));
}
/**
 * Contenedor de una pestaña, conectado a su botón para lectores de pantalla. Renderizalo sólo para
 * la pestaña activa (`{tab === 'x' && <TabPanel …>}`): no oculta nada por su cuenta.
 */
export function TabPanel({ idBase, id, children, ...props }) {
    return (_jsx("div", { role: "tabpanel", id: tabPanelId(idBase, id), "aria-labelledby": tabId(idBase, id), tabIndex: -1, ...props, children: children }));
}
export default Tabs;
//# sourceMappingURL=Tabs.js.map