"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MaskedLineReveal } from "./MaskedLineReveal";

const tiles = [
  {
    label: "CRISPY CHICKEN",
    title: "Crispy Chicken Bites",
    note: "Hand-breaded bites, ranch dip, extra crunch.",
    bg: "bg-[#facc15]",
    ink: "text-[#1034b8]",
    image: "/menu/crispy-chicken-bites.webp",
  },
  {
    label: "DOUBLE STACK",
    title: "Double Stack Burger",
    note: "Two smashed patties, American cheese, house sauce.",
    bg: "bg-[#1034b8]",
    ink: "text-[#f6ebd3]",
    image: "/menu/value-max-combo.webp",
  },
  {
    label: "BUFFALO WRAP",
    title: "Buffalo Chicken Wrap",
    note: "Crispy strips, lettuce, pickles, spicy mayo.",
    bg: "bg-[#16a34a]",
    ink: "text-[#fff2cf]",
    image: "/menu/buffalo-chicken-wrap.webp",
  },
  {
    label: "BACON MELT",
    title: "Bacon Melt",
    note: "Flame-grilled beef, bacon, onions, melty cheddar.",
    bg: "bg-[#ef4444]",
    ink: "text-[#fff2cf]",
    image: "/menu/eggs-bacon-waffles.webp",
  },
  {
    label: "VALUE BOX",
    title: "Value Box Combo",
    note: "Burger, fries, nuggets, and a fountain drink.",
    bg: "bg-[#facc15]",
    ink: "text-[#1034b8]",
    image: "/menu/value-max-combo.webp",
  },
  {
    label: "DRIVE-THRU CLUB",
    title: "Chicken Club Sandwich",
    note: "Toasted bun, crispy chicken, bacon, and slaw.",
    bg: "bg-[#1034b8]",
    ink: "text-[#f6ebd3]",
    image: "/menu/chicken-grilled-sandwich.webp",
  },
  {
    label: "MAC N CHEESE",
    title: "Loaded Mac & Cheese",
    note: "Creamy cheddar pasta topped with crispy onions.",
    bg: "bg-[#16a34a]",
    ink: "text-[#fff2cf]",
    image: "/menu/loaded-mac-cheese.webp",
  },
  {
    label: "FRIES SUPREME",
    title: "Loaded Fries Supreme",
    note: "Crinkle fries, cheese sauce, bacon bits, jalapenos.",
    bg: "bg-[#ef4444]",
    ink: "text-[#fff2cf]",
    image: "/menu/loaded-fries.webp",
  },
  {
    label: "SHAKE BAR",
    title: "Vanilla Mega Shake",
    note: "Thick vanilla shake with whipped cream and cookie crumbs.",
    bg: "bg-[#facc15]",
    ink: "text-[#1034b8]",
    image: "/menu/vanilla-mega-shake.webp",
  },
];

export function MenuTiles() {
  return (
    <section
      id="menu"
      data-aos="fade-up"
      className="grid grid-cols-1 gap-0 border-b-2 border-[#f00] md:grid-cols-3"
    >
      <article className="border-r border-t border-[#f00] bg-[#f3efe2] p-3">
        <MaskedLineReveal
          as="p"
          lines={["Discover our all-american fast-food favorites"]}
          className="font-extrabold uppercase leading-tight text-[#111]"
        />
        <MaskedLineReveal
          as="h1"
          lines={["Sizzle"]}
          className="uppercase text-[#f00] font-extrabold text-8xl"
        />
        <MaskedLineReveal
          as="h1"
          lines={["Sizzle"]}
          className="uppercase text-transparent [-webkit-text-stroke:3px_#ff0000] [-webkit-text-fill-color:transparent] font-extrabold text-8xl"
        />
        <MaskedLineReveal
          as="h1"
          lines={["Sizzle"]}
          className="uppercase text-[#f00] font-extrabold text-8xl"
        />
      </article>
      {tiles.map((tile, index) => (
        <motion.article
          key={tile.title}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, delay: index * 0.03 }}
          data-aos="fade-up"
          data-aos-delay={Math.min(index * 35, 220)}
          className={`${tile.bg} ${tile.ink} group border-r border-t border-[#f00] p-3 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#f3efe2] hover:text-[#f00]`}
        >
          <MaskedLineReveal
            as="p"
            lines={[tile.label]}
            className="font-(family-name:--font-bebas) text-2xl uppercase leading-none transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
          <MaskedLineReveal
            as="h3"
            lines={[tile.title]}
            className="mt-1 font-(family-name:--font-bebas) text-[2.05rem] uppercase leading-[0.85] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
          <div className="my-3 h-28 rounded-3xl border-4 border-current overflow-hidden relative transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-64">
            <Image
              src={tile.image}
              alt={tile.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
              priority={index === 0}
            />
          </div>
          <MaskedLineReveal
            as="p"
            lines={[tile.note]}
            className="text-[10px] uppercase leading-tight transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
        </motion.article>
      ))}
    </section>
  );
}
