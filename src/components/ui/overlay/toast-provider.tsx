"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ToastCard,
  type ToastAction,
  type ToastVariant,
} from "@/components/ui/overlay/toast-card";

interface ToastOptions {
  variant?: ToastVariant;
  title: string;
  message?: string;
  action?: ToastAction;
  dismissible?: boolean;
  /** Auto-dismiss delay in ms. Pass 0 to keep the toast until dismissed. */
  duration?: number;
  showProgress?: boolean;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  /** Enqueue a toast; returns its id so it can be dismissed programmatically. */
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, ...options }]);
    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider.");
  }
  return context;
}

function Toaster({
  toasts,
  dismiss,
}: {
  toasts: ToastItem[];
  dismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-2.5">
      {toasts.map((toast) => (
        <ToasterItem key={toast.id} toast={toast} dismiss={dismiss} />
      ))}
    </div>
  );
}

function ToasterItem({
  toast,
  dismiss,
}: {
  toast: ToastItem;
  dismiss: (id: string) => void;
}) {
  const { id, duration = 6000 } = toast;

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => dismiss(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, dismiss]);

  return (
    <ToastCard
      variant={toast.variant}
      title={toast.title}
      message={toast.message}
      action={toast.action}
      dismissible={toast.dismissible}
      duration={duration}
      showProgress={toast.showProgress}
      onDismiss={() => dismiss(id)}
    />
  );
}
