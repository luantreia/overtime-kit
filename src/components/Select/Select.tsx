import { useId } from 'react';
// src/components/ui/Select/Select.tsx
import type { ReactNode, SelectHTMLAttributes } from 'react';

type SelectVariant = 'default' | 'error' | 'success';
type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string | number;
  label: ReactNode;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'multiple' | 'value'> {
  label?: ReactNode;
  options?: SelectOption[];
  value?: string | number | readonly string[];
  helperText?: ReactNode;
  error?: ReactNode;
  variant?: SelectVariant;
  size?: SelectSize;
  containerClassName?: string;
  multiple?: boolean;
  placeholder?: string;
}

/**
 * Componente Select reutilizable con opciones avanzadas
 */
const Select: React.FC<SelectProps> = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Seleccionar...',
  disabled = false,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  required = false,
  className = '',
  containerClassName = '',
  multiple = false,
  id,
  ...props
}) => {
  // Sin id explícito, el <label> quedaba sin asociar al control (tocar el texto no enfocaba el
  // campo y el lector de pantalla no lo nombraba) y todos los mensajes de error compartían id.
  const autoId = useId();
  const campoId = id ?? autoId;
  const baseClasses = 'block w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:cursor-not-allowed dark:disabled:bg-slate-800';

  const variants: Record<SelectVariant, string> = {
    default: 'border-slate-300 focus:border-brand-500 focus:ring-brand-500 dark:border-slate-600 dark:focus:border-brand-400',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-400',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500 dark:border-green-600 dark:focus:border-green-400'
  };

  const sizes: Record<SelectSize, string> = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const selectClasses = [
    baseClasses,
    variants[error ? 'error' : variant],
    sizes[size],
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

      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        multiple={multiple}
        className={selectClasses}
        id={campoId}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${campoId}-error` : helperText ? `${campoId}-helper` : undefined}
        {...props}
      >
        {placeholder && !multiple && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

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
};

export default Select;
