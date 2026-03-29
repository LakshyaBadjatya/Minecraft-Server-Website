"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    minecraftUsername: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { refresh } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }

      await refresh();
      router.push("/");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "username", label: "Username", type: "text" },
    { key: "minecraftUsername", label: "Minecraft Username", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "password", label: "Password", type: "password" },
    { key: "confirmPassword", label: "Confirm Password", type: "password" },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div
          className="border-4 rounded-md p-8"
          style={{
            borderColor: "#3a3a3a",
            background:
              "linear-gradient(180deg, rgba(20,20,35,0.95), rgba(10,10,20,0.98))",
            boxShadow: "0 0 40px rgba(0,0,0,0.8)",
          }}
        >
          <h1
            className="text-3xl font-black text-center mb-8 uppercase tracking-widest"
            style={{
              background: "linear-gradient(to bottom, #55FF55, #00AA00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Register
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-1.5 font-bold">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-black/60 border-2 border-gray-700 rounded-md text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            ))}

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/30 rounded-md py-2"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-md border-2 font-bold uppercase tracking-widest text-white disabled:opacity-50"
              style={{
                background: "linear-gradient(180deg, #2d8a4e, #1a6b35)",
                borderColor: "#4ade80",
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </motion.button>
          </form>

          <p className="text-center text-gray-500 mt-6 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-emerald-400 hover:text-emerald-300 font-bold"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
