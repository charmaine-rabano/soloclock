import { Icon } from "@/components/icons";
import { cn } from "@/lib/cn";

interface FilterRailProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
  onCollapse?: () => void;
  onExpand?: () => void;
}

export function FilterRail({
  collapsed = false,
  onCollapse,
  onExpand,
  className,
  children,
  ...props
}: FilterRailProps) {
  if (collapsed) {
    return (
      <div
        className={cn(
          "flex w-7.5 flex-col items-center gap-4.5 border-r border-border bg-surface py-3.5",
          className,
        )}
        title="Filters — collapsed"
        {...props}
      >
        <button
          type="button"
          onClick={onExpand}
          aria-label="Expand filters"
          className="flex size-5.5 cursor-pointer items-center justify-center rounded-[7px] border border-border-field text-muted"
        >
          <Icon name="chevrons-right" size={13} />
        </button>
        <span
          className="font-mono text-[10.5px] tracking-[0.16em] text-subtle"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          FILTERS
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-64.5 flex-col gap-6 border-r border-border bg-surface px-5 py-5.5",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.16em] text-subtle">
          FILTERS
        </span>
        <button
          type="button"
          onClick={onCollapse}
          aria-label="Collapse filters"
          className="flex size-6.5 cursor-pointer items-center justify-center rounded-[7px] border border-border-field text-muted"
        >
          <Icon name="chevrons-left" size={13} />
        </button>
      </div>
      {children}
    </div>
  );
}
