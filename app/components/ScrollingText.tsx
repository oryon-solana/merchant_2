"use client";

import { motion } from "framer-motion";

export function ScrollingText() {
  return (
    <section className="border-y-2 border-[#f00] bg-[#fff4de] py-2">
      <motion.div
        className="flex w-max whitespace-nowrap pl-2 font-(family-name:--font-bebas) text-[clamp(2.3rem,7vw,5rem)] uppercase leading-none tracking-tight text-[#f00]"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 2 }).map((_, idx) => (
          <p key={idx} className="pr-12">
            fresh off the grill fresh off the grill fresh off the grill
          </p>
        ))}
      </motion.div>
    </section>
  );
}
