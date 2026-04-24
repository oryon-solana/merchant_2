"use client";

import { motion } from "framer-motion";

const dishes = [
  {
    sanskrit: "Kushmanda Pakoda",
    name: "Pakora de Courge",
    note: "Butternut fritters, chickpea batter, tamarind chutney.",
    tone: "from-[#f97316] to-[#fb923c]",
  },
  {
    sanskrit: "Palaka Panira",
    name: "Palak Paneer",
    note: "Fresh paneer, spinach cream sauce, mustard seeds.",
    tone: "from-[#15803d] to-[#84cc16]",
  },
  {
    sanskrit: "Navanita Murga",
    name: "Butter Chicken",
    note: "Tandoor grilled chicken, tomato butter, cashew.",
    tone: "from-[#dc2626] to-[#f97316]",
  },
  {
    sanskrit: "Bhela Puri",
    name: "Bhelpuri",
    note: "Puffed rice, raw mango, peanut, fresh mint.",
    tone: "from-[#0f766e] to-[#22c55e]",
  },
];

const riseIn = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_8%_10%,rgba(243,171,47,0.45),transparent_30%),radial-gradient(circle_at_92%_20%,rgba(207,74,29,0.4),transparent_35%),linear-gradient(180deg,#f8f0df_0%,#f6e6ce_50%,#f2ddc0_100%)]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 pb-6 pt-8 sm:px-8">
        <div className="font-[family-name:var(--font-bebas)] text-[clamp(2rem,4vw,2.8rem)] uppercase tracking-[0.04em]">
          Gourou
        </div>
        <nav className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-[0.2em] md:flex">
          <a href="#menu">Menu</a>
          <a href="#story">Restaurant</a>
          <a href="#contact">Contact</a>
        </nav>
        <a
          className="rounded-full border border-[#2e1a12] bg-[#2e1a12] px-[1.35rem] py-[0.62rem] text-[0.72rem] font-bold uppercase tracking-[0.11em] text-[#ffefcc] transition-all duration-200 hover:bg-[#4a2819]"
          href="#contact"
        >
          Reserver
        </a>
      </header>

      <main>
        <section className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 pb-16 sm:px-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-7"
          >
            <span className="inline-flex rounded-full border border-[rgba(27,20,14,0.28)] px-[0.82rem] py-[0.38rem] text-[0.72rem] font-bold uppercase tracking-[0.16em]">
              From India to Paris
            </span>
            <h1 className="max-w-[12ch] font-[family-name:var(--font-bebas)] text-[clamp(2.5rem,10vw,7.25rem)] leading-[0.92] uppercase tracking-[0.02em]">
              Indian street food
              <br />
              house-made, fresh,
              <br />
              and loud with flavor.
            </h1>
            <p className="max-w-[52ch] leading-[1.7] text-[#3e2f26]">
              Inspired by the energy of modern Indian canteens: vibrant plates,
              hand-ground spices, and an all-day room built for quick lunch,
              slow dinner, and weekend cravings.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                className="rounded-full border border-[#2e1a12] bg-[#2e1a12] px-[1.35rem] py-[0.62rem] text-[0.72rem] font-bold uppercase tracking-[0.11em] text-[#ffefcc] transition-all duration-200 hover:bg-[#4a2819]"
                href="#menu"
              >
                Voir la carte
              </a>
              <a
                className="rounded-full border border-[rgba(27,20,14,0.22)] bg-[rgba(253,245,233,0.6)] px-[1.35rem] py-[0.62rem] text-[0.72rem] font-bold uppercase tracking-[0.11em] transition-all duration-200 hover:border-[rgba(27,20,14,0.45)] hover:bg-[rgba(253,245,233,0.95)]"
                href="#contact"
              >
                Commander
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="relative grid min-h-[350px] place-items-center overflow-hidden rounded-[2rem] border border-[rgba(27,20,14,0.18)] bg-[linear-gradient(155deg,#fce7b8_0%,#f8ca78_45%,#cf4a1d_100%)] md:min-h-[430px]"
          >
            <motion.div
              className="absolute aspect-square w-[min(78vw,300px)] rounded-full bg-[radial-gradient(circle_at_40%_35%,#ffe6cb_0%,#f5b35d_35%,#cb551f_72%,#8b2a10_100%)] drop-shadow-[0_20px_24px_rgba(28,12,2,0.35)]"
              animate={{ y: [0, -10, 0], rotate: [0, 1.5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-[18%] left-[12%] aspect-square w-[min(45vw,170px)] rounded-full bg-[radial-gradient(circle_at_30%_30%,#dcfce7_0%,#86efac_32%,#16a34a_75%,#14532d_100%)] drop-shadow-[0_20px_24px_rgba(28,12,2,0.35)]"
              animate={{ y: [0, 10, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute bottom-[0.8rem] right-[0.8rem] max-w-64 rounded-2xl border border-[rgba(27,20,14,0.2)] bg-[rgba(253,245,233,0.88)] px-4 py-3 backdrop-blur-[3px] md:bottom-[1.1rem] md:right-[1.1rem]">
              <p className="text-[0.72rem] uppercase tracking-[0.12em] opacity-70">
                Fresh prep all day
              </p>
              <strong className="font-[family-name:var(--font-bebas)] text-[1.35rem] leading-none tracking-[0.03em]">
                Vegan, veggie, and classic dishes
              </strong>
            </div>
          </motion.div>
        </section>

        <section
          className="overflow-hidden border-y border-[rgba(27,20,14,0.16)] bg-[#2e1a12] text-[#fbe4bf]"
          aria-label="social-strip"
        >
          <motion.div
            className="flex w-max whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 2 }).map((_, idx) => (
              <p
                key={idx}
                className="py-[0.7rem] font-[family-name:var(--font-bebas)] text-[clamp(1.5rem,3vw,2rem)] uppercase tracking-[0.08em]"
              >
                follow us  -  suivez nous  -  from india to paris  -  follow us  -
                suivez nous  -
              </p>
            ))}
          </motion.div>
        </section>

        <motion.section
          id="menu"
          className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8"
          {...riseIn}
        >
          <div>
            <span className="inline-flex rounded-full border border-[rgba(27,20,14,0.28)] px-[0.82rem] py-[0.38rem] text-[0.72rem] font-bold uppercase tracking-[0.16em]">
              Signature dishes
            </span>
            <h2 className="mt-4 max-w-[14ch] font-[family-name:var(--font-bebas)] text-[clamp(2rem,6vw,4rem)] leading-[0.95] uppercase">
              Discover the essentials of a modern Indian table
            </h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {dishes.map((dish, index) => (
              <motion.article
                key={dish.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="relative overflow-hidden rounded-3xl border border-[rgba(27,20,14,0.16)] bg-[rgba(253,245,233,0.93)] p-5"
              >
                <div
                  className={`absolute -right-[1.4rem] -top-[1.4rem] h-28 w-28 rounded-full bg-gradient-to-br opacity-80 ${dish.tone}`}
                />
                <p className="mb-2 font-[family-name:var(--font-bebas)] uppercase tracking-[0.06em] text-[#5b3a2c]">
                  {dish.sanskrit}
                </p>
                <h3 className="font-[family-name:var(--font-bebas)] text-[clamp(1.5rem,3vw,2rem)] leading-none uppercase">
                  {dish.name}
                </h3>
                <p className="mt-2 max-w-[40ch] text-[#4c3629]">{dish.note}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="story"
          className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-20 sm:px-8 md:grid-cols-2 md:items-center"
          {...riseIn}
        >
          <div>
            <span className="inline-flex rounded-full border border-[rgba(27,20,14,0.28)] px-[0.82rem] py-[0.38rem] text-[0.72rem] font-bold uppercase tracking-[0.16em]">
              Restaurant
            </span>
            <h2 className="mt-4 max-w-[14ch] font-[family-name:var(--font-bebas)] text-[clamp(2rem,6vw,4rem)] leading-[0.95] uppercase">
              An everyday canteen, reimagined with color and heat
            </h2>
            <p className="mt-4 max-w-[44ch] leading-7 text-[#3c2d24]">
              Our kitchen works around live spice mixes, tandoor batches, and
              house sauces made in small runs. The menu is grounded in Indian
              street food and pushed with seasonal produce.
            </p>
          </div>
          <motion.div
            className="relative min-h-[340px]"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute inset-0 -translate-x-2 -rotate-[8deg] rounded-[1.4rem] border border-[rgba(27,20,14,0.2)] bg-[linear-gradient(130deg,#fef3c7_0%,#fdba74_100%)]" />
            <div className="absolute inset-0 translate-x-2 rotate-[6deg] rounded-[1.4rem] border border-[rgba(27,20,14,0.2)] bg-[linear-gradient(145deg,#dcfce7_0%,#4ade80_100%)]" />
            <div className="absolute inset-0 -rotate-1 rounded-[1.4rem] border border-[rgba(27,20,14,0.2)] bg-[radial-gradient(circle_at_75%_22%,rgba(253,245,233,0.9),rgba(253,245,233,0)_45%),linear-gradient(140deg,#7c2d12_0%,#ea580c_45%,#facc15_100%)]" />
          </motion.div>
        </motion.section>
      </main>

      <footer id="contact" className="mx-auto w-full max-w-6xl px-5 pb-10 sm:px-8">
        <div className="rounded-[1.4rem] border border-[rgba(27,20,14,0.2)] bg-[#2f1d14] p-5 text-[#f8e4c6]">
          <h3 className="font-[family-name:var(--font-bebas)] text-[2rem] leading-none uppercase">
            Indian Food Company
          </h3>
          <p>42 Rue Leon Frot, Paris 11</p>
          <p>Open daily for lunch and dinner service</p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              className="rounded-full border border-[#2e1a12] bg-[#2e1a12] px-[1.35rem] py-[0.62rem] text-[0.72rem] font-bold uppercase tracking-[0.11em] text-[#ffefcc] transition-all duration-200 hover:bg-[#4a2819]"
              href="#"
            >
              Sur place
            </a>
            <a
              className="rounded-full border border-[rgba(248,228,198,0.35)] bg-[rgba(253,245,233,0.08)] px-[1.35rem] py-[0.62rem] text-[0.72rem] font-bold uppercase tracking-[0.11em] transition-all duration-200 hover:border-[rgba(248,228,198,0.6)] hover:bg-[rgba(253,245,233,0.16)]"
              href="#"
            >
              A emporter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
