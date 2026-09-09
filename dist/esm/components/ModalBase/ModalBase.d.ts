import type { ReactNode } from 'react';
import type { ModalSize } from '../Modal/Modal';
export interface ModalBaseProps {
    children: ReactNode;
    onClose: () => void;
    title?: ReactNode;
    subtitle?: ReactNode;
    size?: ModalSize;
    showCloseButton?: boolean;
    footer?: ReactNode;
    className?: string;
    contentClassName?: string;
    headerClassName?: string;
    footerClassName?: string;
    scrollable?: boolean;
    maxHeightClass?: string;
    bodyClassName?: string;
    isOpen?: boolean;
    overlayClassName?: string;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
    /**
     * Marcá el modal como "tiene cambios sin guardar" y cerrar por backdrop o Escape pide
     * confirmación. En mobile el backdrop se toca sin querer todo el tiempo: sin esto, una
     * planilla entera de estadísticas se pierde con un roce.
     */
    hasUnsavedChanges?: boolean;
    unsavedMessage?: string;
}
/**
 * Compatibilidad con el `ModalBase` que hoy vive copiado en las seis apps (68 archivos lo usan).
 *
 * Reproduce la versión de dodgeballmanager, que es la que acumuló los arreglos reales: guard de
 * cambios sin guardar, alturas en `dvh`, reserva de la columna del botón de cerrar en el
 * encabezado, pie fijo con fondo propio y título que baja de tamaño en mobile. Las otras cinco
 * copias se quedaron sin ninguno de esos.
 *
 * @deprecated Usá `Overlay` en código nuevo: ya trae `title`, `subtitle` y `footer`, así que esta
 * capa intermedia deja de hacer falta.
 */
declare const ModalBase: ({ children, onClose, title, subtitle, size, showCloseButton, footer, footerClassName, headerClassName, className, contentClassName, scrollable, maxHeightClass, bodyClassName, isOpen, overlayClassName, closeOnBackdrop, closeOnEscape, hasUnsavedChanges, unsavedMessage, }: ModalBaseProps) => import("react").JSX.Element;
export default ModalBase;
//# sourceMappingURL=ModalBase.d.ts.map