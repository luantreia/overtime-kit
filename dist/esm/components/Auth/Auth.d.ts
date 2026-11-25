import React from 'react';
/**
 * Pantallas de acceso (login, registro, recuperar contraseña) compartidas por las seis apps.
 *
 * Son componentes "tontos": no saben de la API, de tokens ni del router. Cada app les pasa la
 * función que llama a su `useAuth`/servicio y decide a dónde navegar después. Lo que sí resuelven
 * acá: el marco visual, los estados de carga/error y las reglas de contraseña, que antes estaban
 * copiados con diferencias (y la recuperación de contraseña existía en una sola app).
 */
export interface AuthLayoutProps {
    /** Lo que va arriba del título: iniciales (`"DT"`) o un `<img>` con el logo. */
    marca?: React.ReactNode;
    titulo: string;
    subtitulo?: string;
    children: React.ReactNode;
    /** Links de abajo de la tarjeta (crear cuenta, volver al login...). */
    pie?: React.ReactNode;
}
export declare function AuthLayout({ marca, titulo, subtitulo, children, pie }: AuthLayoutProps): React.JSX.Element;
export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}
/** Campo con el estilo de las pantallas de acceso. Sirve también para armar un registro propio. */
export declare function AuthInput({ label, id, className, ...rest }: AuthInputProps): React.JSX.Element;
export declare function AuthError({ children }: {
    children?: React.ReactNode;
}): React.JSX.Element | null;
export declare function AuthSubmit({ loading, children, cargando }: {
    loading: boolean;
    children: React.ReactNode;
    cargando: string;
}): React.JSX.Element;
/**
 * Corre `accion` manejando carga y error. Devuelve `true` si salió bien.
 * Lo usan los tres formularios; también sirve para un registro armado a mano.
 */
export declare function useEnvioAuth(): {
    loading: boolean;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    enviar: (accion: () => Promise<unknown>, porDefecto: string) => Promise<boolean>;
};
/** Mismas reglas que valida el backend en `validators/userValidator.js`. */
export declare function validarPassword(password: string): string | null;
export interface LoginFormProps {
    /** Llama al login de la app. Si tira, el mensaje del error se muestra en el formulario. */
    onSubmit: (email: string, password: string) => Promise<unknown>;
    /** Se llama sólo si `onSubmit` salió bien (toast, navegar...). */
    onSuccess?: () => void;
    /** Se llama con el mensaje si falló (para un toast, por ejemplo). */
    onError?: (mensaje: string) => void;
    placeholderEmail?: string;
    /** Link a "Olvidé mi contraseña", con el `Link` del router de la app. */
    enlaceOlvide?: React.ReactNode;
}
export declare function LoginForm({ onSubmit, onSuccess, onError, placeholderEmail, enlaceOlvide }: LoginFormProps): React.JSX.Element;
export interface ForgotPasswordFormProps {
    /** Pide el mail de reset (`POST /auth/olvide-password`). */
    onSubmit: (email: string) => Promise<unknown>;
}
export declare function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps): React.JSX.Element;
export interface ResetPasswordFormProps {
    /** Token del link del mail. Sin token el formulario avisa en vez de enviar. */
    token: string | undefined;
    /** `POST /auth/reset-password`. */
    onSubmit: (token: string, password: string) => Promise<unknown>;
    onSuccess?: () => void;
}
export declare function ResetPasswordForm({ token, onSubmit, onSuccess }: ResetPasswordFormProps): React.JSX.Element;
//# sourceMappingURL=Auth.d.ts.map