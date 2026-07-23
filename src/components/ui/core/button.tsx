import { cn } from "@/lib/cn";
import { Spinner } from "@/components/ui/core/spinner";

type ButtonVariant = "primary" | "secondary" | "destructive";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  compact?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-foreground text-[13.5px] font-semibold gap-[7px] enabled:hover:bg-accent-hover",
  secondary:
    "border border-border-muted bg-btn-secondary text-foreground text-[13px] gap-2 enabled:hover:bg-surface-hover",
  destructive:
    "border border-danger-border bg-danger-bg text-danger text-[13px] gap-2 enabled:hover:bg-danger-bg-hover",
};

export function Button({
  variant = "primary",
  compact = false,
  fullWidth = false,
  loading = false,
  className,
  type = "button",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const padding = fullWidth
    ? "p-[11px]"
    : compact
      ? "px-[14px] py-[6px]"
      : "px-[15px] py-2";

  return (
    <button
      type={type}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-btn transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClass[variant],
        padding,
        fullWidth && "w-full justify-center",
        className,
      )}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
