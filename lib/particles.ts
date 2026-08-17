/* ────────────────────────────────────────────────────────────────
   THE IDEA PARTICLE — the single visual element of the whole site.
   A point that becomes a word, a line, a network, an ecosystem.
   ──────────────────────────────────────────────────────────────── */

import { rand } from "@/lib/utils";

export interface Particle {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  tx: number; // target (glyph) position
  ty: number;
  vx: number;
  vy: number;
  r: number;
  red: boolean; // the signal particles
  seed: number;
}

/** Sample the pixels of a word drawn on an offscreen canvas. */
export function sampleWordPoints(
  word: string,
  font: string,
  width: number,
  height: number,
  gap = 3
): { x: number; y: number }[] {
  const c = document.createElement("canvas");
  c.width = Math.max(2, Math.floor(width));
  c.height = Math.max(2, Math.floor(height));
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = font;
  ctx.fillText(word, c.width / 2, c.height / 2);

  const data = ctx.getImageData(0, 0, c.width, c.height).data;
  const pts: { x: number; y: number }[] = [];
  for (let y = 0; y < c.height; y += gap) {
    for (let x = 0; x < c.width; x += gap) {
      if (data[(y * c.width + x) * 4 + 3] > 120) pts.push({ x, y });
    }
  }
  return pts;
}

/** Build a font string that fits `word` within a fraction of the width. */
export function fitFont(
  ctx: CanvasRenderingContext2D,
  word: string,
  width: number,
  family = '"Anton", sans-serif',
  maxRatio = 0.74
): string {
  let size = Math.floor(width * maxRatio);
  ctx.font = `${size}px ${family}`;
  const w = ctx.measureText(word).width;
  const scale = (width * maxRatio) / w;
  size = Math.floor(size * scale);
  return `${size}px ${family}`;
}

/** Create n scattered particles across a rect. */
export function makeScatter(
  n: number,
  w: number,
  h: number,
  redRatio = 0.06
): Particle[] {
  const pts: Particle[] = [];
  for (let i = 0; i < n; i++) {
    const x = rand(0, w);
    const y = rand(0, h);
    pts.push({
      x,
      y,
      homeX: x,
      homeY: y,
      tx: x,
      ty: y,
      vx: 0,
      vy: 0,
      r: rand(1, 1.9),
      red: Math.random() < redRatio,
      seed: Math.random() * Math.PI * 2,
    });
  }
  return pts;
}
