import Link from "next/link";

const rewardsDeals = [
  { name: "Fries + Cola", details: "Small fries and cola", points: 120 },
  { name: "Paneer Wrap", details: "Spiced paneer, mint sauce", points: 260 },
  { name: "Butter Chicken Meal", details: "Bowl, drink, side", points: 420 },
  { name: "Family Feast", details: "4 mains and sharing sides", points: 880 },
];

export default function RewardsPage() {
  return (
    <main className="min-h-screen w-full bg-[#f4ead5] pb-24 md:pb-8">
      <header className="border-b-2 border-[#f00] p-4 md:p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#1034b8]">Pay with points</p>
        <h1 className="font-[family-name:var(--font-bebas)] text-[clamp(2.8rem,8vw,6rem)] uppercase leading-[0.85] text-[#f00]">
          Points Deals Menu
        </h1>
        <p className="max-w-2xl text-sm font-semibold uppercase tracking-[0.08em] text-[#1034b8]">
          Redeem loyalty points for special menu items. No cash payment needed when you have enough points.
        </p>
      </header>

      <section className="grid grid-cols-1 border-b-2 border-[#f00] md:grid-cols-2">
        {rewardsDeals.map((deal, index) => (
          <article
            key={deal.name}
            className={`border-r border-t border-[#f00] p-4 ${index % 2 === 0 ? "bg-[#fee2e2]" : "bg-[#fff4de]"}`}
          >
            <p className="font-[family-name:var(--font-bebas)] text-4xl uppercase leading-none text-[#f00]">{deal.name}</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.07em] text-[#1f2937]">{deal.details}</p>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-lg font-extrabold uppercase text-[#1034b8]">{deal.points} pts</p>
              <button className="border border-[#1034b8] bg-[#1034b8] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#fff4de]">
                Redeem
              </button>
            </div>
          </article>
        ))}
      </section>

      <footer className="flex flex-wrap gap-2 p-4 md:p-6">
        <Link href="/profile" className="border border-[#1034b8] px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1034b8]">
          Manage points
        </Link>
        <Link href="/menu" className="border border-[#f00] px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#f00]">
          Pay with money menu
        </Link>
      </footer>
    </main>
  );
}
