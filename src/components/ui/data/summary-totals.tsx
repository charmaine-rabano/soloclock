import { cn } from "@/lib/cn";

interface SummaryRow {
  label: string;
  value: string;
}

interface SummaryTotalsProps {
  rows: SummaryRow[];
  total: SummaryRow;
  className?: string;
}

export function SummaryTotals({ rows, total, className }: SummaryTotalsProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex justify-between text-[13px] text-muted"
        >
          <span>{row.label}</span>
          <span className="font-mono">{row.value}</span>
        </div>
      ))}
      <div className="flex justify-between border-t border-border-strong pt-2 text-[17px] font-bold">
        <span>{total.label}</span>
        <span className="font-mono text-accent">{total.value}</span>
      </div>
    </div>
  );
}
