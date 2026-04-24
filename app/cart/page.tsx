"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface CartProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url: string | null;
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

export default function CartPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<CartData>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!token) return;
    const res = await fetch("/api/cart", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setCart({ items: data.items ?? [], total: data.total ?? 0 });
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push("/login"); return; }
    fetchCart();
  }, [user, token, isLoading, router, fetchCart]);

  const updateQty = async (itemId: string, qty: number) => {
    if (qty < 1) return;
    setUpdating(itemId);
    await fetch(`/api/cart/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ quantity: qty }),
    });
    await fetchCart();
    setUpdating(null);
  };

  const removeItem = async (itemId: string) => {
    setUpdating(itemId);
    await fetch(`/api/cart/${itemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchCart();
    setUpdating(null);
  };

  const pointsPreview = Math.floor(cart.total / POINTS_RATE);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-[#f4ead5] flex items-center justify-center">
        <p className="text-[11px] uppercase tracking-[0.12em]">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4ead5] pb-24 md:pb-8">
      <header className="border-b-2 border-[#f00] border-opacity-40 bg-[#f4ead5] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="font-[family-name:var(--font-bebas)] text-3xl uppercase text-[#f00] leading-none">
          gourou
        </Link>
        <Link href="/shop" className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#1034b8] border border-[#1034b8] px-3 py-1">
          ← Menu
        </Link>
      </header>

      <main className="mx-auto max-w-[800px] px-4 py-8">
        <h1 className="font-[family-name:var(--font-bebas)] text-[clamp(3rem,8vw,5.5rem)] uppercase leading-none text-[#f00] mb-6">
          Your Cart
        </h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-[family-name:var(--font-bebas)] text-3xl uppercase text-[#1034b8]">Cart is empty</p>
            <Link href="/shop" className="mt-4 inline-block border border-[#f00] bg-[#f00] px-6 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#fef3d8]">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-[1fr_320px]">
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.id} className="border border-[#f00] border-opacity-30 bg-white flex gap-3 p-3">
                  <div className="w-16 h-16 shrink-0 bg-[linear-gradient(135deg,#f97316,#ef4444)]" />
                  <div className="flex-1 min-w-0">
                    <p className="font-[family-name:var(--font-bebas)] text-lg uppercase leading-tight">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] font-extrabold text-[#1b140e]">
                      {formatIDR(item.product.price)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        disabled={updating === item.id}
                        className="w-6 h-6 border border-[#1b140e] flex items-center justify-center text-sm font-bold disabled:opacity-40"
                      >
                        −
                      </button>
                      <span className="text-[13px] font-extrabold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        disabled={updating === item.id || item.quantity >= item.product.stock}
                        className="w-6 h-6 border border-[#1b140e] flex items-center justify-center text-sm font-bold disabled:opacity-40"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={updating === item.id}
                        className="ml-2 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#f00] disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-extrabold text-[13px]">{formatIDR(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-2 border-[#f00] bg-white p-4 h-fit sticky top-20">
              <h2 className="font-[family-name:var(--font-bebas)] text-2xl uppercase text-[#1b140e] mb-3">
                Summary
              </h2>
              <div className="space-y-2 text-[11px] uppercase tracking-[0.08em]">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="truncate pr-2">{item.product.name} ×{item.quantity}</span>
                    <span className="font-bold shrink-0">{formatIDR(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-[#f00] border-opacity-30 pt-2 flex justify-between font-extrabold text-[13px]">
                  <span>Total</span>
                  <span>{formatIDR(cart.total)}</span>
                </div>
              </div>

              {pointsPreview > 0 && (
                <div className="mt-3 border border-[#1034b8] bg-[#eef3ff] px-3 py-2 text-[10px] text-[#1034b8] font-extrabold uppercase tracking-[0.1em]">
                  ★ You will earn {pointsPreview} point{pointsPreview !== 1 ? "s" : ""}
                </div>
              )}

              <button
                onClick={() => router.push("/checkout")}
                className="mt-4 w-full border border-[#f00] bg-[#f00] py-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#fef3d8]"
              >
                Proceed to Payment
              </button>
            </div>
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
