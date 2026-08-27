"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react";

type ToastVariant = "info" | "success" | "warning" | "error";
type Toast = { id: string; title: string; description?: string; variant: ToastVariant };

const ICONS: Record<ToastVariant, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const ToastContext = createContext<{
  toast: (t: Omit<Toast, "id">) => void;
} | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 5000);
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div className="fixed bottom-4 end-4 z-[100] flex w-full max-w-sm flex-col gap-2">
            <AnimatePresence>
              {toasts.map((t) => {
                const Icon = ICONS[t.variant];
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-3 rounded-xl border border-border-subtle bg-surface-raised p-4 shadow-lg"
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{t.title}</div>
                      {t.description && <div className="mt-0.5 text-xs text-foreground-muted">{t.description}</div>}
                    </div>
                    <button onClick={() => dismiss(t.id)} className="text-foreground-muted hover:text-foreground">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.toast;
}
