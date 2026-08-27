"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Tabs({
  tabs,
  defaultValue,
  className,
}: {
  tabs: { value: string; label: string; content: React.ReactNode }[];
  defaultValue?: string;
  className?: string;
}) {
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.value);
  const activeTab = tabs.find((t) => t.value === active);

  return (
    <div className={className}>
      <div className="relative flex gap-1 border-b border-border-subtle">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActive(tab.value)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors",
              active === tab.value ? "text-foreground" : "text-foreground-muted hover:text-foreground",
            )}
          >
            {tab.label}
            {active === tab.value && (
              <motion.div
                layoutId="tabs-underline"
                className="absolute inset-x-0 -bottom-px h-0.5 bg-teal-500"
                transition={{ duration: 0.2 }}
              />
            )}
          </button>
        ))}
      </div>
      <div className="pt-4">{activeTab?.content}</div>
    </div>
  );
}
