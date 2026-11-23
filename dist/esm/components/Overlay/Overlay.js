import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { registrarCapa, siguienteZIndex, esLaCapaDeArriba } from '../../utils/overlayStack';
/**
 * Única primitiva de capa del kit.
 *
 * Reemplaza a `ui/Modal`, a `ModalBase`, a `ConfirmModal` y a los overlays `fixed inset-0`
 * escritos a mano en cada pantalla. Todo lo que hacía bien alguna de esas copias está acá:
 * portal, trampa de foco, Escape, bloqueo de scroll, apilado de z-index, pantalla completa en
 * mobile y respeto del área segura.
 *
 * Los tamaños y el modo pantalla completa usan el breakpoint `boxed`, que las apps definen en su
 * `tailwind.config.js` (o heredan del preset del kit). Ver el comentario de `contenedorClasses`.
 */
const Overlay = ({ isOpen, onClose, children, presentacion = 'modal', size = 'md', title, subtitle, footer, closeOnBackdrop = true, closeOnEscape = true, showCloseButton = true, bodyScroll = true, className = '', overlayClassName = '', bodyClassName = 'px-4 py-4 sm:px-6', footerClassName = '', headerClassName = '', ...props }) => {
    const contenedorRef = useRef(null);
    const idBase = useId();
    /**
     * El z-index se pide DURANTE EL RENDER, no en un efecto. Importa el motivo: los efectos de
     * React corren de hijo a padre dentro de un mismo commit, así que si esta capa nace ya
     * abierta y anidada dentro de otra que también nace abierta (`{abierto && <ModalBase>
     * ...<ConfirmModal isOpen /></ModalBase>}`), pedir el z-index en un efecto le daría el
     * número más alto al padre, no al hijo — exactamente al revés de cómo se ven en pantalla.
     * El render, en cambio, siempre va padre-antes-que-hijo, así que asignarlo ahí respeta el
     * orden visual real. `estabaAbierta` guarda si la capa YA estaba abierta en el render
     * anterior: sólo se pide un z-index nuevo la primera vez que se abre (o al reabrirse tras
     * haberse cerrado sin desmontar), no en cada render mientras sigue abierta.
     */
    const estabaAbierta = useRef(false);
    const zIndexRef = useRef(0);
    if (isOpen && !estabaAbierta.current) {
        zIndexRef.current = siguienteZIndex();
    }
    estabaAbierta.current = isOpen;
    const zIndex = zIndexRef.current;
    // Un modal de confirmación no ofrece la X: se sale por los botones del pie, que dicen qué
    // pasa con cada opción. Una X al lado de "Cancelar partido" es ambigua.
    const conBotonCerrar = showCloseButton && presentacion !== 'confirmacion';
    // Registro en la pila: bloqueo de scroll y quién es la capa de arriba para el Escape. El
    // registro en sí (agregar `zIndex` a un conjunto) no depende del orden en que los efectos
    // corran — a diferencia de un contador que se incrementa en cada registro, un conjunto llega
    // al mismo resultado sin importar en qué orden padre e hijo se registren.
    useEffect(() => {
        if (!isOpen)
            return;
        const darDeBaja = registrarCapa(zIndex);
        const alPresionar = (e) => {
            // Sólo la capa de más arriba (mayor z-index entre las montadas) reacciona a Escape.
            if (closeOnEscape && e.key === 'Escape' && esLaCapaDeArriba(zIndex)) {
                onClose();
            }
        };
        document.addEventListener('keydown', alPresionar);
        return () => {
            document.removeEventListener('keydown', alPresionar);
            darDeBaja();
        };
        // `zIndex` sólo cambia en el mismo render donde `isOpen` pasa a `true` (ver más arriba), así
        // que ya dispara este efecto por sí solo; se lista igual para que el linter no lo asuma
        // desactualizado.
    }, [isOpen, closeOnEscape, onClose, zIndex]);
    // Foco inicial y trampa de foco dentro de la capa.
    useEffect(() => {
        var _a, _b;
        if (!isOpen)
            return;
        const nodo = contenedorRef.current;
        if (!nodo)
            return;
        const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const primero = nodo.querySelector(selector);
        (_b = (_a = (primero !== null && primero !== void 0 ? primero : nodo)).focus) === null || _b === void 0 ? void 0 : _b.call(_a);
        const alTabular = (e) => {
            if (e.key !== 'Tab')
                return;
            const lista = Array.from(nodo.querySelectorAll(selector)).filter((el) => !el.hasAttribute('disabled'));
            if (lista.length === 0)
                return;
            const inicio = lista[0];
            const fin = lista[lista.length - 1];
            const activo = document.activeElement;
            if (e.shiftKey) {
                if (activo === inicio || !nodo.contains(activo)) {
                    fin.focus();
                    e.preventDefault();
                }
            }
            else if (activo === fin) {
                inicio.focus();
                e.preventDefault();
            }
        };
        nodo.addEventListener('keydown', alTabular);
        return () => nodo.removeEventListener('keydown', alTabular);
    }, [isOpen]);
    if (!isOpen)
        return null;
    /**
     * El ancho máximo es una restricción de escritorio real (ancho Y alto de sobra), no sólo de
     * ancho: por eso el prefijo es `boxed:` y no `sm:`. Un celular en horizontal casi siempre
     * supera los 640px de ancho aunque tenga 350-450px de alto; con `sm:` se lo trataba como
     * escritorio y la capa aparecía centrada con márgenes alrededor, regalando altura justo cuando
     * menos sobra —por ejemplo para una grilla de seis jugadores con cuatro contadores cada uno.
     */
    const anchos = {
        sm: 'boxed:max-w-md',
        md: 'boxed:max-w-lg',
        lg: 'boxed:max-w-2xl',
        xl: 'boxed:max-w-4xl',
        '2xl': 'boxed:max-w-6xl',
        full: 'boxed:max-w-full boxed:mx-4',
    };
    /**
     * `dvh` y no `vh`: el 100vh de mobile incluye la barra de direcciones, así que el borde
     * inferior —donde vive el botón de guardar— queda debajo del pliegue.
     *
     * El padding de área segura es obligatorio cuando la capa ocupa la pantalla entera: el
     * `index.html` de las apps declara `viewport-fit=cover`, o sea que el layout se extiende por
     * debajo del notch y de la barra de gestos. Sin eso el encabezado se mete abajo del notch y el
     * pie abajo del home indicator.
     */
    const porPresentacion = {
        modal: [
            'h-[100dvh] w-full rounded-none boxed:h-auto boxed:max-h-[90dvh] boxed:w-auto boxed:rounded-lg',
            'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] boxed:pt-0 boxed:pb-0',
            anchos[size],
        ].join(' '),
        panel: [
            'ml-auto h-[100dvh] w-full max-w-md rounded-none',
            'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]',
        ].join(' '),
        hoja: [
            'mt-auto w-full rounded-t-2xl max-h-[92dvh]',
            'pb-[env(safe-area-inset-bottom)]',
        ].join(' '),
        confirmacion: 'm-auto w-full max-w-sm rounded-2xl mx-4',
    };
    const contenedorClasses = [
        'relative flex flex-col overflow-hidden bg-white shadow-xl transition-all dark:bg-slate-800',
        porPresentacion[presentacion],
        className,
    ]
        .filter(Boolean)
        .join(' ');
    /**
     * La alineación del backdrop es la que posiciona la capa: centrada para modal y confirmación,
     * pegada a la derecha para panel, al fondo para hoja. Sin padding cuando la capa ocupa la
     * pantalla entera, porque cualquier margen sería una franja de backdrop inútil —y tocable por
     * accidente— alrededor del contenido.
     */
    const alineacion = {
        modal: 'items-center justify-center p-0 boxed:p-4',
        panel: 'items-stretch justify-end p-0',
        hoja: 'items-end justify-center p-0',
        confirmacion: 'items-center justify-center p-4',
    };
    const backdropClasses = [
        'fixed inset-0 flex bg-black bg-opacity-50',
        alineacion[presentacion],
        overlayClassName,
    ]
        .filter(Boolean)
        .join(' ');
    // `pr-14` reserva el lugar del botón de cerrar, que está posicionado en absoluto sobre esta
    // franja: sin esa reserva un título largo se le mete debajo y en mobile queda ilegible justo
    // en el renglón más importante.
    const encabezadoClasses = [
        'shrink-0 border-b border-slate-200 px-4 py-3 dark:border-slate-700 sm:px-6 sm:py-4',
        conBotonCerrar ? 'pr-14' : '',
        headerClassName,
    ]
        .filter(Boolean)
        .join(' ');
    // `min-h-0` no es decorativo: sin él este div se niega a encogerse por debajo de su contenido,
    // el `overflow-hidden` del contenedor lo recorta y el `overflow-y-auto` nunca llega a
    // activarse. Resultado: en una capa más alta que el viewport el pie —y con él el botón de
    // guardar— queda inalcanzable.
    const cuerpoClasses = [
        'min-h-0 flex-1 overflow-x-hidden',
        bodyScroll ? 'overflow-y-auto' : 'flex flex-col',
        bodyClassName,
    ]
        .filter(Boolean)
        .join(' ');
    const pieClasses = [
        'shrink-0 border-t border-slate-200 bg-slate-50/60 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/40 sm:px-6',
        footerClassName,
    ]
        .filter(Boolean)
        .join(' ');
    const alClickearFondo = (e) => {
        if (closeOnBackdrop && e.target === e.currentTarget)
            onClose();
    };
    return createPortal(_jsx("div", { className: backdropClasses, style: { zIndex }, onClick: alClickearFondo, children: _jsxs("div", { className: contenedorClasses, role: "dialog", "aria-modal": "true", "aria-labelledby": title ? `overlay-${idBase}-title` : undefined, "aria-describedby": subtitle ? `overlay-${idBase}-subtitle` : undefined, tabIndex: -1, ref: contenedorRef, ...props, children: [presentacion === 'hoja' && (_jsx("div", { "aria-hidden": true, className: "mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" })), (title || subtitle) && (_jsxs("div", { className: encabezadoClasses, children: [title && (_jsx("h3", { id: `overlay-${idBase}-title`, className: "text-lg font-semibold text-slate-900 dark:text-white", children: title })), subtitle && (_jsx("p", { id: `overlay-${idBase}-subtitle`, className: "mt-1 text-sm text-slate-600 dark:text-slate-400", children: subtitle }))] })), _jsx("div", { className: cuerpoClasses, children: children }), footer && _jsx("div", { className: pieClasses, children: footer }), conBotonCerrar && (_jsx("button", { type: "button", onClick: onClose, className: "absolute right-2 top-[calc(env(safe-area-inset-top)+0.5rem)] flex h-11 w-11\n                       items-center justify-center rounded-lg text-slate-400 transition-colors\n                       [touch-action:manipulation] hover:bg-slate-100 hover:text-slate-600\n                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50\n                       dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300\n                       boxed:top-2", "aria-label": "Cerrar", children: _jsx("svg", { className: "h-6 w-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }))] }) }), document.body);
};
export default Overlay;
//# sourceMappingURL=Overlay.js.map