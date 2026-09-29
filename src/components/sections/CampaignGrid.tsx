import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useGsapContext } from "@/hooks/useGsapContext";
import { applyParallax, revealImage, revealUp, START } from "@/lib/motion";
import { Frame } from "../media/Frame";
import campaignChrome from "@/assets/campaign-chrome.jpg";
import campaignFilm from "@/assets/campaign-film.jpg";
import campaignGlass from "@/assets/campaign-glass.jpg";

const principles = [
  "Radical strategy",
  "Editorial precision",
  "Kinetic motion",
  "Measurable impact",
];

/**
 * The studio reel — the first look at the work.
 *
 * Rebuilt from the baseline grid, which fixed its row heights
 * (`grid-rows-[minmax(22rem,55vh)…]`) while its cells laid out with
 * `justify-between`, so the cobalt cell's own headline was cut off (audit H2).
 * Height now comes from the four sanctioned aspect ratios, and the frames sit
 * on two different depth layers — layers that share a magnitude cancel out.
 */
export function CampaignGrid() {
  const ref = useGsapContext<HTMLElement>((ctx) => {
    revealUp(ctx, "[data-head] > *", { start: START.early, y: 24 });
    revealUp(ctx, "[data-grid-enter]", { start: START.base, stagger: 0.07, y: 18 });
    revealImage(ctx, "[data-reveal-image]");
    applyParallax(ctx);
  }, []);

  return (
    <section ref={ref} className="edge band-sm" aria-labelledby="reel-heading">
      <header
        data-head
        className="mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-5 border-b border-border-strong pb-6 md:mb-14"
      >
        <div>
          <p className="type-meta text-signal">001 — Studio reel</p>
          <h2 id="reel-heading" className="type-title mt-4 max-w-[11ch]">
            Density with direction
          </h2>
        </div>
        <p className="type-lead text-foreground/70 md:text-right">
          Every frame earns attention. Every interaction moves the story.
        </p>
      </header>

      <div className="grid-12 gap-y-(--gutter)">
        {/* the dominant frame — the anchor of the composition */}
        <Link
          to="/work"
          data-cursor="view"
          className="group col-span-12 lg:col-span-8"
          aria-label="See the studio reel"
        >
          <Frame
            src={campaignChrome}
            alt="Liquid chrome campaign artwork in cobalt light"
            width={1408}
            height={1008}
            ratio="16/10"
            depth="mid"
            imgClassName="transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/15 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 text-bone md:p-8">
              <div>
                <p className="type-meta text-bone/75">Reel — 2026</p>
                <p className="type-title-sm mt-2.5">Matter / Motion</p>
              </div>
              <ArrowUpRight
                className="size-11 shrink-0 border border-bone/35 p-2.5 transition-colors duration-300 group-hover:border-transparent group-hover:bg-bone group-hover:text-ink"
                aria-hidden="true"
              />
            </div>
          </Frame>
        </Link>

        {/*
          The operating-system statement.
          
          Was a flat cobalt block, which read as a UI panel dropped into a page
          of photography. It is now an ink field with the accent carried by
          oversized lime type and a single hairline — the same architectural
          language as the imagery beside it, rather than a coloured rectangle.
        */}
        <div
          data-register="ink"
          className="relative col-span-12 flex flex-col justify-between gap-10 overflow-hidden p-7 md:p-9 lg:col-span-4"
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-px bg-linear-to-b from-transparent via-acid to-transparent"
          />
          <div>
            <p data-grid-enter className="type-meta text-bone/60">
              Our operating system
            </p>
            <p data-grid-enter className="type-title-sm mt-7 max-w-[9ch]">
              Built to be
              <span className="editorial block text-[1.2em] lowercase text-acid">remembered</span>
            </p>
            <p data-grid-enter className="type-body mt-7 max-w-[30ch] text-bone/65">
              Nine disciplines under one roof, so the idea that survives the strategy deck
              is the same one that ships.
            </p>
          </div>
          <ul>
            {principles.map((item, i) => (
              <li
                key={item}
                data-grid-enter
                className="type-meta flex items-baseline justify-between gap-4 border-t border-border py-3.5 last:pb-0"
              >
                <span className="text-acid">0{i + 1}</span>
                <span className="text-bone/80">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* the second row shares one baseline and one depth layer */}
        <Frame
          src={campaignFilm}
          alt="Editorial figure wrapped in translucent campaign film"
          width={1008}
          height={1312}
          ratio="4/5"
          depth="far"
          className="col-span-12 sm:col-span-5 lg:col-span-4"
        >
          <p className="type-meta absolute bottom-5 left-5 text-bone">/ Art direction</p>
        </Frame>

        <Frame
          src={campaignGlass}
          alt="Iridescent glass campaign study"
          width={1024}
          height={1280}
          ratio="16/10"
          depth="far"
          className="col-span-12 sm:col-span-7 lg:col-span-8"
        >
          <p className="type-meta absolute bottom-5 left-5 text-bone">/ Culture</p>
        </Frame>
      </div>
    </section>
  );
}
