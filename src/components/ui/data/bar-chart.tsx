import { cn } from "@/lib/cn";

interface BarChartDatum {
  month: string;
  billed: number;
  collected: number;
  current?: boolean;
}

interface BarChartProps {
  data: BarChartDatum[];
  max?: number;
  className?: string;
}

export function BarChart({ data, max, className }: BarChartProps) {
  const computedMax =
    max ?? Math.max(...data.flatMap((d) => [d.billed, d.collected]), 1);

  return (
    <div
      className={cn(
        "flex h-70 items-end gap-3.5 rounded-lg border border-border bg-card px-5 pt-5.5 pb-3.5",
        className,
      )}
    >
      {data.map((d) => (
        <div
          key={d.month}
          className="flex h-full flex-1 flex-col items-center justify-end gap-2"
        >
          <div className="flex h-full items-end gap-0.75">
            <div
              className="w-3.25 rounded-t-[3px] bg-accent"
              style={{ height: `${(d.billed / computedMax) * 100}%` }}
            />
            <div
              className="w-3.25 rounded-t-[3px] border border-accent bg-accent/12"
              style={{ height: `${(d.collected / computedMax) * 100}%` }}
            />
          </div>
          <span
            className={cn(
              "font-mono text-[10px] text-subtle",
              d.current && "font-semibold text-foreground",
            )}
          >
            {d.month}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ChartLegend({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4.5 text-[12px] text-muted",
        className,
      )}
    >
      <span className="flex items-center gap-1.75">
        <span className="size-3.5 rounded-[3px] bg-accent" />
        Billed
      </span>
      <span className="flex items-center gap-1.75">
        <span className="size-3.5 rounded-[3px] border border-accent bg-accent/12" />
        Collected
      </span>
    </div>
  );
}
