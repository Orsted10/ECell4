"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import ParticleField from "@/components/core/ParticleField";
import { SITE } from "@/data/content";

const PILLARS = [
  { num: "01", label: "GENESIS", title: "IDEATION & INCUBATION" },
  { num: "02", label: "VENTURE", title: "CAPITAL & MENTORSHIP" },
  { num: "03", label: "MOMENTUM", title: "SCALING TO IMPACT" },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Stage 1: Hero Impact Wordmark (0.0 -> 0.4)
  const heroScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.85]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25, 0.38], [1, 0.9, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, -60]);

  // Stage 2: Mission Reveal & The Core Formula (0.35 -> 0.7)
  const formulaOpacity = useTransform(scrollYProgress, [0.34, 0.45, 0.65, 0.75], [0, 1, 1, 0]);
  const formulaY = useTransform(scrollYProgress, [0.34, 0.45, 0.65, 0.75], [50, 0, 0, -40]);

  // Stage 3: The 3 Launch Pillars (0.7 -> 1.0)
  const pillarsOpacity = useTransform(scrollYProgress, [0.72, 0.84], [0, 1]);
  const pillarsY = useTransform(scrollYProgress, [0.72, 0.88], [40, 0]);

  return (
    <section
      id="enter"
      ref={ref}
      className="relative h-[300vh] bg-void text-paper"
      aria-label="E-Cell Innovation Engine"
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <ParticleField density={0.4} opacity={0.3} />

        {/* Ambient Subtle Architectural Reticle Lines */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-paper/5 to-transparent" />
          <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-paper/5 to-transparent" />
        </div>

        {/* Top Floating Institutional Badge */}
        <div className="absolute left-6 top-24 md:left-12 md:top-28 z-20 flex items-center gap-3 font-mono text-[10px] md:text-[11px] tracking-[0.3em] text-ash">
          <span className="h-1.5 w-1.5 rounded-full bg-ember animate-ping" />
          <span>{SITE.university}</span>
          <span className="text-ash/40">/</span>
          <span className="text-ember font-semibold">{SITE.campus}</span>
        </div>

        {/* ── STAGE 1: MONUMENTAL HERO ARCHITECTURE ── */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center text-center"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          {/* Top Label */}
          <div className="mb-4 flex items-center gap-4">
            <div className="h-[1px] w-8 bg-ember" />
            <span className="font-mono text-xs md:text-sm tracking-[0.4em] uppercase text-paper/80 font-bold">
              THE MOMENTUM ENGINE
            </span>
            <div className="h-[1px] w-8 bg-ember" />
          </div>

          {/* Master Monolithic Wordmark */}
          <h1 className="hero-display flex items-center text-[clamp(90px,24vw,340px)] leading-[0.82] tracking-normal text-paper select-none">
            <span>E</span>
            <span className="mx-2 md:mx-4 text-ember">—</span>
            <span>CELL</span>
          </h1>

          {/* Subtitle Statement */}
          <p className="mt-6 max-w-xl font-mono text-xs md:text-sm tracking-[0.25em] text-ash uppercase">
            Where raw curiosity transforms into scalable ventures<span className="text-ember">.</span>
          </p>
        </motion.div>

        {/* ── STAGE 2: THE CORE FORMULA REVEAL ── */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto"
          style={{ opacity: formulaOpacity, y: formulaY, pointerEvents: "none" }}
        >
          <span className="font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase text-ember font-bold mb-4">
            01 // THE THESIS
          </span>
          <h2 className="font-display text-[clamp(36px,7vw,96px)] leading-[0.92] text-paper mb-6">
            IDEAS ARE CHEAP<span className="text-ember">.</span>
            <br />
            <span className="text-stroke-paper">EXECUTION IS EVERYTHING.</span>
          </h2>
          <p className="text-base md:text-xl text-paper/70 font-light max-w-2xl leading-relaxed">
            We don&apos;t just host seminars. We build real prototypes, assemble founding teams, and inject venture capital into student-built technology.
          </p>
        </motion.div>

        {/* ── STAGE 3: THE THREE LAUNCH PILLARS ── */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 max-w-5xl mx-auto"
          style={{ opacity: pillarsOpacity, y: pillarsY, pointerEvents: "none" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
            {PILLARS.map((p) => (
              <div
                key={p.num}
                className="border border-paper/15 bg-void/80 p-8 flex flex-col justify-between h-[220px] backdrop-blur-sm"
              >
                <div className="flex justify-between items-center font-mono text-xs text-ash">
                  <span className="text-ember font-bold">{p.num}</span>
                  <span className="tracking-[0.2em]">{p.label}</span>
                </div>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl text-paper tracking-wide">
                    {p.title}
                  </h3>
                  <div className="mt-4 h-[1px] w-12 bg-ember" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1, 0.85, 0.95], [1, 1, 1, 0]) }}
        >
          <div className="flex flex-col items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.3em] text-ash">SCROLL TO DISCOVER</span>
            <span className="block h-10 w-[1.5px] overflow-hidden bg-paper/15">
              <motion.span
                className="block h-4 w-full bg-ember"
                animate={reduced ? {} : { y: ["-100%", "260%"] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

