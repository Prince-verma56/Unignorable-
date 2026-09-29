export const site = {
  name: "UNIGNORABLE",
  tagline: "We make brands impossible to ignore.",
  description:
    "Independent creative and performance studio. Strategy, media, film and product — built to be remembered.",
  email: "hello@unignorable.studio",
  phone: "+91 90000 00000",
  whatsappNumber: "919000000000",
  locations: ["INDIA", "UAE", "GLOBAL"],
  socials: [
    { label: "INSTAGRAM", href: "https://instagram.com" },
    { label: "LINKEDIN", href: "https://linkedin.com" },
  ],
} as const;

export const whatsappLink = (
  message = "Hi — I'd like to start a project.",
): string => `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const mailtoLink = (subject = "New project enquiry"): string =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

export const BUDGETS = [
  "₹25K–₹50K",
  "₹50K–₹1L",
  "₹1L–₹3L",
  "₹3L+",
  "Not Sure Yet",
] as const;

export const TIMELINES = [
  "ASAP",
  "Within 1 Month",
  "1–3 Months",
  "3+ Months",
  "Just Exploring",
] as const;
