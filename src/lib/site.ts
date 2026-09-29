export const site = {
  name: "GAME CHANGER",
  tagline: "Boutique. Digital-first. Unapologetic.",
  description:
    "Game Changer is a boutique, digital-first marketing agency built for GCC consumer brands that are tired of bloated retainers and generic strategies.",
  email: "hello@gamechangeragency.com",
  phone: "+971 4 XXX XXXX",
  whatsappNumber: "971400000000",
  locations: ["DUBAI", "RIYADH", "DOHA", "KUWAIT CITY", "MANAMA", "MUSCAT"],
  socials: [
    { label: "INSTAGRAM", href: "https://instagram.com" },
    { label: "LINKEDIN", href: "https://linkedin.com" },
  ],
} as const;

export const whatsappLink = (
  message = "Hi — I'd like to discuss a project.",
): string => `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const mailtoLink = (subject = "New project enquiry"): string =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

export const BUDGETS = [
  "AED 25K–50K",
  "AED 50K–100K",
  "AED 100K–300K",
  "AED 300K+",
  "Not Sure Yet",
] as const;

export const TIMELINES = [
  "ASAP",
  "Within 1 Month",
  "1–3 Months",
  "3+ Months",
  "Just Exploring",
] as const;
