interface FormFieldWrapperProps {
  label?: string;
  name: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

export const FormFieldWrapper = ({
  label,
  name,
  required,
  error,
  helperText,
  children,
}: FormFieldWrapperProps) => {
  const labelId = `${name}-label`;

  return (
    <div className="space-y-1">
      {label && (
        <label id={labelId} htmlFor={name} className="font-medium text-sm">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
