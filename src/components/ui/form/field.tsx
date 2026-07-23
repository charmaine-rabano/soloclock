import { cn } from "@/lib/cn";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** When set, tints the border and renders the message below the input. */
  error?: string;
}

export function Field({ error, className, ...props }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <input
        aria-invalid={error ? true : undefined}
        className={cn(
          "w-full rounded-field border bg-field px-3.25 py-2.75 text-[14px] text-foreground placeholder:text-subtle disabled:opacity-50",
          error ? "border-danger-border" : "border-border-field",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-[12.5px] text-danger-text">{error}</p> : null}
    </div>
  );
}

interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  optional?: boolean;
}

export function FieldLabel({
  required = false,
  optional = false,
  className,
  children,
  ...props
}: FieldLabelProps) {
  return (
    <label className={cn("text-[12.5px] text-muted", className)} {...props}>
      {children}
      {required ? <span className="text-accent"> *</span> : null}
      {optional ? <span className="text-subtle"> — optional</span> : null}
    </label>
  );
}
