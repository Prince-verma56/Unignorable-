import { clientLogos } from "@/lib/data/testimonials";
import { Seam } from "../Seam";

/**
 * One row of the client marquee.
 *
 * Slow enough to read a name — the point of the section is that these are
 * specific clients, which a fast loop destroys. Every fourth name carries the
 * accent so the eye has somewhere to land, and the whole row lifts on hover
 * while the motion pauses.
 */
function Row({
  items,
  reverse,
  offset = 0,
}: {
  items: string[];
  reverse?: boolean;
  offset?: number;
}) {
  const loop = [...items, ...items];
  return (
    <div className="group flex overflow-hidden border-b border-border py-5 md:py-6">
      <div
        className="marquee-track flex shrink-0 gap-12 pr-12 group-hover:[animation-play-state:paused] md:gap-16 md:pr-16"
        {...(reverse ? { "data-reverse": "true" } : {})}
      >
        {loop.map((l, i) => {
          const marked = (i + offset) % 4 === 0;
          return (
            <span
              key={`${l}-${i}`}
              className={`type-title-sm whitespace-nowrap text-[clamp(1.5rem,3vw,2.6rem)] transition-colors duration-500 ${
                marked
                  ? "text-foreground/70 group-hover:text-foreground"
                  : "text-foreground/30 group-hover:text-foreground/60"
              }`}
            >
              {l}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Placeholder wordmarks — replace with real client logos before launch. */
export function Marquee({ withSeam = true }: { withSeam?: boolean } = {}) {
  const half = Math.ceil(clientLogos.length / 2);
  return (
    <section
      aria-label="Selected clients"
      className="relative overflow-hidden border-t border-border"
    >
      <Row items={clientLogos.slice(0, half)} />
      <Row items={clientLogos.slice(half)} reverse offset={2} />

      {/* hands off into the closing ink movement */}
      {withSeam && <Seam side="bottom" />}
    </section>
  );
}
