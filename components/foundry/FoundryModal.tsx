"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { sound } from "@/lib/sound";

export interface TrackOption {
  id: string;
  name: string;
  desc: string;
  color: string;
  icon: string;
  superpower: string;
}

export const FOUNDRY_TRACKS: TrackOption[] = [
  { id: "founder", name: "Founder / Visionary", desc: "Lead venture strategy, orchestrate capital, and recruit high-caliber teams", color: "#e31e24", icon: "⚡", superpower: "Capital & Narrative" },
  { id: "builder", name: "Product Builder / Full-Stack", desc: "Ship fast web & native prototypes, distributed systems, and backend pipelines", color: "#3b82f6", icon: "🛠️", superpower: "120fps Full-Stack" },
  { id: "ai_engineer", name: "AI / ML Engineer", desc: "Fine-tune LLMs, design autonomous agent workflows, and neural compute engines", color: "#8b5cf6", icon: "🧠", superpower: "Neural Distillation" },
  { id: "designer", name: "Product Designer / UX", desc: "Design bespoke user interfaces, brand identities, and high-converting UX", color: "#ec4899", icon: "🎨", superpower: "Tactile Ergonomics" },
  { id: "growth", name: "Growth & Distribution", desc: "Viral referral loops, organic channels, sales pipelines, and paid performance", color: "#10b981", icon: "📈", superpower: "Zero-Dollar Growth" },
  { id: "finance", name: "Finance & Capital", desc: "Unit economics, venture models, cap-table governance, and investor decks", color: "#06b6d4", icon: "💎", superpower: "Unit Economics" },
  { id: "operations", name: "Operations & Legal", desc: "Supply chain, compliance, entity incorporation, and scale architecture", color: "#f59e0b", icon: "⚖️", superpower: "Scale Reliability" },
  { id: "creator", name: "Media & Storytelling", desc: "Brand journalism, short-form video production, and viral community seeding", color: "#f43f5e", icon: "🎬", superpower: "Viral Storytelling" },
];

export const SKILLS_LIST = [
  "React / Next.js", "Python / FastAPI", "TypeScript", "AI / LLM Engineering", 
  "TailwindCSS", "Figma / UI Design", "PostgreSQL / Supabase", "System Architecture",
  "Viral Marketing", "Cold Outreach / B2B Sales", "Financial Modeling", "Video Editing",
  "Product Management", "Public Speaking", "SEO / Content", "Rust / Go"
];

const STEPS_NAV = [
  "01 PLEDGE", "02 IDENTITY", "03 TRACK", "04 MINDSET", "05 ARMORY", "06 PASSPORT"
];

export default function FoundryModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    universityId: "",
    department: "Computer Science & Engineering",
    year: "2nd Year",
    phone: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    trackId: "builder",
    problemStatement: "",
    buildIn30Days: "",
    pastProject: "",
    experienceSummary: "",
    skills: [] as string[],
    weeklyHours: "15-25 hrs",
    pledgeAccepted: false,
  });

  // Result state from Groq API / Supabase
  const [result, setResult] = useState<any>(null);

  // Live community counters
  const [stats, setStats] = useState({
    foundersJoined: 342,
    ideasSubmitted: 189,
    hackathonsHeld: 28,
    startupsFormed: 19,
  });

  useEffect(() => {
    if (isOpen) {
      sound.enter();
      fetch("/api/foundry/stats")
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch(() => {});
    }
  }, [isOpen]);

  const toggleSkill = (skill: string) => {
    sound.dot();
    setFormData((prev) => {
      const has = prev.skills.includes(skill);
      return {
        ...prev,
        skills: has ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
      };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    sound.stage();
    try {
      const res = await fetch("/api/foundry/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success && data.founder) {
        setResult(data.founder);
        setStep(5);
        sound.complete();
        try {
          confetti({
            particleCount: 140,
            spread: 90,
            origin: { y: 0.5 },
            colors: ["#e31e24", "#ffffff", "#3b82f6", "#ffd700", "#10b981"],
          });
        } catch {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 md:p-8 bg-void/90 backdrop-blur-3xl overflow-y-auto">
      
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[550px] w-[550px] rounded-full bg-ember/15 blur-[160px]" />
      </div>

      {/* Godly Cybernetic Modal Shell */}
      <div className="relative w-full max-w-4xl min-h-[620px] rounded-3xl bg-void/95 border-2 border-ember/50 shadow-[0_0_100px_rgba(227,30,36,0.35)] p-6 md:p-10 flex flex-col justify-between overflow-hidden text-paper backdrop-blur-2xl">
        
        {/* Top Header & Breadcrumb Tracker */}
        <div>
          <div className="flex items-center justify-between border-b border-paper/15 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-ember animate-ping" />
              <span className="font-mono text-xs tracking-[0.35em] uppercase text-ember font-bold">
                THE FOUNDRY // CRUCIBLE INTAKE ENGINE
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-paper/60 hover:text-paper text-xs font-mono tracking-widest uppercase transition-colors"
            >
              [ CLOSE ✕ ]
            </button>
          </div>

          {/* Stepper Navigation Tracker */}
          <div className="hidden sm:flex items-center justify-between font-mono text-[10px] tracking-wider text-ash/60 border-b border-paper/10 pb-3 mb-6">
            {STEPS_NAV.map((s, idx) => (
              <div
                key={s}
                className={`flex items-center gap-1.5 transition-colors ${
                  step === idx
                    ? "text-ember font-bold"
                    : step > idx
                    ? "text-paper font-semibold"
                    : "text-ash/40"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${step === idx ? "bg-ember animate-pulse" : step > idx ? "bg-paper" : "bg-ash/40"}`} />
                <span>{s}</span>
                {idx < STEPS_NAV.length - 1 && <span className="text-ash/20 ml-2">──</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Step Content */}
        <div className="py-4 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* ════════════════════════════════════════════════════════════════
                STEP 0: CINEMATIC GODLY MANIFESTO & ACCELERATOR TELEMETRY
               ════════════════════════════════════════════════════════════════ */}
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 text-center max-w-2xl mx-auto"
              >
                <div>
                  <div className="inline-flex items-center gap-2 border border-ember/40 bg-ember/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.3em] text-ember font-bold mb-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-ember animate-ping" />
                    FOUNDRY INTAKE PROTOCOL // BATCH 04
                  </div>

                  <h2 className="hero-display text-4xl md:text-6xl text-paper leading-[0.95] tracking-tight">
                    THIS ISN'T A COLLEGE CLUB. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-ember via-red-500 to-amber-500">
                      WE FORGE UNICORN FOUNDERS.
                    </span>
                  </h2>

                  <p className="mt-4 text-paper/80 font-mono text-xs md:text-sm leading-relaxed max-w-lg mx-auto">
                    The Foundry is an elite venture crucible for student builders at Chandigarh University. Non-dilutive capital grants, 1:1 Silicon Valley mentorship, and dedicated compute clusters.
                  </p>
                </div>

                {/* Glowing Holographic Telemetry Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-paper/15 bg-paper/[0.03] p-4 text-left font-mono backdrop-blur-md">
                    <span className="text-[10px] text-ash tracking-widest block uppercase">FOUNDERS ADMITTED</span>
                    <span className="text-2xl text-paper font-bold tracking-tight">{stats.foundersJoined}+</span>
                  </div>
                  <div className="rounded-xl border border-ember/30 bg-ember/[0.06] p-4 text-left font-mono backdrop-blur-md shadow-[0_0_20px_rgba(227,30,36,0.15)]">
                    <span className="text-[10px] text-ember tracking-widest block uppercase font-bold">IDEAS SHIPPED</span>
                    <span className="text-2xl text-ember font-bold tracking-tight">{stats.ideasSubmitted}</span>
                  </div>
                  <div className="rounded-xl border border-paper/15 bg-paper/[0.03] p-4 text-left font-mono backdrop-blur-md">
                    <span className="text-[10px] text-ash tracking-widest block uppercase">HACKATHONS</span>
                    <span className="text-2xl text-paper font-bold tracking-tight">{stats.hackathonsHeld}</span>
                  </div>
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-left font-mono backdrop-blur-md">
                    <span className="text-[10px] text-emerald-400 tracking-widest block uppercase font-bold">VENTURES LIVE</span>
                    <span className="text-2xl text-emerald-400 font-bold tracking-tight">{stats.startupsFormed}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      sound.dot();
                    }}
                    className="border-2 border-ember bg-gradient-to-r from-ember to-ember/90 text-paper px-12 py-4 font-mono text-sm tracking-[0.3em] font-bold shadow-[0_0_40px_rgba(227,30,36,0.5)] hover:shadow-[0_0_60px_rgba(227,30,36,0.8)] hover:scale-105 active:scale-95 transition-all rounded-xl"
                  >
                    ENTER THE CRUCIBLE →
                  </button>
                  <span className="font-mono text-[10px] text-ash/60 tracking-widest uppercase">
                    ESTIMATED TIME: 3 MINUTES // POWERED BY GROQ LLaMA 3.3
                  </span>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                STEP 1: PERSONAL & INSTITUTIONAL CREDENTIALS
               ════════════════════════════════════════════════════════════════ */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 max-w-2xl mx-auto w-full"
              >
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember font-bold">
                    01 // IDENTIFIER & REPUTATION
                  </span>
                  <h3 className="hero-display text-3xl text-paper mt-1">WHO ARE YOU?</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <label className="block text-ash mb-1 uppercase tracking-wider font-semibold">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Ankan Roy"
                      className="w-full bg-paper/[0.04] border border-paper/20 rounded-lg px-4 py-3 text-paper focus:border-ember outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-ash mb-1 uppercase tracking-wider font-semibold">University ID / UID *</label>
                    <input
                      type="text"
                      required
                      value={formData.universityId}
                      onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                      placeholder="23BCS10842"
                      className="w-full bg-paper/[0.04] border border-paper/20 rounded-lg px-4 py-3 text-paper focus:border-ember outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-ash mb-1 uppercase tracking-wider font-semibold">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ankan@cumail.in"
                      className="w-full bg-paper/[0.04] border border-paper/20 rounded-lg px-4 py-3 text-paper focus:border-ember outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-ash mb-1 uppercase tracking-wider font-semibold">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-paper/[0.04] border border-paper/20 rounded-lg px-4 py-3 text-paper focus:border-ember outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-ash mb-1 uppercase tracking-wider font-semibold">Department *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-void border border-paper/20 rounded-lg px-4 py-3 text-paper focus:border-ember outline-none"
                    >
                      <option>Computer Science & Engineering</option>
                      <option>Information Technology</option>
                      <option>Electronics & Communication</option>
                      <option>Business Administration (MBA/BBA)</option>
                      <option>Design & Animation</option>
                      <option>Bio-Technology / Health</option>
                      <option>Other Department</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-ash mb-1 uppercase tracking-wider font-semibold">Academic Year *</label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full bg-void border border-paper/20 rounded-lg px-4 py-3 text-paper focus:border-ember outline-none"
                    >
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>Postgraduate / Alumni</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-ash mb-1 uppercase tracking-wider font-semibold">GitHub URL</label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/username"
                      className="w-full bg-paper/[0.04] border border-paper/20 rounded-lg px-4 py-3 text-paper focus:border-ember outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-ash mb-1 uppercase tracking-wider font-semibold">LinkedIn URL</label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full bg-paper/[0.04] border border-paper/20 rounded-lg px-4 py-3 text-paper focus:border-ember outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="font-mono text-xs text-ash hover:text-paper uppercase tracking-widest"
                  >
                    ← BACK
                  </button>
                  <button
                    type="button"
                    disabled={!formData.fullName || !formData.universityId || !formData.phone}
                    onClick={() => {
                      setStep(2);
                      sound.dot();
                    }}
                    className="border-2 border-ember bg-ember text-paper px-8 py-3 rounded-lg font-mono text-xs tracking-widest uppercase font-bold disabled:opacity-40 shadow-[0_0_20px_rgba(227,30,36,0.3)] hover:scale-105 transition-all"
                  >
                    NEXT: SELECT TRACK →
                  </button>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                STEP 2: CHOOSE YOUR FOUNDRY TRACK
               ════════════════════════════════════════════════════════════════ */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5 max-w-3xl mx-auto w-full"
              >
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember font-bold">
                    02 // TRACK SPECIALIZATION
                  </span>
                  <h3 className="hero-display text-3xl text-paper mt-1">WHERE DO YOU CREATE LEVERAGE?</h3>
                  <p className="text-xs font-mono text-ash mt-0.5">
                    Select your primary capability in high-velocity venture squads.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-2">
                  {FOUNDRY_TRACKS.map((t) => {
                    const isSelected = formData.trackId === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, trackId: t.id });
                          sound.dot();
                        }}
                        className={`p-4 text-left border rounded-xl transition-all ${
                          isSelected
                            ? "border-ember bg-ember/15 shadow-[0_0_25px_rgba(227,30,36,0.25)]"
                            : "border-paper/10 bg-paper/[0.02] hover:border-paper/30"
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-xs mb-1">
                          <span className="text-xl">{t.icon}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${isSelected ? "bg-ember text-white" : "bg-paper/10 text-ash"}`}>
                            {t.superpower}
                          </span>
                        </div>
                        <h4 className="font-display text-lg text-paper tracking-wide">{t.name}</h4>
                        <p className="text-xs text-ash leading-relaxed mt-1">{t.desc}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="font-mono text-xs text-ash hover:text-paper uppercase tracking-widest"
                  >
                    ← BACK
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(3);
                      sound.dot();
                    }}
                    className="border-2 border-ember bg-ember text-paper px-8 py-3 rounded-lg font-mono text-xs tracking-widest uppercase font-bold shadow-[0_0_20px_rgba(227,30,36,0.3)] hover:scale-105 transition-all"
                  >
                    NEXT: STARTUP MINDSET →
                  </button>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                STEP 3: ENTREPRENEURIAL MINDSET
               ════════════════════════════════════════════════════════════════ */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 max-w-2xl mx-auto w-full"
              >
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember font-bold">
                    03 // CONVICTION & EXECUTION BIAS
                  </span>
                  <h3 className="hero-display text-3xl text-paper mt-1">THE FOUNDER MINDSET</h3>
                  <p className="text-xs font-mono text-ash mt-0.5">
                    Evaluated by Groq AI for bias toward shipping and clarity of thought.
                  </p>
                </div>

                <div className="space-y-3.5 font-mono text-xs">
                  <div>
                    <label className="block text-paper/90 mb-1 font-bold">
                      1. What is one problem you notice every day that nobody is solving? *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.problemStatement}
                      onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                      placeholder="e.g. Student project teams fall apart because there's no automated escrow or milestone tracker..."
                      className="w-full bg-paper/[0.04] border border-paper/20 rounded-lg p-3 text-paper focus:border-ember outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-paper/90 mb-1 font-bold">
                      2. If we gave you ₹10,000 / $150 today, what would you build in 30 days? *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.buildIn30Days}
                      onChange={(e) => setFormData({ ...formData, buildIn30Days: e.target.value })}
                      placeholder="e.g. I would spin up an API wrapper, deploy a Next.js landing page, run targeted ads, and onboard 10 beta users."
                      className="w-full bg-paper/[0.04] border border-paper/20 rounded-lg p-3 text-paper focus:border-ember outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-paper/90 mb-1 font-bold">
                      3. Describe something you've built (code, design, community, campaign): *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.pastProject}
                      onChange={(e) => setFormData({ ...formData, pastProject: e.target.value })}
                      placeholder="Describe anything from a small Python bot to a 500-member community or freelancing client project."
                      className="w-full bg-paper/[0.04] border border-paper/20 rounded-lg p-3 text-paper focus:border-ember outline-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="font-mono text-xs text-ash hover:text-paper uppercase tracking-widest"
                  >
                    ← BACK
                  </button>
                  <button
                    type="button"
                    disabled={!formData.problemStatement || !formData.buildIn30Days || !formData.pastProject}
                    onClick={() => {
                      setStep(4);
                      sound.dot();
                    }}
                    className="border-2 border-ember bg-ember text-paper px-8 py-3 rounded-lg font-mono text-xs tracking-widest uppercase font-bold disabled:opacity-40 shadow-[0_0_20px_rgba(227,30,36,0.3)] hover:scale-105 transition-all"
                  >
                    NEXT: ARMORY & PLEDGE →
                  </button>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                STEP 4: SKILLS, WEEKLY COMMITMENT & FINAL SUBMIT
               ════════════════════════════════════════════════════════════════ */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5 max-w-2xl mx-auto w-full"
              >
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember font-bold">
                    04 // ARMORY & COMMITMENT
                  </span>
                  <h3 className="hero-display text-3xl text-paper mt-1">YOUR TOOLKIT & PLEDGE</h3>
                </div>

                <div>
                  <label className="block text-xs font-mono text-ash mb-2 uppercase tracking-wider">
                    Select Your Core Skills (Multi-select)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_LIST.map((skill) => {
                      const isSel = formData.skills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`font-mono text-xs px-3 py-1.5 rounded-md border transition-all ${
                            isSel
                              ? "border-ember bg-ember text-paper font-bold shadow-[0_0_12px_rgba(227,30,36,0.4)]"
                              : "border-paper/15 text-paper/70 hover:border-paper/40"
                          }`}
                        >
                          {skill} {isSel ? "✓" : "+"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="font-mono text-xs">
                  <label className="block text-ash mb-2 uppercase tracking-wider">
                    Weekly Hours Dedicated to The Foundry *
                  </label>
                  <div className="flex gap-3">
                    {["10-15 hrs", "15-25 hrs", "25+ hrs (Full Immersion)"].map((hrs) => (
                      <label
                        key={hrs}
                        className={`flex-1 border rounded-lg p-3 cursor-pointer text-center transition-all ${
                          formData.weeklyHours === hrs
                            ? "border-ember bg-ember/20 text-paper font-bold shadow-[0_0_15px_rgba(227,30,36,0.2)]"
                            : "border-paper/15 text-paper/70"
                        }`}
                      >
                        <input
                          type="radio"
                          name="hours"
                          value={hrs}
                          checked={formData.weeklyHours === hrs}
                          onChange={(e) => setFormData({ ...formData, weeklyHours: e.target.value })}
                          className="sr-only"
                        />
                        {hrs}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-2 border-ember/40 bg-ember/10 rounded-xl flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="pledge"
                    required
                    checked={formData.pledgeAccepted}
                    onChange={(e) => setFormData({ ...formData, pledgeAccepted: e.target.checked })}
                    className="mt-1 h-4 w-4 accent-ember cursor-pointer"
                  />
                  <label htmlFor="pledge" className="text-xs font-mono text-paper/90 cursor-pointer leading-relaxed">
                    <strong>THE FOUNDER PLEDGE:</strong> I pledge to build consistently, ship real products, collaborate with my cohort, and represent Chandigarh University with uncompromising craftsmanship.
                  </label>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="font-mono text-xs text-ash hover:text-paper uppercase tracking-widest"
                  >
                    ← BACK
                  </button>
                  <button
                    type="button"
                    disabled={loading || !formData.pledgeAccepted}
                    onClick={handleSubmit}
                    className="border-2 border-ember bg-gradient-to-r from-ember to-ember/90 text-paper px-10 py-4 rounded-xl font-mono text-sm tracking-[0.25em] uppercase font-bold hover:scale-105 disabled:opacity-40 transition-all shadow-[0_0_35px_rgba(227,30,36,0.5)] flex items-center gap-3"
                  >
                    {loading ? (
                      <>
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        GROQ AI EVALUATING...
                      </>
                    ) : (
                      "SUBMIT FOUNDRY APPLICATION ⚡"
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                STEP 5: DIGITAL HOLOGRAPHIC FOUNDER PASSPORT
               ════════════════════════════════════════════════════════════════ */}
            {step === 5 && result && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 max-w-3xl mx-auto w-full text-center"
              >
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.4em] text-emerald-400 font-bold">
                    PASSPORT GENERATED // STATUS: ADMITTED TO EVALUATION
                  </span>
                  <h3 className="hero-display text-4xl text-paper mt-1">
                    WELCOME TO THE FOUNDRY, {result.full_name.split(" ")[0].toUpperCase()}.
                  </h3>
                  <p className="text-xs font-mono text-ash mt-0.5">
                    Builders aren't selected. They prove themselves.
                  </p>
                </div>

                {/* Digital Holographic Founder Passport Card */}
                <div className="relative rounded-2xl border-2 border-ember bg-gradient-to-br from-void via-zinc-950 to-neutral-900 p-8 text-left shadow-[0_0_80px_rgba(227,30,36,0.35)] font-mono space-y-6 overflow-hidden">
                  
                  {/* Holographic Sheen Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(227,30,36,0.15),transparent_70%)] pointer-events-none" />

                  {/* Watermark */}
                  <div className="absolute right-4 bottom-2 text-paper/[0.03] text-8xl hero-display pointer-events-none select-none">
                    E-CELL
                  </div>

                  {/* Header Row */}
                  <div className="relative flex justify-between items-start border-b border-paper/15 pb-4">
                    <div>
                      <span className="text-[10px] text-ash tracking-widest block uppercase">FOUNDER PASSPORT ID</span>
                      <span className="text-2xl font-bold text-ember tracking-wider">{result.founder_id}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-ash tracking-widest block uppercase">COHORT BATCH</span>
                      <span className="text-sm font-bold text-paper">{result.batch_name}</span>
                    </div>
                  </div>

                  {/* Founder Profile Details */}
                  <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-ash block uppercase text-[10px]">CANDIDATE</span>
                      <span className="text-paper font-bold text-sm">{result.full_name}</span>
                    </div>
                    <div>
                      <span className="text-ash block uppercase text-[10px]">TRACK</span>
                      <span className="text-paper font-bold text-sm uppercase">{result.track_id}</span>
                    </div>
                    <div>
                      <span className="text-ash block uppercase text-[10px]">DEPARTMENT</span>
                      <span className="text-paper">{result.department}</span>
                    </div>
                    <div>
                      <span className="text-ash block uppercase text-[10px]">UNIVERSITY ID</span>
                      <span className="text-paper font-bold">{result.university_id}</span>
                    </div>
                  </div>

                  {/* Groq AI Assessment Scores */}
                  <div className="relative rounded-xl border border-paper/15 bg-paper/[0.03] p-5 space-y-3 backdrop-blur-md">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-ember font-bold tracking-widest uppercase">
                        GROQ AI FOUNDER DNA SCORE
                      </span>
                      <span className="text-xl font-bold text-paper">{result.founder_score} / 100</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center border-t border-paper/10 pt-3 text-[11px]">
                      <div className="p-2 rounded bg-paper/[0.02]">
                        <span className="text-ash block text-[10px]">PROBLEM SOLVING</span>
                        <span className="font-bold text-paper text-sm">{result.score_problem_solving}%</span>
                      </div>
                      <div className="p-2 rounded bg-paper/[0.02]">
                        <span className="text-ash block text-[10px]">LEADERSHIP</span>
                        <span className="font-bold text-paper text-sm">{result.score_leadership}%</span>
                      </div>
                      <div className="p-2 rounded bg-paper/[0.02]">
                        <span className="text-ash block text-[10px]">EXECUTION BIAS</span>
                        <span className="font-bold text-emerald-400 text-sm">{result.score_execution}%</span>
                      </div>
                    </div>

                    <div className="border-t border-paper/10 pt-2 text-xs text-paper/85 leading-relaxed italic">
                      "{result.ai_assessment_summary}"
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="border border-paper/30 rounded-xl px-6 py-3 font-mono text-xs text-paper hover:border-paper transition-colors"
                  >
                    PRINT / SAVE PASSPORT 🖨️
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="border-2 border-ember bg-ember rounded-xl px-8 py-3 font-mono text-xs text-paper font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(227,30,36,0.4)]"
                  >
                    ENTER FOUNDRY PORTAL →
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
