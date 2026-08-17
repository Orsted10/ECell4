"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export interface TrackOption {
  id: string;
  name: string;
  desc: string;
  color: string;
  icon: string;
}

export const FOUNDRY_TRACKS: TrackOption[] = [
  { id: "founder", name: "Founder / Visionary", desc: "Lead venture strategy, raise capital, and build teams", color: "#e31e24", icon: "⚡" },
  { id: "builder", name: "Product Builder / Full-Stack", desc: "Ship fast web & native prototypes and technical architectures", color: "#3b82f6", icon: "🛠️" },
  { id: "ai_engineer", name: "AI / ML Engineer", desc: "Fine-tune LLMs, design agentic workflows, and build neural pipelines", color: "#8b5cf6", icon: "🧠" },
  { id: "designer", name: "Product Designer / UX", desc: "Design bespoke user interfaces, brand identities, and design systems", color: "#ec4899", icon: "🎨" },
  { id: "growth", name: "Growth & Distribution", desc: "Viral loops, organic channels, sales funnels, and marketing engines", color: "#10b981", icon: "📈" },
  { id: "finance", name: "Finance & Capital", desc: "Unit economics, venture models, pitch decks, and valuation metrics", color: "#06b6d4", icon: "💎" },
  { id: "operations", name: "Operations & Legal", desc: "Supply chain, compliance, entity incorporation, and scale systems", color: "#f59e0b", icon: "⚖️" },
  { id: "creator", name: "Media & Storytelling", desc: "Short-form video, brand journalism, and community cultivation", color: "#f43f5e", icon: "🎬" },
];

export const SKILLS_LIST = [
  "React / Next.js", "Python / FastAPI", "TypeScript", "AI / LLM Engineering", 
  "TailwindCSS", "Figma / UI Design", "PostgreSQL / Supabase", "System Architecture",
  "Viral Marketing", "Cold Outreach / B2B Sales", "Financial Modeling", "Video Editing",
  "Product Management", "Public Speaking", "SEO / Content"
];

export default function FoundryModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // Step tracker: 0 = Cinematic Manifesto Pledge, 1 = Personal, 2 = Track, 3 = Startup Mindset, 4 = Skills, 5 = Confirmation Passport
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
    weeklyHours: "15",
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
      fetch("/api/foundry/stats")
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch(() => {});
    }
  }, [isOpen]);

  const toggleSkill = (skill: string) => {
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
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#e31e24", "#ffffff", "#3b82f6", "#ffd700"],
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-void/90 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-4xl min-h-[580px] bg-void border border-paper/15 shadow-[0_25px_80px_rgba(0,0,0,0.85)] p-6 md:p-10 flex flex-col justify-between">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-paper/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-ember animate-ping" />
            <span className="font-mono text-xs tracking-[0.4em] uppercase text-ember font-bold">
              THE FOUNDRY // APPLICANT PORTAL
            </span>
          </div>

          <div className="flex items-center gap-6">
            {step > 0 && step < 5 && (
              <span className="font-mono text-xs tracking-widest text-ash">
                STAGE 0{step} / 04
              </span>
            )}
            <button
              onClick={onClose}
              className="text-paper/50 hover:text-paper text-sm font-mono tracking-widest uppercase transition-colors"
            >
              [ CLOSE ✕ ]
            </button>
          </div>
        </div>

        {/* Dynamic Step Content */}
        <div className="py-8 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* ════════════════════════════════════════════════════════════════
                STEP 0: CINEMATIC FOUNDER PLEDGE & LIVE COMMUNITY
               ════════════════════════════════════════════════════════════════ */}
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 text-center max-w-2xl mx-auto"
              >
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-ember font-bold">
                    PRE-FLIGHT DECLARATION
                  </span>
                  <h2 className="hero-display text-4xl md:text-6xl text-paper mt-3 leading-tight">
                    THIS ISN'T A COLLEGE CLUB. <br />
                    <span className="text-ember">WE BUILD FOUNDERS.</span>
                  </h2>
                  <p className="mt-4 text-paper/70 text-sm md:text-base leading-relaxed">
                    The Foundry is an elite, high-velocity venture accelerator for student builders at Chandigarh University. We provide non-dilutive capital, founder mentorship, and compute credits to ship real companies.
                  </p>
                </div>

                {/* Live Community Telemetry */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border border-paper/10 bg-paper/[0.02] p-4 text-left font-mono">
                  <div>
                    <span className="text-xs text-ash tracking-widest block">FOUNDERS</span>
                    <span className="text-2xl text-paper font-bold">{stats.foundersJoined}+</span>
                  </div>
                  <div>
                    <span className="text-xs text-ash tracking-widest block">IDEAS SHIPPED</span>
                    <span className="text-2xl text-ember font-bold">{stats.ideasSubmitted}</span>
                  </div>
                  <div>
                    <span className="text-xs text-ash tracking-widest block">HACKATHONS</span>
                    <span className="text-2xl text-paper font-bold">{stats.hackathonsHeld}</span>
                  </div>
                  <div>
                    <span className="text-xs text-ash tracking-widest block">COMPANIES</span>
                    <span className="text-2xl text-emerald-400 font-bold">{stats.startupsFormed}</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col items-center gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="border border-ember bg-ember text-paper px-10 py-4 font-mono text-sm tracking-[0.3em] font-bold hover:bg-ember/90 transition-all shadow-[0_0_30px_rgba(227,30,36,0.4)]"
                  >
                    I ACCEPT THE PLEDGE →
                  </button>
                  <span className="font-mono text-[10px] text-ash/60 tracking-widest uppercase">
                    ESTIMATED TIME: 3 MINUTES // AI ASSESSMENT POWERED BY GROQ
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
                    01 // IDENTIFIER & CONTACT
                  </span>
                  <h3 className="hero-display text-3xl text-paper mt-1">WHO ARE YOU?</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <label className="block text-ash mb-1 uppercase tracking-wider">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Ankan Roy"
                      className="w-full bg-paper/[0.04] border border-paper/20 px-4 py-3 text-paper focus:border-ember outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-ash mb-1 uppercase tracking-wider">University ID / UID *</label>
                    <input
                      type="text"
                      required
                      value={formData.universityId}
                      onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                      placeholder="23BCS10842"
                      className="w-full bg-paper/[0.04] border border-paper/20 px-4 py-3 text-paper focus:border-ember outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-ash mb-1 uppercase tracking-wider">Email (CU Mail or Personal) *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ankan@cumail.in"
                      className="w-full bg-paper/[0.04] border border-paper/20 px-4 py-3 text-paper focus:border-ember outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-ash mb-1 uppercase tracking-wider">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-paper/[0.04] border border-paper/20 px-4 py-3 text-paper focus:border-ember outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-ash mb-1 uppercase tracking-wider">Department *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-void border border-paper/20 px-4 py-3 text-paper focus:border-ember outline-none"
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
                    <label className="block text-ash mb-1 uppercase tracking-wider">Academic Year *</label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full bg-void border border-paper/20 px-4 py-3 text-paper focus:border-ember outline-none"
                    >
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>Postgraduate / Alumni</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-ash mb-1 uppercase tracking-wider">GitHub URL</label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/username"
                      className="w-full bg-paper/[0.04] border border-paper/20 px-4 py-3 text-paper focus:border-ember outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-ash mb-1 uppercase tracking-wider">LinkedIn URL</label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full bg-paper/[0.04] border border-paper/20 px-4 py-3 text-paper focus:border-ember outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    disabled={!formData.fullName || !formData.universityId || !formData.phone}
                    onClick={() => setStep(2)}
                    className="border border-ember bg-ember text-paper px-8 py-3 font-mono text-xs tracking-widest uppercase font-bold disabled:opacity-40"
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
                className="space-y-6 max-w-3xl mx-auto w-full"
              >
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember font-bold">
                    02 // TRACK SPECIALIZATION
                  </span>
                  <h3 className="hero-display text-3xl text-paper mt-1">WHERE DO YOU CREATE LEVERAGE?</h3>
                  <p className="text-xs font-mono text-ash mt-1">
                    Select the primary capability you bring to early-stage venture squads.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-2">
                  {FOUNDRY_TRACKS.map((t) => {
                    const isSelected = formData.trackId === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, trackId: t.id })}
                        className={`p-4 text-left border transition-all ${
                          isSelected
                            ? "border-ember bg-ember/15 shadow-[0_0_20px_rgba(227,30,36,0.2)]"
                            : "border-paper/10 bg-paper/[0.02] hover:border-paper/30"
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-xs mb-1">
                          <span className="text-xl">{t.icon}</span>
                          {isSelected && <span className="text-ember font-bold">SELECTED</span>}
                        </div>
                        <h4 className="font-display text-lg text-paper tracking-wide">{t.name}</h4>
                        <p className="text-xs text-ash leading-relaxed mt-1">{t.desc}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="font-mono text-xs text-ash hover:text-paper uppercase tracking-widest"
                  >
                    ← BACK
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="border border-ember bg-ember text-paper px-8 py-3 font-mono text-xs tracking-widest uppercase font-bold"
                  >
                    NEXT: STARTUP MINDSET →
                  </button>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                STEP 3: ENTREPRENEURIAL MINDSET & 30-DAY CHALLENGE
               ════════════════════════════════════════════════════════════════ */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5 max-w-2xl mx-auto w-full"
              >
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember font-bold">
                    03 // CONVICTION & EXECUTION
                  </span>
                  <h3 className="hero-display text-3xl text-paper mt-1">THE FOUNDER MINDSET</h3>
                  <p className="text-xs font-mono text-ash mt-1">
                    Evaluated by Groq AI model for bias toward shipping and problem clarity.
                  </p>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-paper/90 mb-1 font-bold">
                      1. What is one problem you notice every day that nobody is solving? *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.problemStatement}
                      onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                      placeholder="e.g. Student project teams fall apart because there's no automated escrow or milestone tracker for collegiate hackathon projects..."
                      className="w-full bg-paper/[0.04] border border-paper/20 p-3 text-paper focus:border-ember outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-paper/90 mb-1 font-bold">
                      2. If we gave you ₹10,000 / $150 today, what would you build in 30 days? *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.buildIn30Days}
                      onChange={(e) => setFormData({ ...formData, buildIn30Days: e.target.value })}
                      placeholder="e.g. I would spin up an API wrapper, deploy a Next.js landing page on Vercel, run ₹2,000 of hyper-targeted LinkedIn ads, and sign up 10 paid beta users."
                      className="w-full bg-paper/[0.04] border border-paper/20 p-3 text-paper focus:border-ember outline-none leading-relaxed"
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
                      placeholder="Describe anything from a small Python script to a 500-member Discord or freelancing client project."
                      className="w-full bg-paper/[0.04] border border-paper/20 p-3 text-paper focus:border-ember outline-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="font-mono text-xs text-ash hover:text-paper uppercase tracking-widest"
                  >
                    ← BACK
                  </button>
                  <button
                    disabled={!formData.problemStatement || !formData.buildIn30Days || !formData.pastProject}
                    onClick={() => setStep(4)}
                    className="border border-ember bg-ember text-paper px-8 py-3 font-mono text-xs tracking-widest uppercase font-bold disabled:opacity-40"
                  >
                    NEXT: SKILLS & SUBMIT →
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
                className="space-y-6 max-w-2xl mx-auto w-full"
              >
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember font-bold">
                    04 // TOOLKIT & COMMITMENT
                  </span>
                  <h3 className="hero-display text-3xl text-paper mt-1">ARMORY & DEDICATION</h3>
                </div>

                <div>
                  <label className="block text-xs font-mono text-ash mb-3 uppercase tracking-wider">
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
                          className={`font-mono text-xs px-3 py-1.5 border transition-all ${
                            isSel
                              ? "border-ember bg-ember text-paper font-bold"
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
                  <div className="flex gap-4">
                    {["10-15 hrs", "15-25 hrs", "25+ hrs (Full Immersion)"].map((hrs) => (
                      <label
                        key={hrs}
                        className={`flex-1 border p-3 cursor-pointer text-center transition-all ${
                          formData.weeklyHours === hrs
                            ? "border-ember bg-ember/15 text-paper font-bold"
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

                <div className="p-4 border border-ember/30 bg-ember/5 flex items-start gap-3">
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
                    onClick={() => setStep(3)}
                    className="font-mono text-xs text-ash hover:text-paper uppercase tracking-widest"
                  >
                    ← BACK
                  </button>
                  <button
                    disabled={loading || !formData.pledgeAccepted}
                    onClick={handleSubmit}
                    className="border border-ember bg-ember text-paper px-10 py-4 font-mono text-sm tracking-[0.25em] uppercase font-bold hover:bg-ember/90 disabled:opacity-40 transition-all shadow-[0_0_30px_rgba(227,30,36,0.4)] flex items-center gap-3"
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
                STEP 5: DIGITAL FOUNDER PASSPORT & CONFIRMATION
               ════════════════════════════════════════════════════════════════ */}
            {step === 5 && result && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 max-w-3xl mx-auto w-full text-center"
              >
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.4em] text-emerald-400 font-bold">
                    PASSPORT GENERATED // STATUS: ADMITTED TO EVALUATION
                  </span>
                  <h3 className="hero-display text-4xl text-paper mt-2">
                    WELCOME TO THE FOUNDRY, {result.full_name.split(" ")[0].toUpperCase()}.
                  </h3>
                  <p className="text-xs font-mono text-ash mt-1">
                    Builders aren't selected. They prove themselves.
                  </p>
                </div>

                {/* Digital Founder Card / Passport */}
                <div className="relative border-2 border-ember bg-void/90 p-8 text-left shadow-[0_0_50px_rgba(227,30,36,0.25)] font-mono space-y-6">
                  {/* Watermark */}
                  <div className="absolute right-4 bottom-2 text-paper/[0.03] text-7xl hero-display pointer-events-none">
                    E-CELL
                  </div>

                  {/* Header Row */}
                  <div className="flex justify-between items-start border-b border-paper/10 pb-4">
                    <div>
                      <span className="text-[10px] text-ash tracking-widest block">FOUNDER PASSPORT ID</span>
                      <span className="text-2xl font-bold text-ember tracking-wider">{result.founder_id}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-ash tracking-widest block">COHORT BATCH</span>
                      <span className="text-sm font-bold text-paper">{result.batch_name}</span>
                    </div>
                  </div>

                  {/* Founder Profile Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
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
                  <div className="border border-paper/15 bg-paper/[0.02] p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-ember font-bold tracking-widest uppercase">
                        GROQ AI FOUNDER DNA SCORE
                      </span>
                      <span className="text-xl font-bold text-paper">{result.founder_score} / 100</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center border-t border-paper/10 pt-3 text-[11px]">
                      <div>
                        <span className="text-ash block text-[10px]">PROBLEM SOLVING</span>
                        <span className="font-bold text-paper">{result.score_problem_solving}%</span>
                      </div>
                      <div>
                        <span className="text-ash block text-[10px]">LEADERSHIP</span>
                        <span className="font-bold text-paper">{result.score_leadership}%</span>
                      </div>
                      <div>
                        <span className="text-ash block text-[10px]">EXECUTION BIAS</span>
                        <span className="font-bold text-emerald-400">{result.score_execution}%</span>
                      </div>
                    </div>

                    <div className="border-t border-paper/10 pt-2 text-xs text-paper/80 leading-relaxed italic">
                      "{result.ai_assessment_summary}"
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="border border-paper/30 px-6 py-3 font-mono text-xs text-paper hover:border-paper"
                  >
                    PRINT / SAVE PASSPORT 🖨️
                  </button>
                  <button
                    onClick={onClose}
                    className="border border-ember bg-ember px-8 py-3 font-mono text-xs text-paper font-bold tracking-widest uppercase"
                  >
                    DONE / ENTER PORTAL →
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
