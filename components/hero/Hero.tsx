"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import ParticleField from "@/components/core/ParticleField";

const LETTERS = "BUILD".split("");
const LAYERS = ["CREATE", "FAIL", "LEARN", "PIVOT", "BUILD", "LAUNCH"];
const ECELL = "E-CELL".split("");

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // scroll phases
  const split = useTransform(scrollYProgress, [0.08, 0.5], [0, 1]);
  const buildOpacity = useTransform(scrollYProgress, [0, 0.08, 0.52, 0.62], [1, 1, 1, 0]);
  const buildScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.94]);
  const layersOpacity = useTransform(scrollYProgress, [0.3, 0.42, 0.6, 0.7], [0, 1, 1, 0]);
  const ecellOpacity = useTransform(scrollYProgress, [0.58, 0.72], [0, 1]);
  const ecellScale = useTransform(scrollYProgress, [0.58, 0.8], [0.9, 1]);
  const lineScale = useTransform(scrollYProgress, [0.6, 0.68], [0, 1]);
  const subOpacity = useTransform(scrollYProgress, [0.15, 0.3, 0.55, 0.65], [0, 1, 1, 0]);

  // mouse bend — the word physically leans around the cursor
  const bends = LETTERS.map(() => useMotionValue(0));
  const bendSprings = bends.map((b) => useSpring(b, { stiffness: 110, damping: 16, mass: 0.6 }));
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const onMove = (e: React.MouseEvent) => {
    if (reduced) return;
    letterRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const dx = e.clientX - cx;
      // gaussian falloff around the cursor
      const g = Math.exp(-(dx * dx) / (2 * 260 * 260));
      bends[i].set(g * 46 * (i % 2 === 0 ? 1 : -1));
    });
  };

  const splitYs = LETTERS.map((_, i) =>
    useTransform(split, (v) => v * (i - 2) * 120)
  );

  return (
    <section
      id="enter"
      ref={ref}
      onMouseMove={onMove}
      className="relative h-[320vh] bg-void"
      aria-label="Build what comes next"
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <ParticleField density={0.5} opacity={0.4} />

        {/* top label */}
        <div className="absolute left-5 top-24 md:left-8 md:top-28">
          <p className="label text-ash">
            E-CELL · CHANDIGARH UNIVERSITY · UTTAR PRADESH
          </p>
        </div>

        {/* the giant word */}
        <motion.h1
          className="relative z-10 select-none"
          style={{ opacity: buildOpacity, scale: buildScale }}
          aria-label="BUILD"
        >
          <span className="hero-display flex text-[clamp(110px,34vw,540px)] text-paper">
            {LETTERS.map((l, i) => (
              <motion.span
                key={i}
                ref={(el) => {
                  letterRefs.current[i] = el;
                }}
                style={{ y: splitYs[i] }}
                className="inline-block"
              >
                <motion.span style={{ y: bendSprings[i] }} className="inline-block">
                  {l}
                </motion.span>
              </motion.span>
            ))}
          </span>
        </motion.h1>

        {/* what comes next — editorial subtitle */}
        <motion.p
          className="relative z-10 mt-6 text-center text-lg font-medium text-paper/80 md:text-2xl"
          style={{ opacity: subOpacity }}
        >
          what comes next<span className="text-ember">.</span>
        </motion.p>

        {/* the layers revealed between the split letters */}
        <motion.div
          className="absolute inset-x-0 top-1/2 z-[5] -translate-y-1/2"
          style={{ opacity: layersOpacity }}
          aria-hidden
        >
          <div className="flex flex-col items-center gap-[2vh]">
            {LAYERS.map((w, i) => (
              <motion.span
                key={w}
                className="label text-ash"
                initial={{ opacity: 0.2 }}
                animate={{ opacity: [0.25, 0.9, 0.25] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              >
                {w}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* collapse into E-CELL */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center"
          style={{ opacity: ecellOpacity, scale: ecellScale }}
          aria-label="E-CELL"
        >
          <span className="hero-display flex text-[clamp(96px,28vw,440px)] text-paper">
            {ECELL.map((l, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {l === "-" ? <span className="text-ember">—</span> : l}
              </motion.span>
            ))}
          </span>
          <motion.div
            className="mt-6 h-[2px] w-40 bg-ember md:w-64"
            style={{ scaleX: lineScale }}
          />
          <p className="label mt-4 text-ash">A PLACE TO START.</p>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.06, 0.12], [1, 1, 0]) }}
        >
          <div className="flex flex-col items-center gap-3">
            <span className="label text-ash">SCROLL</span>
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
