"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  word: string;
  onFormed?: () => void;
  onGone?: () => void;
  nonce?: number;
}

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

  useEffect(() => {
    // Notify formed when the word arrives with impact
    const tForm = setTimeout(() => {
      cb.current.onFormed?.();
    }, 1100);

    // Notify gone before transitioning to next
    const tGone = setTimeout(() => {
      cb.current.onGone?.();
    }, 2200);

    return () => {
      clearTimeout(tForm);
      clearTimeout(tGone);
    };
  }, [word, nonce]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 30;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMouseOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const letters = word.split("");
  const isEcell = word === "E-CELL";

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full select-none items-center justify-center overflow-hidden px-4"
    >
      {/* Background Architectural Grid Lines */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-paper/5 to-transparent" />
        <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-paper/5 to-transparent" />
      </div>

      {/* Kinetic Typography Stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${word}-${nonce}`}
          initial={{ opacity: 0, scale: 0.92, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{
            opacity: 0,
            scale: 1.12,
            filter: "blur(16px)",
            y: -20,
            transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] },
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center justify-center"
          style={{
            transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
            transition: "transform 0.15s cubic-bezier(0.2, 0, 0.2, 1)",
          }}
        >
          {/* Subtle Stage Counter Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-ash"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember animate-ping" />
            <span>PHASE // {word}</span>
          </motion.div>

          {/* Master Display Typography */}
          <div className="relative flex items-center justify-center overflow-visible px-8 py-6">
            <h1 className="hero-display flex items-center text-[clamp(80px,18vw,260px)] leading-none tracking-normal text-paper">
              {letters.map((char, index) => {
                const isDash = char === "-";
                const isRed = (isEcell && index >= 2) || (word === "BUILD" && index === 0);

                return (
                  <span
                    key={`${char}-${index}`}
                    className="relative inline-block overflow-hidden px-1 py-2"
                  >
                    <motion.span
                      initial={{ y: "110%", rotateZ: index % 2 === 0 ? 5 : -5, opacity: 0 }}
                      animate={{ y: "0%", rotateZ: 0, opacity: 1 }}
                      exit={{ y: "-110%", opacity: 0 }}
                      transition={{
                        duration: 0.75,
                        delay: index * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`inline-block transition-colors duration-300 ${
                        isRed ? "text-ember" : isDash ? "text-ash/60" : "text-paper"
                      }`}
                    >
                      {char}
                    </motion.span>
                  </span>
                );
              })}
            </h1>

            {/* Chromatic Ghost Shadow Layer for editorial depth */}
            <h1
              aria-hidden
              className="hero-display pointer-events-none absolute inset-0 flex items-center justify-center text-[clamp(80px,18vw,260px)] leading-none tracking-normal text-transparent opacity-20 px-8 py-6"
              style={{
                WebkitTextStroke: "1px rgba(227,30,36,0.6)",
                transform: "translate(4px, 4px)",
              }}
            >
              {word}
            </h1>
          </div>

          {/* Elegant Horizontal Signal Accent */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 flex items-center gap-4"
          >
            <div className="h-[1px] w-12 bg-ember" />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-paper/60">
              {word === "E-CELL" ? "CHANDIGARH UNIVERSITY · UP" : "THE MOMENTUM ENGINE"}
            </span>
            <div className="h-[1px] w-12 bg-ember" />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


