"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ButtonHoverLabel } from "../components/ButtonHoverLabel";
import {
  CART_CHANGED_EVENT,
  type CartItem,
  clearCart,
  formatUSD,
  getCartItems,
  setItemQuantity,
} from "../lib/cart";

const paymentMethods = [
  { id: "card", label: "Credit Card" },
  { id: "cash", label: "Cash" },
  { id: "wallet", label: "E-Wallet" },
  { id: "points", label: "Points + Cash" },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id);

  useEffect(() => {
    const sync = () => {
      setItems(getCartItems());
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(CART_CHANGED_EVENT, sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(CART_CHANGED_EVENT, sync);
    };
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const totalRewardPoints = useMemo(
    () => Math.ceil(subtotal * 0.1),
    [subtotal],
  );

  return (
    <main className="min-h-screen w-full bg-[#f4ead5] pb-24 md:pb-8">
      <header className="border-b-2 border-[#f00] p-4 md:p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#1034b8]">
          Your order
        </p>
        <h1 className="font-[family-name:var(--font-bebas)] text-[clamp(2.8rem,8vw,6rem)] uppercase leading-[0.85] text-[#f00]">
          Cart
        </h1>
      </header>

      <section className="border-b-2 border-[#f00]">
        {items.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#1034b8]">
              Your cart is empty.
            </p>
            <Link
              href="/menu"
              className="group mt-4 inline-flex items-center border border-[#f00] bg-[#f00] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de]"
            >
              <ButtonHoverLabel label="Browse menu" />
            </Link>
          </div>
        ) : (
          items.map((item, index) => (
            <article
              key={item.id}
              className={`grid gap-3 border-r border-t border-[#f00] p-4 md:grid-cols-[110px_1fr_auto] md:items-center ${
                index % 2 === 0 ? "bg-[#fff4de]" : "bg-[#fef3c7]"
              }`}
            >
              <div className="relative h-24 overflow-hidden rounded-lg border-2 border-[#1034b8]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-(family-name:--font-bebas) text-3xl uppercase leading-none text-[#1034b8]">
                  {item.name}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-[#f00]">
                  {formatUSD(item.price)} each
                </p>
                <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#1034b8]">
                  Earn {Math.ceil(item.price * item.quantity * 0.1)} pts
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setItemQuantity(item.id, item.quantity - 1)}
                  className="border border-[#1034b8] px-3 py-1 text-sm font-black text-[#1034b8]"
                >
                  -
                </button>
                <p className="min-w-8 text-center text-base font-black text-[#1f2937]">
                  {item.quantity}
                </p>
                <button
                  type="button"
                  onClick={() => setItemQuantity(item.id, item.quantity + 1)}
                  className="border border-[#1034b8] px-3 py-1 text-sm font-black text-[#1034b8]"
                >
                  +
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 p-4 md:p-6">
        <div className="grid gap-3">
          <p className="text-xl font-black uppercase text-[#f00]">
            Subtotal: {formatUSD(subtotal)}
          </p>
          <p className="text-sm font-black uppercase tracking-[0.08em] text-[#1034b8]">
            Rewards on this order: {totalRewardPoints} pts
          </p>
          <div className="flex flex-wrap gap-2">
            <p className="self-center text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#374151]">
              Payment:
            </p>
            {paymentMethods.map((method) => {
              const active = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] transition-colors ${
                    active
                      ? "border border-[#f00] bg-[#f00] text-[#fff4de]"
                      : "border border-[#1034b8] text-[#1034b8] hover:bg-[#dbeafe]"
                  }`}
                >
                  {method.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="group inline-flex items-center border border-[#f00] bg-[#f00] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de]"
          >
            <ButtonHoverLabel label="Purchase" />
          </button>
          <button
            type="button"
            onClick={clearCart}
            className="group inline-flex items-center border border-[#1034b8] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]"
          >
            <ButtonHoverLabel label="Clear cart" />
          </button>
          <Link
            href="/menu"
            className="group inline-flex items-center border border-[#f00] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#f00]"
          >
            <ButtonHoverLabel label="Back to menu" />
          </Link>
        </div>
      </footer>
    </main>
  );
}
