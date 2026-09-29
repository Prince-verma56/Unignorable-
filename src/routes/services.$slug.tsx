import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ResponsiveImg } from "@/components/media/Frame";
import { ArrowUpRight } from "lucide-react";
import { SiteFrame } from "@/components/SiteFrame";
import { PageHeader } from "@/components/PageHeader";
import { Reveal, SplitLines } from "@/components/Reveal";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { useGsapContext } from "@/hooks/useGsapContext";
import { applyParallax, revealUp, scaleOnScroll, START } from "@/lib/motion";
import { getService, services } from "@/lib/data/services";
import studio1 from "@/assets/studio-1.jpg";
import studio2 from "@/assets/studio-2.jpg";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Not found — UNIGNORABLE" }, { name: "robots", content: "noindex" }],
      };
    }
    const { service } = loaderData;
    const title = `${service.title} — UNIGNORABLE`;
    return {
      meta: [
        { title },
        { name: "description", content: service.short },
        { property: "og:title", content: title },
        { property: "og:description", content: service.short },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/services/${service.slug}` }],
    };
  },
  component: ServicePage,
  notFoundComponent: () => (
    <SiteFrame>
      <div className="edge band-lg">
        <p className="type-title">Service not found.</p>
        <Link to="/services" className="type-meta link-underline mt-8 inline-block text-signal">
          All services ↗
        </Link>
      </div>
    </SiteFrame>
  ),
});

function ServicePage() {
  const { service: s } = Route.useLoaderData();
  const idx = services.findIndex((x) => x.slug === s.slug);
  const next = services[(idx + 1) % services.length]!;

  const ref = useGsapContext<HTMLDivElement>((ctx) => {
    revealUp(ctx, "[data-enter]", { start: START.base, stagger: 0.08 });
    applyParallax(ctx);
    scaleOnScroll(ctx, ctx.root.querySelector("[data-media]"), {
      from: 1.12,
      to: 1,
    });
  }, [s.slug]);

  return (
    <SiteFrame>
      <div ref={ref}>
        <PageHeader
          label={`${s.index} — ${s.discipline}`}
          title={s.title}
          lead={s.hero}
        />

        <section className="edge grid-12 gap-y-6 border-t border-border band-sm">
          <div className="col-span-12 md:col-span-4">
            <p className="type-meta text-signal">The problem</p>
            <SplitLines
              as="h2"
              text={s.problem.title}
              className="type-title-sm mt-4"
              start={START.base}
            />
          </div>
          <Reveal className="col-span-12 md:col-span-7 md:col-start-6">
            <p className="type-lead text-muted-foreground">{s.problem.body}</p>
          </Reveal>
        </section>

        {[s.strategy, s.execution].map((block, i) => (
          <section key={block.title} className="edge border-t border-border band-sm">
            <p className="type-meta text-signal">{i === 0 ? "Strategy" : "Execution"}</p>
            <div className="grid-12 mt-8 gap-y-8">
              <h2 className="type-title-sm col-span-12 max-w-[14ch] md:col-span-5">
                {block.title}
              </h2>
              <Reveal className="col-span-12 md:col-span-6 md:col-start-7">
                <p className="type-lead text-foreground/80">{block.body}</p>
                <ul className="mt-9 border-t border-border">
                  {block.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-baseline justify-between gap-6 border-b border-border py-3.5"
                    >
                      <span className="type-body">{pt}</span>
                      <span aria-hidden="true" className="type-meta text-signal">
                        +
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>
        ))}

        {/* the discipline plate — the page's one dark moment */}
        <section
          data-register="ink"
          className="relative flex h-[62svh] items-end overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="media-inner" data-parallax="bg">
              <ResponsiveImg
                dataMedia
                src={idx % 2 ? studio1 : studio2}
                alt=""
                ariaHidden
                width={1600}
                height={1067}
                className="opacity-40 grayscale"
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/60 to-ink/80" />
          </div>
          <p className="type-display edge relative pb-[clamp(2rem,6vh,4rem)]">
            {s.discipline}
            <span className="text-signal">.</span>
          </p>
        </section>

        <section className="edge border-t border-border band-sm">
          <p className="type-meta text-signal">What you get</p>
          <ul className="mt-10 grid gap-px bg-border md:grid-cols-2">
            {s.benefits.map((b) => (
              <li key={b} data-enter className="bg-background p-7 md:p-9">
                <p className="type-subtitle max-w-[22ch]">{b}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="edge border-t border-border band-sm">
          <p className="type-meta text-signal">Process</p>
          <ol className="mt-10">
            {s.process.map((step) => (
              <li
                key={step.step}
                data-enter
                className="grid-12 gap-y-3 border-t border-border py-7 first:border-t-0 first:pt-0"
              >
                <span className="type-meta col-span-12 text-muted-foreground md:col-span-1">
                  {step.step}
                </span>
                <h3 className="type-subtitle col-span-12 md:col-span-4">{step.label}</h3>
                <p className="type-body col-span-12 text-muted-foreground md:col-span-6 md:col-start-7">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <div className="edge flex flex-wrap items-center justify-between gap-4 border-t border-border py-10">
          <Link to="/services" className="type-meta link-underline text-muted-foreground">
            ← All services
          </Link>
          <Link
            to="/services/$slug"
            params={{ slug: next.slug }}
            data-cursor="explore"
            className="type-meta link-underline inline-flex items-center gap-2 text-signal"
          >
            Next: {next.title}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <FinalCTA />
    </SiteFrame>
  );
}
