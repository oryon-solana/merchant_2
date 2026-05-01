"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ButtonHoverLabel } from "./ButtonHoverLabel";

export function CTASection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingZoneRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.4 });

  const rawX = useMotionValue(-100); // start off-screen left (percentage)
  const x = useSpring(rawX, { stiffness: 60, damping: 20 });
  const maskPosition = useTransform(x, (v) => `${v}% 30%`);

  useEffect(() => {
    if (isInView) rawX.set(50); // slide to center
  }, [isInView, rawX]);

  return (
    <section
      ref={sectionRef}
      data-aos="fade-up"
      className="relative overflow-hidden bg-[#fff4de] px-4 py-20 text-center md:py-24"
    >
      {/* Mask overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 bg-[#f30]"
        style={{
          maskImage: "url('/mask/mask.svg')",
          WebkitMaskImage: "url('/mask/mask.svg')",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "280px",
          WebkitMaskSize: "280px",
          maskPosition,
          WebkitMaskPosition: maskPosition,
        }}
      >
        <div className="mx-auto max-w-3xl px-4 py-20 text-center md:py-24">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            className="font-[family-name:var(--font-bebas)] text-[clamp(2.2rem,6vw,4.8rem)] uppercase leading-[0.9] text-[#fff4de]"
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
        </div>
      </motion.div>

      {/* Real content */}
      <div className="relative z-10 mx-auto max-w-3xl">
        <div ref={headingZoneRef}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            className="font-[family-name:var(--font-bebas)] text-[clamp(2.2rem,6vw,4.8rem)] uppercase leading-[0.9] text-[#f00]"
          >
            flame-grilled classics, crispy favorites, real fast food energy
          </motion.h2>
        </div>
      </div>
      <p className="relative z-10 mx-auto mt-3 max-w-md text-[10px] uppercase tracking-[0.1em] text-[#111]">
        At Sizzle, we serve craveable burgers, crispy chicken, loaded fries, and
        combo meals built for lunch rush and late-night runs.
      </p>
      <div className="relative z-10 mt-4 flex justify-center gap-2">
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