"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import ParticleField from "@/components/core/ParticleField";
import { SITE } from "@/data/content";

const THESIS_WORDS = ["IDEAS", "ARE", "CHEAP.", "EXECUTION", "IS", "EVERYTHING."];

const PILLARS = [
  {
    num: "01",
    label: "GENESIS",
    title: "IDEATION & PROTOTYPING",
    desc: "From a midnight sketch to a working MVP in 7 days.",
  },
  {
    num: "02",
    label: "VENTURE",
    title: "CAPITAL & MENTORSHIP",
    desc: "Direct access to seed grants, angels, and veteran founders.",
  },
  {
    num: "03",
    label: "MOMENTUM",
    title: "SCALING TO IMPACT",
    desc: "Customer acquisition, corporate partnerships, and institutional growth.",
  },
];

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth physics spring for buttery scroll responsiveness
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    restDelta: 0.001,
  });

  // Stage 1 (0 -> 0.35): E-CELL explodes outwards in 3D parallax on scroll
  const eX = useTransform(smoothProgress, [0, 0.3], [0, -180]);
  const dashScale = useTransform(smoothProgress, [0, 0.25], [1, 0]);
  const cellX = useTransform(smoothProgress, [0, 0.3], [0, 180]);
  const wordmarkOpacity = useTransform(smoothProgress, [0, 0.22, 0.32], [1, 0.9, 0]);
  const wordmarkScale = useTransform(smoothProgress, [0, 0.3], [1, 1.15]);

  // Stage 2 (0.35 -> 0.7): THESIS kinetic staggered word reveals
  const thesisOpacity = useTransform(smoothProgress, [0.32, 0.42, 0.62, 0.72], [0, 1, 1, 0]);
  const thesisScale = useTransform(smoothProgress, [0.32, 0.45, 0.62, 0.72], [0.92, 1, 1, 1.06]);
  const thesisY = useTransform(smoothProgress, [0.32, 0.45, 0.62, 0.72], [60, 0, 0, -40]);

  // Stage 3 (0.72 -> 1.0): PILLARS rise into place
  const pillarsOpacity = useTransform(smoothProgress, [0.72, 0.85], [0, 1]);
  const pillarsY = useTransform(smoothProgress, [0.72, 0.88], [60, 0]);

  return (
    <section
      id="enter"
      ref={containerRef}
      className="relative h-[320vh] bg-void text-paper"
      aria-label="E-Cell Innovation Engine"
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <ParticleField density={0.4} opacity={0.3} />

        {/* Top Floating Institutional Badge */}
        <div className="absolute left-6 top-24 md:left-12 md:top-28 z-20 flex items-center gap-3 font-mono text-[10px] md:text-[11px] tracking-[0.35em] text-ash">
          <span className="h-2 w-2 rounded-full bg-ember animate-ping" />
          <span className="text-paper/90 font-bold">{SITE.university}</span>
          <span className="text-ash/40">/</span>
          <span className="text-ember font-semibold">{SITE.campus}</span>
        </div>

        {/* ── STAGE 1: KINETIC SPLIT WORDMARK (0.0 -> 0.35) ── */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center text-center select-none"
          style={{
            opacity: wordmarkOpacity,
            scale: wordmarkScale,
            pointerEvents: "none",
          }}
        >
          <div className="mb-4 flex items-center gap-4">
            <div className="h-[1px] w-8 bg-ember" />
            <span className="font-mono text-xs md:text-sm tracking-[0.4em] uppercase text-paper/80 font-bold">
              THE MOMENTUM ENGINE
            </span>
            <div className="h-[1px] w-8 bg-ember" />
          </div>

          {/* Kinetic Splitting E — CELL */}
          <h1 className="hero-display flex items-center text-[clamp(90px,22vw,330px)] leading-[0.82] tracking-normal text-paper overflow-visible">
            <motion.span style={{ x: eX }} className="inline-block">
              E
            </motion.span>
            <motion.span
              style={{ scale: dashScale }}
              className="mx-3 md:mx-6 inline-block text-ember origin-center"
            >
              —
            </motion.span>
            <motion.span style={{ x: cellX }} className="inline-block">
              CELL
            </motion.span>
          </h1>

          <p className="mt-6 max-w-xl font-mono text-xs md:text-sm tracking-[0.25em] text-ash uppercase">
            SCROLL TO EXPLORE THE ECOSYSTEM<span className="text-ember">.</span>
          </p>
        </motion.div>

        {/* ── STAGE 2: KINETIC THESIS ASSEMBLY (0.35 -> 0.7) ── */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto"
          style={{
            opacity: thesisOpacity,
            scale: thesisScale,
            y: thesisY,
            pointerEvents: "none",
          }}
        >
          <span className="font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase text-ember font-bold mb-4">
            01 // THE THESIS
          </span>

          <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6 gap-y-2 max-w-4xl">
            {THESIS_WORDS.map((w, idx) => {
              const isAccent = w.includes("CHEAP") || w.includes("EVERYTHING");
              return (
                <span
                  key={idx}
                  className={`hero-display text-[clamp(38px,7vw,94px)] leading-[0.92] ${
                    isAccent ? "text-ember" : idx >= 3 ? "text-stroke-paper" : "text-paper"
                  }`}
                >
                  {w}
                </span>
              );
            })}
          </div>

          <p className="mt-8 text-base md:text-xl text-paper/70 font-light max-w-2xl leading-relaxed">
            We don&apos;t just host seminars. We build real prototypes, assemble founding teams, and inject venture capital into student-built technology.
          </p>
        </motion.div>

        {/* ── STAGE 3: THE THREE LAUNCH PILLARS (0.72 -> 1.0) ── */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 max-w-6xl mx-auto"
          style={{
            opacity: pillarsOpacity,
            y: pillarsY,
            pointerEvents: "none",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
            {PILLARS.map((p, i) => (
              <div
                key={p.num}
                className="border border-paper/15 bg-void-2/80 p-8 flex flex-col justify-between min-h-[260px] backdrop-blur-md transition-all duration-300"
              >
                <div className="flex justify-between items-center font-mono text-xs text-ash">
                  <span className="text-ember font-bold text-sm">{p.num}</span>
                  <span className="tracking-[0.25em] text-paper/90">{p.label}</span>
                </div>
                <div className="my-4">
                  <h3 className="hero-display text-2xl md:text-3xl text-paper tracking-wide mb-3">
                    {p.title}
                  </h3>
                  <p className="text-sm text-ash font-light leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="h-[2px] w-12 bg-ember" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Scroll Progress Bar Indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-mono text-[9px] tracking-[0.3em] text-ash">DISCOVER</span>
          <div className="h-10 w-[1.5px] bg-paper/15 overflow-hidden">
            <motion.div
              className="w-full bg-ember origin-top"
              style={{
                height: "100%",
                scaleY: smoothProgress,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}



