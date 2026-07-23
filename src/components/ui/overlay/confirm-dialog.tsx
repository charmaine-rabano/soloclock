"use client";

import { Button } from "../core/button";
import { Modal } from "./modal";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  body: React.ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  variant?: "neutral" | "destructive";
}

export function ConfirmDialog({
  open,
  onClose,
  title,
  body,
  confirmLabel,
  onConfirm,
  variant = "neutral",
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" compact onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "primary"}
            compact
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-[13px] leading-relaxed text-body">{body}</p>
    </Modal>
  );
}
