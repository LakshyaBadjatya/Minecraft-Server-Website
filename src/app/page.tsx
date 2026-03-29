"use client";

import { motion } from "framer-motion";
import HeroTitle from "@/components/HeroTitle";
import ServerStatus from "@/components/ServerStatus";
import StatsGrid from "@/components/StatsGrid";
import GameModes from "@/components/GameModes";
import Link from "next/link";

const steps = [
  { step: "01", title: "Open Minecraft", desc: "Launch Java Edition (1.8 - 1.21)", icon: "🎮" },
  { step: "02", title: "Add Server", desc: "Go to Multiplayer → Add Server", icon: "➕" },
  { step: "03", title: "Enter IP", desc: "Type play.sukhma.in and join!", icon: "🚀" },
];

export default function Home() {
  return (
    <div className="space-y-24 px-6 py-16">
      <section>
        <HeroTitle />
        <ServerStatus />
      </section>

      <section>
        <StatsGrid />
      </section>

      {/* How to Join */}
      <section className="max-w-4xl mx-auto">
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
            How to Join
          </h2>
          <p className="text-gray-600 text-sm tracking-wider">
            Get started in 3 simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: "spring" }}
              className="relative glass rounded-lg p-8 text-center group"
            >
              {/* Step number */}
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black tracking-widest"
                style={{
                  background: "linear-gradient(135deg, #059669, #047857)",
                  color: "#fff",
                }}
              >
                STEP {s.step}
              </div>

              {/* Connector line */}
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-[2px] bg-gradient-to-r from-emerald-500/50 to-transparent" />
              )}

              <div className="text-5xl mb-4 mt-2">{s.icon}</div>
              <h3 className="text-white font-black text-lg mb-1">
                {s.title}
              </h3>
              <p className="text-gray-500 text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <GameModes />
      </section>

      {/* CTA Section */}
      <section className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative glass rounded-xl p-12 overflow-hidden"
        >
          {/* Background effects */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-emerald-500/10 blur-[60px]" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-[60px]" />
          </div>

          <h2
            className="text-3xl md:text-4xl font-black mb-4 relative z-10"
            style={{
              background: "linear-gradient(180deg, #fff, #ccc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Ready to Play?
          </h2>
          <p className="text-gray-400 mb-8 relative z-10 max-w-md mx-auto">
            Join hundreds of players and compete in the most exciting BedWars
            experience. Upgrade your rank for exclusive perks!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                navigator.clipboard.writeText("play.sukhma.in")
              }
              className="px-8 py-3 rounded-md font-black uppercase tracking-wider text-white"
              style={{
                background: "linear-gradient(135deg, #059669, #047857)",
                boxShadow: "0 0 30px rgba(5,150,105,0.3)",
              }}
            >
              Copy Server IP
            </motion.button>

            <Link href="/store">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-md font-black uppercase tracking-wider text-white glass border border-purple-500/30"
                style={{
                  boxShadow: "0 0 20px rgba(168,85,247,0.15)",
                }}
              >
                View Store
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
