"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FAILURES } from "@/data/content";
import { MaskText, Reveal } from "@/components/core/Motion";

export default function Failure() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const lineProgress = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);
  const quoteOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);

  return (
    <section
      id="failure"
      ref={ref}
      className="relative overflow-hidden bg-void-2 px-6 py-32 text-paper md:px-[8vw] md:py-44"
      aria-label="Things that didn't work"
    >
      <div className="mb-16 flex items-baseline justify-between gap-6">
        <h2 className="font-display text-[clamp(34px,6vw,96px)] leading-[0.9]">
          THINGS THAT{" "}
          <span className="text-stroke-paper">DIDN'T WORK.</span>
        </h2>
        <p className="label hidden text-ash md:block">03 — FAILURE AS DATA</p>
      </div>

      {/* the broken line that reconnects */}
      <div className="mb-20 max-w-3xl">
        <svg viewBox="0 0 600 90" className="h-16 w-full md:h-20" aria-hidden>
          <path
            d="M0 70 C 120 70, 160 20, 260 20"
            fill="none"
            stroke="rgba(242,239,233,0.25)"
            strokeWidth="1.5"
          />
          <motion.path
            d="M0 70 C 120 70, 160 20, 260 20"
            fill="none"
            stroke="#e31e24"
            strokeWidth="2"
            style={{ pathLength: lineProgress }}
          />
          {/* the break — where it all fell apart */}
          <line
            x1="262"
            y1="24"
            x2="288"
            y2="16"
            stroke="rgba(242,239,233,0.4)"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
          {/* reconnect — the path changes */}
          <path
            d="M300 12 C 380 6, 430 60, 540 60"
            fill="none"
            stroke="rgba(242,239,233,0.25)"
            strokeWidth="1.5"
          />
          <motion.path
            d="M300 12 C 380 6, 430 60, 540 60"
            fill="none"
            stroke="#e31e24"
            strokeWidth="2"
            style={{ pathLength: useTransform(lineProgress, [0.4, 1], [0, 1]) }}
          />
          <circle cx="540" cy="60" r="4" fill="#e31e24" />
        </svg>
      </div>

      {/* the failures as rows */}
      <div className="border-t border-line">
        {FAILURES.map((f, i) => (
          <div
            key={f.id}
            className="group grid gap-3 border-b border-line py-8 transition-colors duration-300 hover:bg-ember/5 md:grid-cols-[80px_1fr_1fr_1fr] md:gap-8 md:py-10"
          >
            <span className="font-display text-2xl text-ash transition-colors group-hover:text-ember">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="label mb-2 text-ember">WHAT BROKE</p>
              <p className="text-base font-semibold text-paper">{f.name}</p>
            </div>
            <div>
              <p className="label mb-2 text-ash">THE ASSUMPTION</p>
              <p className="text-sm leading-relaxed text-paper/70">{f.assumption}</p>
            </div>
            <div>
              <p className="label mb-2 text-ash">WHERE THE PATH WENT</p>
              <p className="text-sm leading-relaxed text-paper/70">{f.changed}</p>
            </div>
          </div>
        ))}
      </div>

      {/* the emotional turn */}
      <div className="mt-24 flex flex-col items-center text-center md:mt-32">
        <motion.div style={{ opacity: quoteOpacity }} className="flex flex-col gap-3">
          <MaskText>
            <p className="font-display text-[clamp(30px,5.5vw,84px)] leading-[1.02] text-paper">
              FAILURE IS NOT THE END OF THE PATH.
            </p>
          </MaskText>
          <MaskText delay={0.15}>
            <p className="font-display text-[clamp(30px,5.5vw,84px)] leading-[1.02]">
              IT IS THE PATH <span className="text-ember">CHANGING.</span>
            </p>
          </MaskText>
        </motion.div>
        <Reveal delay={0.4} className="mt-10">
          <p className="max-w-md text-sm leading-relaxed text-paper/60">
            Everything on this page that worked, started with something that
            didn't. We keep both. The failures are part of the curriculum.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
