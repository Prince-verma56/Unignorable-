export type ServiceSlug =
  | "retail-experiences"
  | "posm"
  | "sales-promoters"
  | "social-media"
  | "digital-performance"
  | "influencer-management"
  | "pr"
  | "atl-media"
  | "event-management";

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
    slug: "retail-experiences",
    index: "01",
    title: "Retail Experiences",
    short: "Immersive. Converting. Memorable.",
    discipline: "RETAIL",
    hero: "Turn Browsers Into Buyers.",
    problem: {
      title: "Footfall without conversion is just noise.",
      body: "Brands spend on shelf space and walk away without a strategy to convert. Pop-ups without design, sampling without a story.",
    },
    strategy: {
      title: "Engineer the in-store moment",
      body: "Pop-ups, brand zones, sampling stations & gondola takeovers designed to generate shareable in-store moments.",
      points: [
        "Pop-ups & brand zones",
        "Sampling stations",
        "Gondola takeovers",
        "Shareable moment design",
      ],
    },
    execution: {
      title: "All 6 GCC markets",
      body: "Hypermarkets, malls, specialty retail across all 6 GCC markets.",
      points: [
        "Hypermarkets & malls",
        "Specialty retail",
        "Multi-market simultaneous deployment",
        "On-ground brand teams",
      ],
    },
    benefits: [
      "Higher in-store conversion",
      "Shareable moments that extend reach",
      "Brand presence at point of decision",
      "Measurable uplift",
    ],
    process: [
      p("01", "Design", "Concept, spatial design, brand moment."),
      p("02", "Produce", "Fabrication and brand materials."),
      p("03", "Deploy", "On-ground activation across target markets."),
      p("04", "Measure", "Footfall, conversion, social reach."),
    ],
    layout: "split",
  },
  {
    slug: "posm",
    index: "02",
    title: "POSM",
    short: "Shelf presence that sells.",
    discipline: "RETAIL",
    hero: "Own the Shelf.",
    problem: {
      title: "Products get lost. Competitors own the eye.",
      body: "Without strategic shelf presence, even great products go unnoticed at the moment that matters most.",
    },
    strategy: {
      title: "In-house design, regional production",
      body: "Shelf talkers, wobblers, standees, display units & branded fixtures — in-house design with a regional production network.",
      points: [
        "Shelf talkers & wobblers",
        "Standees & display units",
        "Branded fixtures",
        "In-house design",
      ],
    },
    execution: {
      title: "Compliant across all major GCC chains",
      body: "Compliant with Carrefour, LuLu, Panda, Spinneys & all major GCC chains.",
      points: [
        "Carrefour & LuLu compliance",
        "Panda & Spinneys standards",
        "Regional production network",
        "Fast turnaround",
      ],
    },
    benefits: [
      "Stronger shelf standout",
      "Retail-compliant execution",
      "In-house design speed",
      "Lower production cost",
    ],
    process: [
      p("01", "Brief", "Category, retailer, brand objective."),
      p("02", "Design", "In-house creative with retailer specs."),
      p("03", "Produce", "Regional production network."),
      p("04", "Deploy", "Rollout across target markets."),
    ],
    layout: "offset",
  },
  {
    slug: "sales-promoters",
    index: "03",
    title: "Sales Promoters",
    short: "Human. Trained. Converting.",
    discipline: "RETAIL",
    hero: "The right person converts 30–40% more.",
    problem: {
      title: "Displays don't answer questions. People do.",
      body: "The right person at the right shelf converts 30–40% more units than any display ever will.",
    },
    strategy: {
      title: "Recruit. Train. Deploy. Report. Scale.",
      body: "Handpicked for your brand, category & market. Brand-immersed, product-expert, sales-ready.",
      points: [
        "Recruit for your brand & category",
        "Brand immersion training",
        "Product expertise",
        "Sales-ready deployment",
      ],
    },
    execution: {
      title: "5 to 500+ promoters. Flex on demand.",
      body: "Hypermarkets, pharmacies, electronics & specialty retail. Live dashboards, weekly performance by store & market.",
      points: [
        "Hypermarkets & pharmacies",
        "Electronics & specialty retail",
        "Live dashboards",
        "Weekly performance by store & market",
      ],
    },
    benefits: [
      "30–40% higher conversion at shelf",
      "Flexible scale for Ramadan & launches",
      "Multilingual teams",
      "Live performance reporting",
    ],
    process: [
      p("01", "Recruit", "Handpicked for your brand, category & market."),
      p("02", "Train", "Brand-immersed, product-expert, sales-ready."),
      p("03", "Deploy", "Hypermarkets, pharmacies, electronics & specialty."),
      p("04", "Report", "Live dashboards, weekly performance by store & market."),
      p("05", "Scale", "5 to 500+ promoters. Flex for Ramadan, launches & peaks."),
    ],
    layout: "stacked",
  },
  {
    slug: "social-media",
    index: "04",
    title: "Social Media",
    short: "Organic reach engine.",
    discipline: "DIGITAL",
    hero: "Content the audience spreads for you.",
    problem: {
      title: "Paid posts die the moment the budget stops.",
      body: "Posting without strategy is invisible. Content without shareability costs a dirham for every impression.",
    },
    strategy: {
      title: "Platform-native. GCC-calendar-aligned.",
      body: "Instagram, TikTok, Snapchat, X, LinkedIn, YouTube — platform-native content strategies built for shareability.",
      points: [
        "Platform-native content strategy",
        "Arabic-English bilingual",
        "Ramadan, Eid, National Days, DSF, White Friday",
        "Shareability-first content design",
      ],
    },
    execution: {
      title: "Organic reach that drives cost-per-impression to near zero",
      body: "Content built for shareability — audiences spread it for you. Avg. 4.2x organic engagement growth within 6 months.",
      points: [
        "Organic engagement growth",
        "Community-driven reach",
        "Up to 30% paid budget reduction",
        "Content as a compounding asset",
      ],
    },
    benefits: [
      "4.2x organic engagement growth within 6 months",
      "Paid budgets reduced by up to 30%",
      "Near-zero cost-per-impression",
      "GCC-calendar aligned content",
    ],
    process: [
      p("01", "Audit", "Current channels, content, engagement baseline."),
      p("02", "Strategy", "Platform mix, content pillars, calendar."),
      p("03", "Produce", "Platform-native content at scale."),
      p("04", "Compound", "Double down on what earns organic traction."),
    ],
    layout: "split",
  },
  {
    slug: "digital-performance",
    index: "05",
    title: "Digital & Performance",
    short: "Precision. No waste.",
    discipline: "DIGITAL",
    hero: "Paid-Smart, Not Paid-Heavy.",
    problem: {
      title: "Paid media that doesn't compound is just renting.",
      body: "SEO & content marketing first — free, compounding traffic that reduces paid dependency over time.",
    },
    strategy: {
      title: "SEO first. Paid only amplifies what's performing.",
      body: "Paid (Google, Meta, TikTok, Programmatic) only amplifies what's already performing organically.",
      points: [
        "SEO & content marketing first",
        "Compounding free traffic",
        "Precision paid amplification",
        "Zero wasted spend",
      ],
    },
    execution: {
      title: "A/B creative testing, bid optimization, CRO",
      body: "Precision targeting: A/B creative testing, bid optimization, zero wasted spend. E-commerce: retargeting, CRO, and product listing ads on Noon & Amazon.ae.",
      points: [
        "Google, Meta, TikTok, Programmatic",
        "A/B creative testing",
        "Retargeting & CRO",
        "Noon & Amazon.ae product listing ads",
      ],
    },
    benefits: [
      "Reduced paid dependency over time",
      "Compounding SEO traffic",
      "Zero wasted spend",
      "E-commerce conversion optimization",
    ],
    process: [
      p("01", "Audit", "Paid vs. organic split, current performance."),
      p("02", "SEO", "Content & technical foundation first."),
      p("03", "Amplify", "Paid only on what's organically proven."),
      p("04", "Optimize", "A/B test, refine, reduce cost continuously."),
    ],
    layout: "offset",
  },
  {
    slug: "influencer-management",
    index: "06",
    title: "Influencer Management",
    short: "Micro. Authentic. Affordable.",
    discipline: "EARNED",
    hero: "Micro > Mega. Always.",
    problem: {
      title: "Mega deals buy reach. Micro builds trust.",
      body: "Micro (10K–100K) & nano (1K–10K) influencers: 60% higher engagement, 6x more cost-effective than mega deals.",
    },
    strategy: {
      title: "2,000+ vetted GCC creators across all tiers",
      body: "Authentic community advocacy — not paid celebrity endorsements. Network of 2,000+ vetted GCC creators across all tiers.",
      points: [
        "Micro & nano influencer focus",
        "2,000+ vetted GCC creators",
        "Authentic community advocacy",
        "Brand-aligned selection",
      ],
    },
    execution: {
      title: "Content repurposed as owned brand assets",
      body: "Influencer content repurposed as owned brand assets, extending campaign life at zero added cost.",
      points: [
        "60% higher engagement",
        "6x more cost-effective than mega deals",
        "Content repurposed as brand assets",
        "Zero added cost for extended life",
      ],
    },
    benefits: [
      "60% higher engagement vs. mega influencers",
      "6x more cost-effective",
      "Authentic community trust",
      "Campaign content reused as brand assets",
    ],
    process: [
      p("01", "Brief", "Brand, category, audience, objective."),
      p("02", "Select", "Matched from 2,000+ vetted GCC creators."),
      p("03", "Activate", "Content production and deployment."),
      p("04", "Repurpose", "Influencer content becomes owned brand assets."),
    ],
    layout: "stacked",
  },
  {
    slug: "pr",
    index: "07",
    title: "PR",
    short: "Earned media. Free impressions.",
    discipline: "EARNED",
    hero: "Earned Media = Free Impressions.",
    problem: {
      title: "Paid brand awareness spend is permanent — PR reduces it.",
      body: "One Forbes ME feature > AED 500,000 in display advertising — with more credibility.",
    },
    strategy: {
      title: "Coverage in 50+ GCC publications",
      body: "Coverage in Gulf News, Khaleej Times, Arab News, Forbes Middle East & 50+ GCC publications.",
      points: [
        "Gulf News & Khaleej Times",
        "Arab News & Forbes Middle East",
        "50+ GCC publications",
        "AVE-measured results",
      ],
    },
    execution: {
      title: "Every campaign measured by AVE",
      body: "Every campaign measured by AVE — we show you exactly what you got for free. PR reduces paid brand awareness spend. Permanently.",
      points: [
        "Quantified free impressions",
        "AVE reporting on every campaign",
        "Permanent reduction in paid spend",
        "Credibility that ads cannot buy",
      ],
    },
    benefits: [
      "Free impressions with credibility",
      "Permanent reduction in paid brand awareness spend",
      "Forbes ME > AED 500K in display value",
      "AVE-measured ROI",
    ],
    process: [
      p("01", "Pitch", "Story angles that earn coverage."),
      p("02", "Target", "Right publications for your category."),
      p("03", "Place", "Secured coverage across GCC media."),
      p("04", "Measure", "AVE — exactly what you got for free."),
    ],
    layout: "split",
  },
  {
    slug: "atl-media",
    index: "08",
    title: "ATL Media",
    short: "Amplify what's working.",
    discipline: "MEDIA",
    hero: "ATL Only When It Earns Its Place.",
    problem: {
      title: "ATL as default burns budgets with no compounding.",
      body: "TV, radio, OOH/DOOH, cinema, print — deployed as amplifiers, never as default.",
    },
    strategy: {
      title: "Digital OOH prioritized — targeted, measurable, switchable.",
      body: "Negotiated rates across GCC broadcasters, JCDecaux, Viola, Al Arabiya Outdoor.",
      points: [
        "GCC broadcasters",
        "JCDecaux & Viola",
        "Al Arabiya Outdoor",
        "Digital OOH prioritized",
      ],
    },
    execution: {
      title: "Only when organic momentum is proven.",
      body: "We only recommend ATL when organic momentum is already proven. Targeted, measurable, switchable.",
      points: [
        "TV, radio, OOH/DOOH",
        "Cinema & print",
        "Amplifier — not default",
        "Organic-first, ATL second",
      ],
    },
    benefits: [
      "ATL that amplifies proven organic",
      "Negotiated GCC broadcaster rates",
      "Targeted DOOH — measurable & switchable",
      "No ATL spend without organic proof",
    ],
    process: [
      p("01", "Prove", "Organic momentum established first."),
      p("02", "Plan", "ATL channels matched to the objective."),
      p("03", "Negotiate", "Rates across GCC broadcasters & OOH."),
      p("04", "Amplify", "ATL accelerates what organic built."),
    ],
    layout: "offset",
  },
  {
    slug: "event-management",
    index: "09",
    title: "Event Management",
    short: "Built to go viral.",
    discipline: "EXPERIENCE",
    hero: "Every Event Is a Content Machine.",
    problem: {
      title: "Great night. No organic afterlife.",
      body: "Events without an organic content engine die when the lights go up.",
    },
    strategy: {
      title: "Organic social reach = 10x the event cost in paid equivalent.",
      body: "Brand launches, community events & pop-ups engineered for shareable moments.",
      points: [
        "Brand launches & community events",
        "Pop-ups engineered for sharing",
        "Organic reach over attendance metrics",
        "Content machine from day one",
      ],
    },
    execution: {
      title: "In-house — no subcontracting, no inflated costs.",
      body: "In-house creative, production & on-ground teams — no subcontracting, no inflated costs.",
      points: [
        "In-house creative & production",
        "On-ground teams",
        "No subcontracting",
        "Measured by organic social reach",
      ],
    },
    benefits: [
      "10x event cost in paid media equivalent",
      "In-house creative & production",
      "No subcontracting markup",
      "Measured by organic reach, not attendance",
    ],
    process: [
      p("01", "Concept", "Built for shareability from the first idea."),
      p("02", "Design", "Space, story, and content capture plan."),
      p("03", "Execute", "In-house production, on-ground teams."),
      p("04", "Measure", "Organic social reach — not just attendance."),
    ],
    layout: "stacked",
  },
];

export const getService = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);
