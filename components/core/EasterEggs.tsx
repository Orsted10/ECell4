"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sound } from "@/lib/sound";

export default function EasterEggs() {
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const lastKeys = useRef("");
  const lastY = useRef(0);
  const lastT = useRef(0);
  const fastShown = useRef(false);

  useEffect(() => {
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const ch = e.key.toLowerCase();
      if (ch.length !== 1) return;
      lastKeys.current = (lastKeys.current + ch).slice(-5);

      if (lastKeys.current.endsWith("idea")) {
        window.dispatchEvent(
          new CustomEvent("cursor:burst", {
            detail: { x: mouse.x, y: mouse.y },
          })
        );
        sound.complete();
        show("you found the seed. plant it.");
      } else if (lastKeys.current.endsWith("ecell")) {
        show("the secret path. now go build.");
        sound.enter();
      }
    };

    const onScroll = () => {
      const now = performance.now();
      const dt = now - lastT.current;
      if (dt > 0) {
        const v = Math.abs(window.scrollY - lastY.current) / dt;
        if (v > 3.2 && !fastShown.current) {
          fastShown.current = true;
          show("slow down. ideas need time.");
          window.setTimeout(() => {
            fastShown.current = false;
          }, 4000);
        }
      }
      lastY.current = window.scrollY;
      lastT.current = now;
    };

    const show = (text: string) => {
      setToast({ id: Date.now(), text });
      window.setTimeout(() => setToast(null), 2600);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[105] -translate-x-1/2">
      <AnimatePresence>
        {toast && (
          <motion.p
            key={toast.id}
            className="label whitespace-nowrap rounded-full border border-ember/50 bg-void/80 px-5 py-2 text-paper backdrop-blur-sm"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-ember" />
            {toast.text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
