import { useEffect, useState } from "react";
import { initGsap } from "@/lib/gsap";

export interface ScrollState {
  /** Past the hero threshold — the nav condenses. */
  scrolled: boolean;
  /** Scrolling up, or at the very top. The nav shows only when true. */
  up: boolean;
  /** An ink-register section is currently passing under the nav band. */
  overDark: boolean;
}

/**
 * Nav scroll state, read from a single ScrollTrigger rather than its own
 * `window.addEventListener("scroll")`. The baseline ran a second listener
 * alongside Lenis, which double-read the same wheel (see PERFORMANCE.md).
 */
export function useScrollState(threshold = 64, navHeight = 72): ScrollState {
  const [state, setState] = useState<ScrollState>({
    scrolled: false,
    up: true,
    overDark: false,
  });

  useEffect(() => {
    const { ScrollTrigger } = initGsap();

    /*
     * What is under the nav band is answered by hit-testing the point just
     * below it, not by measuring each ink section's box.
     *
     * Geometry does not survive pinning: the Statement is pinned with
     * `pinType: "transform"`, so its own rect no longer describes where it is
     * painted, and a `top/bottom navHeight` trigger on it reports the wrong
     * range. A hit-test is always right — through pins, through the seam
     * gradients, and through anything added later — and it costs one call per
     * scroll update, in an update that already runs.
     */
    const isOverDark = () => {
      // Probe clear of the bar itself; the fixed overlays above it (grain,
      // cursor, preloader, route wipe) are all pointer-events:none and so are
      // skipped by elementFromPoint.
      const el = document.elementFromPoint(
        Math.round(window.innerWidth / 2),
        navHeight + 12,
      );
      if (!el || el.closest("header")) return false;
      return el.closest<HTMLElement>("[data-register]")?.dataset["register"] === "ink";
    };

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        const scrolled = y > threshold;
        // At the top the nav is always shown, so the hero is never entered with
        // the bar already hidden.
        const up = y <= threshold ? true : self.direction === -1;
        const overDark = isOverDark();
        setState((prev) =>
          prev.scrolled === scrolled && prev.up === up && prev.overDark === overDark
            ? prev
            : { scrolled, up, overDark },
        );
      },
    });

    // The first paint happens before any scroll, so seed it once.
    const seed = requestAnimationFrame(() =>
      setState((prev) => {
        const overDark = isOverDark();
        return prev.overDark === overDark ? prev : { ...prev, overDark };
      }),
    );

    return () => {
      cancelAnimationFrame(seed);
      trigger.kill();
    };
  }, [threshold, navHeight]);

  return state;
}
