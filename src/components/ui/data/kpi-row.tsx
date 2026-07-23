import { cn } from "@/lib/cn";

interface KpiRowProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 2 | 3 | 4;
}

const colsClass: Record<2 | 3 | 4, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

export function KpiRow({ cols = 4, className, ...props }: KpiRowProps) {
  return (
    <div
      className={cn("grid gap-3.5", colsClass[cols], className)}
      {...props}
    />
  );
}
