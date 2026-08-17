"use client";

import { SITE } from "@/data/content";
import { cn } from "@/lib/utils";

/**
 * Official logo lockup. The brief's uploaded logo asset was not present
 * in this workspace, so this renders a typographic wordmark built around
 * the same mark language (a single dot = the idea particle, red as signal).
 * Drop the official asset at /public/logo.svg and set SITE.logoAsset to use it.
 */
export default function Logo({
  className,
  onDark = true,
}: {
  className?: string;
  onDark?: boolean;
}) {
  if (SITE.logoAsset) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={SITE.logoAsset}
        alt="E-Cell Chandigarh University Uttar Pradesh"
        className={cn("h-9 w-auto", className)}
      />
    );
  }

  return (
    <span
      className={cn("flex items-center gap-3", className)}
      data-cursor="explore"
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span
          className={cn(
            "absolute h-2.5 w-2.5 rounded-full transition-colors duration-200 group-hover:scale-125",
            onDark ? "bg-paper" : "bg-ink"
          )}
        />
        <span className="absolute h-4 w-4 rounded-full border border-ember/0 transition-all duration-300 group-hover:border-ember/70" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[22px] tracking-[0.04em] transition-colors duration-200",
            onDark ? "text-paper" : "text-ink"
          )}
        >
          E-CELL
        </span>
        <span
          className={cn(
            "label mt-1 transition-colors duration-200",
            onDark ? "text-paper/60" : "text-ink/60"
          )}
        >
          {SITE.campus}
        </span>
      </span>
    </span>
  );
}
