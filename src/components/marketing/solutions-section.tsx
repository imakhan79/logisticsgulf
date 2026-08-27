"use client";

import { motion } from "framer-motion";
import { Truck, Ship, Plane, Warehouse, ArrowLeftRight, FileCheck, Gauge, PackageCheck } from "lucide-react";

const SOLUTIONS = [
  { icon: Truck, label: "Road Freight", description: "Full and part-load trucking across the GCC road network." },
  { icon: Ship, label: "Sea Freight", description: "FCL and LCL ocean freight through major Gulf ports." },
  { icon: Plane, label: "Air Freight", description: "Time-critical air cargo with real-time visibility." },
  { icon: Warehouse, label: "Warehousing", description: "Multi-country warehouse and inventory management." },
  { icon: ArrowLeftRight, label: "Cross-Border", description: "Seamless multi-country shipments across GCC borders." },
  { icon: FileCheck, label: "Customs", description: "Declarations, clearance, and compliance handled end-to-end." },
  { icon: Gauge, label: "Fleet Management", description: "Vehicle, driver, and maintenance tracking in one place." },
  { icon: PackageCheck, label: "Last-Mile Delivery", description: "Final-mile delivery with proof-of-delivery capture." },
];

export function SolutionsSection() {
  return (
    <section id="solutions" className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Solutions</h2>
          <p className="mx-auto mt-3 max-w-xl text-foreground-muted">
            Every mode, every stage, one platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-border-subtle bg-surface-raised p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-500">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold">{s.label}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground-muted">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
