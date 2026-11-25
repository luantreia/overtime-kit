"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearApiCaptura = void 0;
const qs = (ref) => (ref.setPartido ? `setPartido=${ref.setPartido}` : `planillaSet=${ref.planillaSet}`);
const json = (method, body) => ({ method, body: JSON.stringify(body) });
function crearApiCaptura(fetcher) {
    return {
        leer: (ref) => fetcher(`/eventos-set?${qs(ref)}`),
        agregarEvento: (ref, e) => fetcher('/eventos-set', json('POST', { ...ref, ...e })),
        borrarEvento: (id) => fetcher(`/eventos-set/${id}`, { method: 'DELETE' }),
        guardarAlineacion: (ref, alineacion) => fetcher('/eventos-set/alineacion', json('PUT', { ...ref, alineacion })),
        guardarTiempo: (ref, tiempo) => fetcher('/eventos-set/tiempo', json('PUT', { ...ref, tiempo })),
        /** "Esta marca en vivo está en este segundo del video": alinea todas las del partido. */
        alinearEnVivo: (eventoId, segundo) => fetcher('/eventos-set/reloj-en-vivo', json('PUT', { eventoId, segundo })),
        /** Lo mismo, pero con un momento del reloj de juego (p. ej. el inicio del 1T). */
        alinearEnVivoConReloj: (setPartido, hora, segundo) => fetcher('/eventos-set/reloj-en-vivo', json('PUT', { setPartido, hora, segundo })),
        guardarGanador: (ref, ganadorSet) => fetcher('/eventos-set/ganador', json('PUT', { ...ref, ganadorSet })),
        guardarVideos: (partidoId, videos) => fetcher(`/eventos-set/videos/${partidoId}`, json('PUT', { videos })),
        /** Cámaras propias de una planilla: no tocan el partido; se suman al oficializar. */
        guardarVideosPlanilla: (planillaId, videos) => fetcher(`/eventos-set/videos-planilla/${planillaId}`, json('PUT', { videos })),
    };
}
exports.crearApiCaptura = crearApiCaptura;
//# sourceMappingURL=api.js.map