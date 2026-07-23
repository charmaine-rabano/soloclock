import { cn } from "@/lib/cn";

export type ToastVariant = "default" | "warning" | "error";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastCardProps {
  variant?: ToastVariant;
  title: string;
  message?: string;
  action?: ToastAction;
  dismissible?: boolean;
  onDismiss?: () => void;
  /** Drives the progress bar's shrink duration; 0 hides it. */
  duration?: number;
  showProgress?: boolean;
}

// Glyph and colour are folded into the variant so call sites never improvise a
// pairing. Icon colour carries the variant; the surface stays constant — the
// design rule that hue never encodes status alone still holds, the text does.
const variantConfig: Record<
  ToastVariant,
  { glyph: string; accent: string; border: string }
> = {
  default: {
    glyph: "✓",
    accent: "bg-accent",
    border: "border-accent-border",
  },
  warning: {
    glyph: "!",
    accent: "bg-warning",
    border: "border-warning-soft-border",
  },
  error: {
    glyph: "✕",
    accent: "bg-danger-text",
    border: "border-danger-soft-border",
  },
};

const accentTextClass: Record<ToastVariant, string> = {
  default: "text-accent",
  warning: "text-warning",
  error: "text-danger-text",
};

/**
 * Presentational toast card — no positioning, no timers. Both the standalone
 * `Toast` overlay and the `Toaster` viewport render this so their look can't
 * drift apart.
 */
export function ToastCard({
  variant = "default",
  title,
  message,
  action,
  dismissible = true,
  onDismiss,
  duration = 6000,
  showProgress = true,
}: ToastCardProps) {
  const config = variantConfig[variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex w-90 flex-col gap-2.5 rounded-lg border bg-card px-4 pt-3.5 pb-3 shadow-2xl",
        config.border,
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "flex size-6 flex-none items-center justify-center rounded-full text-[13px] font-bold text-accent-foreground",
            config.accent,
          )}
        >
          {config.glyph}
        </span>
        <div className="flex flex-1 flex-col gap-0.75">
          <span className="text-[14px] font-bold text-foreground">{title}</span>
          {message ? (
            <span className="text-[13px] leading-relaxed text-body">
              {message}
            </span>
          ) : null}
          {action ? (
            <button
              type="button"
              onClick={action.onClick}
              className={cn(
                "mt-0.5 cursor-pointer self-start text-[12.5px] font-semibold",
                accentTextClass[variant],
              )}
            >
              {action.label}
            </button>
          ) : null}
        </div>
        {dismissible ? (
          <button
            type="button"
            aria-label="Dismiss"
            onClick={onDismiss}
            className="flex-none cursor-pointer p-0.5 text-[14px] leading-none text-subtle transition-colors hover:text-foreground"
          >
            {"✕"}
          </button>
        ) : null}
      </div>
      {showProgress && duration > 0 ? (
        <div className="mt-0.5 h-0.75 overflow-hidden rounded-sm bg-white/6">
          <div
            className={cn("h-full rounded-sm", config.accent)}
            style={{
              animation: `toast-progress ${duration}ms linear forwards`,
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
