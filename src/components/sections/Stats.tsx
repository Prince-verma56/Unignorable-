import { useGsapContext } from "@/hooks/useGsapContext";
import { START, counter, revealUp, riseIn } from "@/lib/motion";
import { Seam } from "../Seam";
import campaignProfileSeam from "@/assets/campaign-profile.jpg";

/** Game Changer GCC market statistics — from client-supplied materials. */
const STATS = [
  { value: 99, suffix: "%", label: "Social media penetration", note: "UAE — one of the highest on the planet" },
  { value: 9, suffix: "", label: "Solutions in-house", note: "Retail to PR — no handoffs" },
  { value: 6, suffix: "", label: "GCC markets", note: "UAE, KSA, Qatar, Kuwait, Bahrain, Oman" },
  { value: 0, suffix: "", label: "Wasted Dirhams", note: "Organic-first — paid only when it earns its place" },
];

/**
 * Proof — the quiet band between the manifesto and the offer.
 *
 * The baseline gave each cell `min-h-56` with `justify-end`, so two thirds of
 * every cell was empty before the counter even fired, and the numbers sat at a
 * literal `0` whenever the trigger missed (audit H7). Cells are content-height
 * now, the numerals are tabular so the columns align, and the counter writes
 * its final value on complete rather than relying on the last frame landing.
 */
export function Stats({ withSeam = true }: { withSeam?: boolean } = {}) {
  const ref = useGsapContext<HTMLElement>((ctx) => {
    riseIn(ctx, "[data-rise]", { distance: 6 });
    revealUp(ctx, "[data-enter]", { start: START.early, stagger: 0.08, y: 16 });
    revealUp(ctx, "[data-stat]", { start: START.base, stagger: 0.1, y: 28 });
    counter(ctx, "[data-count]");
  }, []);

  return (
    <section
      ref={ref}
      data-register="paper-deep"
      className="relative overflow-hidden edge band-sm border-y border-border"
      aria-labelledby="proof-heading"
    >
      {/* lifts out of the Statement's ink field */}
      {withSeam && <Seam side="top" />}

      <div className="relative mb-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 border-b border-border-strong pb-5 md:mb-16">
        <h2 data-enter id="proof-heading" className="type-meta text-signal">
          004 — Why GCC. Why now.
        </h2>
        <p data-enter className="type-body max-w-[44ch] text-muted-foreground md:text-right">
          The GCC market has never been more ready. Social penetration is at an all-time high. Ad costs are rising.
        </p>
      </div>

      <dl data-rise className="grid-12 relative gap-y-12">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            data-stat
            className="col-span-6 border-t border-border pt-4 lg:col-span-3"
          >
            <span className="type-meta block text-foreground/60">0{i + 1}</span>
            <dd className="type-numeral mt-4 flex items-start text-[clamp(3.25rem,7vw,5.5rem)]">
              <span data-count={s.value}>{s.value}</span>
              <span className="text-signal">{s.suffix}</span>
            </dd>
            <dt className="type-subtitle mt-4 text-[1.05rem]">{s.label}</dt>
            <p className="type-body mt-1.5 text-muted-foreground">{s.note}</p>
          </div>
        ))}
      </dl>
    </section>
  );
}
