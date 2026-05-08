"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ButtonHoverLabel } from "../components/ButtonHoverLabel";
import { useAuth } from "../context/AuthContext";

export default function SignUpPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
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
      await register(email, password, fullName);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#f4ead5] px-4 py-8 md:px-6">
      <section className="mx-auto w-full max-w-2xl border-2 border-[#f00] bg-[#fff4de] p-5 md:p-7">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]">Create account</p>
        <h1 className="font-[family-name:var(--font-bebas)] text-[clamp(2.8rem,8vw,5.5rem)] uppercase leading-[0.85] text-[#f00]">
          Sign Up
        </h1>

        {error && (
          <div className="mt-3 border border-[#f00] bg-[#fff0f0] px-3 py-2 text-[11px] font-bold uppercase text-[#f00]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
          <label className="grid gap-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
            Full name
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="border border-[#1034b8] bg-white px-3 py-2 text-sm font-semibold text-[#111] outline-none focus:ring-2 focus:ring-[#1034b8]"
            />
          </label>

          <label className="grid gap-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-[#1034b8] bg-white px-3 py-2 text-sm font-semibold text-[#111] outline-none focus:ring-2 focus:ring-[#1034b8]"
            />
          </label>

          <label className="grid gap-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="border border-[#1034b8] bg-white px-3 py-2 text-sm font-semibold text-[#111] outline-none focus:ring-2 focus:ring-[#1034b8]"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="group mt-1 inline-flex w-fit items-center border border-[#f00] bg-[#f00] px-5 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de] disabled:opacity-50"
          >
            <ButtonHoverLabel label={loading ? "Creating account…" : "Create Account"} />
          </button>
        </form>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 border-t border-[#1b140e] opacity-20" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#1b140e] opacity-50">or</span>
          <div className="flex-1 border-t border-[#1b140e] opacity-20" />
        </div>

        <a
          href="/api/auth/google"
          className="mt-4 flex w-full items-center justify-center gap-3 border-2 border-[#1034b8] px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8] hover:bg-[#1034b8] hover:text-[#fff4de] transition-colors"
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </a>

        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f2937]">
          Already have an account?
        </p>
        <Link
          href="/signin"
          className="group mt-2 inline-flex items-center border border-[#1034b8] px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]"
        >
          <ButtonHoverLabel label="Go to Sign In" />
        </Link>
      </section>
    </main>
  );
}
