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

export default function AdminCouponsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState({
    customCode: "",
    discountPercent: 10,
    maxUses: 1,
    expiresInDays: 30,
  });
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetch("/api/coupons");
      if (res.ok) setCoupons(await res.json());
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      router.push("/");
      return;
    }
    if (user?.isAdmin) fetchCoupons();
  }, [user, authLoading, router, fetchCoupons]);

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

  if (authLoading || !user?.isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-black text-center mb-8 text-amber-400 uppercase tracking-widest"
      >
        Coupon Manager
      </motion.h1>

      {/* Generate Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-2 rounded-sm p-6 mb-8"
        style={{
          borderColor: "#3a3a3a",
          background: "rgba(20,20,35,0.95)",
        }}
      >
        <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">
          Generate New Coupon
        </h2>

        <form
          onSubmit={generateCoupon}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1 font-bold">
              Custom Code (optional)
            </label>
            <input
              type="text"
              value={form.customCode}
              onChange={(e) =>
                setForm({ ...form, customCode: e.target.value.toUpperCase() })
              }
              placeholder="AUTO"
              className="w-full px-3 py-2.5 bg-black/60 border-2 border-gray-700 rounded-sm text-white focus:border-amber-500 focus:outline-none uppercase font-mono text-sm"
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
                setForm({
                  ...form,
                  discountPercent: parseInt(e.target.value) || 0,
                })
              }
              min={1}
              max={100}
              className="w-full px-3 py-2.5 bg-black/60 border-2 border-gray-700 rounded-sm text-white focus:border-amber-500 focus:outline-none text-sm"
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
              className="w-full px-3 py-2.5 bg-black/60 border-2 border-gray-700 rounded-sm text-white focus:border-amber-500 focus:outline-none text-sm"
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
                setForm({
                  ...form,
                  expiresInDays: parseInt(e.target.value) || 30,
                })
              }
              min={1}
              className="w-full px-3 py-2.5 bg-black/60 border-2 border-gray-700 rounded-sm text-white focus:border-amber-500 focus:outline-none text-sm"
              required
            />
          </div>
          <div className="col-span-2 md:col-span-4">
            <motion.button
              type="submit"
              disabled={generating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-amber-600 border-2 border-amber-400 rounded-sm text-white font-bold uppercase tracking-widest disabled:opacity-50"
            >
              {generating ? "Generating..." : "Generate Coupon"}
            </motion.button>
          </div>
        </form>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-emerald-400 mt-4 font-bold"
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
        className="border-2 rounded-sm overflow-hidden"
        style={{
          borderColor: "#3a3a3a",
          background: "rgba(10,10,20,0.95)",
        }}
      >
        <div className="px-4 py-3 border-b-2 border-[#3a3a3a] bg-[rgba(20,20,35,0.9)]">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            Active Coupons ({coupons.length})
          </h2>
        </div>

        {coupons.length === 0 ? (
          <div className="py-12 text-center text-gray-600">
            No coupons created yet
          </div>
        ) : (
          <div className="divide-y divide-gray-800/50">
            {coupons.map((coupon) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 py-3 flex items-center justify-between hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-sm border border-amber-500/20">
                    {coupon.code}
                  </span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {coupon.discount_percent}% off
                  </span>
                  <span className="text-gray-500 text-sm">
                    {coupon.uses}/{coupon.max_uses} used
                  </span>
                  {coupon.expires_at && (
                    <span className="text-gray-600 text-xs">
                      Expires:{" "}
                      {new Date(coupon.expires_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteCoupon(coupon.id)}
                  className="text-red-500 hover:text-red-400 font-bold text-sm px-3 py-1 border border-red-500/20 rounded-sm hover:bg-red-500/10"
                >
                  Delete
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
