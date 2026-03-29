"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface Stats {
  playerCount: number;
  totalKills: number;
  totalGames: number;
  totalBeds: number;
}

const statItems = [
  {
    key: "playerCount",
    label: "Total Players",
    icon: "👥",
    color: "#4ade80",
    glow: "rgba(74,222,128,0.15)",
  },
  {
    key: "totalKills",
    label: "Total Kills",
    icon: "⚔️",
    color: "#f87171",
    glow: "rgba(248,113,113,0.15)",
  },
  {
    key: "totalGames",
    label: "Games Played",
    icon: "🎮",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.15)",
  },
  {
    key: "totalBeds",
    label: "Beds Destroyed",
    icon: "🛏️",
    color: "#fb923c",
    glow: "rgba(251,146,60,0.15)",
  },
];

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();
    const startVal = prevRef.current;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(startVal + (value - startVal) * eased);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(tick);
      else prevRef.current = value;
    };

    requestAnimationFrame(tick);
  }, [value]);

  return <>{display.toLocaleString()}</>;
}

export default function StatsGrid() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/players")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
      {statItems.map((item, i) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 150 }}
          whileHover={{
            y: -8,
            scale: 1.05,
            transition: { type: "spring", stiffness: 300 },
          }}
          className="relative glass rounded-lg p-6 text-center group cursor-default overflow-hidden"
        >
          {/* Background glow on hover */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at 50% 80%, ${item.glow}, transparent 70%)`,
            }}
          />

          {/* Bottom accent line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity"
            style={{ background: item.color }}
          />

          <motion.div
            className="text-4xl mb-3 relative z-10"
            whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.3 }}
          >
            {item.icon}
          </motion.div>
          <div
            className="text-3xl font-black mb-1 relative z-10"
            style={{
              color: item.color,
              textShadow: `0 0 20px ${item.glow}`,
            }}
          >
            {stats ? (
              <AnimatedNumber value={stats[item.key as keyof Stats]} />
            ) : (
              <motion.span
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                —
              </motion.span>
            )}
          </div>
          <div className="text-gray-500 text-[10px] uppercase tracking-[0.25em] font-bold relative z-10">
            {item.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
