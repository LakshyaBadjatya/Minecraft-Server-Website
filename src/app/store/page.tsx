"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ranks } from "@/lib/ranks";
import { useRouter } from "next/navigation";

export default function StorePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedRank, setSelectedRank] = useState<string | null>(null);
  const [mcUsername, setMcUsername] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState<{
    valid: boolean;
    discountPercent?: number;
    error?: string;
  } | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });
      setCouponStatus(await res.json());
    } catch {
      setCouponStatus({ valid: false, error: "Failed to validate" });
    }
  };

  const handlePurchase = async (rankId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    setPurchasing(true);
    try {
      const res = await fetch("/api/store/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rankId,
          couponCode: couponStatus?.valid ? couponCode : undefined,
          minecraftUsername: mcUsername.trim() || undefined,
        }),
      });
      const data = await res.json();
      setPurchaseResult({ success: res.ok && data.applied, message: data.message || data.error });
      setSelectedRank(null);
      setMcUsername("");
    } catch {
      setPurchaseResult({ success: false, message: "Something went wrong" });
    } finally {
      setPurchasing(false);
    }
  };

  const getDiscountedPrice = (price: number) => {
    if (couponStatus?.valid && couponStatus.discountPercent) {
      return price - (price * couponStatus.discountPercent) / 100;
    }
    return price;
  };

  return (
    <div className="px-6 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="text-5xl mb-4"
        >
          👑
        </motion.div>
        <h1
          className="text-4xl md:text-6xl font-black uppercase tracking-[0.15em] mb-3"
          style={{
            background: "linear-gradient(180deg, #e9d5ff, #a855f7, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 20px rgba(168,85,247,0.3))",
          }}
        >
          Server Store
        </h1>
        <p className="text-gray-500 tracking-wider text-sm max-w-md mx-auto">
          Purchase ranks to unlock exclusive in-game perks, cosmetics, and more
        </p>
        <div className="relative mt-4 flex items-center justify-center gap-2">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="h-[2px] w-24"
            style={{ background: "linear-gradient(90deg, transparent, #a855f7)" }}
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 45 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="w-2 h-2 bg-purple-500"
            style={{ boxShadow: "0 0 10px #a855f7" }}
          />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="h-[2px] w-24"
            style={{ background: "linear-gradient(90deg, #a855f7, transparent)" }}
          />
        </div>
      </motion.div>

      {/* Coupon Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-md mx-auto mb-14"
      >
        <div className="glass rounded-lg p-5">
          <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-3 font-bold text-center">
            🎫 Have a Coupon Code?
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                setCouponStatus(null);
              }}
              placeholder="ENTER CODE"
              className="flex-1 px-4 py-2.5 bg-black/40 border border-white/10 rounded-md text-white text-center font-bold tracking-widest focus:border-purple-500 focus:outline-none transition-colors uppercase text-sm"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={validateCoupon}
              className="px-5 py-2.5 rounded-md text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
            >
              Apply
            </motion.button>
          </div>
          <AnimatePresence>
            {couponStatus && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-center text-sm mt-3 font-bold ${
                  couponStatus.valid ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {couponStatus.valid
                  ? `✓ ${couponStatus.discountPercent}% discount applied!`
                  : couponStatus.error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Purchase result banner */}
      <AnimatePresence>
        {purchaseResult && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className={`max-w-2xl mx-auto mb-10 p-5 rounded-lg text-center font-bold glass ${
              purchaseResult.success
                ? "border border-emerald-500/30 text-emerald-400"
                : "border border-red-500/30 text-red-400"
            }`}
          >
            <span className="mr-2">{purchaseResult.success ? "✅" : "⚠️"}</span>
            {purchaseResult.message}
            <button
              onClick={() => setPurchaseResult(null)}
              className="ml-4 text-gray-600 hover:text-white transition-colors"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rank Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ranks.map((rank, i) => {
          const discountedPrice = getDiscountedPrice(rank.price);
          const hasDiscount = discountedPrice < rank.price;

          return (
            <motion.div
              key={rank.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, type: "spring", stiffness: 100 }}
              whileHover={{
                y: -12,
                transition: { type: "spring", stiffness: 300 },
              }}
              className={`relative glass rounded-lg overflow-hidden group ${
                rank.popular ? "md:scale-[1.03] md:z-10" : ""
              }`}
              style={{
                boxShadow: `0 0 40px ${rank.glowColor}`,
              }}
            >
              {/* Animated top border */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: rank.color }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
              />

              {rank.popular && (
                <motion.div
                  initial={{ y: -30 }}
                  animate={{ y: 0 }}
                  className="py-2 text-center text-xs font-black uppercase tracking-[0.3em] text-white"
                  style={{
                    background: `linear-gradient(90deg, ${rank.borderColor}90, ${rank.color}90)`,
                  }}
                >
                  ⭐ Most Popular
                </motion.div>
              )}

              <div className={`p-7 ${rank.popular ? "" : "pt-8"}`}>
                {/* Rank icon & name */}
                <div className="text-center mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    className="inline-block text-4xl mb-3"
                  >
                    {rank.id.includes("mvp") ? "💎" : "✨"}
                  </motion.div>
                  <h3
                    className="text-3xl font-black mb-1"
                    style={{
                      color: rank.color,
                      textShadow: `0 0 20px ${rank.glowColor}`,
                    }}
                  >
                    {rank.name}
                  </h3>
                  <p className="text-gray-600 text-xs font-mono">
                    {rank.prefix}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-7 relative">
                  <div
                    className="absolute inset-0 rounded-lg opacity-20"
                    style={{
                      background: `radial-gradient(circle, ${rank.color}20, transparent 70%)`,
                    }}
                  />
                  {hasDiscount && (
                    <span className="text-gray-600 line-through text-lg mr-2 relative z-10">
                      ${rank.price.toFixed(2)}
                    </span>
                  )}
                  <span
                    className="text-4xl font-black relative z-10"
                    style={{ color: hasDiscount ? "#4ade80" : rank.color }}
                  >
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-gray-500 text-sm ml-1 relative z-10">
                    USD
                  </span>
                  {hasDiscount && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="block text-emerald-400 text-xs font-bold mt-1 relative z-10"
                    >
                      Save ${(rank.price - discountedPrice).toFixed(2)}!
                    </motion.span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-7">
                  {rank.features.map((feature, fi) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + fi * 0.03 }}
                      className="flex items-start gap-2.5 text-sm text-gray-300"
                    >
                      <span
                        className="mt-0.5 text-xs"
                        style={{ color: rank.color }}
                      >
                        ◆
                      </span>
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                {/* Buy button */}
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedRank(rank.id)}
                  disabled={purchasing}
                  className="w-full py-3.5 rounded-md font-black uppercase tracking-[0.15em] text-white relative overflow-hidden group/btn"
                  style={{
                    background: `linear-gradient(135deg, ${rank.borderColor}90, ${rank.borderColor}60)`,
                    boxShadow: `0 0 25px ${rank.glowColor}`,
                  }}
                >
                  {/* Shine effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                      animation: "shimmer 2s linear infinite",
                      backgroundSize: "200% auto",
                    }}
                  />
                  <span className="relative z-10">Buy Now</span>
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Purchase Modal */}
      <AnimatePresence>
        {selectedRank && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
            onClick={() => { setSelectedRank(null); setMcUsername(""); }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass rounded-xl p-8 relative overflow-hidden"
              style={{
                boxShadow: "0 0 60px rgba(0,0,0,0.5)",
              }}
            >
              {(() => {
                const rank = ranks.find((r) => r.id === selectedRank)!;
                const discountedPrice = getDiscountedPrice(rank.price);
                return (
                  <>
                    {/* Top accent */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ background: rank.color }}
                    />

                    <h3
                      className="text-2xl font-black text-center mb-1"
                      style={{ color: rank.color }}
                    >
                      Purchase {rank.name}
                    </h3>
                    <p className="text-gray-600 text-xs text-center mb-6">
                      Rank will be applied automatically
                    </p>

                    {/* Minecraft username input */}
                    <div className="mb-6">
                      <label className="block text-gray-400 text-xs uppercase tracking-[0.2em] mb-2 font-bold">
                        Minecraft In-Game Name
                      </label>
                      <div className="flex items-center gap-3">
                        <motion.div
                          key={mcUsername}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="w-12 h-12 rounded-md overflow-hidden border border-white/10 flex-shrink-0 bg-black/40"
                        >
                          {(mcUsername || user?.minecraftUsername) && (
                            <img
                              src={`https://mc-heads.net/avatar/${mcUsername || user?.minecraftUsername}/48`}
                              alt=""
                              className="w-full h-full"
                              style={{ imageRendering: "pixelated" }}
                            />
                          )}
                        </motion.div>
                        <input
                          type="text"
                          value={mcUsername}
                          onChange={(e) => setMcUsername(e.target.value)}
                          placeholder={
                            user?.minecraftUsername || "Enter your username"
                          }
                          className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-md text-white font-bold focus:border-emerald-500 focus:outline-none transition-colors"
                          maxLength={16}
                        />
                      </div>
                      <p className="text-gray-600 text-[11px] mt-2 flex items-center gap-1">
                        <span className="text-emerald-500">⚡</span>
                        Rank applies instantly after purchase
                      </p>
                    </div>

                    {/* Price display */}
                    <div className="text-center py-4 mb-6 rounded-md bg-black/30 border border-white/5">
                      <span className="text-3xl font-black text-white">
                        ${discountedPrice.toFixed(2)}
                      </span>
                      {couponStatus?.valid && (
                        <span className="text-emerald-400 text-xs font-bold ml-2">
                          ({couponStatus.discountPercent}% off)
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setSelectedRank(null);
                          setMcUsername("");
                        }}
                        className="flex-1 py-3 rounded-md glass text-gray-400 font-bold uppercase tracking-wider text-sm"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handlePurchase(selectedRank)}
                        disabled={
                          purchasing ||
                          (!mcUsername.trim() && !user?.minecraftUsername)
                        }
                        className="flex-1 py-3 rounded-md font-bold uppercase tracking-wider text-sm text-white disabled:opacity-40 relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${rank.borderColor}, ${rank.borderColor}90)`,
                          boxShadow: `0 0 20px ${rank.glowColor}`,
                        }}
                      >
                        {purchasing ? (
                          <span className="flex items-center justify-center gap-2">
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            Applying...
                          </span>
                        ) : (
                          "Purchase & Apply"
                        )}
                      </motion.button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
