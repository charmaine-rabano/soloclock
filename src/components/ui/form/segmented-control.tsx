"use client";

import { cn } from "@/lib/cn";

interface SegmentedControlOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function SegmentedControl({
  options,
  value,
  onValueChange,
  className,
}: SegmentedControlProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex rounded-btn border border-border-field bg-stat p-0.75",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange?.(option.value)}
            className={cn(
              "flex-1 cursor-pointer rounded-[7px] py-1.75 text-center text-[13px]",
              active
                ? "bg-segment-active font-semibold text-foreground"
                : "text-muted",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
