import { cn } from "@/lib/cn";

interface FieldShellStyle {
  align?: "between" | "start";
  compact?: boolean;
}

export function fieldShellClass(
  { align = "between", compact = false }: FieldShellStyle,
  className?: string,
) {
  return cn(
    "flex items-center rounded-field border border-border-field bg-field text-[14px] text-foreground",
    align === "between" ? "justify-between" : "gap-2.5",
    compact ? "px-3 py-2.25 text-[13px]" : "px-3.25 py-2.75",
    className,
  );
}

interface FieldShellProps
  extends React.HTMLAttributes<HTMLDivElement>, FieldShellStyle {}

export function FieldShell({
  align = "between",
  compact = false,
  className,
  ...props
}: FieldShellProps) {
  return (
    <div
      className={fieldShellClass({ align, compact }, className)}
      {...props}
    />
  );
}
