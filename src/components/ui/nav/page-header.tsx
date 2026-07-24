import { cn } from "@/lib/cn";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  /** Usually a formatted string; accepts a node for cases like a linked
   *  client name (e.g. the project detail header). */
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  /** User-chosen project hex — renders a left accent rail beside the title. */
  rail?: string;
}

export function PageHeader({
  title,
  subtitle,
  actions,
  rail,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn("flex items-start justify-between gap-4", className)}
      {...props}
    >
      <div
        className={rail ? "border-l-4 pl-4" : undefined}
        style={rail ? { borderColor: rail } : undefined}
      >
        <h1 className="text-[22px] font-bold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-[13px] text-subtle">{subtitle}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2.5">{actions}</div>
      ) : null}
    </div>
  );
}
