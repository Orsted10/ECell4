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

  /* memory + replay hook */
  useEffect(() => {
    sound.init();
    let seen = false;
    try {
      seen = localStorage.getItem(STORE_KEY) === "1";
    } catch {
      /* ignore */
    }
    setMode(seen ? "short" : "full");
    if (seen) setStage("words");
    if (seen) setWordIdx(INTRO_WORDS.length - 1);
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
    // start on E-CELL for returning visitors
    if (mode === "short") setWordIdx(INTRO_WORDS.length - 1);
  }, [stage, mode]);

  const onFormed = () => {
    sound.word();
    if (wordIdx === INTRO_WORDS.length - 1) {
      after(() => setStage("lockup"), 950);
    }
  };

  const onGone = () => {
    if (wordIdx < INTRO_WORDS.length - 1) {
      after(() => setWordIdx((i) => i + 1), 380);
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

  const inWords = stage === "words" || stage === "lockup";
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
          {/* the dot phase */}
          <AnimatePresence>
            {(stage === "dot" || stage === "text") && (
              <DotScene key="dot" reduced={reduceMotion} />
            )}
          </AnimatePresence>

          {/* the words around the dot */}
          <AnimatePresence>
            {stage === "text" && (
              <TextScene key="text" reduced={reduceMotion} />
            )}
          </AnimatePresence>

          {/* particle word formation */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: inWords ? 1 : 0,
              scale: inWords ? 1 : 1.06,
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {inWords && !reduceMotion && (
              <WordFormation
                word={INTRO_WORDS[wordIdx]}
                onFormed={onFormed}
                onGone={onGone}
                nonce={nonce}
              />
            )}
            {reduceMotion && inWords && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-6xl text-paper md:text-8xl">
                  {INTRO_WORDS[wordIdx]}
                </span>
              </div>
            )}
          </motion.div>

          {/* lockup — logo + university + enter */}
          <AnimatePresence>
            {stage === "lockup" && (
              <LockupScene key="lockup" onEnter={enter} reduced={reduceMotion} />
            )}
          </AnimatePresence>

          {/* skip */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                type="button"
                onClick={skip}
                className="label absolute right-5 top-5 z-10 flex items-center gap-2 text-paper/70 transition-colors hover:text-ember md:right-8 md:top-6"
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
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0.01 : 0.6 }}
    >
      {/* red line — the trajectory of possibility → action */}
      <motion.div
        className="mb-8 h-[2px] w-16 bg-ember"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.h2
        className="font-display text-6xl tracking-wide text-paper md:text-8xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        E-CELL
      </motion.h2>

      <motion.div
        className="mt-5 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <span className="label text-paper/80">{SITE.university}</span>
        <span className="label text-ember">{SITE.campus}</span>
      </motion.div>

      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.05 }}
      >
        <Magnetic>
          <button
            type="button"
            onClick={onEnter}
            data-cursor="enter"
            className="group relative inline-flex items-center gap-4 border border-paper/30 px-8 py-4 transition-colors duration-300 hover:border-ember hover:bg-ember"
          >
            <span className="label text-paper">ENTER THE ECOSYSTEM</span>
            <span className="text-ember transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-paper">
              →
            </span>
          </button>
        </Magnetic>
      </motion.div>
    </motion.div>
  );
}
