import { useState } from "react";
import { useGsapContext } from "@/hooks/useGsapContext";
import { DUR, EASE, STAGGER, START, isDesktop } from "@/lib/motion";
import { Frame, ResponsiveImg } from "../media/Frame";
import campaignChrome from "@/assets/campaign-chrome.jpg";
import campaignGlass from "@/assets/campaign-glass.jpg";
import campaignFilm from "@/assets/campaign-film.jpg";
import campaignObject from "@/assets/campaign-object.jpg";
import studio1 from "@/assets/studio-1.jpg";

const steps = [
  {
    no: "01",
    label: "Audit",
    body: "Your current paid vs. organic split, benchmarked against GCC category leaders. We show you the gap before we touch anything.",
    src: studio1,
    w: 1280,
    h: 1024,
  },
  {
    no: "02",
    label: "Strategy",
    body: "One organic-first strategy built for your brand, category, and market. GCC-native. Senior attention on every brief.",
    src: campaignGlass,
    w: 1024,
    h: 1280,
  },
  {
    no: "03",
    label: "Earn",
    body: "Organic content, SEO, influencers, PR — compounding impressions before a single paid dirham is spent.",
    src: campaignFilm,
    w: 1008,
    h: 1312,
  },
  {
    no: "04",
    label: "Amplify",
    body: "Paid media deployed only to amplify what’s already performing organically. Precision targeting. Zero wasted spend.",
    src: campaignChrome,
    w: 1408,
    h: 1008,
  },
  {
    no: "05",
    label: "Compound",
    body: "Content, SEO, and communities keep delivering long after campaigns end. The longer we work, the cheaper your impressions get.",
    src: campaignObject,
    w: 1280,
    h: 912,
  },
];

/**
 * The method, as a progressive timeline.
 *
 * Desktop: the section pins, the step list holds the left column, and the
 * active step brightens while the others recede — with its image changing in
 * the right column. The motion explains the sequence; it is not decoration on
 * top of a list.
 *
 * Below `lg` it is a plain vertical sequence with each step's image inline,
 * which is the same story told without a pin.
 */
export function Process() {
  const [active, setActive] = useState(0);

  const ref = useGsapContext<HTMLElement>(({ gsap, root }) => {
    const q = gsap.utils.selector(root);

    if (!isDesktop()) {
      gsap.from(q("[data-step]"), {
        opacity: 0,
        y: 28,
        duration: DUR.md,
        stagger: STAGGER.loose,
        ease: EASE.out,
        scrollTrigger: { trigger: root, start: START.base, once: true },
      });
      return;
    }

    gsap.from(q("[data-process-head] > *"), {
      opacity: 0,
      y: 18,
      duration: DUR.md,
      stagger: STAGGER.base,
      ease: EASE.out,
      scrollTrigger: { trigger: root, start: START.early, once: true },
    });

    // One trigger per step, over a pin the length of the sequence.
    gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: () => `+=${steps.length * 62}%`,
        pin: true,
        pinType: "transform",
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const i = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
          setActive((prev) => (prev === i ? prev : i));
        },
      },
    });
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden band-sm lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center">
      <div className="edge">
        <div
          data-process-head
          className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 border-b border-border-strong pb-6"
        >
          <h2 id="process-heading" className="type-meta text-signal">
            006 — Our organic-first approach
          </h2>
          <p className="type-lead text-foreground/70 md:text-right">
            Five steps. Organic earns the attention. Paid amplifies what’s already working.
          </p>
        </div>

        <div className="grid-12 mt-10 gap-y-10 lg:mt-14">
          {/* the sequence */}
          <ol className="col-span-12 lg:col-span-7">
            {steps.map((s, i) => {
              const on = i === active;
              return (
                <li
                  key={s.no}
                  data-step
                  className="border-b border-border last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={on}
                    className="group flex w-full items-start gap-6 py-6 text-left transition-opacity duration-[600ms] lg:py-5"
                    style={{ opacity: on ? 1 : 0.32 }}
                  >
                    <span
                      className="type-numeral shrink-0 text-[clamp(2rem,4vw,3.4rem)] transition-colors duration-[600ms]"
                      style={{ color: on ? "var(--signal)" : "inherit" }}
                    >
                      {s.no}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="type-title-sm block">{s.label}</span>
                      {/*
                        Only the active step carries its body on desktop. With
                        all five expanded the list ran taller than the pinned
                        frame, so the step the timeline had just made active
                        could be scrolled out of sight — the one thing the
                        section exists to show.
                      */}
                      <span
                        className="grid transition-[grid-template-rows,opacity] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{
                          gridTemplateRows: on ? "1fr" : "0fr",
                          opacity: on ? 1 : 0,
                        }}
                        data-collapse
                      >
                        <span className="overflow-hidden">
                          <span className="type-body mt-3 block max-w-[46ch] text-muted-foreground">
                            {s.body}
                          </span>
                        </span>
                      </span>
                      {/* on touch the image belongs with its own step */}
                      <span className="mt-5 block lg:hidden">
                        <Frame
                          src={s.src}
                          alt=""
                          width={s.w}
                          height={s.h}
                          ratio="16/10"
                          sizes="100vw"
                        />
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* the frame that answers the sequence */}
          <div aria-hidden="true" className="col-span-4 col-start-9 hidden lg:block">
            <div className="media-frame aspect-[4/5] border border-border">
              {steps.map((s, i) => (
                <div
                  key={s.no}
                  className="absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: `scale(${i === active ? 1 : 1.06})`,
                  }}
                >
                  <ResponsiveImg
                    src={s.src}
                    alt=""
                    ariaHidden
                    width={s.w}
                    height={s.h}
                    sizes="(min-width: 1024px) 28vw, 100vw"
                  />
                </div>
              ))}
            </div>
            <p className="type-meta mt-4 flex items-center justify-between text-muted-foreground">
              <span>{steps[active]?.label}</span>
              <span>
                {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
