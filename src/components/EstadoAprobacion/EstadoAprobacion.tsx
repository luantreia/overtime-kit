import type { FC } from 'react';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

export type EstadoAprobacionValor = 'pendiente' | 'aprobado' | 'rechazado';

export interface EstadoAprobacionProps {
  estado: EstadoAprobacionValor;
  /** Quién tiene que aprobar: "la organización", "el DT". Responde "¿de quién depende?". */
  aprobador?: string;
  /** Fecha de creación (pendiente) o de resolución (aprobado/rechazado). */
  fecha?: string | Date;
  motivo?: string;
  /** `chip` para filas y encabezados; `bloque` para el detalle del objeto afectado. */
  variante?: 'chip' | 'bloque';
  className?: string;
}

const CONFIG: Record<EstadoAprobacionValor, { texto: string; clase: string; Icono: typeof ClockIcon }> = {
  pendiente: { texto: 'Pendiente de aprobación', clase: 'border-amber-200 bg-amber-50 text-amber-900', Icono: ClockIcon },
  aprobado: { texto: 'Aprobado', clase: 'border-emerald-200 bg-emerald-50 text-emerald-900', Icono: CheckCircleIcon },
  rechazado: { texto: 'Rechazado', clase: 'border-red-200 bg-red-50 text-red-900', Icono: XCircleIcon },
};

const haceCuanto = (f: string | Date) => {
  const ms = Date.now() - new Date(f).getTime();
  if (Number.isNaN(ms)) return '';
  const min = Math.round(ms / 60000);
  if (min < 60) return min <= 1 ? 'hace un momento' : `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
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
const EstadoAprobacion: FC<EstadoAprobacionProps> = ({
  estado,
  aprobador,
  fecha,
  motivo,
  variante = 'chip',
  className = '',
}) => {
  const c = CONFIG[estado];
  const { Icono } = c;
  const detalle = [
    estado === 'pendiente' && aprobador ? `espera a ${aprobador}` : null,
    fecha ? haceCuanto(fecha) : null,
  ]
    .filter(Boolean)
    .join(' · ');

  if (variante === 'chip') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${c.clase} ${className}`}
        title={[c.texto, detalle, motivo].filter(Boolean).join(' — ')}
      >
        <Icono className="h-3.5 w-3.5" aria-hidden="true" />
        {estado === 'pendiente' ? 'Pendiente' : c.texto}
      </span>
    );
  }

  return (
    <div role="status" className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-sm ${c.clase} ${className}`}>
      <Icono className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        <p className="font-semibold">{c.texto}</p>
        {detalle ? <p className="opacity-80">{detalle}</p> : null}
        {motivo ? <p className="mt-1 opacity-90">Motivo: {motivo}</p> : null}
      </div>
    </div>
  );
};

export default EstadoAprobacion;
