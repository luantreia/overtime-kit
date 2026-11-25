"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartidoCompleto = exports.CapturaSetOficial = exports.CamarasPartido = exports.CapturaSet = exports.ReproductorPartido = exports.crearApiCaptura = void 0;
/**
 * overtime-kit/captura · Capa 1 (dominio)
 *
 * Captura de partidos como en el panel de análisis (realtime-cv-platform): video con reloj de
 * partido y varias cámaras, tiempo de cada set, alineación, y marcas de out/reingreso con la
 * línea de vivos. Igual para el registro oficial y para las planillas, en las cuatro apps que
 * capturan (Manager, dodgeballmanager, Organizaciones, Partido).
 *
 * A diferencia de la Capa 0 (`overtime-kit`), esto sí sabe qué es un set. Habla con
 * `/api/eventos-set` a través del `fetch` autenticado de cada app (`crearApiCaptura`).
 */
var api_1 = require("./api");
Object.defineProperty(exports, "crearApiCaptura", { enumerable: true, get: function () { return api_1.crearApiCaptura; } });
var ReproductorPartido_1 = require("./ReproductorPartido");
Object.defineProperty(exports, "ReproductorPartido", { enumerable: true, get: function () { return __importDefault(ReproductorPartido_1).default; } });
var CapturaSet_1 = require("./CapturaSet");
Object.defineProperty(exports, "CapturaSet", { enumerable: true, get: function () { return __importDefault(CapturaSet_1).default; } });
var CamarasPartido_1 = require("./CamarasPartido");
Object.defineProperty(exports, "CamarasPartido", { enumerable: true, get: function () { return __importDefault(CamarasPartido_1).default; } });
__exportStar(require("./supervivencia"), exports);
__exportStar(require("./reloj"), exports);
var CapturaSetOficial_1 = require("./CapturaSetOficial");
Object.defineProperty(exports, "CapturaSetOficial", { enumerable: true, get: function () { return __importDefault(CapturaSetOficial_1).default; } });
var PartidoCompleto_1 = require("./PartidoCompleto");
Object.defineProperty(exports, "PartidoCompleto", { enumerable: true, get: function () { return __importDefault(PartidoCompleto_1).default; } });
//# sourceMappingURL=index.js.map