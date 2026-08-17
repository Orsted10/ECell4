"use client";

import { useEffect } from "react";
import { initLenis, destroyLenis } from "@/lib/scroll";

export default function SmoothScroll() {
  useEffect(() => {
    initLenis();
    return () => destroyLenis();
  }, []);
  return null;
}
