"use strict";
/**
 * overtime-kit · Capa 0
 *
 * Primitivas compartidas por las seis apps de Overtime. Sin conocimiento de dominio: acá nada
 * sabe qué es un partido, un equipo ni una fase — eso vive en la Capa 1.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.capasAbiertas = exports.getNextModalZIndex = exports.siguienteZIndex = exports.ErrorMessage = exports.EmptyState = exports.Spinner = exports.Table = exports.Card = exports.Toggle = exports.Textarea = exports.Select = exports.Input = exports.Badge = exports.Button = exports.ConfirmModal = exports.ModalBase = exports.Modal = exports.Overlay = void 0;
// La primitiva de capa. Todo lo nuevo se escribe con ésta.
var Overlay_1 = require("./components/Overlay/Overlay");
Object.defineProperty(exports, "Overlay", { enumerable: true, get: function () { return __importDefault(Overlay_1).default; } });
// Puentes de compatibilidad: misma API que las copias que hoy viven en cada app, para que migrar
// sea cambiar el import. Se van a ir retirando a medida que las pantallas pasen a `Overlay`.
var Modal_1 = require("./components/Modal/Modal");
Object.defineProperty(exports, "Modal", { enumerable: true, get: function () { return __importDefault(Modal_1).default; } });
var ModalBase_1 = require("./components/ModalBase/ModalBase");
Object.defineProperty(exports, "ModalBase", { enumerable: true, get: function () { return __importDefault(ModalBase_1).default; } });
var ConfirmModal_1 = require("./components/ConfirmModal/ConfirmModal");
Object.defineProperty(exports, "ConfirmModal", { enumerable: true, get: function () { return __importDefault(ConfirmModal_1).default; } });
// Controles. Estos ya estaban idénticos byte a byte en las cinco apps que los tenían: acá sólo
// dejan de estar duplicados.
var Button_1 = require("./components/Button/Button");
Object.defineProperty(exports, "Button", { enumerable: true, get: function () { return __importDefault(Button_1).default; } });
var Badge_1 = require("./components/Badge/Badge");
Object.defineProperty(exports, "Badge", { enumerable: true, get: function () { return __importDefault(Badge_1).default; } });
var Input_1 = require("./components/Input/Input");
Object.defineProperty(exports, "Input", { enumerable: true, get: function () { return __importDefault(Input_1).default; } });
var Select_1 = require("./components/Select/Select");
Object.defineProperty(exports, "Select", { enumerable: true, get: function () { return __importDefault(Select_1).default; } });
var Textarea_1 = require("./components/Textarea/Textarea");
Object.defineProperty(exports, "Textarea", { enumerable: true, get: function () { return __importDefault(Textarea_1).default; } });
var Toggle_1 = require("./components/Toggle/Toggle");
Object.defineProperty(exports, "Toggle", { enumerable: true, get: function () { return __importDefault(Toggle_1).default; } });
var Card_1 = require("./components/Card/Card");
Object.defineProperty(exports, "Card", { enumerable: true, get: function () { return __importDefault(Card_1).default; } });
var Table_1 = require("./components/Table/Table");
Object.defineProperty(exports, "Table", { enumerable: true, get: function () { return __importDefault(Table_1).default; } });
var Spinner_1 = require("./components/Spinner/Spinner");
Object.defineProperty(exports, "Spinner", { enumerable: true, get: function () { return __importDefault(Spinner_1).default; } });
// Estados de una colección.
var EmptyState_1 = require("./components/EmptyState/EmptyState");
Object.defineProperty(exports, "EmptyState", { enumerable: true, get: function () { return __importDefault(EmptyState_1).default; } });
var ErrorMessage_1 = require("./components/ErrorMessage/ErrorMessage");
Object.defineProperty(exports, "ErrorMessage", { enumerable: true, get: function () { return __importDefault(ErrorMessage_1).default; } });
// Pila de capas. La exportamos porque los overlays hechos a mano que todavía no migraron
// necesitan pedir su z-index de la misma pila para apilarse bien contra los que sí.
var overlayStack_1 = require("./utils/overlayStack");
Object.defineProperty(exports, "siguienteZIndex", { enumerable: true, get: function () { return overlayStack_1.siguienteZIndex; } });
Object.defineProperty(exports, "getNextModalZIndex", { enumerable: true, get: function () { return overlayStack_1.getNextModalZIndex; } });
Object.defineProperty(exports, "capasAbiertas", { enumerable: true, get: function () { return overlayStack_1.capasAbiertas; } });
//# sourceMappingURL=index.js.map