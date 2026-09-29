import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { Cursor } from "./Cursor";
import { Preloader } from "./Preloader";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

/**
 * The shell: one smooth-scroll system, the cursor, the grain plate, the
 * entrance and the route transition.
 *
 * `SiteFrame` mounts per route, so the entrance is gated on a module flag —
 * it plays once per page load, not on every navigation.
 */
let hasBooted = false;

export function SiteFrame({ children }: { children: ReactNode }) {
  useSmoothScroll();

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [showPreloader] = useState(() => !hasBooted);
  const first = useRef(true);

  const onBootDone = useCallback(() => {
    hasBooted = true;
    document.documentElement.dataset["booted"] = "true";
  }, []);

  useEffect(() => {
    if (!showPreloader) document.documentElement.dataset["booted"] = "true";
  }, [showPreloader]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="grain-layer" aria-hidden="true" />
      <Cursor />

      {showPreloader ? <Preloader onDone={onBootDone} /> : null}

      <Nav />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
