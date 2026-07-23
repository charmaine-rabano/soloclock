"use client";

import { cn } from "@/lib/cn";

interface ToggleProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({
  checked,
  onCheckedChange,
  label,
  disabled = false,
  className,
}: ToggleProps) {
  return (
    <span
      className={cn(
        "flex items-center gap-2.5",
        disabled && "opacity-50",
        className,
      )}
    >
      {label ? <span className="text-[13px]">{label}</span> : null}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          "flex h-5.5 w-9.5 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors",
          checked ? "bg-accent" : "bg-border-muted",
        )}
      >
        <span
          className={cn(
            "size-4.5 rounded-full bg-accent-foreground transition-all",
            checked && "ml-auto",
          )}
        />
      </button>
    </span>
  );
}
