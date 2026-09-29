import { useState } from "react";
import { ResponsiveImg } from "../media/Frame";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/data/services";
import { SplitLines } from "../Reveal";
import { useGsapContext } from "@/hooks/useGsapContext";
import { revealUp, START } from "@/lib/motion";
import studio1 from "@/assets/studio-1.jpg";
import studio2 from "@/assets/studio-2.jpg";
import campaignObject from "@/assets/campaign-object.jpg";

const previews = [studio2, campaignObject, studio1];

/**
 * Nine disciplines as one list.
 *
 * The preview has its own column rather than floating over the rows. It used to
 * be absolutely positioned at `right-[6vw]`, which is exactly where the row
 * descriptions are right-aligned — so the image sat on the copy it was meant to
 * illustrate. Rows now end at column 8 and the preview occupies 9-12, so the
 * two can never collide at any width.
 *
 * The row itself is the affordance, so the preview and the row shift are
 * enhancements that simply do not exist on touch — rather than the only way to
 * learn what a service is. Each row carries its own one-line summary from
 * `lg` up, which is what the baseline hid behind hover at `xl` only.
 */
export function ServicesList({ compact = false }: { compact?: boolean } = {}) {
  const [active, setActive] = useState<string | null>(null);
  const activeIndex = services.findIndex((s) => s.slug === active);

  const ref = useGsapContext<HTMLElement>((ctx) => {
    revealUp(ctx, "[data-service]", { start: START.early, stagger: 0.05, y: 20 });
  }, []);

  return (
    <section ref={ref} className="relative band" aria-labelledby="services-heading">
      {/* the route that owns this section states its own title; repeating it here
          would say the same thing twice in two type sizes */}
      {compact ? null : (
        <div className="edge">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-b border-border-strong pb-6">
            <div>
              <p className="type-meta text-signal">005 — Capabilities</p>
              <SplitLines
                as="h2"
                id="services-heading"
                text={"We don't do\none thing."}
                className="type-title mt-4 max-w-[9ch]"
                start={START.early}
              />
            </div>
            <p className="type-lead text-foreground/70 md:text-right">
              Nine disciplines. One team. One standard — because the strategist sits next
              to the edit bay.
            </p>
          </div>
        </div>
      )}

      <div className="edge relative mt-2">
        <div className="grid-12">
          <ul className="col-span-12 xl:col-span-8">
        {services.map((s) => {
          const isActive = active === s.slug;
          const dimmed = active !== null && !isActive;

          return (
            <li key={s.slug} data-service className="border-b border-border">
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                data-cursor="explore"
                onMouseEnter={() => setActive(s.slug)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(s.slug)}
                onBlur={() => setActive(null)}
                className="group relative flex items-center justify-between gap-6 px-5 py-6 md:px-7 transition-[background-color,color,opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-ink hover:text-ink-foreground focus-visible:bg-ink focus-visible:text-ink-foreground md:py-8"
                style={{
                  opacity: dimmed ? 0.4 : 1,
                  transform: isActive ? "translateX(0.75rem)" : "translateX(0)",
                }}
              >
                <div className="flex min-w-0 items-baseline gap-5 md:gap-8">
                  <span className="type-meta w-6 shrink-0 text-signal group-hover:text-acid">
                    {s.index}
                  </span>
                  <span className="type-title-sm truncate">{s.title}</span>
                </div>

                <div className="flex shrink-0 items-center gap-8">
                  <span
                    className="type-body hidden max-w-[30ch] text-right transition-opacity duration-500 lg:block xl:hidden"
                    style={{ opacity: isActive ? 1 : 0.55 }}
                  >
                    {s.short}
                  </span>
                  <ArrowUpRight
                    className="size-5 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </li>
          );
        })}
          </ul>

          {/*
            The preview rail. Its own column, sticky to the list, so it reads as
            part of the composition rather than a decoration floating over it —
            and so it can never sit on the row copy.
          */}
          <aside aria-hidden="true" className="col-span-3 col-start-10 hidden xl:block">
            <div className="sticky top-[24vh]">
              <div className="media-frame aspect-[4/5] border border-border">
                <img
                  src={previews[Math.max(0, activeIndex) % previews.length] ?? previews[0]!}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={1280}
                  height={1600}
                  className="size-full object-cover grayscale transition-[opacity,transform] duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    opacity: active ? 0.9 : 0.28,
                    transform: `scale(${active ? 1 : 1.05})`,
                  }}
                />
              </div>
              <p
                className="type-body mt-4 min-h-[3.75rem] text-muted-foreground transition-opacity duration-500"
                style={{ opacity: active ? 1 : 0 }}
              >
                {activeIndex >= 0 ? (services[activeIndex]?.short ?? "") : ""}
              </p>
            </div>
          </aside>
        </div>
      </div>

    </section>
  );
}
