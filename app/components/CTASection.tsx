"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ButtonHoverLabel } from "./ButtonHoverLabel";

export function CTASection() {
  return (
    <section data-aos="fade-up" className="bg-[#fff4de] px-4 py-20 text-center md:py-24">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto max-w-3xl font-[family-name:var(--font-bebas)] text-[clamp(2.2rem,6vw,4.8rem)] uppercase leading-[0.9] text-[#f00]"
      >
        flame-grilled classics, crispy favorites, real fast food energy
      </motion.h2>
      <p className="mx-auto mt-3 max-w-md text-[10px] uppercase tracking-[0.1em] text-[#111]">
        At Sizzle, we serve craveable burgers, crispy chicken, loaded fries,
        and combo meals built for lunch rush and late-night runs.
      </p>
      <div className="mt-4 flex justify-center gap-2">
        <Link
          href="/menu"
          className="group inline-flex items-center border border-[#f00] bg-[#f00] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#fff3d8]"
        >
          <ButtonHoverLabel label="The Menu" />
        </Link>
        <Link
          href="/rewards"
          className="group inline-flex items-center border border-[#f00] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#f00]"
        >
          <ButtonHoverLabel label="Redeem Rewards" />
        </Link>
      </div>
    </section>
  );
}
