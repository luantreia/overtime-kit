import { useRef } from 'react';
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';

/**
 * Cómo se ve la tira. Son las tres formas que ya existían escritas a mano en las apps:
 *
 * - `pildora`     botones sueltos, el activo relleno. Navegación de página (detalle de competencia).
 * - `segmentado`  un riel gris con el activo "levantado". Pocas opciones que se reparten el ancho,
 *                 o alternar vistas del mismo contenido (Lista / Calendario).
 * - `subrayado`   texto con línea debajo del activo. Listados densos, estilo panel de admin.
 */
export type TabsVariante = 'pildora' | 'segmentado' | 'subrayado';
export type TabsSize = 'sm' | 'md';

export interface TabItem<T extends string = string> {
  id: T;
  label: ReactNode;
  /** Contador o marca al lado del label (p. ej. cantidad de pendientes). */
  badge?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps<T extends string = string>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'role'> {
  items: ReadonlyArray<TabItem<T>>;
  value: T;
  onChange: (id: T) => void;
  /** Obligatorio: es lo que anuncia el lector de pantalla al entrar a la tira ("Secciones de la competencia"). */
  'aria-label': string;
  variante?: TabsVariante;
  size?: TabsSize;
  /** Las pestañas se reparten el ancho disponible en partes iguales. */
  fullWidth?: boolean;
  /**
   * Prefijo de ids para conectar cada pestaña con su `<TabPanel>` (`aria-controls` /
   * `aria-labelledby`). Opcional: sin él la tira funciona igual, sólo sin esa relación.
   */
  idBase?: string;
}

export const tabId = (idBase: string, id: string) => `${idBase}-tab-${id}`;
export const tabPanelId = (idBase: string, id: string) => `${idBase}-panel-${id}`;

const riel: Record<TabsVariante, string> = {
  pildora: 'flex gap-2 overflow-x-auto',
  segmentado: 'flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1 dark:bg-slate-800',
  subrayado: 'flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-700',
};

const base = 'inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 [touch-action:manipulation]';

const tamanos: Record<TabsSize, string> = {
  sm: 'min-h-[2.25rem] px-3 text-xs',
  md: 'min-h-[2.5rem] px-4 text-sm',
};

const estado: Record<TabsVariante, { activa: string; inactiva: string }> = {
  pildora: {
    activa: 'rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200',
    inactiva: 'rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800',
  },
  segmentado: {
    activa: 'rounded-md bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white',
    inactiva: 'rounded-md text-muted hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
  },
  subrayado: {
    activa: '-mb-px border-b-2 border-brand-600 text-brand-700 dark:border-brand-400 dark:text-brand-300',
    inactiva: '-mb-px border-b-2 border-transparent text-muted hover:border-slate-300 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
  },
};

/**
 * Tira de pestañas. Controlada: el padre decide de dónde sale `value`.
 *
 * Eso es a propósito. En una página, la pestaña tiene que vivir en la URL (`?tab=`) para que se
 * pueda linkear, recargar y volver con "atrás". Adentro de un modal, en cambio, es estado local.
 * El componente no elige por vos: recibe `value` y avisa `onChange`.
 *
 * Teclado (patrón WAI-ARIA de tabs, activación automática): Tab entra a la pestaña activa y sale
 * de la tira; ← → recorren, Home/End van a los extremos, y moverse ya selecciona.
 */
function Tabs<T extends string = string>({
  items,
  value,
  onChange,
  variante = 'pildora',
  size = 'md',
  fullWidth = false,
  idBase,
  className = '',
  ...props
}: TabsProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const habilitadas = items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0);
  // Si `value` no coincide con ninguna (p. ej. un ?tab= viejo), la primera habilitada recibe el foco.
  const activaIdx = items.findIndex((it) => it.id === value);
  const focoIdx = activaIdx >= 0 && !items[activaIdx].disabled ? activaIdx : habilitadas[0] ?? -1;

  const ir = (idx: number) => {
    const item = items[idx];
    if (!item) return;
    refs.current[idx]?.focus();
    if (item.id !== value) onChange(item.id);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const pos = habilitadas.indexOf(idx);
    if (pos < 0 || habilitadas.length === 0) return;
    let destino: number | undefined;
    if (e.key === 'ArrowRight') destino = habilitadas[(pos + 1) % habilitadas.length];
    else if (e.key === 'ArrowLeft') destino = habilitadas[(pos - 1 + habilitadas.length) % habilitadas.length];
    else if (e.key === 'Home') destino = habilitadas[0];
    else if (e.key === 'End') destino = habilitadas[habilitadas.length - 1];
    if (destino === undefined) return;
    e.preventDefault();
    ir(destino);
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={[riel[variante], fullWidth ? 'w-full' : '', className].filter(Boolean).join(' ')}
      {...props}
    >
      {items.map((item, idx) => {
        const activa = item.id === value;
        return (
          <button
            key={item.id}
            ref={(el) => { refs.current[idx] = el; }}
            type="button"
            role="tab"
            id={idBase ? tabId(idBase, item.id) : undefined}
            aria-controls={idBase ? tabPanelId(idBase, item.id) : undefined}
            aria-selected={activa}
            tabIndex={idx === focoIdx ? 0 : -1}
            disabled={item.disabled}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => onKeyDown(e, idx)}
            className={[
              base,
              tamanos[size],
              activa ? estado[variante].activa : estado[variante].inactiva,
              fullWidth ? 'flex-1' : '',
            ].filter(Boolean).join(' ')}
          >
            {item.label}
            {item.badge !== undefined && item.badge !== null ? (
              <span className="rounded-full bg-slate-200 px-1.5 text-2xs font-semibold text-slate-700 dark:bg-slate-600 dark:text-slate-100">
                {item.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export interface TabPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'id'> {
  /** El mismo `idBase` que se le pasó a `<Tabs>`. */
  idBase: string;
  /** El `id` de la pestaña a la que pertenece este panel. */
  id: string;
  children: ReactNode;
}

/**
 * Contenedor de una pestaña, conectado a su botón para lectores de pantalla. Renderizalo sólo para
 * la pestaña activa (`{tab === 'x' && <TabPanel …>}`): no oculta nada por su cuenta.
 */
export function TabPanel({ idBase, id, children, ...props }: TabPanelProps) {
  return (
    <div role="tabpanel" id={tabPanelId(idBase, id)} aria-labelledby={tabId(idBase, id)} tabIndex={-1} {...props}>
      {children}
    </div>
  );
}

export default Tabs;
