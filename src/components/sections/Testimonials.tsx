import { useState } from "react";
import { useGsapContext } from "@/hooks/useGsapContext";
import { revealUp, START } from "@/lib/motion";
import { testimonials } from "@/lib/data/testimonials";

/**
 * One quote at a time, on the quiet register.
 *
 * The selector is the list of names, which does three things the baseline's
 * row of 2px hairlines did not: it fills the right column instead of leaving
 * half the viewport empty, it says who is speaking before you commit to
 * reading, and it gives the control a real 44px target.
 */
export function Testimonials() {
  const [active, setActive] = useState(0);
  const t = testimonials[active]!;

  const ref = useGsapContext<HTMLElement>((ctx) => {
    revealUp(ctx, "[data-enter]", { start: START.early, y: 16 });
    revealUp(ctx, "[data-quote-part]", { start: START.base, stagger: 0.1 });
  }, []);

  return (
    <section
      ref={ref}
      data-register="paper-deep"
      className="edge band border-y border-border"
      aria-labelledby="testimonials-heading"
    >
      <h2 data-enter id="testimonials-heading" className="type-meta text-signal">
        009 — What they say
      </h2>

      <div className="grid-12 mt-10 gap-y-10 md:mt-14">
        <blockquote data-quote-part className="col-span-12 lg:col-span-7">
          <p key={active} className="type-title-sm animate-in fade-in duration-700">
            <span aria-hidden="true" className="editorial text-signal">
              “
            </span>
            {t.quote}
            <span aria-hidden="true" className="editorial text-signal">
              ”
            </span>
          </p>
          <footer className="type-meta mt-8 text-muted-foreground">
            {t.client} — {t.role}, {t.company}
          </footer>
        </blockquote>

        <div data-quote-part className="col-span-12 lg:col-span-4 lg:col-start-9">
          <p className="type-meta border-b border-border pb-3 text-muted-foreground">
            Who said it
          </p>
          <ul>
            {testimonials.map((item, i) => {
              const on = i === active;
              return (
                <li key={item.client}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    data-cursor="cta"
                    className="group flex min-h-11 w-full items-center justify-between gap-4 border-b border-border py-3 text-left transition-colors duration-300"
                  >
                    <span
                      className={`type-subtitle text-[1.1rem] transition-colors duration-300 ${
                        on ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {item.company}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`h-px shrink-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        on ? "w-10 bg-signal" : "w-4 bg-border-strong group-hover:w-7"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
