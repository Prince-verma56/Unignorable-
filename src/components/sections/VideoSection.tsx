import { useGsapContext } from "@/hooks/useGsapContext";
import { ResponsiveImg } from "../media/Frame";
import { DUR, EASE, STAGGER, START, isDesktop, riseIn } from "@/lib/motion";
import studio2 from "@/assets/studio-2.jpg";

const FIRST = ["We don't just", "make content."];
const SECOND = ["We make people", "stop scrolling."];

/**
 * The film register — one frame, two statements, and a camera push between them.
 *
 * This used to be a static headline sitting in a very large dark box, which did
 * not earn the screen it occupied. It is now scrub-driven: the first statement
 * holds over a dim, wide frame; as the reader scrolls the camera pushes into the
 * image and the contrast comes up; the second statement rises out of that
 * brightened frame as the first leaves.
 *
 * The motion is the edit. Nothing here moves for decoration.
 */
export function VideoSection() {
  const ref = useGsapContext<HTMLElement>(({ gsap, root }) => {
    const q = gsap.utils.selector(root);
    riseIn({ gsap, root }, "[data-rise]", { distance: 7 });
    const first = q("[data-first] [data-line]");
    const second = q("[data-second] [data-line]");
    const media = root.querySelector("[data-media]");
    const scrim = root.querySelector("[data-scrim]");

    if (!isDesktop()) {
      // Phone and tablet: both statements read as one block, revealed normally.
      gsap.from([...first, ...second], {
        yPercent: 110,
        duration: DUR.lg,
        stagger: STAGGER.base,
        ease: EASE.out,
        scrollTrigger: { trigger: root, start: START.late, once: true },
      });
      return;
    }

    gsap.set(second, { yPercent: 110 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "+=110%",
        pin: true,
        pinType: "transform",
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // 1 — the first statement rises into a dim, wide frame
    tl.from(first, { yPercent: 110, duration: 1, stagger: 0.12, ease: EASE.out }, 0)
      // 2 — the camera pushes in and the contrast comes up
      .to(media, { scale: 1.22, ease: EASE.scrub, duration: 3 }, 0)
      .to(scrim, { opacity: 0.35, ease: EASE.scrub, duration: 3 }, 0)
      // 3 — the first statement leaves as the second arrives out of the frame
      .to(first, { yPercent: -110, duration: 0.9, stagger: 0.08, ease: EASE.inOut }, 1.5)
      .to(second, { yPercent: 0, duration: 1, stagger: 0.12, ease: EASE.out }, 1.75)
      .to({}, { duration: 0.6 });
  }, []);

  return (
    <section
      ref={ref}
      data-register="ink"
      className="relative flex min-h-[100svh] items-center overflow-hidden band"
      aria-labelledby="film-heading"
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div data-media className="absolute inset-0 will-change-transform">
          <ResponsiveImg
            src={studio2}
            alt=""
            ariaHidden
            width={1600}
            height={1067}
            className="opacity-70 grayscale"
          />
        </div>
        <div data-scrim className="absolute inset-0 bg-ink/75" />
        <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/35 to-transparent" />
      </div>

      <div data-rise className="edge relative w-full">
        <p className="type-meta text-bone/60">007 — Film</p>

        {/*
          Both statements occupy the same box, so the second replaces the first
          in place rather than pushing the layout around.
        */}
        <div className="relative mt-6 md:mt-8">
          <h2 id="film-heading" data-first className="type-title max-w-[15ch]">
            {FIRST.map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.04em]">
                <span data-line className="block">
                  {line}
                </span>
              </span>
            ))}
          </h2>

          <p
            data-second
            aria-hidden="true"
            className="type-title mt-[0.12em] max-w-[15ch] text-acid lg:absolute lg:inset-x-0 lg:top-0 lg:mt-0"
          >
            {SECOND.map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.04em]">
                <span data-line className="block">
                  {line}
                </span>
              </span>
            ))}
          </p>

          {/* the overlay copy is aria-hidden, so the statement still has to
              reach assistive tech once */}
          <p className="sr-only">{SECOND.join(" ")}</p>
        </div>
      </div>
    </section>
  );
}
