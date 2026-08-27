"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GulfNetworkVisual } from "./gulf-network-visual";

export function Hero({ locale }: { locale: string }) {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-20 md:grid-cols-2 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl">
            Move Smarter.
            <br />
            Across the Gulf.
          </h1>
          <p className="mt-6 max-w-md text-lg text-white/60">
            One intelligent platform for road, sea, air, warehouse, customs and cross-border logistics
            across the GCC.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/register`}
              className="rounded-lg bg-teal-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-400 hover:shadow-xl active:scale-[0.98]"
            >
              Start Your Journey
            </Link>
            <a
              href="#network"
              className="rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5"
            >
              Track a Shipment
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        >
          <GulfNetworkVisual className="w-full" />
        </motion.div>
      </div>
    </section>
  );
}
