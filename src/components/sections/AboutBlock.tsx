import { SplitLines } from "../Reveal";
import { Frame } from "../media/Frame";
import { Seam } from "../Seam";
import { useGsapContext } from "@/hooks/useGsapContext";
import { START, applyParallax, revealImage, revealUp, riseIn } from "@/lib/motion";
import studio1 from "@/assets/studio-1.jpg";
import studio2 from "@/assets/studio-2.jpg";
import campaignProfile from "@/assets/campaign-profile.jpg";

const traits = [
  "Independent",
  "Senior-only team",
  "Built for compounding",
  "Opinionated on purpose",
];

/**
 * Who is actually doing this.
 *
 * Three frames on three different depth layers, stepped down a shared diagonal
 * rather than scattered. The copy column holds the still centre.
 */
export function AboutBlock({ withSeam = true }: { withSeam?: boolean } = {}) {
  const ref = useGsapContext<HTMLElement>((ctx) => {
    revealImage(ctx, "[data-reveal-image]");
    riseIn(ctx, "[data-rise]", { distance: 6 });
    revealUp(ctx, "[data-enter]", { start: START.early, y: 16 });
    revealUp(ctx, "[data-about]", { start: START.base, stagger: 0.1 });
    applyParallax(ctx);
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden edge band"
      aria-labelledby="about-heading"
    >
      {/* lifts out of the film section's ink field */}
      {withSeam && <Seam side="top" />}

      {/*
        Headline left, lead right — the same two-column opening the reel,
        capabilities and work sections use, so the page keeps one rhythm
        rather than leaving half the screen empty beside every heading.
      */}
      <div data-rise className="relative grid-12 items-end gap-y-6 border-b border-border-strong pb-6">
        <div className="col-span-12 lg:col-span-8">
          <p data-enter className="type-meta text-signal">008 — Who we are</p>
          <SplitLines
            as="h2"
            id="about-heading"
            text={"Strategists, designers,\ndevelopers, media buyers\nand storytellers."}
            className="type-title mt-4 max-w-[18ch]"
            lineClass={(_, i) => (i === 2 ? "editorial text-[1.1em] lowercase text-signal" : undefined)}
            start={START.early}
          />
        </div>
        <p data-enter className="type-lead col-span-12 text-foreground/70 lg:col-span-4 lg:pb-2">
          Senior people only, in one room. The list below is what that actually buys you.
        </p>
      </div>

      {/*
        One composition, not four cards.

        The primary frame and the copy share the top band; beneath it a portrait,
        a detail and a pull-line step across the full grid on a single baseline.
        The previous version pulled the portrait up with `mt-[-8vh]` so it
        collided with the frame above it, which read as an accident rather than
        as deliberate overlap, and left the right half of the row empty.
      */}
      <div className="grid-12 mt-12 gap-y-12 md:mt-16">
        <Frame
          src={studio1}
          alt="Studio team working through a campaign"
          width={1280}
          height={1024}
          ratio="16/10"
          depth="mid"
          sizes="(min-width: 768px) 58vw, 100vw"
          className="col-span-12 md:col-span-7"
          imgClassName="grayscale transition-[filter] duration-[1200ms] hover:grayscale-0"
        />

        <div data-about className="col-span-12 md:col-span-4 md:col-start-9 md:self-center">
          <p className="type-lead text-foreground/80">
            One team, no handoffs. Strategy sits next to the edit bay, and the media buyer
            sees the cut before it ships.
          </p>
          <p className="type-body mt-6 text-muted-foreground">
            We turn attention into business — not impressions, not applause. If a thing
            cannot be measured or remembered, we do not make it.
          </p>
          <ul className="mt-8 border-t border-border">
            {traits.map((t) => (
              <li
                key={t}
                className="type-meta flex items-center justify-between gap-4 border-b border-border py-3.5 text-foreground/70"
              >
                {t}
                <span aria-hidden="true" className="text-signal">
                  +
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* the lower band: three elements, one baseline, no collisions */}
        <Frame
          src={campaignProfile}
          alt="Sculptural creative campaign study"
          width={1024}
          height={1280}
          ratio="4/5"
          depth="far"
          sizes="(min-width: 768px) 33vw, 58vw"
          className="col-span-7 md:col-span-4"
        />

        <Frame
          src={studio2}
          alt="Cinema lens catching light in the studio"
          width={1280}
          height={1280}
          ratio="1/1"
          depth="near"
          sizes="(min-width: 768px) 25vw, 42vw"
          className="col-span-5 self-end md:col-span-3 md:col-start-5"
          imgClassName="grayscale"
        />

        {/*
          The right column of this row used to hold only the pull-line, pinned
          to the floor of a 660px-tall row — so four fifths of it was empty.
          The register above it carries real metadata, which is what the column
          is for.
        */}
        <div data-about className="col-span-12 flex flex-col justify-between gap-10 md:col-span-4 md:col-start-9">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
            {[
              { k: "Founded", v: "2026" },
              { k: "Model", v: "Independent" },
              { k: "Disciplines", v: "Nine" },
              { k: "Team", v: "Senior only" },
            ].map((row) => (
              <div key={row.k} className="border-t border-border pt-3.5">
                <dt className="type-meta text-foreground/45">{row.k}</dt>
                <dd className="type-subtitle mt-2 text-[1.1rem]">{row.v}</dd>
              </div>
            ))}
          </dl>

          <figure>
            <blockquote className="type-subtitle text-[1.3rem] leading-tight">
              The brief is a
              <span className="editorial text-signal"> starting position</span>, not a
              contract.
            </blockquote>
            <figcaption className="type-meta mt-5 flex items-center justify-between gap-4 border-t border-border pt-4 text-muted-foreground">
              How we work
              <span aria-hidden="true" className="h-px w-8 bg-signal" />
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
