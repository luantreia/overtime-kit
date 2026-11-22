import { type FC, type ReactNode } from 'react';
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
export declare const ToastProvider: FC<{
    children: ReactNode;
}>;
export declare const useToast: () => ToastContextValue;
export default ToastProvider;
//# sourceMappingURL=ToastProvider.d.ts.map