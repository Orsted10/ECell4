"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/core/Logo";
import MenuOverlay from "@/components/core/MenuOverlay";
import { scrollToTop } from "@/lib/scroll";

export default function NavBar({ ready }: { ready: boolean }) {
  const [open, setOpen] = useState(false);
  const [nearTop, setNearTop] = useState(true);
  const [isDarkBg, setIsDarkBg] = useState(true);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setNearTop(e.clientY < 140);
    window.addEventListener("mousemove", onMove, { passive: true });

    // Dynamic contrast detection: check background tone beneath the navbar
    const checkBgTone = () => {
      setNearTop(window.scrollY < 80);

      // Check all light sections by bounding box
      const lightSections = document.querySelectorAll(".bg-paper, #what-is, #ecosystem, #events");
      let overLight = false;

      lightSections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        // If the top 60px of the screen intersects this light section
        if (rect.top <= 60 && rect.bottom >= 20) {
          overLight = true;
        }
      });

      setIsDarkBg(!overLight);
    };

    window.addEventListener("scroll", checkBgTone, { passive: true });
    window.addEventListener("resize", checkBgTone);
    checkBgTone();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", checkBgTone);
      window.removeEventListener("resize", checkBgTone);
    };
  }, []);

  return (
    <>
      <motion.header
        className="fixed left-0 right-0 top-0 z-[100] flex items-start justify-between px-5 py-4 transition-colors duration-500 md:px-8 md:py-6"
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
            className={`label font-mono text-xs transition-all duration-300 ${
              isDarkBg ? "text-paper" : "text-ink"
            } ${nearTop ? "opacity-100" : "opacity-40 group-hover:opacity-100"}`}
          >
            Menu
          </span>
          <span className="flex h-8 w-8 flex-col items-center justify-center gap-[5px]">
            <span
              className={`block h-[1.5px] w-7 transition-all duration-300 ${
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
