const qs = (ref) => (ref.setPartido ? `setPartido=${ref.setPartido}` : `planillaSet=${ref.planillaSet}`);
const json = (method, body) => ({ method, body: JSON.stringify(body) });
export function crearApiCaptura(fetcher) {
    return {
        leer: (ref) => fetcher(`/eventos-set?${qs(ref)}`),
        agregarEvento: (ref, e) => fetcher('/eventos-set', json('POST', { ...ref, ...e })),
        borrarEvento: (id) => fetcher(`/eventos-set/${id}`, { method: 'DELETE' }),
        guardarAlineacion: (ref, alineacion) => fetcher('/eventos-set/alineacion', json('PUT', { ...ref, alineacion })),
        /** `marcarAhora: false`: con origen 'en_vivo', guardar los segundos tal cual (no "ahora"). */
        guardarTiempo: (ref, tiempo, opciones) => fetcher('/eventos-set/tiempo', json('PUT', { ...ref, tiempo, ...(opciones !== null && opciones !== void 0 ? opciones : {}) })),
        /** "Esta marca en vivo está en este segundo del video": alinea todas las del partido. */
        alinearEnVivo: (eventoId, segundo) => fetcher('/eventos-set/reloj-en-vivo', json('PUT', { eventoId, segundo })),
        /** Lo mismo, pero con un momento del reloj de juego (p. ej. el inicio del 1T). */
        alinearEnVivoConReloj: (setPartido, hora, segundo) => fetcher('/eventos-set/reloj-en-vivo', json('PUT', { setPartido, hora, segundo })),
        /** Inicio y fin del partido marcados en diferido, en la planilla o en el partido. */
        guardarVentana: (destino, ventana) => fetcher('/eventos-set/ventana', json('PUT', { ...destino, ventana })),
        guardarGanador: (ref, ganadorSet) => fetcher('/eventos-set/ganador', json('PUT', { ...ref, ganadorSet })),
        guardarVideos: (partidoId, videos) => fetcher(`/eventos-set/videos/${partidoId}`, json('PUT', { videos })),
        /** Cámaras propias de una planilla: no tocan el partido; se suman al oficializar. */
        guardarVideosPlanilla: (planillaId, videos) => fetcher(`/eventos-set/videos-planilla/${planillaId}`, json('PUT', { videos })),
    };
}
//# sourceMappingURL=api.js.map