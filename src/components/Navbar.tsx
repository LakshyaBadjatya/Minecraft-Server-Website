"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Store", href: "/store" },
  { name: "Leaderboard", href: "/leaderboard" },
];

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { user, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/">
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-10 h-10 rounded-md flex items-center justify-center relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #059669, #047857)",
                boxShadow: "0 0 20px rgba(5,150,105,0.3)",
              }}
            >
              <span className="text-white font-black text-xl relative z-10">
                B
              </span>
              <motion.div
                className="absolute inset-0 bg-white/10"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />
            </motion.div>
            <span
              className="text-xl font-black tracking-wider hidden sm:inline"
              style={{
                background: "linear-gradient(135deg, #4ade80, #22c55e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              BEDWARS
            </span>
          </motion.div>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item, i) => (
            <Link key={item.name} href={item.href}>
              <motion.div
                className="relative px-4 py-2 cursor-pointer rounded-md"
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
                whileTap={{ scale: 0.95 }}
              >
                {hoveredIndex === i && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 rounded-md bg-white/[0.06]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 text-gray-300 hover:text-white font-bold text-sm uppercase tracking-widest transition-colors">
                  {item.name}
                </span>
              </motion.div>
            </Link>
          ))}

          {user?.isAdmin && (
            <Link href="/admin/coupons">
              <motion.div className="relative px-4 py-2 cursor-pointer" whileTap={{ scale: 0.95 }}>
                <span className="text-amber-400 font-bold text-sm uppercase tracking-widest">
                  Admin
                </span>
              </motion.div>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2 ml-3">
              <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-md">
                <img
                  src={`https://mc-heads.net/avatar/${user.minecraftUsername}/20`}
                  alt=""
                  className="w-5 h-5 rounded-sm"
                  style={{ imageRendering: "pixelated" }}
                />
                <span className="text-emerald-400 text-sm font-bold">
                  {user.username}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="px-3 py-1.5 rounded-md text-red-400/70 hover:text-red-400 text-sm font-bold hover:bg-red-500/10 transition-colors"
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <Link href="/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-3 px-5 py-2 rounded-md cursor-pointer relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, #059669, #047857)",
                  boxShadow: "0 0 20px rgba(5,150,105,0.2)",
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
                <span className="text-white font-bold text-sm uppercase tracking-wider relative z-10">
                  Login
                </span>
              </motion.div>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
