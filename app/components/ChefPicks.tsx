import Link from "next/link";

export function ChefPicks() {
  return (
    <section className="border-b-2 border-[#f00] bg-[#fff4de] px-4 py-8 md:px-8 md:py-10">
      <div className="grid gap-3 border-2 border-[#f00] p-3 md:grid-cols-[1.1fr_1.8fr] md:p-4">
        <div className="bg-[#f00] p-4 text-[#fff4de]">
          <p className="text-[10px] font-black uppercase tracking-[0.18em]">
            chef picks
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-bebas)] text-[clamp(2.5rem,8vw,5.5rem)] uppercase leading-[0.85]">
            best menu specials
          </h2>
          <p className="mt-2 max-w-sm text-[10px] font-extrabold uppercase leading-tight tracking-[0.08em]">
            Our most-ordered items this week, stacked for maximum flavor.
          </p>
          <Link
            href="/menu"
            className="mt-4 inline-flex border border-[#fff4de] px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em]"
          >
            See full menu
          </Link>
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          <article className="border border-[#f00] bg-[#1034b8] p-3 text-[#fff4de]">
            <p className="text-[10px] font-black uppercase tracking-[0.14em]">
              #1 special
            </p>
            <p className="mt-2 font-[family-name:var(--font-bebas)] text-4xl uppercase leading-[0.85]">
              smash
              <br />
              burger
            </p>
          </article>
          <article className="border border-[#f00] bg-[#16a34a] p-3 text-[#fff4de]">
            <p className="text-[10px] font-black uppercase tracking-[0.14em]">
              #2 special
            </p>
            <p className="mt-2 font-[family-name:var(--font-bebas)] text-4xl uppercase leading-[0.85]">
              grill
              <br />
              combo
            </p>
          </article>
          <article className="border border-[#f00] bg-[#facc15] p-3 text-[#1034b8]">
            <p className="text-[10px] font-black uppercase tracking-[0.14em]">
              #3 special
            </p>
            <p className="mt-2 font-[family-name:var(--font-bebas)] text-4xl uppercase leading-[0.85]">
              mega
              <br />
              shake
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
