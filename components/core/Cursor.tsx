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

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFinePointer()) return;
    setEnabled(true);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId = 0;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setHidden(false);

      // Instantaneous dot positioning with 0ms lag
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    // Ultra-snappy 120fps ring interpolation loop
    const renderRing = () => {
      // High responsiveness factor (0.35) for crisp, lag-free following
      ringX += (mouseX - ringX) * 0.35;
      ringY += (mouseY - ringY) * 0.35;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(renderRing);
    };
    rafId = requestAnimationFrame(renderRing);

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
      cancelAnimationFrame(rafId);
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

  const expanded = label !== null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      {/* Precision Instant Dot (0ms lag, direct GPU transform) */}
      <div
        ref={dotRef}
        style={{ willChange: "transform" }}
        className={`fixed left-0 top-0 h-[6px] w-[6px] rounded-full bg-paper mix-blend-difference transition-opacity duration-150 ${
          hidden ? "opacity-0" : "opacity-100"
        } ${pressed ? "scale-50" : "scale-100"}`}
      />

      {/* Responsive Follower Ring / Interactive Pill */}
      <div
        ref={ringRef}
        style={{ willChange: "transform" }}
        className={`fixed left-0 top-0 flex items-center justify-center rounded-full border transition-all duration-200 ${
          hidden ? "opacity-0" : "opacity-100"
        } ${
          expanded
            ? "h-9 w-24 border-ember bg-ember/90 shadow-[0_0_20px_rgba(227,30,36,0.5)]"
            : pressed
            ? "h-7 w-7 border-ember bg-ember/30 scale-90"
            : "h-8 w-8 border-paper/40 bg-void/20"
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

