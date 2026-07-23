import { cn } from "@/lib/cn";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  caption?: string;
  /** Render the value in accent ink. */
  accent?: boolean;
  compact?: boolean;
}

export function StatCard({
  label,
  value,
  caption,
  accent = false,
  compact = false,
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.75 rounded-card border border-border-field bg-stat",
        compact ? "p-2.25" : "px-4 py-3.75",
        className,
      )}
      {...props}
    >
      <span className="text-[12.5px] text-muted">{label}</span>
      <span
        className={cn(
          "font-mono text-2xl font-bold",
          accent ? "text-accent" : "text-foreground",
        )}
      >
        {value}
      </span>
      {caption ? (
        <span className="text-[11px] text-subtle">{caption}</span>
      ) : null}
    </div>
  );
}
