import { createFileRoute } from "@tanstack/react-router";
import { SiteFrame } from "@/components/SiteFrame";
import { AboutBlock } from "@/components/sections/AboutBlock";
import { Stats } from "@/components/sections/Stats";
import { Marquee } from "@/components/sections/Marquee";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHeader } from "@/components/PageHeader";
import studio1 from "@/assets/studio-1.jpg";

const title = "About — UNIGNORABLE";
const description =
  "An independent studio of strategists, designers, developers, media buyers and storytellers turning attention into business.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteFrame>
      <PageHeader
        label="The studio"
        title={"Turning attention\ninto business."}
        srTitle="About"
        lead="One team of strategists, designers, developers, media buyers and storytellers — no handoffs, no subcontracting, no translation layer."
        media={{ src: studio1, alt: "", width: 1280, height: 1024 }}
        index={"The studio"}
      />
      <AboutBlock withSeam={false} />
      <Stats withSeam={false} />
      <Marquee />
      <FinalCTA />
    </SiteFrame>
  );
}
