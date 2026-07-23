"use client";

import { Icon } from "@/components/icons";
import { cn } from "@/lib/cn";

import { fieldShellClass } from "./field-shell";
import { ProjectDot } from "../core/project-dot";

interface ColorPickerProps {
  value: string;
  suggestions?: string[];
  onChange?: (color: string) => void;
  onPick?: () => void;
  className?: string;
}

export function ColorPicker({
  value,
  suggestions = [],
  onChange,
  onPick,
  className,
}: ColorPickerProps) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <div className="flex items-center gap-2.5">
        <div className={fieldShellClass({ align: "start" }, "flex-1")}>
          <ProjectDot color={value} size={16} />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            spellCheck={false}
            className="w-full min-w-0 bg-transparent font-mono uppercase outline-none"
          />
        </div>
        <button
          type="button"
          title="Pick from screen"
          onClick={onPick}
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-field border border-border-field bg-surface text-foreground"
        >
          <Icon name="palette" size={20} />
        </button>
      </div>
      {suggestions.length > 0 ? (
        <div className="flex items-center gap-2.5">
          <span className="text-[12px] text-subtle">Suggestions</span>
          {suggestions.map((color) => {
            const selected = color === value;
            return (
              <button
                key={color}
                type="button"
                aria-label={color}
                onClick={() => onChange?.(color)}
                className={cn(
                  "size-5.5 shrink-0 cursor-pointer rounded-full",
                  selected && "ring-2 ring-offset-2 ring-offset-card",
                )}
                style={{
                  backgroundColor: color,
                  ...(selected
                    ? ({ "--tw-ring-color": color } as React.CSSProperties)
                    : null),
                }}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
