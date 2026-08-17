"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MANIFESTO_LINES } from "@/data/content";

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const finalScale = useTransform(scrollYProgress, [0.8, 1], [0.92, 1.06]);
  const finalOpacity = useTransform(scrollYProgress, [0.72, 0.82, 0.95, 1], [0, 1, 1, 1]);

  return (
    <section
      id="manifesto"
      ref={ref}
      className="relative h-[320vh] bg-paper text-ink"
      aria-label="The manifesto"
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        {/* the lines — one at a time, colliding as they pass */}
        {MANIFESTO_LINES.map((line, i) => {
          const a = 0.05 + i * 0.095;
          const b = a + 0.075;
          const o = useTransform(scrollYProgress, [a, a + 0.02, b - 0.01, b], [0, 1, 1, 0]);
          const x = useTransform(scrollYProgress, [a, b], [line.drift * 2, -line.drift * 0.4]);
          const s = useTransform(scrollYProgress, [a, a + 0.03], [0.94, 1]);
          return (
            <motion.p
              key={i}
              style={{ opacity: o, x, scale: s }}
              className="absolute whitespace-nowrap font-display text-[clamp(22px,5.5vw,88px)] leading-none text-ink"
            >
              {line.text}
            </motion.p>
          );
        })}

        {/* SO START. */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ opacity: finalOpacity, scale: finalScale }}
        >
          <p className="label-ink mb-4 text-ember">08 — THE MANIFESTO</p>
          <p className="font-display text-[clamp(60px,14vw,220px)] leading-[0.85] text-ink">
            SO{" "}
            <span className="relative inline-block">
              START
              <span className="absolute -bottom-2 left-0 h-[3px] w-full bg-ember" />
            </span>
            <span className="text-ember">.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
