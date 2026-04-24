"use client";

import { useEffect, useState, useCallback, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface CartProduct {
  id: string;
  name: string;
  price: number;
}

interface CartItem {
  id: string;
  quantity: number;
  product: CartProduct;
}

interface CartData {
  items: CartItem[];
  total: number;
}

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

const POINTS_RATE = 12000;

export default function CheckoutPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<CartData>({ items: [], total: 0 });
  const [loadingCart, setLoadingCart] = useState(true);
  const [paying, setPaying] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const fetchCart = useCallback(async () => {
    if (!token) return;
    const res = await fetch("/api/cart", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setCart({ items: data.items ?? [], total: data.total ?? 0 });
    setLoadingCart(false);
  }, [token]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push("/login"); return; }
    fetchCart();
  }, [user, token, isLoading, router, fetchCart]);

  const handlePay = async (e: FormEvent) => {
    e.preventDefault();
    setPaying(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Payment failed");
      router.push(`/orders/${data.order.id}?success=1`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Payment failed");
      setPaying(false);
    }
  };

  const formatCard = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const pointsPreview = Math.floor(cart.total / POINTS_RATE);

  if (isLoading || loadingCart) {
    return (
      <div className="min-h-screen bg-[#f4ead5] flex items-center justify-center">
        <p className="text-[11px] uppercase tracking-[0.12em]">Loading…</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f4ead5] flex flex-col items-center justify-center gap-4">
        <p className="font-[family-name:var(--font-bebas)] text-3xl uppercase text-[#1034b8]">Cart is empty</p>
        <Link href="/shop" className="border border-[#f00] bg-[#f00] px-6 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#fef3d8]">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4ead5]">
      <header className="border-b-2 border-[#f00] border-opacity-40 bg-[#f4ead5] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="font-[family-name:var(--font-bebas)] text-3xl uppercase text-[#f00] leading-none">
          gourou
        </Link>
        <Link href="/cart" className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#1034b8] border border-[#1034b8] px-3 py-1">
          ← Cart
        </Link>
      </header>

      <main className="mx-auto max-w-[800px] px-4 py-8">
        <h1 className="font-[family-name:var(--font-bebas)] text-[clamp(3rem,8vw,5.5rem)] uppercase leading-none text-[#f00] mb-2">
          Payment
        </h1>
        <p className="text-[10px] uppercase tracking-[0.1em] text-[#1034b8] mb-8">
          Mock payment — no real charge will be made
        </p>

        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          <form onSubmit={handlePay} className="space-y-5">
            <div className="border-2 border-[#1034b8] bg-[#eef3ff] px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#1034b8]">
                Demo Mode — enter any values to complete payment
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#1b140e] mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
                className="w-full border border-[#1b140e] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#1034b8]"
                placeholder="Name on card"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#1b140e] mb-1">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCard(e.target.value))}
                required
                className="w-full border border-[#1b140e] bg-white px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#1034b8]"
                placeholder="0000 0000 0000 0000"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#1b140e] mb-1">
                  Expiry
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  required
                  className="w-full border border-[#1b140e] bg-white px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#1034b8]"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#1b140e] mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  required
                  className="w-full border border-[#1b140e] bg-white px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#1034b8]"
                  placeholder="•••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={paying}
              className="w-full border border-[#f00] bg-[#f00] py-4 text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#fef3d8] disabled:opacity-50"
            >
              {paying ? "Processing…" : `Pay ${formatIDR(cart.total)}`}
            </button>
          </form>

          <div className="border-2 border-[#f00] bg-white p-4 h-fit">
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl uppercase text-[#1b140e] mb-3">
              Order Summary
            </h2>
            <div className="space-y-2">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-[11px] uppercase tracking-[0.06em]">
                  <span className="truncate pr-2">{item.product.name} ×{item.quantity}</span>
                  <span className="font-bold shrink-0">{formatIDR(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-[#f00] border-opacity-30 pt-3 flex justify-between font-extrabold">
              <span className="text-[11px] uppercase">Total</span>
              <span className="text-[14px]">{formatIDR(cart.total)}</span>
            </div>
            {pointsPreview > 0 && (
              <div className="mt-3 border border-[#1034b8] bg-[#eef3ff] px-3 py-2 text-[10px] text-[#1034b8] font-extrabold uppercase tracking-[0.1em]">
                ★ You will earn {pointsPreview} point{pointsPreview !== 1 ? "s" : ""} after payment
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
