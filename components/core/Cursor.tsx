"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
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
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>(
    []
  );
  const [hidden, setHidden] = useState(true);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const dotX = useSpring(mx, { stiffness: 900, damping: 50, mass: 0.4 });
  const dotY = useSpring(my, { stiffness: 900, damping: 50, mass: 0.4 });
  const ringX = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.7 });
  const ringY = useSpring(my, { stiffness: 260, damping: 28, mass: 0.7 });

  const labelTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!isFinePointer()) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setHidden(false);
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
        if (labelTimer.current) window.clearTimeout(labelTimer.current);
      } else {
        labelTimer.current = window.setTimeout(() => setLabel(null), 60);
      }
    };

    const onBurst = (e: Event) => {
      const ce = e as CustomEvent<{ x: number; y: number }>;
      const id = Date.now() + Math.random();
      setBursts((b) => [...b, { id, x: ce.detail.x, y: ce.detail.y }]);
      window.setTimeout(
        () => setBursts((b) => b.filter((x) => x.id !== id)),
        700
      );
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);
    document.addEventListener("mouseover", over);
    window.addEventListener("cursor:burst", onBurst);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
      document.removeEventListener("mouseover", over);
      window.removeEventListener("cursor:burst", onBurst);
    };
  }, [mx, my]);

  useEffect(() => {
    if (enabled) document.documentElement.classList.add("has-custom-cursor");
    return () =>
      document.documentElement.classList.remove("has-custom-cursor");
  }, [enabled]);

  if (!enabled) return null;

  const expanded = label !== null || pressed;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      {/* dot */}
      <motion.div
        className="fixed left-0 top-0 h-[6px] w-[6px] rounded-full bg-paper mix-blend-difference"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: hidden ? 0 : 1, scale: pressed ? 0.4 : 1 }}
        transition={{ duration: 0.15 }}
      />
      {/* ring / label pill */}
      <motion.div
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border border-paper/50 bg-void/40 backdrop-blur-[2px]"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: expanded ? (label ? 78 : 34) : 34,
          height: expanded ? (label ? 34 : 34) : 34,
          opacity: hidden ? 0 : label ? 1 : 0.55,
          scale: pressed ? 0.85 : 1,
          backgroundColor: label ? "rgba(227,30,36,0.92)" : "rgba(10,10,10,0.4)",
          borderColor: label ? "rgba(227,30,36,1)" : "rgba(242,239,233,0.5)",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        <AnimatePresence mode="popLayout">
          {label && (
            <motion.span
              key={label}
              className="font-mono text-[10px] font-bold tracking-[0.18em] text-paper"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.12 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* burst easter-egg rings */}
      <AnimatePresence>
        {bursts.map((b) => (
          <motion.div
            key={b.id}
            className="fixed h-16 w-16 rounded-full border border-ember"
            style={{ left: b.x, top: b.y, translateX: "-50%", translateY: "-50%" }}
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: 2.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
