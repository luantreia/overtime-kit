const qs = (ref) => (ref.setPartido ? `setPartido=${ref.setPartido}` : `planillaSet=${ref.planillaSet}`);
const json = (method, body) => ({ method, body: JSON.stringify(body) });
export function crearApiCaptura(fetcher) {
    return {
        leer: (ref) => fetcher(`/eventos-set?${qs(ref)}`),
        agregarEvento: (ref, e) => fetcher('/eventos-set', json('POST', { ...ref, ...e })),
        borrarEvento: (id) => fetcher(`/eventos-set/${id}`, { method: 'DELETE' }),
        guardarAlineacion: (ref, alineacion) => fetcher('/eventos-set/alineacion', json('PUT', { ...ref, alineacion })),
        guardarTiempo: (ref, tiempo) => fetcher('/eventos-set/tiempo', json('PUT', { ...ref, tiempo })),
        guardarVideos: (partidoId, videos) => fetcher(`/eventos-set/videos/${partidoId}`, json('PUT', { videos })),
    };
}
//# sourceMappingURL=api.js.map