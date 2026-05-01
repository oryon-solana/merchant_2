"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonHoverLabel } from "../components/ButtonHoverLabel";
import { setLoggedIn } from "../lib/auth";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("");

  return (
    <main className="min-h-screen w-full bg-[#f4ead5] px-4 py-8 md:px-6">
      <section className="mx-auto w-full max-w-2xl border-2 border-[#f00] bg-[#fff4de] p-5 md:p-7">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]">Account access</p>
        <h1 className="font-[family-name:var(--font-bebas)] text-[clamp(2.8rem,8vw,5.5rem)] uppercase leading-[0.85] text-[#f00]">
          Sign In
        </h1>

        <form className="mt-4 grid gap-3">
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
            onClick={() => {
              setLoggedIn(true);
              router.push("/");
            }}
            className="group mt-1 inline-flex w-fit items-center border border-[#f00] bg-[#f00] px-5 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de]"
          >
            <ButtonHoverLabel label="Sign In (dummy)" />
          </button>
        </form>

        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f2937]">
          Don&apos;t have an account?
        </p>
        <Link
          href="/signup"
          className="group mt-2 inline-flex items-center border border-[#1034b8] px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]"
        >
          <ButtonHoverLabel label="Go to Sign Up" />
        </Link>
      </section>
    </main>
  );
}
