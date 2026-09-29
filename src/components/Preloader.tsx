import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * Entrance. Opens on the ink register and clips upward to reveal a hero that is
 * already composed underneath — so the page is *revealed*, not assembled.
 *
 * The baseline held a flat cobalt field for ~2.0s behind a wordmark set at 14vw
 * (≈154vw wide, clipped at both edges). This is ~0.9s to a legible hero, and it
 * establishes the ink/paper inversion the rest of the page cuts between.
 *
 * Skipped outright under reduced motion.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setGone(true);
      onDone();
      return;
    }

    const start = performance.now();
    const HOLD = 520;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / HOLD);
      // ease-out so the count decelerates into 100 instead of running linearly
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!done.current) {
        done.current = true;
        setLeaving(true);
        onDone();
        // matches the clip transition below
        setTimeout(() => setGone(true), 800);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      data-register="ink"
      className="pointer-events-none fixed inset-0 z-[90] flex flex-col justify-end transition-[clip-path] duration-[700ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
      style={{
        clipPath: leaving ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 0% 0%)",
      }}
    >
      {/* Minimalistic Corner Borders */}
      <div 
        className="absolute inset-8 pointer-events-none transition-opacity duration-700 ease-out md:inset-12" 
        style={{ opacity: leaving ? 0 : 1 }}
      >
        <div className="absolute left-0 top-0 size-8 border-l border-t border-bone/20" />
        <div className="absolute right-0 top-0 size-8 border-r border-t border-bone/20" />
        <div className="absolute bottom-0 left-0 size-8 border-b border-l border-bone/20" />
        <div className="absolute bottom-0 right-0 size-8 border-b border-r border-bone/20" />
      </div>

      {/* Centered Brand Name with Fill Animation */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{ 
          opacity: leaving ? 0 : 1,
          transform: leaving ? "translateY(-2rem)" : "translateY(0)"
        }}
      >
        <div className="relative">
          {/* Dim background text */}
          <span className="type-display text-[clamp(2.5rem,8vw,8rem)] tracking-tighter text-bone/10">
            {site.name}<span className="text-signal/10">.</span>
          </span>
          {/* Filled text driven by progress */}
          <span 
            className="type-display absolute left-0 top-0 text-[clamp(2.5rem,8vw,8rem)] tracking-tighter text-bone"
            style={{
              clipPath: `inset(0 ${100 - progress}% 0 0)`,
              transition: "clip-path 90ms linear"
            }}
          >
            {site.name}<span className="text-signal">.</span>
          </span>
        </div>
      </div>

      <div className="edge pb-[clamp(2rem,6vh,4rem)]">
        <div
          className="flex items-end justify-end gap-6 transition-[opacity,transform] duration-500 ease-out"
          style={{
            opacity: leaving ? 0 : 1,
            transform: leaving ? "translateY(-1.5rem)" : "translateY(0)",
          }}
        >
          <span className="type-numeral text-[clamp(2.5rem,7vw,5rem)] text-bone/60">
            {String(progress).padStart(3, "0")}
          </span>
        </div>

        {/* progress rule — the only moving thing, drawn left to right */}
        <div className="mt-5 h-px w-full bg-bone/15">
          <div
            className="h-px bg-signal"
            style={{ width: `${progress}%`, transition: "width 90ms linear" }}
          />
        </div>
      </div>
    </div>
  );
}
