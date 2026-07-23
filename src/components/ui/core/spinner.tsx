import { cn } from "@/lib/cn";

type SpinnerProps = React.SVGAttributes<SVGSVGElement>;

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <svg
      className={cn("size-3.5 animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3.5"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M12 2a10 10 0 0 1 10 10h-3.5A6.5 6.5 0 0 0 12 5.5Z"
      />
    </svg>
  );
}
