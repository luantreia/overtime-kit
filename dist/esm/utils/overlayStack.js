/**
 * Pila global de capas abiertas (modales, paneles, hojas, confirmaciones).
 *
 * Unifica dos mecanismos que hasta ahora vivían en apps distintas y ninguna tenía los dos:
 *
 * - El z-index incremental venía de Overtime-Public (`shared/utils/modalZIndex.ts`). Sin él, un
 *   modal abierto desde otro modal puede quedar por debajo, porque el orden de apilado lo decide
 *   la posición en el árbol de componentes y no cuál se abrió último.
 *
 * - El registro de capas abiertas venía de dodgeballmanager. Resuelve dos cosas: el scroll del
 *   body se libera recién al cerrar la última capa, y la tecla Escape sólo la atiende la capa de
 *   más arriba (antes el listener vivía en `document`, así que con dos capas abiertas las dos
 *   recibían la tecla: cancelabas una confirmación y perdías también la pantalla de atrás).
 *
 * OJO CON EL ORDEN DE LOS EFECTOS: una versión anterior de esto asignaba el nivel de cada capa
 * DENTRO de un useEffect, incrementando un contador compartido cada vez que una se montaba. Eso
 * se rompe en un caso real y nada raro: una confirmación de borrado escrita como hijo de JSX del
 * modal que la abre, con las dos ya montadas en el mismo commit —
 *
 *     {abierto && <ModalBase>...<ConfirmModal isOpen /></ModalBase>}
 *
 * — porque React corre los efectos de los hijos ANTES que los del padre dentro de un mismo
 * commit. El hijo (la confirmación, que visualmente va arriba) se registraba primero y se
 * llevaba el nivel más bajo; el padre se registraba después y quedaba "más arriba" según el
 * contador, invirtiendo el apilado real. Con eso, Escape cerraba el modal de fondo en vez de la
 * confirmación, y de paso se llevaba puesto todo lo que había adentro.
 *
 * La solución es no depender del ORDEN en que se registran las capas. Cada capa pide su
 * z-index durante el render (no en un efecto) — el render de React sí va padre-antes-que-hijo,
 * siempre — y ese z-index es también su identidad en la pila. "Soy la capa de arriba" se decide
 * en el momento de la tecla, mirando cuál es el mayor de los z-index actualmente montados, no
 * comparando contra un contador que fue incrementándose en un orden que no era el correcto.
 */
let zCounter = 100;
/** Próximo z-index. Se pide una vez por apertura —durante el render, ver `Overlay.tsx`—, no en un efecto. */
export const siguienteZIndex = () => {
    zCounter += 10;
    return zCounter;
};
/** z-index de cada capa actualmente montada y abierta. Un conjunto, no un contador: no importa
 * en qué orden se registran (los efectos pueden llegar en cualquier orden), sólo importa cuáles
 * siguen adentro en el momento de preguntar. */
const zIndicesAbiertos = new Set();
/**
 * Registra una capa recién abierta, identificada por el z-index que ya pidió durante su render.
 * Devuelve la función de baja. Es idempotente para que un doble desmontaje (StrictMode en
 * desarrollo monta y desmonta los efectos dos veces) no dé de baja dos veces la misma capa.
 */
export function registrarCapa(zIndex) {
    zIndicesAbiertos.add(zIndex);
    if (zIndicesAbiertos.size === 1) {
        document.body.style.overflow = 'hidden';
    }
    let dadaDeBaja = false;
    return () => {
        if (dadaDeBaja)
            return;
        dadaDeBaja = true;
        zIndicesAbiertos.delete(zIndex);
        if (zIndicesAbiertos.size === 0) {
            document.body.style.overflow = 'unset';
        }
    };
}
/**
 * Si el z-index dado es el de la capa de más arriba entre las que siguen montadas. Se calcula
 * en el momento (no se guarda), así que no le importa en qué orden se registraron.
 */
export const esLaCapaDeArriba = (zIndex) => {
    if (zIndicesAbiertos.size === 0)
        return false;
    return zIndex === Math.max(...zIndicesAbiertos);
};
/** Cuántas capas hay abiertas ahora mismo. */
export const capasAbiertas = () => zIndicesAbiertos.size;
/**
 * Compatibilidad con el nombre que usaba Overtime-Public. Los overlays hechos a mano que todavía
 * no migraron a `<Overlay>` siguen pidiendo su z-index por acá, así que comparten la misma pila
 * y se apilan bien contra los que sí migraron.
 */
export const getNextModalZIndex = siguienteZIndex;
//# sourceMappingURL=overlayStack.js.map