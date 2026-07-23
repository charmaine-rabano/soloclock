import { cn } from "@/lib/cn";

interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md";
}

export function Logo({ size = "md", className, ...props }: LogoProps) {
  const dot = size === "sm" ? "size-3" : "size-[13px]";
  const word = size === "sm" ? "text-sm" : "text-[15px]";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={`${dot} rounded-full bg-accent shadow-[0_0_0_3px] shadow-accent-ring`}
      />
      <span className={word}>soloclock</span>
    </span>
  );
}
