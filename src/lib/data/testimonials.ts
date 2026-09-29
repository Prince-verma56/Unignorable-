/** DEMO testimonials — replace with real, attributed quotes before launch. */
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

export const clientLogos = [
  "MERIDIAN",
  "ATLAS",
  "NOVA",
  "HARBOUR",
  "KESTREL",
  "OKAPI",
  "NORTHBOUND",
  "SALT&CO",
  "VERDE",
  "LUMEN",
];
