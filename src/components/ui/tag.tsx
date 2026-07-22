import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/lib/cn";

export type TagStatus =
  | "running"
  | "non-billable"
  | "count"
  | "excluded"
  | "draft"
  | "sent"
  | "paid"
  | "void";

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: TagStatus;
}

const statusClass: Record<TagStatus, string> = {
  running: "border border-accent-border text-accent",
  "non-billable": "border border-border-muted text-muted",
  count: "border border-border-muted text-muted",
  excluded: "border border-border-muted text-muted",
  draft: "border border-dashed border-status-draft-border text-status-draft",
  sent: "border border-status-sent-border text-status-sent",
  paid: "border border-status-paid-border bg-status-paid-bg text-status-paid",
  void: "border border-border-muted text-subtle",
};

// Status glyphs are folded into the variant so call sites never improvise one.
const statusGlyph: Partial<Record<TagStatus, IconName>> = {
  sent: "arrow-up-right",
  paid: "check",
  void: "ban",
};

export function Tag({
  status = "running",
  className,
  children,
  ...props
}: TagProps) {
  const glyph = statusGlyph[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-tag px-1.75 py-0.75 font-mono text-[10px] tracking-[0.06em]",
        statusClass[status],
        className,
      )}
      {...props}
    >
      {children}
      {glyph ? <Icon name={glyph} size={11} /> : null}
    </span>
  );
}
