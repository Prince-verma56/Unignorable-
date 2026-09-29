export type ServiceSlug =
  | "performance-marketing"
  | "social-media-marketing"
  | "google-ads"
  | "meta-ads"
  | "web-development"
  | "seo"
  | "video-production"
  | "animation"
  | "event-marketing";

export interface Service {
  slug: ServiceSlug;
  index: string;
  title: string;
  short: string;
  discipline: string;
  hero: string;
  problem: { title: string; body: string };
  strategy: { title: string; body: string; points: string[] };
  execution: { title: string; body: string; points: string[] };
  benefits: string[];
  process: { step: string; label: string; body: string }[];
  layout: "split" | "stacked" | "offset";
}

const p = (step: string, label: string, body: string) => ({ step, label, body });

export const services: Service[] = [
  {
    slug: "performance-marketing",
    index: "01",
    title: "Performance Marketing",
    short: "Paid media engineered around profit, not vanity metrics.",
    discipline: "MEDIA",
    hero: "Spend that pays for itself.",
    problem: {
      title: "Budget burns. Nobody knows why.",
      body: "Most accounts are optimised for clicks, not contribution margin. Reporting looks healthy while the business feels nothing.",
    },
    strategy: {
      title: "Model the economics first",
      body: "We rebuild the account around unit economics — target CAC, payback window, channel mix.",
      points: ["CAC & LTV modelling", "Channel mix planning", "Creative testing roadmap", "Attribution hygiene"],
    },
    execution: {
      title: "Ship, read, repeat",
      body: "Weekly creative drops, structured tests, ruthless cutting of what doesn't compound.",
      points: ["Account restructure", "Creative sprints", "Landing page CRO", "Weekly performance review"],
    },
    benefits: ["Lower blended CAC", "Predictable pipeline", "Creative that scales", "Reporting a founder can read"],
    process: [
      p("01", "Audit", "Account, creative and tracking teardown."),
      p("02", "Model", "Targets set against real margin."),
      p("03", "Build", "Structure, creative, landing pages."),
      p("04", "Scale", "Budget follows evidence."),
    ],
    layout: "split",
  },
  {
    slug: "social-media-marketing",
    index: "02",
    title: "Social Media Marketing",
    short: "Channels with a point of view, not a posting schedule.",
    discipline: "CREATIVE",
    hero: "Be worth following.",
    problem: {
      title: "Consistent. Invisible.",
      body: "Posting every day is not a strategy. Without tension, the feed scrolls past you.",
    },
    strategy: {
      title: "One idea, many formats",
      body: "We find the angle only your brand can own, then build formats around it.",
      points: ["Platform-native positioning", "Content pillars", "Format system", "Community tone"],
    },
    execution: {
      title: "Production on a rhythm",
      body: "Monthly shoots, weekly edits, daily listening.",
      points: ["Shoot days", "Editorial calendar", "Short-form editing", "Community management"],
    },
    benefits: ["Recognisable at a glance", "Organic reach that compounds", "Creative library for paid", "Faster approvals"],
    process: [
      p("01", "Listen", "Audience, category, competitors."),
      p("02", "Angle", "The thing only you can say."),
      p("03", "Produce", "Shoot, edit, publish."),
      p("04", "Compound", "Double down on what lands."),
    ],
    layout: "offset",
  },
  {
    slug: "google-ads",
    index: "03",
    title: "Google Ads",
    short: "Intent captured cleanly, at a cost that makes sense.",
    discipline: "MEDIA",
    hero: "Own the moment of intent.",
    problem: {
      title: "You're paying for your own name.",
      body: "Bloated keyword sets, broad match leakage and ignored search terms quietly inflate cost per lead.",
    },
    strategy: {
      title: "Structure beats bidding",
      body: "Tight themes, clean negatives, conversion signals the algorithm can trust.",
      points: ["Search term mining", "Account restructure", "Offline conversion import", "Bid strategy selection"],
    },
    execution: {
      title: "Search, Shopping, PMax",
      body: "Each campaign type does one job and is judged on it.",
      points: ["Search build", "Shopping feed hygiene", "PMax asset groups", "Landing page alignment"],
    },
    benefits: ["Cleaner cost per qualified lead", "Less wasted spend", "Feed and asset hygiene", "Transparent reporting"],
    process: [
      p("01", "Teardown", "Where the money leaks."),
      p("02", "Rebuild", "Structure and signals."),
      p("03", "Launch", "Controlled ramp."),
      p("04", "Refine", "Weekly term review."),
    ],
    layout: "stacked",
  },
  {
    slug: "meta-ads",
    index: "04",
    title: "Meta Ads",
    short: "Creative volume, disciplined testing, honest numbers.",
    discipline: "MEDIA",
    hero: "The creative is the targeting.",
    problem: {
      title: "One ad. One angle. Flat results.",
      body: "Meta rewards creative variety. Most accounts starve the algorithm and blame the algorithm.",
    },
    strategy: {
      title: "Angles before assets",
      body: "We map objections, then build creative against each one.",
      points: ["Angle mapping", "Hook library", "Offer testing", "Incrementality sanity checks"],
    },
    execution: {
      title: "A machine for creative",
      body: "Consolidated structure, high creative throughput, clean read on what wins.",
      points: ["UGC & studio creative", "Static + motion variants", "Structured testing", "Retention-aware retargeting"],
    },
    benefits: ["More winning creative", "Stable delivery", "Lower CPA over time", "Reusable asset library"],
    process: [
      p("01", "Map", "Objections and angles."),
      p("02", "Produce", "Volume with intent."),
      p("03", "Test", "One variable at a time."),
      p("04", "Scale", "Winners get the budget."),
    ],
    layout: "split",
  },
  {
    slug: "web-development",
    index: "05",
    title: "Website Development",
    short: "Fast, considered sites that convert and age well.",
    discipline: "PRODUCT",
    hero: "Design that loads.",
    problem: {
      title: "Beautiful, heavy, unmeasured.",
      body: "A slow site quietly taxes every campaign you run.",
    },
    strategy: {
      title: "Structure, then surface",
      body: "Narrative, information architecture and performance budgets before a single gradient.",
      points: ["Content architecture", "Performance budget", "Design system", "Analytics plan"],
    },
    execution: {
      title: "Built properly",
      body: "Component systems, accessible markup, measured animation.",
      points: ["Design system build", "Front-end engineering", "CMS / data wiring", "Core Web Vitals pass"],
    },
    benefits: ["Sub-second feel", "Higher conversion", "Easy to extend", "Accessible by default"],
    process: [
      p("01", "Define", "Audience, story, metrics."),
      p("02", "Design", "Art direction and system."),
      p("03", "Build", "Engineering and QA."),
      p("04", "Launch", "Measure and iterate."),
    ],
    layout: "offset",
  },
  {
    slug: "seo",
    index: "06",
    title: "SEO",
    short: "Compounding organic demand, built on technical truth.",
    discipline: "GROWTH",
    hero: "Be the answer.",
    problem: {
      title: "Ranking for things nobody buys.",
      body: "Traffic without intent is a vanity chart.",
    },
    strategy: {
      title: "Demand-led keyword strategy",
      body: "We map the queries that sit closest to revenue and earn them.",
      points: ["Technical audit", "Intent mapping", "Content architecture", "Digital PR plan"],
    },
    execution: {
      title: "Fix, publish, earn",
      body: "Technical debt cleared, content shipped, authority built.",
      points: ["Core Web Vitals", "Schema & internal linking", "Editorial production", "Link acquisition"],
    },
    benefits: ["Lower blended CAC", "Durable traffic", "Better site health", "Content that sells"],
    process: [
      p("01", "Audit", "Crawl, index, speed."),
      p("02", "Map", "Queries to pages."),
      p("03", "Publish", "Content on a cadence."),
      p("04", "Earn", "Authority and coverage."),
    ],
    layout: "stacked",
  },
  {
    slug: "video-production",
    index: "07",
    title: "Video Production",
    short: "Films with a reason to exist — and a job to do.",
    discipline: "FILM",
    hero: "Make them stop.",
    problem: {
      title: "Pretty film. No pull.",
      body: "Craft without a hook is expensive wallpaper.",
    },
    strategy: {
      title: "Story before storyboard",
      body: "We write to the first three seconds and the last frame.",
      points: ["Concept development", "Scripting", "Casting & location", "Shot design"],
    },
    execution: {
      title: "Full production",
      body: "Crew, direction, post — with performance cutdowns from day one.",
      points: ["Direction & DOP", "Studio & location shoots", "Edit, grade, sound", "Paid cutdowns"],
    },
    benefits: ["Assets for every channel", "Stronger hooks", "Brand consistency", "Lower cost per asset"],
    process: [
      p("01", "Concept", "Idea and treatment."),
      p("02", "Prep", "Cast, crew, locations."),
      p("03", "Shoot", "On set, on brief."),
      p("04", "Post", "Edit, grade, deliver."),
    ],
    layout: "split",
  },
  {
    slug: "animation",
    index: "08",
    title: "Animation",
    short: "Motion, 2D, 3D and design in movement.",
    discipline: "MOTION",
    hero: "Movement with meaning.",
    problem: {
      title: "Motion added at the end.",
      body: "Animation bolted on after design rarely earns its render time.",
    },
    strategy: {
      title: "Design in motion",
      body: "We treat timing, weight and easing as part of the identity.",
      points: ["Motion language", "Storyboards", "Style frames", "Sound design brief"],
    },
    execution: {
      title: "Frame by frame",
      body: "2D, 3D, product loops and explainers — built for the platform they live on.",
      points: ["2D / cel animation", "3D & product renders", "Motion identity kits", "Social loops"],
    },
    benefits: ["Instantly recognisable", "Explains complex ideas", "Endlessly repurposable", "Platform-native"],
    process: [
      p("01", "Brief", "Message and format."),
      p("02", "Frames", "Style and storyboard."),
      p("03", "Animate", "Build and refine."),
      p("04", "Deliver", "Every ratio, every channel."),
    ],
    layout: "offset",
  },
  {
    slug: "event-marketing",
    index: "09",
    title: "Event Marketing",
    short: "Moments engineered to travel far beyond the room.",
    discipline: "EXPERIENCE",
    hero: "The room is the media.",
    problem: {
      title: "Great night. No afterlife.",
      body: "Events without a content engine die when the lights go up.",
    },
    strategy: {
      title: "Design for the recap",
      body: "We plan the edit before we plan the evening.",
      points: ["Concept & narrative", "Guest journey", "Content capture plan", "Amplification strategy"],
    },
    execution: {
      title: "On the ground",
      body: "Production, capture and same-day content.",
      points: ["Set & spatial design", "Live capture crew", "Same-day edits", "Paid amplification"],
    },
    benefits: ["Reach beyond attendance", "Content for months", "Stronger partner value", "Measurable outcomes"],
    process: [
      p("01", "Concept", "Why this, why now."),
      p("02", "Design", "Space and story."),
      p("03", "Run", "Production and capture."),
      p("04", "Amplify", "Cut, post, promote."),
    ],
    layout: "stacked",
  },
];

export const getService = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);
