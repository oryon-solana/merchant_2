import Link from "next/link";

const menuItems = [
  { name: "Butter Chicken Bowl", description: "Creamy tomato curry, rice, pickled onions", price: "$11.90" },
  { name: "Palak Paneer Plate", description: "Spinach curry, paneer, coriander naan", price: "$10.40" },
  { name: "Tandoori Squash Wrap", description: "Roasted squash, mint chutney, crunchy slaw", price: "$9.20" },
  { name: "Vada Pav Combo", description: "Potato fritter bun, masala fries, soft drink", price: "$8.80" },
];

export default function MenuPage() {
  return (
    <main className="min-h-screen w-full bg-[#f4ead5] pb-24 md:pb-8">
      <header className="border-b-2 border-[#f00] p-4 md:p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#1034b8]">Pay with money</p>
        <h1 className="font-[family-name:var(--font-bebas)] text-[clamp(2.8rem,8vw,6rem)] uppercase leading-[0.85] text-[#f00]">
          Main Menu
        </h1>
        <p className="max-w-xl text-sm font-semibold uppercase tracking-[0.08em] text-[#1034b8]">
          Standard menu pricing. Pay directly with card, cash, or wallet.
        </p>
      </header>

      <section className="grid grid-cols-1 border-b-2 border-[#f00] md:grid-cols-2">
        {menuItems.map((item, index) => (
          <article
            key={item.name}
            className={`border-r border-t border-[#f00] p-4 ${index % 2 === 0 ? "bg-[#fff4de]" : "bg-[#fef3c7]"}`}
          >
            <p className="font-[family-name:var(--font-bebas)] text-4xl uppercase leading-none text-[#1034b8]">{item.name}</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.07em] text-[#1f2937]">{item.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-lg font-extrabold uppercase text-[#f00]">{item.price}</p>
              <button className="border border-[#f00] bg-[#f00] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de]">
                Add to order
              </button>
            </div>
          </article>
        ))}
      </section>

      <footer className="flex flex-wrap gap-2 p-4 md:p-6">
        <Link href="/rewards" className="border border-[#1034b8] px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]">
          See points deals
        </Link>
        <Link href="/" className="border border-[#f00] px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#f00]">
          Back home
        </Link>
      </footer>
    </main>
  );
}
