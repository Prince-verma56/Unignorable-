import { useEffect, useRef, useState } from "react";
import { Action, ArrowTag } from "./ui/action";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { Magnetic } from "./Magnetic";
import { useScrollState } from "@/hooks/useScrollState";
import { site, whatsappLink } from "@/lib/site";

const links = [
  { label: "Work", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Process", to: "/process" },
  { label: "Contact", to: "/contact" },
] as const;

/**
 * Scroll-aware navigation.
 *
 * Transparent over the hero, then out of the way entirely while reading down,
 * returning with its own paper backing on the way up. Because it only ever
 * shows condensed with a backing, it never has to fight whichever register
 * (paper / ink / cobalt) happens to be underneath it.
 */
export function Nav() {
  const { scrolled, up, overDark: scrollOverDark } = useScrollState();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  
  // The landing page hero is an ink register. Guarantee the nav is white before any scrolling.
  const overDark = scrollOverDark || (pathname === "/" && !scrolled);

  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const hidden = scrolled && !up && !open;

  return (
    <>
      {/*
        `.nav-on-ink`, not `data-register="ink"`: the register rule paints an
        opaque field, which would drop a solid bar across the top of the page
        where the nav is meant to be clear. The class flips the tokens and the
        text colour only, so `bg-background/85` resolves dark when condensed and
        transparent when not.

        `bg-transparent` is also gone from the base — it and `bg-background/85`
        are the same utility layer, so the cascade, not the class order, decided
        which won, and the condensed bar silently lost its backdrop.
      */}
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-[transform,background-color,border-color,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          overDark && !open ? "nav-on-ink" : ""
        } ${
          scrolled && !open
            ? "border-b border-border bg-background/85 py-3 backdrop-blur-xl"
            : "border-b border-transparent py-6"
        }`}
        style={{ transform: hidden ? "translateY(-100%)" : "translateY(0)" }}
      >
        <nav className="edge flex items-center justify-between gap-6" aria-label="Primary">
          <Link
            to="/"
            data-cursor="cta"
            aria-label={`${site.name} — home`}
            className="type-title-sm relative z-[56] text-[1.05rem] md:text-[1.2rem]"
          >
            {site.name}
            <span className="text-signal">.</span>
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  data-cursor="cta"
                  className="type-meta link-underline text-foreground/65 transition-colors hover:text-foreground aria-[current=page]:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <a
              href={`mailto:${site.email}`}
              className="type-meta link-underline hidden text-foreground/80 transition-colors hover:text-foreground xl:inline-block"
            >
              {site.email}
            </a>

            <Action asChild size="sm" arrow={false} wrapperClassName="hidden lg:inline-block">
              <Link to="/contact" data-cursor="cta">
                Start a project
                <ArrowTag />
              </Link>
            </Action>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="type-meta relative z-[56] -mr-1 flex h-11 items-center gap-2.5 px-1 lg:hidden"
            >
              <span className={open ? "text-bone" : undefined}>{open ? "Close" : "Menu"}</span>
              <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
                <span
                  className={`h-px w-full transition-all duration-400 ${open ? "translate-y-[3px] rotate-45 bg-bone" : "bg-foreground"}`}
                />
                <span
                  className={`h-px w-full transition-all duration-400 ${open ? "-translate-y-[3px] -rotate-45 bg-bone" : "bg-foreground"}`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* full-screen menu — ink register, so it reads as a place, not a dropdown */}
      <div
        id="site-menu"
        data-register="ink"
        aria-hidden={!open}
        className="fixed inset-0 z-[55] transition-[clip-path] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] lg:hidden"
        style={{
          clipPath: open ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div className="edge flex h-full flex-col justify-between pb-10 pt-28">
          <ul>
            {links.map((l, i) => (
              <li key={l.to} className="overflow-hidden border-b border-border">
                <Link
                  ref={i === 0 ? firstLink : undefined}
                  to={l.to}
                  tabIndex={open ? 0 : -1}
                  className="type-title block py-[0.18em] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: open ? "translateY(0)" : "translateY(110%)",
                    transitionDelay: `${140 + i * 65}ms`,
                  }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div
            className="flex flex-wrap items-end justify-between gap-6 transition-opacity duration-500"
            style={{ opacity: open ? 1 : 0, transitionDelay: open ? "520ms" : "0ms" }}
          >
            <div className="space-y-3">
              <a
                href={`mailto:${site.email}`}
                tabIndex={open ? 0 : -1}
                className="type-meta flex items-center gap-2.5 text-bone/60"
              >
                <Mail className="size-4" aria-hidden="true" />
                {site.email}
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                tabIndex={open ? 0 : -1}
                className="type-meta flex items-center gap-2.5 text-signal"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                WhatsApp
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>
            <p className="type-meta text-bone/60">{site.locations.join(" / ")}</p>
          </div>
        </div>
      </div>
    </>
  );
}
