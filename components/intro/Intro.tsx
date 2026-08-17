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
    setStage("gone");
    startScroll();
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
    { t: "What if…", tag: "HYPOTHESIS 01", cls: "md:absolute md:left-[12%] md:top-[22%]", delay: 0 },
    {
      t: "…you built the thing…",
      tag: "CATALYST 02",
      cls: "md:absolute md:right-[12%] md:top-[42%] md:text-right",
      delay: 1.05,
    },
    {
      t: "…you can't stop thinking about?",
      tag: "CONVICTION 03",
      cls: "md:absolute md:left-[16%] md:bottom-[24%]",
      delay: 2.1,
    },
  ];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 overflow-hidden px-6 md:gap-0">
      {/* Background ambient cosmic glow and architectural telemetry */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[450px] w-[450px] rounded-full bg-ember/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,239,233,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Crosshair coordinate markers */}
      <div className="pointer-events-none absolute left-8 top-8 font-mono text-[10px] tracking-[0.3em] text-ash/40">
        LAT_28.6139 // LON_77.2090
      </div>
      <div className="pointer-events-none absolute bottom-8 right-8 font-mono text-[10px] tracking-[0.3em] text-ash/40">
        ORIGIN_VECTOR // SEED_NODE
      </div>

      {/* Central Pulsing Origin Ring */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-64 w-64 rounded-full border border-paper/[0.04] animate-[spin_60s_linear_infinite]" />
        <div className="h-96 w-96 rounded-full border border-dashed border-ember/[0.06] animate-[spin_40s_linear_infinite_reverse]" />
      </div>

      {lines.map((l) => (
        <motion.div
          key={l.t}
          className={`${l.cls} z-10 flex flex-col`}
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: reduced ? 0.01 : 0.85,
            delay: reduced ? 0 : l.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className="mb-2 font-mono text-[10px] uppercase tracking-[0.35em] text-ember/80 font-bold">
            [{l.tag}]
          </span>
          <p className="font-display text-[clamp(28px,4.5vw,56px)] leading-[1.1] tracking-tight text-paper">
            {l.t}
          </p>
        </motion.div>
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
  return (
    <motion.div
      className="relative flex h-full w-full select-none flex-col items-center justify-center overflow-hidden px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: reduced ? 0.01 : 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Editorial System Metadata Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-8 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-ash"
      >
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-ember animate-ping" />
          <span className="text-paper/90 font-bold">INITIATIVE</span>
        </span>
        <span className="text-ash/40">/</span>
        <span className="text-ember font-semibold">ECOSYSTEM PORTAL</span>
      </motion.div>

      {/* Monumental Stable Wordmark */}
      <div className="relative flex items-center justify-center overflow-visible py-2">
        <motion.h1
          className="hero-display flex items-center text-[clamp(100px,24vw,340px)] leading-[0.82] tracking-normal text-paper select-none"
          initial={{ y: 60, opacity: 0, filter: "blur(12px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>E</span>
          <span className="mx-2 md:mx-4 inline-block text-ember">—</span>
          <span>CELL</span>
        </motion.h1>
      </div>

      {/* Institutional Credentials */}
      <motion.div
        className="mt-6 flex flex-col items-center gap-1.5"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-xs md:text-sm tracking-[0.32em] uppercase text-paper/90 font-medium">
          {SITE.university}
        </p>
        <p className="font-mono text-[11px] tracking-[0.45em] uppercase text-ember font-semibold">
          {SITE.campus}
        </p>
      </motion.div>

      {/* Precision Action Button */}
      <motion.div
        className="mt-12 md:mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <Magnetic>
          <button
            type="button"
            onClick={onEnter}
            data-cursor="enter"
            className="group relative inline-flex items-center gap-6 overflow-hidden border border-paper/30 bg-void px-12 py-5 transition-all duration-500 hover:border-ember hover:shadow-[0_0_50px_rgba(227,30,36,0.35)]"
          >
            {/* Sliding Crimson Fill */}
            <span className="absolute inset-0 translate-y-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />

            <span className="relative z-10 font-mono text-xs md:text-sm tracking-[0.3em] font-bold text-paper transition-colors duration-300">
              ENTER THE ECOSYSTEM
            </span>
            <span className="relative z-10 font-mono text-lg text-ember transition-all duration-300 group-hover:translate-x-2 group-hover:text-paper">
              →
            </span>
          </button>
        </Magnetic>
      </motion.div>
    </motion.div>
  );
}
