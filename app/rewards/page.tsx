"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MaskedLineReveal } from "../components/MaskedLineReveal";
import { ButtonHoverLabel } from "../components/ButtonHoverLabel";
import { useAuth } from "../context/AuthContext";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
};

type RedeemResult = {
  product_name: string;
  points_spent: number;
  points_earned: number;
  remaining: number;
};

const IDR_PER_POINT = 1000;

function pointsPrice(price: number): number {
  return Math.ceil(price / IDR_PER_POINT);
}

export default function RewardsPage() {
  const { token } = useAuth();
  const [currentPoints, setCurrentPoints] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemResult, setRedeemResult] = useState<RedeemResult | null>(null);
  const [redeemError, setRedeemError] = useState("");

  useEffect(() => {
    const fetches: Promise<void>[] = [
      fetch("/api/shop")
        .then((r) => r.json())
        .then((data: Product[]) => setProducts(Array.isArray(data) ? data : []))
        .catch(() => {}),
    ];
    if (token) {
      fetches.push(
        fetch("/api/points", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => r.json())
          .then((data) => {
            if (typeof data.total_points === "number") {
              setCurrentPoints(data.total_points);
            }
          })
          .catch(() => {}),
      );
    }
    Promise.all(fetches).finally(() => setLoading(false));
  }, [token]);

  const openModal = (product: Product) => {
    setSelected(product);
    setRedeemResult(null);
    setRedeemError("");
  };

  const closeModal = () => {
    setSelected(null);
    setRedeemResult(null);
    setRedeemError("");
  };

  const handleConfirmRedeem = async () => {
    if (!selected || !token) return;
    setRedeeming(true);
    setRedeemError("");
    const res = await fetch("/api/orders/redeem-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: selected.id }),
    });
    const data = await res.json();
    setRedeeming(false);
    if (!res.ok) {
      setRedeemError(data.error ?? "Redeem failed");
      return;
    }
    setCurrentPoints(data.points_summary.remaining);
    setRedeemResult({
      product_name: data.order.product_name,
      points_spent: data.order.points_spent,
      points_earned: data.order.points_earned,
      remaining: data.points_summary.remaining,
    });
    // update stock in local state
    setProducts((prev) =>
      prev.map((p) =>
        p.id === selected.id ? { ...p, stock: p.stock - 1 } : p,
      ),
    );
  };

  const canAfford = selected ? currentPoints >= pointsPrice(selected.price) : false;

  return (
    <main className="min-h-screen w-full bg-[#f4ead5] pb-24 md:pb-8">
      <header className="border-b-2 border-[#f00] p-4 md:p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#1034b8]">
          Pay with points
        </p>
        <h1 className="font-(family-name:--font-bebas) text-[clamp(2.8rem,8vw,6rem)] uppercase leading-[0.85] text-[#f00]">
          Points Menu
        </h1>
        <p className="max-w-2xl text-sm font-semibold uppercase tracking-[0.08em] text-[#1034b8]">
          Redeem loyalty points for menu items. 1 pt = Rp1,000.
        </p>
        <p className="mt-3 text-sm font-black uppercase tracking-[0.08em] text-[#f00]">
          Your points: {currentPoints}
        </p>
      </header>

      <section className="grid grid-cols-1 border-b-2 border-[#f00] md:grid-cols-2">
        {loading ? (
          <p className="col-span-2 p-8 text-center text-sm font-extrabold uppercase tracking-[0.08em] text-[#1034b8]">
            Loading…
          </p>
        ) : products.length === 0 ? (
          <p className="col-span-2 p-8 text-center text-sm font-extrabold uppercase tracking-[0.08em] text-[#1034b8]">
            No items available.
          </p>
        ) : (
          products.map((product, index) => {
            const pts = pointsPrice(product.price);
            const affordable = currentPoints >= pts;
            const outOfStock = product.stock < 1;
            return (
              <article
                key={product.id}
                className={`border-r border-t border-[#f00] p-4 ${index % 2 === 0 ? "bg-[#fee2e2]" : "bg-[#fff4de]"}`}
              >
                <div className="relative mb-3 h-40 overflow-hidden rounded-lg border-2 border-[#1034b8] md:h-64">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                  />
                </div>
                <MaskedLineReveal
                  as="p"
                  lines={[product.name]}
                  className="font-(family-name:--font-bebas) text-4xl uppercase leading-none text-[#f00]"
                />
                {product.description && (
                  <MaskedLineReveal
                    as="p"
                    lines={[product.description]}
                    className="mt-2 text-xs font-bold uppercase tracking-[0.07em] text-[#1f2937]"
                  />
                )}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <MaskedLineReveal
                    as="p"
                    lines={[`${pts} pts`]}
                    className={`text-lg font-extrabold uppercase ${affordable ? "text-[#1034b8]" : "text-[#9ca3af]"}`}
                  />
                  <button
                    type="button"
                    onClick={() => openModal(product)}
                    disabled={outOfStock || !token}
                    className="group inline-flex items-center border border-[#1034b8] bg-[#1034b8] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de] disabled:opacity-40"
                  >
                    <ButtonHoverLabel
                      label={outOfStock ? "Sold out" : "Redeem"}
                      className="leading-none"
                    />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>

      <footer className="flex flex-wrap gap-2 p-4 md:p-6">
        <Link
          href="/profile"
          className="group inline-flex items-center border border-[#1034b8] px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]"
        >
          <ButtonHoverLabel label="Manage points" />
        </Link>
        <Link
          href="/menu"
          className="group inline-flex items-center border border-[#f00] px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#f00]"
        >
          <ButtonHoverLabel label="Pay with money" />
        </Link>
      </footer>

      {selected && (
        <div className="fixed inset-0 z-70 grid place-items-center bg-black/55 p-4">
          <div className="w-full max-w-2xl border-2 border-[#f00] bg-[#fff4de] p-5 md:p-8">
            {redeemResult ? (
              <>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]">
                  Redeemed!
                </p>
                <h2 className="font-(family-name:--font-bebas) text-[clamp(2rem,5vw,3.3rem)] uppercase leading-[0.9] text-[#f00]">
                  Enjoy your {redeemResult.product_name}!
                </h2>
                <div className="mt-4 grid gap-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                  <p>
                    Points spent:{" "}
                    <span className="text-[#f00]">-{redeemResult.points_spent} pts</span>
                  </p>
                  {redeemResult.points_earned > 0 && (
                    <p>
                      Points earned:{" "}
                      <span className="text-[#1034b8]">+{redeemResult.points_earned} pts</span>
                    </p>
                  )}
                  <p>
                    Remaining balance:{" "}
                    <span className="text-[#1034b8]">{redeemResult.remaining} pts</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="group mt-5 inline-flex items-center border border-[#1034b8] bg-[#1034b8] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de]"
                >
                  <ButtonHoverLabel label="Close" />
                </button>
              </>
            ) : (
              <>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]">
                  Redeem confirmation
                </p>
                <h2 className="font-(family-name:--font-bebas) text-[clamp(2rem,5vw,3.3rem)] uppercase leading-[0.9] text-[#f00]">
                  {selected.name}
                </h2>

                <div className="mt-4 grid gap-4 md:grid-cols-[180px_1fr] md:items-start">
                  <div className="relative h-36 overflow-hidden rounded-lg border-2 border-[#1034b8] md:h-44">
                    <Image
                      src={selected.image_url}
                      alt={selected.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="grid gap-3 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                    <p>
                      Your balance:{" "}
                      <span className="text-[#1034b8]">{currentPoints} pts</span>
                    </p>
                    <p>
                      This item costs:{" "}
                      <span className="text-[#f00]">{pointsPrice(selected.price)} pts</span>
                    </p>
                    {!canAfford && (
                      <p className="text-[#f00]">Not enough points.</p>
                    )}
                    {redeemError && (
                      <p className="text-[#f00]">{redeemError}</p>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmRedeem}
                    disabled={!canAfford || redeeming}
                    className="group inline-flex items-center border border-[#f00] bg-[#f00] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de] disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    <ButtonHoverLabel label={redeeming ? "Processing…" : "Confirm redeem"} />
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={redeeming}
                    className="group inline-flex items-center border border-[#1034b8] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8] disabled:opacity-50"
                  >
                    <ButtonHoverLabel label="Cancel" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
