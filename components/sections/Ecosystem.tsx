"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { NETWORK_ROLES, PEOPLE, type Person } from "@/data/content";
import { MaskText, Reveal } from "@/components/core/Motion";

const VB_W = 1000;
const VB_H = 700;

/* fixed-precision helper: guarantees identical attribute strings
   between server and client render (floats serialize differently) */
const r3 = (v: number) => Math.round(v * 1000) / 1000;
const t3 = (v: number) => Math.round(v * 1000) / 1000;

const ROLE_LAYOUT: Record<string, { x: number; y: number; spread: number }> = {
  STUDENTS: { x: 500, y: 400, spread: 170 },
  FOUNDERS: { x: 760, y: 240, spread: 120 },
  MENTORS: { x: 300, y: 150, spread: 115 },
  ALUMNI: { x: 190, y: 470, spread: 110 },
  FACULTY: { x: 430, y: 620, spread: 100 },
  PARTNERS: { x: 820, y: 540, spread: 90 },
};

/* deterministic pseudo-random so the layout is stable */
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
  touchR: number;
}

function useSmallScreen() {
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setSmall(mq.matches);
    const on = (e: MediaQueryListEvent) => setSmall(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return small;
}

export default function Ecosystem() {
  const reduced = useReducedMotion();
  const small = useSmallScreen();
  const [focus, setFocus] = useState<string | null>(null);
  const [selected, setSelected] = useState<Person | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const { nodes, hubs, edges } = useMemo(() => {
    const rnd = mulberry32(20260813);
    const byRole = new Map<string, Person[]>();
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
          x: layout.x + Math.cos(angle) * rad,
          y: layout.y + Math.sin(angle) * rad * 0.82,
          r: 5.5 + rnd() * 3.5 + (person.featured ? 3 : 0),
          // smaller viewport → bigger touch targets (viewBox units)
          touchR: small ? 2.6 : 1,
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
    }));

    // edges: node → its role hub, plus close-neighbor links
    const edges: { a: string; b: string }[] = [];
    const hubMap = new Map<string, string>();
    for (const n of nodes) {
      const hub = hubs.find((h) => h.role === n.person.role)!;
      const hubId = `hub-${hub.role}`;
      hubMap.set(n.id, hubId);
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 110) {
          edges.push({ a: a.id, b: b.id });
          a.neighbors.push(b.id);
          b.neighbors.push(a.id);
        }
      }
    }

    return { nodes, hubs, edges, hubMap };
  }, [small]);

  const isConnected = (id: string) => {
    if (!focus) return true;
    if (id === focus) return true;
    const n = nodes.find((x) => x.id === focus);
    return n?.neighbors.includes(id) ?? false;
  };

  const showDetail = (person: Person) => {
    setSelected(person);
  };

  return (
    <section
      id="ecosystem"
      className="relative bg-paper px-6 py-28 text-ink md:px-[8vw] md:py-36"
      aria-label="The ecosystem"
    >
      <div className="mb-14 flex flex-col justify-between gap-8 md:mb-20 md:flex-row md:items-end">
        <div>
          <p className="label-ink mb-5 text-ember">04 — THE PEOPLE</p>
          <h2 className="font-display text-[clamp(40px,7vw,110px)] leading-[0.9]">
            THE <span className="text-stroke-ink">ECOSYSTEM.</span>
          </h2>
        </div>
        <Reveal className="max-w-sm">
          <p className="text-[15px] leading-relaxed text-ink/65">
            A living network of students, founders, mentors, alumni, faculty and
            partners. Hover to see the connections. Click a node to meet someone.
          </p>
        </Reveal>
      </div>

      <div ref={wrapRef} className="relative mx-auto aspect-[10/7] w-full max-w-5xl">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="h-full w-full"
          role="img"
          aria-label="Interactive network of people in the E-Cell ecosystem"
        >
          {/* hub rings */}
          {hubs.map((h) => (
            <g key={h.role}>
              <circle
                cx={t3(h.x)}
                cy={t3(h.y)}
                r={44}
                fill="none"
                stroke="rgba(23,23,23,0.12)"
                strokeWidth="1"
                strokeDasharray="3 6"
              />
              <circle cx={t3(h.x)} cy={t3(h.y)} r={3} fill="#e31e24" />
            </g>
          ))}

          {/* edges */}
          {edges.map((e) => {
            const a = nodes.find((n) => n.id === e.a)!;
            const b = nodes.find((n) => n.id === e.b)!;
            const active = focus !== null && (e.a === focus || e.b === focus);
            return (
              <line
                key={`${e.a}-${e.b}`}
                x1={t3(a.x)}
                y1={t3(a.y)}
                x2={t3(b.x)}
                y2={t3(b.y)}
                stroke={active ? "#e31e24" : "rgba(23,23,23,0.16)"}
                strokeWidth={active ? 1.6 : 0.8}
                opacity={active ? 1 : focus ? 0.08 : 0.5}
              />
            );
          })}

          {/* nodes */}
          {nodes.map((n) => {
            const active = focus === n.id;
            const dimmed = focus !== null && !isConnected(n.id);
            return (
              <g
                key={n.id}
                transform={`translate(${t3(n.x)} ${t3(n.y)})`}
                opacity={dimmed ? 0.2 : 1}
              >
                {active && (
                  <circle r={t3(n.r + 10)} fill="none" stroke="#e31e24" strokeWidth="1" opacity="0.5" />
                )}
                <motion.g
                  animate={reduced ? undefined : { y: [0, n.drift, 0] }}
                  transition={{
                    duration: n.drift * 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: n.seed,
                  }}
                >
                  <circle
                    cx={0}
                    cy={0}
                    r={t3(n.r * n.touchR)}
                    fill={
                      active
                        ? "#e31e24"
                        : n.person.role === "STUDENTS"
                          ? "#1b1b1b"
                          : "#8a8a8a"
                    }
                    className="cursor-pointer"
                    onPointerEnter={() => setFocus(n.id)}
                    onPointerLeave={() => setFocus(null)}
                    onClick={() => showDetail(n.person)}
                  />
                </motion.g>
              </g>
            );
          })}
        </svg>

        {/* floating label of the focused node */}
        <AnimatePresence>
          {focus && (
            <motion.div
              key={focus}
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
              style={{
                left: `${(() => {
                  const n = nodes.find((x) => x.id === focus)!;
                  return (n.x / VB_W) * 100;
                })()}%`,
                top: `${(() => {
                  const n = nodes.find((x) => x.id === focus)!;
                  return (n.y / VB_H) * 100;
                })()}%`,
              }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: -10 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <div className="rounded-sm bg-ink px-3 py-1.5 text-paper">
                <p className="label text-[9px] text-paper/70">{focus.replace("-", " ").toUpperCase()}</p>
                <p className="text-xs font-semibold">
                  {nodes.find((x) => x.id === focus)!.person.name}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* legend */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {NETWORK_ROLES.map((r) => (
          <span key={r} className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                r === "STUDENTS" ? "bg-ink" : r === "FOUNDERS" ? "bg-ember" : "bg-ash"
              }`}
            />
            <span className="label-ink">{r}</span>
          </span>
        ))}
      </div>

      {/* selected person card */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-x-4 bottom-4 z-[105] mx-auto max-w-lg border border-line bg-void p-6 text-paper shadow-2xl md:inset-x-auto md:right-8 md:top-24 md:bottom-auto md:max-w-md md:p-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="false"
            aria-label={`${selected.name} profile`}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="label absolute right-4 top-4 text-ash transition-colors hover:text-ember"
              data-cursor="go"
            >
              CLOSE ✕
            </button>
            <p className="label mb-2 text-ember">{selected.role}</p>
            <h3 className="font-display text-3xl text-paper md:text-4xl">
              {selected.name}
            </h3>
            <div className="mt-6 space-y-5">
              <div>
                <p className="label mb-1 text-ash">WHAT ARE YOU BUILDING?</p>
                <p className="text-sm text-paper/85">{selected.building}</p>
              </div>
              <div>
                <p className="label mb-1 text-ash">WHY E-CELL?</p>
                <p className="text-sm text-paper/85">{selected.why}</p>
              </div>
              <div>
                <p className="label mb-1 text-ash">WHAT ARE YOU OBSESSED WITH?</p>
                <p className="text-sm text-paper/85">{selected.obsessed}</p>
              </div>
            </div>
            <p className="label mt-6 text-ash/70">
              SAMPLE PROFILE — REPLACE VIA data/content.ts
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* handoff */}
      <div className="mt-24 text-center md:mt-32">
        <MaskText>
          <p className="font-display text-[clamp(26px,4.5vw,64px)] leading-tight text-ink">
            SOMEONE IS BUILDING WHAT YOU'RE THINKING ABOUT.
          </p>
        </MaskText>
        <Reveal delay={0.2} className="mt-6">
          <p className="label-ink text-ember">FIND THEM. OR BE THEM.</p>
        </Reveal>
      </div>
    </section>
  );
}
