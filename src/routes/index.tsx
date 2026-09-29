import { createFileRoute } from "@tanstack/react-router";
import { SiteFrame } from "@/components/SiteFrame";
import { Hero } from "@/components/sections/Hero";
import { SignalStrip } from "@/components/sections/SignalStrip";
import { CampaignGrid } from "@/components/sections/CampaignGrid";
import { EditorialMonolith } from "@/components/sections/EditorialMonolith";
import { Statement } from "@/components/sections/Statement";
import { Stats } from "@/components/sections/Stats";
import { ServicesList } from "@/components/sections/ServicesList";
import { WorkPreview } from "@/components/sections/WorkPreview";
import { VideoSection } from "@/components/sections/VideoSection";
import { AboutBlock } from "@/components/sections/AboutBlock";
import { Testimonials } from "@/components/sections/Testimonials";
import { Marquee } from "@/components/sections/Marquee";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { site } from "@/lib/site";

const title = `${site.name} — The GCC's Organic-First Growth Partner`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: site.description },
      { property: "og:title", content: title },
      { property: "og:description", content: site.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      /*
       * The hero video is the LCP element. Preload it.
       */
      {
        rel: "preload",
        as: "video",
        href: "/Videos/UNIGNORABLE Video 1.mp4",
        type: "video/mp4",
        fetchPriority: "high",
      },
    ],
  }),
  component: Index,
});

/**
 * One composition in ten movements. The order, the register of each section and
 * the hand-off between them are specified in /brain/SECTION_ARCHITECTURE.md —
 * change them there first.
 *
 * Registers run: paper · cobalt · paper · paper · INK · paper-deep · paper ·
 * paper · INK · paper · paper-deep · paper · INK. Three dark moments, evenly
 * spaced, each one earning the next stretch of paper.
 */
function Index() {
  return (
    <SiteFrame>
      <Hero />
      <SignalStrip />
      <CampaignGrid />
      <EditorialMonolith />
      <Statement />
      <Stats />
      <ServicesList />
      <WorkPreview />
      <VideoSection />
      <AboutBlock />
      <Testimonials />
      <Marquee />
      <FinalCTA />
    </SiteFrame>
  );
}
