import type { FC } from 'react';
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
/**
 * Cómo se ve un cambio que pasó por aprobación, igual en las seis apps. Antes cada una lo
 * resolvía distinto (badge, tarjeta de dashboard, contador en el perfil, página aparte) y en
 * Partido no se veía.
 *
 * La regla de uso: se pone EN el objeto afectado (la fila del jugador, el encabezado del
 * partido), no sólo en una bandeja aparte. Quien hizo el cambio tiene que verlo donde lo hizo.
 * Sin conocimiento de dominio: no sabe qué es una SolicitudEdicion, recibe el estado ya mapeado.
 */
declare const EstadoAprobacion: FC<EstadoAprobacionProps>;
export default EstadoAprobacion;
//# sourceMappingURL=EstadoAprobacion.d.ts.map