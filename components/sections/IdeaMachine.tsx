"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type StageResult } from "@/lib/ideaEngine";
import { sound } from "@/lib/sound";
import { Magnetic } from "@/components/core/Motion";
import { scrollToId } from "@/lib/scroll";

const STAGE_MS = 3800;

const SPARK_PROMPTS = [
  "Autonomous campus EV bike battery swapping network",
  "Multi-agent AI copilot for collegiate legal & grant filings",
  "Decentralized student GPU compute cluster for local LLMs",
  "Automated mess surplus food redistribution & cold chain",
];

export default function IdeaMachine() {
  const reduced = useReducedMotion();
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [stages, setStages] = useState<StageResult[]>([]);
  const [idx, setIdx] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<number | null>(null);

  // Auto progression across stages
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

  const run = async () => {
    if (!input.trim() || isAiLoading) return;
    setIsAiLoading(true);
    sound.stage();

    try {
      const res = await fetch("/api/idea-machine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: input.trim() }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.stages) && data.stages.length > 0) {
        setStages(data.stages);
      } else {
        throw new Error("Fallback required");
      }
    } catch {
      // Deterministic immediate fallback
      const kw = input.trim().split(" ").filter((w) => w.length > 3).slice(0, 2).join(" ") || "this problem";
      setStages([
        {
          key: "problem",
          label: "01 // THE CORE FRICTION",
          prompt: "WHY DOES THIS HURT?",
          text: `“${input.trim()}” wastes hundreds of hours because current legacy systems are uncoordinated, manual, and slow.`,
        },
        {
          key: "exists",
          label: "02 // CURRENT WORKAROUNDS",
          prompt: "WHAT SUCKS TODAY?",
          text: "Messy spreadsheets, unorganized WhatsApp groups, and broken handoffs. People tolerate the pain because nobody built the obvious fix.",
        },
        {
          key: "prototype",
          label: "03 // THE 30-DAY MVP",
          prompt: "WHAT DO YOU SHIP FIRST?",
          text: "One hyper-focused web tool solving just the single most painful bottleneck. Built with Next.js, Supabase, and deployed in 7 days.",
        },
        {
          key: "advantage",
          label: "04 // UNFAIR ADVANTAGE",
          prompt: "WHY A STUDENT FOUNDER WINS",
          text: "Zero corporate bloat. Rapid daily iteration. Direct unmediated access to thousands of daily campus users.",
        },
        {
          key: "pitch",
          label: "05 // THE ELEVATOR HOOK",
          prompt: "THE ONE-LINER",
          text: `The high-velocity operating platform that turns ${kw} into a frictionless 10-second workflow.`,
        },
        {
          key: "launch",
          label: "06 // FIRST 100 USERS",
          prompt: "THE LAUNCH LOOP",
          text: "Onboard 10 power users in 48 hours. Watch them work, fix all friction in real-time, and let organic campus word-of-mouth drive momentum.",
        },
      ]);
    } finally {
      setIsAiLoading(false);
      setIdx(0);
      setPhase("running");
      sound.stage();
    }
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
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const setPrompt = (text: string) => {
    setInput(text);
    sound.dot();
    inputRef.current?.focus();
  };

  const progress = stages.length ? (idx + 1) / stages.length : 0;
  const current: StageResult | undefined = stages[idx];

  return (
    <section
      id="idea-machine"
      className="relative overflow-hidden bg-void px-6 py-28 text-paper md:px-[8vw] md:py-40"
      aria-label="The idea machine"
    >
      {/* Ambient background glowing aura and subtle crosshair grid */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
        <div className="h-[600px] w-[600px] rounded-full bg-ember/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,239,233,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        
        {/* Section Header Badge */}
        <div className="mb-6 inline-flex items-center gap-3 border border-ember/30 bg-ember/10 px-4 py-1.5 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-ember animate-ping" />
          <span className="font-mono text-xs tracking-[0.35em] uppercase text-ember font-bold">
            05 // THE IDEA MACHINE
          </span>
        </div>

        <h2 className="hero-display text-[clamp(36px,6.5vw,96px)] leading-[0.92] text-paper">
          WHAT PROBLEM CAN'T YOU{" "}
          <span className="text-stroke-paper">STOP THINKING ABOUT?</span>
        </h2>

        <p className="mt-4 max-w-xl font-mono text-xs md:text-sm tracking-[0.2em] text-ash uppercase">
          TYPE ANY RAW IDEA OR DAILY FRUSTRATION. WATCH IT GET RE-ENGINEERED INTO A VENTURE BLUEPRINT.
        </p>

        {/* ════════════════════════════════════════════════════════════════════
            INTERACTIVE INPUT CONSOLE
           ════════════════════════════════════════════════════════════════════ */}
        <div className="mt-12 w-full">
          <AnimatePresence mode="wait">
            
            {phase === "idle" && (
              <motion.div
                key="idle"
                className="flex w-full flex-col items-center gap-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Sleek High-Tech Command Container */}
                <div className="relative w-full rounded-2xl border border-paper/20 bg-paper/[0.03] p-6 md:p-8 backdrop-blur-xl transition-all duration-300 shadow-[0_20px_60px_rgba(0,0,0,0.85)] focus-within:border-ember focus-within:shadow-[0_0_40px_rgba(227,30,36,0.25)]">
                  
                  {/* Top Telemetry Header */}
                  <div className="mb-4 flex items-center justify-between border-b border-paper/10 pb-3 font-mono text-[11px] uppercase tracking-wider text-ash">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-ember" />
                      <span className="text-paper font-semibold">NEURAL FORGE // v4.2</span>
                      <span className="text-ash/40">|</span>
                      <span className="text-ember font-bold">GROQ LLaMA 3.3 ACCELERATED</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>{input.trim() ? `${input.trim().split(/\s+/).length} WORDS` : "READY"}</span>
                      <span className="hidden sm:inline-block text-paper/60">[ ↵ ENTER TO RUN ]</span>
                    </div>
                  </div>

                  {/* High-Impact Multi-line Textarea */}
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        run();
                      }
                    }}
                    rows={3}
                    placeholder="Describe the problem, the inefficiency, or the thing you want to build..."
                    className="w-full resize-none bg-transparent font-display text-2xl md:text-3xl leading-snug text-paper placeholder:text-ash/40 outline-none border-none focus:ring-0 selection:bg-ember selection:text-white"
                    aria-label="Describe the problem you can't stop thinking about"
                  />

                  {/* Bottom Console Spark Ideas */}
                  <div className="mt-4 pt-4 border-t border-paper/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash font-bold">
                      QUICK SPARKS:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {SPARK_PROMPTS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPrompt(p)}
                          className="rounded-full border border-paper/15 bg-paper/[0.04] px-3 py-1 font-mono text-[11px] text-paper/80 transition-all hover:border-ember hover:bg-ember/15 hover:text-paper"
                        >
                          ⚡ {p.split(" ").slice(0, 4).join(" ")}…
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="flex flex-col items-center gap-3">
                  <Magnetic>
                    <button
                      type="button"
                      onClick={run}
                      disabled={!input.trim() || isAiLoading}
                      data-cursor="go"
                      className="group relative inline-flex items-center gap-4 rounded-xl border-2 border-ember bg-gradient-to-r from-ember to-ember/90 px-10 py-4 font-mono text-sm tracking-[0.25em] font-bold text-paper shadow-[0_0_35px_rgba(227,30,36,0.45)] transition-all hover:scale-105 hover:shadow-[0_0_55px_rgba(227,30,36,0.7)] active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      {isAiLoading ? (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>SYNTHESIZING STARTUP BLUEPRINT...</span>
                        </>
                      ) : (
                        <>
                          <span>TRANSFORM INTO VENTURE</span>
                          <span className="transition-transform duration-300 group-hover:translate-x-1.5">⚡</span>
                        </>
                      )}
                    </button>
                  </Magnetic>
                  <p className="font-mono text-[11px] tracking-widest text-ash/60 uppercase">
                    POWERED BY GROQ LLaMA 3.3 · REAL-TIME HEURISTIC ACCELERATION
                  </p>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════════════
                RUNNING / DONE STAGES OUTPUT
               ════════════════════════════════════════════════════════════════════ */}
            {phase !== "idle" && current && (
              <motion.div
                key={phase === "done" ? "done" : current.key}
                className="w-full"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: reduced ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                onClick={advance}
                data-cursor={phase === "running" ? "go" : undefined}
              >
                {/* 10-Stage Trajectory Bar */}
                <div className="mx-auto mb-10 max-w-xl">
                  <div className="mb-3 flex items-center justify-between font-mono text-[11px] tracking-widest text-ash">
                    <span className="text-ember font-bold">
                      STAGE {String(idx + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
                    </span>
                    <span>{phase === "done" ? "COMPLETED" : "CLICK TO ADVANCE ↵"}</span>
                  </div>
                  <div className="relative h-[4px] w-full rounded-full bg-paper/15 overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-ember rounded-full shadow-[0_0_12px_rgba(227,30,36,0.8)]"
                      style={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Stage Result Blueprint Card */}
                <div className="relative mx-auto max-w-3xl rounded-2xl border border-ember/40 bg-void/90 p-8 md:p-12 shadow-[0_0_60px_rgba(227,30,36,0.2)] text-left backdrop-blur-2xl">
                  <div className="flex items-center justify-between border-b border-paper/10 pb-4 mb-6">
                    <span className="font-mono text-xs font-bold tracking-[0.3em] text-ember uppercase">
                      {current.label}
                    </span>
                    <span className="font-mono text-[10px] tracking-widest text-ash uppercase">
                      [{current.prompt}]
                    </span>
                  </div>

                  <p className="font-display text-2xl md:text-4xl text-paper leading-snug tracking-wide">
                    {current.text}
                  </p>

                  <div className="mt-8 pt-6 border-t border-paper/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(current.text);
                      }}
                      className="font-mono text-xs tracking-wider text-ash hover:text-paper uppercase transition-colors"
                    >
                      [ COPY BLUEPRINT ]
                    </button>

                    <div className="flex items-center gap-4">
                      {phase === "done" ? (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              reset();
                            }}
                            className="border border-paper/30 px-5 py-2.5 font-mono text-xs tracking-widest text-paper hover:border-paper transition-colors"
                          >
                            ↻ TRY ANOTHER IDEA
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              scrollToId("start");
                            }}
                            className="border border-ember bg-ember px-6 py-2.5 font-mono text-xs font-bold tracking-widest text-paper shadow-[0_0_20px_rgba(227,30,36,0.4)]"
                          >
                            BUILD THIS IN THE FOUNDRY →
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            advance();
                          }}
                          className="border border-ember bg-ember/20 border-dashed px-6 py-2.5 font-mono text-xs tracking-widest text-paper hover:bg-ember hover:border-solid transition-all"
                        >
                          NEXT STAGE →
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {phase === "running" && (
                  <p className="mt-6 font-mono text-[11px] tracking-widest text-ash/60 uppercase">
                    AUTO-ADVANCING IN {STAGE_MS / 1000}S · CLICK ANYWHERE TO ACCELERATE
                  </p>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
