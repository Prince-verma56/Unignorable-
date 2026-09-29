import { createFileRoute } from "@tanstack/react-router";
import { SiteFrame } from "@/components/SiteFrame";
import { Process } from "@/components/sections/Process";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHeader } from "@/components/PageHeader";
import campaignObject from "@/assets/campaign-object.jpg";

const title = "Process — UNIGNORABLE";
const description =
  "Discover, strategize, create, launch, scale — how we take a brand from brief to compounding growth.";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/process" }],
  }),
  component: ProcessPage,
});

function ProcessPage() {
  return (
    <SiteFrame>
      <PageHeader
        label="The method"
        title={"Brief to\ncompounding."}
        srTitle="Process"
        accentLastLine
        lead="Five steps, no theatre. Each one ends in something you can look at and argue with."
        media={{ src: campaignObject, alt: "", width: 1280, height: 912 }}
        index={"Five steps"}
      />
      <Process />
      <FinalCTA />
    </SiteFrame>
  );
}
