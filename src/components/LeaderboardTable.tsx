"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Player {
  name: string;
  uuid: string;
  wins: number;
  kills: number;
  final_kills: number;
  deaths: number;
  final_deaths: number;
  beds_destroyed: number;
  games_played: number;
  level: number;
  winstreak: number;
  best_streak: number;
}

const sortOptions = [
  { value: "wins", label: "Wins" },
  { value: "kills", label: "Kills" },
  { value: "final_kills", label: "Final Kills" },
  { value: "beds_destroyed", label: "Beds Broken" },
  { value: "games_played", label: "Games Played" },
];

function getRankColor(index: number): string {
  if (index === 0) return "#FFD700";
  if (index === 1) return "#C0C0C0";
  if (index === 2) return "#CD7F32";
  return "#6b7280";
}

function getRankGlow(index: number): string {
  if (index === 0) return "0 0 20px rgba(255,215,0,0.4)";
  if (index === 1) return "0 0 15px rgba(192,192,192,0.3)";
  if (index === 2) return "0 0 15px rgba(205,127,50,0.3)";
  return "none";
}

function getLevelColor(level: number): string {
  if (level >= 1000) return "#FF5555";
  if (level >= 900) return "#AA00AA";
  if (level >= 800) return "#5555FF";
  if (level >= 700) return "#FF55FF";
  if (level >= 600) return "#AA0000";
  if (level >= 500) return "#00AAAA";
  if (level >= 400) return "#00AA00";
  if (level >= 300) return "#55FFFF";
  if (level >= 200) return "#FFAA00";
  if (level >= 100) return "#FFFFFF";
  return "#AAAAAA";
}

function getKdr(kills: number, deaths: number): string {
  if (deaths === 0) return kills > 0 ? kills.toFixed(1) : "0.0";
  return (kills / deaths).toFixed(2);
}

export default function LeaderboardTable() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [sortBy, setSortBy] = useState("wins");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?sort=${sortBy}&limit=20`)
      .then((r) => r.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sortBy]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Sort tabs */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {sortOptions.map((opt) => (
          <motion.button
            key={opt.value}
            onClick={() => setSortBy(opt.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2 rounded-md border-2 font-bold text-sm uppercase tracking-wider transition-all ${
              sortBy === opt.value
                ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                : "border-gray-700 bg-black/40 text-gray-500 hover:border-gray-500"
            }`}
          >
            {opt.label}
          </motion.button>
        ))}
      </div>

      {/* Table */}
      <div
        className="border-2 rounded-md overflow-hidden"
        style={{
          borderColor: "#3a3a3a",
          background: "rgba(10,10,20,0.95)",
        }}
      >
        {/* Header */}
        <div
          className="grid grid-cols-[60px_1fr_80px_80px_90px_80px_70px] gap-2 px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold border-b-2"
          style={{
            borderColor: "#3a3a3a",
            background: "rgba(20,20,35,0.9)",
          }}
        >
          <div className="text-center">#</div>
          <div>Player</div>
          <div className="text-center">Wins</div>
          <div className="text-center">Kills</div>
          <div className="text-center">Finals</div>
          <div className="text-center">Beds</div>
          <div className="text-center">KDR</div>
        </div>

        {/* Rows */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center text-gray-500"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"
              />
            </motion.div>
          ) : (
            <motion.div
              key={sortBy}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {players.map((player, i) => (
                <motion.div
                  key={player.uuid}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{
                    backgroundColor: "rgba(74,222,128,0.05)",
                  }}
                  className="grid grid-cols-[60px_1fr_80px_80px_90px_80px_70px] gap-2 px-4 py-3 border-b border-gray-800/50 items-center group cursor-default"
                >
                  {/* Rank */}
                  <div className="text-center">
                    <motion.span
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md font-black text-sm"
                      style={{
                        color: getRankColor(i),
                        backgroundColor:
                          i < 3
                            ? `${getRankColor(i)}15`
                            : "transparent",
                        boxShadow: getRankGlow(i),
                      }}
                    >
                      {i + 1}
                    </motion.span>
                  </div>

                  {/* Player */}
                  <div className="flex items-center gap-3">
                    <motion.img
                      src={`https://mc-heads.net/avatar/${player.uuid}/32`}
                      alt={player.name}
                      width={32}
                      height={32}
                      className="rounded-md border border-gray-700"
                      style={{ imageRendering: "pixelated" }}
                      whileHover={{ scale: 1.2 }}
                    />
                    <div>
                      <span className="text-white font-bold text-sm group-hover:text-emerald-400 transition-colors">
                        {player.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <span
                          className="text-xs font-bold"
                          style={{ color: getLevelColor(player.level) }}
                        >
                          [{player.level}✫]
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-center text-emerald-400 font-bold text-sm">
                    {player.wins.toLocaleString()}
                  </div>
                  <div className="text-center text-red-400 font-bold text-sm">
                    {player.kills.toLocaleString()}
                  </div>
                  <div className="text-center text-amber-400 font-bold text-sm">
                    {player.final_kills.toLocaleString()}
                  </div>
                  <div className="text-center text-orange-400 font-bold text-sm">
                    {player.beds_destroyed.toLocaleString()}
                  </div>
                  <div className="text-center text-blue-400 font-bold text-sm">
                    {getKdr(player.kills, player.deaths)}
                  </div>
                </motion.div>
              ))}

              {players.length === 0 && (
                <div className="py-16 text-center text-gray-600">
                  No players found
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
