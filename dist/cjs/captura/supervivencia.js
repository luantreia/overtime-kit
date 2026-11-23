"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sugerirReingreso = exports.vivosPorLado = exports.estaVivo = exports.lineaDeTiempo = exports.MOTIVOS = void 0;
exports.MOTIVOS = [
    { id: 'hit', label: 'Hit', atajo: 'H' },
    { id: 'catch', label: 'Catch', atajo: 'C' },
    { id: 'linea', label: 'Línea', atajo: 'L' },
    { id: 'otro', label: 'Otro', atajo: 'O' },
];
function lineaDeTiempo(jugadores, eventos, inicio = 0) {
    const filas = new Map(jugadores.map((j) => [j.id, { ...j, tramos: [[inicio, null]] }]));
    for (const e of [...eventos].sort((a, b) => a.t - b.t)) {
        const f = filas.get(e.jugador);
        if (!f)
            continue;
        const ultimo = f.tramos[f.tramos.length - 1];
        const abierto = ultimo !== undefined && ultimo[1] == null;
        if ((e.tipo === 'out' || e.tipo === 'cambio') && abierto)
            ultimo[1] = e.t;
        if (e.tipo === 'reingreso' && !abierto)
            f.tramos.push([e.t, null]);
        if (e.tipo === 'cambio' && e.entra) {
            const ya = filas.get(e.entra);
            if (ya)
                ya.tramos.push([e.t, null]);
            else
                filas.set(e.entra, { id: e.entra, lado: f.lado, entra: true, tramos: [[e.t, null]] });
        }
    }
    return Array.from(filas.values());
}
exports.lineaDeTiempo = lineaDeTiempo;
const estaVivo = (f, t) => f.tramos.some(([a, b]) => t >= a - 1e-6 && (b == null || t < b));
exports.estaVivo = estaVivo;
function vivosPorLado(filas, t) {
    var _a;
    const n = {};
    for (const f of filas)
        n[f.lado] = ((_a = n[f.lado]) !== null && _a !== void 0 ? _a : 0) + ((0, exports.estaVivo)(f, t) ? 1 : 0);
    return n;
}
exports.vivosPorLado = vivosPorLado;
/** Tras un catch de `lado` en t: quién debería volver (el primero que salió y sigue afuera). */
function sugerirReingreso(filas, lado, t) {
    let mejor = null;
    let mt = Infinity;
    for (const f of filas) {
        if (f.lado !== lado || (0, exports.estaVivo)(f, t + 1e-3))
            continue;
        const salida = f.tramos.filter(([, b]) => b != null && b <= t + 1e-3).pop();
        if (salida && salida[1] < mt) {
            mt = salida[1];
            mejor = f.id;
        }
    }
    return mejor;
}
exports.sugerirReingreso = sugerirReingreso;
//# sourceMappingURL=supervivencia.js.map