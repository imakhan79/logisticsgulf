"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "end",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "start" | "end";
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  const offscreen = side === "end" ? "100%" : "-100%";

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: offscreen }}
            animate={{ x: 0 }}
            exit={{ x: offscreen }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`absolute top-0 ${side === "end" ? "end-0" : "start-0"} flex h-full w-full max-w-md flex-col border-border-subtle bg-surface-raised shadow-2xl ${side === "end" ? "border-s" : "border-e"}`}
          >
            <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
              {title && <h2 className="text-lg font-semibold tracking-tight">{title}</h2>}
              <button
                onClick={onClose}
                aria-label="Close"
                className="ms-auto flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted hover:bg-surface"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
