import { createContext, useCallback, useContext, useRef, useState, type FC, type ReactNode } from 'react';
import Overlay from '../Overlay/Overlay';

export type ConfirmOptions = {
  title: ReactNode;
  message?: ReactNode;
  /** Verbo de lo que pasa, no "Aceptar": "Eliminar", "Finalizar partido". */
  confirmLabel?: string;
  cancelLabel?: string;
  /** Acción destructiva: botón rojo. */
  danger?: boolean;
};

type ConfirmFn = (opciones: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | undefined>(undefined);

/**
 * `const ok = await confirm({ title: '¿Eliminar?', danger: true })`.
 *
 * Reemplaza el patrón de cada pantalla con su `useState(aEliminar)` + `<ConfirmModal isOpen=…>`
 * + handler partido en dos. Una confirmación es una pregunta con respuesta: modelarla como
 * promesa deja el flujo en un solo lugar y legible de arriba a abajo.
 *
 * Usa `Overlay presentacion="confirmacion"` (sin X: la salida son los botones, que dicen qué
 * pasa con cada opción). Escape y click afuera cuentan como cancelar.
 */
export const ConfirmProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [actual, setActual] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((v: boolean) => void) | null>(null);

  const cerrar = useCallback((valor: boolean) => {
    resolver.current?.(valor);
    resolver.current = null;
    setActual(null);
  }, []);

  const confirm = useCallback<ConfirmFn>((opciones) => {
    // Si había otra abierta, se resuelve como cancelada: nunca queda una promesa colgada.
    resolver.current?.(false);
    setActual(opciones);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Overlay
        isOpen={!!actual}
        onClose={() => cerrar(false)}
        presentacion="confirmacion"
        size="sm"
        title={actual?.title}
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => cerrar(false)}
              className="min-h-[40px] rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {actual?.cancelLabel ?? 'Cancelar'}
            </button>
            <button
              type="button"
              onClick={() => cerrar(true)}
              className={`min-h-[40px] rounded-lg px-4 text-sm font-semibold text-white ${
                actual?.danger ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-600 hover:bg-brand-700'
              }`}
            >
              {actual?.confirmLabel ?? 'Confirmar'}
            </button>
          </div>
        }
      >
        {actual?.message ? (
          <div className="text-sm text-slate-700">
            {typeof actual.message === 'string' ? <p>{actual.message}</p> : actual.message}
          </div>
        ) : null}
      </Overlay>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm debe usarse dentro de ConfirmProvider');
  return ctx;
};

export default ConfirmProvider;
