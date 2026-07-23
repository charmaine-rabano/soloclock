"use client";

import { useEffect } from "react";

import {
  ToastCard,
  type ToastAction,
  type ToastVariant,
} from "@/components/ui/overlay/toast-card";

interface ToastProps {
  open: boolean;
  onClose: () => void;
  variant?: ToastVariant;
  title: string;
  message?: string;
  action?: ToastAction;
  dismissible?: boolean;
  /** Auto-dismiss delay in ms. Pass 0 to keep the toast until dismissed. */
  duration?: number;
  showProgress?: boolean;
}

/**
 * Standalone, locally-controlled toast (`open`/`onClose`, like `Modal`). For
 * app-wide toasts, prefer `useToast()` from the provider instead — this is for
 * one-off cases outside the provider's tree (e.g. the auth pages).
 */
export function Toast({
  open,
  onClose,
  duration = 6000,
  ...cardProps
}: ToastProps) {
  useEffect(() => {
    if (!open || duration <= 0) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div className="fixed right-6 bottom-6 z-50 flex justify-end">
      <ToastCard duration={duration} onDismiss={onClose} {...cardProps} />
    </div>
  );
}
