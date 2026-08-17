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

const PILLARS = [
  {
    num: "01",
    tag: "INCUBATE",
    title: "IDEATION & PROTOTYPING",
    tagline: "0 TO 1 PRODUCT LAB",
    desc: "From a midnight breakthrough to a battle-tested MVP with product-market fit.",
    stats: "7-DAY SPRINT",
  },
  {
    num: "02",
    tag: "FUND",
    title: "CAPITAL & MENTORSHIP",
    tagline: "VENTURE CATALYST",
    desc: "Direct access to non-dilutive seed grants, angel syndicates, and unicorn founders.",
    stats: "₹50L+ POOL",
  },
  {
    num: "03",
    tag: "SCALE",
    title: "SCALING TO IMPACT",
    tagline: "EXPONENTIAL GROWTH",
    desc: "Institutional go-to-market channels, enterprise contracts, and global venture backing.",
    stats: "SERIES A PATH",
  },
];

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Buttery physics spring for zero-latency weighted responsiveness
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    restDelta: 0.001,
  });

  // ── Stage 1: Master E-CELL Monolith Parallax Explosion (0.00 -> 0.30)
  const eX = useTransform(smooth, [0, 0.28], [0, -220]);
  const cellX = useTransform(smooth, [0, 0.28], [0, 220]);
  const dashScale = useTransform(smooth, [0, 0.22], [1, 0]);
  const s1Opacity = useTransform(smooth, [0, 0.18, 0.28], [1, 0.8, 0]);
  const s1Scale = useTransform(smooth, [0, 0.28], [1, 1.18]);

  // ── Stage 2: Kinetic Editorial Thesis Assembly (0.30 -> 0.65)
  const s2Opacity = useTransform(smooth, [0.30, 0.38, 0.58, 0.66], [0, 1, 1, 0]);
  const s2Scale = useTransform(smooth, [0.30, 0.40, 0.58, 0.66], [0.92, 1, 1, 1.05]);
  const line1X = useTransform(smooth, [0.30, 0.42], [-60, 0]);
  const line2X = useTransform(smooth, [0.30, 0.42], [60, 0]);
  const s2Glow = useTransform(smooth, [0.36, 0.48], [0, 1]);

  // ── Stage 3: Individual Staggered 3D Pillar Card Entrances (0.68 -> 1.00)
  const s3Opacity = useTransform(smooth, [0.68, 0.76], [0, 1]);
  
  // Card 1
  const card1Y = useTransform(smooth, [0.68, 0.82], [120, 0]);
  const card1Rotate = useTransform(smooth, [0.68, 0.82], [6, 0]);
  const card1Opacity = useTransform(smooth, [0.68, 0.78], [0, 1]);

  // Card 2 (Center)
  const card2Y = useTransform(smooth, [0.72, 0.86], [160, 0]);
  const card2Scale = useTransform(smooth, [0.72, 0.86], [0.9, 1]);
  const card2Opacity = useTransform(smooth, [0.72, 0.82], [0, 1]);

  // Card 3
  const card3Y = useTransform(smooth, [0.76, 0.90], [200, 0]);
  const card3Rotate = useTransform(smooth, [0.76, 0.90], [-6, 0]);
  const card3Opacity = useTransform(smooth, [0.76, 0.86], [0, 1]);

  return (
    <section
      id="enter"
      ref={containerRef}
      className="relative h-[360vh] bg-void text-paper"
      aria-label="E-Cell Innovation Engine"
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <ParticleField density={0.4} opacity={0.3} />

        {/* Ambient Subtle Architectural Reticle Grid Lines */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-paper/5 to-transparent" />
          <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-paper/5 to-transparent" />
        </div>

        {/* Top Floating Institutional Badge */}
        <div className="absolute left-6 top-24 md:left-12 md:top-28 z-20 flex items-center gap-3 font-mono text-[10px] md:text-[11px] tracking-[0.35em] text-ash">
          <span className="h-2 w-2 rounded-full bg-ember animate-ping" />
          <span className="text-paper/90 font-bold">{SITE.university}</span>
          <span className="text-ash/40">/</span>
          <span className="text-ember font-semibold">{SITE.campus}</span>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            STAGE 1: KINETIC SPLIT WORDMARK (0.00 -> 0.30)
           ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center text-center select-none"
          style={{
            opacity: s1Opacity,
            scale: s1Scale,
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

          {/* Explosive Splitting Glyphs */}
          <h1 className="hero-display flex items-center text-[clamp(90px,24vw,340px)] leading-[0.82] tracking-normal text-paper overflow-visible">
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

        {/* ════════════════════════════════════════════════════════════════════
            STAGE 2: MONUMENTAL EDITORIAL THESIS (0.30 -> 0.65)
           ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center max-w-6xl mx-auto"
          style={{
            opacity: s2Opacity,
            scale: s2Scale,
            pointerEvents: "none",
          }}
        >
          {/* Metadata Reticle Pill */}
          <div className="mb-8 inline-flex items-center gap-3 border border-ember/30 bg-ember/10 px-4 py-1.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-ember animate-ping" />
            <span className="font-mono text-[10px] md:text-xs tracking-[0.35em] uppercase text-ember font-bold">
              01 // CORE PHILOSOPHY
            </span>
          </div>

          {/* Kinetic Dual-Line Typography Explosion */}
          <div className="flex flex-col items-center justify-center gap-1 md:gap-3">
            <motion.div style={{ x: line1X }} className="flex items-center gap-3 md:gap-6">
              <span className="hero-display text-[clamp(44px,8.5vw,130px)] leading-[0.88] text-paper">
                IDEAS ARE
              </span>
              <span className="hero-display text-[clamp(44px,8.5vw,130px)] leading-[0.88] text-ember italic font-bold">
                CHEAP.
              </span>
            </motion.div>

            <motion.div style={{ x: line2X }} className="flex items-center gap-3 md:gap-6">
              <span className="hero-display text-[clamp(44px,8.5vw,130px)] leading-[0.88] text-stroke-paper opacity-85">
                EXECUTION IS
              </span>
              <span className="hero-display text-[clamp(44px,8.5vw,130px)] leading-[0.88] text-paper underline decoration-ember decoration-4 underline-offset-8">
                EVERYTHING.
              </span>
            </motion.div>
          </div>

          {/* Editorial manifesto block */}
          <motion.div
            style={{ opacity: s2Glow }}
            className="mt-10 max-w-2xl border-t border-paper/15 pt-8 text-center"
          >
            <p className="text-base md:text-xl text-paper/80 font-light leading-relaxed">
              We replace passive theory with high-velocity building. We inject non-dilutive capital, founder mentorship, and institutional resources into student ventures.
            </p>
          </motion.div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════════
            STAGE 3: 3D CASCADING LAUNCH PILLARS (0.68 -> 1.00)
           ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 max-w-7xl mx-auto"
          style={{
            opacity: s3Opacity,
            pointerEvents: "none",
          }}
        >
          {/* Top Section Header */}
          <div className="mb-10 text-center">
            <span className="font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase text-ember font-bold">
              02 // THE VEHICLE
            </span>
            <h3 className="hero-display text-3xl md:text-5xl text-paper mt-2 tracking-wide">
              HOW WE BUILD VENTURES
            </h3>
          </div>

          {/* 3 Individually Animated 3D Floating Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
            
            {/* ── CARD 01: GENESIS ── */}
            <motion.div
              style={{
                y: card1Y,
                rotateZ: card1Rotate,
                opacity: card1Opacity,
              }}
              className="relative overflow-hidden border border-paper/20 bg-void-2/90 p-8 flex flex-col justify-between min-h-[340px] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            >
              {/* Top Meta */}
              <div>
                <div className="flex justify-between items-center font-mono text-xs text-ash border-b border-paper/10 pb-4 mb-6">
                  <span className="text-ember font-bold text-base">{PILLARS[0].num}</span>
                  <span className="tracking-[0.25em] text-paper/90 font-medium">{PILLARS[0].tag}</span>
                </div>
                <span className="font-mono text-[10px] tracking-[0.25em] text-ember uppercase font-semibold">
                  {PILLARS[0].tagline}
                </span>
                <h4 className="hero-display text-2xl md:text-3xl text-paper mt-2 mb-4 leading-none">
                  {PILLARS[0].title}
                </h4>
                <p className="text-sm text-ash font-light leading-relaxed">
                  {PILLARS[0].desc}
                </p>
              </div>

              {/* Bottom Stat Footer */}
              <div className="mt-8 pt-4 border-t border-paper/10 flex justify-between items-center font-mono text-xs">
                <span className="text-ash/60">SPRINT</span>
                <span className="text-ember font-bold">{PILLARS[0].stats}</span>
              </div>
            </motion.div>

            {/* ── CARD 02: VENTURE (HERO CENTER) ── */}
            <motion.div
              style={{
                y: card2Y,
                scale: card2Scale,
                opacity: card2Opacity,
              }}
              className="relative overflow-hidden border-2 border-ember bg-void-2/95 p-8 flex flex-col justify-between min-h-[340px] backdrop-blur-xl shadow-[0_0_50px_rgba(227,30,36,0.25)]"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 inset-x-0 h-1 bg-ember" />

              <div>
                <div className="flex justify-between items-center font-mono text-xs text-ash border-b border-paper/10 pb-4 mb-6">
                  <span className="text-ember font-bold text-base">{PILLARS[1].num}</span>
                  <span className="tracking-[0.25em] text-ember font-bold">{PILLARS[1].tag}</span>
                </div>
                <span className="font-mono text-[10px] tracking-[0.25em] text-ember uppercase font-semibold">
                  {PILLARS[1].tagline}
                </span>
                <h4 className="hero-display text-2xl md:text-3xl text-paper mt-2 mb-4 leading-none">
                  {PILLARS[1].title}
                </h4>
                <p className="text-sm text-paper/80 font-light leading-relaxed">
                  {PILLARS[1].desc}
                </p>
              </div>

              {/* Bottom Stat Footer */}
              <div className="mt-8 pt-4 border-t border-paper/10 flex justify-between items-center font-mono text-xs">
                <span className="text-ash/60">ALLOCATION</span>
                <span className="text-ember font-bold text-sm">{PILLARS[1].stats}</span>
              </div>
            </motion.div>

            {/* ── CARD 03: MOMENTUM ── */}
            <motion.div
              style={{
                y: card3Y,
                rotateZ: card3Rotate,
                opacity: card3Opacity,
              }}
              className="relative overflow-hidden border border-paper/20 bg-void-2/90 p-8 flex flex-col justify-between min-h-[340px] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            >
              <div>
                <div className="flex justify-between items-center font-mono text-xs text-ash border-b border-paper/10 pb-4 mb-6">
                  <span className="text-ember font-bold text-base">{PILLARS[2].num}</span>
                  <span className="tracking-[0.25em] text-paper/90 font-medium">{PILLARS[2].tag}</span>
                </div>
                <span className="font-mono text-[10px] tracking-[0.25em] text-ember uppercase font-semibold">
                  {PILLARS[2].tagline}
                </span>
                <h4 className="hero-display text-2xl md:text-3xl text-paper mt-2 mb-4 leading-none">
                  {PILLARS[2].title}
                </h4>
                <p className="text-sm text-ash font-light leading-relaxed">
                  {PILLARS[2].desc}
                </p>
              </div>

              {/* Bottom Stat Footer */}
              <div className="mt-8 pt-4 border-t border-paper/10 flex justify-between items-center font-mono text-xs">
                <span className="text-ash/60">TRAJECTORY</span>
                <span className="text-ember font-bold">{PILLARS[2].stats}</span>
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* Dynamic Scroll Progress Bar Indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-mono text-[9px] tracking-[0.3em] text-ash">PROGRESS</span>
          <div className="h-10 w-[1.5px] bg-paper/15 overflow-hidden">
            <motion.div
              className="w-full bg-ember origin-top"
              style={{
                height: "100%",
                scaleY: smooth,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}




