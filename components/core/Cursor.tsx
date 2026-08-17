"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { isFinePointer } from "@/lib/utils";

const LABELS: Record<string, string> = {
  view: "VIEW",
  meet: "MEET",
  enter: "ENTER",
  read: "READ",
  go: "GO",
  drag: "DRAG",
  explore: "EXPLORE",
  play: "PLAY",
};

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);
  const [hidden, setHidden] = useState(true);

  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFinePointer()) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      setHidden(false);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setHidden(true);
    const enter = () => setHidden(false);

    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement | null)?.closest?.("[data-cursor]");
      const val = t?.getAttribute("data-cursor");
      if (val && LABELS[val]) {
        setLabel(LABELS[val]);
      } else {
        setLabel(null);
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);
    document.addEventListener("mouseover", over);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
      document.removeEventListener("mouseover", over);
    };
  }, []);

  useEffect(() => {
    if (enabled) document.documentElement.classList.add("has-custom-cursor");
    return () =>
      document.documentElement.classList.remove("has-custom-cursor");
  }, [enabled]);

  if (!enabled) return null;

  const isInteractive = label !== null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      <div
        ref={cursorRef}
        style={{ willChange: "transform" }}
        className={`fixed left-0 top-0 flex items-center justify-center rounded-full transition-[width,height,background-color,border-color,opacity] duration-150 ease-out ${
          hidden ? "opacity-0" : "opacity-100"
        } ${
          isInteractive
            ? "h-9 w-24 border border-ember bg-ember/90 shadow-[0_0_20px_rgba(227,30,36,0.5)]"
            : pressed
            ? "h-2 w-2 bg-ember"
            : "h-[8px] w-[8px] bg-paper mix-blend-difference"
        }`}
      >
        <AnimatePresence mode="popLayout">
          {label && (
            <motion.span
              key={label}
              className="font-mono text-[10px] font-bold tracking-[0.18em] text-paper select-none"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.1 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

