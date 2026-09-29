import { type ElementType, type ReactNode } from "react";
import { useGsapContext } from "@/hooks/useGsapContext";
import { revealUp, revealLines, DUR, EASE, START } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  start?: string;
}

/** Fade + rise on scroll-in. transform/opacity only. */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  y = 34,
  start = START.base,
}: RevealProps) {
  const ref = useGsapContext<HTMLDivElement>(
    ({ gsap, root }) => {
      gsap.from(root, {
        opacity: 0,
        y,
        duration: DUR.md,
        delay,
        ease: EASE.out,
        scrollTrigger: { trigger: root, start, once: true },
      });
    },
    [delay, y, start],
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Staggers direct children of the wrapper up into place. */
export function RevealGroup({
  children,
  className,
  selector = ":scope > *",
  start = START.base,
}: {
  children: ReactNode;
  className?: string;
  selector?: string;
  start?: string;
}) {
  const ref = useGsapContext<HTMLDivElement>((ctx) => {
    revealUp(ctx, selector, { start });
  }, [selector, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

interface SplitLinesProps {
  /** Newline-separated. Each line gets its own clipping mask. */
  text: string;
  id?: string;
  className?: string;
  lineClassName?: string;
  /** Per-line class override, by index — for accent words inside a headline. */
  lineClass?: (line: string, index: number) => string | undefined;
  as?: ElementType;
  start?: string;
  delay?: number;
}

/**
 * Line-by-line masked reveal for display type.
 *
 * The mask is the point: each line is clipped by its own `overflow: hidden`
 * parent so the type rises out of a hard edge rather than fading in place.
 */
export function SplitLines({
  text,
  id,
  className,
  lineClassName,
  lineClass,
  as: Tag = "div",
  start = START.base,
  delay = 0,
}: SplitLinesProps) {
  const lines = text.split("\n");
  const ref = useGsapContext<HTMLDivElement>(
    (ctx) => {
      revealLines(ctx, "[data-line]", { start, delay });
    },
    [text, start, delay],
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((line, i) => (
        <span key={`${line}-${i}`} className="block overflow-hidden pb-[0.06em]">
          <span
            data-line
            className={`block ${lineClassName ?? ""} ${lineClass?.(line, i) ?? ""}`}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
