"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import WordFormation from "@/components/intro/WordFormation";
import { INTRO_WORDS, SITE } from "@/data/content";
import { sound } from "@/lib/sound";
import { startScroll, stopScroll, scrollToTop } from "@/lib/scroll";
import { Magnetic } from "@/components/core/Motion";

type Stage = "dot" | "text" | "words" | "lockup" | "gone";
type Mode = "full" | "short";

const STORE_KEY = "ecell-intro-v1";

export default function Intro({ onEnter }: { onEnter: () => void }) {
  const [mode, setMode] = useState<Mode>("full");
  const [stage, setStage] = useState<Stage>("dot");
  const [wordIdx, setWordIdx] = useState(0);
  const [ready, setReady] = useState(false);
  const [nonce, setNonce] = useState(0);
  const timers = useRef<number[]>([]);

  const after = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  /* Always play the full cinematic experience from the beginning */
  useEffect(() => {
    sound.init();
    setMode("full");
    setStage("dot");
    setWordIdx(0);
    setReady(true);

    const onReplay = () => {
      scrollToTop();
      clearTimers();
      setMode("full");
      setStage("dot");
      setWordIdx(0);
      setNonce((n) => n + 1);
    };
    window.addEventListener("ecell:replay-intro", onReplay);
    return () => window.removeEventListener("ecell:replay-intro", onReplay);
  }, [clearTimers]);

  /* lock scroll while the intro is up */
  useEffect(() => {
    if (stage === "gone") return;
    stopScroll();
    return () => startScroll();
  }, [stage]);

  /* mark as seen once the visitor reaches the enter screen */
  useEffect(() => {
    if (stage === "lockup") {
      try {
        localStorage.setItem(STORE_KEY, "1");
      } catch {
        /* ignore */
      }
    }
  }, [stage]);

  /* keyboard: escape skips */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  /* stage timeline */
  useEffect(() => {
    clearTimers();
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (stage === "dot") {
      sound.dot();
      after(() => setStage("text"), reduce ? 600 : 2300);
    } else if (stage === "text") {
      // reduced motion: skip the particle words entirely, go to lockup
      after(() => setStage(reduce ? "lockup" : "words"), reduce ? 800 : 4200);
    } else if (stage === "words") {
      sound.word();
    } else if (stage === "lockup") {
      sound.enter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  /* word sequence progression */
  useEffect(() => {
    if (stage !== "words") return;
    if (mode === "short") setWordIdx(INTRO_WORDS.length - 1);
  }, [stage, mode]);

  const onFormed = () => {
    sound.word();
    if (wordIdx === INTRO_WORDS.length - 1) {
      after(() => setStage("lockup"), 1200);
    }
  };

  const onGone = () => {
    if (wordIdx < INTRO_WORDS.length - 1) {
      setWordIdx((i) => i + 1);
    }
  };

  const skip = useCallback(() => {
    clearTimers();
    sound.enter();
    setStage("lockup");
  }, [clearTimers]);

  const enter = () => {
    sound.enter();
    startScroll();
    setStage("gone");
    onEnter();
  };

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const showSkip = stage === "dot" || stage === "text" || stage === "words";

  return (
    <AnimatePresence>
      {stage !== "gone" && (
        <motion.div
          className="fixed inset-0 z-[130] overflow-hidden bg-void text-paper"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          aria-label="Introduction"
        >
          {/* 1. Dot Phase */}
          <AnimatePresence mode="wait">
            {stage === "dot" && <DotScene key="dot" reduced={reduceMotion} />}
          </AnimatePresence>

          {/* 2. Manifesto Typography Phase */}
          <AnimatePresence mode="wait">
            {stage === "text" && <TextScene key="text" reduced={reduceMotion} />}
          </AnimatePresence>

          {/* 3. Word Kinetic Cycle (IDEA -> QUESTION -> BUILD -> E-CELL) */}
          <AnimatePresence mode="wait">
            {stage === "words" && !reduceMotion && (
              <motion.div
                key="words-container"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <WordFormation
                  word={INTRO_WORDS[wordIdx]}
                  onFormed={onFormed}
                  onGone={onGone}
                  nonce={nonce}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 4. Final Master Lockup Scene */}
          <AnimatePresence mode="wait">
            {stage === "lockup" && (
              <LockupScene key="lockup" onEnter={enter} reduced={reduceMotion} />
            )}
          </AnimatePresence>

          {/* Skip CTA */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                type="button"
                onClick={skip}
                className="label absolute right-5 top-5 z-20 flex items-center gap-2 text-paper/70 transition-colors hover:text-ember md:right-8 md:top-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                data-cursor="go"
              >
                SKIP INTRO
                <span className="inline-block h-3 w-3 rounded-full border border-current" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── the single dot ─────────────────────────────────────────── */
function DotScene({ reduced }: { reduced: boolean }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 60, damping: 18 });
  const y = useSpring(my, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 40);
      my.set((e.clientY / window.innerHeight - 0.5) * 30);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, reduced]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.25 }}
      transition={{ duration: 0.5, ease: [0.6, 0, 0.2, 1] }}
    >
      <motion.div style={{ x, y }} className="relative">
        {/* pulse ring */}
        <motion.span
          className="absolute -inset-8 rounded-full border border-paper/25"
          animate={
            reduced
              ? {}
              : {
                  scale: [1, 1.6],
                  opacity: [0.5, 0],
                }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        />
        {/* the dot — one idea */}
        <motion.span
          className="block h-[7px] w-[7px] rounded-full bg-paper"
          initial={{ scale: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ── the "what if" typography ───────────────────────────────── */
function TextScene({ reduced }: { reduced: boolean }) {
  const lines = [
    { t: "What if…", cls: "md:absolute md:left-[10%] md:top-[26%]", delay: 0 },
    {
      t: "…you built the thing…",
      cls: "md:absolute md:right-[8%] md:top-[44%] md:text-right",
      delay: 1.05,
    },
    {
      t: "…you can't stop thinking about?",
      cls: "md:absolute md:left-[14%] md:bottom-[22%]",
      delay: 2.2,
    },
  ];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 md:gap-0">
      {lines.map((l) => (
        <motion.p
          key={l.t}
          className={`font-display text-[26px] tracking-wide text-paper md:text-4xl ${l.cls}`}
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: reduced ? 0.01 : 0.8,
            delay: reduced ? 0 : l.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {l.t}
        </motion.p>
      ))}
    </div>
  );
}

/* ── the final lockup ───────────────────────────────────────── */
function LockupScene({
  onEnter,
  reduced,
}: {
  onEnter: () => void;
  reduced: boolean;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 28;
      const y = (e.clientY / window.innerHeight - 0.5) * 18;
      setTilt({ x, y });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);

  return (
    <motion.div
      className="relative flex h-full w-full select-none flex-col items-center justify-center overflow-hidden px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0.01 : 0.6 }}
    >
      {/* Background Architectural HUD Matrix */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-8 md:p-14 opacity-35 font-mono text-[10px] tracking-[0.3em] text-ash">
        <div className="flex justify-between items-center w-full">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-ember animate-ping" />
            SYS.READY // ARCHITECTURE ONLINE
          </span>
          <span>LAT 28.5355° N · LON 77.3910° E</span>
        </div>
        <div className="flex justify-between items-center w-full">
          <span>ENTREPRENEURSHIP CELL</span>
          <span>CHANDIGARH UNIVERSITY · UP</span>
        </div>
      </div>

      {/* 3D Parallax Main Lockup Frame */}
      <motion.div
        style={{
          transform: `perspective(1000px) rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg) translate3d(${tilt.x * 1.5}px, ${tilt.y * 1.5}px, 0)`,
          transition: "transform 0.12s cubic-bezier(0.2, 0, 0.2, 1)",
        }}
        className="relative z-10 flex flex-col items-center justify-center"
      >
        {/* Top Signal Indicator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex items-center gap-3"
        >
          <div className="h-[2px] w-12 bg-ember" />
          <span className="font-mono text-[11px] tracking-[0.35em] text-ember font-bold">
            INITIATE
          </span>
          <div className="h-[2px] w-12 bg-ember" />
        </motion.div>

        {/* Master Display Heading with Ghost Depth Stroke */}
        <div className="relative">
          <motion.h1
            className="hero-display flex text-[clamp(90px,22vw,320px)] leading-[0.82] tracking-tighter text-paper select-none"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <span>E</span>
            <span className="text-ember">—</span>
            <span>CELL</span>
          </motion.h1>

          {/* Glowing Shadow Outlines */}
          <h1
            aria-hidden
            className="hero-display pointer-events-none absolute inset-0 flex text-[clamp(90px,22vw,320px)] leading-[0.82] tracking-tighter text-transparent opacity-25 select-none"
            style={{
              WebkitTextStroke: "2px rgba(227,30,36,0.5)",
              transform: "translate(6px, 6px)",
            }}
          >
            <span>E</span>
            <span>—</span>
            <span>CELL</span>
          </h1>
        </div>

        {/* Location & Brand Credentials */}
        <motion.div
          className="mt-6 flex flex-col items-center gap-1.5"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-paper/90 font-medium">
            {SITE.university}
          </p>
          <p className="font-mono text-[11px] tracking-[0.4em] uppercase text-ember font-semibold">
            {SITE.campus}
          </p>
        </motion.div>

        {/* Master Magnetic Entry CTA */}
        <motion.div
          className="mt-10 md:mt-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <Magnetic>
            <button
              type="button"
              onClick={onEnter}
              data-cursor="enter"
              className="group relative inline-flex items-center gap-5 overflow-hidden border border-paper/40 bg-void/80 px-10 py-5 transition-all duration-500 hover:border-ember hover:shadow-[0_0_40px_rgba(227,30,36,0.4)]"
            >
              {/* Button Hover Fill Animation */}
              <span className="absolute inset-0 translate-y-full bg-ember transition-transform duration-500 ease-out group-hover:translate-y-0" />

              <span className="relative z-10 font-mono text-xs md:text-sm tracking-[0.25em] font-bold text-paper transition-colors duration-300">
                ENTER THE ECOSYSTEM
              </span>
              <span className="relative z-10 font-mono text-base text-ember transition-all duration-300 group-hover:translate-x-2 group-hover:text-paper">
                →
              </span>
            </button>
          </Magnetic>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
