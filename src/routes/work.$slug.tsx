import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteFrame } from "@/components/SiteFrame";
import { PageHeader } from "@/components/PageHeader";
import { Reveal, SplitLines } from "@/components/Reveal";
import { Frame } from "@/components/media/Frame";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { useGsapContext } from "@/hooks/useGsapContext";
import { applyParallax, counter, revealImage, revealUp, START } from "@/lib/motion";
import { getProject, projects } from "@/lib/data/work";
import hero from "@/assets/hero.jpg";
import studio1 from "@/assets/studio-1.jpg";
import studio2 from "@/assets/studio-2.jpg";

const imgs = [hero, studio1, studio2];

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Not found — UNIGNORABLE" }, { name: "robots", content: "noindex" }],
      };
    }
    const { project } = loaderData;
    const title = `${project.name} — Case study — UNIGNORABLE`;
    return {
      meta: [
        { title },
        { name: "description", content: project.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: project.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/work/${project.slug}` }],
    };
  },
  component: CaseStudy,
  notFoundComponent: () => (
    <SiteFrame>
      <div className="edge band-lg">
        <p className="type-title">Project not found.</p>
        <Link to="/work" className="type-meta link-underline mt-8 inline-block text-signal">
          Back to work ↗
        </Link>
      </div>
    </SiteFrame>
  ),
});

function CaseStudy() {
  const { project } = Route.useLoaderData();
  const next =
    projects[(projects.findIndex((p) => p.slug === project.slug) + 1) % projects.length]!;

  const ref = useGsapContext<HTMLElement>((ctx) => {
    revealImage(ctx, "[data-reveal-image]");
    revealUp(ctx, "[data-chapter-body]", { start: START.base });
    counter(ctx, "[data-count]");
    applyParallax(ctx);
  }, [project.slug]);

  return (
    <SiteFrame>
      <article ref={ref}>
        <PageHeader
          label={`${project.industry} — ${project.year}`}
          title={project.name}
          lead={project.summary}
          meta={project.services.join(" / ")}
        />

        {/*
          The key visual runs full-bleed at 21/9 and the accent word sits in the
          ink scrim rather than in `mix-blend-difference` over an arbitrary
          photograph, which in the baseline made it disappear entirely on dark
          frames.
        */}
        <Frame
          src={hero}
          alt={`${project.name} key visual`}
          width={1600}
          height={686}
          ratio="21/9"
          depth="mid"
          imgClassName="grayscale"
        >
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/85 to-ink/20" />
          <span className="type-display pointer-events-none absolute bottom-5 left-[var(--edge-gutter)] text-bone/90">
            {project.accentWord}
          </span>
        </Frame>

        <div className="edge">
          {project.chapters.map((c, i) => (
            <section key={c.no} className="grid-12 gap-y-6 border-b border-border band-sm">
              <div className="col-span-12 md:col-span-4 md:sticky md:top-28 md:self-start">
                <p className="type-meta text-signal">{c.no}</p>
                <SplitLines
                  as="h2"
                  text={c.title}
                  className="type-title-sm mt-3"
                  start={START.base}
                />
              </div>
              <Reveal className="col-span-12 md:col-span-7 md:col-start-6">
                <p data-chapter-body className="type-lead text-foreground/80">
                  {c.body}
                </p>
                {i % 2 === 1 ? (
                  <Frame
                    src={imgs[(i + 1) % imgs.length] ?? imgs[0]!}
                    alt={`${project.name} — ${c.title}`}
                    width={1280}
                    height={800}
                    ratio="16/10"
                    depth="far"
                    className="mt-9"
                    imgClassName="grayscale"
                  />
                ) : null}
              </Reveal>
            </section>
          ))}

          <section className="band-sm">
            <p className="type-meta text-signal">Results — demo placeholders</p>
            <dl className="grid-12 mt-10 gap-y-10">
              {project.results.map((r) => (
                <div key={r.label} className="col-span-12 border-t border-border pt-4 md:col-span-4">
                  <dd className="type-numeral text-[clamp(3rem,6vw,5rem)]">{r.value}</dd>
                  <dt className="type-meta mt-4 text-muted-foreground">{r.label}</dt>
                </div>
              ))}
            </dl>
          </section>

          <nav
            className="flex flex-wrap items-center justify-between gap-4 border-t border-border py-10"
            aria-label="Case studies"
          >
            <Link to="/work" className="type-meta link-underline text-muted-foreground">
              ← All work
            </Link>
            <Link
              to="/work/$slug"
              params={{ slug: next.slug }}
              data-cursor="view"
              className="type-meta link-underline inline-flex items-center gap-2 text-signal"
            >
              Next: {next.name}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </article>
      <FinalCTA />
    </SiteFrame>
  );
}
