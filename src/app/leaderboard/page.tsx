"use client";

import { motion } from "framer-motion";
import LeaderboardTable from "@/components/LeaderboardTable";

export default function LeaderboardPage() {
  return (
    <div className="px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="text-5xl mb-4"
        >
          🏆
        </motion.div>
        <h1
          className="text-4xl md:text-6xl font-black uppercase tracking-[0.15em] mb-3"
          style={{
            background: "linear-gradient(180deg, #fef3c7, #f59e0b, #d97706)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 20px rgba(245,158,11,0.3))",
          }}
        >
          Leaderboard
        </h1>
        <p className="text-gray-500 tracking-wider text-sm">
          Top players on play.sukhma.in
        </p>
        <div className="relative mt-4 flex items-center justify-center gap-2">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="h-[2px] w-24"
            style={{ background: "linear-gradient(90deg, transparent, #f59e0b)" }}
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 45 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="w-2 h-2 bg-amber-500"
            style={{ boxShadow: "0 0 10px #f59e0b" }}
          />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="h-[2px] w-24"
            style={{ background: "linear-gradient(90deg, #f59e0b, transparent)" }}
          />
        </div>
      </motion.div>

      <LeaderboardTable />
    </div>
  );
}
