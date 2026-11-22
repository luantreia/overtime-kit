import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
const CONFIG = {
    pendiente: { texto: 'Pendiente de aprobación', clase: 'border-amber-200 bg-amber-50 text-amber-900', Icono: ClockIcon },
    aprobado: { texto: 'Aprobado', clase: 'border-emerald-200 bg-emerald-50 text-emerald-900', Icono: CheckCircleIcon },
    rechazado: { texto: 'Rechazado', clase: 'border-red-200 bg-red-50 text-red-900', Icono: XCircleIcon },
};
const haceCuanto = (f) => {
    const ms = Date.now() - new Date(f).getTime();
    if (Number.isNaN(ms))
        return '';
    const min = Math.round(ms / 60000);
    if (min < 60)
        return min <= 1 ? 'hace un momento' : `hace ${min} min`;
    const h = Math.round(min / 60);
    if (h < 24)
        return `hace ${h} h`;
    const d = Math.round(h / 24);
    return d === 1 ? 'hace 1 día' : `hace ${d} días`;
};
/**
 * Cómo se ve un cambio que pasó por aprobación, igual en las seis apps. Antes cada una lo
 * resolvía distinto (badge, tarjeta de dashboard, contador en el perfil, página aparte) y en
 * Partido no se veía.
 *
 * La regla de uso: se pone EN el objeto afectado (la fila del jugador, el encabezado del
 * partido), no sólo en una bandeja aparte. Quien hizo el cambio tiene que verlo donde lo hizo.
 * Sin conocimiento de dominio: no sabe qué es una SolicitudEdicion, recibe el estado ya mapeado.
 */
const EstadoAprobacion = ({ estado, aprobador, fecha, motivo, variante = 'chip', className = '', }) => {
    const c = CONFIG[estado];
    const { Icono } = c;
    const detalle = [
        estado === 'pendiente' && aprobador ? `espera a ${aprobador}` : null,
        fecha ? haceCuanto(fecha) : null,
    ]
        .filter(Boolean)
        .join(' · ');
    if (variante === 'chip') {
        return (_jsxs("span", { className: `inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${c.clase} ${className}`, title: [c.texto, detalle, motivo].filter(Boolean).join(' — '), children: [_jsx(Icono, { className: "h-3.5 w-3.5", "aria-hidden": "true" }), estado === 'pendiente' ? 'Pendiente' : c.texto] }));
    }
    return (_jsxs("div", { role: "status", className: `flex items-start gap-2 rounded-xl border px-3 py-2 text-sm ${c.clase} ${className}`, children: [_jsx(Icono, { className: "mt-0.5 h-5 w-5 shrink-0", "aria-hidden": "true" }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "font-semibold", children: c.texto }), detalle ? _jsx("p", { className: "opacity-80", children: detalle }) : null, motivo ? _jsxs("p", { className: "mt-1 opacity-90", children: ["Motivo: ", motivo] }) : null] })] }));
};
export default EstadoAprobacion;
//# sourceMappingURL=EstadoAprobacion.js.map