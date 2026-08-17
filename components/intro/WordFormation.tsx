"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  word: string;
  onFormed?: () => void;
  onGone?: () => void;
  nonce?: number;
}

const NARRATIVES: Record<
  string,
  { step: string; prompt: string; subtitle: string; tag: string }
> = {
  IDEA: {
    step: "PHASE 01 // GENESIS",
    prompt: "A SINGLE POINT OF ORIGIN",
    subtitle: "Everything significant started as something small.",
    tag: "RAW THOUGHT",
  },
  QUESTION: {
    step: "PHASE 02 // INQUIRY",
    prompt: "WHY DOES THIS EXIST?",
    subtitle: "The courage to ask what everyone else walks past.",
    tag: "UNSOLVED GAP",
  },
  BUILD: {
    step: "PHASE 03 // EXECUTION",
    prompt: "PROTOTYPE THE FUTURE",
    subtitle: "Turning abstract thoughts into working machines.",
    tag: "IMPACT IN MOTION",
  },
};

export default function WordFormation({
  word,
  onFormed,
  onGone,
  nonce = 0,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const cb = useRef({ onFormed, onGone });
  cb.current = { onFormed, onGone };

  const narrative = NARRATIVES[word] || {
    step: "PHASE // DISCOVERY",
    prompt: "THE ENGINE OF CHANGE",
    subtitle: "Architecting the future.",
    tag: "MOMENTUM",
  };

  useEffect(() => {
    // Notify formed when the word arrives with impact
    const tForm = setTimeout(() => {
      cb.current.onFormed?.();
    }, 1100);

    // Notify gone before transitioning to next
    const tGone = setTimeout(() => {
      cb.current.onGone?.();
    }, 2400);

    return () => {
      clearTimeout(tForm);
      clearTimeout(tGone);
    };
  }, [word, nonce]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 32;
      const y = (e.clientY / innerHeight - 0.5) * 22;
      setMouseOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const letters = word.split("");

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full select-none items-center justify-center overflow-hidden px-6"
    >
      {/* Background Architectural Grid Lines */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-paper/5 to-transparent" />
        <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-paper/5 to-transparent" />
      </div>

      {/* Kinetic Typography & Story Stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${word}-${nonce}`}
          initial={{ opacity: 0, scale: 0.94, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: "blur(16px)",
            y: -30,
            transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] },
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center justify-center max-w-4xl text-center"
          style={{
            transform: `perspective(1000px) rotateX(${-mouseOffset.y * 0.4}deg) rotateY(${mouseOffset.x * 0.4}deg) translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
            transition: "transform 0.15s cubic-bezier(0.2, 0, 0.2, 1)",
          }}
        >
          {/* Top Tag & Phase Counter */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mb-4 flex items-center gap-3 font-mono text-[10px] md:text-[11px] tracking-[0.35em] text-ash"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-ember animate-ping" />
            <span className="text-paper/80 font-bold">{narrative.step}</span>
            <span className="text-ash/40">/</span>
            <span className="text-ember font-semibold">{narrative.tag}</span>
          </motion.div>

          {/* Master Display Typography */}
          <div className="relative flex items-center justify-center overflow-visible px-8 py-4">
            <h1 className="hero-display flex items-center text-[clamp(96px,22vw,340px)] leading-[0.84] tracking-normal text-paper">
              {letters.map((char, index) => {
                const isHighlight = word === "BUILD" && index === 0;

                return (
                  <span
                    key={`${char}-${index}`}
                    className="relative inline-block overflow-hidden px-1.5 py-3"
                  >
                    <motion.span
                      initial={{ y: "115%", rotateZ: index % 2 === 0 ? 6 : -6, opacity: 0 }}
                      animate={{ y: "0%", rotateZ: 0, opacity: 1 }}
                      exit={{ y: "-115%", opacity: 0 }}
                      transition={{
                        duration: 0.75,
                        delay: index * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`inline-block transition-colors duration-300 ${
                        isHighlight ? "text-ember" : "text-paper"
                      }`}
                    >
                      {char}
                    </motion.span>
                  </span>
                );
              })}
            </h1>

            {/* Chromatic Ghost Shadow Layer */}
            <h1
              aria-hidden
              className="hero-display pointer-events-none absolute inset-0 flex items-center justify-center text-[clamp(96px,22vw,340px)] leading-[0.84] tracking-normal text-transparent opacity-20 px-8 py-4 select-none"
              style={{
                WebkitTextStroke: "2px rgba(227,30,36,0.6)",
                transform: "translate(6px, 6px)",
              }}
            >
              {word}
            </h1>
          </div>

          {/* Editorial Philosophy Statement */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="mt-4 flex flex-col items-center gap-2 max-w-lg"
          >
            <p className="font-mono text-xs md:text-sm tracking-[0.25em] text-paper/90 uppercase font-semibold">
              {narrative.prompt}
            </p>
            <p className="text-sm text-ash md:text-base font-light italic">
              {narrative.subtitle}
            </p>
          </motion.div>

          {/* Elegant Horizontal Signal Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex items-center gap-4 w-full max-w-xs justify-center"
          >
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-ember to-ember" />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-paper/40">
              E-CELL
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-ember to-ember" />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}



