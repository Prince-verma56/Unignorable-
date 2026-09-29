import { useCallback, useEffect, useRef } from "react";
import { Action, ActionLink, ArrowTag } from "../ui/action";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Magnetic } from "../Magnetic";
import { useGsapContext } from "@/hooks/useGsapContext";
import { DUR, EASE, STAGGER, depthScale, parallax } from "@/lib/motion";
import { site } from "@/lib/site";

/**
 * The opening composition.
 *
 * Three moves the baseline did not make:
 *  1. The accent line is set in the editorial italic rather than an outline
 *     stroke — the baseline's `-webkit-text-stroke` word collided with the line
 *     below at `line-height: .88` and read as a fault (audit H3).
 *  2. The image is a full-height right bleed that the headline overlaps, not a
 *     drop-shadowed card floating in the corner.
 *  3. The scrim is directional — opaque under the type, clear over the subject —
 *     so the photograph keeps its contrast instead of being flattened to grey
 *     by a blanket `opacity-70` plus two stacked gradients (audit H4).
 */
export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const ref = useGsapContext<HTMLElement>(({ gsap, root }) => {
    const q = gsap.utils.selector(root);

    // Entrance — timed to arrive strictly as the preloader finishes clipping away.
    const tl = gsap.timeline({ delay: 1.2 });

    // Video fades in and starts playing.
    tl.from(q("[data-hero-media]"), { 
      opacity: 0, 
      scale: 1.06, 
      duration: DUR.lg, 
      ease: EASE.out,
      onStart: () => {
        videoRef.current?.play().catch(() => {});
      }
    }, 0);

    // Text waits exactly 1 second into the video playback to start animating
    tl.from(q("[data-hero-eyebrow]"), { opacity: 0, duration: DUR.sm }, 1.0)
      .from(
        q("[data-line]"),
        { yPercent: 112, duration: DUR.lg, stagger: STAGGER.base, ease: EASE.out },
        1.13
      )
      .from(
        q("[data-hero-enter]"),
        { opacity: 0, y: 24, duration: DUR.md, stagger: STAGGER.base, ease: EASE.out },
        1.57
      );

    // Depth: the media moves, the copy plane does not (DEPTH.anchor).
    parallax({ gsap }, root.querySelector("[data-hero-media]"), "mid", { trigger: root });

    // Hand-off into the next section: the copy dissolves rather than sliding,
    // so the headline never drifts off its baseline.
    gsap.to(q("[data-hero-copy]"), {
      opacity: 0.08,
      ease: EASE.scrub,
      scrollTrigger: { trigger: root, start: "60% top", end: "bottom top", scrub: true },
    });
  }, []);

  return (
    <section
      ref={ref}
      data-register="ink"
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-20 md:pt-24"
    >
      {/* ---------- media: fullscreen background video */}
      <div
        data-hero-media
        className="absolute inset-0 overflow-hidden"
      >
        <video
          ref={videoRef}
          poster="/media/reel-poster.jpg"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          disablePictureInPicture
          className="size-full object-cover object-[70%_center] md:object-center"
        >
          {/*
            568KB / 211KB, re-encoded from the 4.9MB export still sitting in
            public/Videos (which ships as-is if left there). Measured: pointing
            at the raw file put ~10MB on the homepage, because it is fetched,
            aborted and re-fetched.

            Sources are in the markup so the preload scanner starts at parse
            time. A browser that ignores `media` takes the first source — the
            smaller file — which is a safe way to be wrong.
          */}
          <source src="/media/reel-720.mp4" media="(max-width: 767px)" type="video/mp4" />
          <source src="/media/reel-1280.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ---------- copy plane */}
      <div className="edge relative z-10 flex flex-1 flex-col justify-end pb-10 pt-10 md:pb-8 md:pt-0">
        
        <div data-hero-copy className="grid-12 flex-1 content-end relative">
          {/* Eyebrow Tags absolutely positioned at the top of the container */}
          <p className="absolute left-0 -top-6 md:-top-2 flex items-center gap-2 md:gap-4 col-span-12">
            <span data-hero-eyebrow className="type-meta whitespace-nowrap text-[0.62rem] text-foreground drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] sm:text-[0.7rem] rounded-sm bg-black/30 px-2 py-1 backdrop-blur-md md:bg-transparent md:p-0 md:backdrop-blur-none">
              Boutique · Digital-First · Unapologetic
            </span>
          </p>

          <div className="col-span-12 lg:col-span-9 xl:col-span-8">
            <h1
              className="type-display mt-3 md:mt-4"
              style={{ fontSize: "clamp(2.6rem, 6.2vw, 7.2rem)" }}
            >
              {["We Don't", "Play By"].map((line) => (
                <span key={line} className="block overflow-hidden pb-[0.04em]">
                  <span data-line className="block">
                    {line}
                  </span>
                </span>
              ))}
              <span className="block overflow-hidden pb-[0.04em]">
                <span
                  data-line
                  className="editorial block text-[1.16em] leading-[0.74] text-signal"
                >
                  Big Agency
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.04em]">
                <span data-line className="block">
                  Rules.
                </span>
              </span>
            </h1>

            <p data-hero-enter className="type-lead mt-4 text-foreground/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)] md:mt-5">
              Game Changer Marketing Agency — The GCC’s Organic-First Growth Partner.
            </p>

            <div data-hero-enter className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-4 md:mt-6">
              <Action asChild variant="inverse" arrow={false}>
                <Link to="/contact" data-cursor="cta">
                  Free Growth Audit
                  <ArrowTag />
                </Link>
              </Action>
              <Link to="/services" data-cursor="cta" className="text-foreground drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]">
                <ActionLink>Our 9 solutions</ActionLink>
              </Link>
            </div>
          </div>
        </div>

        {/* ---------- bottom rail: the hairline that the whole page is measured from */}
        {/*
          The rule runs the full width — it is what the whole page is measured
          from — but the labels stay on the paper side. Past ~52vw they sit on
          the clip, where the clay legend became unreadable against the bright
          frames.
        */}
        <div data-hero-enter className="mt-8 border-t border-border pt-4 md:mt-10">
          <div className="flex items-center justify-between gap-6 md:w-[42vw] lg:w-[46vw]">
            <span className="type-meta flex items-center gap-3 text-foreground/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
              Scroll
              <ArrowDown className="size-3 animate-bounce" aria-hidden="true" />
            </span>
            <span className="type-meta hidden text-foreground/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] sm:block">
              {site.locations.slice(0, 3).join(" / ")}
            </span>
            <span className="type-meta text-signal">GCC’s Organic-First Agency</span>
          </div>
        </div>
      </div>
    </section>
  );
}
