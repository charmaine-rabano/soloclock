import { Icon } from "@/components/icons";
import { cn } from "@/lib/cn";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Checkbox({ className, disabled, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        "relative inline-flex size-4.5 shrink-0",
        disabled && "opacity-50",
        className,
      )}
    >
      <input
        type="checkbox"
        disabled={disabled}
        className="peer sr-only"
        {...props}
      />
      <span
        className={cn(
          "absolute inset-0 rounded-[5px] border-[1.5px] border-border-muted transition-colors",
          "peer-checked:border-accent peer-checked:bg-accent",
          "peer-disabled:cursor-not-allowed",
        )}
      />
      <Icon
        name="check"
        size={12}
        strokeWidth={3}
        className="pointer-events-none absolute inset-0 m-auto text-accent-foreground opacity-0 peer-checked:opacity-100"
      />
    </label>
  );
}
