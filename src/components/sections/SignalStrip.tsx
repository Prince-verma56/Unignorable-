const words = [
  "Retail",
  "Social Media",
  "Influencer",
  "PR",
  "Digital",
  "Events",
];

/**
 * The page's single hard cut, and its only full lime field.
 *
 * The lime is the hero's own chartreuse, so the band reads as the imagery
 * arriving in the layout rather than as a coloured UI strip — which is exactly
 * what the cobalt version looked like. Ink type on lime measures 10.1:1.
 *
 * It earns the interruption by doing a job — naming the disciplines — and it
 * appears exactly once. The baseline ran it twice with identical content, which
 * halved its force (audit M1).
 */
export function SignalStrip() {
  const loop = [...words, ...words];

  return (
    <section
      className="on-acid relative overflow-hidden border-y border-ink/15 bg-acid py-4 text-acid-foreground md:py-5"
      aria-label="Disciplines"
    >
      <div className="marquee-track flex w-max items-center whitespace-nowrap">
        {loop.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="type-title-sm flex items-center gap-9 pr-9 text-[clamp(1.4rem,2.4vw,2.2rem)] font-bold"
          >
            {word}
            <span aria-hidden="true" className="text-[0.42em] text-acid-foreground/55">
              ✦
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
