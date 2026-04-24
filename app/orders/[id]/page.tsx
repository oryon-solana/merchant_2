"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

interface OrderItem {
  id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

interface OrderDetail {
  id: string;
  total_amount: number;
  points_earned: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function OrderDetailPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "1";
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push("/login"); return; }
    const id = params.id as string;
    fetch(`/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => { if (data) setOrder(data); })
      .finally(() => setLoading(false));
  }, [user, token, isLoading, router, params.id]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-[#f4ead5] flex items-center justify-center">
        <p className="text-[11px] uppercase tracking-[0.12em]">Loading…</p>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen bg-[#f4ead5] flex flex-col items-center justify-center gap-4">
        <p className="font-[family-name:var(--font-bebas)] text-3xl uppercase text-[#f00]">Order not found</p>
        <Link href="/orders" className="border border-[#1034b8] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4ead5] pb-8">
      <header className="border-b-2 border-[#f00] border-opacity-40 bg-[#f4ead5] px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-[family-name:var(--font-bebas)] text-3xl uppercase text-[#f00] leading-none">
          gourou
        </Link>
        <Link href="/orders" className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#1034b8] border border-[#1034b8] px-3 py-1">
          ← Orders
        </Link>
      </header>

      <main className="mx-auto max-w-[640px] px-4 py-8">
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 border-2 border-[#16a34a] bg-[#f0fdf4] px-4 py-4 text-center"
          >
            <p className="font-[family-name:var(--font-bebas)] text-2xl uppercase text-[#16a34a]">
              Payment Successful!
            </p>
            {order.points_earned > 0 && (
              <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#1034b8]">
                ★ You earned {order.points_earned} point{order.points_earned !== 1 ? "s" : ""}!
              </p>
            )}
          </motion.div>
        )}

        <div className="mb-4 flex items-end justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-bebas)] text-[2.8rem] uppercase leading-none text-[#f00]">
              Order Details
            </h1>
            <p className="text-[10px] uppercase tracking-[0.08em] text-[#666]">
              #{order.id.slice(0, 8).toUpperCase()} · {formatDate(order.created_at)}
            </p>
          </div>
          <span className={`text-[10px] font-extrabold uppercase tracking-[0.12em] border px-2 py-1 ${order.status === "paid" ? "border-green-600 text-green-700" : "border-[#f00] text-[#f00]"}`}>
            {order.status}
          </span>
        </div>

        <div className="border border-[#f00] border-opacity-30 bg-white p-4 space-y-3">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-[12px]">
              <div>
                <p className="font-extrabold uppercase">{item.product_name}</p>
                <p className="text-[10px] text-[#666] uppercase">{formatIDR(item.product_price)} × {item.quantity}</p>
              </div>
              <p className="font-extrabold">{formatIDR(item.subtotal)}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 border-2 border-[#f00] bg-white p-4">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.1em]">Total Paid</span>
            <span className="font-[family-name:var(--font-bebas)] text-2xl text-[#f00]">{formatIDR(order.total_amount)}</span>
          </div>
          {order.points_earned > 0 && (
            <div className="mt-2 flex justify-between items-center border-t border-[#f00] border-opacity-20 pt-2">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#1034b8]">★ Points Earned</span>
              <span className="font-extrabold text-[#1034b8]">+{order.points_earned}</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/shop"
            className="flex-1 text-center border border-[#f00] bg-[#f00] py-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#fef3d8]"
          >
            Order Again
          </Link>
          <Link
            href="/rewards"
            className="flex-1 text-center border-2 border-[#1034b8] py-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]"
          >
            ★ View Rewards
          </Link>
        </div>
      </main>
    </div>
  );
}
