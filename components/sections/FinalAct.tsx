"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import WordFormation from "@/components/intro/WordFormation";
import { SITE } from "@/data/content";
import { Magnetic } from "@/components/core/Motion";
import { scrollToId } from "@/lib/scroll";
import FoundryModal from "@/components/foundry/FoundryModal";

export default function FinalAct() {
  const ref = useRef<HTMLElement>(null);
  const [foundryOpen, setFoundryOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [flashOn, setFlashOn] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setFlashOn(p > 0.3 && p < 0.55);
  });

  const smallO = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.24], [0, 1, 1, 0]);
  const ideaO = useTransform(scrollYProgress, [0.2, 0.28, 0.34, 0.42], [0, 1, 1, 0]);
  const ideaScale = useTransform(scrollYProgress, [0.2, 0.32], [0.9, 1]);
  const askO = useTransform(scrollYProgress, [0.52, 0.62, 0.68, 0.76], [0, 1, 1, 0]);
  const choicesO = useTransform(scrollYProgress, [0.68, 0.8], [0, 1]);
  const footerO = useTransform(scrollYProgress, [0.85, 0.98], [0, 1]);
  const flashOpacity = useTransform(scrollYProgress, [0.3, 0.34, 0.48, 0.52], [0, 1, 1, 0]);

  return (
    <section
      id="start"
      ref={ref}
      className="relative h-[340vh] bg-void text-paper"
      aria-label="Start something"
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        {/* the handoff particle — follows the visitor */}
        <HandoffParticle />

        {/* EVERYTHING STARTS SMALL. */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 text-center"
          style={{ opacity: smallO }}
        >
          <p className="font-display text-[clamp(32px,6vw,96px)] leading-[0.95] text-paper">
            EVERYTHING STARTS{" "}
            <span className="text-stroke-paper">SMALL.</span>
          </p>
        </motion.div>

        {/* the dot returns */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: ideaO }}
        >
          <motion.span
            className="block h-[8px] w-[8px] rounded-full bg-paper"
            style={{ scale: useTransform(scrollYProgress, [0.2, 0.27], [0, 1]) }}
          />
        </motion.div>

        {/* AN IDEA. */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 text-center"
          style={{ opacity: ideaO, scale: ideaScale }}
        >
          <p className="font-display text-[clamp(44px,10vw,160px)] leading-[0.9]">
            AN <span className="text-ember">IDEA.</span>
          </p>
        </motion.div>

        {/* the ecosystem flashes — one last particle formation */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: flashOpacity, pointerEvents: "none" }}
        >
          {flashOn && (
            <WordFormation
              word="E-CELL"
            />
          )}
        </motion.div>

        {/* WHAT WILL YOU START? */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: askO }}
        >
          <p className="font-display text-[clamp(34px,7vw,110px)] leading-[0.9]">
            WHAT WILL YOU{" "}
            <span className="text-ember">START?</span>
          </p>
        </motion.div>

        {/* the three choices */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-6"
          style={{ opacity: choicesO }}
        >
          <div className="flex flex-col items-stretch gap-3 sm:flex-row">
            <Magnetic>
              <button
                type="button"
                onClick={() => setFoundryOpen(true)}
                data-cursor="enter"
                className="border border-ember bg-ember px-7 py-4 shadow-[0_0_25px_rgba(227,30,36,0.5)] transition-all hover:scale-105"
              >
                <span className="label text-paper font-bold">JOIN THE FOUNDRY →</span>
              </button>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollToId("idea-machine")}
                data-cursor="go"
                className="border border-paper/30 px-7 py-4 transition-colors duration-300 hover:border-ember"
              >
                <span className="label text-paper">SUBMIT AN IDEA →</span>
              </button>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollToId("events")}
                data-cursor="enter"
                className="border border-paper/30 px-7 py-4 transition-colors duration-300 hover:border-ember"
              >
                <span className="label text-paper">EXPLORE EVENTS →</span>
              </button>
            </Magnetic>
          </div>
        </motion.div>

        {/* footer lockup */}
        <motion.div
          className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 pb-8"
          style={{ opacity: footerO }}
        >
          <span className="label text-ash">{SITE.university}</span>
          <p className="font-display text-2xl tracking-wide text-paper">E-CELL</p>
          <span className="label text-ember">{SITE.campus}</span>
        </motion.div>
      </div>

      <FoundryModal isOpen={foundryOpen} onClose={() => setFoundryOpen(false)} />
    </section>
  );
}

/* the original particle, handed to the visitor */
function HandoffParticle() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let px = 0.5;
    let py = 0.5;
    let x = 0;
    let y = 0;
    const trail: { x: number; y: number }[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      px = (e.clientX - rect.left) / rect.width;
      py = (e.clientY - rect.top) / rect.height;
    };

    const tick = () => {
      if (!running) return;
      const tx = px * w;
      const ty = py * h;
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      trail.push({ x, y });
      if (trail.length > 26) trail.shift();

      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < trail.length; i++) {
        const t = trail[i];
        const a = (i / trail.length) * 0.5;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 1 + i * 0.12, 0, Math.PI * 2);
        ctx.fillStyle =
          i === trail.length - 1
            ? `rgba(227,30,36,0.95)`
            : `rgba(227,30,36,${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !reduce) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
