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

  // ── Phase 4: KINETIC MULTI-DIRECTIONAL CARD LAUNCH (0.76 -> 1.00)
  const p4Opacity = useTransform(smooth, [0.76, 0.82], [0, 1]);

  // Individual trajectories for all 8 forces throwing in from distinct offscreen directions
  // Card 01: IDEAS (From Top-Left: x: -280, y: -240, rot: -14deg)
  const c1X = useTransform(smooth, [0.76, 0.88], [-280, 0]);
  const c1Y = useTransform(smooth, [0.76, 0.88], [-240, 0]);
  const c1R = useTransform(smooth, [0.76, 0.88], [-14, 0]);
  const c1O = useTransform(smooth, [0.76, 0.84], [0, 1]);

  // Card 02: PEOPLE (From Top: y: -320, rot: 8deg)
  const c2Y = useTransform(smooth, [0.78, 0.90], [-320, 0]);
  const c2R = useTransform(smooth, [0.78, 0.90], [8, 0]);
  const c2O = useTransform(smooth, [0.78, 0.85], [0, 1]);

  // Card 03: MENTORS (From Top: y: -320, rot: -8deg)
  const c3Y = useTransform(smooth, [0.80, 0.92], [-320, 0]);
  const c3R = useTransform(smooth, [0.80, 0.92], [-8, 0]);
  const c3O = useTransform(smooth, [0.80, 0.86], [0, 1]);

  // Card 04: EXPERIMENTS (From Top-Right: x: 280, y: -240, rot: 14deg)
  const c4X = useTransform(smooth, [0.82, 0.94], [280, 0]);
  const c4Y = useTransform(smooth, [0.82, 0.94], [-240, 0]);
  const c4R = useTransform(smooth, [0.82, 0.94], [14, 0]);
  const c4O = useTransform(smooth, [0.82, 0.88], [0, 1]);

  // Card 05: FAILURES (From Bottom-Left: x: -280, y: 240, rot: 12deg)
  const c5X = useTransform(smooth, [0.79, 0.91], [-280, 0]);
  const c5Y = useTransform(smooth, [0.79, 0.91], [240, 0]);
  const c5R = useTransform(smooth, [0.79, 0.91], [12, 0]);
  const c5O = useTransform(smooth, [0.79, 0.86], [0, 1]);

  // Card 06: FOUNDERS (From Bottom: y: 320, rot: -10deg)
  const c6Y = useTransform(smooth, [0.81, 0.93], [320, 0]);
  const c6R = useTransform(smooth, [0.81, 0.93], [-10, 0]);
  const c6O = useTransform(smooth, [0.81, 0.87], [0, 1]);

  // Card 07: OPPORTUNITIES (From Bottom: y: 320, rot: 10deg)
  const c7Y = useTransform(smooth, [0.83, 0.95], [320, 0]);
  const c7R = useTransform(smooth, [0.83, 0.95], [10, 0]);
  const c7O = useTransform(smooth, [0.83, 0.89], [0, 1]);

  // Card 08: IMPACT (From Bottom-Right: x: 280, y: 240, rot: -12deg)
  const c8X = useTransform(smooth, [0.85, 0.97], [280, 0]);
  const c8Y = useTransform(smooth, [0.85, 0.97], [240, 0]);
  const c8R = useTransform(smooth, [0.85, 0.97], [-12, 0]);
  const c8O = useTransform(smooth, [0.85, 0.91], [0, 1]);

  const cardTransforms = [
    { x: c1X, y: c1Y, r: c1R, o: c1O },
    { x: undefined, y: c2Y, r: c2R, o: c2O },
    { x: undefined, y: c3Y, r: c3R, o: c3O },
    { x: c4X, y: c4Y, r: c4R, o: c4O },
    { x: c5X, y: c5Y, r: c5R, o: c5O },
    { x: undefined, y: c6Y, r: c6R, o: c6O },
    { x: undefined, y: c7Y, r: c7R, o: c7O },
    { x: c8X, y: c8Y, r: c8R, o: c8O },
  ];

  return (
    <section
      id="what-is"
      ref={ref}
      className="relative h-[520vh] bg-paper text-ink select-none"
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
            PHASE 4: 8-FORCE KINETIC IMPACT THROW & SNAP (0.76 -> 1.00)
           ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 pointer-events-none"
          style={{ opacity: p4Opacity }}
        >
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-3 border border-ember/30 bg-ember/10 px-5 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-ember animate-ping" />
              <span className="font-mono text-xs tracking-[0.4em] uppercase text-ember font-bold">
                04 // THE CONVERGENCE
              </span>
            </div>
            <h3 className="hero-display text-2xl md:text-5xl text-ink mt-3">
              THE 8 FORCES OF THE ECOSYSTEM
            </h3>
          </div>

          {/* 8 Individually Flying and Snapping Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl mt-4">
            {ECOSYSTEM_WORDS.map((w, idx) => {
              const t = cardTransforms[idx];
              return (
                <motion.div
                  key={w}
                  style={{
                    x: t.x,
                    y: t.y,
                    rotateZ: t.r,
                    opacity: t.o,
                  }}
                  className="group relative border-2 border-ink/20 bg-paper/95 p-6 md:p-8 flex flex-col justify-between h-[140px] md:h-[170px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:border-ember hover:shadow-[0_15px_40px_rgba(227,30,36,0.2)]"
                >
                  <div className="flex justify-between items-center font-mono text-[10px] md:text-xs text-ink/50">
                    <span className="text-ember font-bold text-sm">0{idx + 1}</span>
                    <span className="tracking-[0.25em] font-semibold">FORCE</span>
                  </div>
                  <div>
                    <span className="hero-display text-2xl md:text-4xl text-ink tracking-wide block transition-transform duration-300 group-hover:translate-x-1">
                      {w}
                    </span>
                  </div>
                  <div className="h-[2px] w-8 bg-ember transition-all duration-300 group-hover:w-full" />
                </motion.div>
              );
            })}
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
