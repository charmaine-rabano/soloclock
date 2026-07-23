import { cn } from "@/lib/cn";

type FieldGroupProps = React.HTMLAttributes<HTMLDivElement>;

export function FieldGroup({ className, ...props }: FieldGroupProps) {
  return <div className={cn("flex flex-col gap-1.75", className)} {...props} />;
}

type FormRowProps = React.HTMLAttributes<HTMLDivElement>;

export function FormRow({ className, ...props }: FormRowProps) {
  return <div className={cn("flex gap-3 *:flex-1", className)} {...props} />;
}
