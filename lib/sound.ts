/* ── optional ambient sound ─────────────────────────────────────
   Default OFF. A handful of short blips; nothing autoplays.
   ─────────────────────────────────────────────────────────────── */

"use client";

let ctx: AudioContext | null = null;
let enabled = false;

const KEY = "ecell-sound";

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, dur = 0.09, type: OscillatorType = "sine", vol = 0.05) {
  if (!enabled) return;
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + dur);
}

export const sound = {
  init() {
    if (typeof window === "undefined") return;
    try {
      enabled = localStorage.getItem(KEY) === "1";
    } catch {
      enabled = false;
    }
  },
  isOn() {
    return enabled;
  },
  toggle(): boolean {
    enabled = !enabled;
    try {
      localStorage.setItem(KEY, enabled ? "1" : "0");
    } catch {
      /* ignore */
    }
    if (enabled) tone(660, 0.12);
    return enabled;
  },
  dot() {
    tone(340, 0.06);
  },
  word() {
    tone(220, 0.14, "triangle", 0.04);
    setTimeout(() => tone(440, 0.1, "triangle", 0.03), 70);
  },
  enter() {
    tone(523, 0.12, "triangle");
    setTimeout(() => tone(784, 0.16, "triangle", 0.05), 90);
  },
  click() {
    tone(480, 0.05);
  },
  complete() {
    tone(392, 0.1, "triangle");
    setTimeout(() => tone(523, 0.12, "triangle"), 90);
    setTimeout(() => tone(659, 0.18, "triangle"), 190);
  },
  stage() {
    tone(300, 0.08, "sine", 0.035);
  },
};
