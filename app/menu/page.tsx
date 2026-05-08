"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function MenuPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch("/api/shop")
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProducts(data);
        if (data.length > 0) setSelectedId(data[0].id);
      })
      .finally(() => setLoadingProducts(false));
  }, []);

  const selectedItem = useMemo(
    () => products.find((p) => p.id === selectedId) ?? products[0] ?? null,
    [selectedId, products],
  );

  const openOrderModal = (item: Product) => {
    setSelectedId(item.id);
    setQuantity(1);
    setAddError("");
    setAddSuccess(false);
    setModalOpen(true);
  };

  const closeOrderModal = () => {
    setModalOpen(false);
  };

  const handleAddToOrder = async () => {
    if (!selectedItem) return;
    if (!token) {
      router.push("/signin");
      return;
    }
    setAddError("");
    setAdding(true);
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: selectedItem.id, quantity }),
    });
    setAdding(false);
    if (!res.ok) {
      const data = await res.json();
      setAddError(data.error ?? "Failed to add to cart");
      return;
    }
    setAddSuccess(true);
    setTimeout(closeOrderModal, 700);
  };

  return (
    <main className="min-h-screen w-full bg-[#f4ead5] pb-24 md:pb-8">
      <header className="border-b-2 border-[#f00] p-4 md:p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#1034b8]">Menu</p>
        <h1 className="font-(family-name:--font-bebas) text-[clamp(2.8rem,8vw,6rem)] uppercase leading-[0.85] text-[#f00]">
          Main Menu
        </h1>
        <p className="max-w-xl text-sm font-semibold uppercase tracking-[0.08em] text-[#1034b8]">
          Flame-grilled classics, crispy favorites, and all-american fast food.
        </p>
      </header>

      {loadingProducts ? (
        <div className="p-6 text-center text-sm font-extrabold uppercase tracking-[0.08em] text-[#1034b8]">
          Loading menu…
        </div>
      ) : (
        <section className="grid grid-cols-1 border-b-2 border-[#f00] md:grid-cols-2">
          {products.map((item, index) => (
            <article
              key={item.id}
              className={`border-r border-t border-[#f00] p-4 flex flex-col ${index % 2 === 0 ? "bg-[#fff4de]" : "bg-[#fef3c7]"}`}
            >
              <div className="h-40 md:h-84 relative mb-3 rounded-lg overflow-hidden border-2 border-[#1034b8]">
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                />
              </div>
              <MaskedLineReveal
                as="p"
                lines={[item.name]}
                className="font-(family-name:--font-bebas) text-2xl md:text-4xl uppercase leading-none text-[#1034b8]"
              />
              <MaskedLineReveal
                as="p"
                lines={[item.description]}
                className="mt-2 text-xs font-bold uppercase tracking-[0.07em] text-[#1f2937]"
              />
              <div className="mt-4 flex items-center justify-between">
                <MaskedLineReveal
                  as="p"
                  lines={[formatIDR(item.price)]}
                  className="text-lg font-extrabold uppercase text-[#f00]"
                />
                <button
                  type="button"
                  onClick={() => openOrderModal(item)}
                  className="group inline-flex items-center border border-[#f00] bg-[#f00] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de] hover:bg-[#dc2626] transition-colors"
                >
                  <ButtonHoverLabel label="Add to order" className="leading-none" />
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      <footer className="flex flex-wrap gap-2 p-4 md:p-6">
        <Link
          href="/rewards"
          className="group inline-flex items-center border border-[#1034b8] px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8] hover:bg-[#f4ead5] transition-colors"
        >
          <ButtonHoverLabel label="See points deals" />
        </Link>
        <Link
          href="/"
          className="group inline-flex items-center border border-[#f00] px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#f00] hover:bg-[#fecaca] transition-colors"
        >
          <ButtonHoverLabel label="Back home" />
        </Link>
      </footer>

      {isModalOpen && selectedItem ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/55 p-4">
          <div className="w-full max-w-3xl border-2 border-[#f00] bg-[#fff4de] p-5 md:p-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]">
              Build your order
            </p>
            <h2 className="font-(family-name:--font-bebas) text-[clamp(2rem,5vw,3.3rem)] uppercase leading-[0.9] text-[#f00]">
              Add Menu Item
            </h2>

            {addError && (
              <div className="mt-2 border border-[#f00] bg-[#fff0f0] px-3 py-2 text-[11px] font-bold uppercase text-[#f00]">
                {addError}
              </div>
            )}
            {addSuccess && (
              <div className="mt-2 border border-green-600 bg-green-50 px-3 py-2 text-[11px] font-bold uppercase text-green-700">
                Added to cart!
              </div>
            )}

            <div className="mt-4 grid gap-5 md:grid-cols-[220px_1fr] md:items-center">
              <div className="relative h-44 overflow-hidden rounded-lg border-2 border-[#1034b8] md:h-52">
                <Image
                  src={selectedItem.image_url}
                  alt={selectedItem.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid gap-3">
                <p className="font-(family-name:--font-bebas) text-3xl uppercase leading-none text-[#1034b8]">
                  {selectedItem.name}
                </p>

                <div className="grid gap-2 px-1 py-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                    Quantity
                  </p>
                  <div className="inline-flex w-fit items-center rounded-md">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="rounded-full border border-[#1034b8] px-3 py-1 text-base font-black text-[#1034b8] hover:bg-[#bfdbfe]"
                    >
                      -
                    </button>
                    <p className="min-w-10 px-3 py-1 text-center text-sm font-black text-[#1f2937]">
                      {quantity}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) => Math.min(selectedItem.stock, q + 1))
                      }
                      className="rounded-full border border-[#1034b8] px-3 py-1 text-base font-black text-[#1034b8] hover:bg-[#bfdbfe]"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid gap-1 bg-[#fff4de]/60 px-1 py-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                    Price per item:{" "}
                    <span className="text-[#f00]">
                      {formatIDR(selectedItem.price)}
                    </span>
                  </p>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                    Total:{" "}
                    <span className="text-[#f00]">
                      {formatIDR(selectedItem.price * quantity)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleAddToOrder}
                disabled={adding || addSuccess}
                className="group inline-flex items-center border border-[#f00] bg-[#f00] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de] disabled:opacity-50"
              >
                <ButtonHoverLabel label={adding ? "Adding…" : "Add to order"} />
              </button>
              <button
                type="button"
                onClick={closeOrderModal}
                className="group inline-flex items-center border border-[#1034b8] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]"
              >
                <ButtonHoverLabel label="Cancel" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
