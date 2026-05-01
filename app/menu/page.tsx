"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { MaskedLineReveal } from "../components/MaskedLineReveal";
import { ButtonHoverLabel } from "../components/ButtonHoverLabel";
import { addToCart } from "../lib/cart";

const menuItems = [
  {
    name: "Crispy Chicken Bites",
    description: "Hand-breaded bites, ranch dip, extra crunch.",
    price: "$7.99",
    image: "/menu/crispy-chicken-bites.webp",
  },
  {
    name: "Buffalo Chicken Wrap",
    description: "Crispy strips, lettuce, pickles, spicy mayo.",
    price: "$8.99",
    image: "/menu/buffalo-chicken-wrap.webp",
  },
  {
    name: "Grilled Chicken Sandwich",
    description: "Toasted bun, grilled chicken, lettuce, tomato, mayo.",
    price: "$9.29",
    image: "/menu/chicken-grilled-sandwich.webp",
  },
  {
    name: "Eggs & Bacon Waffles",
    description: "Sweet waffles, eggs, and crispy bacon breakfast stack.",
    price: "$8.79",
    image: "/menu/eggs-bacon-waffles.webp",
  },
  {
    name: "Value Max Combo",
    description: "Burger, fries, nuggets, and a fountain drink.",
    price: "$10.99",
    image: "/menu/value-max-combo.webp",
  },
  {
    name: "Loaded Fries",
    description: "Crinkle fries, cheese sauce, bacon bits, jalapenos.",
    price: "$6.99",
    image: "/menu/loaded-fries.webp",
  },
  {
    name: "Loaded Mac Cheese",
    description: "Creamy cheddar pasta topped with crispy onions.",
    price: "$7.49",
    image: "/menu/loaded-mac-cheese.webp",
  },
  {
    name: "Vanilla Mega Shake",
    description: "Thick vanilla shake with whipped cream and cookie crumbs.",
    price: "$5.99",
    image: "/menu/vanilla-mega-shake.webp",
  },
];

type MenuItem = (typeof menuItems)[number];

function toItemId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function parsePrice(priceLabel: string): number {
  return Number(priceLabel.replace(/[^0-9.]/g, ""));
}

export default function MenuPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>(toItemId(menuItems[0].name));
  const [quantity, setQuantity] = useState(1);

  const selectedItem = useMemo(
    () => menuItems.find((item) => toItemId(item.name) === selectedItemId) ?? menuItems[0],
    [selectedItemId],
  );

  const openOrderModal = (item: MenuItem) => {
    setSelectedItemId(toItemId(item.name));
    setQuantity(1);
    setModalOpen(true);
  };

  const closeOrderModal = () => {
    setModalOpen(false);
  };

  const handleAddToOrder = () => {
    const unitPrice = parsePrice(selectedItem.price);
    addToCart({
      id: toItemId(selectedItem.name),
      name: selectedItem.name,
      image: selectedItem.image,
      price: unitPrice,
      quantity,
    });
    closeOrderModal();
  };

  const unitPrice = parsePrice(selectedItem.price);
  const totalPrice = unitPrice * quantity;

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

      <section className="grid grid-cols-1 border-b-2 border-[#f00] md:grid-cols-2">
        {menuItems.map((item, index) => (
          <article
            key={item.name}
            className={`border-r border-t border-[#f00] p-4 flex flex-col ${index % 2 === 0 ? "bg-[#fff4de]" : "bg-[#fef3c7]"}`}
          >
            <div className="h-40 md:h-84 relative mb-3 rounded-lg overflow-hidden border-2 border-[#1034b8]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 10vw, 20vw"
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
                lines={[item.price]}
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

      <footer className="flex flex-wrap gap-2 p-4 md:p-6">
        <Link href="/rewards" className="group inline-flex items-center border border-[#1034b8] px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8] hover:bg-[#f4ead5] transition-colors">
          <ButtonHoverLabel label="See points deals" />
        </Link>
        <Link href="/" className="group inline-flex items-center border border-[#f00] px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#f00] hover:bg-[#fecaca] transition-colors">
          <ButtonHoverLabel label="Back home" />
        </Link>
      </footer>

      {isModalOpen ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/55 p-4">
          <div className="w-full max-w-3xl border-2 border-[#f00] bg-[#fff4de] p-5 md:p-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]">
              Build your order
            </p>
            <h2 className="font-(family-name:--font-bebas) text-[clamp(2rem,5vw,3.3rem)] uppercase leading-[0.9] text-[#f00]">
              Add Menu Item
            </h2>

            <div className="mt-4 grid gap-5 md:grid-cols-[220px_1fr] md:items-center">
              <div className="relative h-44 overflow-hidden rounded-lg border-2 border-[#1034b8] md:h-52">
                <Image src={selectedItem.image} alt={selectedItem.name} fill className="object-cover" />
              </div>
              <div className="grid gap-3">
                <p className="font-(family-name:--font-bebas) text-3xl uppercase leading-none text-[#1034b8]">
                  {selectedItem.name}
                </p>

                <div className="grid gap-2  px-1 py-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                    Quantity
                  </p>
                  <div className="inline-flex w-fit items-center rounded-md">
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                      className="rounded-full border border-[#1034b8] px-3 py-1 text-base font-black text-[#1034b8] hover:bg-[#bfdbfe]"
                    >
                      -
                    </button>
                    <p className="min-w-10 px-3 py-1 text-center text-sm font-black text-[#1f2937]">
                      {quantity}
                    </p>
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => current + 1)}
                      className="rounded-full border border-[#1034b8] px-3 py-1 text-base font-black text-[#1034b8] hover:bg-[#bfdbfe]"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid gap-1 bg-[#fff4de]/60 px-1 py-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                    Price per item: <span className="text-[#f00]">{selectedItem.price}</span>
                  </p>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#374151]">
                    Total:{" "}
                    <span className="text-[#f00]">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleAddToOrder}
                className="group inline-flex items-center border border-[#f00] bg-[#f00] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de]"
              >
                <ButtonHoverLabel label="Add to order" />
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
