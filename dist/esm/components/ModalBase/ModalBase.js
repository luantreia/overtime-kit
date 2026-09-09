import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Modal from '../Modal/Modal';
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
const ModalBase = ({ children, onClose, title, subtitle, size = 'lg', showCloseButton = true, footer, footerClassName = '', headerClassName = '', className = '', contentClassName = '', scrollable = true, 
// `dvh` y no `vh`: en mobile el 100vh incluye la barra de direcciones, así que un 90vh real se
// come el borde inferior del modal justo donde vive el botón de guardar. En mobile el modal
// ocupa la pantalla entera (lo resuelve `Overlay`), así que el 90% queda sólo para escritorio,
// donde un diálogo pegado a los bordes se ve mal.
maxHeightClass = 'max-h-[100dvh] sm:max-h-[90dvh]', bodyClassName = 'px-4 py-3 sm:px-6 sm:py-4', isOpen = true, overlayClassName, closeOnBackdrop, closeOnEscape, hasUnsavedChanges = false, unsavedMessage = 'Tenés cambios sin guardar. ¿Querés cerrar y descartarlos?', }) => {
    const handleClose = () => {
        if (hasUnsavedChanges && !window.confirm(unsavedMessage))
            return;
        onClose();
    };
    const mergedClassName = [
        'relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/70',
        'dark:bg-slate-900 dark:ring-slate-700/60',
        scrollable ? maxHeightClass : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');
    // `pr-12` reserva la columna del botón de cerrar, que va posicionado en absoluto encima de esta
    // franja. Sin eso, en un teléfono el título se le mete abajo: un título largo a 24px no entra
    // en 375px de ancho y terminaba partido bajo la X.
    const mergedHeaderClassName = [
        'shrink-0 mb-0.5 sm:mb-1 border-b border-slate-200/70 pb-1 pr-12 sm:pb-2 sm:pr-14 dark:border-slate-700/60',
        headerClassName,
    ]
        .filter(Boolean)
        .join(' ');
    const mergedContentClassName = [
        'flex-1',
        scrollable ? 'overflow-y-auto pr-0.5 sm:pr-1 custom-scrollbar' : '',
        'scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700',
        contentClassName,
    ]
        .filter(Boolean)
        .join(' ');
    /**
     * El pie no scrollea: es hermano del cuerpo dentro de un flex column, y el cuerpo es el único
     * que crece y desborda. Por eso todo lo que sea "guardar" tiene que vivir acá y no al final del
     * contenido — en la captura de un set, el contenido son doce tarjetas de jugador apiladas y el
     * botón quedaba a varias pantallas de scroll de distancia.
     *
     * `bg-white` explícito: al quedar sobre el contenido que pasa por debajo, sin fondo propio se
     * transparentaba.
     */
    const mergedFooterClassName = [
        'shrink-0 mt-2 sm:mt-4 border-t border-slate-200/70 bg-white pt-2 sm:pt-4',
        'dark:border-slate-700/60 dark:bg-slate-900',
        footerClassName,
    ]
        .filter(Boolean)
        .join(' ');
    return (_jsxs(Modal, { isOpen: isOpen, onClose: handleClose, size: size, className: mergedClassName, showCloseButton: showCloseButton, bodyClassName: bodyClassName, overlayClassName: overlayClassName, closeOnBackdrop: closeOnBackdrop, closeOnEscape: closeOnEscape, children: [(title || subtitle) && (_jsxs("div", { className: mergedHeaderClassName, children: [title && (_jsx("h2", { className: "text-lg font-semibold leading-tight text-slate-900 sm:text-2xl dark:text-white", children: title })), subtitle && (_jsx("p", { className: "mt-1 text-sm text-slate-500 dark:text-slate-300/80", children: subtitle }))] })), _jsx("div", { className: mergedContentClassName, children: children }), footer && _jsx("div", { className: mergedFooterClassName, children: footer })] }));
};
export default ModalBase;
//# sourceMappingURL=ModalBase.js.map