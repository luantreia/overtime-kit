import React, { useId, useState } from 'react';

/**
 * Pantallas de acceso (login, registro, recuperar contraseña) compartidas por las seis apps.
 *
 * Son componentes "tontos": no saben de la API, de tokens ni del router. Cada app les pasa la
 * función que llama a su `useAuth`/servicio y decide a dónde navegar después. Lo que sí resuelven
 * acá: el marco visual, los estados de carga/error y las reglas de contraseña, que antes estaban
 * copiados con diferencias (y la recuperación de contraseña existía en una sola app).
 */

// ---------------------------------------------------------------------------------------------
// Marco
// ---------------------------------------------------------------------------------------------

export interface AuthLayoutProps {
  /** Lo que va arriba del título: iniciales (`"DT"`) o un `<img>` con el logo. */
  marca?: React.ReactNode;
  titulo: string;
  subtitulo?: string;
  children: React.ReactNode;
  /** Links de abajo de la tarjeta (crear cuenta, volver al login...). */
  pie?: React.ReactNode;
}

export function AuthLayout({ marca, titulo, subtitulo, children, pie }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <main className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur">
        <div className="mb-6 flex flex-col items-center text-center">
          {typeof marca === 'string' ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 font-bold text-white">
              {marca}
            </div>
          ) : (
            marca
          )}
          <h1 className="mt-4 text-xl font-semibold text-white">{titulo}</h1>
          {subtitulo ? <p className="text-sm text-slate-200/80">{subtitulo}</p> : null}
        </div>
        {children}
        {pie ? <div className="mt-6 space-y-2 text-center text-sm text-slate-200/80">{pie}</div> : null}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Piezas
// ---------------------------------------------------------------------------------------------

export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

/** Campo con el estilo de las pantallas de acceso. Sirve también para armar un registro propio. */
export function AuthInput({ label, id, className = '', ...rest }: AuthInputProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <div>
      <label className="block text-sm font-medium text-slate-200" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className={`mt-1 w-full rounded-lg border border-white/10 bg-slate-900/30 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 ${className}`}
        {...rest}
      />
    </div>
  );
}

export function AuthError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-lg bg-rose-500/20 px-3 py-2 text-sm text-rose-100">
      {children}
    </p>
  );
}

export function AuthSubmit({ loading, children, cargando }: { loading: boolean; children: React.ReactNode; cargando: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/50 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-300"
    >
      {loading ? cargando : children}
    </button>
  );
}

const mensajeDe = (err: unknown, porDefecto: string) =>
  (err as { message?: string } | null)?.message || porDefecto;

/**
 * Corre `accion` manejando carga y error. Devuelve `true` si salió bien.
 * Lo usan los tres formularios; también sirve para un registro armado a mano.
 */
export function useEnvioAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const enviar = async (accion: () => Promise<unknown>, porDefecto: string) => {
    setError(null);
    setLoading(true);
    try {
      await accion();
      return true;
    } catch (err) {
      setError(mensajeDe(err, porDefecto));
      return false;
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, setError, enviar };
}

// ---------------------------------------------------------------------------------------------
// Contraseña
// ---------------------------------------------------------------------------------------------

/** Mismas reglas que valida el backend en `validators/userValidator.js`. */
export function validarPassword(password: string): string | null {
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
  if (!/[A-Z]/.test(password)) return 'La contraseña debe incluir una mayúscula';
  if (!/[a-z]/.test(password)) return 'La contraseña debe incluir una minúscula';
  if (!/\d/.test(password)) return 'La contraseña debe incluir un número';
  return null;
}

// ---------------------------------------------------------------------------------------------
// Formularios
// ---------------------------------------------------------------------------------------------

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

export function LoginForm({ onSubmit, onSuccess, onError, placeholderEmail = 'tu@email.com', enlaceOlvide }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error, enviar } = useEnvioAuth();

  const alEnviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const porDefecto = 'Credenciales inválidas o servicio no disponible.';
    let mensaje = porDefecto;
    const ok = await enviar(async () => {
      try {
        await onSubmit(email.trim(), password);
      } catch (err) {
        mensaje = mensajeDe(err, porDefecto);
        throw err;
      }
    }, porDefecto);
    if (ok) onSuccess?.();
    else onError?.(mensaje);
  };

  return (
    <form className="space-y-5" onSubmit={alEnviar}>
      <AuthInput
        label="Email"
        name="email"
        type="email"
        autoComplete="username"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholderEmail}
      />
      <AuthInput
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />
      {enlaceOlvide ? <div className="-mt-2 text-right text-sm text-slate-300">{enlaceOlvide}</div> : null}
      <AuthError>{error}</AuthError>
      <AuthSubmit loading={loading} cargando="Ingresando…">
        Ingresar
      </AuthSubmit>
    </form>
  );
}

export interface ForgotPasswordFormProps {
  /** Pide el mail de reset (`POST /auth/olvide-password`). */
  onSubmit: (email: string) => Promise<unknown>;
}

export function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const { loading, error, enviar } = useEnvioAuth();

  const alEnviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (await enviar(() => onSubmit(email.trim()), 'No se pudo procesar el pedido. Probá de nuevo.')) {
      setEnviado(true);
    }
  };

  // El backend responde igual exista o no la cuenta, así que la pantalla tampoco distingue:
  // mostrar otra cosa revelaría qué emails existen.
  if (enviado) {
    return (
      <p role="status" className="rounded-lg bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100">
        Si ese email está registrado, te mandamos un link para elegir una contraseña nueva. Revisá tu
        casilla (y el spam). El link vence en 1 hora.
      </p>
    );
  }

  return (
    <form className="space-y-5" onSubmit={alEnviar}>
      <p className="text-sm text-slate-200/80">Escribí tu email y te mandamos un link para elegir una contraseña nueva.</p>
      <AuthInput
        label="Email"
        name="email"
        type="email"
        autoComplete="username"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
      />
      <AuthError>{error}</AuthError>
      <AuthSubmit loading={loading} cargando="Enviando…">
        Enviarme el link
      </AuthSubmit>
    </form>
  );
}

export interface ResetPasswordFormProps {
  /** Token del link del mail. Sin token el formulario avisa en vez de enviar. */
  token: string | undefined;
  /** `POST /auth/reset-password`. */
  onSubmit: (token: string, password: string) => Promise<unknown>;
  onSuccess?: () => void;
}

export function ResetPasswordForm({ token, onSubmit, onSuccess }: ResetPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const { loading, error, setError, enviar } = useEnvioAuth();

  const alEnviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return setError('El link no es válido. Pedí uno nuevo desde "Olvidé mi contraseña".');
    if (password !== confirmar) return setError('Las contraseñas no coinciden');
    const invalida = validarPassword(password);
    if (invalida) return setError(invalida);
    if (await enviar(() => onSubmit(token, password), 'No se pudo restablecer la contraseña.')) onSuccess?.();
  };

  return (
    <form className="space-y-5" onSubmit={alEnviar}>
      <AuthInput
        label="Contraseña nueva"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />
      <AuthInput
        label="Repetir contraseña"
        name="confirmar"
        type="password"
        autoComplete="new-password"
        required
        value={confirmar}
        onChange={(e) => setConfirmar(e.target.value)}
        placeholder="••••••••"
      />
      <p className="text-xs text-slate-300">Mínimo 8 caracteres, con mayúscula, minúscula y número.</p>
      <AuthError>{error}</AuthError>
      <AuthSubmit loading={loading} cargando="Guardando…">
        Guardar contraseña
      </AuthSubmit>
    </form>
  );
}
