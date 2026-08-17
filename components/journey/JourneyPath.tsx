"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { JOURNEY_STAGES } from "@/data/content";

interface Props {
  progress: MotionValue<number>;
  count: number;
}

export interface PathNode {
  x: number;
  y: number;
  bx: number;
  by: number;
  side: number;
  label: string;
  stageNum: string;
}

export function computeNodes(w: number, h: number, count: number): PathNode[] {
  const nodes: PathNode[] = [];
  // Ensure comfortable margins so nodes 01 through 10 never clip edges
  const top = h * 0.18;
  const bottom = h * 0.84;
  const cx = w / 2;
  const amp = Math.min(w * 0.18, 190);

  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1);
    const y = top + (bottom - top) * t;
    // Harmonious zig-zag wave within safe horizontal bounds
    const angle = i * 0.95 + 0.35;
    const x = cx + Math.sin(angle) * amp;
    const dir = Math.sin(angle) > 0 ? 1 : -1;
    const stage = JOURNEY_STAGES[i] || { n: String(i + 1).padStart(2, "0"), title: `STAGE ${i + 1}` };

    nodes.push({
      x,
      y,
      bx: x + dir * Math.min(w * 0.12, 85),
      by: y + (i % 2 === 0 ? -1 : 1) * Math.min(h * 0.035, 24),
      side: dir,
      label: stage.title,
      stageNum: stage.n,
    });
  }
  return nodes;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  life: number;
  maxLife: number;
  size: number;
}

/**
 * Enhanced star-chart trajectory with glowing laser paths,
 * radar reticles, telemetry badges, and live particle sparks.
 */
export default function JourneyPath({ progress, count }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<PathNode[]>([]);
  const pRef = useRef(0);
  const targetPRef = useRef(0);
  const sparksRef = useRef<Spark[]>([]);
  const rafRef = useRef<number>(0);

  // Update target progress on scroll
  useMotionValueEvent(progress, "change", (v) => {
    targetPRef.current = Math.max(0, Math.min(1, v));
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodesRef.current = computeNodes(width, height, count);
    };

    resize();
    window.addEventListener("resize", resize);

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth progress interpolation
      pRef.current += (targetPRef.current - pRef.current) * 0.15;
      const p = pRef.current;

      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      if (nodes.length === 0) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      const cx = width / 2;
      const originY = height * 0.08;

      // Full points list including entry origin dot as index 0
      const allPoints = [{ x: cx, y: originY, bx: cx, by: originY, side: 0, label: "ORIGIN", stageNum: "00" }, ...nodes];
      const totalSegs = allPoints.length - 1;
      const travelled = p * totalSegs;
      const currentIdx = Math.min(totalSegs, Math.floor(travelled));
      const currentFrac = travelled - currentIdx;

      // Calculate current head position starting right from origin dot
      let hx = allPoints[0].x;
      let hy = allPoints[0].y;
      if (currentIdx < totalSegs) {
        const a = allPoints[currentIdx];
        const b = allPoints[currentIdx + 1];
        hx = a.x + (b.x - a.x) * currentFrac;
        hy = a.y + (b.y - a.y) * currentFrac;
      } else {
        const last = allPoints[allPoints.length - 1];
        hx = last.x;
        hy = last.y;
      }

      // Spawn sparks at the active head
      if (Math.random() < 0.6) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 10 + Math.random() * 25;
        sparksRef.current.push({
          x: hx,
          y: hy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          life: 0,
          maxLife: 0.4 + Math.random() * 0.5,
          size: 1 + Math.random() * 2,
        });
      }

      // ── 1. CELESTIAL BACKGROUND CONSTELLATION FIELD & RADAR GRIDS ──
      ctx.save();
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 45, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(242,239,233,0.04)";
        ctx.setLineDash([2, 6]);
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(n.x, n.y, 85, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(227,30,36,0.03)";
        ctx.setLineDash([1, 10]);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(n.x - 6, n.y);
        ctx.lineTo(n.x + 6, n.y);
        ctx.moveTo(n.x, n.y - 6);
        ctx.lineTo(n.x, n.y + 6);
        ctx.strokeStyle = "rgba(242,239,233,0.12)";
        ctx.setLineDash([]);
        ctx.stroke();
      });
      ctx.restore();

      // ── 2. BASE TRAJECTORY (FAINT BLUEPRINT LINE) ──
      ctx.save();
      ctx.beginPath();
      allPoints.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = "rgba(242,239,233,0.14)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Entry origin beacon dot
      ctx.beginPath();
      ctx.arc(cx, originY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = currentIdx === 0 ? "rgba(227,30,36,0.9)" : "rgba(242,239,233,0.5)";
      ctx.fill();

      // Secondary parallel dashed grid rail
      ctx.beginPath();
      allPoints.forEach((pt, i) => {
        const ox = (pt.side || 1) * 6;
        if (i === 0) ctx.moveTo(pt.x + ox, pt.y);
        else ctx.lineTo(pt.x + ox, pt.y);
      });
      ctx.strokeStyle = "rgba(242,239,233,0.04)";
      ctx.setLineDash([4, 8]);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // ── 3. ACTIVE GLOWING TRAVELLED PATH (MULTI-PASS GLOW) ──
      if (travelled > 0.001) {
        ctx.save();

        // Pass A: Wide Soft Bloom
        ctx.beginPath();
        allPoints.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else if (i <= currentIdx) ctx.lineTo(pt.x, pt.y);
        });
        if (currentIdx < totalSegs) {
          ctx.lineTo(hx, hy);
        }
        ctx.strokeStyle = "rgba(227,30,36,0.25)";
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.stroke();

        // Pass B: Medium Inner Glow
        ctx.lineWidth = 4.5;
        ctx.strokeStyle = "rgba(227,30,36,0.75)";
        ctx.stroke();

        // Pass C: Bright Core Laser
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(255,245,240,0.98)";
        ctx.stroke();

        ctx.restore();

        // ── Traveling Electric Pulse Packet ──
        const pulseT = (now / 2200) % 1;
        const pulseTravel = pulseT * travelled;
        const pulseIdx = Math.floor(pulseTravel);
        const pulseFrac = pulseTravel - pulseIdx;
        if (pulseIdx < totalSegs) {
          const pa = nodes[pulseIdx];
          const pb = nodes[pulseIdx + 1];
          const px = pa.x + (pb.x - pa.x) * pulseFrac;
          const py = pa.y + (pb.y - pa.y) * pulseFrac;

          ctx.save();
          const pulseGrad = ctx.createRadialGradient(px, py, 0, px, py, 14);
          pulseGrad.addColorStop(0, "rgba(255,255,255,1)");
          pulseGrad.addColorStop(0.35, "rgba(227,30,36,0.85)");
          pulseGrad.addColorStop(1, "rgba(227,30,36,0)");
          ctx.fillStyle = pulseGrad;
          ctx.beginPath();
          ctx.arc(px, py, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // ── 4. DRAW ALL NODES & BRANCH TELEMETRY ──
      nodes.forEach((n, i) => {
        const passed = i <= currentIdx;
        const isActive = i === currentIdx;
        const isFuture = i > currentIdx;

        // Branch Line
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(n.bx, n.by);
        if (isActive) {
          ctx.strokeStyle = "rgba(227,30,36,0.95)";
          ctx.lineWidth = 2;
        } else if (passed) {
          ctx.strokeStyle = "rgba(242,239,233,0.45)";
          ctx.lineWidth = 1.2;
        } else {
          ctx.strokeStyle = "rgba(242,239,233,0.12)";
          ctx.lineWidth = 1;
        }
        ctx.stroke();

        // Branch End Beacon / Satellite Data Pod
        if (isActive) {
          // Glowing branch end ring & core
          const bGlow = ctx.createRadialGradient(n.bx, n.by, 0, n.bx, n.by, 10);
          bGlow.addColorStop(0, "rgba(227,30,36,1)");
          bGlow.addColorStop(1, "rgba(227,30,36,0)");
          ctx.fillStyle = bGlow;
          ctx.beginPath();
          ctx.arc(n.bx, n.by, 10, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#e31e24";
          ctx.beginPath();
          ctx.arc(n.bx, n.by, 3.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = passed ? "rgba(242,239,233,0.7)" : "rgba(242,239,233,0.25)";
          ctx.beginPath();
          ctx.arc(n.bx, n.by, passed ? 2.5 : 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Branch Micro Telemetry Label
        ctx.font = "9px 'Space Mono', monospace";
        ctx.textBaseline = "middle";
        const textX = n.side > 0 ? n.bx + 8 : n.bx - 8;
        ctx.textAlign = n.side > 0 ? "left" : "right";

        if (isActive) {
          ctx.fillStyle = "rgba(227,30,36,1)";
          ctx.fillText(`[${n.stageNum}] ${n.label}`, textX, n.by);
        } else if (passed) {
          ctx.fillStyle = "rgba(242,239,233,0.55)";
          ctx.fillText(`${n.stageNum} · ${n.label}`, textX, n.by);
        } else {
          ctx.fillStyle = "rgba(242,239,233,0.18)";
          ctx.fillText(n.stageNum, textX, n.by);
        }
        ctx.restore();

        // ── Main Node Marker ──
        ctx.save();
        if (isActive) {
          // Active Pulse Rings (Sonar Wave)
          const pulsePhase = (now / 1400) % 1;
          const pulseRadius = 6 + pulsePhase * 24;
          const pulseAlpha = (1 - pulsePhase) * 0.8;
          ctx.beginPath();
          ctx.arc(n.x, n.y, pulseRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(227,30,36,${pulseAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Rotating Tech Crosshair Reticle
          const rot = (now / 3000) * Math.PI * 2;
          ctx.translate(n.x, n.y);
          ctx.rotate(rot);
          ctx.strokeStyle = "rgba(227,30,36,0.75)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          // 4 corner ticks
          const r = 12;
          ctx.arc(0, 0, r, 0, Math.PI * 0.25);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, r, Math.PI * 0.5, Math.PI * 0.75);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, r, Math.PI * 1.0, Math.PI * 1.25);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, r, Math.PI * 1.5, Math.PI * 1.75);
          ctx.stroke();
          ctx.rotate(-rot);
          ctx.translate(-n.x, -n.y);

          // Glowing Ember Core
          const nodeGlow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 16);
          nodeGlow.addColorStop(0, "rgba(255,240,240,1)");
          nodeGlow.addColorStop(0.3, "rgba(227,30,36,0.95)");
          nodeGlow.addColorStop(1, "rgba(227,30,36,0)");
          ctx.fillStyle = nodeGlow;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 16, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (passed) {
          // Completed Node: Crisp Diamond / Halo
          ctx.beginPath();
          ctx.arc(n.x, n.y, 9, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(242,239,233,0.3)";
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(n.x, n.y, 3.8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(242,239,233,0.95)";
          ctx.fill();

          // Micro center ember pin
          ctx.beginPath();
          ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
          ctx.fillStyle = "#e31e24";
          ctx.fill();
        } else {
          // Future Unlocked Node: Hollow subtle target
          ctx.beginPath();
          ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(242,239,233,0.18)";
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(242,239,233,0.35)";
          ctx.fill();
        }
        ctx.restore();
      });

      // ── 5. ACTIVE HEAD (PROBE COMET & BURST) ──
      if (currentIdx < totalSegs) {
        ctx.save();

        // Pulsing head radius
        const headPulse = Math.sin(now / 180) * 1.5;

        // Big outer glow aura
        const headGlow = ctx.createRadialGradient(hx, hy, 0, hx, hy, 28);
        headGlow.addColorStop(0, "rgba(255,255,255,1)");
        headGlow.addColorStop(0.25, "rgba(227,30,36,0.95)");
        headGlow.addColorStop(0.7, "rgba(227,30,36,0.25)");
        headGlow.addColorStop(1, "rgba(227,30,36,0)");
        ctx.fillStyle = headGlow;
        ctx.beginPath();
        ctx.arc(hx, hy, 28, 0, Math.PI * 2);
        ctx.fill();

        // Head Reticle Ring
        ctx.beginPath();
        ctx.arc(hx, hy, 12 + headPulse, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(227,30,36,0.6)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Inner solid core
        ctx.beginPath();
        ctx.arc(hx, hy, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.restore();
      }

      // ── 6. DRAW & UPDATE PARTICLE SPARKS ──
      ctx.save();
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const s = sparksRef.current[i];
        s.life += dt;
        if (s.life >= s.maxLife) {
          sparksRef.current.splice(i, 1);
          continue;
        }

        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vx *= 0.94;
        s.vy *= 0.94;
        const lifeRatio = 1 - s.life / s.maxLife;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * lifeRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(227,30,36,${lifeRatio * 0.9})`;
        ctx.fill();
      }
      ctx.restore();

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
