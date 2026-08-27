"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, TrendingUp, Building2, KeyRound, History } from "lucide-react";

const TRUST = [
  { icon: ShieldCheck, label: "Secure", description: "Row-level security enforced on every table." },
  { icon: Zap, label: "Reliable", description: "Real-time state, no stale dashboards." },
  { icon: TrendingUp, label: "Scalable", description: "Built to grow from one branch to a full network." },
  { icon: Building2, label: "Multi-Tenant", description: "Company, country, and branch-level isolation." },
  { icon: KeyRound, label: "Role-Based Access", description: "31 roles, module-level permissions." },
  { icon: History, label: "Audit Ready", description: "Every change logged, attributed, and reviewable." },
];

export function TrustSection() {
  return (
    <section id="trust" className="bg-navy-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center text-3xl font-semibold tracking-tight md:text-4xl"
        >
          Enterprise trust, from the ground up
        </motion.h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-400/15 text-teal-300">
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold">{t.label}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-white/50">{t.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
