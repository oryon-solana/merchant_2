"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonHoverLabel } from "../components/ButtonHoverLabel";
import { useAuth } from "../context/AuthContext";

interface PhantomProvider {
  isPhantom: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
}

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

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();
  const [currentPoints, setCurrentPoints] = useState(0);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [pointsToConvert, setPointsToConvert] = useState(300);
  const [targetMerchant, setTargetMerchant] = useState(merchantRates[0].name);

  const selectedRate = useMemo(
    () =>
      merchantRates.find((m) => m.name === targetMerchant) ?? merchantRates[0],
    [targetMerchant],
  );

  const convertedValue = useMemo(() => {
    if (!Number.isFinite(pointsToConvert) || pointsToConvert <= 0) return 0;
    return pointsToConvert * selectedRate.rate;
  }, [pointsToConvert, selectedRate.rate]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace("/signin");
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!token) return;
    fetch("/api/points", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.total_points === "number") setCurrentPoints(data.total_points);
        if (data.wallet_address) setWalletAddress(data.wallet_address);
      })
      .catch(() => {});
  }, [token]);

  const connectWallet = async () => {
    setWalletError("");
    const phantom = (window as Window & { solana?: PhantomProvider }).solana;
    if (!phantom?.isPhantom) {
      window.open("https://phantom.app/", "_blank");
      return;
    }
    setConnectingWallet(true);
    try {
      const response = await phantom.connect();
      const address = response.publicKey.toString();
      const res = await fetch("/api/points", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ wallet_address: address }),
      });
      const data = await res.json();
      if (!res.ok) {
        setWalletError(data.error ?? "Failed to save wallet");
        return;
      }
      setWalletAddress(address);
    } catch {
      setWalletError("Wallet connection cancelled");
    } finally {
      setConnectingWallet(false);
    }
  };

  if (isLoading || !user) return null;

  return (
    <main className="min-h-screen w-full bg-[#f4ead5] pb-24 md:pb-8">
      <header className="border-b-2 border-[#f00] p-4 md:p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#1034b8]">
          Member area
        </p>
        <h1 className="font-(family-name:--font-bebas) text-[clamp(2.8rem,8vw,6rem)] uppercase leading-[0.85] text-[#f00]">
          Profile & Points
        </h1>
      </header>

      <section className="grid gap-0 border-b-2 border-[#f00] md:grid-cols-2">
        <article className="border-r border-t border-[#f00] bg-[#fff4de] p-4">
          <h2 className="font-(family-name:--font-bebas) text-4xl uppercase text-[#1034b8]">
            Basic info
          </h2>
          <div className="mt-4 grid gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                Full name
              </p>
              <p className="mt-1 text-sm font-semibold text-[#111]">
                {user.name ?? "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                Email
              </p>
              <p className="mt-1 text-sm font-semibold text-[#111]">
                {user.email ?? "Not provided"}
              </p>
            </div>

            <div className="border-t border-[#1034b8]/20 pt-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                Solana wallet
              </p>
              {walletAddress ? (
                <p className="mt-1 font-mono text-sm font-semibold text-[#111]" title={walletAddress}>
                  {truncateAddress(walletAddress)}
                </p>
              ) : (
                <p className="mt-1 text-sm font-semibold text-[#6b7280]">
                  Not connected
                </p>
              )}
              {walletError && (
                <p className="mt-1 text-[11px] font-bold uppercase text-[#f00]">
                  {walletError}
                </p>
              )}
              <button
                type="button"
                onClick={connectWallet}
                disabled={connectingWallet}
                className="group mt-2 inline-flex w-fit items-center border border-[#1034b8] bg-[#1034b8] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de] disabled:opacity-50"
              >
                <ButtonHoverLabel
                  label={
                    connectingWallet
                      ? "Connecting…"
                      : walletAddress
                        ? "Reconnect Wallet"
                        : "Connect Wallet"
                  }
                />
              </button>
            </div>
          </div>
        </article>

        <article className="border-t border-[#f00] bg-[#dbeafe] p-4">
          <h2 className="font-(family-name:--font-bebas) text-4xl uppercase text-[#f00]">
            Current points
          </h2>
          <p className="mt-2 text-6xl font-black text-[#1034b8]">
            {currentPoints}
          </p>
          <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#1f2937]">
            Available for rewards redemption and conversion.
          </p>

          <div className="mt-5 border border-[#f00] bg-[#fff4de] p-3">
            <h3 className="font-(family-name:--font-bebas) text-3xl uppercase text-[#f00]">
              Convert points
            </h3>

            <div className="mt-3 grid gap-3">
              <label className="grid gap-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                Points amount
                <input
                  type="number"
                  min={0}
                  value={pointsToConvert}
                  onChange={(e) => setPointsToConvert(Number(e.target.value))}
                  className="border border-[#1034b8] bg-white px-3 py-2 text-sm font-semibold text-[#111] outline-none focus:ring-2 focus:ring-[#1034b8]"
                />
              </label>

              <label className="grid gap-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                Target merchant
                <select
                  value={targetMerchant}
                  onChange={(e) => setTargetMerchant(e.target.value)}
                  className="border border-[#1034b8] bg-white px-3 py-2 text-sm font-semibold text-[#111] outline-none focus:ring-2 focus:ring-[#1034b8]"
                >
                  {merchantRates.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 border border-[#1034b8] bg-white p-3">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                Conversion result
              </p>
              <p className="mt-1 text-2xl font-black text-[#1034b8]">
                {pointsToConvert || 0} points = {convertedValue.toFixed(2)}{" "}
                {selectedRate.name} credit
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">
                Rate: 1 point = {selectedRate.rate.toFixed(4)} credit
              </p>
            </div>
          </div>
        </article>
      </section>

      <footer className="flex flex-wrap gap-2 p-4 md:p-6">
        <Link
          href="/rewards"
          className="group inline-flex items-center border border-[#1034b8] px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]"
        >
          <ButtonHoverLabel label="Go to points deals" />
        </Link>
        <Link
          href="/menu"
          className="group inline-flex items-center border border-[#f00] px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#f00]"
        >
          <ButtonHoverLabel label="Go to menu" />
        </Link>
      </footer>
    </main>
  );
}
