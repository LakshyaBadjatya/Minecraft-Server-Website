"use client";

import { motion } from "framer-motion";

const modes = [
  {
    name: "Solo",
    desc: "1v1v1v1v1v1v1v1",
    players: "8 Players",
    icon: "⚔️",
    color: "#f87171",
    bg: "rgba(248,113,113,0.06)",
  },
  {
    name: "Doubles",
    desc: "2v2v2v2v2v2v2v2",
    players: "16 Players",
    icon: "👥",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.06)",
  },
  {
    name: "3v3v3v3",
    desc: "Trios Mode",
    players: "12 Players",
    icon: "🛡️",
    color: "#4ade80",
    bg: "rgba(74,222,128,0.06)",
  },
  {
    name: "4v4v4v4",
    desc: "Quads Mode",
    players: "16 Players",
    icon: "🏰",
    color: "#c084fc",
    bg: "rgba(192,132,252,0.06)",
  },
  {
    name: "Rush",
    desc: "Fast-paced Action",
    players: "Speed Mode",
    icon: "💨",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.06)",
  },
  {
    name: "Voidless",
    desc: "No Void Deaths",
    players: "Safe Mode",
    icon: "🌌",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.06)",
  },
];

export default function GameModes() {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2
          className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] mb-2"
          style={{
            background: "linear-gradient(180deg, #fff, #888)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Game Modes
        </h2>
        <p className="text-gray-600 text-sm tracking-wider">
          Choose your battlefield
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {modes.map((mode, i) => (
          <motion.div
            key={mode.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, type: "spring" }}
            whileHover={{
              y: -10,
              scale: 1.03,
              transition: { type: "spring", stiffness: 400 },
            }}
            className="relative glass rounded-lg p-6 text-center cursor-default overflow-hidden group"
            style={{ background: mode.bg }}
          >
            {/* Hover border glow */}
            <motion.div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: `inset 0 0 30px ${mode.color}15, 0 0 20px ${mode.color}10`,
              }}
            />

            {/* Top accent */}
            <div
              className="absolute top-0 left-1/4 right-1/4 h-[2px] opacity-0 group-hover:opacity-80 transition-all duration-300 group-hover:left-0 group-hover:right-0"
              style={{ background: mode.color }}
            />

            <motion.div
              className="text-5xl mb-3"
              whileHover={{
                scale: 1.2,
                rotate: [0, -15, 15, 0],
                transition: { duration: 0.5 },
              }}
            >
              {mode.icon}
            </motion.div>
            <h3
              className="text-xl font-black mb-0.5 tracking-wide"
              style={{ color: mode.color }}
            >
              {mode.name}
            </h3>
            <p className="text-gray-500 text-xs mb-1">{mode.desc}</p>
            <p
              className="text-[10px] font-bold uppercase tracking-widest opacity-60"
              style={{ color: mode.color }}
            >
              {mode.players}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
