import { cn } from "@/lib/cn";

import packageJson from "../../../../package.json";
import { Logo } from "../core/logo";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-dvh items-center justify-center bg-[radial-gradient(120%_90%_at_50%_0%,var(--color-auth-from),var(--color-auth-to))] p-8",
        className,
      )}
    >
      <div className="flex w-95 flex-col gap-4.5 rounded-modal border border-border-field bg-dialog px-7 py-7.5 shadow-2xl">
        <Logo size="md" />
        <div>
          <h1 className="text-[22px] font-bold">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-[13px] text-muted">{subtitle}</p>
          ) : null}
        </div>
        {children}
        {footer ? (
          <div className="text-center text-[13px] text-muted">{footer}</div>
        ) : null}
      </div>
      <p className="absolute inset-x-0 bottom-4 text-center text-[11px] text-muted">
        v{packageJson.version}
      </p>
    </div>
  );
}
