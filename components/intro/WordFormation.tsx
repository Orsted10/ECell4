"use client";

import { useEffect, useRef } from "react";
import { type Particle } from "@/lib/particles";
import { clamp } from "@/lib/utils";

type Phase = "idle" | "scatter" | "converge" | "hold" | "dissolve";

interface EnhancedParticle extends Particle {
  originX: number;
  originY: number;
  depth: number;
  sparkleSpeed: number;
  glow: number;
  angle: number;
  speed: number;
  orbitRadius: number;
  trail: { x: number; y: number }[];
}

interface Props {
  word: string;
  /** called once when the word has fully assembled */
  onFormed?: () => void;
  /** called once after dissolve completes (or after hold when final) */
  onGone?: () => void;
  redRatio?: number;
  className?: string;
  quality?: number;
  size?: number;
  nonce?: number;
}

const CONVERGE_MS = 1800;
const HOLD_MS = 850;
const DISSOLVE_MS = 600;

export default function WordFormation({
  word,
  onFormed,
  onGone,
  redRatio = 0.12,
  className = "",
  quality = 1.2,
  size = 0.76,
  nonce = 0,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cb = useRef({ onFormed, onGone });
  cb.current = { onFormed, onGone };

  const engine = useRef<{
    phase: Phase;
    word: string;
    particles: EnhancedParticle[];
    formed: boolean;
    phaseStart: number;
    mouse: { x: number; y: number; px: number; py: number; active: boolean };
    ripples: { x: number; y: number; r: number; maxR: number; alpha: number; color: string }[];
  }>({
    phase: "idle",
    word: "",
    particles: [],
    formed: false,
    phaseStart: 0,
    mouse: { x: 0.5, y: 0.5, px: 0, py: 0, active: false },
    ripples: [],
  });

  // sample and create god-tier particle cloud
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !word) return;
    const st = engine.current;
    st.word = word;
    st.formed = false;
    st.phase = "converge";
    st.phaseStart = performance.now();

    const run = async () => {
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

      const fontStr = fitFontLocal(ctx, word, w * size);
      const gap = Math.max(2, Math.floor(3 / quality));
      const targets = sampleWordPointsDetailed(word, fontStr, w, h, gap);

      const cx = w / 2;
      const cy = h / 2;

      // Add a shockwave burst on new word formation
      st.ripples.push({
        x: cx,
        y: cy,
        r: 10,
        maxR: Math.max(w, h) * 0.7,
        alpha: 0.8,
        color: "#e31e24",
      });

      const particles: EnhancedParticle[] = targets.map((t, i) => {
        // dynamic initial explosion burst positions
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (Math.max(w, h) * 0.6) + 40;
        const startX = cx + Math.cos(angle) * dist;
        const startY = cy + Math.sin(angle) * dist;
        const isRed = Math.random() < redRatio;

        return {
          x: startX,
          y: startY,
          originX: startX,
          originY: startY,
          homeX: startX,
          homeY: startY,
          tx: t.x,
          ty: t.y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          r: isRed ? (Math.random() * 1.6 + 1.2) : (Math.random() * 1.4 + 0.9),
          red: isRed,
          seed: Math.random() * Math.PI * 2,
          depth: Math.random() * 0.8 + 0.6,
          sparkleSpeed: Math.random() * 0.006 + 0.003,
          glow: isRed ? Math.random() * 15 + 8 : Math.random() * 6 + 2,
          angle: angle,
          speed: Math.random() * 0.04 + 0.02,
          orbitRadius: Math.random() * 4 + 1,
          trail: [],
        };
      });

      st.particles = particles;
    };

    void run();
  }, [word, quality, size, redRatio, nonce]);

  // Main rendering engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const st = engine.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      const draw = () => {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        for (const p of st.particles) {
          ctx.fillStyle = p.red ? "#e31e24" : "rgba(242,239,233,0.95)";
          ctx.fillRect(p.tx, p.ty, p.r * 1.5, p.r * 1.5);
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
      st.mouse.px = e.clientX - rect.left;
      st.mouse.py = e.clientY - rect.top;
      st.mouse.active = true;
    };

    const onMouseLeave = () => {
      st.mouse.active = false;
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });

    const tick = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // Dark futuristic trail clear
      ctx.clearRect(0, 0, w, h);

      const phase = st.phase;
      const elapsed = now - st.phaseStart;

      // Cursor 3D dynamic tilt & parallax
      const mouseX = st.mouse.px || w / 2;
      const mouseY = st.mouse.py || h / 2;
      const px = (st.mouse.x - 0.5) * 35;
      const py = (st.mouse.y - 0.5) * 22;

      // Update shockwaves/ripples
      for (let i = st.ripples.length - 1; i >= 0; i--) {
        const rip = st.ripples[i];
        rip.r += 14;
        rip.alpha *= 0.94;
        if (rip.alpha < 0.01 || rip.r > rip.maxR) {
          st.ripples.splice(i, 1);
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(227, 30, 36, ${rip.alpha * 0.4})`;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        }
      }

      // Main Particle Physics Update
      switch (phase) {
        case "converge": {
          const t = Math.min(1, elapsed / CONVERGE_MS);
          // High-energy magnetic snap easing
          const easeProgress = 1 - Math.pow(1 - t, 4);
          let maxDist = 0;

          for (const p of st.particles) {
            // Harmonic floating micro-vibration
            const waveX = Math.sin(now * p.sparkleSpeed + p.seed) * (1 - easeProgress) * 20;
            const waveY = Math.cos(now * p.sparkleSpeed + p.seed * 1.5) * (1 - easeProgress) * 20;

            const targetX = p.tx + px * p.depth + waveX;
            const targetY = p.ty + py * p.depth + waveY;

            // Interactive mouse magnetic repulsion / push away
            let repulseX = 0;
            let repulseY = 0;
            if (st.mouse.active) {
              const dx = p.x - mouseX;
              const dy = p.y - mouseY;
              const d2 = dx * dx + dy * dy;
              if (d2 < 12000 && d2 > 1) {
                const force = (1 - d2 / 12000) * 25;
                const angle = Math.atan2(dy, dx);
                repulseX = Math.cos(angle) * force;
                repulseY = Math.sin(angle) * force;
              }
            }

            // High precision spring interpolation
            p.vx = (p.vx + (targetX + repulseX - p.x) * 0.12) * 0.82;
            p.vy = (p.vy + (targetY + repulseY - p.y) * 0.12) * 0.82;
            p.x += p.vx;
            p.y += p.vy;

            const d = Math.abs(targetX - p.x) + Math.abs(targetY - p.y);
            if (d > maxDist) maxDist = d;
          }

          if ((t >= 1 && maxDist < 4) || elapsed > CONVERGE_MS + 400) {
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
          for (const p of st.particles) {
            // Alive quantum breathing & floating effect
            const breathe = Math.sin(now * 0.003 + p.seed) * 1.8;
            const targetX = p.tx + px * p.depth + Math.sin(now * 0.002 + p.seed) * 0.8;
            const targetY = p.ty + py * p.depth + breathe;

            // Interactive Mouse shockwave field on hover
            let repulseX = 0;
            let repulseY = 0;
            if (st.mouse.active) {
              const dx = p.x - mouseX;
              const dy = p.y - mouseY;
              const dist = Math.hypot(dx, dy);
              if (dist < 110) {
                const force = (1 - dist / 110) * 40;
                repulseX = (dx / dist) * force;
                repulseY = (dy / dist) * force;
              }
            }

            p.vx = (p.vx + (targetX + repulseX - p.x) * 0.14) * 0.84;
            p.vy = (p.vy + (targetY + repulseY - p.y) * 0.14) * 0.84;
            p.x += p.vx;
            p.y += p.vy;
          }

          if (elapsed > HOLD_MS) {
            st.phase = "dissolve";
            st.phaseStart = now;

            // Centroid explosion blast
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
              const speed = (Math.random() * 8 + 4) * (p.red ? 1.4 : 1.0);
              const spread = (Math.random() - 0.5) * 1.5;
              p.vx = (dx / len) * speed + spread;
              p.vy = (dy / len) * speed + (Math.random() - 0.5) * 2;
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
          for (const p of st.particles) {
            p.x += Math.sin(now * 0.001 + p.seed) * 0.8 + p.vx * 0.4;
            p.y += Math.cos(now * 0.0012 + p.seed * 2) * 0.8 + p.vy * 0.4;
            p.vx *= 0.98;
            p.vy *= 0.98;
          }
          break;
        }
        default:
          break;
      }

      // Calculate global alpha & luminescence
      const alpha =
        phase === "converge"
          ? 0.4 + 0.6 * Math.min(1, elapsed / 500)
          : phase === "hold"
            ? 1
            : phase === "dissolve"
              ? Math.max(0, 1 - Math.min(1, elapsed / DISSOLVE_MS) * 0.9)
              : 0.25;

      // ── GOD TIER RENDER PASS ──────────────────────────────────────────
      // Pass 1: Draw high-tech cyber glow underlays for Red & Core Signal particles
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      // Render red signal embers with intense fiery corona
      for (const p of st.particles) {
        if (p.x < -40 || p.x > w + 40 || p.y < -40 || p.y > h + 40) continue;
        if (p.red) {
          const pulse = (Math.sin(now * 0.006 + p.seed) + 1) * 0.5;
          const glowSize = (p.r * 6 + pulse * 6);
          const glowGrad = ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, glowSize
          );
          glowGrad.addColorStop(0, `rgba(255, 45, 55, ${0.85 * alpha})`);
          glowGrad.addColorStop(0.4, `rgba(227, 30, 36, ${0.45 * alpha})`);
          glowGrad.addColorStop(1, "rgba(227, 30, 36, 0)");

          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // Pass 2: Draw crisp particle gems with subtle edge-rounding and crystalline glow
      for (const p of st.particles) {
        if (p.x < -30 || p.x > w + 30 || p.y < -30 || p.y > h + 30) continue;

        const pulse = Math.sin(now * 0.004 + p.seed);
        const sizeMultiplier = p.red ? (1.3 + pulse * 0.2) : (1.0 + pulse * 0.1);
        const radius = p.r * 1.5 * sizeMultiplier;

        if (p.red) {
          // Vivid Crimson Core with Hot White Center
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 0.55, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(227, 30, 36, ${alpha * 0.95})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Sharp Diamond Paper White with High Luminance
          const opacity = Math.min(1, alpha * (0.85 + (p.depth - 0.6) * 0.25));
          ctx.fillStyle = `rgba(245, 243, 238, ${opacity})`;
          
          // Modern diamond/square tech pixel glyph
          ctx.fillRect(
            p.x - radius * 0.7,
            p.y - radius * 0.7,
            radius * 1.4,
            radius * 1.4
          );
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div className={`relative h-full w-full ${className}`}>
      {/* Background ambient red neon bloom glow */}
      <div 
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        <div className="h-[450px] w-[750px] rounded-full bg-gradient-to-tr from-ember/15 via-ember/5 to-transparent blur-[120px] animate-pulse" />
        <div className="absolute h-[320px] w-[500px] rounded-full bg-white/5 blur-[90px]" />
      </div>

      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-auto absolute inset-0 h-full w-full"
      />
    </div>
  );
}

/** High resolution sampling for crisp, high-density letterforms */
function sampleWordPointsDetailed(
  word: string,
  font: string,
  width: number,
  height: number,
  gap = 2
): { x: number; y: number }[] {
  const c = document.createElement("canvas");
  c.width = Math.max(2, Math.floor(width));
  c.height = Math.max(2, Math.floor(height));
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = font;
  ctx.fillText(word, c.width / 2, c.height / 2);

  const imgData = ctx.getImageData(0, 0, c.width, c.height).data;
  const pts: { x: number; y: number }[] = [];

  for (let y = 0; y < c.height; y += gap) {
    for (let x = 0; x < c.width; x += gap) {
      const idx = (y * c.width + x) * 4;
      const alpha = imgData[idx + 3];
      if (alpha > 90) {
        // slight jitter to remove harsh grid artifacts and create organic liquid look
        pts.push({
          x: x + (Math.random() - 0.5) * 0.8,
          y: y + (Math.random() - 0.5) * 0.8,
        });
      }
    }
  }

  // Optimize particle count for silky smooth 60-120fps
  const MAX = 6500;
  if (pts.length > MAX) {
    const step = pts.length / MAX;
    const filtered: { x: number; y: number }[] = [];
    for (let i = 0; i < pts.length; i += step) {
      filtered.push(pts[Math.floor(i)]);
    }
    return filtered;
  }

  return pts;
}

function fitFontLocal(
  ctx: CanvasRenderingContext2D,
  word: string,
  width: number
): string {
  let size = 340;
  ctx.font = `900 ${size}px "Anton", "Archivo Black", "Arial Narrow", sans-serif`;
  const w = ctx.measureText(word).width;
  const scale = width / (w || 1);
  size = Math.max(48, Math.floor(size * scale));
  return `900 ${size}px "Anton", "Archivo Black", "Arial Narrow", sans-serif`;
}

