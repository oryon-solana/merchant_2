"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
}

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

export default function ShopPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch("/api/shop")
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch("/api/cart", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setCartCount(data.items?.length ?? 0))
      .catch(() => {});
  }, [token]);

  const addToCart = async (productId: string, productName: string) => {
    if (!user || !token) {
      router.push("/login");
      return;
    }
    setAdding(productId);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ product_id: productId }),
      });
      if (res.ok) {
        setCartCount((c) => c + 1);
        setToast(`${productName} added to cart`);
        setTimeout(() => setToast(""), 2500);
      }
    } finally {
      setAdding(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4ead5] pb-24 md:pb-8">
      <header className="border-b-2 border-[#f00] border-opacity-40 bg-[#f4ead5] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="font-[family-name:var(--font-bebas)] text-3xl uppercase text-[#f00] leading-none">
          gourou
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/rewards" className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#1034b8] border border-[#1034b8] px-2 py-1 hidden md:block">
                ★ Rewards
              </Link>
              <Link href="/orders" className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#1034b8] border border-[#1034b8] px-2 py-1 hidden md:block">
                Orders
              </Link>
            </>
          ) : (
            <Link href="/login" className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#1034b8] border border-[#1034b8] px-2 py-1">
              Sign In
            </Link>
          )}
          <Link href="/cart" className="relative border border-[#f00] bg-[#f00] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#fef3d8]">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-[#1034b8] text-[9px] font-extrabold text-white flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="mb-6">
          <h1 className="font-[family-name:var(--font-bebas)] text-[clamp(3rem,8vw,6rem)] uppercase leading-none text-[#f00]">
            Our Menu
          </h1>
          <p className="text-[10px] uppercase tracking-[0.1em] text-[#1034b8]">
            Earn 1 point for every Rp12,000 spent
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[11px] uppercase tracking-[0.12em] text-[#1b140e]">Loading menu…</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <article key={product.id} className="border border-[#f00] border-opacity-40 bg-white flex flex-col">
                <div className="h-32 bg-[linear-gradient(135deg,#f97316_0%,#ef4444_50%,#1d4ed8_100%)]" />
                <div className="p-3 flex flex-col flex-1">
                  <h2 className="font-[family-name:var(--font-bebas)] text-xl uppercase leading-tight text-[#1b140e]">
                    {product.name}
                  </h2>
                  {product.description && (
                    <p className="mt-1 text-[10px] uppercase leading-tight text-[#666] flex-1">
                      {product.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="font-extrabold text-[13px] text-[#1b140e]">
                      {formatIDR(product.price)}
                    </span>
                    <button
                      onClick={() => addToCart(product.id, product.name)}
                      disabled={adding === product.id || product.stock === 0}
                      className="border border-[#f00] bg-[#f00] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#fef3d8] disabled:opacity-40"
                    >
                      {product.stock === 0 ? "Sold Out" : adding === product.id ? "Adding…" : "Add"}
                    </button>
                  </div>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.08em] text-[#999]">
                    Stock: {product.stock}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#1034b8] text-[#fff4de] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.12em] z-50 md:bottom-6">
          {toast}
        </div>
      )}

      <nav className="fixed inset-x-3 bottom-3 z-50 rounded-3xl border border-[#e2d2b3] bg-white/95 p-2 shadow-[0_14px_32px_rgba(0,0,0,0.28)] backdrop-blur md:hidden">
        <ul className="grid grid-cols-4 items-end text-center">
          <li>
            <Link href="/shop" className="flex w-full flex-col items-center gap-1 rounded-xl py-2 text-[#f00]">
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
            <Link href="/cart" className="relative -mt-7 flex h-16 w-full flex-col items-center justify-center rounded-2xl bg-[#f00] text-[#fff4de] shadow-[0_10px_24px_rgba(255,0,0,0.45)]">
              <span className="text-lg">🛍</span>
              <span className="text-[10px] font-extrabold uppercase">Cart</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-2 h-4 w-4 rounded-full bg-[#1034b8] text-[9px] font-extrabold text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link href={user ? "/orders" : "/login"} className="flex w-full flex-col items-center gap-1 rounded-xl py-2 text-[#1034b8]">
              <span className="text-lg">👤</span>
              <span className="text-[10px] font-extrabold uppercase">Profile</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
