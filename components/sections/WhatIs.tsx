"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ECOSYSTEM_WORDS, WHAT_IS_NOT } from "@/data/content";
import { MaskText } from "@/components/core/Motion";

const PLACE = "IT'S A PLACE TO START.";

export default function WhatIs() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const headOpacity = useTransform(scrollYProgress, [0, 0.08, 0.2, 0.3], [1, 1, 0, 0]);
  const headY = useTransform(scrollYProgress, [0, 0.25], [0, -40]);

  const placeOpacity = useTransform(scrollYProgress, [0.5, 0.58], [0, 1]);
  const placeScale = useTransform(scrollYProgress, [0.5, 0.62], [0.92, 1]);

  const wordsOpacity = useTransform(scrollYProgress, [0.66, 1], [0, 1]);
  const wordsY = useTransform(scrollYProgress, [0.66, 1], [60, 0]);

  return (
    <section
      id="what-is"
      ref={ref}
      className="relative h-[560vh] bg-paper text-ink"
      aria-label="What is E-Cell"
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        {/* heading */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: headOpacity, y: headY }}
        >
          <p className="label-ink mb-6 text-ember">01 — THE QUESTION</p>
          <h2 className="font-display text-[clamp(44px,9vw,140px)] leading-[0.9] text-ink">
            OK. BUT WHAT IS{" "}
            <span className="text-ember">E-CELL?</span>
          </h2>
        </motion.div>

        {/* denial sequence */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center md:gap-6">
          {WHAT_IS_NOT.map((line, i) => {
            const o = useTransform(
              scrollYProgress,
              [0.2 + i * 0.075, 0.26 + i * 0.075, 0.3 + (i + 1) * 0.075, 0.36 + (i + 1) * 0.075],
              [0, 1, 1, 0]
            );
            const s = useTransform(
              scrollYProgress,
              [0.2 + i * 0.075, 0.28 + i * 0.075],
              [0.94, 1]
            );
            return (
              <motion.p
                key={line}
                style={{ opacity: o, scale: s }}
                className="font-display text-[clamp(30px,6vw,84px)] leading-none text-ink"
              >
                {line}
              </motion.p>
            );
          })}
        </div>

        {/* IT'S A PLACE TO START. */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: placeOpacity, scale: placeScale }}
        >
          <motion.h2
            className="font-display text-[clamp(46px,10vw,160px)] leading-[0.88] text-ink"
            aria-label={PLACE}
          >
            {PLACE.split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  className="inline-block pb-[0.1em]"
                  initial={{ y: "110%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  {w}
                </motion.span>
                {i < PLACE.split(" ").length - 1 && <span>{"\u00A0"}</span>}
              </span>
            ))}
          </motion.h2>
          <motion.p
            className="mt-6 max-w-md text-base font-medium text-ink/60 md:text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Not a place with walls. A place where a dot becomes a line becomes a
            network becomes an ecosystem.
          </motion.p>
        </motion.div>

        {/* ecosystem words assemble around the particle */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ opacity: wordsOpacity, y: wordsY }}
        >
          <div className="relative grid max-w-4xl grid-cols-2 gap-x-8 gap-y-5 text-center md:grid-cols-4 md:gap-x-12">
            {ECOSYSTEM_WORDS.map((w, i) => {
              const o = useTransform(
                scrollYProgress,
                [0.68 + i * 0.028, 0.72 + i * 0.028],
                [0, 1]
              );
              const y = useTransform(
                scrollYProgress,
                [0.68 + i * 0.028, 0.74 + i * 0.028],
                [46, 0]
              );
              return (
                <motion.span
                  key={w}
                  style={{ opacity: o, y }}
                  className="font-display text-[clamp(24px,4.5vw,64px)] text-ink/85"
                >
                  {w}
                </motion.span>
              );
            })}
            {/* the particle at the center of it all */}
            <motion.span
              className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember md:block"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <p className="label-ink mt-10 text-ember">EVERYTHING STARTS WITH AN IDEA.</p>
        </motion.div>

        {/* quiet handoff strip */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ opacity: useTransform(scrollYProgress, [0.9, 1], [0, 1]) }}
        >
          <MaskText>
            <span className="label-ink">KEEP SCROLLING — THE PATH BEGINS BELOW.</span>
          </MaskText>
        </motion.div>
      </div>
    </section>
  );
}
