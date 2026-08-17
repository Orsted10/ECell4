"use client";

import { useEffect, useRef } from "react";
import { makeScatter, sampleWordPoints, type Particle } from "@/lib/particles";
import { clamp } from "@/lib/utils";

type Phase = "idle" | "scatter" | "converge" | "hold" | "dissolve";

interface Props {
  word: string;
  /** called once when the word has fully assembled */
  onFormed?: () => void;
  /** called once after dissolve completes (or after hold when final) */
  onGone?: () => void;
  redRatio?: number;
  className?: string;
  /** 0..1 — pixel density of the glyph sampling */
  quality?: number;
  /** fraction of viewport width the word should occupy */
  size?: number;
  /** increments force a re-run even if `word` is unchanged */
  nonce?: number;
}

const CONVERGE_MS = 1750;
const HOLD_MS = 750;
const DISSOLVE_MS = 550;

export default function WordFormation({
  word,
  onFormed,
  onGone,
  redRatio = 0.08,
  className = "",
  quality = 1,
  size = 0.72,
  nonce = 0,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cb = useRef({ onFormed, onGone });
  cb.current = { onFormed, onGone };

  const engine = useRef<{
    phase: Phase;
    word: string;
    particles: Particle[];
    formed: boolean;
    phaseStart: number;
    mouse: { x: number; y: number };
  }>({
    phase: "idle",
    word: "",
    particles: [],
    formed: false,
    phaseStart: 0,
    mouse: { x: 0.5, y: 0.5 },
  });

  // run the requested word through its lifecycle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !word) return;
    const st = engine.current;
    st.word = word;
    st.formed = false;
    st.phase = "converge";
    st.phaseStart = performance.now();

    const run = async () => {
      // make sure the display font is available before sampling glyphs
      try {
        await document.fonts.ready;
      } catch {
        /* proceed anyway */
      }

      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const gap = Math.max(2, 3 / quality);
      let targets = sampleWordPoints(
        word,
        fitFontLocal(ctx, word, w * size),
        w,
        h,
        gap
      );

      // cap the count for performance
      const MAX = 5200;
      if (targets.length > MAX) {
        const step = Math.ceil(targets.length / MAX);
        targets = targets.filter((_, i) => i % step === 0);
      }

      // the dot explodes into particles: bias scatter near the center
      const particles = makeScatter(targets.length, w, h, redRatio);
      const cx = w / 2;
      const cy = h / 2;
      for (const p of particles) {
        if (Math.random() < 0.55) {
          p.x = cx + (Math.random() - 0.5) * w * 0.2;
          p.y = cy + (Math.random() - 0.5) * h * 0.2;
        }
        p.homeX = p.x;
        p.homeY = p.y;
        p.r = p.r * (0.8 + quality * 0.7);
      }

      targets.forEach((t, i) => {
        particles[i].tx = t.x;
        particles[i].ty = t.y;
      });

      st.particles = particles;
    };

    void run();
  }, [word, quality, size, redRatio, nonce]);

  // main loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const st = engine.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      // static assembled word, no motion
      const draw = () => {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        for (const p of st.particles) {
          ctx.fillStyle = p.red ? "#e31e24" : "rgba(242,239,233,0.9)";
          ctx.fillRect(p.x, p.y, p.r * 1.6, p.r * 1.6);
        }
      };
      draw();
      return;
    }

    let raf = 0;
    let last = performance.now();
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      st.mouse.x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      st.mouse.y = clamp((e.clientY - rect.top) / rect.height, 0, 1);
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const tick = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const phase = st.phase;
      const elapsed = now - st.phaseStart;

      // cursor parallax — the word leans toward the visitor
      const px = (st.mouse.x - 0.5) * 22;
      const py = (st.mouse.y - 0.5) * 14;

      switch (phase) {
        case "converge": {
          const t = Math.min(1, elapsed / CONVERGE_MS);
          const e = 1 - Math.pow(1 - t, 3);
          let maxDist = 0;
          for (const p of st.particles) {
            const tx = p.tx + px * e;
            const ty = p.ty + py * e;
            p.x += (tx - p.x) * 0.085;
            p.y += (ty - p.y) * 0.085;
            const d = Math.abs(tx - p.x) + Math.abs(ty - p.y);
            if (d > maxDist) maxDist = d;
          }
          if ((t >= 1 && maxDist < 3) || elapsed > CONVERGE_MS + 500) {
            st.phase = "hold";
            st.phaseStart = now;
            if (!st.formed) {
              st.formed = true;
              cb.current.onFormed?.();
            }
          }
          break;
        }
        case "hold": {
          if (elapsed > HOLD_MS) {
            st.phase = "dissolve";
            st.phaseStart = now;
            // give every particle an outward kick from the glyph centroid
            let cx = 0;
            let cy = 0;
            for (const p of st.particles) {
              cx += p.tx;
              cy += p.ty;
            }
            cx /= st.particles.length || 1;
            cy /= st.particles.length || 1;
            for (const p of st.particles) {
              const dx = p.tx - cx;
              const dy = p.ty - cy;
              const len = Math.hypot(dx, dy) || 1;
              p.vx = (dx / len) * (3 + Math.random() * 4);
              p.vy = (dy / len) * (3 + Math.random() * 4) - 1;
            }
          }
          break;
        }
        case "dissolve": {
          const t = Math.min(1, elapsed / DISSOLVE_MS);
          for (const p of st.particles) {
            p.vx *= 0.96;
            p.vy *= 0.96;
            p.x += p.vx;
            p.y += p.vy;
          }
          if (t >= 1) {
            st.phase = "scatter";
            st.phaseStart = now;
            cb.current.onGone?.();
          }
          break;
        }
        case "scatter": {
          // idle drift between words
          for (const p of st.particles) {
            p.x += (Math.sin(now * 0.001 + p.seed) * 0.3 + p.vx) * 0.4;
            p.y += (Math.cos(now * 0.0012 + p.seed * 2) * 0.3 + p.vy) * 0.4;
            p.vx *= 0.97;
            p.vy *= 0.97;
          }
          break;
        }
        default:
          break;
      }

      // draw
      const alpha =
        phase === "converge"
          ? 0.55 + 0.4 * Math.min(1, elapsed / 600)
          : phase === "hold"
            ? 1
            : phase === "dissolve"
              ? 1 - Math.min(1, elapsed / DISSOLVE_MS) * 0.6
              : 0.35;

      for (const p of st.particles) {
        if (p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) continue;
        ctx.fillStyle = p.red
          ? `rgba(227,30,36,${alpha})`
          : `rgba(242,239,233,${alpha * 0.92})`;
        const s = p.r * 1.7;
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

function fitFontLocal(
  ctx: CanvasRenderingContext2D,
  word: string,
  width: number
): string {
  let size = 320;
  ctx.font = `${size}px "Anton", "Arial Narrow", sans-serif`;
  const w = ctx.measureText(word).width;
  const scale = width / (w || 1);
  size = Math.max(40, Math.floor(size * scale));
  return `${size}px "Anton", "Arial Narrow", sans-serif`;
}
