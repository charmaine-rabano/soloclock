import Link from "next/link";

import { Icon } from "@/components/icons";
import { cn } from "@/lib/cn";

interface RowEditAffordanceProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function RowEditAffordance({
  href,
  onClick,
  className,
}: RowEditAffordanceProps) {
  const classes = cn(
    "flex items-center justify-end gap-1 text-[12px] font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100",
    className,
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        <Icon name="pencil" size={12} />
        Edit
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(classes, "cursor-pointer")}
    >
      <Icon name="pencil" size={12} />
      Edit
    </button>
  );
}
