"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ECOSYSTEM_WORDS, WHAT_IS_NOT } from "@/data/content";

export default function WhatIs() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    restDelta: 0.001,
  });

  // ── Phase 1: 01 — THE QUESTION (0.00 -> 0.22)
  const headOpacity = useTransform(smooth, [0, 0.14, 0.22], [1, 1, 0]);
  const headY = useTransform(smooth, [0, 0.22], [0, -40]);
  const headScale = useTransform(smooth, [0, 0.22], [1, 0.94]);

  // ── Phase 2: What It's NOT — Sequential Stagger (0.24 -> 0.52)
  // Cleanly active between 0.24 and 0.52

  // ── Phase 3: IT'S A PLACE TO START (0.54 -> 0.74)
  const placeOpacity = useTransform(smooth, [0.54, 0.60, 0.70, 0.76], [0, 1, 1, 0]);
  const placeScale = useTransform(smooth, [0.54, 0.62, 0.70, 0.76], [0.92, 1, 1, 1.05]);
  const placeY = useTransform(smooth, [0.54, 0.62, 0.70, 0.76], [40, 0, 0, -30]);

  // ── Phase 4: ECOSYSTEM MATRIX (0.78 -> 1.00)
  const wordsOpacity = useTransform(smooth, [0.78, 0.86], [0, 1]);
  const wordsY = useTransform(smooth, [0.78, 0.88], [40, 0]);

  return (
    <section
      id="what-is"
      ref={ref}
      className="relative h-[480vh] bg-paper text-ink select-none"
      aria-label="What is E-Cell"
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        
        {/* ════════════════════════════════════════════════════════════════════
            PHASE 1: 01 — THE QUESTION (0.00 -> 0.22)
           ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
          style={{ opacity: headOpacity, y: headY, scale: headScale }}
        >
          <div className="mb-6 inline-flex items-center gap-3 border border-ember/40 bg-ember/10 px-4 py-1.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-ember animate-ping" />
            <span className="font-mono text-[11px] tracking-[0.35em] uppercase text-ember font-bold">
              01 — THE QUESTION
            </span>
          </div>
          <h2 className="hero-display text-[clamp(44px,9vw,140px)] leading-[0.9] text-ink">
            OK. BUT WHAT IS{" "}
            <span className="text-ember">E-CELL?</span>
          </h2>
          <p className="mt-6 font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-ink/60">
            SCROLL TO DECONSTRUCT THE ECOSYSTEM
          </p>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════════
            PHASE 2: DENIAL SEQUENCE (0.24 -> 0.52)
           ════════════════════════════════════════════════════════════════════ */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center md:gap-6 pointer-events-none">
          {WHAT_IS_NOT.map((line, i) => {
            const start = 0.24 + i * 0.08;
            const fadeIn = start + 0.03;
            const hold = start + 0.06;
            const fadeOut = start + 0.09;

            const o = useTransform(smooth, [start, fadeIn, hold, fadeOut], [0, 1, 1, 0]);
            const y = useTransform(smooth, [start, fadeIn, hold, fadeOut], [30, 0, 0, -30]);
            const s = useTransform(smooth, [start, fadeIn], [0.94, 1]);

            return (
              <motion.p
                key={line}
                style={{ opacity: o, y, scale: s }}
                className="font-display text-[clamp(32px,6.5vw,88px)] leading-none text-ink tracking-tight font-bold"
              >
                {line}
              </motion.p>
            );
          })}
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            PHASE 3: IT'S A PLACE TO START (0.54 -> 0.74)
           ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
          style={{ opacity: placeOpacity, scale: placeScale, y: placeY }}
        >
          <div className="mb-4 inline-flex items-center gap-2">
            <span className="h-[1px] w-8 bg-ember" />
            <span className="font-mono text-xs tracking-[0.35em] uppercase text-ember font-bold">
              THE DEFINITION
            </span>
            <span className="h-[1px] w-8 bg-ember" />
          </div>

          <h2 className="hero-display text-[clamp(44px,9.5vw,150px)] leading-[0.88] text-ink">
            IT&apos;S A PLACE TO START<span className="text-ember">.</span>
          </h2>
          
          <p className="mt-8 max-w-xl text-base md:text-xl font-light text-ink/75 leading-relaxed">
            Not a place with walls. A place where a dot becomes a line becomes a network becomes an ecosystem.
          </p>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════════
            PHASE 4: EXPANSIVE KINETIC ECOSYSTEM MATRIX (0.76 -> 1.00)
           ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 pointer-events-none"
          style={{ opacity: wordsOpacity, y: wordsY }}
        >
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-3 border border-ember/30 bg-ember/10 px-5 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-ember animate-ping" />
              <span className="font-mono text-xs tracking-[0.4em] uppercase text-ember font-bold">
                04 // THE CONVERGENCE
              </span>
            </div>
            <h3 className="hero-display text-2xl md:text-4xl text-ink mt-3">
              THE 8 FORCES OF THE ECOSYSTEM
            </h3>
          </div>

          {/* Expansive Architectural Floating Matrix (Generous Spacing) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl mt-4">
            {ECOSYSTEM_WORDS.map((w, idx) => (
              <div
                key={w}
                className="group relative border border-ink/15 bg-paper/80 p-6 md:p-8 flex flex-col justify-between h-[130px] md:h-[160px] shadow-sm backdrop-blur-md transition-all duration-300 hover:border-ember hover:shadow-[0_10px_30px_rgba(227,30,36,0.15)]"
              >
                <div className="flex justify-between items-center font-mono text-[10px] md:text-xs text-ink/40">
                  <span className="text-ember font-bold">0{idx + 1}</span>
                  <span className="tracking-[0.2em]">FORCE</span>
                </div>
                <div>
                  <span className="hero-display text-2xl md:text-4xl text-ink tracking-wide block transition-transform duration-300 group-hover:translate-x-1">
                    {w}
                  </span>
                </div>
                <div className="h-[2px] w-6 bg-ember transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>

          <motion.div className="mt-10 text-center">
            <p className="font-mono text-xs md:text-sm tracking-[0.35em] uppercase text-ember font-bold">
              EVERYTHING STARTS WITH AN IDEA<span className="text-ink">.</span>
            </p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
