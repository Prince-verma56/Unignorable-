/**
 * Testimonials — no real client testimonials were supplied in client materials.
 * Keeping existing structure with placeholder acknowledgment per content brief.
 */
export interface Testimonial {
  quote: string;
  client: string;
  role: string;
  company: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: "They argued with our brief, and they were right. That's the whole value.",
    client: "A. Rao",
    role: "Founder",
    company: "Demo Client One",
  },
  {
    quote: "The first agency that showed us numbers we didn't have to translate.",
    client: "M. Haddad",
    role: "Head of Growth",
    company: "Demo Client Two",
  },
  {
    quote: "Our team stopped asking what to post. The system answers it.",
    client: "S. Menon",
    role: "Marketing Director",
    company: "Demo Client Three",
  },
];

/** GCC market names used in the marquee — replace with real clients before launch. */
export const clientLogos = [
  "UAE",
  "KSA",
  "QATAR",
  "KUWAIT",
  "BAHRAIN",
  "OMAN",
  "DUBAI",
  "RIYADH",
  "DOHA",
  "MANAMA",
];
