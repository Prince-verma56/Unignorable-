import { useEffect, useRef } from "react";
import { usePointerFine } from "@/hooks/usePointerFine";
import { prefersReducedMotion } from "@/lib/gsap";

const LABELS: Record<string, string> = {
  view: "View",
  explore: "Explore",
  drag: "Drag",
};

/**
 * Desktop-only cursor. Add `data-cursor="view" | "explore" | "drag" | "cta"` to
 * any element to change its state.
 *
 * The baseline rendered all four states as the same cobalt disc with a label set
 * in `--ink` — which was also cobalt — so every label was invisible (audit M4).
 * Each state is now visually distinct and the label sits on its own field.
 */
export function Cursor() {
  const fine = usePointerFine();
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!fine || prefersReducedMotion()) return;

    const el = dot.current;
    const lbl = label.current;
    if (!el || !lbl) return;

    document.documentElement.classList.add("cursor-none-desktop");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let raf = 0;
    let visible = false;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = "1";
      }
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      const mode = target?.dataset["cursor"] ?? "default";
      if (el.dataset["mode"] !== mode) {
        el.dataset["mode"] = mode;
        lbl.textContent = LABELS[mode] ?? "";
      }
    };

    // If the pointer leaves the window, give the native cursor back.
    const leave = () => {
      visible = false;
      el.style.opacity = "0";
    };

    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-none-desktop");
    };
  }, [fine]);

  if (!fine) return null;

  return (
    <div
      ref={dot}
      aria-hidden="true"
      data-mode="default"
      style={{ opacity: 0 }}
      /*
       * Upgraded cursor: Rather than a mix-blend ring that can get lost on photos,
       * we use a highly legible solid accent color. The default is a precise dot,
       * and hovers expand into a solid disc with high-contrast text.
       */
      className="pointer-events-none fixed left-0 top-0 z-[70] flex items-center justify-center rounded-full
        transition-[width,height,background-color,opacity,transform] duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)]
        size-3 bg-signal
        data-[mode=cta]:size-12 data-[mode=cta]:bg-signal/20 data-[mode=cta]:border-2 data-[mode=cta]:border-signal
        data-[mode=view]:size-20 data-[mode=view]:bg-signal
        data-[mode=explore]:size-20 data-[mode=explore]:bg-signal
        data-[mode=drag]:size-20 data-[mode=drag]:bg-signal"
    >
      <span
        ref={label}
        className="type-meta text-[0.65rem] font-bold uppercase tracking-widest text-ink opacity-0 transition-opacity duration-300
          [[data-mode=view]>&]:opacity-100 [[data-mode=explore]>&]:opacity-100 [[data-mode=drag]>&]:opacity-100"
      />
    </div>
  );
}
