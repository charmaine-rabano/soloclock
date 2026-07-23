import { Icon } from "@/components/icons";
import { cn } from "@/lib/cn";

import { Card } from "../core/card";

interface ErrorStateProps {
  variant?: "error" | "not-found";
  title: string;
  body?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  variant = "error",
  title,
  body,
  actions,
  className,
}: ErrorStateProps) {
  return (
    <Card
      className={cn(
        "flex min-h-75 flex-col items-center justify-center gap-3.5 p-8 text-center",
        className,
      )}
    >
      {variant === "error" ? (
        <div className="flex size-14 items-center justify-center rounded-lg border-[1.5px] border-danger-border text-danger">
          <Icon name="alert" size={24} />
        </div>
      ) : (
        <span className="font-mono text-[40px] font-bold text-border-muted">
          404
        </span>
      )}
      <h3 className="text-[16px] font-semibold">{title}</h3>
      {body ? (
        <p className="max-w-60 text-[13px] leading-relaxed text-muted">
          {body}
        </p>
      ) : null}
      {actions ? (
        <div className="flex items-center gap-2.5">{actions}</div>
      ) : null}
    </Card>
  );
}
