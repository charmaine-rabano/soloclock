import { cn } from "@/lib/cn";

interface GroupHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  left: React.ReactNode;
  right?: React.ReactNode;
}

export function GroupHeader({
  left,
  right,
  className,
  ...props
}: GroupHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3.5 border-b border-border bg-btn-secondary px-4 py-2.5",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3">{left}</div>
      {right ? <div className="flex items-center gap-4.5">{right}</div> : null}
    </div>
  );
}
