"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Status {
  online: boolean;
  players: { online: number; max: number };
  version: string;
  latency: number;
}

export default function ServerStatus() {
  const [status, setStatus] = useState<Status | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/server-status");
        setStatus(await res.json());
      } catch {
        setStatus({
          online: false,
          players: { online: 0, max: 0 },
          version: "1.8.8",
          latency: 0,
        });
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const copyIP = () => {
    navigator.clipboard.writeText("play.sukhma.in");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
      className="relative mx-auto max-w-2xl"
    >
      {/* Outer glow */}
      <div
        className="absolute -inset-1 rounded-lg opacity-30 blur-xl"
        style={{
          background: status?.online
            ? "linear-gradient(135deg, #4ade80, #22d3ee)"
            : "linear-gradient(135deg, #ef4444, #f97316)",
        }}
      />

      <div className="relative glass rounded-lg p-8 mc-grid-bg overflow-hidden">
        {/* Animated border gradient */}
        <div
          className="absolute inset-0 rounded-lg p-[1px]"
          style={{
            background: "linear-gradient(135deg, rgba(74,222,128,0.3), transparent, rgba(34,211,238,0.3))",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
          }}
        />

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <motion.div
              className={`w-3 h-3 rounded-full ${
                status?.online ? "bg-emerald-400" : "bg-red-500"
              }`}
            />
            {status?.online && (
              <motion.div
                className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-400"
                animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
          <span
            className={`text-sm font-black uppercase tracking-[0.3em] ${
              status?.online ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {status?.online ? "Server Online" : "Server Offline"}
          </span>
        </div>

        {/* Player count - big display */}
        <div className="text-center mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={status?.players.online}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative inline-block"
            >
              <span
                className="text-6xl md:text-7xl font-black text-white"
                style={{
                  textShadow:
                    "0 0 40px rgba(74,222,128,0.4), 0 0 80px rgba(74,222,128,0.2)",
                }}
              >
                {status?.players.online ?? "—"}
              </span>
              <span className="text-2xl text-gray-600 font-bold ml-1">
                /{status?.players.max ?? "—"}
              </span>
            </motion.div>
          </AnimatePresence>
          <p className="text-gray-500 text-xs uppercase tracking-[0.4em] mt-2 font-bold">
            Players Online
          </p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Version", value: "1.8 - 1.21", color: "#fbbf24" },
            {
              label: "Latency",
              value: status?.latency ? `${status.latency}ms` : "—",
              color: "#4ade80",
            },
            { label: "Mode", value: "BedWars", color: "#c084fc" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-white/[0.03] border border-white/[0.06] rounded-md p-3 text-center"
            >
              <p className="text-gray-600 text-[10px] uppercase tracking-[0.2em] mb-1 font-bold">
                {item.label}
              </p>
              <p className="font-black text-sm" style={{ color: item.color }}>
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Copy IP button */}
        <motion.button
          onClick={copyIP}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-md font-black text-lg uppercase tracking-[0.2em] relative overflow-hidden group"
          style={{
            background: "linear-gradient(135deg, #059669, #047857)",
            boxShadow:
              "0 0 30px rgba(4,120,87,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {/* Hover shine effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
              animation: "shimmer 2s linear infinite",
              backgroundSize: "200% auto",
            }}
          />

          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="copied"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                className="block text-emerald-200 relative z-10"
              >
                ✓ Copied to Clipboard!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                className="block text-white relative z-10"
              >
                play.sukhma.in — Click to Copy
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
