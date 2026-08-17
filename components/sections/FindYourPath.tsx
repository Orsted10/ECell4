"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PATH_OPTIONS } from "@/data/content";
import { MaskText, Magnetic, Reveal } from "@/components/core/Motion";
import { sound } from "@/lib/sound";
import { scrollToId } from "@/lib/scroll";

export default function FindYourPath() {
  const [choice, setChoice] = useState<string | null>(null);

  const selected = PATH_OPTIONS.find((p) => p.choice === choice);

  return (
    <section
      id="your-path"
      className="relative bg-void px-6 py-28 text-paper md:px-[8vw] md:py-40"
      aria-label="Find your path"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <p className="label mb-5 text-ember">09 — YOUR MOVE</p>
          <h2 className="font-display text-[clamp(36px,6.5vw,100px)] leading-[0.9]">
            WHAT BROUGHT YOU{" "}
            <span className="text-stroke-paper">HERE?</span>
          </h2>
        </div>

        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="border-t border-line"
            >
              {PATH_OPTIONS.map((p, i) => (
                <motion.button
                  key={p.choice}
                  type="button"
                  onClick={() => {
                    setChoice(p.choice);
                    sound.enter();
                  }}
                  data-cursor="go"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex w-full items-center justify-between border-b border-line py-4 text-left md:py-5"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="label w-6 text-ash transition-colors group-hover:text-ember">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-xl text-paper transition-all duration-300 group-hover:translate-x-2 group-hover:text-ember md:text-3xl">
                      {p.choice}
                    </span>
                  </span>
                  <span className="text-ember opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    →
                  </span>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={selected.choice}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="label mb-8 text-center text-ash">
                YOUR PATH · FROM “{selected.choice}”
              </p>

              {/* the path builds */}
              <div className="flex flex-col items-center gap-2 md:flex-row md:items-center md:justify-center">
                {selected.path.map((node, i) => (
                  <div key={node} className="flex flex-col items-center md:flex-row md:items-center">
                    {i > 0 && (
                      <motion.span
                        className="mx-0 my-1 block h-6 w-[2px] bg-ember md:mx-3 md:my-0 md:h-[2px] md:w-10"
                        initial={{ scaleY: 0, scaleX: 0 }}
                        animate={{ scaleY: 1, scaleX: 1 }}
                        transition={{ delay: 0.4 + i * 0.3, duration: 0.3 }}
                      />
                    )}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.3, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-center gap-2"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 bg-void">
                        <span className="label text-ember">{String(i + 1).padStart(2, "0")}</span>
                      </span>
                      <span className="label max-w-[120px] text-center text-paper/85">{node}</span>
                    </motion.div>
                  </div>
                ))}
              </div>

              <div className="mt-14 flex flex-col items-center gap-5">
                <Magnetic>
                  <button
                    type="button"
                    onClick={() => scrollToId("start")}
                    data-cursor="go"
                    className="group inline-flex items-center gap-4 border border-ember bg-ember px-8 py-4"
                  >
                    <span className="label text-paper">TAKE THE FIRST STEP →</span>
                  </button>
                </Magnetic>
                <button
                  type="button"
                  onClick={() => {
                    setChoice(null);
                    sound.click();
                  }}
                  data-cursor="go"
                  className="label text-ash transition-colors hover:text-ember"
                >
                  ← CHOOSE A DIFFERENT PATH
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-24 text-center">
          <MaskText>
            <p className="font-display text-[clamp(24px,4vw,56px)] leading-tight text-paper/90">
              YOU DON'T NEED TO BUILD A COMPANY TODAY.
            </p>
          </MaskText>
          <Reveal delay={0.15}>
            <p className="font-display mt-2 text-[clamp(24px,4vw,56px)] leading-tight">
              JUST TAKE THE NEXT <span className="text-ember">1%.</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
