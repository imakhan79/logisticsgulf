"use client";

import { motion } from "framer-motion";
import {
  MapPin, Route as RouteIcon, Truck, ArrowLeftRight, FileCheck, Warehouse, FileText, Sparkles,
} from "lucide-react";

const FEATURES = [
  { icon: MapPin, label: "Real-Time Tracking" },
  { icon: RouteIcon, label: "Smart Route Planning" },
  { icon: Truck, label: "Fleet Intelligence" },
  { icon: ArrowLeftRight, label: "Cross-Border Management" },
  { icon: FileCheck, label: "Customs Visibility" },
  { icon: Warehouse, label: "Warehouse Management" },
  { icon: FileText, label: "Digital Documents" },
  { icon: Sparkles, label: "AI-Powered Insights" },
];

export function FeaturesSection() {
  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center text-3xl font-semibold tracking-tight md:text-4xl"
        >
          Built for logistics, not adapted from it
        </motion.h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="flex flex-col items-center gap-3 rounded-xl border border-border-subtle bg-surface-raised p-6 text-center"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ocean-500/10 text-ocean-600">
                <f.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">{f.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
