import Lenis from "lenis";

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

export function initLenis() {
  if (typeof window === "undefined") return null;
  if (lenis) return lenis;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.4,
  });
  return lenis;
}

export function destroyLenis() {
  lenis?.destroy();
  lenis = null;
}

export function stopScroll() {
  lenis?.stop();
}

export function startScroll() {
  lenis?.start();
}

export function scrollToId(id: string, offset = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.5 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}
