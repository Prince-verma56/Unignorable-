import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Seam } from "../Seam";
import { SplitLines } from "../Reveal";
import { Frame, type Ratio } from "../media/Frame";
import { useGsapContext } from "@/hooks/useGsapContext";
import { applyParallax, revealImage, revealUp, START } from "@/lib/motion";
import { projects } from "@/lib/data/work";
import studio1 from "@/assets/studio-1.jpg";
import hero from "@/assets/hero.jpg";
import campaignObject from "@/assets/campaign-object.jpg";
import campaignGlass from "@/assets/campaign-glass.jpg";

const imgs = [campaignObject, campaignGlass, hero, studio1];

/**
 * Selected work.
 *
 * The rhythm is a deliberate two-column stagger — a wide item and a narrow one
 * alternating sides, with the narrow column carrying a single fixed drop so
 * successive rows interlock. The baseline applied `mt-40` / `ml-12` / `mt-24`
 * by index modulo with no relation to the grid, which opened roughly 600px of
 * empty paper between items rather than rhythm (audit H5).
 */
export function WorkPreview({
  withSeam = true,
  compact = false,
}: { withSeam?: boolean; compact?: boolean } = {}) {
  const ref = useGsapContext<HTMLElement>((ctx) => {
    revealImage(ctx, "[data-reveal-image]", { stagger: 0 });
    revealUp(ctx, "[data-work-meta]", { start: START.base, y: 22 });
    applyParallax(ctx);
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden edge band"
      aria-labelledby="work-heading"
    >
      {/* the route that owns this section states its own title; repeating it here
          would say the same thing twice in two type sizes */}
      {compact ? null : (
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5 border-b border-border-strong pb-6">
          <div>
            <p className="type-meta text-signal">006 — Selected work</p>
            <SplitLines
              as="h2"
              id="work-heading"
              text={"Work that moved\nthe needle."}
              className="type-title mt-4 max-w-[12ch]"
              start={START.early}
            />
          </div>
          <Link
            to="/work"
            data-cursor="cta"
            className="type-meta link-underline inline-flex items-center gap-2 pb-2 text-foreground/70 hover:text-foreground"
          >
            All work
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      )}

      {/*
        A two-column editorial stagger.

        The narrow column used to be pulled up with `lg:-mt-[18vh]`, which slid
        it into the copy of the item above — the summary of one project was
        physically overlapped by the image of the next. The offset is positive
        now, applied to the column rather than the item, so the interlock is
        the same and nothing can collide.

        Metadata is plain body type, not `type-meta`: at 0.22em of tracking a
        three-service list becomes a wall of spaced capitals that wraps badly
        in a narrow right rail.
      */}
      <ul className="grid-12 mt-12 gap-y-[clamp(4rem,9vh,7rem)] md:mt-16">
        {projects.map((p, i) => {
          const wide = i % 2 === 0;
          const span = wide
            ? "col-span-12 lg:col-span-7"
            : "col-span-12 lg:col-span-4 lg:col-start-9 lg:mt-[14vh]";

          return (
            <li key={p.slug} className={span}>
              <Link
                to="/work/$slug"
                params={{ slug: p.slug }}
                data-cursor="view"
                className="group block"
              >
                <Frame
                  src={imgs[i % imgs.length] ?? imgs[0]!}
                  alt={`${p.name} — ${p.industry} case study preview`}
                  width={1280}
                  height={1024}
                  ratio={wide ? "16/10" : "4/5"}
                  depth={wide ? "mid" : "far"}
                  sizes={wide ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
                  imgClassName="saturate-[0.72] transition-[filter,transform] duration-[1200ms] ease-out group-hover:saturate-100 group-hover:scale-[1.04]"
                />

                <div data-work-meta className="mt-5 border-t border-border pt-4">
                  <div className="flex items-baseline justify-between gap-6">
                    <p className="type-meta text-foreground/60">
                      0{i + 1} — {p.year}
                    </p>
                    <p className="type-meta shrink-0 text-foreground/60">{p.industry}</p>
                  </div>

                  <h3 className="type-subtitle mt-4">
                    {p.name}
                    <span className="text-signal">.</span>
                  </h3>
                  <p className="type-body mt-2.5 max-w-[42ch] text-muted-foreground">
                    {p.summary}
                  </p>

                  <p className="type-body mt-5 flex items-center justify-between gap-6 border-t border-border pt-4 text-foreground/55">
                    <span className="min-w-0 truncate">{p.services.join(" · ")}</span>
                    <ArrowUpRight
                      className="size-5 shrink-0 text-signal transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* hands off into the film section's ink field */}
      {withSeam && <Seam side="bottom" />}
    </section>
  );
}
