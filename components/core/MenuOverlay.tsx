"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { NAV_SECTIONS, SITE } from "@/data/content";
import { scrollToId, startScroll, stopScroll } from "@/lib/scroll";
import { sound } from "@/lib/sound";
import Logo from "@/components/core/Logo";

export default function MenuOverlay({ onClose }: { onClose: () => void }) {
  const [soundOn, setSoundOn] = useState(sound.isOn());

  const go = (id: string) => {
    onClose();
    window.setTimeout(() => scrollToId(id), 120);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[115] flex flex-col bg-void text-paper"
      initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
      exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onAnimationStart={() => stopScroll()}
      onAnimationComplete={() => startScroll()}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <div className="flex items-start justify-between px-5 py-4 md:px-8 md:py-6">
        <button type="button" onClick={onClose} className="group" aria-label="Close menu" data-cursor="go">
          <Logo />
        </button>
        <button
          type="button"
          onClick={onClose}
          data-cursor="go"
          className="label flex items-center gap-3 text-paper"
        >
          Close
          <span className="relative block h-8 w-8">
            <span className="absolute left-1/2 top-1/2 h-[1.5px] w-7 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-paper" />
            <span className="absolute left-1/2 top-1/2 h-[1.5px] w-7 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-ember" />
          </span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-5 py-4 md:px-8" aria-label="Sections">
        <ul>
          {NAV_SECTIONS.map((s, i) => (
            <li key={s.id} className="border-t border-line">
              <motion.button
                type="button"
                onClick={() => go(s.id)}
                data-cursor="go"
                className="group flex w-full items-baseline gap-4 py-3 text-left md:gap-8 md:py-4"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="label w-8 shrink-0 text-ember">{s.n}</span>
                <span className="font-display text-3xl tracking-wide text-paper transition-all duration-300 group-hover:translate-x-2 group-hover:text-ember md:text-5xl">
                  {s.label}
                </span>
              </motion.button>
            </li>
          ))}
        </ul>
      </nav>

      <motion.footer
        className="border-t border-line px-5 py-6 md:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setSoundOn(sound.toggle())}
            data-cursor="go"
            className="label flex items-center gap-2 text-paper"
            aria-pressed={soundOn}
          >
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                soundOn ? "bg-ember" : "bg-ash"
              }`}
            />
            SOUND {soundOn ? "ON" : "OFF"}
          </button>
          <div className="flex flex-wrap gap-5">
            {SITE.socials.map((s) => (
              <span key={s.label} className="label text-ash">
                {s.label} ↗
              </span>
            ))}
          </div>
          <span className="label text-ash">{SITE.university} · {SITE.campus}</span>
        </div>
      </motion.footer>
    </motion.div>
  );
}
