"use client";

import { useEffect } from "react";

import { cn } from "@/lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md";
}

const sizeClass: Record<"sm" | "md", string> = {
  sm: "w-80",
  md: "w-120",
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-scrim backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative flex flex-col gap-3.75 rounded-modal border border-border-strong bg-dialog p-6 shadow-2xl",
          sizeClass[size],
        )}
      >
        {title ? <h2 className="text-[18px] font-bold">{title}</h2> : null}
        {children}
        {footer ? (
          <div className="flex justify-end gap-2.5">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
