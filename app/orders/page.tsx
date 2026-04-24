"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface Order {
  id: string;
  total_amount: number;
  points_earned: number;
  status: string;
  created_at: string;
}

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function OrdersPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push("/login"); return; }
    fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [user, token, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#f4ead5] pb-24 md:pb-8">
      <header className="border-b-2 border-[#f00] border-opacity-40 bg-[#f4ead5] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="font-[family-name:var(--font-bebas)] text-3xl uppercase text-[#f00] leading-none">
          gourou
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/rewards" className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#1034b8] border border-[#1034b8] px-2 py-1">
            ★ Rewards
          </Link>
          <Link href="/shop" className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#f00] border border-[#f00] bg-[#f00] px-2 py-1 text-[#fef3d8]">
            Order
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[800px] px-4 py-8">
        <div className="mb-6 flex items-end justify-between">
          <h1 className="font-[family-name:var(--font-bebas)] text-[clamp(3rem,8vw,5.5rem)] uppercase leading-none text-[#f00]">
            Orders
          </h1>
          {user && (
            <p className="text-[10px] uppercase tracking-[0.1em] text-[#1034b8]">
              {user.name ?? user.email}
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-[11px] uppercase tracking-[0.12em]">Loading…</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-[family-name:var(--font-bebas)] text-3xl uppercase text-[#1034b8]">No orders yet</p>
            <Link href="/shop" className="mt-4 inline-block border border-[#f00] bg-[#f00] px-6 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#fef3d8]">
              Start Ordering
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block border border-[#f00] border-opacity-30 bg-white p-4 hover:border-opacity-100 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-[family-name:var(--font-bebas)] text-lg uppercase leading-tight text-[#1b140e]">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.08em] text-[#666] mt-0.5">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-extrabold text-[14px]">{formatIDR(order.total_amount)}</p>
                    <span className={`text-[9px] font-extrabold uppercase tracking-[0.12em] ${order.status === "paid" ? "text-green-700" : "text-[#f00]"}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                {order.points_earned > 0 && (
                  <div className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#1034b8]">
                    ★ +{order.points_earned} point{order.points_earned !== 1 ? "s" : ""} earned
                  </div>
                )}
              </Link>
            ))}
          </div>
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
            <Link href="/rewards" className="flex w-full flex-col items-center gap-1 rounded-xl py-2 text-[#1034b8]">
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
            <Link href="/orders" className="flex w-full flex-col items-center gap-1 rounded-xl py-2 text-[#f00]">
              <span className="text-lg">👤</span>
              <span className="text-[10px] font-extrabold uppercase">Profile</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
