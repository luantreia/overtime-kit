/**
 * overtime-kit · Capa 0
 *
 * Primitivas compartidas por las seis apps de Overtime. Sin conocimiento de dominio: acá nada
 * sabe qué es un partido, un equipo ni una fase — eso vive en la Capa 1.
 */
// La primitiva de capa. Todo lo nuevo se escribe con ésta.
export { default as Overlay } from './components/Overlay/Overlay';
// Puentes de compatibilidad: misma API que las copias que hoy viven en cada app, para que migrar
// sea cambiar el import. Se van a ir retirando a medida que las pantallas pasen a `Overlay`.
export { default as Modal } from './components/Modal/Modal';
export { default as ModalBase } from './components/ModalBase/ModalBase';
export { default as ConfirmModal } from './components/ConfirmModal/ConfirmModal';
// Controles. Estos ya estaban idénticos byte a byte en las cinco apps que los tenían: acá sólo
// dejan de estar duplicados.
export { default as Button } from './components/Button/Button';
export { default as Badge } from './components/Badge/Badge';
export { default as Input } from './components/Input/Input';
export { default as Select } from './components/Select/Select';
export { default as Textarea } from './components/Textarea/Textarea';
export { default as Toggle } from './components/Toggle/Toggle';
export { default as Card } from './components/Card/Card';
export { default as Table } from './components/Table/Table';
export { default as Spinner } from './components/Spinner/Spinner';
// Estados de una colección.
export { default as EmptyState } from './components/EmptyState/EmptyState';
export { default as ErrorMessage } from './components/ErrorMessage/ErrorMessage';
// Pila de capas. La exportamos porque los overlays hechos a mano que todavía no migraron
// necesitan pedir su z-index de la misma pila para apilarse bien contra los que sí.
export { siguienteZIndex, getNextModalZIndex, capasAbiertas } from './utils/overlayStack';
// Feedback. Misma API que las seis copias de ToastProvider que vivían en cada app.
export { ToastProvider, useToast } from './components/Toast/ToastProvider';
// `await confirm({...})` en vez de useState + <ConfirmModal> en cada pantalla.
export { ConfirmProvider, useConfirm } from './components/Confirm/ConfirmProvider';
// Estado de un cambio que pasa por aprobación, igual en todas las apps.
export { default as EstadoAprobacion } from './components/EstadoAprobacion/EstadoAprobacion';
//# sourceMappingURL=index.js.map