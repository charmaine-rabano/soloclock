import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/lib/cn";

import { Card } from "../core/card";

interface EmptyStateProps {
  variant?: "no-data" | "no-results";
  title: string;
  body: string;
  actions?: React.ReactNode;
  className?: string;
}

const variantConfig: Record<
  "no-data" | "no-results",
  { icon: IconName; iconClass: string }
> = {
  "no-data": { icon: "clock", iconClass: "text-accent" },
  "no-results": { icon: "filter-x", iconClass: "text-subtle" },
};

export function EmptyState({
  variant = "no-data",
  title,
  body,
  actions,
  className,
}: EmptyStateProps) {
  const { icon, iconClass } = variantConfig[variant];
  return (
    <Card
      className={cn(
        "flex min-h-80 flex-col items-center justify-center gap-3.5 p-8 text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-14 items-center justify-center rounded-lg border-[1.5px] border-dashed border-border-muted",
          iconClass,
        )}
      >
        <Icon name={icon} size={24} />
      </div>
      <h3 className="text-[16px] font-semibold">{title}</h3>
      <p className="max-w-60 text-[13px] leading-relaxed text-muted">{body}</p>
      {actions ? (
        <div className="flex items-center gap-2.5">{actions}</div>
      ) : null}
    </Card>
  );
}
