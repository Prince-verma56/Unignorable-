import { useGsapContext } from "@/hooks/useGsapContext";
import { ResponsiveImg } from "../media/Frame";
import { applyParallax, revealImage, revealLines, revealUp, START } from "@/lib/motion";
import { Seam } from "../Seam";
import campaignProfileSeam from "@/assets/campaign-profile.jpg";
import { Frame } from "../media/Frame";
import { SplitLines } from "../Reveal";
/*
 * The monolith frame carries a large blue glass plane, which is the one colour
 * outside this studio's language (black / ivory / chartreuse / chrome / a clay
 * micro-accent). Rather than drop a strong architectural image, it is pushed
 * most of the way to monochrome and warmed slightly — which lands it in the
 * "chrome and warm architecture" register the rest of the photography occupies.
 */
import monolith from "@/assets/editorial-monolith.jpg";
import texture from "@/assets/editorial-texture.jpg";

const notes = [
  {
    k: "01",
    t: "Art direction",
    d: "Every frame composed. Nothing arrives by accident, including the accidents.",
  },
  {
    k: "02",
    t: "Media craft",
    d: "Budget behaves like design — deliberate, measured, and answerable for itself.",
  },
  {
    k: "03",
    t: "Build quality",
    d: "Sites that feel as fast as they look, on the phone your customer actually owns.",
  },
];

/**
 * The craft statement — how the studio thinks, held between the reel and the
 * page's first dark inversion.
 *
 * The texture plate runs on the slowest layer, the photograph on the middle one
 * and the type on none at all. That separation is the whole effect: the
 * baseline moved every layer by roughly the same amount, which cancels itself
 * out (audit H8).
 */
export function EditorialMonolith({ withSeam = true }: { withSeam?: boolean } = {}) {
  const ref = useGsapContext<HTMLElement>((ctx) => {
    revealLines(ctx, "[data-line]", { start: START.early });
    revealImage(ctx, "[data-reveal-image]");
    revealUp(ctx, "[data-enter]", { start: START.early, stagger: 0.08, y: 18 });
    revealUp(ctx, "[data-note]", { start: START.base, stagger: 0.12 });
    applyParallax(ctx);
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden band" aria-labelledby="craft-heading">
      {/* slowest layer — texture, not decoration: it carries the section's temperature */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="media-inner" data-parallax="bg">
          <ResponsiveImg
            src={texture}
            alt=""
            ariaHidden
            width={1600}
            height={1067}
            sizes="800px"
            className="opacity-[0.09] mix-blend-multiply [mask-image:radial-gradient(120%_85%_at_70%_40%,#000_35%,transparent_100%)]"
          />
        </div>
      </div>

      <div className="edge">
        <div className="grid-12 items-end gap-y-8 border-b border-border-strong pb-7">
          <div className="col-span-12 lg:col-span-8">
            <p data-enter className="type-meta text-signal">002 — The studio standard</p>
            <SplitLines
              as="h2"
              text={"Built like a monolith.\nMoved like film."}
              className="type-title mt-4 max-w-[13ch]"
              lineClass={(_, i) => (i === 1 ? "text-foreground/60" : undefined)}
              start={START.early}
            />
          </div>
          <p data-enter className="type-lead col-span-12 text-foreground/70 lg:col-span-4 lg:pb-2">
            Permanence and motion are not opposites. The work has to hold still long enough
            to be believed, and move fast enough to be felt.
          </p>
        </div>

        <div className="grid-12 mt-10 gap-y-10 md:mt-14">
          {/* see note on the blue plane below */}
          <Frame
            src={monolith}
            alt="Editorial monolith campaign composition in raked light"
            width={1600}
            height={1000}
            imgClassName="saturate-[0.14] sepia-[0.12] contrast-[1.06]"
            ratio="16/10"
            depth="mid"
            className="col-span-12 lg:col-span-7"
          />

          {/* the notes rail sits on the image's baseline rather than floating */}
          <ol className="col-span-12 lg:col-span-4 lg:col-start-9 lg:self-center">
            {notes.map((n) => (
              <li
                key={n.k}
                data-note
                className="flex items-baseline gap-5 border-b border-border py-6 last:border-b-0 last:pb-0 first:pt-0"
              >
                <span className="type-meta shrink-0 text-signal">{n.k}</span>
                <div>
                  <h3 className="type-subtitle">{n.t}</h3>
                  <p className="type-body mt-2.5 max-w-[34ch] text-muted-foreground">{n.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* hands off into the Statement's ink field */}
      {withSeam && <Seam side="bottom" />}
    </section>
  );
}
