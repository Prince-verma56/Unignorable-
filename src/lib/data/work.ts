/**
 * DEMO PROJECTS — placeholder case studies.
 * Replace the objects below with real client work; the shape stays the same.
 */
export interface CaseChapter {
  no: string;
  title: string;
  body: string;
}

export interface Project {
  slug: string;
  name: string;
  industry: string;
  year: string;
  services: string[];
  summary: string;
  accentWord: string;
  chapters: CaseChapter[];
  results: { value: string; label: string }[];
}

export const projects: Project[] = [
  {
    slug: "meridian-coffee",
    name: "Meridian Coffee",
    industry: "F&B / Retail",
    year: "2026",
    accentWord: "RITUAL",
    services: ["Brand Film", "Performance Marketing", "Social"],
    summary: "A specialty roaster rebuilt around a single daily ritual.",
    chapters: [
      { no: "01", title: "The Challenge", body: "A loved local roaster with no reason to exist outside its own neighbourhood. Demo brief." },
      { no: "02", title: "The Strategy", body: "Stop selling beans. Sell the ten minutes before the day starts." },
      { no: "03", title: "The Execution", body: "A film series shot at 6am, a format system for social, and a paid engine built on the same idea." },
      { no: "04", title: "The Result", body: "Demo placeholder — replace with verified performance data before publishing." },
      { no: "05", title: "The Impact", body: "A brand with a recognisable point of view and a creative library to keep feeding it." },
    ],
    results: [
      { value: "—", label: "Revenue lift" },
      { value: "—", label: "CAC change" },
      { value: "—", label: "Reach" },
    ],
  },
  {
    slug: "atlas-fitness",
    name: "Atlas Fitness",
    industry: "Fitness / Membership",
    year: "2025",
    accentWord: "DISCIPLINE",
    services: ["Meta Ads", "Video Production", "Web Development"],
    summary: "A gym chain that stopped shouting about discounts.",
    chapters: [
      { no: "01", title: "The Challenge", body: "Membership growth tied entirely to price promotions. Demo brief." },
      { no: "02", title: "The Strategy", body: "Reposition around discipline and community instead of discounting." },
      { no: "03", title: "The Execution", body: "Member-led films, a new site built for trial sign-ups, and a paid structure built on angles." },
      { no: "04", title: "The Result", body: "Demo placeholder — replace with verified performance data before publishing." },
      { no: "05", title: "The Impact", body: "A brand that can raise price without losing volume." },
    ],
    results: [
      { value: "—", label: "Trial sign-ups" },
      { value: "—", label: "Cost per trial" },
      { value: "—", label: "Retention" },
    ],
  },
  {
    slug: "nova-interiors",
    name: "Nova Interiors",
    industry: "Design / Luxury",
    year: "2025",
    accentWord: "RESTRAINT",
    services: ["SEO", "Website Development", "Animation"],
    summary: "A studio whose website finally matched its work.",
    chapters: [
      { no: "01", title: "The Challenge", body: "World-class projects, a website that loaded in six seconds. Demo brief." },
      { no: "02", title: "The Strategy", body: "Editorial architecture, strict performance budget, organic demand mapped to intent." },
      { no: "03", title: "The Execution", body: "Full rebuild, motion identity and a technical SEO programme." },
      { no: "04", title: "The Result", body: "Demo placeholder — replace with verified performance data before publishing." },
      { no: "05", title: "The Impact", body: "Inbound enquiries from the segment they actually want." },
    ],
    results: [
      { value: "—", label: "Organic sessions" },
      { value: "—", label: "Load time" },
      { value: "—", label: "Enquiries" },
    ],
  },
  {
    slug: "harbour-festival",
    name: "Harbour Festival",
    industry: "Events / Culture",
    year: "2024",
    accentWord: "CROWD",
    services: ["Event Marketing", "Video Production", "Social"],
    summary: "A city festival designed for the recap, not just the night.",
    chapters: [
      { no: "01", title: "The Challenge", body: "Strong attendance, zero cultural footprint afterwards. Demo brief." },
      { no: "02", title: "The Strategy", body: "Plan the edit before the event. Build capture into the layout." },
      { no: "03", title: "The Execution", body: "Spatial design, three capture crews, same-day cutdowns, paid amplification." },
      { no: "04", title: "The Result", body: "Demo placeholder — replace with verified performance data before publishing." },
      { no: "05", title: "The Impact", body: "Sponsorship conversations that start from evidence." },
    ],
    results: [
      { value: "—", label: "Content pieces" },
      { value: "—", label: "Views" },
      { value: "—", label: "Sponsor value" },
    ],
  },
];

export const getProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);
