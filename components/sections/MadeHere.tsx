"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PROJECTS, type Project } from "@/data/content";
import { MaskText, Reveal } from "@/components/core/Motion";
import { sound } from "@/lib/sound";
import { startScroll, stopScroll } from "@/lib/scroll";

export default function MadeHere() {
  const [open, setOpen] = useState<Project | null>(null);

  useEffect(() => {
    if (open) {
      stopScroll();
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        startScroll();
      };
    }
  }, [open]);

  return (
    <section
      id="made-here"
      className="relative bg-paper px-6 py-28 text-ink md:px-[8vw] md:py-36"
      aria-label="Projects made here"
    >
      <div className="mb-14 flex flex-col justify-between gap-8 md:mb-20 md:flex-row md:items-end">
        <div>
          <p className="label-ink mb-5 text-ember">06 — THE ARTIFACTS</p>
          <h2 className="font-display text-[clamp(40px,7vw,110px)] leading-[0.9]">
            MADE <span className="text-stroke-ink">HERE.</span>
          </h2>
        </div>
        <Reveal className="max-w-sm">
          <p className="text-[15px] leading-relaxed text-ink/65">
            What leaves this ecosystem. Each one started as a dot on some
            notebook page. Click an artifact to step into its world.
          </p>
        </Reveal>
      </div>

      {/* editorial rows */}
      <div className="border-t border-line-ink">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.05} y={20}>
            <button
              type="button"
              onClick={() => {
                setOpen(p);
                sound.enter();
              }}
              data-cursor="view"
              className="group grid w-full grid-cols-[52px_1fr_auto] items-center gap-4 border-b border-line-ink py-7 text-left transition-colors duration-300 hover:bg-ink/[0.03] md:grid-cols-[80px_1fr_1.2fr_auto] md:gap-8 md:py-9"
            >
              <span className="font-display text-2xl text-ash transition-colors duration-300 group-hover:text-ember">
                {p.index}
              </span>
              <span className="font-display text-[clamp(20px,3vw,42px)] leading-none text-ink transition-transform duration-300 group-hover:translate-x-2">
                {p.name}
              </span>
              <span className="hidden text-sm text-ink/55 md:block">
                {p.problem}
              </span>
              <span className="flex items-center gap-4">
                <span className="label-ink hidden border border-ink/25 px-2.5 py-1 text-ink/70 sm:block">
                  {p.status}
                </span>
                <span className="text-ember transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <p className="label-ink mt-6 text-ash">
        SAMPLE ARTIFACTS — REAL PROJECTS ARRIVE VIA data/content.ts OR A CMS.
      </p>

      {/* project world modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[118] flex items-end justify-center bg-void/95 backdrop-blur-sm md:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${open.name} project world`}
          >
            <motion.div
              className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto bg-void p-8 text-paper md:p-14"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* project world: color temperature shifts */}
              <div className="pointer-events-none absolute inset-0 bg-ember/[0.06]" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="label text-ember">ARTIFACT {open.index}</p>
                  <button
                    type="button"
                    onClick={() => setOpen(null)}
                    data-cursor="go"
                    className="label text-ash transition-colors hover:text-ember"
                  >
                    BACK TO ECOSYSTEM ✕
                  </button>
                </div>

                <h3 className="mt-6 font-display text-[clamp(36px,6vw,84px)] leading-[0.9]">
                  {open.name}
                </h3>

                <div className="mt-10 grid gap-8 md:grid-cols-2">
                  <div>
                    <p className="label mb-2 text-ash">FOUNDERS</p>
                    <p className="text-base font-medium">{open.founders}</p>
                  </div>
                  <div>
                    <p className="label mb-2 text-ash">STATUS</p>
                    <p className="text-base font-medium text-ember">{open.status}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="label mb-2 text-ash">THE PROBLEM</p>
                    <p className="text-base leading-relaxed text-paper/80">{open.problem}</p>
                  </div>
                  <div>
                    <p className="label mb-2 text-ash">STACK</p>
                    <p className="text-base text-paper/80">{open.tech.join(" · ")}</p>
                  </div>
                  <div>
                    <p className="label mb-2 text-ash">THE LESSON</p>
                    <p className="text-base text-paper/80">{open.lesson}</p>
                  </div>
                </div>

                <div className="mt-12 flex items-center gap-4">
                  <span className="h-[2px] w-12 bg-ember" />
                  <span className="label text-ash">MADE AT E-CELL · CHANDIGARH UNIVERSITY · UTTAR PRADESH</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* handoff */}
      <div className="mt-24 text-center md:mt-32">
        <MaskText>
          <p className="font-display text-[clamp(26px,4.5vw,64px)] leading-tight text-ink">
            THE NEXT ARTIFACT COULD BE YOURS.
          </p>
        </MaskText>
        <Reveal delay={0.2} className="mt-6">
          <p className="label-ink text-ember">SEE WHAT THEY BUILT → · THEN BUILD YOURS.</p>
        </Reveal>
      </div>
    </section>
  );
}
