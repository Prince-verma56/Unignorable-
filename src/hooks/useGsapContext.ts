import { useEffect, useRef, type RefObject } from "react";
import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import { initGsap, prefersReducedMotion } from "@/lib/gsap";

export interface MotionContext {
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
  root: HTMLElement;
}

/**
 * Runs GSAP setup scoped to a container and reverts the context on unmount.
 *
 * Skips entirely under `prefers-reduced-motion`, which is deliberate: because
 * every entrance is written as a `from` tween, skipping leaves the content in
 * its natural, fully visible state rather than needing a parallel static path.
 */
export function useGsapContext<T extends HTMLElement = HTMLDivElement>(
  setup: (ctx: MotionContext & { root: T }) => void,
  deps: unknown[] = [],
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const { gsap, ScrollTrigger } = initGsap();
    const root = ref.current;
    const ctx = gsap.context(() => setup({ gsap, ScrollTrigger, root }), root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
