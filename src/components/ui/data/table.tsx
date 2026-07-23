import { cn } from "@/lib/cn";

import { Card } from "../core/card";

type TableProps = React.HTMLAttributes<HTMLDivElement>;

export function Table({ className, ...props }: TableProps) {
  return <Card className={cn("overflow-hidden", className)} {...props} />;
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** CSS `grid-template-columns` value shared with the table's rows. */
  columns: string;
}

export function TableHeader({
  columns,
  className,
  style,
  ...props
}: TableHeaderProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-3.5 border-b border-border bg-btn-secondary px-4.5 py-2.75 text-[11.5px] tracking-[0.04em] text-subtle uppercase",
        className,
      )}
      style={{ gridTemplateColumns: columns, ...style }}
      {...props}
    />
  );
}

interface TableRowProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: string;
  density?: "default" | "compact";
  /** Omits the top divider — set on the first row in a table. */
  first?: boolean;
}

export function TableRow({
  columns,
  density = "default",
  first = false,
  className,
  style,
  ...props
}: TableRowProps) {
  return (
    <div
      className={cn(
        "group grid items-center gap-3.5 px-4.5 hover:bg-accent/7",
        density === "compact" ? "py-2.25" : "py-3.25",
        !first && "border-t border-border",
        className,
      )}
      style={{ gridTemplateColumns: columns, ...style }}
      {...props}
    />
  );
}
