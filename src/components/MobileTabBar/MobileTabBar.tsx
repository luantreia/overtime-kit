import React, { useEffect, useState } from 'react';

/**
 * Navegación principal en mobile: barra fija abajo, al alcance del pulgar, con un panel «Más».
 *
 * Estaba copiada en Manager, dodgeballmanager y Organizaciones con cambios menores (íconos, el
 * breakpoint, el badge de pendientes). Acá cada app pasa sólo sus destinos.
 *
 * No depende del router: recibe el `Link` de la app y la ruta actual. Así el kit no arrastra
 * react-router como dependencia.
 *
 * El `pb-[env(safe-area-inset-bottom)]` no es opcional: con `viewport-fit=cover` la fila de
 * etiquetas queda debajo de la barra de gestos sin él.
 */

export interface TabBarItem {
  to: string;
  label: string;
  /** Un ícono de heroicons ya renderizado o un emoji. */
  icon: React.ReactNode;
  /** Número a mostrar al lado (pendientes). 0 o ausente = nada. */
  badge?: number;
}

/** Cualquier componente de link que acepte `to` (el `Link` de react-router, típicamente). */
export type LinkLike = React.ElementType;

export interface MobileTabBarProps {
  tabs: TabBarItem[];
  more?: TabBarItem[];
  /** `Link` de react-router (o cualquier componente con `to`). */
  LinkComponent: LinkLike;
  /** `useLocation().pathname`. */
  currentPath: string;
  onLogout?: () => void;
  /** Desde dónde se oculta, que es donde el Navbar de la app muestra sus propios enlaces. */
  ocultarDesde?: 'md' | 'lg' | 'xl';
  /**
   * Pendientes a marcar con un punto en «Más». Por defecto, la suma de los `badge` de `more`; se
   * pasa explícito cuando lo pendiente no es un destino del panel (p. ej. vive en el dashboard).
   */
  pendientesMas?: number;
}

// Clases literales para que Tailwind las encuentre.
const OCULTAR = { md: 'md:hidden', lg: 'lg:hidden', xl: 'xl:hidden' } as const;

const esActiva = (to: string, path: string) => path === to || path.startsWith(`${to}/`);

export default function MobileTabBar({
  tabs,
  more = [],
  LinkComponent: L,
  currentPath,
  onLogout,
  ocultarDesde = 'lg',
  pendientesMas,
}: MobileTabBarProps) {
  const [abierto, setAbierto] = useState(false);
  const oculto = OCULTAR[ocultarDesde];
  const pendientesEnMas = pendientesMas ?? more.reduce((n, i) => n + (i.badge ?? 0), 0);
  const hayMas = more.length > 0 || !!onLogout;

  // Con el panel abierto: Escape lo cierra y el fondo no scrollea.
  useEffect(() => {
    if (!abierto) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const alTeclado = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('keydown', alTeclado);
    return () => {
      document.body.style.overflow = previo;
      document.removeEventListener('keydown', alTeclado);
    };
  }, [abierto]);

  // Navegar cierra el panel.
  useEffect(() => setAbierto(false), [currentPath]);

  const claseTab = (activa: boolean) =>
    `relative flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-0.5 text-2xs font-bold [touch-action:manipulation] ${
      activa ? 'text-brand-600' : 'text-muted'
    }`;

  return (
    <>
      {abierto && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className={`fixed inset-0 z-40 bg-slate-900/30 ${oculto}`}
          onClick={() => setAbierto(false)}
        />
      )}

      {abierto && (
        <div
          id="mobile-tabbar-mas"
          className={`fixed inset-x-3 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-50 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg ${oculto}`}
        >
          {more.map((item) => (
            <L
              key={item.to}
              to={item.to}
              onClick={() => setAbierto(false)}
              aria-current={esActiva(item.to, currentPath) ? 'page' : undefined}
              className="flex min-h-[2.75rem] items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-700 [touch-action:manipulation] hover:bg-slate-50"
            >
              <span aria-hidden className="flex h-5 w-5 shrink-0 items-center justify-center text-base text-slate-500 [&>svg]:h-5 [&>svg]:w-5">
                {item.icon}
              </span>
              {item.label}
              {item.badge ? (
                <span className="ml-auto inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-brand-600 px-1.5 py-0.5 text-2xs font-bold text-white">
                  {item.badge}
                </span>
              ) : null}
            </L>
          ))}

          {onLogout && (
            <button
              type="button"
              onClick={() => {
                setAbierto(false);
                onLogout();
              }}
              className="flex min-h-[2.75rem] w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-rose-600 [touch-action:manipulation] hover:bg-rose-50"
            >
              <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
              Cerrar sesión
            </button>
          )}
        </div>
      )}

      <nav
        aria-label="Navegación principal"
        className={`fixed inset-x-0 bottom-0 z-30 flex border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur ${oculto}`}
      >
        {tabs.map((tab) => {
          const activa = esActiva(tab.to, currentPath);
          return (
            <L key={tab.to} to={tab.to} aria-current={activa ? 'page' : undefined} className={claseTab(activa)}>
              <span aria-hidden className="flex h-6 items-center text-lg leading-none [&>svg]:h-6 [&>svg]:w-6">
                {tab.icon}
              </span>
              {tab.label}
              {tab.badge ? (
                <span className="absolute right-[calc(50%-1.1rem)] top-1.5 h-2 w-2 rounded-full bg-brand-600" />
              ) : null}
            </L>
          );
        })}

        {hayMas && (
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="mobile-tabbar-mas"
            className={claseTab(abierto)}
          >
            <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            Más
            {/* Lo pendiente vive dentro del panel; sin esta marca no se vería hasta abrirlo. */}
            {pendientesEnMas > 0 && !abierto && (
              <span
                aria-label={`${pendientesEnMas} solicitudes pendientes`}
                className="absolute right-[calc(50%-1.1rem)] top-1.5 h-2 w-2 rounded-full bg-brand-600"
              />
            )}
          </button>
        )}
      </nav>
    </>
  );
}
