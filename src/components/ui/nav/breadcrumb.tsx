import Link from "next/link";

import { cn } from "@/lib/cn";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items, className, ...props }: BreadcrumbProps) {
  return (
    <div className={cn("text-[12.5px] text-subtle", className)} {...props}>
      {items.map((item, index) => (
        <span key={item.label}>
          {index > 0 ? <span className="text-border-muted"> / </span> : null}
          {item.href ? (
            <Link href={item.href} className="text-accent">
              {item.label}
            </Link>
          ) : (
            item.label
          )}
        </span>
      ))}
    </div>
  );
}
