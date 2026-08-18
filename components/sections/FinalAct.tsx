"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import WordFormation from "@/components/intro/WordFormation";
import { SITE } from "@/data/content";
import { Magnetic } from "@/components/core/Motion";
import { scrollToId } from "@/lib/scroll";
import FoundryModal from "@/components/foundry/FoundryModal";

export default function FinalAct() {
  const ref = useRef<HTMLElement>(null);
  const [foundryOpen, setFoundryOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [flashOn, setFlashOn] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setFlashOn(p > 0.28 && p < 0.52);
  });

  // Tightly calibrated timeline across 220vh with zero trailing empty void
  const smallO = useTransform(scrollYProgress, [0, 0.08, 0.18, 0.26], [0, 1, 1, 0]);
  const ideaO = useTransform(scrollYProgress, [0.24, 0.32, 0.42, 0.50], [0, 1, 1, 0]);
  const ideaScale = useTransform(scrollYProgress, [0.24, 0.36], [0.9, 1]);
  const flashOpacity = useTransform(scrollYProgress, [0.28, 0.32, 0.46, 0.50], [0, 1, 1, 0]);
  
  const askO = useTransform(scrollYProgress, [0.48, 0.56, 0.66, 0.74], [0, 1, 1, 0]);
  
  // The final CTA and footer fade in at 0.68 and remain permanently solid and pinned until the very bottom
  const choicesO = useTransform(scrollYProgress, [0.70, 0.82, 1.0], [0, 1, 1]);
  const footerO = useTransform(scrollYProgress, [0.76, 0.88, 1.0], [0, 1, 1]);

  return (
    <section
      id="start"
      ref={ref}
      className="relative h-[220vh] bg-void text-paper"
      aria-label="Start something"
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        
        {/* EVERYTHING STARTS SMALL. */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 text-center pointer-events-none"
          style={{ opacity: smallO }}
        >
          <p className="hero-display text-[clamp(32px,6vw,96px)] leading-[0.95] text-paper">
            EVERYTHING STARTS{" "}
            <span className="text-stroke-paper">SMALL.</span>
          </p>
        </motion.div>

        {/* The dot returns */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: ideaO }}
        >
          <motion.span
            className="block h-[8px] w-[8px] rounded-full bg-paper"
            style={{ scale: useTransform(scrollYProgress, [0.24, 0.30], [0, 1]) }}
          />
        </motion.div>

        {/* AN IDEA. */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 text-center pointer-events-none"
          style={{ opacity: ideaO, scale: ideaScale }}
        >
          <p className="hero-display text-[clamp(44px,10vw,160px)] leading-[0.9]">
            AN <span className="text-ember">IDEA.</span>
          </p>
        </motion.div>

        {/* The ecosystem flashes — final particle word formation */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: flashOpacity }}
        >
          {flashOn && (
            <WordFormation
              word="E-CELL"
            />
          )}
        </motion.div>

        {/* WHAT WILL YOU START? */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
          style={{ opacity: askO }}
        >
          <p className="hero-display text-[clamp(34px,7vw,110px)] leading-[0.9]">
            WHAT WILL YOU{" "}
            <span className="text-ember">START?</span>
          </p>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════════
            THE THREE FINAL CHOICES (PINNED FIRMLY AT THE CONCLUSION)
           ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6"
          style={{ opacity: choicesO }}
        >
          <div className="flex flex-col items-stretch gap-3 sm:flex-row">
            <Magnetic>
              <button
                type="button"
                onClick={() => setFoundryOpen(true)}
                data-cursor="enter"
                className="group relative border-2 border-ember bg-ember px-8 py-4 shadow-[0_0_35px_rgba(227,30,36,0.6)] transition-all hover:scale-105 active:scale-95"
              >
                <span className="label font-mono text-sm tracking-[0.25em] text-paper font-bold uppercase">
                  JOIN THE FOUNDRY →
                </span>
              </button>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollToId("idea-machine")}
                data-cursor="go"
                className="border border-paper/30 px-8 py-4 transition-all duration-300 hover:border-ember hover:bg-ember/10"
              >
                <span className="label font-mono text-sm tracking-[0.25em] text-paper uppercase">
                  SUBMIT AN IDEA →
                </span>
              </button>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollToId("events")}
                data-cursor="enter"
                className="border border-paper/30 px-8 py-4 transition-all duration-300 hover:border-ember hover:bg-ember/10"
              >
                <span className="label font-mono text-sm tracking-[0.25em] text-paper uppercase">
                  EXPLORE EVENTS →
                </span>
              </button>
            </Magnetic>
          </div>
        </motion.div>

        {/* Footer Lockup */}
        <motion.div
          className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1.5 pb-6 font-mono pointer-events-none"
          style={{ opacity: footerO }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-ash">{SITE.university}</span>
          <p className="font-display text-2xl tracking-widest text-paper">E-CELL</p>
          <span className="text-[10px] uppercase tracking-[0.3em] text-ember font-bold">{SITE.campus}</span>
        </motion.div>
      </div>

      <FoundryModal isOpen={foundryOpen} onClose={() => setFoundryOpen(false)} />
    </section>
  );
}
