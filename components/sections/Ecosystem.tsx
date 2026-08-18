"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { NETWORK_ROLES, PEOPLE, type NetworkRole, type Person } from "@/data/content";
import { sound } from "@/lib/sound";
import { Magnetic, MaskText, Reveal } from "@/components/core/Motion";
import { scrollToId } from "@/lib/scroll";

const VB_W = 1100;
const VB_H = 750;

const ROLE_COLORS: Record<NetworkRole, { stroke: string; bg: string; text: string; glow: string }> = {
  FOUNDERS: { stroke: "#e31e24", bg: "#e31e24", text: "#ffffff", glow: "rgba(227,30,36,0.6)" },
  STUDENTS: { stroke: "#111111", bg: "#1f1f1f", text: "#ffffff", glow: "rgba(0,0,0,0.3)" },
  MENTORS: { stroke: "#059669", bg: "#10b981", text: "#ffffff", glow: "rgba(16,185,129,0.5)" },
  ALUMNI: { stroke: "#4f46e5", bg: "#6366f1", text: "#ffffff", glow: "rgba(99,102,241,0.5)" },
  FACULTY: { stroke: "#d97706", bg: "#f59e0b", text: "#ffffff", glow: "rgba(245,158,11,0.5)" },
  PARTNERS: { stroke: "#0891b2", bg: "#06b6d4", text: "#ffffff", glow: "rgba(6,182,212,0.5)" },
};

const ROLE_LAYOUT: Record<NetworkRole, { x: number; y: number; spread: number; label: string }> = {
  FOUNDERS: { x: 780, y: 230, spread: 130, label: "01 // FOUNDERS" },
  STUDENTS: { x: 550, y: 410, spread: 180, label: "02 // BUILDERS" },
  MENTORS: { x: 300, y: 160, spread: 120, label: "03 // MENTORS" },
  ALUMNI: { x: 190, y: 490, spread: 110, label: "04 // ALUMNI" },
  FACULTY: { x: 440, y: 640, spread: 100, label: "05 // FACULTY" },
  PARTNERS: { x: 860, y: 550, spread: 95, label: "06 // PARTNERS" },
};

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Node {
  id: string;
  person: Person;
  x: number;
  y: number;
  r: number;
  neighbors: string[];
  drift: number;
  seed: number;
}

export default function Ecosystem() {
  const reduced = useReducedMotion();
  const [activeRole, setActiveRole] = useState<NetworkRole | "ALL">("ALL");
  const [viewMode, setViewMode] = useState<"graph" | "grid">("graph");
  const [focus, setFocus] = useState<string | null>(null);
  const [selected, setSelected] = useState<Person | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Compute fixed deterministic node locations
  const { nodes, hubs, edges } = useMemo(() => {
    const rnd = mulberry32(20260818);
    const byRole = new Map<NetworkRole, Person[]>();
    for (const p of PEOPLE) {
      byRole.set(p.role, [...(byRole.get(p.role) ?? []), p]);
    }

    const nodes: Node[] = [];
    for (const role of NETWORK_ROLES) {
      const layout = ROLE_LAYOUT[role];
      const list = byRole.get(role) ?? [];
      const angleBase = rnd() * Math.PI * 2;
      list.forEach((person, i) => {
        const angle = angleBase + i * 2.399;
        const rad = Math.sqrt(rnd()) * layout.spread * (1 + (i % 3) * 0.12);
        nodes.push({
          id: person.id,
          person,
          x: Math.max(60, Math.min(VB_W - 60, layout.x + Math.cos(angle) * rad)),
          y: Math.max(60, Math.min(VB_H - 60, layout.y + Math.sin(angle) * rad * 0.84)),
          r: 7 + rnd() * 4 + (person.featured ? 4 : 0),
          neighbors: [],
          drift: 2 + rnd() * 4,
          seed: rnd() * Math.PI * 2,
        });
      });
    }

    const hubs = NETWORK_ROLES.map((role) => ({
      role,
      x: ROLE_LAYOUT[role].x,
      y: ROLE_LAYOUT[role].y,
      label: ROLE_LAYOUT[role].label,
    }));

    // Generate cluster edges + cross-role bridges
    const edges: { a: string; b: string; cross?: boolean }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        const sameRole = a.person.role === b.person.role;
        const threshold = sameRole ? 130 : 95;

        if (d < threshold) {
          edges.push({ a: a.id, b: b.id, cross: !sameRole });
          a.neighbors.push(b.id);
          b.neighbors.push(a.id);
        }
      }
    }

    return { nodes, hubs, edges };
  }, []);

  const isHighlighted = (person: Person) => {
    if (activeRole === "ALL") return true;
    return person.role === activeRole;
  };

  const isConnectedToFocus = (id: string) => {
    if (!focus) return true;
    if (id === focus) return true;
    const n = nodes.find((x) => x.id === focus);
    return n?.neighbors.includes(id) ?? false;
  };

  const handlePointerEnter = (id: string) => {
    setFocus(id);
    sound.dot();
  };

  const handleNodeClick = (person: Person) => {
    setSelected(person);
    sound.enter();
  };

  const focusedNode = useMemo(() => {
    if (!focus) return null;
    return nodes.find((n) => n.id === focus) ?? null;
  }, [focus, nodes]);

  const filteredPeople = useMemo(() => {
    if (activeRole === "ALL") return PEOPLE;
    return PEOPLE.filter((p) => p.role === activeRole);
  }, [activeRole]);

  return (
    <section
      id="ecosystem"
      className="relative bg-paper px-6 py-28 text-ink md:px-[8vw] md:py-36 overflow-hidden select-none"
      aria-label="The ecosystem"
    >
      {/* Background Architectural Radar Grid */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(23,23,23,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Section Header */}
      <div className="relative mb-12 flex flex-col justify-between gap-8 md:mb-16 md:flex-row md:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-3 border border-ember/40 bg-ember/10 px-3.5 py-1">
            <span className="h-2 w-2 rounded-full bg-ember animate-ping" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-ember font-bold">
              04 // LIVING SYNAPSE NETWORK
            </span>
          </div>
          <h2 className="hero-display text-[clamp(44px,7.5vw,110px)] leading-[0.9] text-ink">
            THE <span className="text-stroke-ink">ECOSYSTEM.</span>
          </h2>
        </div>

        <Reveal className="max-w-md">
          <p className="font-mono text-xs md:text-sm leading-relaxed text-ink/75 uppercase tracking-wide">
            A high-density network of student builders, funded founders, venture mentors, and alumni leaders. Hover to illuminate synapses. Click any node to open their founder dossier.
          </p>
        </Reveal>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          LIVE ECOSYSTEM TELEMETRY STATS BAR
         ════════════════════════════════════════════════════════════════════ */}
      <div className="relative mb-10 grid grid-cols-2 md:grid-cols-4 gap-3 border border-ink/10 bg-white/70 backdrop-blur-md p-5 shadow-sm font-mono">
        <div>
          <span className="text-[10px] text-ink/50 tracking-widest block uppercase">ACTIVE VENTURE COHORT</span>
          <span className="text-2xl font-bold text-ink">340+ FOUNDERS</span>
        </div>
        <div>
          <span className="text-[10px] text-ink/50 tracking-widest block uppercase">SEED CAPITAL RAISED</span>
          <span className="text-2xl font-bold text-ember">₹4.2 CR+</span>
        </div>
        <div>
          <span className="text-[10px] text-ink/50 tracking-widest block uppercase">CAMPUS VENTURES SHIPPED</span>
          <span className="text-2xl font-bold text-ink">48 COMPANIES</span>
        </div>
        <div>
          <span className="text-[10px] text-ink/50 tracking-widest block uppercase">1:1 MENTOR ACCELERATION</span>
          <span className="text-2xl font-bold text-emerald-600">120+ HRS / MO</span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          TRACK FILTER TABS & VIEW TOGGLE
         ════════════════════════════════════════════════════════════════════ */}
      <div className="relative mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-ink/10 pb-6">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveRole("ALL");
              sound.dot();
            }}
            className={`font-mono text-xs uppercase px-4 py-2 border transition-all ${
              activeRole === "ALL"
                ? "border-ember bg-ember text-white font-bold shadow-[0_0_15px_rgba(227,30,36,0.3)]"
                : "border-ink/15 bg-white/50 text-ink/70 hover:border-ink/40"
            }`}
          >
            ALL CLUSTERS ({PEOPLE.length})
          </button>

          {NETWORK_ROLES.map((role) => {
            const isSel = activeRole === role;
            const count = PEOPLE.filter((p) => p.role === role).length;
            const color = ROLE_COLORS[role].bg;
            return (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setActiveRole(role);
                  sound.dot();
                }}
                className={`font-mono text-xs uppercase px-3.5 py-2 border flex items-center gap-2 transition-all ${
                  isSel
                    ? "border-ink bg-ink text-white font-bold shadow-md"
                    : "border-ink/15 bg-white/50 text-ink/70 hover:border-ink/40"
                }`}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                {role} ({count})
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 border border-ink/20 bg-white/80 p-1 font-mono text-xs">
          <button
            type="button"
            onClick={() => setViewMode("graph")}
            className={`px-3 py-1.5 transition-all ${
              viewMode === "graph" ? "bg-ink text-white font-bold" : "text-ink/60 hover:text-ink"
            }`}
          >
            🌌 SYNAPSE GRAPH
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 transition-all ${
              viewMode === "grid" ? "bg-ink text-white font-bold" : "text-ink/60 hover:text-ink"
            }`}
          >
            🗂️ DIRECTORY ({filteredPeople.length})
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          VIEW 1: INTERACTIVE LIVING SYNAPTIC NEBULA (GRAPH VIEW)
         ════════════════════════════════════════════════════════════════════ */}
      {viewMode === "graph" ? (
        <div
          ref={wrapRef}
          className="relative mx-auto aspect-[16/10] w-full max-w-6xl rounded-2xl border border-ink/15 bg-white/60 p-4 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
          onMouseMove={(e) => {
            const rect = wrapRef.current?.getBoundingClientRect();
            if (rect) {
              setMousePos({
                x: ((e.clientX - rect.left) / rect.width) * VB_W,
                y: ((e.clientY - rect.top) / rect.height) * VB_H,
              });
            }
          }}
          onMouseLeave={() => setMousePos(null)}
        >
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="h-full w-full overflow-visible"
            role="img"
            aria-label="Interactive neural network of founders and mentors in the E-Cell ecosystem"
          >
            <defs>
              <radialGradient id="hubSonar" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#e31e24" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#e31e24" stopOpacity="0" />
              </radialGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 1. Hub Radar Crosshairs & Sonar Pulses */}
            {hubs.map((h) => {
              const isClusterActive = activeRole === "ALL" || activeRole === h.role;
              const color = ROLE_COLORS[h.role];
              return (
                <g key={h.role} opacity={isClusterActive ? 1 : 0.25} className="transition-opacity duration-300">
                  {/* Sonar wave */}
                  <circle
                    cx={h.x}
                    cy={h.y}
                    r={60}
                    fill="none"
                    stroke={color.stroke}
                    strokeWidth="1"
                    strokeDasharray="4 8"
                    className="animate-[spin_40s_linear_infinite]"
                  />
                  <circle cx={h.x} cy={h.y} r={4} fill={color.bg} />
                  <text
                    x={h.x}
                    y={h.y - 70}
                    textAnchor="middle"
                    className="font-mono text-[10px] uppercase font-bold tracking-[0.25em] fill-ink/40 select-none"
                  >
                    {h.label}
                  </text>
                </g>
              );
            })}

            {/* 2. Synaptic Edges */}
            {edges.map((e, idx) => {
              const a = nodes.find((n) => n.id === e.a)!;
              const b = nodes.find((n) => n.id === e.b)!;
              const isRelevant = isHighlighted(a.person) && isHighlighted(b.person);
              const isFocused = focus !== null && (e.a === focus || e.b === focus);
              const isCross = e.cross;

              return (
                <g key={`${e.a}-${e.b}`}>
                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={isFocused ? "#e31e24" : isCross ? "rgba(23,23,23,0.12)" : "rgba(23,23,23,0.18)"}
                    strokeWidth={isFocused ? 2.2 : isRelevant ? 1 : 0.4}
                    strokeDasharray={isCross ? "2 4" : undefined}
                    opacity={isFocused ? 1 : isRelevant ? (focus ? 0.1 : 0.7) : 0.08}
                    className="transition-all duration-200"
                  />

                  {/* Traveling Energy Photon Comet along active edges */}
                  {!reduced && isRelevant && idx % 3 === 0 && (
                    <circle r={isFocused ? 3 : 1.8} fill={isFocused ? "#e31e24" : "#111111"}>
                      <animateMotion
                        path={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
                        dur={`${4 + (idx % 4)}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* 3. Interactive Mouse Gravity Tether */}
            {mousePos && focus && focusedNode && (
              <line
                x1={focusedNode.x}
                y1={focusedNode.y}
                x2={mousePos.x}
                y2={mousePos.y}
                stroke="#e31e24"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.8"
              />
            )}

            {/* 4. Synaptic Nodes */}
            {nodes.map((n) => {
              const isMatch = isHighlighted(n.person);
              const active = focus === n.id;
              const connected = isConnectedToFocus(n.id);
              const dimmed = (!isMatch || (focus !== null && !connected));
              const color = ROLE_COLORS[n.person.role];

              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x} ${n.y})`}
                  opacity={dimmed ? 0.18 : 1}
                  className="transition-opacity duration-300"
                >
                  {/* Outer Pulsing Halo when active/featured */}
                  {active && (
                    <>
                      <circle r={n.r + 14} fill="none" stroke="#e31e24" strokeWidth="1.5" opacity="0.4" />
                      <circle r={n.r + 8} fill="none" stroke="#e31e24" strokeWidth="2" opacity="0.8" />
                    </>
                  )}

                  {n.person.featured && !active && (
                    <circle
                      r={n.r + 6}
                      fill="none"
                      stroke={color.stroke}
                      strokeWidth="1"
                      strokeDasharray="2 4"
                      className="animate-[spin_20s_linear_infinite]"
                      opacity="0.6"
                    />
                  )}

                  {/* Core Interactive Node Sphere */}
                  <motion.g
                    animate={reduced ? undefined : { y: [0, n.drift, 0] }}
                    transition={{
                      duration: n.drift * 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: n.seed,
                    }}
                  >
                    {/* Shadow base */}
                    <circle cx={0} cy={0} r={n.r} fill={color.bg} className="shadow-md" />

                    {/* Touch / Click target */}
                    <circle
                      cx={0}
                      cy={0}
                      r={n.r + 10}
                      fill="transparent"
                      className="cursor-pointer"
                      onPointerEnter={() => handlePointerEnter(n.id)}
                      onPointerLeave={() => setFocus(null)}
                      onClick={() => handleNodeClick(n.person)}
                    />

                    {/* Small initials for featured nodes */}
                    {n.person.featured && (
                      <text
                        x={0}
                        y={3}
                        textAnchor="middle"
                        className="font-mono text-[8px] font-bold fill-white pointer-events-none select-none"
                      >
                        {n.person.avatar}
                      </text>
                    )}
                  </motion.g>
                </g>
              );
            })}
          </svg>

          {/* ════════════════════════════════════════════════════════════════
              HOLOGRAPHIC TELEMETRY HOVER TOOLTIP
             ════════════════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {focusedNode && (
              <motion.div
                key={focusedNode.id}
                className="pointer-events-none absolute z-20"
                style={{
                  left: `${(focusedNode.x / VB_W) * 100}%`,
                  top: `${(focusedNode.y / VB_H) * 100}%`,
                  transform: "translate(-50%, -125%)",
                }}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <div className="w-64 rounded-xl border border-ember/40 bg-void/95 p-4 text-paper shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                  <div className="flex items-center justify-between border-b border-paper/10 pb-2 mb-2 font-mono">
                    <span className="text-[10px] text-ember font-bold tracking-widest uppercase">
                      {focusedNode.person.role}
                    </span>
                    <span className="text-[9px] text-ash tracking-widest">
                      {focusedNode.person.batch || "E-CELL CU"}
                    </span>
                  </div>

                  <h4 className="font-display text-lg text-paper tracking-wide leading-tight">
                    {focusedNode.person.name}
                  </h4>
                  <p className="text-xs text-paper/80 font-mono mt-0.5">{focusedNode.person.title}</p>
                  
                  <div className="mt-2.5 pt-2 border-t border-paper/10">
                    <span className="text-[9px] font-mono text-ember block uppercase tracking-wider font-bold">
                      BUILDING:
                    </span>
                    <p className="text-[11px] text-paper/90 leading-tight line-clamp-2">
                      {focusedNode.person.building}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between font-mono text-[9px] text-ash">
                    <span className="text-emerald-400 font-bold">{focusedNode.person.stats}</span>
                    <span className="text-ember underline">[ CLICK TO OPEN DOSSIER ↗ ]</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* ════════════════════════════════════════════════════════════════════
            VIEW 2: FOUNDER & MENTOR ROSTER GRID (DIRECTORY VIEW)
           ════════════════════════════════════════════════════════════════════ */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {filteredPeople.map((person) => {
            const color = ROLE_COLORS[person.role];
            return (
              <motion.div
                key={person.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative rounded-xl border border-ink/10 bg-white/70 p-6 backdrop-blur-md transition-all hover:border-ember hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-ink/10 pb-3 mb-4 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color.bg }} />
                      <span className="text-ember font-bold uppercase tracking-wider">{person.role}</span>
                    </div>
                    <span className="text-ink/40 tracking-wider">{person.batch}</span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold text-white shadow-md"
                      style={{ backgroundColor: color.bg }}
                    >
                      {person.avatar}
                    </div>
                    <div>
                      <h4 className="font-display text-xl text-ink tracking-wide">{person.name}</h4>
                      <p className="font-mono text-xs text-ink/70 leading-snug mt-0.5">{person.title}</p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-ink/10 pt-3 space-y-2">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ink/50 block font-bold">
                        VENTURE FOCUS:
                      </span>
                      <p className="text-xs text-ink/90 leading-relaxed">{person.building}</p>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-600 block font-bold">
                        TRACTION / IMPACT:
                      </span>
                      <p className="font-mono text-xs text-ink font-semibold">{person.stats}</p>
                    </div>
                  </div>

                  {/* Tech Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {person.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-sm bg-ink/[0.05] px-2 py-0.5 font-mono text-[10px] text-ink/75"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-ink/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleNodeClick(person)}
                    className="font-mono text-xs text-ember font-bold tracking-widest uppercase hover:underline"
                  >
                    VIEW DOSSIER ↗
                  </button>
                  <span className="font-mono text-[10px] text-ink/40 uppercase">E-CELL VENTURE</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          SLIDE-IN FOUNDER DOSSIER MODAL
         ════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-void/85 backdrop-blur-2xl">
            <motion.div
              className="relative w-full max-w-2xl rounded-2xl border-2 border-ember bg-void p-8 md:p-10 text-paper shadow-[0_0_80px_rgba(227,30,36,0.35)] font-mono"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }}
              role="dialog"
              aria-modal="true"
              aria-label={`${selected.name} dossier`}
            >
              {/* Top Header */}
              <div className="flex items-center justify-between border-b border-paper/15 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-ember animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-[0.35em] text-ember">
                    FOUNDER DOSSIER // DECLASSIFIED
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="font-mono text-xs text-ash hover:text-paper uppercase tracking-widest transition-colors"
                >
                  [ CLOSE ✕ ]
                </button>
              </div>

              {/* Profile Card Main */}
              <div className="flex items-start gap-5 mb-6">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-mono text-xl font-bold text-white shadow-xl"
                  style={{ backgroundColor: ROLE_COLORS[selected.role].bg }}
                >
                  {selected.avatar}
                </div>
                <div>
                  <span className="text-[10px] text-ember font-bold tracking-widest uppercase block">
                    {selected.role} // {selected.batch || "E-CELL NETWORK"}
                  </span>
                  <h3 className="hero-display text-3xl text-paper tracking-wide mt-0.5">{selected.name}</h3>
                  <p className="text-xs text-ash font-mono">{selected.title}</p>
                </div>
              </div>

              {/* Dossier Body */}
              <div className="space-y-4 border-t border-paper/10 pt-4 text-xs font-mono">
                <div className="border border-paper/15 bg-paper/[0.02] p-4">
                  <span className="text-ember font-bold block uppercase text-[10px] mb-1">
                    WHAT ARE YOU BUILDING?
                  </span>
                  <p className="text-paper/90 leading-relaxed font-display text-lg tracking-wide">
                    {selected.building}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border border-paper/15 bg-paper/[0.02] p-3.5">
                    <span className="text-ash block uppercase text-[10px] mb-1 font-bold">
                      WHY E-CELL?
                    </span>
                    <p className="text-paper/80 leading-relaxed">{selected.why}</p>
                  </div>

                  <div className="border border-paper/15 bg-paper/[0.02] p-3.5">
                    <span className="text-ash block uppercase text-[10px] mb-1 font-bold">
                      CURRENT OBSESSION:
                    </span>
                    <p className="text-paper/80 leading-relaxed">{selected.obsessed}</p>
                  </div>
                </div>

                <div className="border border-emerald-500/30 bg-emerald-950/20 p-3.5 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                    TRACTION & MILESTONES:
                  </span>
                  <span className="text-sm font-bold text-paper">{selected.stats}</span>
                </div>

                {/* Tech Stack Pills */}
                <div className="pt-2">
                  <span className="text-[10px] text-ash uppercase tracking-wider block mb-2 font-bold">
                    CORE SUPERPOWERS & TECH:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selected.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-paper/20 bg-paper/[0.04] px-3 py-1 text-[11px] text-paper font-semibold"
                      >
                        ⚡ {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-5 border-t border-paper/15 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {selected.linkedin && (
                    <a
                      href={selected.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="border border-paper/30 px-4 py-2 text-xs text-paper hover:border-paper transition-colors"
                    >
                      LINKEDIN ↗
                    </a>
                  )}
                  {selected.github && (
                    <a
                      href={selected.github}
                      target="_blank"
                      rel="noreferrer"
                      className="border border-paper/30 px-4 py-2 text-xs text-paper hover:border-paper transition-colors"
                    >
                      GITHUB ↗
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    scrollToId("start");
                  }}
                  className="w-full sm:w-auto border border-ember bg-ember px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-paper shadow-[0_0_20px_rgba(227,30,36,0.4)]"
                >
                  COLLABORATE IN THE FOUNDRY →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Section Footer Callout */}
      <div className="mt-20 text-center md:mt-28">
        <MaskText>
          <p className="hero-display text-[clamp(28px,5vw,72px)] leading-tight text-ink">
            SOMEONE IN THIS NETWORK IS BUILDING WHAT YOU'RE THINKING ABOUT.
          </p>
        </MaskText>
        <Reveal delay={0.2} className="mt-6 flex justify-center">
          <Magnetic>
            <button
              type="button"
              onClick={() => scrollToId("start")}
              data-cursor="enter"
              className="border-2 border-ink bg-ink px-8 py-4 font-mono text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-paper shadow-xl hover:bg-ember hover:border-ember transition-all"
            >
              FIND YOUR CO-FOUNDER IN THE FOUNDRY →
            </button>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
