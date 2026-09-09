import type { HTMLAttributes, ReactNode } from 'react';
export type OverlaySize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
/**
 * Cómo se presenta la capa. No es decoración: cada una resuelve un caso distinto.
 *
 * - `modal`        diálogo centrado. El caso general.
 * - `panel`        panel lateral (drawer). Para gestión larga sin perder de vista el listado de
 *                  atrás: inscribir equipos, editar una plantilla.
 * - `hoja`         hoja inferior (bottom sheet). La forma correcta en teléfono, que es donde se
 *                  usa Overtime-Partido al costado de la cancha.
 * - `confirmacion` diálogo chico centrado, sin scroll y sin botón de cerrar en la esquina: la
 *                  salida son los botones del pie, para que no se cierre sin decidir.
 */
export type OverlayPresentacion = 'modal' | 'panel' | 'hoja' | 'confirmacion';
export interface OverlayProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    presentacion?: OverlayPresentacion;
    size?: OverlaySize;
    title?: ReactNode;
    subtitle?: ReactNode;
    /** Pie fijo. No scrollea con el cuerpo: es donde viven guardar y cancelar. */
    footer?: ReactNode;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
    showCloseButton?: boolean;
    /**
     * Si el cuerpo scrollea por su cuenta. En `false` el cuerpo es un flex column que crece y deja
     * el scroll a cargo del contenido — es lo que necesitan las pantallas que tienen su propia
     * zona scrolleable adentro, y lo que hacen hoy los modales que envuelven este componente.
     */
    bodyScroll?: boolean;
    overlayClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
    headerClassName?: string;
}
/**
 * Única primitiva de capa del kit.
 *
 * Reemplaza a `ui/Modal`, a `ModalBase`, a `ConfirmModal` y a los overlays `fixed inset-0`
 * escritos a mano en cada pantalla. Todo lo que hacía bien alguna de esas copias está acá:
 * portal, trampa de foco, Escape, bloqueo de scroll, apilado de z-index, pantalla completa en
 * mobile y respeto del área segura.
 *
 * Los tamaños y el modo pantalla completa usan el breakpoint `boxed`, que las apps definen en su
 * `tailwind.config.js` (o heredan del preset del kit). Ver el comentario de `contenedorClasses`.
 */
declare const Overlay: ({ isOpen, onClose, children, presentacion, size, title, subtitle, footer, closeOnBackdrop, closeOnEscape, showCloseButton, bodyScroll, className, overlayClassName, bodyClassName, footerClassName, headerClassName, ...props }: OverlayProps) => import("react").ReactPortal | null;
export default Overlay;
//# sourceMappingURL=Overlay.d.ts.map