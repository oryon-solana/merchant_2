"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await register(email, password, name);
      router.push("/shop");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4ead5] flex flex-col">
      <header className="border-b border-[#f00] border-opacity-30 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="font-[family-name:var(--font-bebas)] text-3xl uppercase text-[#f00] leading-none">
          gourou
        </Link>
        <Link href="/login" className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#1034b8] border border-[#1034b8] px-3 py-1">
          Sign In
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-[family-name:var(--font-bebas)] text-[4rem] uppercase leading-none text-[#f00] mb-1">
            Register
          </h1>
          <p className="text-[10px] uppercase tracking-[0.1em] text-[#1034b8] mb-8">
            Create an account to order and earn loyalty points
          </p>

          {error && (
            <div className="mb-4 border border-[#f00] bg-[#fff0f0] px-3 py-2 text-[11px] font-bold uppercase text-[#f00]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#1b140e] mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-[#1b140e] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#1034b8]"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#1b140e] mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-[#1b140e] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#1034b8]"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#1b140e] mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full border border-[#1b140e] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#1034b8]"
                placeholder="Min. 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full border border-[#f00] bg-[#f00] px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#fef3d8] disabled:opacity-50"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-[10px] uppercase tracking-[0.1em] text-[#1b140e]">
            Already have an account?{" "}
            <Link href="/login" className="font-extrabold text-[#f00] underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
