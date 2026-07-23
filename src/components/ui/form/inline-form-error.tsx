import { cn } from "@/lib/cn";

type InlineFormErrorProps = React.HTMLAttributes<HTMLParagraphElement>;

export function InlineFormError({
  className,
  children,
  ...props
}: InlineFormErrorProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-1 text-[12px] text-danger-text",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true">!</span>
      {children}
    </p>
  );
}
