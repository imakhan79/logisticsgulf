"use client";

import { motion } from "framer-motion";

const COUNTRIES = [
  { name: "United Arab Emirates", flag: "🇦🇪", hubs: "Dubai · Abu Dhabi · Jebel Ali" },
  { name: "Saudi Arabia", flag: "🇸🇦", hubs: "Riyadh · Jeddah · Dammam" },
  { name: "Qatar", flag: "🇶🇦", hubs: "Doha · Hamad Port" },
  { name: "Kuwait", flag: "🇰🇼", hubs: "Kuwait City · Shuwaikh Port" },
  { name: "Oman", flag: "🇴🇲", hubs: "Muscat · Salalah" },
  { name: "Bahrain", flag: "🇧🇭", hubs: "Manama · Khalifa Bin Salman Port" },
];

export function NetworkSection() {
  return (
    <section id="network" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">One Network. Six Gulf Markets.</h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {COUNTRIES.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-border-subtle bg-surface-raised p-5 transition-shadow hover:shadow-lg"
            >
              <div className="mb-3 text-3xl">{c.flag}</div>
              <h3 className="text-sm font-semibold">{c.name}</h3>
              <p className="mt-1 text-xs text-foreground-muted">{c.hubs}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
