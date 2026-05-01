"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ElementType } from "react";

type MaskedLineRevealProps = {
  as?: ElementType;
  className?: string;
  lines: string[];
};

export function MaskedLineReveal({
  as = "p",
  className,
  lines,
}: MaskedLineRevealProps) {
  const Tag = as;
  const shouldReduceMotion = useReducedMotion();

  return (
    <Tag className={className}>
      {lines.map((line, index) => (
        <motion.span
          key={`${line}-${index}`}
          className="block overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
        >
          <motion.span
            variants={
              shouldReduceMotion
                ? { hidden: { y: "0%" }, visible: { y: "0%" } }
                : { hidden: { y: "115%" }, visible: { y: "0%" } }
            }
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            {line}
          </motion.span>
        </motion.span>
      ))}
    </Tag>
  );
}
