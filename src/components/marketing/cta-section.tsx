"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CtaSection({ locale }: { locale: string }) {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-semibold tracking-tight md:text-5xl"
        >
          Your Gulf logistics network starts here.
        </motion.h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={`/${locale}/register`}
            className="rounded-lg bg-navy-900 px-7 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-navy-800 hover:shadow-lg active:scale-[0.98]"
          >
            Get Started
          </Link>
          <Link
            href={`/${locale}/login`}
            className="rounded-lg border border-border-subtle px-7 py-3 text-sm font-medium transition-colors hover:bg-surface"
          >
            Talk to Sales
          </Link>
        </div>
      </div>
    </section>
  );
}
