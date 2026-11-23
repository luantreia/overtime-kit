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
export { crearApiCaptura } from './api';
export { default as ReproductorPartido } from './ReproductorPartido';
export { default as CapturaSet } from './CapturaSet';
export { default as CamarasPartido } from './CamarasPartido';
export * from './supervivencia';
export * from './reloj';
export { default as CapturaSetOficial } from './CapturaSetOficial';
//# sourceMappingURL=index.js.map