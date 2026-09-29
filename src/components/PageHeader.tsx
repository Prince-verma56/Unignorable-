import type { ReactNode } from "react";
import { ArrowDown } from "lucide-react";
import { SplitLines } from "./Reveal";
import { Frame } from "./media/Frame";
import { useGsapContext } from "@/hooks/useGsapContext";
import { applyParallax, revealImage, revealUp, START } from "@/lib/motion";

interface PageHeaderProps {
  /** Small label above the title. Sentence case — no shouting parentheses. */
  label: string;
  /** Newline-separated; each line gets its own mask. */
  title: string;
  /** Accessible page title when the visible one is set as a sibling element. */
  srTitle?: string;
  lead?: ReactNode;
  meta?: ReactNode;
  /** Marks the final line as the editorial accent. */
  accentLastLine?: boolean;
  /**
   * The visual anchor. Every route passes one — it is what stops the opening
   * screen being type floating in an empty field.
   */
  media?: { src: string; alt: string; width: number; height: number } | undefined;
  /** Small right-hand index, e.g. "04 / 09". */
  index?: string | undefined;
}

/**
 * The inner-page opening.
 *
 * One system, five personalities: micro-label, headline, supporting statement,
 * visual anchor, metadata rail, scroll continuation — in that order, with the
 * composition anchored to the floor of the screen the way the home hero is.
 *
 * The previous version combined `min-h-[100svh]`, `justify-center` and
 * `pt-[20vh]`, so the content was centred in a full screen and then pushed down
 * again. Every route opened on several hundred pixels of nothing, which reads
 * as a page that has not finished loading rather than as negative space.
 */
export function PageHeader({
  label,
  title,
  srTitle,
  lead,
  meta,
  accentLastLine = false,
  media,
  index,
}: PageHeaderProps) {
  const lines = title.split("\n");

  const ref = useGsapContext<HTMLElement>((ctx) => {
    revealUp(ctx, "[data-ph-enter]", { start: START.early, stagger: 0.09, y: 18 });
    revealImage(ctx, "[data-reveal-image]", { start: START.early });
    applyParallax(ctx);
  }, [title]);

  return (
    <header
      ref={ref}
      className="edge relative flex min-h-[76svh] flex-col justify-end overflow-hidden border-b border-border pb-[var(--space-band-sm)] pt-[clamp(7rem,13vh,9rem)]"
    >
      {srTitle ? <h1 className="sr-only">{srTitle}</h1> : null}

      {/* the visual anchor: a right-hand bleed the headline overlaps */}
      {media ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[44vw] lg:block"
        >
          <Frame
            src={media.src}
            alt=""
            width={media.width}
            height={media.height}
            ratio="fill"
            depth="far"
            sizes="44vw"
            className="h-full"
            imgClassName="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-background to-transparent" />
        </div>
      ) : null}

      <div className="relative grid-12 items-end gap-y-8">
        <div className="col-span-12 lg:col-span-7">
          <p data-ph-enter className="type-meta text-signal">
            {label}
          </p>
          <SplitLines
            as={srTitle ? "p" : "h1"}
            text={title}
            className="type-display mt-5 max-w-[13ch]"
            lineClass={(_, i) =>
              accentLastLine && i === lines.length - 1
                ? "editorial text-[1.1em] lowercase text-signal"
                : undefined
            }
            start={START.early}
            delay={0.12}
          />
          {lead ? (
            <p data-ph-enter className="type-lead mt-8 max-w-[44ch] text-foreground/75">
              {lead}
            </p>
          ) : null}
          {meta ? (
            <p data-ph-enter className="type-meta mt-7 text-foreground/60">
              {meta}
            </p>
          ) : null}
        </div>
      </div>

      {/* scroll continuation — the same rail the home hero closes on */}
      <div
        data-ph-enter
        className="relative mt-10 flex items-center justify-between gap-6 border-t border-border pt-4 md:mt-14"
      >
        <span className="type-meta flex items-center gap-3 text-foreground/60">
          Scroll
          <ArrowDown className="size-3 animate-bounce" aria-hidden="true" />
        </span>
        {index ? <span className="type-meta text-foreground/40">{index}</span> : null}
      </div>
    </header>
  );
}
