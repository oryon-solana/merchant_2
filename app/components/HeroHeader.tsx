"use client";

import { useState } from "react";
import Link from "next/link";
import { ButtonHoverLabel } from "./ButtonHoverLabel";

const heroVideos = [
  "/images/hero-1.webm",
  "/images/hero-2.webm",
  "/images/hero-3.webm",
];

export function HeroHeader() {
  const [heroVideoIndex, setHeroVideoIndex] = useState(0);

  const handleHeroVideoEnded = () => {
    setHeroVideoIndex((current) => (current + 1) % heroVideos.length);
  };

  return (
    <header className="w-full bg-[#f4ead5] px-3 pt-3 text-[#f00] md:px-6">
      <div
        data-aos="fade-up"
        className="border-x border-[#f00] border-opacity-40 px-2 py-3 md:px-4 md:py-4 mb-6"
      >
        <h1 className="font-[family-name:var(--font-bebas)] text-[clamp(2.6rem,9vw,6.3rem)] uppercase leading-[0.88] tracking-tight text-[#1034b8]">
          this is american fast food
        </h1>
        <div className="mt-2 grid gap-2 text-[11px] uppercase tracking-[0.08em] text-[#1034b8] md:grid-cols-[1.3fr_1fr_auto_auto_auto] md:items-start">
          <p className="font-extrabold leading-tight">
            At Sizzle, your neighborhood burger and chicken spot
          </p>
          <p className="text-[9px] leading-[1.35]">
            Drive-thru speed, diner flavor, and late-night combo deals every
            day.
          </p>
          <Link
            href="/menu"
            className="group inline-flex items-center border border-[#1034b8] px-4 py-2 text-[12px] font-extrabold"
          >
            <ButtonHoverLabel label="Menu" />
          </Link>
          <Link
            href="/rewards"
            className="group inline-flex items-center border border-[#1034b8] px-4 py-2 text-[12px] font-extrabold"
          >
            <ButtonHoverLabel label="Points Deals" />
          </Link>
        </div>
      </div>
      <div data-aos="zoom-out" className="relative overflow-hidden">
        <video
          className="h-44 w-full object-cover md:h-120"
          key={heroVideos[heroVideoIndex]}
          src={heroVideos[heroVideoIndex]}
          autoPlay
          muted
          playsInline
          onEnded={handleHeroVideoEnded}
        />
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
      </div>
    </header>
  );
}
