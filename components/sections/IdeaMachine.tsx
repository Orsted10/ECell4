"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { transform, type StageResult } from "@/lib/ideaEngine";
import { sound } from "@/lib/sound";
import { Magnetic, MaskText, Reveal } from "@/components/core/Motion";
import { scrollToId } from "@/lib/scroll";

const STAGE_MS = 1350;

export default function IdeaMachine() {
  const reduced = useReducedMotion();
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [stages, setStages] = useState<StageResult[]>([]);
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "running") return;
    if (idx >= stages.length - 1) {
      setPhase("done");
      sound.complete();
      return;
    }
    timer.current = window.setTimeout(() => {
      setIdx((i) => i + 1);
      sound.stage();
    }, STAGE_MS);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [phase, idx, stages.length]);

  const run = () => {
    if (!input.trim()) return;
    const results = transform(input.trim());
    setStages(results);
    setIdx(0);
    setPhase("running");
    sound.stage();
  };

  const advance = () => {
    if (phase !== "running") return;
    if (idx < stages.length - 1) {
      setIdx((i) => i + 1);
      sound.stage();
    } else {
      setPhase("done");
      sound.complete();
    }
  };

  const reset = () => {
    setPhase("idle");
    setInput("");
    setStages([]);
    setIdx(0);
    inputRef.current?.focus();
  };

  const onType = () => {
    // the "One Question" moment — typed characters become particles
    const el = inputRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      window.dispatchEvent(
        new CustomEvent("cursor:burst", {
          detail: { x: r.left + r.width / 2, y: r.top + r.height / 2 },
        })
      );
    }
  };

  const progress = stages.length ? idx / (stages.length - 1) : 0;
  const current: StageResult | undefined = stages[idx];

  return (
    <section
      id="idea-machine"
      className="relative overflow-hidden bg-void px-6 py-28 text-paper md:px-[8vw] md:py-40"
      aria-label="The idea machine"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <p className="label mb-5 text-ember">05 — THE IDEA MACHINE</p>
        <h2 className="font-display text-[clamp(34px,6.5vw,96px)] leading-[0.95]">
          WHAT PROBLEM CAN'T YOU{" "}
          <span className="text-stroke-paper">STOP THINKING ABOUT?</span>
        </h2>

        {/* input */}
        <div className="mt-14 w-full">
          <AnimatePresence mode="wait">
            {phase === "idle" && (
              <motion.div
                key="idle"
                className="flex w-full flex-col items-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    onType();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      run();
                    }
                  }}
                  rows={2}
                  placeholder="Type it here…"
                  className="w-full resize-none border-b border-paper/25 bg-transparent pb-4 text-center font-display text-2xl leading-snug text-paper placeholder:text-paper/25 focus:border-ember md:text-4xl"
                  aria-label="Describe the problem you can't stop thinking about"
                />
                <Magnetic>
                  <button
                    type="button"
                    onClick={run}
                    disabled={!input.trim()}
                    data-cursor="go"
                    className="group inline-flex items-center gap-4 border border-paper/30 px-7 py-3.5 transition-colors duration-300 enabled:hover:border-ember enabled:hover:bg-ember disabled:opacity-30"
                  >
                    <span className="label text-paper">RUN IT THROUGH THE MACHINE</span>
                    <span className="text-ember transition-transform duration-300 group-hover:translate-x-1 group-hover:text-paper">→</span>
                  </button>
                </Magnetic>
                <p className="label text-ash/60">PRESS ENTER OR CLICK · NO DATA IS COLLECTED</p>
              </motion.div>
            )}

            {phase !== "idle" && current && (
              <motion.div
                key={phase === "done" ? "done" : current.key}
                className="w-full"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={advance}
                data-cursor={phase === "running" ? "go" : undefined}
              >
                {/* the trajectory — one line, ten nodes */}
                <div className="mx-auto mb-10 flex max-w-xl items-center">
                  <div className="relative h-[2px] flex-1 bg-paper/15">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-ember"
                      style={{ width: `${progress * 100}%` }}
                    />
                    {stages.map((s, i) => (
                      <span
                        key={s.key}
                        className={`absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                          i <= idx ? "bg-ember" : "bg-paper/25"
                        }`}
                        style={{ left: `${(i / (stages.length - 1)) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>

                <p className="label mb-6 text-ash">
                  {phase === "done"
                    ? "MACHINE COMPLETE"
                    : `STAGE ${String(idx + 1).padStart(2, "0")} OF ${String(stages.length).padStart(2, "0")}`}
                </p>

                {phase === "done" ? (
                  <div className="flex flex-col items-center gap-3">
                    <h3 className="font-display text-[clamp(44px,8vw,120px)] leading-none">
                      GOOD.
                    </h3>
                    <p className="font-display text-[clamp(22px,4vw,48px)] text-paper/80">
                      NOW BUILD SOMETHING.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                      <Magnetic>
                        <button
                          type="button"
                          onClick={() => scrollToId("your-path")}
                          data-cursor="enter"
                          className="border border-ember bg-ember px-7 py-3.5"
                        >
                          <span className="label text-paper">FIND YOUR PATH →</span>
                        </button>
                      </Magnetic>
                      <button
                        type="button"
                        onClick={reset}
                        data-cursor="go"
                        className="border border-paper/30 px-7 py-3.5 transition-colors hover:border-paper"
                      >
                        <span className="label text-paper">RUN ANOTHER THROUGH</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="label mb-2 text-ember">{current.prompt}</p>
                    <h3 className="font-display text-[clamp(30px,5vw,64px)] leading-tight">
                      {current.text}
                    </h3>
                    <p className="label mt-8 text-ash/50">CLICK TO ADVANCE</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* explanation */}
        <Reveal className="mt-20 max-w-2xl">
          <MaskText>
            <p className="font-display text-[clamp(22px,3.5vw,44px)] leading-tight text-paper/85">
              A vague thought in. A direction out.
            </p>
          </MaskText>
          <p className="mt-4 text-sm leading-relaxed text-paper/55">
            This is exactly what E-Cell does with ideas — pulls them apart,
            asks the uncomfortable questions, finds the people, and pushes them
            out into the world. The machine is intentionally simple right now.
            It is built to accept real AI later.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
