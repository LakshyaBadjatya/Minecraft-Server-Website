"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative mt-20 py-12 border-t border-white/[0.05]"
      style={{
        background:
          "linear-gradient(180deg, transparent, rgba(5,5,15,0.95))",
      }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3
              className="text-xl font-black mb-3"
              style={{
                background: "linear-gradient(135deg, #4ade80, #22c55e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              BEDWARS
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              The ultimate Minecraft BedWars experience. PvP, strategy, and team
              play combined.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-3">
              Quick Links
            </h4>
            <div className="space-y-2">
              {[
                { name: "Store", href: "/store" },
                { name: "Leaderboard", href: "/leaderboard" },
                { name: "Login", href: "/login" },
              ].map((link) => (
                <Link key={link.name} href={link.href}>
                  <p className="text-gray-600 hover:text-emerald-400 text-sm transition-colors cursor-pointer">
                    {link.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Server IP */}
          <div>
            <h4 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-3">
              Join Server
            </h4>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="inline-block px-5 py-2.5 glass rounded-md cursor-pointer"
              onClick={() =>
                navigator.clipboard.writeText("play.sukhma.in")
              }
            >
              <span className="text-emerald-400 font-bold tracking-wider text-sm">
                play.sukhma.in
              </span>
            </motion.div>
            <p className="text-gray-700 text-xs mt-2">
              Supports 1.8 - 1.21
            </p>
          </div>
        </div>

        <div className="border-t border-white/[0.04] pt-6 text-center">
          <p className="text-gray-700 text-xs">
            &copy; {new Date().getFullYear()} BedWars Server — play.sukhma.in
            &middot; Not affiliated with Mojang Studios
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
