import type { FC, ReactNode } from 'react';
import type { ModalSize } from '../Modal/Modal';
type ConfirmModalProps = {
    isOpen: boolean;
    title?: ReactNode;
    message?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
    variant?: 'danger' | 'primary' | 'default';
    showCancel?: boolean;
    showConfirm?: boolean;
    size?: ModalSize;
};
/**
 * Compatibilidad con el `ConfirmModal` copiado en las seis apps.
 *
 * De las dos versiones que existían, ésta es la de Admin/Organizaciones/Partido, que es un
 * superconjunto estricto de la otra: agrega `showCancel`, `showConfirm` y `size`, y sus valores
 * por defecto dan exactamente el comportamiento de la versión corta. Ninguna app pierde nada.
 *
 * @deprecated Para código nuevo usá `<Overlay presentacion="confirmacion">`, que además evita la
 * X de cerrar en la esquina: en una confirmación la salida son los botones, que dicen qué pasa
 * con cada opción.
 */
declare const ConfirmModal: FC<ConfirmModalProps>;
export default ConfirmModal;
//# sourceMappingURL=ConfirmModal.d.ts.map