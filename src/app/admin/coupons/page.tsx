"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

interface Coupon {
  id: number;
  code: string;
  discount_percent: number;
  max_uses: number;
  uses: number;
  expires_at: string | null;
  created_at: string;
}

interface Purchase {
  id: number;
  minecraft_username: string;
  rank_id: string;
  price: number;
  status: string;
  created_at: string;
}

const RANK_NAMES: Record<string, string> = {
  vip: "VIP",
  vip_plus: "VIP+",
  mvp: "MVP",
  mvp_plus: "MVP+",
  mvp_plus_plus: "MVP++",
};

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [form, setForm] = useState({
    customCode: "",
    discountPercent: 10,
    maxUses: 1,
    expiresInDays: 30,
  });
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetch("/api/coupons");
      if (res.ok) setCoupons(await res.json());
    } catch { /* ignore */ }
  }, []);

  const fetchPurchases = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pending-ranks");
      if (res.ok) setPurchases(await res.json());
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      router.push("/");
      return;
    }
    if (user?.isAdmin) {
      fetchCoupons();
      fetchPurchases();
    }
  }, [user, authLoading, router, fetchCoupons, fetchPurchases]);

  const generateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setMessage("");
    try {
      const res = await fetch("/api/coupons/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Coupon created: ${data.coupon.code}`);
        setForm({ ...form, customCode: "" });
        fetchCoupons();
      } else {
        setMessage(data.error);
      }
    } catch {
      setMessage("Failed to create coupon");
    } finally {
      setGenerating(false);
    }
  };

  const deleteCoupon = async (id: number) => {
    await fetch(`/api/coupons?id=${id}`, { method: "DELETE" });
    fetchCoupons();
  };

  const copyCommand = (purchase: Purchase) => {
    const group = RANK_NAMES[purchase.rank_id] || purchase.rank_id;
    const cmd = `lp user ${purchase.minecraft_username} parent add ${group}`;
    navigator.clipboard.writeText(cmd);
    setCopiedId(purchase.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const markApplied = async (id: number) => {
    await fetch("/api/admin/pending-ranks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchPurchases();
  };

  if (authLoading || !user?.isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  const pendingPurchases = purchases.filter((p) => p.status === "pending");

  return (
    <div className="px-6 py-12 max-w-5xl mx-auto space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-black text-center text-amber-400 uppercase tracking-widest"
      >
        Admin Panel
      </motion.h1>

      {/* Pending Rank Purchases */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-lg overflow-hidden"
      >
        <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            Pending Ranks
            {pendingPurchases.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full font-bold">
                {pendingPurchases.length}
              </span>
            )}
          </h2>
          <p className="text-gray-600 text-xs">
            Copy command → paste in server console
          </p>
        </div>

        {pendingPurchases.length === 0 ? (
          <div className="py-10 text-center text-gray-600 text-sm">
            No pending rank purchases
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {pendingPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="px-5 py-3 flex items-center justify-between hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`https://mc-heads.net/avatar/${purchase.minecraft_username}/28`}
                    alt=""
                    className="w-7 h-7 rounded-sm"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <div>
                    <span className="text-white font-bold text-sm">
                      {purchase.minecraft_username}
                    </span>
                    <span className="text-gray-600 mx-2">→</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      {RANK_NAMES[purchase.rank_id] || purchase.rank_id}
                    </span>
                    <span className="text-gray-600 text-xs ml-2">
                      ${purchase.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyCommand(purchase)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                      copiedId === purchase.id
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
                    }`}
                  >
                    {copiedId === purchase.id ? "Copied!" : "Copy Command"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => markApplied(purchase.id)}
                    className="px-3 py-1.5 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                  >
                    Mark Applied
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Generate Coupon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-lg p-6"
      >
        <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">
          Generate Coupon
        </h2>

        <form
          onSubmit={generateCoupon}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1 font-bold">
              Custom Code
            </label>
            <input
              type="text"
              value={form.customCode}
              onChange={(e) =>
                setForm({ ...form, customCode: e.target.value.toUpperCase() })
              }
              placeholder="AUTO"
              className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-md text-white focus:border-amber-500 focus:outline-none uppercase font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1 font-bold">
              Discount %
            </label>
            <input
              type="number"
              value={form.discountPercent}
              onChange={(e) =>
                setForm({ ...form, discountPercent: parseInt(e.target.value) || 0 })
              }
              min={1}
              max={100}
              className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-md text-white focus:border-amber-500 focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1 font-bold">
              Max Uses
            </label>
            <input
              type="number"
              value={form.maxUses}
              onChange={(e) =>
                setForm({ ...form, maxUses: parseInt(e.target.value) || 1 })
              }
              min={1}
              className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-md text-white focus:border-amber-500 focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1 font-bold">
              Expires (days)
            </label>
            <input
              type="number"
              value={form.expiresInDays}
              onChange={(e) =>
                setForm({ ...form, expiresInDays: parseInt(e.target.value) || 30 })
              }
              min={1}
              className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-md text-white focus:border-amber-500 focus:outline-none text-sm"
              required
            />
          </div>
          <div className="col-span-2 md:col-span-4">
            <motion.button
              type="submit"
              disabled={generating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-md text-white font-bold uppercase tracking-widest disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #d97706, #b45309)" }}
            >
              {generating ? "Generating..." : "Generate Coupon"}
            </motion.button>
          </div>
        </form>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-emerald-400 mt-4 font-bold text-sm"
          >
            {message}
          </motion.p>
        )}
      </motion.div>

      {/* Coupons List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-lg overflow-hidden"
      >
        <div className="px-5 py-3 border-b border-white/[0.06]">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            Coupons ({coupons.length})
          </h2>
        </div>

        {coupons.length === 0 ? (
          <div className="py-10 text-center text-gray-600 text-sm">
            No coupons created yet
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="px-5 py-3 flex items-center justify-between hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20 text-sm">
                    {coupon.code}
                  </span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {coupon.discount_percent}% off
                  </span>
                  <span className="text-gray-500 text-xs">
                    {coupon.uses}/{coupon.max_uses} used
                  </span>
                  {coupon.expires_at && (
                    <span className="text-gray-600 text-xs">
                      Exp: {new Date(coupon.expires_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteCoupon(coupon.id)}
                  className="text-red-500/70 hover:text-red-400 font-bold text-xs px-3 py-1 rounded-md hover:bg-red-500/10 transition-colors"
                >
                  Delete
                </motion.button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
