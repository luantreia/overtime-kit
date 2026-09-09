import type { ReactNode, SelectHTMLAttributes } from 'react';
type SelectVariant = 'default' | 'error' | 'success';
type SelectSize = 'sm' | 'md' | 'lg';
export interface SelectOption {
    value: string | number;
    label: ReactNode;
}
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'multiple' | 'value'> {
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
declare const Select: React.FC<SelectProps>;
export default Select;
//# sourceMappingURL=Select.d.ts.map