import { useEffect, useRef, type ReactNode } from "react";
import { usePointerFine } from "@/hooks/usePointerFine";
import { prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  /**
   * Hard cap on displacement, in px. Without one, `strength` alone lets a wide
   * control travel a long way from a pointer near its edge, which reads as a
   * toy rather than as a considered piece of interaction.
   */
  max?: number;
  className?: string | undefined;
}

/**
 * Pulls its child gently toward the pointer. Fine pointers only.
 *
 * Display is a class, not an inline style: the baseline set
 * `style={{ display: "inline-block" }}`, which outranked the `hidden` utility
 * and leaked the desktop nav CTA onto mobile (audit C5). `cn` resolves the
 * display conflict in favour of whatever the caller passes.
 */
export function Magnetic({ children, strength = 0.18, max = 8, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const fine = usePointerFine();

  useEffect(() => {
    const el = ref.current;
    if (!el || !fine || prefersReducedMotion()) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const clamp = (v: number) => Math.max(-max, Math.min(max, v * strength));
      const dx = clamp(e.clientX - (r.left + r.width / 2));
      const dy = clamp(e.clientY - (r.top + r.height / 2));
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    };
    const reset = () => {
      el.style.transform = "translate3d(0,0,0)";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      reset();
    };
  }, [fine, strength, max]);

  return (
    <span
      ref={ref}
      className={cn("inline-block", className)}
      style={{ transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {children}
    </span>
  );
}
