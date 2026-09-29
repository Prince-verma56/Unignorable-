import { createFileRoute } from "@tanstack/react-router";
import { SiteFrame } from "@/components/SiteFrame";
import { ServicesList } from "@/components/sections/ServicesList";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHeader } from "@/components/PageHeader";
import campaignGlass from "@/assets/campaign-glass.jpg";

const title = "Services — UNIGNORABLE";
const description =
  "Nine disciplines: performance marketing, social, Google Ads, Meta Ads, web, SEO, video, animation and event marketing.";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <SiteFrame>
      <PageHeader
        label="Nine disciplines"
        title={"We don't do\none thing."}
        srTitle="Services"
        lead="Strategy, media, film and product, run by one senior team on one standard."
        media={{ src: campaignGlass, alt: "", width: 1024, height: 1280 }}
        index={"Nine disciplines"}
      />
      <ServicesList compact />
      <FinalCTA />
    </SiteFrame>
  );
}
