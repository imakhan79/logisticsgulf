"use client";

import { motion } from "framer-motion";

const STEPS = ["Quote", "Book", "Plan", "Dispatch", "Track", "Customs", "Deliver", "Pay"];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">How it works</h2>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-6">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-teal-500/30 bg-teal-500/5 text-sm font-semibold text-teal-600">
                  {i + 1}
                </div>
                <span className="text-xs font-medium">{step}</span>
              </motion.div>
              {i < STEPS.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 + 0.15 }}
                  className="mx-2 h-px w-8 origin-left bg-border-subtle md:w-12"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
