import type { HTMLAttributes, ReactNode } from 'react';
import Overlay, { type OverlaySize } from '../Overlay/Overlay';

export type ModalSize = OverlaySize;

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  overlayClassName?: string;
  showCloseButton?: boolean;
  bodyClassName?: string;
}

/**
 * Compatibilidad con el `ui/Modal` que hoy viven copiado en las seis apps.
 *
 * Tiene exactamente la misma API, así que migrar una app es cambiar el import y nada más. Por
 * dentro es un `<Overlay presentacion="modal">`, con lo cual el modal viejo hereda de una todos
 * los arreglos que estaban repartidos: apilado de z-index (venía de Public), Escape que sólo
 * atiende la capa de arriba, scroll del body que se libera recién al cerrar la última, pantalla
 * completa en mobile con área segura y botón de cerrar de 44px (venían de dodgeballmanager).
 *
 * Es un puente, no el destino: lo nuevo se escribe con `<Overlay>`, que además ofrece panel,
 * hoja y confirmación, y un pie que no scrollea.
 *
 * @deprecated Usá `Overlay` en código nuevo.
 */
const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = '',
  overlayClassName = '',
  showCloseButton = true,
  bodyClassName = 'px-6 py-4',
  ...props
}: ModalProps) => (
  <Overlay
    isOpen={isOpen}
    onClose={onClose}
    presentacion="modal"
    size={size}
    title={title}
    subtitle={subtitle}
    closeOnBackdrop={closeOnBackdrop}
    closeOnEscape={closeOnEscape}
    showCloseButton={showCloseButton}
    className={className}
    overlayClassName={overlayClassName}
    bodyClassName={bodyClassName}
    // El `ui/Modal` original no scrollea el cuerpo: es un flex column y el scroll lo maneja el
    // contenido. Mantenerlo así es lo que evita scrollbars dobles en las pantallas que ya traen
    // su propia zona scrolleable adentro.
    bodyScroll={false}
    {...props}
  >
    {children}
  </Overlay>
);

export default Modal;
