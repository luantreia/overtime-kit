/**
 * overtime-kit · Capa 0
 *
 * Primitivas compartidas por las seis apps de Overtime. Sin conocimiento de dominio: acá nada
 * sabe qué es un partido, un equipo ni una fase — eso vive en la Capa 1.
 */
export { default as Overlay } from './components/Overlay/Overlay';
export type { OverlayProps, OverlaySize, OverlayPresentacion } from './components/Overlay/Overlay';
export { default as Modal } from './components/Modal/Modal';
export type { ModalProps, ModalSize } from './components/Modal/Modal';
export { default as ModalBase } from './components/ModalBase/ModalBase';
export type { ModalBaseProps } from './components/ModalBase/ModalBase';
export { default as ConfirmModal } from './components/ConfirmModal/ConfirmModal';
export { default as Button } from './components/Button/Button';
export { default as Badge } from './components/Badge/Badge';
export { default as Input } from './components/Input/Input';
export { default as Select } from './components/Select/Select';
export { default as Textarea } from './components/Textarea/Textarea';
export { default as Toggle } from './components/Toggle/Toggle';
export { default as Card } from './components/Card/Card';
export { default as Table } from './components/Table/Table';
export { default as Spinner } from './components/Spinner/Spinner';
export { default as EmptyState } from './components/EmptyState/EmptyState';
export type { EmptyStateProps } from './components/EmptyState/EmptyState';
export { default as ErrorMessage } from './components/ErrorMessage/ErrorMessage';
export type { ButtonProps } from './components/Button/Button';
export type { BadgeProps } from './components/Badge/Badge';
export type { InputProps } from './components/Input/Input';
export type { SelectProps, SelectOption } from './components/Select/Select';
export type { ToggleProps } from './components/Toggle/Toggle';
export type { CardProps } from './components/Card/Card';
export type { TableProps } from './components/Table/Table';
export type { SpinnerProps } from './components/Spinner/Spinner';
export { siguienteZIndex, getNextModalZIndex, capasAbiertas } from './utils/overlayStack';
export { ToastProvider, useToast } from './components/Toast/ToastProvider';
export type { Toast, ToastType, ToastContextValue } from './components/Toast/ToastProvider';
export { ConfirmProvider, useConfirm } from './components/Confirm/ConfirmProvider';
export type { ConfirmOptions } from './components/Confirm/ConfirmProvider';
export { default as EstadoAprobacion } from './components/EstadoAprobacion/EstadoAprobacion';
export type { EstadoAprobacionProps, EstadoAprobacionValor } from './components/EstadoAprobacion/EstadoAprobacion';
//# sourceMappingURL=index.d.ts.map