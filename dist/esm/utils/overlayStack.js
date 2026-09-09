/**
 * Pila global de capas abiertas (modales, paneles, hojas, confirmaciones).
 *
 * Unifica dos mecanismos que hasta ahora vivían en apps distintas y ninguna tenía los dos:
 *
 * - El z-index incremental venía de Overtime-Public (`shared/utils/modalZIndex.ts`). Sin él, un
 *   modal abierto desde otro modal puede quedar por debajo, porque el orden de apilado lo decide
 *   la posición en el árbol de componentes y no cuál se abrió último.
 *
 * - El conteo de capas abiertas venía de dodgeballmanager. Resuelve dos cosas: el scroll del body
 *   se libera recién al cerrar la última capa (antes, cerrar una capa anidada devolvía el scroll
 *   al fondo mientras seguía habiendo otra arriba), y la tecla Escape sólo la atiende la capa de
 *   más arriba (antes el listener vivía en `document`, así que con dos capas abiertas las dos
 *   recibían la tecla: cancelabas una confirmación y perdías también la pantalla de atrás).
 */
let zCounter = 100;
let abiertas = 0;
/** Próximo z-index. Se pide una vez por apertura, no en cada render. */
export const siguienteZIndex = () => {
    zCounter += 10;
    return zCounter;
};
/**
 * Registra una capa recién abierta. Devuelve su nivel en la pila y la función de baja.
 *
 * El nivel sirve para saber si esta capa es la de más arriba: `nivel === capasAbiertas()`.
 * La baja es idempotente para que un doble desmontaje (StrictMode en desarrollo monta y
 * desmonta los efectos dos veces) no desbalancee el contador y deje el body sin scroll.
 */
export function registrarCapa() {
    abiertas += 1;
    const nivel = abiertas;
    if (abiertas === 1) {
        document.body.style.overflow = 'hidden';
    }
    let dadaDeBaja = false;
    const darDeBaja = () => {
        if (dadaDeBaja)
            return;
        dadaDeBaja = true;
        abiertas = Math.max(0, abiertas - 1);
        if (abiertas === 0) {
            document.body.style.overflow = 'unset';
        }
    };
    return { nivel, darDeBaja };
}
/** Cuántas capas hay abiertas ahora mismo. */
export const capasAbiertas = () => abiertas;
/**
 * Compatibilidad con el nombre que usaba Overtime-Public. Los overlays hechos a mano que todavía
 * no migraron a `<Overlay>` siguen pidiendo su z-index por acá, así que comparten la misma pila
 * y se apilan bien contra los que sí migraron.
 */
export const getNextModalZIndex = siguienteZIndex;
//# sourceMappingURL=overlayStack.js.map