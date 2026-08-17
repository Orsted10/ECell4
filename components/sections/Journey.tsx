"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import JourneyPath from "@/components/journey/JourneyPath";
import { JOURNEY_STAGES } from "@/data/content";
import ParticleField from "@/components/core/ParticleField";

const STAGES = JOURNEY_STAGES;

export default function Journey() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const introOpacity = useTransform(scrollYProgress, [0, 0.03, 0.07, 0.09], [0, 1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.09], [30, -30]);

  return (
    <section
      id="journey"
      ref={ref}
      className="relative h-[900vh] bg-void text-paper"
      aria-label="The entrepreneurial journey"
    >
      {/* pinned world */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <ParticleField density={0.35} opacity={0.35} />
        <JourneyPath progress={scrollYProgress} count={STAGES.length} />

        {/* opening statement */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
          style={{ opacity: introOpacity, y: introY }}
        >
          <p className="label mb-5 text-ember">02 — THE JOURNEY</p>
          <h2 className="hero-display text-[clamp(40px,8vw,120px)] leading-[0.9] text-paper">
            ONE IDEA. TEN STAGES.
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/60">
            This is the path every venture travels. You are walking it right
            now — whether you know it or not.
          </p>
        </motion.div>
      </div>

      {/* stage blocks travel through the viewport */}
      {STAGES.map((s, i) => {
        // Map 10 stages evenly across the scroll duration (0.11 to 0.95)
        const start = 0.11 + (i / STAGES.length) * 0.84;
        const end = start + 0.84 / STAGES.length;
        const o = useTransform(scrollYProgress, [start, start + 0.03, end - 0.03, end], [0, 1, 1, 0]);
        const y = useTransform(scrollYProgress, [start, end], [50, -50]);
        const left = i % 2 === 0;
        return (
          <div
            key={s.n}
            className="relative z-10 flex h-screen items-center px-6 md:px-[10vw]"
          >
            <motion.div
              style={{ opacity: o, y }}
              className={`w-full max-w-lg ${
                left ? "md:mr-auto" : "md:ml-auto"
              } ${i === STAGES.length - 1 ? "pb-24" : ""}`}
            >
              <div className="relative overflow-hidden rounded-sm border border-line bg-void/60 p-7 backdrop-blur-md transition-all duration-500 hover:border-ember/40 md:p-9">
                {/* Tech corner tick */}
                <span className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-ember" />
                <span className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-ember/40" />

                <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-5xl text-ember md:text-6xl">
                      {s.n}
                    </span>
                    <h3 className="font-display text-3xl tracking-wide text-paper md:text-4xl">
                      {s.title}
                    </h3>
                  </div>
                  <span className="label text-[10px] text-paper/40">
                    STAGE {s.n}/{String(STAGES.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {s.words.map((w, wi) => (
                    <span
                      key={wi}
                      className="label rounded-full border border-paper/10 bg-paper/[0.03] px-2.5 py-1 text-[10px] text-ash"
                    >
                      {w}
                    </span>
                  ))}
                </div>

                <p className="mt-5 text-[15px] leading-relaxed text-paper/80">
                  {s.text}
                </p>

                <div className="mt-6 flex items-center justify-between pt-3 text-[11px] text-paper/40">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" />
                    <span className="label text-paper/60">ACTIVE TRAJECTORY</span>
                  </div>
                  <span className="font-mono text-[10px] text-ember/80">
                    NODE_{s.n} // OK
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        );
      })}
    </section>
  );
}
