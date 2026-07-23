import { cn } from "@/lib/cn";

interface ProjectDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** User-chosen project hex — the one sanctioned dynamic inline style. */
  color: string;
  size?: number;
  variant?: "dot" | "rail";
}

export function ProjectDot({
  color,
  size = 10,
  variant = "dot",
  className,
  style,
  ...props
}: ProjectDotProps) {
  if (variant === "rail") {
    return (
      <span
        aria-hidden="true"
        className={cn("shrink-0 self-stretch rounded-full", className)}
        style={{ width: 3, backgroundColor: color, ...style }}
        {...props}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn("inline-block shrink-0 rounded-full", className)}
      style={{ width: size, height: size, backgroundColor: color, ...style }}
      {...props}
    />
  );
}
