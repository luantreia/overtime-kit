// src/components/ui/Textarea/Textarea.tsx
import { forwardRef, useId } from 'react';
import type { TextareaHTMLAttributes, ReactNode } from 'react';

type TextareaVariant = 'default' | 'error' | 'success';

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'> & {
  label?: ReactNode;
  error?: ReactNode;
  helperText?: ReactNode;
  variant?: TextareaVariant;
  rows?: number;
  containerClassName?: string;
};

const Textarea = forwardRef<HTMLTextAreaElement, Props>(({
  label,
  error,
  helperText,
  variant = 'default',
  disabled = false,
  required = false,
  className = '',
  containerClassName = '',
  id,
  rows = 3,
  ...props
}, ref) => {
  // Sin id explícito, el <label> quedaba sin asociar al control (tocar el texto no enfocaba el
  // campo y el lector de pantalla no lo nombraba) y todos los mensajes de error compartían id.
  const autoId = useId();
  const campoId = id ?? autoId;
  const baseClasses = 'block w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:cursor-not-allowed dark:disabled:bg-slate-800';

  const variants: Record<TextareaVariant, string> = {
    default: 'border-slate-300 focus:border-brand-500 focus:ring-brand-500 dark:border-slate-600 dark:focus:border-brand-400',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-400',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500 dark:border-green-600 dark:focus:border-green-400'
  };

  const textareaClasses = [
    baseClasses,
    variants[error ? 'error' : variant],
    className
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'mb-4',
    containerClassName
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={campoId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        disabled={disabled}
        className={textareaClasses}
        id={campoId}
        rows={rows}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${campoId}-error` : helperText ? `${campoId}-helper` : undefined}
        {...props}
      />

      {error && (
        <p id={`${campoId}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={`${campoId}-helper`} className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
