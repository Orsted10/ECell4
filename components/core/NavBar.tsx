"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/core/Logo";
import MenuOverlay from "@/components/core/MenuOverlay";
import { scrollToTop } from "@/lib/scroll";

export default function NavBar({ ready }: { ready: boolean }) {
  const [open, setOpen] = useState(false);
  const [nearTop, setNearTop] = useState(true);
  const [isDarkBg, setIsDarkBg] = useState(true);
  const isDarkRef = useRef(true);
  const nearTopRef = useRef(true);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nextNearTop = e.clientY < 140;
      if (nearTopRef.current !== nextNearTop) {
        nearTopRef.current = nextNearTop;
        setNearTop(nextNearTop);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let animId: number;

    const checkBgTone = () => {
      const isTop = window.scrollY < 80;
      if (nearTopRef.current !== isTop) {
        nearTopRef.current = isTop;
        setNearTop(isTop);
      }

      // Check all light sections
      const lightElements = document.querySelectorAll(
        "#what-is, #ecosystem, #events, .bg-paper"
      );

      let isOverLight = false;
      for (let i = 0; i < lightElements.length; i++) {
        const rect = lightElements[i].getBoundingClientRect();
        // Generous hysteresis threshold: triggers when light section covers navbar (top <= 50) and leaves only after passing top (bottom >= 40)
        if (rect.top <= 50 && rect.bottom >= 40) {
          isOverLight = true;
          break;
        }
      }

      const nextDark = !isOverLight;
      // Only trigger React re-render when the tone actually flips (zero flicker)
      if (isDarkRef.current !== nextDark) {
        isDarkRef.current = nextDark;
        setIsDarkBg(nextDark);
      }

      animId = requestAnimationFrame(checkBgTone);
    };

    animId = requestAnimationFrame(checkBgTone);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <motion.header
        className="fixed left-0 right-0 top-0 z-[100] flex items-start justify-between px-5 py-4 transition-colors duration-300 md:px-8 md:py-6"
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
          className="group"
          aria-label="E-Cell — back to top. Double-click to replay the intro."
          data-cursor="go"
        >
          <Logo onDark={isDarkBg} />
        </button>

        <button
          type="button"
          onClick={() => setOpen(true)}
          data-cursor="go"
          className="group flex items-center gap-3"
          aria-expanded={open}
          aria-label="Open menu"
        >
          <span
            className={`label font-mono text-xs transition-colors duration-300 ${
              isDarkBg ? "text-paper" : "text-ink font-bold"
            } ${nearTop ? "opacity-100" : "opacity-40 group-hover:opacity-100"}`}
          >
            Menu
          </span>
          <span className="flex h-8 w-8 flex-col items-center justify-center gap-[5px]">
            <span
              className={`block h-[1.5px] w-7 transition-colors duration-300 ${
                isDarkBg ? "bg-paper" : "bg-ink"
              } ${nearTop ? "" : "opacity-40 group-hover:opacity-100"}`}
            />
            <span
              className={`block h-[1.5px] w-4 bg-ember transition-all duration-300 ${
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
