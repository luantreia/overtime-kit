import type { TextareaHTMLAttributes, ReactNode } from 'react';
type TextareaVariant = 'default' | 'error' | 'success';
declare const Textarea: import("react").ForwardRefExoticComponent<Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "rows"> & {
    label?: ReactNode;
    error?: ReactNode;
    helperText?: ReactNode;
    variant?: TextareaVariant | undefined;
    rows?: number | undefined;
    containerClassName?: string | undefined;
} & import("react").RefAttributes<HTMLTextAreaElement>>;
export default Textarea;
//# sourceMappingURL=Textarea.d.ts.map