"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 30, stiffness: 100 });
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toLocaleString();
    });
  }, [spring]);

  return <span ref={ref} className="tabular-nums">0</span>;
}

export function KpiCard({
  label,
  value,
  icon,
  accent = "navy",
  suffix,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  accent?: "navy" | "teal" | "ocean" | "gold";
  suffix?: string;
}) {
  const accentClass = {
    navy: "bg-navy-900/5 text-navy-900",
    teal: "bg-teal-500/10 text-teal-500",
    ocean: "bg-ocean-500/10 text-ocean-600",
    gold: "bg-gold-500/10 text-gold-500",
  }[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border-subtle bg-surface-raised p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-foreground-muted">{label}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${accentClass}`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-semibold tracking-tight">
        <Counter value={value} />
        {suffix}
      </div>
    </motion.div>
  );
}
