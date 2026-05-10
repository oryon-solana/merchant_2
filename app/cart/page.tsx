"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ButtonHoverLabel } from "../components/ButtonHoverLabel";
import { useAuth } from "../context/AuthContext";

type CartProduct = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url: string;
};

type CartItem = {
  id: string;
  quantity: number;
  product: CartProduct;
};

function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

const POINTS_PER_IDR = 12000; // 1 point earned per Rp12,000 spent
const IDR_PER_POINT = 1000;   // 1 point redeems Rp1,000

const paymentMethods = [
  { id: "card", label: "Credit Card" },
  { id: "cash", label: "Cash" },
  { id: "wallet", label: "E-Wallet" },
];

type OrderResult = {
  points_earned: number;
  points_spent: number;
  total_amount: number;
  paid_with_points: boolean;
};

export default function CartPage() {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id);
  const [purchasing, setPurchasing] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState("");
  const [userPoints, setUserPoints] = useState<number>(0);

  const fetchCart = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const [cartRes, pointsRes] = await Promise.all([
      fetch("/api/cart", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("/api/points", { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    if (cartRes.ok) {
      const data = await cartRes.json();
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    }
    if (pointsRes.ok) {
      const data = await pointsRes.json();
      setUserPoints(data.total_points ?? 0);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      router.replace("/signin");
      return;
    }
    fetchCart();
  }, [authLoading, token, fetchCart, router]);

  const pointsToEarn = useMemo(() => Math.floor(total / POINTS_PER_IDR), [total]);
  const pointsCost = useMemo(() => Math.ceil(total / IDR_PER_POINT), [total]);
  const canPayWithPoints = userPoints >= pointsCost && pointsCost > 0;

  const updateQuantity = async (itemId: string, newQty: number) => {
    if (!token || newQty < 1) return;
    await fetch(`/api/cart/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity: newQty }),
    });
    fetchCart();
  };

  const removeItem = async (itemId: string) => {
    if (!token) return;
    await fetch(`/api/cart/${itemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCart();
  };

  const clearCart = async () => {
    if (!token || items.length === 0) return;
    await Promise.all(
      items.map((item) =>
        fetch(`/api/cart/${item.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }),
      ),
    );
    fetchCart();
  };

  const handlePurchase = async () => {
    if (!token || items.length === 0) return;
    setError("");
    setPurchasing(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPurchasing(false);
    if (!res.ok) {
      setError(data.error ?? "Purchase failed");
      return;
    }
    setOrderResult({
      points_earned: data.order.points_earned,
      points_spent: 0,
      total_amount: data.order.total_amount,
      paid_with_points: false,
    });
  };

  const handlePayWithPoints = async () => {
    if (!token || items.length === 0 || !canPayWithPoints) return;
    setError("");
    setPurchasing(true);
    const res = await fetch("/api/orders/redeem", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPurchasing(false);
    if (!res.ok) {
      setError(data.error ?? "Redeem failed");
      return;
    }
    setOrderResult({
      points_earned: data.order.points_earned,
      points_spent: data.order.points_spent,
      total_amount: data.order.total_amount,
      paid_with_points: true,
    });
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen w-full bg-[#f4ead5] flex items-center justify-center">
        <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#1034b8]">
          Loading cart…
        </p>
      </main>
    );
  }

  if (orderResult) {
    return (
      <main className="min-h-screen w-full bg-[#f4ead5] px-4 py-8 md:px-6">
        <section className="mx-auto w-full max-w-2xl border-2 border-[#f00] bg-[#fff4de] p-5 md:p-7">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]">
            Order placed
          </p>
          <h1 className="font-[family-name:var(--font-bebas)] text-[clamp(2.8rem,8vw,5.5rem)] uppercase leading-[0.85] text-[#f00]">
            Thank You!
          </h1>
          <div className="mt-4 grid gap-2">
            <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#374151]">
              Total:{" "}
              <span className="text-[#f00]">
                {formatIDR(orderResult.total_amount)}
              </span>
            </p>
            {orderResult.paid_with_points ? (
              <>
                <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                  Paid with:{" "}
                  <span className="text-[#1034b8]">
                    {orderResult.points_spent} pts
                  </span>
                </p>
                {orderResult.points_earned > 0 && (
                  <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                    Points earned:{" "}
                    <span className="text-[#1034b8]">
                      +{orderResult.points_earned} pts
                    </span>
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                Points earned:{" "}
                <span className="text-[#1034b8]">
                  +{orderResult.points_earned} pts
                </span>
              </p>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/menu"
              className="group inline-flex items-center border border-[#f00] bg-[#f00] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de]"
            >
              <ButtonHoverLabel label="Order again" />
            </Link>
            <Link
              href="/profile"
              className="group inline-flex items-center border border-[#1034b8] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]"
            >
              <ButtonHoverLabel label="View points" />
            </Link>
          </div>
        </section>
      </main>
    );
  }

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
                  src={item.product.image_url}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-(family-name:--font-bebas) text-3xl uppercase leading-none text-[#1034b8]">
                  {item.product.name}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-[#f00]">
                  {formatIDR(item.product.price)} each
                </p>
                <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#1034b8]">
                  {Math.ceil((item.product.price * item.quantity) / IDR_PER_POINT)} pts to redeem ·{" "}
                  earn {Math.floor((item.product.price * item.quantity) / POINTS_PER_IDR)} pts
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="border border-[#1034b8] px-3 py-1 text-sm font-black text-[#1034b8]"
                >
                  -
                </button>
                <p className="min-w-8 text-center text-base font-black text-[#1f2937]">
                  {item.quantity}
                </p>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="border border-[#1034b8] px-3 py-1 text-sm font-black text-[#1034b8]"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove item"
                  className="ml-2 border border-[#f00] px-2 py-1 text-sm font-black text-[#f00] hover:bg-[#fee2e2]"
                >
                  ×
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 p-4 md:p-6">
        <div className="grid gap-3">
          <p className="text-xl font-black uppercase text-[#f00]">
            Subtotal: {formatIDR(total)}
          </p>
          <div className="flex flex-wrap gap-4 text-sm font-black uppercase tracking-[0.08em]">
            <p className="text-[#1034b8]">
              Earn: {pointsToEarn} pts
            </p>
            <p className="text-[#374151]">
              Redeem cost: {pointsCost} pts
            </p>
            <p className={canPayWithPoints ? "text-green-700" : "text-[#f00]"}>
              Your balance: {userPoints} pts
            </p>
          </div>
          {error && (
            <p className="text-[11px] font-bold uppercase text-[#f00]">
              {error}
            </p>
          )}
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
            onClick={handlePurchase}
            disabled={purchasing || items.length === 0}
            className="group inline-flex items-center border border-[#f00] bg-[#f00] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de] disabled:opacity-50"
          >
            <ButtonHoverLabel label={purchasing ? "Processing…" : "Purchase"} />
          </button>
          <button
            type="button"
            onClick={handlePayWithPoints}
            disabled={purchasing || items.length === 0 || !canPayWithPoints}
            title={
              !canPayWithPoints
                ? `Need ${pointsCost} pts, you have ${userPoints}`
                : `Pay using ${pointsCost} of your ${userPoints} pts`
            }
            className="group inline-flex items-center border border-[#1034b8] bg-[#1034b8] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de] disabled:opacity-40"
          >
            <ButtonHoverLabel
              label={purchasing ? "Processing…" : `Pay with ${pointsCost} pts`}
            />
          </button>
          <button
            type="button"
            onClick={clearCart}
            disabled={items.length === 0}
            className="group inline-flex items-center border border-[#1034b8] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8] disabled:opacity-50"
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
