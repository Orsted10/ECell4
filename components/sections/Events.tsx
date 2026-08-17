"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { EVENTS } from "@/data/content";
import { MaskText, Reveal } from "@/components/core/Motion";
import { scrollToId } from "@/lib/scroll";

function useCountdown() {
  // SAMPLE countdown: fixed duration from first client load, clearly labelled.
  // Initialized on mount only so SSR and hydration always agree.
  const [ready, setReady] = useState(false);
  const target = useRef(0);
  const [now, setNow] = useState(0);

  useEffect(() => {
    target.current = Date.now() + 13 * 24 * 60 * 60 * 1000;
    setNow(Date.now());
    setReady(true);
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const total = 13 * 24 * 60 * 60 * 1000;
  const elapsed = ready
    ? Math.max(0, Math.min(1, (now - (target.current - total)) / total))
    : 0;
  const msLeft = ready ? Math.max(0, target.current - now) : total;
  const days = Math.floor(msLeft / 86400000);
  const hours = Math.floor((msLeft % 86400000) / 3600000);
  const minutes = Math.floor((msLeft % 3600000) / 60000);
  return { ready, days, hours, minutes, elapsed };
}

export default function Events() {
  const { ready, days, hours, minutes, elapsed } = useCountdown();

  return (
    <section
      id="events"
      className="relative overflow-hidden bg-void px-6 py-28 text-paper md:px-[8vw] md:py-40"
      aria-label="Calendar of possibility"
    >
      <div className="mb-16 flex flex-col justify-between gap-8 md:mb-24 md:flex-row md:items-end">
        <div>
          <p className="label mb-5 text-ember">07 — THE CALENDAR</p>
          <h2 className="font-display text-[clamp(36px,6.5vw,100px)] leading-[0.9]">
            THE CALENDAR OF{" "}
            <span className="text-stroke-paper">POSSIBILITY.</span>
          </h2>
        </div>
        <Reveal className="max-w-sm">
          <p className="text-[15px] leading-relaxed text-paper/60">
            Events are points on one trajectory — not cards on a wall. This
            timeline is live: it will be fed by a real events feed soon.
          </p>
        </Reveal>
      </div>

      {/* the countdown — a temporal object moving toward NOW */}
      <div className="mb-20 border border-line bg-void-2 p-6 md:p-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label mb-3 text-ash">NEXT ON THE TRAJECTORY · SAMPLE COUNTDOWN</p>
            <p className="font-display text-4xl text-paper md:text-6xl">
              FLAGSHIP EVENT{" "}
              <span className="text-ember">(SAMPLE)</span>
            </p>
          </div>
          <div className="flex items-baseline gap-2 font-display text-5xl text-paper md:text-7xl">
            <span className="text-ember">{ready ? days : "--"}</span>
            <span className="label text-ash">DAYS</span>
            <span className="ml-3 text-paper/60">{ready ? String(hours).padStart(2, "0") : "--"}</span>
            <span className="label text-ash">HR</span>
            <span className="text-paper/60">{ready ? String(minutes).padStart(2, "0") : "--"}</span>
            <span className="label text-ash">MIN</span>
          </div>
        </div>

        {/* time as distance: the event moves along the line toward NOW */}
        <div className="mt-12">
          <div className="relative h-[2px] w-full bg-paper/15">
            <span className="label absolute -top-6 left-0 text-ash">NOW</span>
            <span className="label absolute -top-6 right-0 text-ash">THE EVENT</span>
            <motion.div
              className="absolute -top-[7px] h-4 w-4 -translate-x-1/2 rounded-full bg-ember"
              animate={{ left: `${elapsed * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
            >
              <span className="absolute -inset-2 animate-ping rounded-full bg-ember/40" />
            </motion.div>
            {/* travelled distance */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-ember/70"
              animate={{ width: `${elapsed * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>
          <p className="label mt-8 text-ash/60">
            {Math.round(elapsed * 100)}% OF THE WAY THERE · TIME IS MOVING. SO ARE YOU.
          </p>
        </div>
      </div>

      {/* event rows on the trajectory */}
      <div className="border-t border-line">
        {EVENTS.map((ev, i) => (
          <Reveal key={ev.id} delay={i * 0.06} y={18}>
            <div className="group grid items-center gap-3 border-b border-line py-7 transition-colors duration-300 hover:bg-paper/[0.03] md:grid-cols-[180px_1fr_auto_auto] md:gap-8 md:py-8">
              <div>
                <p className="font-display text-xl text-paper">{ev.date}</p>
                <p className="label mt-1 text-ash">{ev.type}</p>
              </div>
              <div>
                <p className="font-display text-[clamp(20px,3vw,40px)] leading-none text-paper transition-transform duration-300 group-hover:translate-x-2">
                  {ev.name}
                </p>
                <p className="label mt-2 text-ash">{ev.location}</p>
              </div>
              <span
                className={`label border px-2.5 py-1 ${
                  ev.status === "UPCOMING"
                    ? "border-ember/50 text-ember"
                    : "border-paper/20 text-ash"
                }`}
              >
                {ev.status}
              </span>
              <button
                type="button"
                onClick={() => scrollToId("start")}
                data-cursor="enter"
                className="label border border-paper/25 px-4 py-2 text-paper transition-colors duration-300 group-hover:border-ember group-hover:bg-ember"
              >
                REGISTER →
              </button>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="label mt-6 text-ash">
        SAMPLE EVENTS — THE REAL CALENDAR ARRIVES VIA data/content.ts OR A CMS.
      </p>

      <div className="mt-24 text-center md:mt-32">
        <MaskText>
          <p className="font-display text-[clamp(26px,4.5vw,64px)] leading-tight text-paper">
            SHOW UP. SOMETHING STARTS AT EVERY EVENT.
          </p>
        </MaskText>
        <Reveal delay={0.2} className="mt-6">
          <p className="label text-ember">ENTER THE CALENDAR →</p>
        </Reveal>
      </div>
    </section>
  );
}
