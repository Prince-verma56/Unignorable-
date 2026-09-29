import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { prefersReducedMotion } from "@/lib/gsap";
import { scrollToTop } from "@/hooks/useSmoothScroll";

const COVER_MS = 480;
/** The new route paints under the panel before it lifts. */
const HOLD_MS = 160;
const REVEAL_MS = 620;

type Phase = "idle" | "covering" | "covered" | "revealing";

/**
 * The transition between chapters.
 *
 * Two earlier attempts got this wrong in the same way. The first swept a panel
 * across a page React had *already* replaced, so the new route popped in and was
 * then covered. The second used the View Transitions API, which holds the old
 * frame correctly — but cross-fades it with the new one, so both pages are on
 * screen together and you can read one through the other. A cover styled onto
 * `html::after` does not help, because the transition overlay renders above the
 * document's own pseudo-elements.
 *
 * So the cover is a real element, and navigation waits for it:
 *
 *   click → panel wipes up over the current page → navigate →
 *   panel wipes away → new page
 *
 * Exactly one page is visible at any moment, and there is no blend, no split
 * edge and no flash of background between them.
 *
 * Clicks are intercepted in the capture phase so this works for every internal
 * link on the site without each one having to opt in. Modified clicks, new-tab
 * clicks, external links, hashes and downloads all fall through to the browser.
 */
export function RouteTransition() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [phase, setPhase] = useState<Phase>("idle");
  const pending = useRef<string | null>(null);
  const lastPath = useRef(pathname);

  const down = phase === "covering" || phase === "covered";

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(href, window.location.origin);
      if (url.pathname === window.location.pathname) return;

      e.preventDefault();
      pending.current = url.pathname + url.search;
      setPhase("covering");
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Navigate once the panel has the screen.
  useEffect(() => {
    if (phase !== "covering" || !pending.current) return;
    const to = pending.current;
    const t = setTimeout(() => {
      pending.current = null;
      void router.navigate({ to, resetScroll: false });
    }, COVER_MS);
    return () => clearTimeout(t);
  }, [phase, router]);

  // The new route has mounted: reset the scroll under the panel, hold a beat so
  // it paints, then lift.
  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    scrollToTop();
    if (phase !== "covering") return;
    setPhase("covered");
  }, [pathname, phase]);

  useEffect(() => {
    if (phase !== "covered") return;
    const hold = setTimeout(() => setPhase("revealing"), HOLD_MS);
    return () => clearTimeout(hold);
  }, [phase]);

  useEffect(() => {
    if (phase !== "revealing") return;
    const done = setTimeout(() => setPhase("idle"), REVEAL_MS);
    return () => clearTimeout(done);
  }, [phase]);

  const active = phase !== "idle";

  /*
   * Three resting positions, one transition each:
   *   idle      panel below the fold
   *   covering  panel rises to cover        (COVER_MS)
   *   covered   panel holds, page paints    (no transition)
   *   revealing panel continues up and off  (REVEAL_MS)
   *
   * The panel always travels the same direction, so the wipe reads as one
   * continuous move rather than a curtain that comes back the way it went.
   */
  const panelY = down ? "0%" : phase === "revealing" ? "-100%" : "100%";
  const duration = phase === "covering" ? COVER_MS : phase === "revealing" ? REVEAL_MS : 0;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[95]"
      style={{ visibility: active ? "visible" : "hidden" }}
    >
      <div
        className="absolute inset-0 bg-ink"
        style={{
          transform: `translate3d(0, ${panelY}, 0)`,
          transition: duration ? `transform ${duration}ms cubic-bezier(0.76,0,0.24,1)` : "none",
        }}
      />
      {/* a lime rule riding the panel's leading edge */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-acid"
        style={{
          transform: `translate3d(0, ${panelY === "0%" ? "0px" : panelY === "100%" ? "100vh" : "-100vh"}, 0)`,
          transition: duration ? `transform ${duration}ms cubic-bezier(0.76,0,0.24,1)` : "none",
        }}
      />
    </div>
  );
}
