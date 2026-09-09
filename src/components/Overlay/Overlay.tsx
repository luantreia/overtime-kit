import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { registrarCapa, siguienteZIndex, capasAbiertas } from '../../utils/overlayStack';

export type OverlaySize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

/**
 * Cómo se presenta la capa. No es decoración: cada una resuelve un caso distinto.
 *
 * - `modal`        diálogo centrado. El caso general.
 * - `panel`        panel lateral (drawer). Para gestión larga sin perder de vista el listado de
 *                  atrás: inscribir equipos, editar una plantilla.
 * - `hoja`         hoja inferior (bottom sheet). La forma correcta en teléfono, que es donde se
 *                  usa Overtime-Partido al costado de la cancha.
 * - `confirmacion` diálogo chico centrado, sin scroll y sin botón de cerrar en la esquina: la
 *                  salida son los botones del pie, para que no se cierre sin decidir.
 */
export type OverlayPresentacion = 'modal' | 'panel' | 'hoja' | 'confirmacion';

export interface OverlayProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  presentacion?: OverlayPresentacion;
  size?: OverlaySize;
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Pie fijo. No scrollea con el cuerpo: es donde viven guardar y cancelar. */
  footer?: ReactNode;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  /**
   * Si el cuerpo scrollea por su cuenta. En `false` el cuerpo es un flex column que crece y deja
   * el scroll a cargo del contenido — es lo que necesitan las pantallas que tienen su propia
   * zona scrolleable adentro, y lo que hacen hoy los modales que envuelven este componente.
   */
  bodyScroll?: boolean;
  overlayClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  headerClassName?: string;
}

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
const Overlay = ({
  isOpen,
  onClose,
  children,
  presentacion = 'modal',
  size = 'md',
  title,
  subtitle,
  footer,
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  bodyScroll = true,
  className = '',
  overlayClassName = '',
  bodyClassName = 'px-4 py-4 sm:px-6',
  footerClassName = '',
  headerClassName = '',
  ...props
}: OverlayProps) => {
  const contenedorRef = useRef<HTMLDivElement | null>(null);
  const idBase = useId();
  const [zIndex, setZIndex] = useState(() => siguienteZIndex());

  // Un modal de confirmación no ofrece la X: se sale por los botones del pie, que dicen qué
  // pasa con cada opción. Una X al lado de "Cancelar partido" es ambigua.
  const conBotonCerrar = showCloseButton && presentacion !== 'confirmacion';

  useEffect(() => {
    if (!isOpen) return;
    setZIndex(siguienteZIndex());
  }, [isOpen]);

  // Registro en la pila: bloqueo de scroll y nivel para el Escape.
  useEffect(() => {
    if (!isOpen) return;
    const { nivel, darDeBaja } = registrarCapa();

    const alPresionar = (e: KeyboardEvent) => {
      // Sólo la capa de más arriba reacciona a Escape.
      if (closeOnEscape && e.key === 'Escape' && nivel === capasAbiertas()) {
        onClose();
      }
    };

    document.addEventListener('keydown', alPresionar);
    return () => {
      document.removeEventListener('keydown', alPresionar);
      darDeBaja();
    };
  }, [isOpen, closeOnEscape, onClose]);

  // Foco inicial y trampa de foco dentro de la capa.
  useEffect(() => {
    if (!isOpen) return;
    const nodo = contenedorRef.current;
    if (!nodo) return;

    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const primero = nodo.querySelector<HTMLElement>(selector);
    (primero ?? nodo).focus?.();

    const alTabular = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const lista = Array.from(nodo.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => !el.hasAttribute('disabled'),
      );
      if (lista.length === 0) return;
      const inicio = lista[0];
      const fin = lista[lista.length - 1];
      const activo = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (activo === inicio || !nodo.contains(activo)) {
          fin.focus();
          e.preventDefault();
        }
      } else if (activo === fin) {
        inicio.focus();
        e.preventDefault();
      }
    };

    nodo.addEventListener('keydown', alTabular);
    return () => nodo.removeEventListener('keydown', alTabular);
  }, [isOpen]);

  if (!isOpen) return null;

  /**
   * El ancho máximo es una restricción de escritorio real (ancho Y alto de sobra), no sólo de
   * ancho: por eso el prefijo es `boxed:` y no `sm:`. Un celular en horizontal casi siempre
   * supera los 640px de ancho aunque tenga 350-450px de alto; con `sm:` se lo trataba como
   * escritorio y la capa aparecía centrada con márgenes alrededor, regalando altura justo cuando
   * menos sobra —por ejemplo para una grilla de seis jugadores con cuatro contadores cada uno.
   */
  const anchos: Record<OverlaySize, string> = {
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
  const porPresentacion: Record<OverlayPresentacion, string> = {
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
    'relative flex flex-col overflow-hidden bg-white shadow-xl transition-all dark:bg-gray-800',
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
  const alineacion: Record<OverlayPresentacion, string> = {
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
    'shrink-0 border-b border-gray-200 px-4 py-3 dark:border-gray-700 sm:px-6 sm:py-4',
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
    'shrink-0 border-t border-gray-200 bg-gray-50/60 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/40 sm:px-6',
    footerClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const alClickearFondo = (e: MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className={backdropClasses} style={{ zIndex }} onClick={alClickearFondo}>
      <div
        className={contenedorClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? `overlay-${idBase}-title` : undefined}
        aria-describedby={subtitle ? `overlay-${idBase}-subtitle` : undefined}
        tabIndex={-1}
        ref={contenedorRef}
        {...props}
      >
        {presentacion === 'hoja' && (
          <div aria-hidden className="mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-gray-300 dark:bg-gray-600" />
        )}

        {(title || subtitle) && (
          <div className={encabezadoClasses}>
            {title && (
              <h3
                id={`overlay-${idBase}-title`}
                className="text-lg font-semibold text-gray-900 dark:text-white"
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                id={`overlay-${idBase}-subtitle`}
                className="mt-1 text-sm text-gray-600 dark:text-gray-400"
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={cuerpoClasses}>{children}</div>

        {footer && <div className={pieClasses}>{footer}</div>}

        {/* Área tocable de 44px (24 de ícono + 10 de padding a cada lado), el mínimo táctil. Es
            el control que más se usa en un teléfono: con el tamaño exacto del ícono, si le errás
            cerrás sin querer otra cosa o no cerrás nada. El `top` con área segura lo baja del
            notch cuando la capa ocupa la pantalla entera. */}
        {conBotonCerrar && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-2 top-[calc(env(safe-area-inset-top)+0.5rem)] flex h-11 w-11
                       items-center justify-center rounded-lg text-gray-400 transition-colors
                       [touch-action:manipulation] hover:bg-gray-100 hover:text-gray-600
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50
                       dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300
                       boxed:top-2"
            aria-label="Cerrar"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default Overlay;
