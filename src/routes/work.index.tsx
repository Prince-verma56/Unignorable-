import { createFileRoute } from "@tanstack/react-router";
import { SiteFrame } from "@/components/SiteFrame";
import { WorkPreview } from "@/components/sections/WorkPreview";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHeader } from "@/components/PageHeader";
import campaignChrome from "@/assets/campaign-chrome.jpg";

const title = "Work — UNIGNORABLE";
const description =
  "Selected case studies: brand films, performance engines and products built to move the needle.";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/work" }],
  }),
  component: WorkIndex,
});

function WorkIndex() {
  return (
    <SiteFrame>
      <PageHeader
        label="Selected work — demo projects"
        title={"Proof, not\npromises."}
        srTitle="Work"
        accentLastLine
        lead="Case studies with the work, the thinking behind it, and the numbers that followed."
        media={{ src: campaignChrome, alt: "", width: 1408, height: 1008 }}
        index={"Selected work"}
      />
      <WorkPreview compact />
      <FinalCTA />
    </SiteFrame>
  );
}
