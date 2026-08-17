"use client";

import { useEffect, useRef } from "react";
import { makeScatter, type Particle } from "@/lib/particles";

interface Props {
  className?: string;
  density?: number; // particles per 100k px²
  linkDistance?: number;
  opacity?: number;
  red?: boolean; // keep red signal particles
}

/**
 * The ambient particle field. A constellation of idea particles —
 * mostly quiet, occasionally drawing a faint connection between two
 * points, a few red ones carrying the "possibility becomes action" line.
 */
export default function ParticleField({
  className = "",
  density = 0.6,
  linkDistance = 110,
  opacity = 0.5,
  red = true,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let parts: Particle[] = [];
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(160, Math.floor((w * h * density) / 100000));
      parts = makeScatter(n, w, h, red ? 0.09 : 0);
      if (reduce.current) drawStatic();
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = p.red
          ? `rgba(227,30,36,${opacity})`
          : `rgba(242,239,233,${opacity * 0.6})`;
        ctx.fill();
      }
    };

    const tick = (t: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const time = t / 1000;

      for (const p of parts) {
        p.x += (Math.sin(time * 0.4 + p.seed) * 0.25 + p.vx) * 0.6;
        p.y += (Math.cos(time * 0.35 + p.seed * 1.7) * 0.25 + p.vy) * 0.6;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        // occasionally a particle changes velocity — the "thought" twitch
        if (Math.random() < 0.004) {
          p.vx = (Math.random() - 0.5) * 0.8;
          p.vy = (Math.random() - 0.5) * 0.8;
        }
        p.vx *= 0.98;
        p.vy *= 0.98;
      }

      // connections — the network forming
      ctx.lineWidth = 0.5;
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i];
        for (let j = i + 1; j < parts.length; j++) {
          const b = parts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDistance * linkDistance) {
            const alpha = (1 - Math.sqrt(d2) / linkDistance) * 0.16 * opacity;
            ctx.strokeStyle = `rgba(242,239,233,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of parts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.red
          ? `rgba(227,30,36,${opacity * 1.4})`
          : `rgba(242,239,233,${opacity * 0.55})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!running) {
            running = true;
            raf = requestAnimationFrame(tick);
          }
        } else {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "80px" }
    );

    resize();
    io.observe(canvas);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [density, linkDistance, opacity, red]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
