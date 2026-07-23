import { cn } from "@/lib/cn";

interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  initials: string;
  size?: number;
}

export function Avatar({
  initials,
  size = 32,
  className,
  style,
  ...props
}: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-border-muted bg-linear-to-br from-avatar-from to-avatar-to text-xs font-semibold text-avatar-text",
        className,
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      {initials}
    </span>
  );
}
