import { Button, ProjectDot } from "@/components/ui";
import { cn } from "@/lib/cn";

interface RunningTimerBarProps {
  projectColor: string;
  projectName: string;
  clientLabel: string;
  descriptionLabel?: string;
  elapsed: string;
  onStop?: () => void;
  className?: string;
}

export function RunningTimerBar({
  projectColor,
  projectName,
  clientLabel,
  descriptionLabel,
  elapsed,
  onStop,
  className,
}: RunningTimerBarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3.5 border-t border-border-strong bg-linear-90 from-accent/16 to-accent/5 px-4.5 py-3 md:px-5.5",
        className,
      )}
    >
      <span className="size-2.25 shrink-0 animate-pulse-dot rounded-full bg-accent" />
      <span className="hidden font-mono text-[11px] tracking-[0.16em] text-accent md:inline">
        RUNNING
      </span>
      <ProjectDot color={projectColor} size={9} />
      <span className="truncate text-sm font-semibold md:text-[14px]">
        {projectName}
      </span>
      <span className="hidden truncate text-[13px] text-muted md:inline">
        {clientLabel}
        {descriptionLabel ? ` · ${descriptionLabel}` : ""}
      </span>
      <span className="ml-auto shrink-0 font-mono text-[16px] font-semibold text-foreground md:text-[19px]">
        {elapsed}
      </span>
      <button
        type="button"
        onClick={onStop}
        aria-label="Stop timer"
        className="flex size-7.5 shrink-0 cursor-pointer items-center justify-center rounded-ui border border-border-muted bg-btn-secondary md:hidden"
      >
        <span className="size-2 rounded-xs bg-accent" />
      </button>
      <Button
        variant="secondary"
        compact
        onClick={onStop}
        className="hidden shrink-0 md:inline-flex"
      >
        <span className="size-2 rounded-xs bg-accent" />
        Stop
      </Button>
    </div>
  );
}
