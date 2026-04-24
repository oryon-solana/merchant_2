"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type MerchantRate = {
  name: string;
  rate: number;
};

const merchantRates: MerchantRate[] = [
  { name: "GoPay", rate: 0.012 },
  { name: "OVO", rate: 0.011 },
  { name: "ShopeePay", rate: 0.013 },
  { name: "DANA", rate: 0.0105 },
];

export default function ProfilePage() {
  const [name, setName] = useState("Rina Patel");
  const [email, setEmail] = useState("rina@example.com");
  const [phone, setPhone] = useState("+62 812 0000 1234");
  const [currentPoints] = useState(1840);

  const [pointsToConvert, setPointsToConvert] = useState(300);
  const [targetMerchant, setTargetMerchant] = useState(merchantRates[0].name);

  const selectedRate = useMemo(
    () => merchantRates.find((merchant) => merchant.name === targetMerchant) ?? merchantRates[0],
    [targetMerchant],
  );

  const convertedValue = useMemo(() => {
    if (!Number.isFinite(pointsToConvert) || pointsToConvert <= 0) {
      return 0;
    }

    return pointsToConvert * selectedRate.rate;
  }, [pointsToConvert, selectedRate.rate]);

  return (
    <main className="min-h-screen w-full bg-[#f4ead5] pb-24 md:pb-8">
      <header className="border-b-2 border-[#f00] p-4 md:p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#1034b8]">Member area</p>
        <h1 className="font-[family-name:var(--font-bebas)] text-[clamp(2.8rem,8vw,6rem)] uppercase leading-[0.85] text-[#f00]">
          Profile & Points
        </h1>
      </header>

      <section className="grid gap-0 border-b-2 border-[#f00] md:grid-cols-2">
        <article className="border-r border-t border-[#f00] bg-[#fff4de] p-4">
          <h2 className="font-[family-name:var(--font-bebas)] text-4xl uppercase text-[#1034b8]">Edit basic info</h2>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
              Full name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="border border-[#1034b8] bg-white px-3 py-2 text-sm font-semibold text-[#111] outline-none focus:ring-2 focus:ring-[#1034b8]"
              />
            </label>
            <label className="grid gap-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
              Email
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="border border-[#1034b8] bg-white px-3 py-2 text-sm font-semibold text-[#111] outline-none focus:ring-2 focus:ring-[#1034b8]"
              />
            </label>
            <label className="grid gap-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
              Phone
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="border border-[#1034b8] bg-white px-3 py-2 text-sm font-semibold text-[#111] outline-none focus:ring-2 focus:ring-[#1034b8]"
              />
            </label>
            <button className="mt-1 w-fit border border-[#f00] bg-[#f00] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de]">
              Save (dummy)
            </button>
          </div>
        </article>

        <article className="border-t border-[#f00] bg-[#dbeafe] p-4">
          <h2 className="font-[family-name:var(--font-bebas)] text-4xl uppercase text-[#f00]">Current points</h2>
          <p className="mt-2 text-6xl font-black text-[#1034b8]">{currentPoints}</p>
          <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#1f2937]">
            Available for rewards redemption and conversion.
          </p>

          <div className="mt-5 border border-[#f00] bg-[#fff4de] p-3">
            <h3 className="font-[family-name:var(--font-bebas)] text-3xl uppercase text-[#f00]">Convert points</h3>

            <div className="mt-3 grid gap-3">
              <label className="grid gap-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                Points amount
                <input
                  type="number"
                  min={0}
                  value={pointsToConvert}
                  onChange={(event) => setPointsToConvert(Number(event.target.value))}
                  className="border border-[#1034b8] bg-white px-3 py-2 text-sm font-semibold text-[#111] outline-none focus:ring-2 focus:ring-[#1034b8]"
                />
              </label>

              <label className="grid gap-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                Target merchant
                <select
                  value={targetMerchant}
                  onChange={(event) => setTargetMerchant(event.target.value)}
                  className="border border-[#1034b8] bg-white px-3 py-2 text-sm font-semibold text-[#111] outline-none focus:ring-2 focus:ring-[#1034b8]"
                >
                  {merchantRates.map((merchant) => (
                    <option key={merchant.name} value={merchant.name}>
                      {merchant.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 border border-[#1034b8] bg-white p-3">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                Conversion result (dummy)
              </p>
              <p className="mt-1 text-2xl font-black text-[#1034b8]">
                {pointsToConvert || 0} points = {convertedValue.toFixed(2)} {selectedRate.name} credit
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">
                Rate: 1 point = {selectedRate.rate.toFixed(4)} credit
              </p>
            </div>
          </div>
        </article>
      </section>

      <footer className="flex flex-wrap gap-2 p-4 md:p-6">
        <Link href="/rewards" className="border border-[#1034b8] px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]">
          Go to points deals
        </Link>
        <Link href="/menu" className="border border-[#f00] px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#f00]">
          Go to menu
        </Link>
      </footer>
    </main>
  );
}
