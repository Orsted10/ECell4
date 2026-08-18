"use client";

import { useEffect, useRef, useState } from "react";
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
  const [isExportingPng, setIsExportingPng] = useState(false);

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
            particleCount: 120,
            spread: 80,
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

  // Instant High-Resolution HTML5 Canvas PNG Exporter (100% Client-Side, 50ms)
  const exportFounderCardPng = () => {
    if (!result) return;
    setIsExportingPng(true);
    sound.dot();

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 675;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Dark background with carbon border
      ctx.fillStyle = "#0c0c0e";
      ctx.fillRect(0, 0, 1200, 675);

      // Gradient accent glow
      const grad = ctx.createRadialGradient(1000, 100, 50, 1000, 100, 600);
      grad.addColorStop(0, "rgba(227, 30, 36, 0.2)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 675);

      // Card border
      ctx.strokeStyle = "#e31e24";
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 1140, 615);

      // Watermark
      ctx.font = "bold 140px 'Anton', sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.fillText("E-CELL CU", 450, 480);

      // Header labels
      ctx.font = "bold 18px 'Space Mono', monospace";
      ctx.fillStyle = "#e31e24";
      ctx.fillText("THE FOUNDRY // OFFICIAL FOUNDER PASSPORT", 70, 90);

      ctx.fillStyle = "#8f8f8f";
      ctx.fillText("COHORT BATCH: " + result.batch_name, 800, 90);

      // Founder ID
      ctx.font = "bold 44px 'Space Mono', monospace";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(result.founder_id, 70, 155);

      // Divider line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(70, 185);
      ctx.lineTo(1130, 185);
      ctx.stroke();

      // Candidate Metadata Row
      ctx.font = "14px 'Space Mono', monospace";
      ctx.fillStyle = "#8f8f8f";
      ctx.fillText("CANDIDATE", 70, 230);
      ctx.fillText("TRACK SPECIALIZATION", 400, 230);
      ctx.fillText("UNIVERSITY ID", 800, 230);

      ctx.font = "bold 26px 'Space Mono', monospace";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(result.full_name, 70, 270);
      ctx.fillText(result.track_id.toUpperCase(), 400, 270);
      ctx.fillText(result.university_id, 800, 270);

      // Scores Container Box
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(70, 320, 1060, 220);
      ctx.strokeRect(70, 320, 1060, 220);

      ctx.font = "bold 16px 'Space Mono', monospace";
      ctx.fillStyle = "#e31e24";
      ctx.fillText("GROQ AI STARTUP DNA SCORE: " + result.founder_score + "/100", 100, 360);

      ctx.font = "14px 'Space Mono', monospace";
      ctx.fillStyle = "#8f8f8f";
      ctx.fillText("PROBLEM SOLVING: " + result.score_problem_solving + "%", 100, 410);
      ctx.fillText("LEADERSHIP: " + result.score_leadership + "%", 450, 410);
      ctx.fillText("EXECUTION BIAS: " + result.score_execution + "%", 800, 410);

      // Summary
      ctx.font = "italic 16px 'Space Mono', monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      const wrapText = `"${result.ai_assessment_summary}"`;
      ctx.fillText(wrapText.slice(0, 80), 100, 470);
      if (wrapText.length > 80) {
        ctx.fillText(wrapText.slice(80, 160), 100, 500);
      }

      // Security Footer
      ctx.font = "13px 'Space Mono', monospace";
      ctx.fillStyle = "#8f8f8f";
      ctx.fillText("ISSUED BY E-CELL CHANDIGARH UNIVERSITY · VALIDATED ON SUPABASE", 70, 595);
      ctx.fillStyle = "#10b981";
      ctx.fillText("STATUS: " + result.status, 850, 595);

      // Download
      const link = document.createElement("a");
      link.download = `Foundry_Passport_${result.founder_id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingPng(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      
      {/* High-Performance Cybernetic Shell */}
      <div className="relative w-full max-w-4xl min-h-[580px] my-auto rounded-2xl bg-[#0c0c0e] border border-white/15 shadow-2xl p-6 md:p-8 flex flex-col justify-between text-paper">
        
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-ember animate-pulse" />
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-ember font-bold">
                THE FOUNDRY // CRUCIBLE INTAKE
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-white/60 hover:text-white text-xs font-mono tracking-widest uppercase transition-colors"
            >
              [ CLOSE ✕ ]
            </button>
          </div>

          {/* Stepper Navigation */}
          <div className="hidden sm:flex items-center justify-between font-mono text-[10px] tracking-wider text-ash/60 border-b border-white/10 pb-3 mb-5">
            {STEPS_NAV.map((s, idx) => (
              <div
                key={s}
                className={`flex items-center gap-1.5 transition-colors ${
                  step === idx
                    ? "text-ember font-bold"
                    : step > idx
                    ? "text-white font-semibold"
                    : "text-ash/40"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${step === idx ? "bg-ember" : step > idx ? "bg-white" : "bg-ash/40"}`} />
                <span>{s}</span>
                {idx < STEPS_NAV.length - 1 && <span className="text-white/15 ml-2">──</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Step Body */}
        <div className="py-2 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* ════════════════════════════════════════════════════════════════
                STEP 0: CINEMATIC GODLY MANIFESTO & ACCELERATOR TELEMETRY
               ════════════════════════════════════════════════════════════════ */}
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-center max-w-2xl mx-auto py-2"
              >
                <div>
                  <div className="inline-flex items-center gap-2 border border-ember/40 bg-ember/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ember font-bold mb-3 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-ember animate-ping" />
                    FOUNDRY BATCH 04 RECRUITMENT
                  </div>

                  <h2 className="font-display text-3xl md:text-5xl text-paper tracking-normal leading-tight">
                    THIS ISN'T A COLLEGE CLUB. <br />
                    <span className="text-ember">
                      WE FORGE UNICORN FOUNDERS.
                    </span>
                  </h2>

                  <p className="mt-3 text-paper/75 font-mono text-xs leading-relaxed max-w-lg mx-auto">
                    The Foundry is an elite venture crucible for student builders at Chandigarh University. Non-dilutive capital grants, 1:1 Silicon Valley mentorship, and dedicated compute credits.
                  </p>
                </div>

                {/* Telemetry Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-left font-mono">
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3.5">
                    <span className="text-[9px] text-ash tracking-widest block uppercase">FOUNDERS ADMITTED</span>
                    <span className="text-xl text-paper font-bold tracking-tight">{stats.foundersJoined}+</span>
                  </div>
                  <div className="rounded-lg border border-ember/30 bg-ember/[0.05] p-3.5">
                    <span className="text-[9px] text-ember tracking-widest block uppercase font-bold">IDEAS SHIPPED</span>
                    <span className="text-xl text-ember font-bold tracking-tight">{stats.ideasSubmitted}</span>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3.5">
                    <span className="text-[9px] text-ash tracking-widest block uppercase">HACKATHONS</span>
                    <span className="text-xl text-paper font-bold tracking-tight">{stats.hackathonsHeld}</span>
                  </div>
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3.5">
                    <span className="text-[9px] text-emerald-400 tracking-widest block uppercase font-bold">VENTURES LIVE</span>
                    <span className="text-xl text-emerald-400 font-bold tracking-tight">{stats.startupsFormed}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      sound.dot();
                    }}
                    className="border border-ember bg-ember text-white px-10 py-3.5 font-mono text-xs tracking-[0.25em] font-bold shadow-[0_0_30px_rgba(227,30,36,0.4)] hover:bg-ember/90 transition-all rounded-lg"
                  >
                    ENTER THE CRUCIBLE →
                  </button>
                  <span className="font-mono text-[9px] text-ash/60 tracking-widest uppercase">
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
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-4 max-w-2xl mx-auto w-full"
              >
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember font-bold">
                    01 // IDENTIFIER & REPUTATION
                  </span>
                  <h3 className="font-display text-2xl text-paper mt-0.5">WHO ARE YOU?</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                  <div>
                    <label className="block text-ash mb-1 uppercase tracking-wider font-semibold">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Ankan Roy"
                      className="w-full bg-white/[0.04] border border-white/20 rounded-md px-3.5 py-2.5 text-paper focus:border-ember outline-none"
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
                      className="w-full bg-white/[0.04] border border-white/20 rounded-md px-3.5 py-2.5 text-paper focus:border-ember outline-none"
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
                      className="w-full bg-white/[0.04] border border-white/20 rounded-md px-3.5 py-2.5 text-paper focus:border-ember outline-none"
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
                      className="w-full bg-white/[0.04] border border-white/20 rounded-md px-3.5 py-2.5 text-paper focus:border-ember outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-ash mb-1 uppercase tracking-wider font-semibold">Department *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-[#0c0c0e] border border-white/20 rounded-md px-3.5 py-2.5 text-paper focus:border-ember outline-none"
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
                      className="w-full bg-[#0c0c0e] border border-white/20 rounded-md px-3.5 py-2.5 text-paper focus:border-ember outline-none"
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
                      className="w-full bg-white/[0.04] border border-white/20 rounded-md px-3.5 py-2.5 text-paper focus:border-ember outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-ash mb-1 uppercase tracking-wider font-semibold">LinkedIn URL</label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full bg-white/[0.04] border border-white/20 rounded-md px-3.5 py-2.5 text-paper focus:border-ember outline-none"
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
                    className="border border-ember bg-ember text-white px-7 py-2.5 rounded-md font-mono text-xs tracking-widest uppercase font-bold disabled:opacity-40"
                  >
                    NEXT: SELECT TRACK →
                  </button>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                STEP 2: CHOOSE YOUR FOUNDRY TRACK (FULLY SCROLLABLE & RESPONSIVE)
               ════════════════════════════════════════════════════════════════ */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-4 max-w-3xl mx-auto w-full"
              >
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember font-bold">
                    02 // TRACK SPECIALIZATION
                  </span>
                  <h3 className="font-display text-2xl text-paper mt-0.5">WHERE DO YOU CREATE LEVERAGE?</h3>
                  <p className="text-xs font-mono text-ash">
                    Select your primary capability in high-velocity venture squads (scroll to see all 8 tracks).
                  </p>
                </div>

                {/* Fully Scrollable Grid Container with Smooth Height */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[46vh] overflow-y-auto pr-1">
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
                        className={`p-3.5 text-left border rounded-lg transition-all ${
                          isSelected
                            ? "border-ember bg-ember/20 shadow-[0_0_15px_rgba(227,30,36,0.3)]"
                            : "border-white/10 bg-white/[0.02] hover:border-white/25"
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-xs mb-1">
                          <span className="text-lg">{t.icon}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${isSelected ? "bg-ember text-white" : "bg-white/10 text-ash"}`}>
                            {t.superpower}
                          </span>
                        </div>
                        <h4 className="font-display text-base text-paper tracking-wide">{t.name}</h4>
                        <p className="text-[11px] text-ash leading-relaxed mt-0.5">{t.desc}</p>
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
                    className="border border-ember bg-ember text-white px-7 py-2.5 rounded-md font-mono text-xs tracking-widest uppercase font-bold"
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
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-3.5 max-w-2xl mx-auto w-full"
              >
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember font-bold">
                    03 // CONVICTION & EXECUTION BIAS
                  </span>
                  <h3 className="font-display text-2xl text-paper mt-0.5">THE FOUNDER MINDSET</h3>
                  <p className="text-xs font-mono text-ash">
                    Evaluated by Groq AI. Please provide concrete, thoughtful details.
                  </p>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="block text-paper/90 mb-1 font-bold">
                      1. What problem do you notice every day that nobody is solving? *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.problemStatement}
                      onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                      placeholder="e.g. Campus teams fall apart due to lack of milestone escrow tracking..."
                      className="w-full bg-white/[0.04] border border-white/20 rounded-md p-2.5 text-paper focus:border-ember outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-paper/90 mb-1 font-bold">
                      2. If we gave you ₹10,000 today, what would you build in 30 days? *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.buildIn30Days}
                      onChange={(e) => setFormData({ ...formData, buildIn30Days: e.target.value })}
                      placeholder="e.g. Build an API wrapper on Next.js, launch a beta page, and sign up 10 paid users."
                      className="w-full bg-white/[0.04] border border-white/20 rounded-md p-2.5 text-paper focus:border-ember outline-none leading-relaxed"
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
                      placeholder="Describe anything from a small Python script to a 500-member community project."
                      className="w-full bg-white/[0.04] border border-white/20 rounded-md p-2.5 text-paper focus:border-ember outline-none leading-relaxed"
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
                    className="border border-ember bg-ember text-white px-7 py-2.5 rounded-md font-mono text-xs tracking-widest uppercase font-bold disabled:opacity-40"
                  >
                    NEXT: ARMORY & PLEDGE →
                  </button>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                STEP 4: SKILLS & SUBMIT
               ════════════════════════════════════════════════════════════════ */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-4 max-w-2xl mx-auto w-full"
              >
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember font-bold">
                    04 // ARMORY & COMMITMENT
                  </span>
                  <h3 className="font-display text-2xl text-paper mt-0.5">YOUR TOOLKIT & PLEDGE</h3>
                </div>

                <div>
                  <label className="block text-xs font-mono text-ash mb-2 uppercase tracking-wider">
                    Select Your Core Skills
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {SKILLS_LIST.map((skill) => {
                      const isSel = formData.skills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`font-mono text-xs px-2.5 py-1 rounded border transition-all ${
                            isSel
                              ? "border-ember bg-ember text-white font-bold"
                              : "border-white/15 text-paper/70 hover:border-white/30"
                          }`}
                        >
                          {skill} {isSel ? "✓" : "+"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="font-mono text-xs">
                  <label className="block text-ash mb-1.5 uppercase tracking-wider">
                    Weekly Hours Dedicated to The Foundry *
                  </label>
                  <div className="flex gap-2.5">
                    {["10-15 hrs", "15-25 hrs", "25+ hrs"].map((hrs) => (
                      <label
                        key={hrs}
                        className={`flex-1 border rounded-md p-2.5 cursor-pointer text-center transition-all ${
                          formData.weeklyHours === hrs
                            ? "border-ember bg-ember/20 text-white font-bold"
                            : "border-white/15 text-paper/70"
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

                <div className="p-3.5 border border-ember/40 bg-ember/10 rounded-lg flex items-start gap-2.5">
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
                    className="border border-ember bg-ember text-white px-8 py-3 rounded-md font-mono text-xs tracking-widest uppercase font-bold disabled:opacity-40 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
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
                STEP 5: DIGITAL FOUNDER PASSPORT & 1-CLICK EXPORTS
               ════════════════════════════════════════════════════════════════ */}
            {step === 5 && result && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 max-w-2xl mx-auto w-full text-center"
              >
                <div>
                  <span className={`font-mono text-xs uppercase tracking-[0.3em] font-bold ${result.status === "NEEDS_REVISION" ? "text-amber-400" : "text-emerald-400"}`}>
                    STATUS: {result.status}
                  </span>
                  <h3 className="font-display text-3xl text-paper mt-0.5">
                    {result.status === "NEEDS_REVISION" ? "SUBMISSION RECORDED" : `WELCOME TO THE FOUNDRY, ${result.full_name.split(" ")[0].toUpperCase()}.`}
                  </h3>
                </div>

                {/* Print & View Passport Container */}
                <div id="foundry-passport-print-container" className="rounded-xl border border-ember bg-zinc-950 p-6 text-left font-mono space-y-4 shadow-xl">
                  
                  {/* Header */}
                  <div className="flex justify-between items-start border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[9px] text-ash tracking-widest block uppercase">FOUNDER PASSPORT ID</span>
                      <span className="text-xl font-bold text-ember tracking-wider">{result.founder_id}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-ash tracking-widest block uppercase">COHORT BATCH</span>
                      <span className="text-xs font-bold text-white">{result.batch_name}</span>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-ash block uppercase text-[9px]">CANDIDATE</span>
                      <span className="text-white font-bold">{result.full_name}</span>
                    </div>
                    <div>
                      <span className="text-ash block uppercase text-[9px]">TRACK</span>
                      <span className="text-white font-bold uppercase">{result.track_id}</span>
                    </div>
                    <div>
                      <span className="text-ash block uppercase text-[9px]">DEPARTMENT</span>
                      <span className="text-white text-[11px] truncate block">{result.department}</span>
                    </div>
                    <div>
                      <span className="text-ash block uppercase text-[9px]">UNIVERSITY ID</span>
                      <span className="text-white font-bold">{result.university_id}</span>
                    </div>
                  </div>

                  {/* AI Scores Box */}
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3.5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-ember font-bold tracking-widest uppercase">
                        GROQ AI FOUNDER SCORE
                      </span>
                      <span className="text-lg font-bold text-white">{result.founder_score} / 100</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center border-t border-white/10 pt-2 text-[10px]">
                      <div>
                        <span className="text-ash block text-[9px]">PROBLEM SOLVING</span>
                        <span className="font-bold text-white">{result.score_problem_solving}%</span>
                      </div>
                      <div>
                        <span className="text-ash block text-[9px]">LEADERSHIP</span>
                        <span className="font-bold text-white">{result.score_leadership}%</span>
                      </div>
                      <div>
                        <span className="text-ash block text-[9px]">EXECUTION BIAS</span>
                        <span className="font-bold text-emerald-400">{result.score_execution}%</span>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-2 text-xs text-white/80 italic leading-relaxed">
                      "{result.ai_assessment_summary}"
                    </div>
                  </div>
                </div>

                {/* 1-Click Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={exportFounderCardPng}
                    disabled={isExportingPng}
                    className="border border-white/20 bg-white/[0.04] rounded-md px-5 py-2.5 font-mono text-xs text-white hover:border-white transition-all flex items-center justify-center gap-2"
                  >
                    <span>📷 DOWNLOAD CARD (PNG)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="border border-white/20 bg-white/[0.04] rounded-md px-5 py-2.5 font-mono text-xs text-white hover:border-white transition-all flex items-center justify-center gap-2"
                  >
                    <span>🖨️ PRINT 1-PAGE PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="border border-ember bg-ember rounded-md px-7 py-2.5 font-mono text-xs text-white font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(227,30,36,0.4)]"
                  >
                    DONE ↵
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
