"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { MaskedLineReveal } from "../components/MaskedLineReveal";
import { ButtonHoverLabel } from "../components/ButtonHoverLabel";
import {
  POINTS_CHANGED_EVENT,
  getCurrentPoints,
  getRedeemedDeals,
  redeemDeal,
} from "../lib/points";

const rewardsDeals = [
  {
    id: "buffalo-chicken-wrap",
    name: "Buffalo Chicken Wrap",
    details: "Crispy strips, lettuce, pickles, spicy mayo.",
    points: 450,
    image: "/menu/buffalo-chicken-wrap.webp",
  },
  {
    id: "value-max-combo",
    name: "Value Max Combo",
    details: "Burger, fries, nuggets, and a fountain drink.",
    points: 560,
    image: "/menu/value-max-combo.webp",
  },
  {
    id: "loaded-fries",
    name: "Loaded Fries",
    details: "Crinkle fries, cheese sauce, bacon bits, jalapenos.",
    points: 380,
    image: "/menu/loaded-fries.webp",
  },
  {
    id: "vanilla-mega-shake",
    name: "Vanilla Mega Shake",
    details: "Thick vanilla shake with whipped cream and cookie crumbs.",
    points: 320,
    image: "/menu/vanilla-mega-shake.webp",
  },
];

type Deal = (typeof rewardsDeals)[number];

function formatDateLabel(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function RewardsPage() {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [redeemedDeals, setRedeemedDeals] = useState<Record<string, string>>({});
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const sync = () => {
      setCurrentPoints(getCurrentPoints());
      const map = Object.fromEntries(getRedeemedDeals().map((deal) => [deal.id, deal.expiresAt]));
      setRedeemedDeals(map);
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(POINTS_CHANGED_EVENT, sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(POINTS_CHANGED_EVENT, sync);
    };
  }, []);

  const expiryIso = useMemo(() => {
    if (!selectedDeal) {
      return "";
    }

    const next = new Date();
    next.setDate(next.getDate() + 14);
    return next.toISOString();
  }, [selectedDeal]);

  const openRedeemPopup = (deal: Deal) => {
    setSelectedDeal(deal);
    setModalOpen(true);
  };

  const closeRedeemPopup = () => {
    setModalOpen(false);
    setSelectedDeal(null);
  };

  const confirmRedeem = () => {
    if (!selectedDeal) {
      return;
    }

    const result = redeemDeal(selectedDeal.id, selectedDeal.points, expiryIso);
    if (result.ok) {
      closeRedeemPopup();
    }
  };

  const selectedAlreadyRedeemed = selectedDeal ? Boolean(redeemedDeals[selectedDeal.id]) : false;
  const selectedCanAfford = selectedDeal ? currentPoints >= selectedDeal.points : false;

  return (
    <main className="min-h-screen w-full bg-[#f4ead5] pb-24 md:pb-8">
      <header className="border-b-2 border-[#f00] p-4 md:p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#1034b8]">Pay with points</p>
        <h1 className="font-[family-name:var(--font-bebas)] text-[clamp(2.8rem,8vw,6rem)] uppercase leading-[0.85] text-[#f00]">
          Points Deals Menu
        </h1>
        <p className="max-w-2xl text-sm font-semibold uppercase tracking-[0.08em] text-[#1034b8]">
          Redeem loyalty points for special menu items. No cash payment needed when you have enough points.
        </p>
        <p className="mt-3 text-sm font-black uppercase tracking-[0.08em] text-[#f00]">Current points: {currentPoints}</p>
      </header>

      <section className="grid grid-cols-1 border-b-2 border-[#f00] md:grid-cols-2">
        {rewardsDeals.map((deal, index) => {
          const redeemedExpiry = redeemedDeals[deal.id];
          const alreadyRedeemed = Boolean(redeemedExpiry);

          return (
            <article
              key={deal.name}
              className={`border-r border-t border-[#f00] p-4 ${index % 2 === 0 ? "bg-[#fee2e2]" : "bg-[#fff4de]"}`}
            >
              <div className="relative mb-3 h-40 overflow-hidden rounded-lg border-2 border-[#1034b8] md:h-84">
                <Image
                  src={deal.image}
                  alt={deal.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 30vw"
                  priority={index === 0}
                />
              </div>
              <MaskedLineReveal
                as="p"
                lines={[deal.name]}
                className="font-[family-name:var(--font-bebas)] text-4xl uppercase leading-none text-[#f00]"
              />
              <MaskedLineReveal
                as="p"
                lines={[deal.details]}
                className="mt-2 text-xs font-bold uppercase tracking-[0.07em] text-[#1f2937]"
              />
              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <MaskedLineReveal
                    as="p"
                    lines={[`${deal.points} pts`]}
                    className="text-lg font-extrabold uppercase text-[#1034b8]"
                  />
                  {alreadyRedeemed ? (
                    <p className="text-[10px] font-black uppercase tracking-[0.08em] text-[#f00]">
                      Redeemed (expires {formatDateLabel(redeemedExpiry)})
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => openRedeemPopup(deal)}
                  disabled={alreadyRedeemed}
                  className="group inline-flex items-center border border-[#1034b8] bg-[#1034b8] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de] disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <ButtonHoverLabel label={alreadyRedeemed ? "Redeemed" : "Redeem"} className="leading-none" />
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <footer className="flex flex-wrap gap-2 p-4 md:p-6">
        <Link href="/profile" className="group inline-flex items-center border border-[#1034b8] px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]">
          <ButtonHoverLabel label="Manage points" />
        </Link>
        <Link href="/menu" className="group inline-flex items-center border border-[#f00] px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#f00]">
          <ButtonHoverLabel label="Pay with money menu" />
        </Link>
      </footer>

      {isModalOpen && selectedDeal ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/55 p-4">
          <div className="w-full max-w-2xl border-2 border-[#f00] bg-[#fff4de] p-5 md:p-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]">Redeem confirmation</p>
            <h2 className="font-(family-name:--font-bebas) text-[clamp(2rem,5vw,3.3rem)] uppercase leading-[0.9] text-[#f00]">
              {selectedDeal.name}
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-[180px_1fr] md:items-start">
              <div className="relative h-36 overflow-hidden rounded-lg border-2 border-[#1034b8] md:h-44">
                <Image src={selectedDeal.image} alt={selectedDeal.name} fill className="object-cover" />
              </div>
              <div className="grid gap-3 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                <p>
                  You have <span className="text-[#1034b8]">{currentPoints}</span> points.
                </p>
                <p>
                  This reward costs <span className="text-[#f00]">{selectedDeal.points}</span> points.
                </p>
                <p>
                  Valid until <span className="text-[#f00]">{formatDateLabel(expiryIso)}</span>.
                </p>
                {selectedAlreadyRedeemed ? (
                  <p className="text-[#f00]">This deal has already been redeemed once.</p>
                ) : null}
                {!selectedAlreadyRedeemed && !selectedCanAfford ? (
                  <p className="text-[#f00]">Not enough points to redeem this item.</p>
                ) : null}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={confirmRedeem}
                disabled={selectedAlreadyRedeemed || !selectedCanAfford}
                className="group inline-flex items-center border border-[#f00] bg-[#f00] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de] disabled:cursor-not-allowed disabled:opacity-55"
              >
                <ButtonHoverLabel label="Confirm redeem" />
              </button>
              <button
                type="button"
                onClick={closeRedeemPopup}
                className="group inline-flex items-center border border-[#1034b8] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]"
              >
                <ButtonHoverLabel label="Cancel" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
