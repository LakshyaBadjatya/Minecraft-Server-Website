"use client";

import { motion } from "framer-motion";

export default function HeroTitle() {
  return (
    <div className="text-center mb-12 relative">
      {/* Background glow behind title */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] rounded-full bg-red-500/10 blur-[80px]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.3, rotateX: 90 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 15, duration: 1 }}
        className="mb-2"
      >
        {/* Decorative swords */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="text-4xl mb-4"
        >
          ⚔️
        </motion.div>

        <h1 className="text-7xl md:text-9xl font-black leading-none tracking-tighter">
          <motion.span
            className="inline-block"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 150 }}
            style={{
              background: "linear-gradient(180deg, #FF6B6B 0%, #FF0000 50%, #AA0000 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 30px rgba(255,0,0,0.4)) drop-shadow(0 4px 0 rgba(0,0,0,0.5))",
            }}
          >
            BED
          </motion.span>
          <motion.span
            className="inline-block ml-4"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 150 }}
            style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, #CCCCCC 50%, #888888 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 20px rgba(255,255,255,0.2)) drop-shadow(0 4px 0 rgba(0,0,0,0.5))",
            }}
          >
            WARS
          </motion.span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-lg md:text-xl tracking-[0.3em] uppercase font-bold"
        style={{
          background: "linear-gradient(90deg, #888, #fff, #888)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "shimmer 3s linear infinite",
        }}
      >
        The Ultimate Bedwars Experience
      </motion.p>

      {/* Animated divider */}
      <div className="relative mt-6 flex items-center justify-center gap-2">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="h-[2px] w-32"
          style={{
            background: "linear-gradient(90deg, transparent, #4ade80)",
          }}
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 45 }}
          transition={{ delay: 1, type: "spring" }}
          className="w-2 h-2 bg-emerald-400"
          style={{ boxShadow: "0 0 10px #4ade80" }}
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="h-[2px] w-32"
          style={{
            background: "linear-gradient(90deg, #4ade80, transparent)",
          }}
        />
      </div>
    </div>
  );
}
