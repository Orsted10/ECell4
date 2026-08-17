"use client";

import { motion } from "framer-motion";
import ParticleField from "@/components/core/ParticleField";
import { SITE } from "@/data/content";

const PILLARS = [
  {
    num: "01",
    label: "GENESIS",
    title: "IDEATION & PROTOTYPING",
    desc: "From a rough midnight sketch to a working MVP in 7 days.",
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
  return (
    <section
      id="enter"
      className="relative min-h-screen bg-void text-paper overflow-hidden"
      aria-label="E-Cell Innovation Engine"
    >
      <ParticleField density={0.4} opacity={0.3} />

      {/* Ambient Subtle Architectural Reticle Lines */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-paper/5 to-transparent" />
        <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-paper/5 to-transparent" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-36 pb-28 md:pt-44 md:pb-36 flex flex-col items-center text-center">
        
        {/* Top Floating Institutional Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-8 flex items-center gap-3 font-mono text-[10px] md:text-[11px] tracking-[0.35em] text-ash"
        >
          <span className="h-2 w-2 rounded-full bg-ember animate-ping" />
          <span className="text-paper/90 font-bold">{SITE.university}</span>
          <span className="text-ash/40">/</span>
          <span className="text-ember font-semibold">{SITE.campus}</span>
        </motion.div>

        {/* Master Monolithic Wordmark */}
        <div className="relative flex items-center justify-center overflow-visible py-4">
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hero-display flex items-center text-[clamp(84px,20vw,310px)] leading-[0.82] tracking-normal text-paper select-none"
          >
            <span>E</span>
            <span className="mx-2 md:mx-4 text-ember">—</span>
            <span>CELL</span>
          </motion.h1>
        </div>

        {/* Subtitle Statement */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 max-w-2xl font-mono text-xs md:text-sm tracking-[0.25em] text-ash uppercase leading-relaxed"
        >
          A place where raw curiosity transforms into scalable, venture-backed companies<span className="text-ember">.</span>
        </motion.p>

        {/* ── CORE THESIS CALLOUT ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mt-32 md:mt-44 max-w-4xl border-y border-paper/10 py-16 px-4 md:px-12 flex flex-col items-center"
        >
          <span className="font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase text-ember font-bold mb-4">
            01 // THE THESIS
          </span>
          <h2 className="hero-display text-[clamp(32px,6vw,80px)] leading-[0.94] text-paper mb-6">
            IDEAS ARE CHEAP<span className="text-ember">.</span>
            <br />
            <span className="text-stroke-paper">EXECUTION IS EVERYTHING.</span>
          </h2>
          <p className="text-base md:text-lg text-paper/70 font-light max-w-2xl leading-relaxed">
            We don&apos;t just host seminars. We build real prototypes, assemble founding teams, and inject venture capital into student-built technology.
          </p>
        </motion.div>

        {/* ── THREE LAUNCH PILLARS ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 md:mt-28 w-full max-w-6xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="border border-paper/15 bg-void-2/60 p-8 flex flex-col justify-between min-h-[260px] backdrop-blur-sm transition-all duration-300 hover:border-ember/60 hover:shadow-[0_0_30px_rgba(227,30,36,0.15)] group"
              >
                <div className="flex justify-between items-center font-mono text-xs text-ash">
                  <span className="text-ember font-bold text-sm">{p.num}</span>
                  <span className="tracking-[0.25em] group-hover:text-paper transition-colors">{p.label}</span>
                </div>
                <div className="my-6">
                  <h3 className="hero-display text-2xl md:text-3xl text-paper tracking-wide mb-3">
                    {p.title}
                  </h3>
                  <p className="text-sm text-ash font-light leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="h-[2px] w-8 bg-ember transition-all duration-300 group-hover:w-full" />
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}


