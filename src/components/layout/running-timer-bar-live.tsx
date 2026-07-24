"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { Icon } from "@/components/icons";
import { InlineTextField, ProjectDot, Toggle, useToast } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatClock } from "@/lib/format";
import {
  stopTimerAction,
  updateRunningBillableAction,
  updateRunningDescriptionAction,
  updateRunningProjectAction,
} from "@/lib/timer/actions";

import { RunningTimerBar } from "./running-timer-bar";

export interface RunningTimerBarProjectOption {
  id: string;
  name: string;
  color: string;
  clientName: string;
}

interface RunningTimerBarLiveProps {
  entryId: string;
  projectId: string;
  projectColor: string;
  projectName: string;
  clientLabel: string;
  description: string | null;
  billable: boolean;
  /** `startedAt.getTime()` — a plain number, since Date instances don't
   *  survive the server → client component boundary as usable Dates. */
  startedAtMs: number;
  projectOptions: RunningTimerBarProjectOption[];
}

export function RunningTimerBarLive({
  entryId,
  projectId,
  projectColor,
  projectName,
  clientLabel,
  description,
  billable,
  startedAtMs,
  projectOptions,
}: RunningTimerBarLiveProps) {
  const [elapsedMs, setElapsedMs] = useState(() => Date.now() - startedAtMs);
  const [isStopping, startStopTransition] = useTransition();

  // SC-TMR-02: elapsed is always recomputed from `startedAtMs`, never
  // incremented — correct even after the tab was backgrounded. The interval
  // is cleared on unmount so nothing leaks across navigation.
  useEffect(() => {
    const tick = () => setElapsedMs(Date.now() - startedAtMs);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAtMs]);

  function handleStop() {
    if (isStopping) return;
    startStopTransition(async () => {
      await stopTimerAction();
    });
  }

  return (
    <RunningTimerBar
      projectColor={projectColor}
      projectName={projectName}
      clientLabel={clientLabel}
      elapsed={formatClock(elapsedMs)}
      onStop={handleStop}
      projectSlot={
        <ProjectPicker
          entryId={entryId}
          projectId={projectId}
          projectName={projectName}
          options={projectOptions}
        />
      }
      descriptionSlot={
        <DescriptionField entryId={entryId} description={description} />
      }
      billableSlot={<BillableToggle entryId={entryId} billable={billable} />}
    />
  );
}

function DescriptionField({
  entryId,
  description,
}: {
  entryId: string;
  description: string | null;
}) {
  const [, startTransition] = useTransition();
  const { toast } = useToast();

  function handleCommit(next: string) {
    startTransition(async () => {
      const result = await updateRunningDescriptionAction(entryId, next);
      if (!result.ok) {
        toast({
          variant: "error",
          title: "Couldn't update description",
          message: result.error,
        });
      }
    });
  }

  return (
    <InlineTextField
      value={description ?? ""}
      onCommit={handleCommit}
      placeholder="Add a description"
      ariaLabel="Timer description"
      className="flex-1 text-[13px] text-muted focus:text-foreground"
    />
  );
}

function BillableToggle({
  entryId,
  billable,
}: {
  entryId: string;
  billable: boolean;
}) {
  const [, startTransition] = useTransition();
  const { toast } = useToast();

  function handleChange(next: boolean) {
    startTransition(async () => {
      const result = await updateRunningBillableAction(entryId, next);
      if (!result.ok) {
        toast({
          variant: "error",
          title: "Couldn't update billable status",
          message: result.error,
        });
      }
    });
  }

  return (
    <Toggle
      checked={billable}
      onCheckedChange={handleChange}
      label="Billable"
    />
  );
}

function ProjectPicker({
  entryId,
  projectId,
  projectName,
  options,
}: {
  entryId: string;
  projectId: string;
  projectName: string;
  options: RunningTimerBarProjectOption[];
}) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  function handleSelect(nextProjectId: string) {
    setOpen(false);
    if (nextProjectId === projectId) return;
    startTransition(async () => {
      const result = await updateRunningProjectAction(entryId, nextProjectId);
      if (!result.ok) {
        toast({
          variant: "error",
          title: "Couldn't switch project",
          message: result.error,
        });
      }
    });
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer truncate text-sm font-semibold hover:text-accent md:text-[14px]"
      >
        {projectName}
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute bottom-[calc(100%+6px)] left-0 z-20 flex w-64 flex-col gap-px rounded-[11px] border border-border-strong bg-btn-secondary p-1.5 shadow-[0_-24px_44px_-14px_rgba(0,0,0,0.75)]"
        >
          {options.map((option) => {
            const isSelected = option.id === projectId;
            return (
              <li key={option.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.id)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2.5 rounded-[7px] px-2.5 py-2.25 text-left",
                    isSelected ? "bg-accent/10" : "hover:bg-surface-hover",
                  )}
                >
                  <ProjectDot color={option.color} size={9} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span
                      className={cn(
                        "truncate text-[13.5px]",
                        isSelected && "font-medium",
                      )}
                    >
                      {option.name}
                    </span>
                    <span className="truncate text-[11px] text-subtle">
                      {option.clientName}
                    </span>
                  </span>
                  {isSelected ? (
                    <Icon
                      name="check"
                      size={13}
                      className="shrink-0 text-accent"
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
