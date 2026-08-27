"use client";

import { motion } from "framer-motion";

// Illustrative positions (not geographically precise) suggesting the Gulf
// region's logistics network — a brand visual, not the real tracking map.
const CITIES = [
  { name: "Dubai", x: 420, y: 260 },
  { name: "Riyadh", x: 220, y: 300 },
  { name: "Doha", x: 340, y: 330 },
  { name: "Kuwait City", x: 260, y: 150 },
  { name: "Manama", x: 300, y: 250 },
  { name: "Muscat", x: 500, y: 380 },
];

const ROUTES: [number, number][] = [
  [0, 1], [0, 2], [0, 5], [1, 3], [1, 4], [0, 4],
];

export function GulfNetworkVisual({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 500" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="routeGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#17b8ae" stopOpacity="0" />
          <stop offset="50%" stopColor="#17b8ae" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#17b8ae" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3a89d1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3a89d1" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="330" cy="280" r="260" fill="url(#glow)" />

      {ROUTES.map(([a, b], i) => {
        const from = CITIES[a];
        const to = CITIES[b];
        return (
          <g key={i}>
            <motion.line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#1d4276"
              strokeWidth="1"
              strokeOpacity="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
            />
            <motion.circle
              r="3"
              fill="#4fd1c8"
              initial={{ opacity: 0 }}
              animate={{
                cx: [from.x, to.x],
                cy: [from.y, to.y],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 2.5, delay: 1 + i * 0.3, repeat: Infinity, repeatDelay: 1.5, ease: "linear" }}
            />
          </g>
        );
      })}

      {CITIES.map((city, i) => (
        <g key={city.name}>
          <motion.circle
            cx={city.x}
            cy={city.y}
            r="14"
            fill="#17b8ae"
            initial={{ opacity: 0.35, scale: 0.8 }}
            animate={{ opacity: [0.35, 0, 0.35], scale: [0.8, 1.8, 0.8] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
          />
          <circle cx={city.x} cy={city.y} r="4" fill="#e8cb84" />
          <text
            x={city.x}
            y={city.y - 16}
            textAnchor="middle"
            fontSize="11"
            fill="#93a3ba"
            fontFamily="var(--font-jakarta), sans-serif"
          >
            {city.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
