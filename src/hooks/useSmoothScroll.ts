import { useEffect } from "react";
import Lenis from "lenis";
import { initGsap, prefersReducedMotion } from "@/lib/gsap";

let instance: Lenis | null = null;

/**
 * The live Lenis instance, or null under reduced motion / before mount.
 *
 * Anything that moves the page programmatically must go through this. Lenis
 * owns the scroll position and reasserts its own `animatedScroll` on the next
 * frame, so a bare `window.scrollTo()` is silently reverted — which is what
 * left route changes stranded at the previous page's scroll offset.
 */
export function getLenis(): Lenis | null {
  return instance;
}

/** Jump to a position through whichever scroll system is active. */
export function scrollToTop(): void {
  if (instance) instance.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

/**
 * The single global scroll system: one Lenis instance driven by the one GSAP
 * ticker, plus the ScrollTrigger refresh discipline.
 *
 * Nothing else in the app may start a RAF loop or attach a scroll listener.
 * See /brain/ANIMATION_SYSTEM.md and /brain/PERFORMANCE.md.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const { gsap, ScrollTrigger } = initGsap();
    const root = document.documentElement;

    /*
     * Refresh discipline (audit C6).
     *
     * Trigger positions are computed once, against a layout that then moves by
     * thousands of pixels as lazy images decode, the webfont swaps and pinned
     * sections claim their spacers. Without this, reveals fire at the wrong
     * offset or never fire at all — which is what left the baseline page with
     * blocks stuck at opacity 0.
     *
     * Every source is funnelled into a single rAF-batched refresh so we never
     * pay for one reflow per image.
     */
    let refreshQueued = false;
    const queueRefresh = () => {
      if (refreshQueued) return;
      refreshQueued = true;
      requestAnimationFrame(() => {
        refreshQueued = false;
        ScrollTrigger.refresh();
      });
    };

    const imgs = Array.from(document.images).filter((img) => !img.complete);
    imgs.forEach((img) => {
      img.addEventListener("load", queueRefresh, { once: true });
      img.addEventListener("error", queueRefresh, { once: true });
    });

    window.addEventListener("load", queueRefresh);
    void document.fonts?.ready.then(queueRefresh);

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(queueRefresh, 150);
    });
    const main = document.getElementById("main");
    if (main) observer.observe(main);

    // Reduced motion: no smooth scrolling, but the refresh discipline above
    // still has to run so layout-dependent triggers stay correct.
    if (prefersReducedMotion()) {
      return () => {
        window.removeEventListener("load", queueRefresh);
        imgs.forEach((img) => img.removeEventListener("load", queueRefresh));
        clearTimeout(resizeTimer);
        observer.disconnect();
      };
    }

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
      syncTouch: false,
    });

    /*
     * Scroll lean. The baseline wrote velocity straight to a CSS skew, and Lenis
     * stops emitting when scrolling stops — so the last value stuck and elements
     * sat permanently sheared (audit C4). This decays toward 0 on the ticker, so
     * rest is always rest.
     */
    let lean = 0;
    let velocity = 0;

    lenis.on("scroll", (e: { velocity: number }) => {
      ScrollTrigger.update();
      velocity = e.velocity;
    });

    const tick = (time: number) => {
      lenis.raf(time * 1000);

      const target = gsap.utils.clamp(-4, 4, velocity * 0.16);
      lean += (target - lean) * 0.1;
      velocity *= 0.9; // decay, so a stopped wheel returns the page to flat
      if (Math.abs(lean) < 0.01) lean = 0;
      root.style.setProperty("--scroll-lean", `${lean.toFixed(3)}deg`);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    instance = lenis;

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
      window.removeEventListener("load", queueRefresh);
      imgs.forEach((img) => img.removeEventListener("load", queueRefresh));
      clearTimeout(resizeTimer);
      observer.disconnect();
      root.style.removeProperty("--scroll-lean");
    };
  }, []);
}
