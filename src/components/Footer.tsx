import { Link } from "@tanstack/react-router";
import { site, whatsappLink } from "@/lib/site";
import { services } from "@/lib/data/services";
import { NewsletterForm } from "./sections/Newsletter";

const navLinks = [
  { to: "/work", label: "Work" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/process", label: "Process" },
  { to: "/contact", label: "Contact" },
] as const;

/**
 * The colophon — the last movement of the ink close that begins at FinalCTA,
 * not a separate admin screen on paper. The newsletter lives here rather than
 * as its own band between the CTA and the footer, which broke the ending.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-register="ink" className="edge pb-8 pt-2">
      <div className="grid-12 gap-y-12 border-t border-border pt-14">
        <div className="col-span-12 lg:col-span-5">
          <Link to="/" className="type-title block max-w-[9ch] text-[clamp(2rem,4vw,3.5rem)]">
            {site.name}
            <span className="text-signal">.</span>
          </Link>
          <p className="type-body mt-5 max-w-[30ch] text-muted-foreground">{site.tagline}</p>
          <p className="type-meta mt-8 text-bone/60">{site.locations.join(" / ")}</p>
        </div>

        <nav className="col-span-6 md:col-span-3 lg:col-span-2" aria-label="Footer">
          <p className="type-meta mb-5 text-bone/60">Navigate</p>
          <ul className="space-y-2.5">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="type-body link-underline text-foreground/75 transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-6 md:col-span-4 lg:col-span-2">
          <p className="type-meta mb-5 text-bone/60">Services</p>
          <ul className="space-y-2.5">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="type-body link-underline text-foreground/75 transition-colors hover:text-foreground"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 md:col-span-5 lg:col-span-3">
          <p className="type-meta mb-5 text-bone/60">Contact</p>
          <ul className="space-y-2.5">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="type-body link-underline transition-colors hover:text-signal"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="type-body link-underline transition-colors hover:text-signal"
              >
                WhatsApp
              </a>
            </li>
            <li className="type-body text-muted-foreground">{site.phone}</li>
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="type-body link-underline capitalize transition-colors hover:text-signal"
                >
                  {s.label.toLowerCase()}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <NewsletterForm />

      <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-start">
        <p className="type-meta text-bone/60">
          © {year} {site.name}
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <p className="type-meta text-bone/60">Built to be remembered.</p>
          <span className="hidden type-meta text-bone/30 sm:inline-block">/</span>
          <a
            href="https://princevermadev26-portfolio.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-full border border-border/50 bg-background/5 p-1 pr-4 transition-all duration-300 hover:border-signal/50 hover:bg-background/10"
          >
            <img
              src="https://github.com/Prince-verma56.png"
              alt="Prince Verma"
              width={28}
              height={28}
              className="size-7 rounded-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
            />
            <div className="flex flex-col text-left">
              <span className="type-meta text-[0.7rem] text-bone transition-colors group-hover:text-signal">
                Prince Verma
              </span>
              <span className="text-[0.6rem] uppercase tracking-widest text-bone/40">
                Portfolio
              </span>
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
}
