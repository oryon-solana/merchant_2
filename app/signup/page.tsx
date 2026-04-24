"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("New Member");
  const [email, setEmail] = useState("new@example.com");
  const [password, setPassword] = useState("");

  return (
    <main className="min-h-screen w-full bg-[#f4ead5] px-4 py-8 md:px-6">
      <section className="mx-auto w-full max-w-2xl border-2 border-[#f00] bg-[#fff4de] p-5 md:p-7">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]">Create account</p>
        <h1 className="font-[family-name:var(--font-bebas)] text-[clamp(2.8rem,8vw,5.5rem)] uppercase leading-[0.85] text-[#f00]">
          Sign Up
        </h1>

        <form className="mt-4 grid gap-3">
          <label className="grid gap-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
            Full name
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="border border-[#1034b8] bg-white px-3 py-2 text-sm font-semibold text-[#111] outline-none focus:ring-2 focus:ring-[#1034b8]"
            />
          </label>

          <label className="grid gap-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="border border-[#1034b8] bg-white px-3 py-2 text-sm font-semibold text-[#111] outline-none focus:ring-2 focus:ring-[#1034b8]"
            />
          </label>

          <label className="grid gap-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="border border-[#1034b8] bg-white px-3 py-2 text-sm font-semibold text-[#111] outline-none focus:ring-2 focus:ring-[#1034b8]"
            />
          </label>

          <button
            type="button"
            className="mt-1 w-fit border border-[#f00] bg-[#f00] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de]"
          >
            Create Account (dummy)
          </button>
        </form>

        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f2937]">
          Already have an account?
        </p>
        <Link
          href="/signin"
          className="mt-2 inline-block border border-[#1034b8] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]"
        >
          Go to Sign In
        </Link>
      </section>
    </main>
  );
}
