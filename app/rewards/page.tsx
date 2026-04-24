"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface PointTransaction {
  id: string;
  points: number;
  type: "earned" | "redeemed";
  note: string;
  created_at: string;
  order_id: string | null;
}

interface PointsData {
  total_points: number;
  last_updated: string | null;
  history: PointTransaction[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function RewardsPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<PointsData>({ total_points: 0, last_updated: null, history: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push("/login"); return; }
    fetch("/api/points", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [user, token, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#f4ead5] pb-24 md:pb-8">
      <header className="border-b-2 border-[#f00] border-opacity-40 bg-[#f4ead5] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="font-[family-name:var(--font-bebas)] text-3xl uppercase text-[#f00] leading-none">
          gourou
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/orders" className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#1034b8] border border-[#1034b8] px-2 py-1">
            Orders
          </Link>
          <Link href="/shop" className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#fef3d8] border border-[#f00] bg-[#f00] px-2 py-1">
            Order
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[640px] px-4 py-8">
        <h1 className="font-[family-name:var(--font-bebas)] text-[clamp(3rem,8vw,5.5rem)] uppercase leading-none text-[#f00] mb-2">
          Rewards
        </h1>
        <p className="text-[10px] uppercase tracking-[0.1em] text-[#1034b8] mb-8">
          Earn 1 point per Rp12,000 spent
        </p>

        {loading ? (
          <div className="text-center py-12 text-[11px] uppercase tracking-[0.12em]">Loading…</div>
        ) : (
          <>
            <div className="border-2 border-[#1034b8] bg-[#1034b8] text-[#fff4de] p-6 mb-6">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] opacity-70">Your Balance</p>
              <p className="font-[family-name:var(--font-bebas)] text-[5rem] leading-none mt-1">
                {data.total_points}
              </p>
              <p className="font-[family-name:var(--font-bebas)] text-2xl uppercase leading-none opacity-70">
                points
              </p>
              {user && (
                <p className="mt-3 text-[10px] uppercase tracking-[0.1em] opacity-60">
                  {user.name ?? user.email}
                </p>
              )}
            </div>

            <div className="border border-[#1034b8] bg-[#eef3ff] px-4 py-3 mb-6">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#1034b8]">
                How points work
              </p>
              <p className="mt-1 text-[11px] text-[#1b140e] leading-relaxed">
                Earn <strong>1 point</strong> for every <strong>Rp12,000</strong> you spend. Points accumulate with every order.
              </p>
            </div>

            <h2 className="font-[family-name:var(--font-bebas)] text-2xl uppercase text-[#1b140e] mb-3">
              Transaction History
            </h2>

            {data.history.length === 0 ? (
              <div className="text-center py-10 border border-[#f00] border-opacity-20 bg-white">
                <p className="text-[11px] uppercase tracking-[0.1em] text-[#666]">No transactions yet</p>
                <Link href="/shop" className="mt-3 inline-block border border-[#f00] bg-[#f00] px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#fef3d8]">
                  Start Ordering
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {data.history.map((tx) => (
                  <div key={tx.id} className="border border-[#f00] border-opacity-20 bg-white px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#1b140e]">
                        {tx.note || (tx.type === "earned" ? "Points earned" : "Points redeemed")}
                      </p>
                      <p className="text-[9px] uppercase tracking-[0.08em] text-[#666] mt-0.5">
                        {formatDate(tx.created_at)}
                        {tx.order_id && (
                          <> · <Link href={`/orders/${tx.order_id}`} className="text-[#1034b8] underline">Order #{tx.order_id.slice(0, 8).toUpperCase()}</Link></>
                        )}
                      </p>
                    </div>
                    <span className={`font-[family-name:var(--font-bebas)] text-2xl ${tx.type === "earned" ? "text-[#16a34a]" : "text-[#f00]"}`}>
                      {tx.type === "earned" ? "+" : "−"}{tx.points}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
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
            <Link href="/rewards" className="flex w-full flex-col items-center gap-1 rounded-xl py-2 text-[#f00]">
              <span className="text-lg">★</span>
              <span className="text-[10px] font-extrabold uppercase leading-tight">Rewards</span>
            </Link>
          </li>
          <li>
            <Link href="/cart" className="-mt-7 flex h-16 w-full flex-col items-center justify-center rounded-2xl bg-[#f00] text-[#fff4de] shadow-[0_10px_24px_rgba(255,0,0,0.45)]">
              <span className="text-lg">🛍</span>
              <span className="text-[10px] font-extrabold uppercase">Cart</span>
            </Link>
          </li>
          <li>
            <Link href="/orders" className="flex w-full flex-col items-center gap-1 rounded-xl py-2 text-[#1034b8]">
              <span className="text-lg">👤</span>
              <span className="text-[10px] font-extrabold uppercase">Profile</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
