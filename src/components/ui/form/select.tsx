"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Icon } from "@/components/icons";
import { cn } from "@/lib/cn";

import { fieldShellClass } from "./field-shell";
import { ProjectDot } from "../core/project-dot";

export interface SelectOption {
  value: string;
  label: string;
  /** User-chosen project hex, rendered as a leading accent dot. */
  color?: string;
  /** Secondary line under the label — e.g. the client a project belongs to. */
  sublabel?: string;
  /** Draws a divider beneath this option (e.g. after an "All clients" row). */
  separatorAfter?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  /** Controlled selected value. Omit for uncontrolled use with `defaultValue`. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  compact?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-labelledby"?: string;
}

export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select…",
  compact = false,
  disabled = false,
  className,
  id,
  "aria-labelledby": ariaLabelledby,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;
  const selected = options.find((option) => option.value === selectedValue);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleSelect(optionValue: string) {
    if (!isControlled) setInternalValue(optionValue);
    onValueChange?.(optionValue);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-labelledby={ariaLabelledby}
        onClick={() => setOpen((prev) => !prev)}
        className={fieldShellClass(
          { align: "start", compact },
          cn(
            "w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
            open && "border-accent shadow-[0_0_0_3px] shadow-accent-ring",
          ),
        )}
      >
        {selected?.color ? (
          <ProjectDot color={selected.color} size={compact ? 9 : 10} />
        ) : null}
        <span className={cn("truncate", !selected && "text-subtle")}>
          {selected?.label ?? placeholder}
        </span>
        <Icon
          name="chevron-down"
          size={14}
          className={cn(
            "ml-auto shrink-0 transition-transform",
            open ? "rotate-180 text-accent" : "text-subtle",
          )}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          id={listboxId}
          aria-labelledby={ariaLabelledby}
          className="absolute top-[calc(100%+6px)] right-0 left-0 z-20 flex flex-col gap-px rounded-[11px] border border-border-strong bg-btn-secondary p-1.5 shadow-[0_24px_44px_-14px_rgba(0,0,0,0.75)]"
        >
          {options.map((option) => {
            const isSelected = option.value === selectedValue;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2.5 rounded-[7px] px-2.5 py-2.25 text-left",
                    isSelected ? "bg-accent/10" : "hover:bg-surface-hover",
                  )}
                >
                  {option.color ? (
                    <ProjectDot color={option.color} size={9} />
                  ) : null}
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span
                      className={cn(
                        "truncate",
                        option.sublabel ? "text-[13.5px]" : "text-[13px]",
                        isSelected && "font-medium",
                      )}
                    >
                      {option.label}
                    </span>
                    {option.sublabel ? (
                      <span className="truncate text-[11px] text-subtle">
                        {option.sublabel}
                      </span>
                    ) : null}
                  </span>
                  {isSelected ? (
                    <Icon
                      name="check"
                      size={13}
                      className="shrink-0 text-accent"
                    />
                  ) : null}
                </button>
                {option.separatorAfter ? (
                  <div className="my-0.75 border-t border-border" />
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
