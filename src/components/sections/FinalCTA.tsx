import { Link } from "@tanstack/react-router";
import { Action, ActionLink, ArrowTag } from "../ui/action";
import { ResponsiveImg } from "../media/Frame";
import { ArrowUpRight } from "lucide-react";
import { Magnetic } from "../Magnetic";
import { SplitLines } from "../Reveal";
import { useGsapContext } from "@/hooks/useGsapContext";
import { START, applyParallax, revealUp, riseIn } from "@/lib/motion";
import { site, whatsappLink } from "@/lib/site";
import campaignObject from "@/assets/campaign-object.jpg";

/**
 * The ask — and the start of the page's closing movement.
 *
 * This and the footer share one continuous ink field. The baseline ended a
 * cinematic page on a four-column sitemap set on paper, which read as an admin
 * screen (audit M9); the close is now one register from the last statement
 * through to the colophon.
 */
export function FinalCTA() {
  const ref = useGsapContext<HTMLElement>((ctx) => {
    riseIn(ctx, "[data-rise]", { distance: 7 });
    revealUp(ctx, "[data-cta-enter]", { start: START.base, stagger: 0.1 });
    applyParallax(ctx);
  }, []);

  const contacts = [
    { label: "WhatsApp", href: whatsappLink() },
    { label: "Email", href: `mailto:${site.email}` },
    ...site.socials.map((s) => ({ label: s.label, href: s.href })),
  ];

  return (
    <section
      ref={ref}
      data-register="ink"
      className="relative overflow-hidden band-lg"
      aria-labelledby="cta-heading"
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="media-inner" data-parallax="bg">
          <ResponsiveImg
            src={campaignObject}
            alt=""
            ariaHidden
            width={1280}
            height={912}
            className="opacity-[0.32] grayscale"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-ink via-ink/75 to-ink" />
      </div>

      {/* thin framing rules — the ending is composed, not just typeset */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute inset-x-[var(--edge-gutter)] top-0 h-px bg-border" />
        <span className="absolute inset-y-0 left-[var(--edge-gutter)] w-px bg-linear-to-b from-transparent via-border to-transparent" />
      </div>

      <div data-rise className="edge relative grid-12 items-end gap-y-12">
        <div className="col-span-12 lg:col-span-8">
          <p data-cta-enter className="type-meta text-bone/60">
            010 — Let’s go
          </p>
          <SplitLines
            as="h2"
            id="cta-heading"
            text={"Ready to Stop\nRenting\nAttention?"}
            className="type-display mt-6 max-w-[11ch]"
            lineClass={(_, i) =>
              i === 2 ? "editorial text-[1.06em] lowercase text-acid" : undefined
            }
          />

          <div
            data-cta-enter
            className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5 md:mt-16"
          >
            <Action asChild variant="inverse" size="lg" arrow={false}>
              <Link to="/contact" data-cursor="cta">
                Free 60-Min Organic Growth Audit
                <ArrowTag />
              </Link>
            </Action>

            {contacts.map((c) => (
              <a
                key={c.label}
                href={c.href}
                {...(c.href.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
                data-cursor="cta"
                className="text-bone/60 transition-colors hover:text-bone"
              >
                <ActionLink>{c.label}</ActionLink>
              </a>
            ))}
          </div>
        </div>

        {/*
          The metadata rail. It gives the right column something to hold, so the
          closing frame reads as a composition rather than a headline sitting in
          an empty field — and it is the last thing the reader sees, so it says
          where we are and that we are open.
        */}
        <dl
          data-cta-enter
          className="col-span-12 grid grid-cols-2 gap-x-8 gap-y-7 self-end border-t border-border pt-7 lg:col-span-3 lg:col-start-10 lg:grid-cols-1 lg:border-t-0 lg:pt-0"
        >
          {[
            { k: "Headquarters", v: "Dubai, UAE" },
            { k: "Markets", v: "6 GCC Markets" },
            { k: "Direct", v: site.email },
          ].map((row) => (
            <div key={row.k} className="border-t border-border pt-3.5 lg:pt-4">
              <dt className="type-meta text-bone/45">{row.k}</dt>
              <dd className="type-body mt-2 text-bone/85">{row.v}</dd>
            </div>
          ))}
        </dl>
      </div>

    </section>
  );
}
