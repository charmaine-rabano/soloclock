"use client";

import { Icon } from "@/components/icons";
import { cn } from "@/lib/cn";

interface CollapsibleGroupRowProps {
  open: boolean;
  onToggle: () => void;
  summary: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function CollapsibleGroupRow({
  open,
  onToggle,
  summary,
  children,
  className,
}: CollapsibleGroupRowProps) {
  return (
    <div className={className}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-3.5 px-4.5 py-3.25 text-left"
      >
        <Icon
          name="chevron-down"
          size={13}
          className={cn(
            "shrink-0 text-accent transition-transform",
            !open && "-rotate-90",
          )}
        />
        {summary}
      </button>
      {open ? <div className="flex flex-col">{children}</div> : null}
    </div>
  );
}

export function CollapsibleChildRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-t border-border-child bg-field px-4 py-2 text-[12.5px] text-faint",
        className,
      )}
      {...props}
    />
  );
}
