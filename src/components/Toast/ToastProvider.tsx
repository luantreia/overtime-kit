import { createContext, useCallback, useContext, useMemo, useRef, useState, type FC, type ReactNode } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type Toast = {
  id: string;
  type: ToastType;
  title?: string;
  message?: string;
  /** ms; 0 = no se cierra solo. Por defecto 3.5 s, y 6 s para errores (hay que llegar a leerlos). */
  duration?: number;
};

export type ToastContextValue = {
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let contador = 0;
const genId = () => `t${Date.now().toString(36)}${(contador++).toString(36)}`;

const ESTILO: Record<ToastType, { caja: string; icono: typeof CheckCircleIcon; colorIcono: string }> = {
  success: { caja: 'border-emerald-200 bg-emerald-50 text-emerald-900', icono: CheckCircleIcon, colorIcono: 'text-emerald-600' },
  error: { caja: 'border-red-200 bg-red-50 text-red-900', icono: ExclamationTriangleIcon, colorIcono: 'text-red-600' },
  warning: { caja: 'border-amber-200 bg-amber-50 text-amber-900', icono: ExclamationTriangleIcon, colorIcono: 'text-amber-600' },
  info: { caja: 'border-slate-200 bg-white text-slate-900', icono: InformationCircleIcon, colorIcono: 'text-slate-500' },
};

/**
 * Toasts compartidos. Misma API que las seis copias que vivían en cada app (`addToast` /
 * `removeToast`), así que migrar es cambiar el import.
 *
 * Decisiones que antes variaban por app y ahora no:
 * - Abajo en mobile, arriba a la derecha desde `sm` (lo había resuelto dodgeballmanager: arriba
 *   en un celular tapaban la hamburguesa y la campanita).
 * - Los errores se anuncian con `role="alert"` (interrumpe al lector de pantalla); el resto con
 *   `role="status"`.
 * - Un mismo mensaje repetido no se apila: se reemplaza.
 */
export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, number>());

  const removeToast = useCallback((id: string) => {
    const t = timers.current.get(id);
    if (t) window.clearTimeout(t);
    timers.current.delete(id);
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = genId();
      const t: Toast = { id, duration: toast.type === 'error' ? 6000 : 3500, ...toast };
      setToasts((prev) => [
        ...prev.filter((x) => !(x.type === t.type && x.title === t.title && x.message === t.message)),
        t,
      ].slice(-4));
      if (t.duration && t.duration > 0) {
        timers.current.set(id, window.setTimeout(() => removeToast(id), t.duration));
      }
      return id;
    },
    [removeToast]
  );

  const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col gap-2 sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-4 sm:w-96 sm:max-w-[calc(100%-2rem)]">
        {toasts.map((t) => {
          const e = ESTILO[t.type] ?? ESTILO.info;
          const Icono = e.icono;
          return (
            <div
              key={t.id}
              role={t.type === 'error' ? 'alert' : 'status'}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3 shadow-lg ${e.caja}`}
            >
              <Icono className={`mt-0.5 h-5 w-5 shrink-0 ${e.colorIcono}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                {t.title ? <p className="text-sm font-semibold">{t.title}</p> : null}
                {t.message ? <p className="text-sm opacity-90">{t.message}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                aria-label="Cerrar aviso"
                className="-m-1 rounded-md p-1 opacity-60 hover:bg-black/5 hover:opacity-100"
              >
                <XMarkIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx;
};

export default ToastProvider;
