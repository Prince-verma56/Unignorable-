import { useGsapContext } from "@/hooks/useGsapContext";
import { DUR, EASE, STAGGER, START, isDesktop, riseIn } from "@/lib/motion";
import { Frame } from "../media/Frame";
import campaignProfile from "@/assets/campaign-profile.jpg";
import campaignChrome from "@/assets/campaign-chrome.jpg";
import editorialMonolith from "@/assets/editorial-monolith.jpg";
import campaignObject from "@/assets/campaign-object.jpg";

/**
 * The point of view, as a pinned exhibition.
 *
 * This replaces the baseline `Comeback`, which pinned for `+=420%` — 4,680px,
 * a quarter of the page — to fly eight words around a flat field at random, and
 * then a static version that left half the viewport empty.
 *
 * The statement now holds the left column while four panels travel past it.
 * Each panel lights the clause it belongs to, so the horizontal movement is
 * doing the argument rather than decorating it: scrolling *is* reading.
 *
 * Distance is derived from the track, so the pin lasts exactly as long as the
 * content needs and no longer. Desktop only — a pinned horizontal track on a
 * touch device traps the scroll.
 */
const CLAUSES = [
  { text: "Attention is the", accent: false },
  { text: "only scarce", accent: false },
  { text: "resource left.", accent: false },
  { text: "We don't chase it —", accent: false },
  { text: "we build the reason", accent: false },
  { text: "people give it.", accent: true },
];

const PANELS = [
  {
    no: "01",
    label: "Attention",
    body: "Someone has to want to look. That is a creative problem before it is a media one.",
    src: campaignProfile,
    w: 1024,
    h: 1280,
  },
  {
    no: "02",
    label: "Craft",
    body: "Then the thing has to be worth the look. Composition, not decoration.",
    src: campaignChrome,
    w: 1408,
    h: 1008,
  },
  {
    no: "03",
    label: "System",
    body: "Then it has to keep working — after the launch, on the tenth asset, without us.",
    src: editorialMonolith,
    // the one frame with a blue plane in it — held to chrome, see EditorialMonolith
    treat: "saturate-[0.14] sepia-[0.12] contrast-[1.06]",
    w: 1600,
    h: 1000,
  },
  {
    no: "04",
    label: "Proof",
    body: "Then it has to show up somewhere a finance team can find it.",
    src: campaignObject,
    w: 1280,
    h: 912,
  },
];

export function Statement() {
  const ref = useGsapContext<HTMLElement>(({ gsap, root }) => {
    const q = gsap.utils.selector(root);
    riseIn({ gsap, root }, "[data-rise]", { distance: 7 });
    const lines = q("[data-clause]");
    const panels = q("[data-panel]");

    if (!isDesktop()) {
      // Phone and tablet: a plain sequence. No pin, no horizontal track.
      gsap.from(lines, {
        opacity: 0,
        y: 24,
        duration: DUR.md,
        stagger: STAGGER.loose,
        ease: EASE.out,
        scrollTrigger: { trigger: root, start: START.base, once: true },
      });
      gsap.from(panels, {
        opacity: 0,
        y: 36,
        duration: DUR.md,
        stagger: STAGGER.base,
        ease: EASE.out,
        scrollTrigger: { trigger: root, start: START.late, once: true },
      });
      return;
    }

    const track = root.querySelector<HTMLElement>("[data-track]");
    const viewport = root.querySelector<HTMLElement>("[data-viewport]");
    if (!track || !viewport) return;

    // Dim until read — set here, not in CSS, so reduced motion (which skips
    // this whole context) leaves the statement at full opacity.
    gsap.set(lines, { opacity: 0.22 });

    const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        // 1px of scroll per 1px of travel, plus a beat at each end
        end: () => `+=${distance() + window.innerHeight * 0.45}`,
        pin: true,
        pinType: "transform",
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.to({}, { duration: 0.35 }) // hold before the track starts moving
      .to(track, { x: () => -distance(), ease: EASE.scrub, duration: 4 }, 0.35);

    // Each clause lifts as its panel arrives, so the two columns stay in step.
    const perClause = 4 / lines.length;
    lines.forEach((line, i) => {
      tl.to(line, { opacity: 1, duration: perClause * 0.7, ease: EASE.inOut }, 0.35 + i * perClause);
    });

    panels.forEach((panel, i) => {
      tl.fromTo(
        panel.querySelector("[data-panel-copy]"),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, ease: EASE.out },
        0.4 + i * (3.4 / PANELS.length),
      );
    });

    tl.to({}, { duration: 0.5 }); // hold on the last panel before release
  }, []);

  return (
    <section
      ref={ref}
      data-register="ink"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden band lg:band-sm"
      aria-labelledby="statement-heading"
    >
      <div data-rise className="edge grid-12 w-full items-center gap-y-12">
        <div className="col-span-12 lg:col-span-4">
          <p className="type-meta text-bone/60">003 — Point of view</p>

          <h2
            id="statement-heading"
            className="type-title mt-7 max-w-[14ch] text-[clamp(2rem,3.4vw,3.1rem)] md:mt-10"
          >
            {CLAUSES.map((c) => (
              <span
                key={c.text}
                data-clause
                className={`block py-[0.04em] ${
                  c.accent ? "editorial text-[1.12em] lowercase text-acid" : ""
                }`}
              >
                {c.text}
              </span>
            ))}
          </h2>

          <p className="type-meta mt-9 flex items-center gap-3 text-bone/60 md:mt-12">
            Independent since day one
            <span aria-hidden="true" className="h-px w-8 bg-acid/60" />
            <span className="lg:hidden">Swipe →</span>
            <span className="hidden lg:inline">Scroll ↓</span>
          </p>
        </div>

        {/*
          The exhibition.

          Desktop: the track slides inside this viewport, driven by the pin.
          Below `lg`: the same panels become a native, snapping touch scroller.
          They used to stack vertically, which turned one screen into four and
          added ~4,500px to the tablet page — a "simplified" composition that
          was anything but.

          The negative margins let the row bleed to the screen edge while the
          section keeps its gutter, so the first panel starts on the text
          margin and the row reads as continuing off-screen.
        */}
        <div
          data-viewport
          className="col-span-12 -mx-[var(--edge-gutter)] overflow-x-auto px-[var(--edge-gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:col-span-7 lg:col-start-6 lg:mx-0 lg:overflow-x-hidden lg:px-0"
        >
          <div
            data-track
            className="flex w-max snap-x snap-mandatory gap-5 lg:snap-none lg:gap-[var(--gutter)] lg:will-change-transform"
          >
            {PANELS.map((panel) => (
              <article
                key={panel.no}
                data-panel
                className="w-[68vw] shrink-0 snap-start sm:w-[46vw] lg:w-[31vw] xl:w-[27vw]"
              >
                <Frame
                  src={panel.src}
                  alt=""
                  width={panel.w}
                  height={panel.h}
                  ratio="3/4"
                  sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 68vw"
                  className="border border-border"
                  imgClassName={panel.treat ?? "saturate-[0.85]"}
                />
                <div data-panel-copy className="mt-5 flex items-baseline gap-4">
                  <span className="type-meta shrink-0 text-acid">{panel.no}</span>
                  <div className="min-w-0">
                    <h3 className="type-subtitle text-[1.15rem]">{panel.label}</h3>
                    <p className="type-body mt-2 max-w-full text-muted-foreground">
                      {panel.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
