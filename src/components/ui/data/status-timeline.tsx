import { cn } from "@/lib/cn";

interface StatusTimelineStep {
  label: string;
  timestamp?: string;
  state: "done" | "current" | "upcoming";
}

interface StatusTimelineProps {
  steps: StatusTimelineStep[];
  className?: string;
}

export function StatusTimeline({ steps, className }: StatusTimelineProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {steps.map((step) => {
        const active = step.state !== "upcoming";
        return (
          <div key={step.label} className="flex items-center gap-2.5">
            <span
              className={cn(
                "size-2.5 shrink-0 rounded-full",
                active ? "bg-accent" : "border-[1.5px] border-border-muted",
              )}
            />
            <span
              className={cn(
                "flex-1 text-[13px]",
                active ? "font-semibold text-foreground" : "text-subtle",
              )}
            >
              {step.label}
            </span>
            <span
              className={cn(
                "font-mono text-[11px]",
                active ? "text-subtle" : "text-border-muted",
              )}
            >
              {step.timestamp ?? "—"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
