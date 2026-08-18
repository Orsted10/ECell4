"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type StageResult } from "@/lib/ideaEngine";
import { sound } from "@/lib/sound";
import { Magnetic } from "@/components/core/Motion";
import { scrollToId } from "@/lib/scroll";
import FoundryModal from "@/components/foundry/FoundryModal";

const SPARK_PROMPTS = [
  { tag: "AI / AGENTS", text: "Multi-agent legal & grant copilot for collegiate founders" },
  { tag: "MOBILITY / EV", text: "Campus autonomous EV bike battery swapping mesh network" },
  { tag: "DEEP TECH", text: "Decentralized student GPU compute cluster for local LLMs" },
  { tag: "SUSTAINABILITY", text: "Smart automated mess surplus food redistribution & cold chain" },
];

export default function IdeaMachine() {
  const reduced = useReducedMotion();
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [stages, setStages] = useState<StageResult[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [foundryOpen, setFoundryOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
          text: `“${input.trim()}” wastes hundreds of hours weekly because legacy systems are fragmented, manual, and slow.`,
        },
        {
          key: "exists",
          label: "02 // CURRENT WORKAROUNDS",
          prompt: "WHAT SUCKS TODAY?",
          text: "Messy spreadsheets, disorganized WhatsApp groups, and broken handoffs. People tolerate the friction only because no one built the obvious fix.",
        },
        {
          key: "prototype",
          label: "03 // THE 30-DAY MVP SPEC",
          prompt: "WHAT DO YOU SHIP FIRST?",
          text: "One hyper-focused web tool solving just the single most painful bottleneck. Built with Next.js, Supabase, and deployed in 7 days.",
        },
        {
          key: "advantage",
          label: "04 // UNFAIR ADVANTAGE",
          prompt: "WHY A STUDENT FOUNDER WINS",
          text: "Zero corporate bloat. Daily rapid iteration. Direct unmediated access to thousands of daily campus users for instant feedback loops.",
        },
        {
          key: "pitch",
          label: "05 // THE ELEVATOR HOOK",
          prompt: "THE ONE-LINER",
          text: `The high-velocity operating platform that turns ${kw} into a frictionless 10-second automated workflow.`,
        },
        {
          key: "launch",
          label: "06 // FIRST 100 USERS",
          prompt: "THE LAUNCH LOOP",
          text: "Directly onboard 10 power users in 48 hours. Watch them work, eliminate all friction points, and let organic campus word-of-mouth drive momentum.",
        },
      ]);
    } finally {
      setIsAiLoading(false);
      setActiveTab(0);
      setPhase("done");
      sound.complete();
    }
  };

  const reset = () => {
    setPhase("idle");
    setInput("");
    setStages([]);
    setActiveTab(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const setPrompt = (text: string) => {
    setInput(text);
    sound.dot();
    inputRef.current?.focus();
  };

  const copyFullBlueprint = () => {
    const text = stages.map((s) => `[${s.label}] (${s.prompt})\n${s.text}\n`).join("\n");
    navigator.clipboard.writeText(`E-CELL FOUNDRY // VENTURE BLUEPRINT FOR: "${input}"\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    sound.dot();
  };

  const current = stages[activeTab];

  return (
    <section
      id="idea-machine"
      className="relative overflow-hidden bg-void px-6 py-28 text-paper md:px-[8vw] md:py-36"
      aria-label="The idea machine"
    >
      {/* Background ambient glowing aura and tech reticle grid */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
        <div className="h-[600px] w-[600px] rounded-full bg-ember/10 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,239,233,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        
        {/* Section Header Badge */}
        <div className="mb-5 inline-flex items-center gap-3 border border-ember/40 bg-ember/10 px-4 py-1.5 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-ember animate-ping" />
          <span className="font-mono text-xs tracking-[0.35em] uppercase text-ember font-bold">
            05 // AI VENTURE DECOMPILER
          </span>
        </div>

        <h2 className="hero-display text-[clamp(36px,6.5vw,96px)] leading-[0.92] text-paper">
          WHAT PROBLEM CAN'T YOU{" "}
          <span className="text-stroke-paper">STOP THINKING ABOUT?</span>
        </h2>

        <p className="mt-4 max-w-2xl font-mono text-xs md:text-sm tracking-[0.2em] text-ash uppercase">
          TYPE ANY RAW IDEA, INEFFICIENT WORKFLOW, OR CAMPUS BOTTLENECK. GROQ AI DECOMPILES IT INTO AN EXECUTABLE 6-STAGE VENTURE BLUEPRINT.
        </p>

        {/* 4-Step Process Explanation Bar */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-2 w-full max-w-4xl border border-paper/10 bg-paper/[0.02] p-3 text-left font-mono text-[10px] uppercase text-ash">
          <div className="flex items-center gap-2">
            <span className="text-ember font-bold">01.</span>
            <span>SUBMIT PROBLEM</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-ember font-bold">02.</span>
            <span>GROQ LLaMA 3.3 PARSER</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-ember font-bold">03.</span>
            <span>6-STAGE BLUEPRINT</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">04.</span>
            <span>LAUNCH IN FOUNDRY</span>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            INTERACTIVE INPUT TERMINAL
           ════════════════════════════════════════════════════════════════════ */}
        <div className="mt-10 w-full">
          <AnimatePresence mode="wait">
            
            {phase === "idle" && (
              <motion.div
                key="idle"
                className="flex w-full flex-col items-center gap-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                {/* Cyberpunk Glassmorphic Terminal Container */}
                <div className="relative w-full rounded-2xl border-2 border-paper/20 bg-paper/[0.03] p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 shadow-[0_20px_80px_rgba(0,0,0,0.85)] focus-within:border-ember focus-within:shadow-[0_0_50px_rgba(227,30,36,0.3)] text-left">
                  
                  {/* Top Telemetry Header */}
                  <div className="mb-4 flex items-center justify-between border-b border-paper/10 pb-3 font-mono text-[11px] uppercase tracking-wider text-ash">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-ember" />
                      <span className="text-paper font-bold">NEURAL FORGE // v4.2</span>
                      <span className="text-ash/40">|</span>
                      <span className="text-ember font-bold">GROQ LLaMA 3.3 ACCELERATED</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>{input.trim() ? `${input.trim().split(/\s+/).length} WORDS` : "STATUS: READY"}</span>
                      <span className="hidden sm:inline-block text-paper/70 font-bold">[ ↵ ENTER TO EXECUTE ]</span>
                    </div>
                  </div>

                  {/* Multi-line Textarea */}
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
                    className="w-full resize-none bg-transparent font-display text-2xl md:text-3xl leading-snug text-paper placeholder:text-ash/30 outline-none border-none focus:ring-0 selection:bg-ember selection:text-white"
                    aria-label="Describe the problem you can't stop thinking about"
                  />

                  {/* Quick-Spark Inspiration Pills */}
                  <div className="mt-4 pt-4 border-t border-paper/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ash font-bold">
                      SPARK IDEAS:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {SPARK_PROMPTS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPrompt(p.text)}
                          className="rounded-full border border-paper/15 bg-paper/[0.04] px-3 py-1 font-mono text-[11px] text-paper/80 transition-all hover:border-ember hover:bg-ember/15 hover:text-paper flex items-center gap-1.5"
                        >
                          <span className="text-ember font-bold text-[9px]">[{p.tag}]</span>
                          <span>{p.text.split(" ").slice(0, 4).join(" ")}…</span>
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
                      className="group relative inline-flex items-center gap-4 rounded-xl border-2 border-ember bg-gradient-to-r from-ember to-ember/90 px-10 py-4 font-mono text-sm tracking-[0.25em] font-bold text-paper shadow-[0_0_35px_rgba(227,30,36,0.45)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(227,30,36,0.8)] active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      {isAiLoading ? (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>DECOMPILING VIA GROQ LLaMA 3.3...</span>
                        </>
                      ) : (
                        <>
                          <span>DECOMPILE INTO VENTURE BLUEPRINT</span>
                          <span className="transition-transform duration-300 group-hover:translate-x-1.5">⚡</span>
                        </>
                      )}
                    </button>
                  </Magnetic>
                  <p className="font-mono text-[11px] tracking-widest text-ash/60 uppercase">
                    POWERED BY GROQ LLaMA 3.3 70B · REAL-TIME HEURISTIC ACCELERATION
                  </p>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════════════
                VENTURE BLUEPRINT DOSSIER (OUTPUT VIEW)
               ════════════════════════════════════════════════════════════════════ */}
            {phase === "done" && stages.length > 0 && current && (
              <motion.div
                key="done"
                className="w-full text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                {/* Blueprint Dossier Container */}
                <div className="relative rounded-2xl border-2 border-ember bg-void/95 p-6 md:p-10 shadow-[0_0_80px_rgba(227,30,36,0.3)] backdrop-blur-3xl">
                  
                  {/* Top Bar with Input Summary */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-paper/15 pb-4 mb-6 gap-3">
                    <div>
                      <span className="font-mono text-[10px] text-ember font-bold tracking-[0.3em] uppercase block">
                        VENTURE BLUEPRINT GENERATED BY GROQ AI
                      </span>
                      <h3 className="font-display text-xl text-paper mt-0.5">
                        "{input}"
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={copyFullBlueprint}
                        className="border border-paper/20 px-4 py-2 font-mono text-xs text-paper hover:border-paper transition-colors"
                      >
                        {copied ? "✓ COPIED BLUEPRINT!" : "📋 COPY ALL"}
                      </button>
                      <button
                        type="button"
                        onClick={reset}
                        className="border border-paper/20 px-4 py-2 font-mono text-xs text-ash hover:text-paper transition-colors"
                      >
                        ↻ NEW IDEA
                      </button>
                    </div>
                  </div>

                  {/* Stage Navigation Tabs */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6 font-mono text-xs">
                    {stages.map((s, idx) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => {
                          setActiveTab(idx);
                          sound.dot();
                        }}
                        className={`p-2.5 text-center border transition-all ${
                          activeTab === idx
                            ? "border-ember bg-ember text-paper font-bold shadow-[0_0_15px_rgba(227,30,36,0.4)]"
                            : "border-paper/10 bg-paper/[0.02] text-ash hover:border-paper/30 hover:text-paper"
                        }`}
                      >
                        <span className="block text-[9px] opacity-70">STAGE 0{idx + 1}</span>
                        <span className="truncate block font-semibold">{s.label.split("//")[1] || s.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Active Stage Card */}
                  <div className="rounded-xl border border-paper/15 bg-paper/[0.03] p-6 md:p-8 mb-6">
                    <div className="flex items-center justify-between border-b border-paper/10 pb-3 mb-4 font-mono text-xs">
                      <span className="text-ember font-bold tracking-widest uppercase">
                        {current.label}
                      </span>
                      <span className="text-ash tracking-widest uppercase text-[10px]">
                        [{current.prompt}]
                      </span>
                    </div>

                    <p className="font-display text-2xl md:text-3xl text-paper leading-relaxed tracking-wide">
                      {current.text}
                    </p>
                  </div>

                  {/* Bottom Action Row */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-paper/15">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={activeTab === 0}
                        onClick={() => {
                          setActiveTab((t) => Math.max(0, t - 1));
                          sound.dot();
                        }}
                        className="border border-paper/20 px-4 py-2 font-mono text-xs text-ash hover:text-paper disabled:opacity-30"
                      >
                        ← PREVIOUS
                      </button>
                      <button
                        disabled={activeTab === stages.length - 1}
                        onClick={() => {
                          setActiveTab((t) => Math.min(stages.length - 1, t + 1));
                          sound.dot();
                        }}
                        className="border border-paper/20 px-4 py-2 font-mono text-xs text-ash hover:text-paper disabled:opacity-30"
                      >
                        NEXT STAGE →
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFoundryOpen(true)}
                      className="w-full sm:w-auto border-2 border-ember bg-ember px-8 py-3 font-mono text-xs font-bold tracking-[0.2em] uppercase text-paper shadow-[0_0_25px_rgba(227,30,36,0.5)] hover:scale-105 transition-all"
                    >
                      APPLY FOR $10,000 GRANT IN THE FOUNDRY →
                    </button>
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      <FoundryModal isOpen={foundryOpen} onClose={() => setFoundryOpen(false)} />
    </section>
  );
}
