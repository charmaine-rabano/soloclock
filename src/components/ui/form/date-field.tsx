"use client";

import { cn } from "@/lib/cn";

import { fieldShellClass } from "./field-shell";

interface DateFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  compact?: boolean;
}

export function DateField({
  compact = false,
  className,
  ...props
}: DateFieldProps) {
  return (
    <input
      type="date"
      className={fieldShellClass(
        { align: "start", compact },
        cn(
          "w-full cursor-pointer font-mono scheme-dark focus:border-accent focus:shadow-[0_0_0_3px] focus:shadow-accent-ring focus:outline-none",
          className,
        ),
      )}
      {...props}
    />
  );
}
