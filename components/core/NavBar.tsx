"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/core/Logo";
import MenuOverlay from "@/components/core/MenuOverlay";
import { scrollToTop } from "@/lib/scroll";
import { SITE } from "@/data/content";

export default function NavBar({ ready }: { ready: boolean }) {
  const [open, setOpen] = useState(false);
  const [nearTop, setNearTop] = useState(true);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setNearTop(e.clientY < 140);
    const onScroll = () => setNearTop(window.scrollY < 80);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <motion.header
        className="fixed left-0 right-0 top-0 z-[100] flex items-start justify-between px-5 py-4 mix-blend-difference pointer-events-none md:px-8 md:py-6"
        initial={{ y: -40, opacity: 0 }}
        animate={{
          y: ready ? 0 : -40,
          opacity: ready ? 1 : 0,
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          type="button"
          onClick={() => scrollToTop()}
          onDoubleClick={() => {
            // hidden interaction: double-clicking the mark replays the intro
            window.dispatchEvent(new CustomEvent("ecell:replay-intro"));
          }}
          className="group pointer-events-auto"
          aria-label="E-Cell — back to top. Double-click to replay the intro."
          data-cursor="go"
        >
          <span className="flex items-center gap-3">
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="absolute h-2.5 w-2.5 rounded-full bg-white transition-transform duration-300 group-hover:scale-125" />
              <span className="absolute h-4 w-4 rounded-full border border-white/20 transition-all duration-300 group-hover:border-white/60" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[22px] tracking-[0.04em] text-white">
                E-CELL
              </span>
              <span className="label mt-1 font-mono text-[10px] text-white/70">
                {SITE.campus}
              </span>
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setOpen(true)}
          data-cursor="go"
          className="group flex items-center gap-3 pointer-events-auto"
          aria-expanded={open}
          aria-label="Open menu"
        >
          <span
            className={`label font-mono text-xs text-white transition-opacity duration-300 ${
              nearTop ? "opacity-100" : "opacity-40 group-hover:opacity-100"
            }`}
          >
            Menu
          </span>
          <span className="flex h-8 w-8 flex-col items-center justify-center gap-[5px]">
            <span
              className={`block h-[1.5px] w-7 bg-white transition-all duration-300 ${
                nearTop ? "" : "opacity-40 group-hover:opacity-100"
              }`}
            />
            <span
              className={`block h-[1.5px] w-4 bg-white transition-all duration-300 ${
                nearTop ? "" : "opacity-70 group-hover:opacity-100"
              }`}
            />
          </span>
        </button>
      </motion.header>

      <AnimatePresence>
        {open && <MenuOverlay onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
