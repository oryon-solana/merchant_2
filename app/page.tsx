"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";

const tiles = [
  {
    label: "Pumpkin Pakora",
    title: "Pumpkin Pakora",
    note: "Butternut fritters, tamarind chutney.",
    bg: "bg-[#facc15]",
    ink: "text-[#1034b8]",
  },
  {
    label: "Aloo Samosas",
    title: "Aloo Samosas",
    note: "Roasted vegetables, mango chutney.",
    bg: "bg-[#facc15]",
    ink: "text-[#1034b8]",
  },
  {
    label: "Palak Paneer",
    title: "Palak Paneer",
    note: "Spinach sauce, grilled paneer.",
    bg: "bg-[#1034b8]",
    ink: "text-[#f6ebd3]",
  },
  {
    label: "Butter Chicken",
    title: "Butter Chicken",
    note: "Tandoor chicken, tomato cream sauce.",
    bg: "bg-[#16a34a]",
    ink: "text-[#fff2cf]",
  },
  {
    label: "Murgh Korma",
    title: "Murgh Korma",
    note: "Almonds, pistachios, turmeric.",
    bg: "bg-[#15803d]",
    ink: "text-[#fff2cf]",
  },
  {
    label: "Tandoori Squash",
    title: "Tandoori Squash",
    note: "Marinated squash, tamarind chutney.",
    bg: "bg-[#22c55e]",
    ink: "text-[#052e16]",
  },
  {
    label: "Cheese Naan",
    title: "Cheese Naan",
    note: "Melting cheese, freshly baked naan.",
    bg: "bg-[#ef4444]",
    ink: "text-[#fff2cf]",
  },
  {
    label: "Vada Pav",
    title: "Vada Pav",
    note: "Soft bun, spiced potato fritter.",
    bg: "bg-[#ef4444]",
    ink: "text-[#fff2cf]",
  },
  {
    label: "Bhel Puri",
    title: "Bhel Puri",
    note: "Puffed rice, green mango, mint.",
    bg: "bg-[#ef4444]",
    ink: "text-[#fff2cf]",
  },
];

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="pb-24 md:pb-8">
      <header className="mx-auto w-full max-w-[1200px] border-x border-[#f00] border-opacity-30 bg-[#f4ead5] px-3 pt-3 text-[#f00] md:px-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="font-[family-name:var(--font-bebas)] text-4xl uppercase leading-none tracking-tight">
            gourou
          </p>
          <div className="hidden items-center gap-2 md:flex">
            <Link href="/shop" className="border border-[#1034b8] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#1034b8]">Menu</Link>
            <Link href="/rewards" className="border border-[#1034b8] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#1034b8]">Rewards</Link>
            {user ? (
              <>
                <Link href="/orders" className="border border-[#1034b8] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#1034b8]">Orders</Link>
                <button onClick={logout} className="border border-[#1034b8] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#1034b8]">Logout</button>
              </>
            ) : (
              <Link href="/login" className="border border-[#1034b8] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#1034b8]">Sign In</Link>
            )}
            <Link href="/shop" className="border border-[#f00] bg-[#f00] px-4 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#fef3d8]">Order</Link>
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <div className="h-36 bg-[linear-gradient(120deg,#032e9d_0%,#1d4ed8_42%,#facc15_42%,#facc15_48%,#dc2626_48%,#ef4444_100%)] md:h-48" />
          <motion.div
            className="h-36 bg-[radial-gradient(circle_at_30%_20%,#ffd18a_0%,#f97316_42%,#8b1a1a_100%)] md:h-48"
            animate={{ backgroundPosition: ["0% 0%", "100% 50%", "0% 0%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="border-x border-[#f00] border-opacity-40 px-2 py-3 md:px-0 md:py-4">
          <h1 className="font-[family-name:var(--font-bebas)] text-[clamp(2.6rem,9vw,6.3rem)] uppercase leading-[0.88] tracking-tight text-[#1034b8]">
            indian food company
          </h1>
          <div className="mt-2 grid gap-2 text-[11px] uppercase tracking-[0.08em] text-[#1034b8] md:grid-cols-[1.3fr_1fr_auto_auto_auto] md:items-start">
            <p className="font-extrabold leading-tight">At Gourou, your Indian restaurant in Paris</p>
            <p className="text-[9px] leading-[1.35]">Fresh prep, bold sauces, and street food classics served all day.</p>
            <Link href="/shop" className="border border-[#1034b8] px-3 py-1 font-extrabold">Food List</Link>
            <Link href="/shop" className="border border-[#1034b8] px-3 py-1 font-extrabold">Menu</Link>
            <Link href="/shop" className="border border-[#1034b8] px-3 py-1 font-extrabold">Shop</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] border-x border-[#f00] border-opacity-30 bg-[#f4ead5]">
        <section className="border-y-2 border-[#f00] bg-[#fff4de] py-2">
          <motion.div
            className="flex w-max whitespace-nowrap pl-2 font-[family-name:var(--font-bebas)] text-[clamp(2.3rem,7vw,5rem)] uppercase leading-none tracking-tight text-[#f00]"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 2 }).map((_, idx) => (
              <p key={idx} className="pr-12">from india  from india  from india  from india</p>
            ))}
          </motion.div>
        </section>

        <section className="relative overflow-hidden border-b-2 border-[#f00] bg-[#dc2626] p-2">
          <div className="h-52 bg-[linear-gradient(180deg,#a16207_0%,#6b21a8_0%,#111827_42%,#1f2937_100%)] md:h-72" />
          <motion.div
            className="absolute bottom-6 left-0 h-14 w-28 bg-black"
            animate={{ x: ["-10%", "110%"] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "linear" }}
          />
        </section>

        <section className="bg-[radial-gradient(circle,#f00_0.2%,transparent_0.22%)] [background-size:8px_8px] px-4 py-20 text-center md:py-24">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            className="mx-auto max-w-xl font-[family-name:var(--font-bebas)] text-[clamp(2.2rem,6vw,4.8rem)] uppercase leading-[0.9] text-[#f00]"
          >
            homemade Indian cuisine, fresh and generous
          </motion.h2>
          <p className="mx-auto mt-3 max-w-md text-[10px] uppercase tracking-[0.1em] text-[#111]">
            At Gourou, everything is prepared in-house with fresh ingredients and vibrant vegetarian and comfort-forward recipes.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button className="border border-[#f00] bg-[#f00] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#fff3d8]">The Restaurant</button>
            <button className="border border-[#f00] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#f00]">Contact Us</button>
          </div>
        </section>

        <section className="grid border-y-2 border-[#f00] md:grid-cols-[2fr_1fr]">
          <div className="h-56 bg-[linear-gradient(140deg,#f59e0b_0%,#ef4444_45%,#1d4ed8_100%)] md:h-80" />
          <div className="bg-[#1034b8] p-4 text-right text-[#fff4de]">
            <p className="font-[family-name:var(--font-bebas)] text-4xl uppercase leading-none">We are hiring</p>
            <p className="mt-2 text-[11px] uppercase leading-tight">
              kitchen and floor roles, motivated, energetic, and curious people.
            </p>
          </div>
        </section>

        <section id="menu" className="grid grid-cols-1 gap-0 border-b-2 border-[#f00] md:grid-cols-3">
          <article className="border-r border-t border-[#f00] bg-[#f3efe2] p-3">
            <p className="font-extrabold uppercase leading-tight text-[#111]">Discover our homemade Indian cuisine essentials</p>
          </article>
          {tiles.map((tile, index) => (
            <motion.article
              key={tile.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.03 }}
              className={`${tile.bg} ${tile.ink} border-r border-t border-[#f00] p-3`}
            >
              <p className="font-[family-name:var(--font-bebas)] text-2xl uppercase leading-none">{tile.label}</p>
              <h3 className="mt-1 font-[family-name:var(--font-bebas)] text-[2.05rem] uppercase leading-[0.85]">{tile.title}</h3>
              <div className="my-3 h-20 rounded-full border-4 border-current bg-[radial-gradient(circle_at_30%_20%,#fff2cf_0%,#ffe08a_30%,#f97316_100%)]" />
              <p className="text-[10px] uppercase leading-tight">{tile.note}</p>
            </motion.article>
          ))}
        </section>

        <section className="border-b-2 border-[#f00] px-4 py-10 md:px-8">
          <h2 className="text-center font-[family-name:var(--font-bebas)] text-[clamp(5rem,17vw,15rem)] leading-none uppercase text-[#f00]">
            shop
          </h2>
          <div className="mt-2 grid gap-2 md:grid-cols-4">
            <article className="border border-[#f00] bg-[#fef3c7] p-2">
              <div className="h-24 bg-[linear-gradient(135deg,#1d4ed8_0%,#facc15_60%,#111827_100%)]" />
              <p className="mt-2 font-extrabold uppercase">Matchbox Set</p>
            </article>
            <article className="border border-[#f00] bg-[#dcfce7] p-2">
              <div className="h-24 bg-[linear-gradient(135deg,#15803d_0%,#4ade80_50%,#14532d_100%)]" />
              <p className="mt-2 font-extrabold uppercase">T-shirt Gourou</p>
            </article>
            <article className="border border-[#f00] bg-[#dbeafe] p-2">
              <div className="h-24 bg-[linear-gradient(135deg,#1e3a8a_0%,#60a5fa_70%,#1d4ed8_100%)]" />
              <p className="mt-2 font-extrabold uppercase">Poster series</p>
            </article>
            <article className="border border-[#f00] bg-[#1034b8] p-2 text-[#fff4de]">
              <p className="font-[family-name:var(--font-bebas)] text-4xl uppercase leading-none">Coming soon</p>
              <button className="mt-3 border border-[#fff4de] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">
                Shop updates
              </button>
            </article>
          </div>
        </section>

        <section className="border-b-2 border-[#f00] bg-[#f00] text-[#fef3d8]">
          <motion.div
            className="flex w-max whitespace-nowrap py-1 font-extrabold uppercase tracking-[0.08em]"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 2 }).map((_, idx) => (
              <p key={idx} className="pr-10 text-sm">follow us - follow us - follow us - follow us</p>
            ))}
          </motion.div>
          <div className="grid gap-2 p-2 md:grid-cols-[1fr_1.2fr_1fr]">
            <div className="grid min-h-52 place-items-center border border-[#fef3d8] bg-[#ef4444]">
              <p className="rotate-180 font-[family-name:var(--font-bebas)] text-7xl uppercase leading-none tracking-tight [writing-mode:vertical-rl]">guru</p>
            </div>
            <div className="border border-[#fef3d8] bg-[#1d4ed8] p-4">
              <p className="font-[family-name:var(--font-bebas)] text-5xl uppercase leading-none text-[#d9f99d]">palak paneer</p>
              <div className="mt-3 h-28 rounded-full border-4 border-[#fff4de] bg-[radial-gradient(circle_at_40%_30%,#fef9c3_0%,#86efac_38%,#166534_100%)]" />
            </div>
            <div className="grid min-h-52 place-items-center border border-[#fef3d8] bg-[#ef4444]">
              <p className="font-[family-name:var(--font-bebas)] text-7xl uppercase leading-none tracking-tight [writing-mode:vertical-rl]">bhel</p>
            </div>
          </div>
        </section>

        <footer id="contact" className="bg-[radial-gradient(circle,#f00_0.18%,transparent_0.2%)] [background-size:10px_10px] px-4 py-20 text-center text-[#f00]">
          <h2 className="font-[family-name:var(--font-bebas)] text-[clamp(3rem,9vw,7rem)] uppercase leading-[0.88]">Indian Food Company</h2>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <button className="border border-[#f00] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.15em]">Reserve</button>
            <button className="border border-[#f00] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.15em]">Takeaway</button>
          </div>
          <p className="mx-auto mt-4 max-w-xl text-[10px] uppercase leading-tight tracking-[0.08em] text-[#b91c1c]">
            Address: 42 Rue Leon Frot, 75011 Paris - Open lunch and dinner - Reservation recommended.
          </p>
        </footer>
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-50 rounded-3xl border border-[#e2d2b3] bg-white/95 p-2 shadow-[0_14px_32px_rgba(0,0,0,0.28)] backdrop-blur md:hidden">
        <ul className="grid grid-cols-4 items-end text-center">
          <li>
            <Link href="/shop" className="flex w-full flex-col items-center gap-1 rounded-xl py-2 text-[#1034b8]">
              <span className="text-lg">☰</span>
              <span className="text-[10px] font-extrabold uppercase">Menu</span>
            </Link>
          </li>
          <li>
            <Link href="/rewards" className="flex w-full flex-col items-center gap-1 rounded-xl py-2 text-[#1034b8]">
              <span className="text-lg">★</span>
              <span className="text-[10px] font-extrabold uppercase leading-tight">Rewards</span>
            </Link>
          </li>
          <li>
            <Link href="/shop" className="-mt-7 flex h-16 w-full flex-col items-center justify-center rounded-2xl bg-[#f00] text-[#fff4de] shadow-[0_10px_24px_rgba(255,0,0,0.45)]">
              <span className="text-lg">🛍</span>
              <span className="text-[10px] font-extrabold uppercase">Order</span>
            </Link>
          </li>
          <li>
            <Link href={user ? "/orders" : "/login"} className="flex w-full flex-col items-center gap-1 rounded-xl py-2 text-[#1034b8]">
              <span className="text-lg">👤</span>
              <span className="text-[10px] font-extrabold uppercase">Profile</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
