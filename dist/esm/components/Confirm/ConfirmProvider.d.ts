import { type FC, type ReactNode } from 'react';
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
export declare const ConfirmProvider: FC<{
    children: ReactNode;
}>;
export declare const useConfirm: () => ConfirmFn;
export default ConfirmProvider;
//# sourceMappingURL=ConfirmProvider.d.ts.map