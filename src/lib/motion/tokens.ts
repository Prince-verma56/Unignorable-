/**
 * Motion constants. See /brain/ANIMATION_SYSTEM.md.
 * Durations and easings live here so the page has one motion language instead of
 * values improvised at each call site.
 */

export const EASE = {
  /** Entrances: fast departure, long settle. */
  out: "expo.out",
  /** State changes, colour and register transitions. */
  inOut: "power2.inOut",
  /** Anything scrubbed to scroll position. Easing a scrub fights the wheel. */
  scrub: "none",
  /** Departures. */
  exit: "power3.in",
} as const;

export const DUR = {
  xs: 0.4,
  sm: 0.65,
  md: 0.9,
  lg: 1.25,
  xl: 1.8,
} as const;

export const STAGGER = {
  tight: 0.05,
  base: 0.08,
  loose: 0.14,
} as const;

export const START = {
  early: "top 92%",
  base: "top 82%",
  late: "top 68%",
} as const;

/**
 * Parallax depth layers, as yPercent magnitudes.
 *
 * The rule that makes the page feel spatial: two layers in one composition must
 * never share a magnitude. `anchor` is 0 on purpose — the copy plane stays still
 * so the layers behind and in front of it read as depth rather than drift.
 */
export const DEPTH = {
  bg: 8,
  far: 10,
  mid: 16,
  anchor: 0,
  near: -10,
} as const;

/**
 * Overscan a parallaxed layer needs so its edges never enter the frame.
 * `.media-inner` is `inset: -10%`, which covers every layer above: the largest
 * travel is `mid` at +/-8% of a 120%-tall inner, i.e. 9.6% of the frame.
 */
export const MEDIA_OVERSCAN = 10;

export type DepthLayer = keyof typeof DEPTH;

/** Parallax is scaled down on small screens and off on phones. */
export function depthScale(): number {
  if (typeof window === "undefined") return 0;
  if (window.matchMedia("(min-width: 1024px)").matches) return 1;
  if (window.matchMedia("(min-width: 640px)").matches) return 0.5;
  return 0;
}

export const isDesktop = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
