"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordForm = exports.ForgotPasswordForm = exports.LoginForm = exports.validarPassword = exports.useEnvioAuth = exports.AuthSubmit = exports.AuthError = exports.AuthInput = exports.AuthLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function AuthLayout({ marca, titulo, subtitulo, children, pie }) {
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex min-h-dvh items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4", children: (0, jsx_runtime_1.jsxs)("main", { className: "w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6 flex flex-col items-center text-center", children: [typeof marca === 'string' ? ((0, jsx_runtime_1.jsx)("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 font-bold text-white", children: marca })) : (marca), (0, jsx_runtime_1.jsx)("h1", { className: "mt-4 text-xl font-semibold text-white", children: titulo }), subtitulo ? (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-200/80", children: subtitulo }) : null] }), children, pie ? (0, jsx_runtime_1.jsx)("div", { className: "mt-6 space-y-2 text-center text-sm text-slate-200/80", children: pie }) : null] }) }));
}
exports.AuthLayout = AuthLayout;
/** Campo con el estilo de las pantallas de acceso. Sirve también para armar un registro propio. */
function AuthInput({ label, id, className = '', ...rest }) {
    const auto = (0, react_1.useId)();
    const inputId = id !== null && id !== void 0 ? id : auto;
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-slate-200", htmlFor: inputId, children: label }), (0, jsx_runtime_1.jsx)("input", { id: inputId, className: `mt-1 w-full rounded-lg border border-white/10 bg-slate-900/30 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 ${className}`, ...rest })] }));
}
exports.AuthInput = AuthInput;
function AuthError({ children }) {
    if (!children)
        return null;
    return ((0, jsx_runtime_1.jsx)("p", { role: "alert", className: "rounded-lg bg-rose-500/20 px-3 py-2 text-sm text-rose-100", children: children }));
}
exports.AuthError = AuthError;
function AuthSubmit({ loading, children, cargando }) {
    return ((0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: loading, className: "w-full rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/50 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-300", children: loading ? cargando : children }));
}
exports.AuthSubmit = AuthSubmit;
const mensajeDe = (err, porDefecto) => (err === null || err === void 0 ? void 0 : err.message) || porDefecto;
/**
 * Corre `accion` manejando carga y error. Devuelve `true` si salió bien.
 * Lo usan los tres formularios; también sirve para un registro armado a mano.
 */
function useEnvioAuth() {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const enviar = async (accion, porDefecto) => {
        setError(null);
        setLoading(true);
        try {
            await accion();
            return true;
        }
        catch (err) {
            setError(mensajeDe(err, porDefecto));
            return false;
        }
        finally {
            setLoading(false);
        }
    };
    return { loading, error, setError, enviar };
}
exports.useEnvioAuth = useEnvioAuth;
// ---------------------------------------------------------------------------------------------
// Contraseña
// ---------------------------------------------------------------------------------------------
/** Mismas reglas que valida el backend en `validators/userValidator.js`. */
function validarPassword(password) {
    if (password.length < 8)
        return 'La contraseña debe tener al menos 8 caracteres';
    if (!/[A-Z]/.test(password))
        return 'La contraseña debe incluir una mayúscula';
    if (!/[a-z]/.test(password))
        return 'La contraseña debe incluir una minúscula';
    if (!/\d/.test(password))
        return 'La contraseña debe incluir un número';
    return null;
}
exports.validarPassword = validarPassword;
function LoginForm({ onSubmit, onSuccess, onError, placeholderEmail = 'tu@email.com', enlaceOlvide }) {
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const { loading, error, enviar } = useEnvioAuth();
    const alEnviar = async (e) => {
        e.preventDefault();
        const porDefecto = 'Credenciales inválidas o servicio no disponible.';
        let mensaje = porDefecto;
        const ok = await enviar(async () => {
            try {
                await onSubmit(email.trim(), password);
            }
            catch (err) {
                mensaje = mensajeDe(err, porDefecto);
                throw err;
            }
        }, porDefecto);
        if (ok)
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
        else
            onError === null || onError === void 0 ? void 0 : onError(mensaje);
    };
    return ((0, jsx_runtime_1.jsxs)("form", { className: "space-y-5", onSubmit: alEnviar, children: [(0, jsx_runtime_1.jsx)(AuthInput, { label: "Email", name: "email", type: "email", autoComplete: "username", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: placeholderEmail }), (0, jsx_runtime_1.jsx)(AuthInput, { label: "Contrase\u00F1a", name: "password", type: "password", autoComplete: "current-password", required: true, value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), enlaceOlvide ? (0, jsx_runtime_1.jsx)("div", { className: "-mt-2 text-right text-sm text-slate-300", children: enlaceOlvide }) : null, (0, jsx_runtime_1.jsx)(AuthError, { children: error }), (0, jsx_runtime_1.jsx)(AuthSubmit, { loading: loading, cargando: "Ingresando\u2026", children: "Ingresar" })] }));
}
exports.LoginForm = LoginForm;
function ForgotPasswordForm({ onSubmit }) {
    const [email, setEmail] = (0, react_1.useState)('');
    const [enviado, setEnviado] = (0, react_1.useState)(false);
    const { loading, error, enviar } = useEnvioAuth();
    const alEnviar = async (e) => {
        e.preventDefault();
        if (await enviar(() => onSubmit(email.trim()), 'No se pudo procesar el pedido. Probá de nuevo.')) {
            setEnviado(true);
        }
    };
    // El backend responde igual exista o no la cuenta, así que la pantalla tampoco distingue:
    // mostrar otra cosa revelaría qué emails existen.
    if (enviado) {
        return ((0, jsx_runtime_1.jsx)("p", { role: "status", className: "rounded-lg bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100", children: "Si ese email est\u00E1 registrado, te mandamos un link para elegir una contrase\u00F1a nueva. Revis\u00E1 tu casilla (y el spam). El link vence en 1 hora." }));
    }
    return ((0, jsx_runtime_1.jsxs)("form", { className: "space-y-5", onSubmit: alEnviar, children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-200/80", children: "Escrib\u00ED tu email y te mandamos un link para elegir una contrase\u00F1a nueva." }), (0, jsx_runtime_1.jsx)(AuthInput, { label: "Email", name: "email", type: "email", autoComplete: "username", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "tu@email.com" }), (0, jsx_runtime_1.jsx)(AuthError, { children: error }), (0, jsx_runtime_1.jsx)(AuthSubmit, { loading: loading, cargando: "Enviando\u2026", children: "Enviarme el link" })] }));
}
exports.ForgotPasswordForm = ForgotPasswordForm;
function ResetPasswordForm({ token, onSubmit, onSuccess }) {
    const [password, setPassword] = (0, react_1.useState)('');
    const [confirmar, setConfirmar] = (0, react_1.useState)('');
    const { loading, error, setError, enviar } = useEnvioAuth();
    const alEnviar = async (e) => {
        e.preventDefault();
        if (!token)
            return setError('El link no es válido. Pedí uno nuevo desde "Olvidé mi contraseña".');
        if (password !== confirmar)
            return setError('Las contraseñas no coinciden');
        const invalida = validarPassword(password);
        if (invalida)
            return setError(invalida);
        if (await enviar(() => onSubmit(token, password), 'No se pudo restablecer la contraseña.'))
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
    };
    return ((0, jsx_runtime_1.jsxs)("form", { className: "space-y-5", onSubmit: alEnviar, children: [(0, jsx_runtime_1.jsx)(AuthInput, { label: "Contrase\u00F1a nueva", name: "password", type: "password", autoComplete: "new-password", required: true, value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), (0, jsx_runtime_1.jsx)(AuthInput, { label: "Repetir contrase\u00F1a", name: "confirmar", type: "password", autoComplete: "new-password", required: true, value: confirmar, onChange: (e) => setConfirmar(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-300", children: "M\u00EDnimo 8 caracteres, con may\u00FAscula, min\u00FAscula y n\u00FAmero." }), (0, jsx_runtime_1.jsx)(AuthError, { children: error }), (0, jsx_runtime_1.jsx)(AuthSubmit, { loading: loading, cargando: "Guardando\u2026", children: "Guardar contrase\u00F1a" })] }));
}
exports.ResetPasswordForm = ResetPasswordForm;
//# sourceMappingURL=Auth.js.map