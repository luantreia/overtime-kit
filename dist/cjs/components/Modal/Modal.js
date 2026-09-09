"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Overlay_1 = __importDefault(require("../Overlay/Overlay"));
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
const Modal = ({ isOpen, onClose, children, title, subtitle, size = 'md', closeOnBackdrop = true, closeOnEscape = true, className = '', overlayClassName = '', showCloseButton = true, bodyClassName = 'px-6 py-4', ...props }) => ((0, jsx_runtime_1.jsx)(Overlay_1.default, { isOpen: isOpen, onClose: onClose, presentacion: "modal", size: size, title: title, subtitle: subtitle, closeOnBackdrop: closeOnBackdrop, closeOnEscape: closeOnEscape, showCloseButton: showCloseButton, className: className, overlayClassName: overlayClassName, bodyClassName: bodyClassName, 
    // El `ui/Modal` original no scrollea el cuerpo: es un flex column y el scroll lo maneja el
    // contenido. Mantenerlo así es lo que evita scrollbars dobles en las pantallas que ya traen
    // su propia zona scrolleable adentro.
    bodyScroll: false, ...props, children: children }));
exports.default = Modal;
//# sourceMappingURL=Modal.js.map