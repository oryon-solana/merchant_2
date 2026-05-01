"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ButtonHoverLabel } from "./ButtonHoverLabel";

export function RedeemSection() {
  return (
    <section
      data-aos="fade-up"
      className="relative overflow-hidden border-y-2 border-[#f00] bg-[linear-gradient(140deg,#fff4de_0%,#ffe1ad_45%,#fecaca_100%)] p-4 md:p-8"
    >
      <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[#f00]/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-[#1034b8]/20 blur-2xl" />
      <div
        data-aos="zoom-in-up"
        className="relative grid gap-6 border-2 border-[#f00] p-4 shadow-[0_14px_0_#f00] md:grid-cols-[1.35fr_auto] md:items-end md:p-8"
        style={{
          backgroundImage: "url('/images/redeem.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-linear-to-r from-black/40 to-black/10 absolute inset-0"></div>
        <div className="bg-linear-to-t from-black/20 to-black/5 absolute inset-0"></div>
        <div
          className="pointer-events-none absolute inset-0 bg-repeat opacity-70"
          style={{
            backgroundImage: "url('/images/texture.png')",
            backgroundSize: "8px 8px",
            maskImage:
              "radial-gradient(circle at left bottom, black 10%, black 18%, transparent 55%)",
            WebkitMaskImage:
              "radial-gradient(circle at left bottom, black 10%, black 18%, transparent 55%)",
          }}
        />
        <div className="z-10">
          <p className="inline-block border border-[#1034b8] bg-[#dbeafe] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#1034b8]">
            loyalty drop
          </p>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            className="mt-3 font-(family-name:--font-bebas) text-[clamp(3.2rem,10vw,8rem)] uppercase leading-[0.78] text-[#f00]"
          >
            redeem
            <br />
            points
            <span className="ml-2 text-[#f3efe2]">faster</span>
          </motion.p>
          <p className="mt-2 max-w-xl text-sm font-extrabold uppercase tracking-widest text-[#f3efe2] md:text-base">
            Cash in your rewards for free sides, shakes, and full combo
            upgrades before checkout.
          </p>
        </div>
        <div className="grid gap-3 md:justify-items-end z-10">
          <Link
            href="/rewards"
            className="group inline-flex items-center justify-center border-2 border-[#f00] bg-[#f00] px-8 py-4 text-base font-black uppercase tracking-[0.18em] text-[#fff4de] shadow-[0_8px_0_#991b1b] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_12px_0_#991b1b] md:px-12 md:py-5 md:text-lg"
          >
            <ButtonHoverLabel label="Redeem Deals Now" />
          </Link>
          <Link
            href="/profile"
            className="group inline-flex items-center justify-center border border-[#1034b8] bg-[#dbeafe]/70 px-6 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]"
          >
            <ButtonHoverLabel label="View my points" />
          </Link>
        </div>
      </div>
    </section>
  );
}
