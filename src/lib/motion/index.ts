import type { gsap as GsapType } from "gsap";
import { DEPTH, DUR, EASE, STAGGER, START, depthScale, type DepthLayer } from "./tokens";

export * from "./tokens";

type Gsap = typeof GsapType;

interface Ctx {
  gsap: Gsap;
  root: HTMLElement;
}

const nodes = <T extends HTMLElement = HTMLElement>(root: HTMLElement, sel: string): T[] =>
  Array.from(root.querySelectorAll<T>(sel));

/**
 * Masked line-by-line rise for display type.
 * Expects each line wrapped in an `overflow: hidden` parent — see <SplitLines />.
 */
export function revealLines(
  { gsap, root }: Ctx,
  selector = "[data-line]",
  options: { start?: string; delay?: number; stagger?: number; trigger?: Element } = {},
): void {
  const targets = nodes(root, selector);
  if (!targets.length) return;

  gsap.from(targets, {
    yPercent: 112,
    duration: DUR.lg,
    delay: options.delay ?? 0,
    stagger: options.stagger ?? STAGGER.base,
    ease: EASE.out,
    scrollTrigger: {
      trigger: options.trigger ?? root,
      start: options.start ?? START.base,
      once: true,
    },
  });
}

/** Opacity + rise on scroll-in. The workhorse. */
export function revealUp(
  { gsap, root }: Ctx,
  selector: string,
  options: { y?: number; start?: string; stagger?: number; duration?: number } = {},
): void {
  const targets = nodes(root, selector);
  if (!targets.length) return;

  gsap.from(targets, {
    opacity: 0,
    y: options.y ?? 34,
    duration: options.duration ?? DUR.md,
    stagger: options.stagger ?? STAGGER.base,
    ease: EASE.out,
    scrollTrigger: { trigger: root, start: options.start ?? START.base, once: true },
  });
}

/**
 * Image reveal: the frame wipes open while the image settles back from an
 * over-scale. Both halves are needed — a clip wipe alone reads flat, a scale
 * alone reads like a zoom.
 */
export function revealImage(
  { gsap, root }: Ctx,
  selector = "[data-reveal-image]",
  options: { start?: string; stagger?: number; from?: "bottom" | "left" } = {},
): void {
  const frames = nodes(root, selector);
  if (!frames.length) return;

  const closed =
    options.from === "left" ? "inset(0% 100% 0% 0%)" : "inset(100% 0% 0% 0%)";

  frames.forEach((frame, i) => {
    // scale the media itself, never the wrapper a parallax may be driving
    const img = frame.querySelector<HTMLElement>("img, video, [data-media]") ?? frame;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: frame, start: options.start ?? START.base, once: true },
      delay: i * (options.stagger ?? STAGGER.loose),
    });

    tl.fromTo(
      frame,
      { clipPath: closed },
      { clipPath: "inset(0% 0% 0% 0%)", duration: DUR.lg, ease: EASE.out },
    ).fromTo(
      img,
      { scale: 1.16 },
      { scale: 1, duration: DUR.xl, ease: EASE.out },
      0,
    );
  });
}

/**
 * Scrubbed parallax at one of the DEPTH steps.
 * Magnitude is scaled by breakpoint and disabled on phones (see depthScale).
 */
export function parallax(
  { gsap }: Pick<Ctx, "gsap">,
  el: Element | null,
  layer: DepthLayer,
  options: { trigger?: Element | null } = {},
): void {
  const scale = depthScale();
  if (!el || scale === 0 || DEPTH[layer] === 0) return;

  const amount = DEPTH[layer] * scale;
  gsap.fromTo(
    el,
    { yPercent: -amount / 2 },
    {
      yPercent: amount / 2,
      ease: EASE.scrub,
      scrollTrigger: {
        trigger: options.trigger ?? (el as HTMLElement).parentElement ?? el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    },
  );
}

/**
 * Declarative parallax: drives every `[data-parallax="<layer>"]` inside the root
 * on the layer it names. Sections opt in from markup instead of wiring each
 * element by hand, which keeps the depth assignment visible where the
 * composition is written.
 */
export function applyParallax({ gsap, root }: Ctx): void {
  nodes(root, "[data-parallax]").forEach((el) => {
    const layer = el.dataset["parallax"] as DepthLayer | undefined;
    if (!layer || !(layer in DEPTH)) return;
    parallax({ gsap }, el, layer, { trigger: el.closest("[data-reveal-image]") ?? el.parentElement });
  });
}

/**
 * A section arriving under the one above it.
 *
 * The element starts offset downward and settles as the section crosses the
 * viewport, so the boundary reads as one plane passing another rather than as a
 * colour change. This is what replaced the gradient seams: a soft ramp between
 * a light and a dark section is a blurred band, and it looks like exactly what
 * it is. A crisp edge plus a parallax arrival looks composed.
 */
export function riseIn(
  { gsap, root }: Ctx,
  selector: string,
  options: { distance?: number; trigger?: Element | null } = {},
): void {
  const targets = nodes(root, selector);
  if (!targets.length || depthScale() === 0) return;

  const distance = (options.distance ?? 9) * depthScale();

  gsap.fromTo(
    targets,
    { yPercent: distance },
    {
      yPercent: 0,
      ease: EASE.scrub,
      scrollTrigger: {
        trigger: options.trigger ?? root,
        start: "top bottom",
        end: "top 35%",
        scrub: true,
        invalidateOnRefresh: true,
      },
    },
  );
}

/** Scrubbed scale for full-bleed media. Subtle by design. */
export function scaleOnScroll(
  { gsap }: Pick<Ctx, "gsap">,
  el: Element | null,
  options: { from?: number; to?: number; trigger?: Element | null } = {},
): void {
  if (!el || depthScale() === 0) return;

  gsap.fromTo(
    el,
    { scale: options.from ?? 1.12 },
    {
      scale: options.to ?? 1,
      ease: EASE.scrub,
      scrollTrigger: {
        trigger: options.trigger ?? el,
        start: "top bottom",
        end: "center center",
        scrub: true,
        invalidateOnRefresh: true,
      },
    },
  );
}

/** Tabular count-up. Fires once, writes the final value even if interrupted. */
export function counter(
  { gsap, root }: Ctx,
  selector = "[data-count]",
  options: { start?: string } = {},
): void {
  nodes(root, selector).forEach((el) => {
    const target = Number(el.dataset["count"] ?? 0);
    if (!Number.isFinite(target)) return;
    const box = { v: 0 };

    gsap.to(box, {
      v: target,
      duration: DUR.xl,
      ease: EASE.out,
      scrollTrigger: { trigger: el, start: options.start ?? START.base, once: true },
      onUpdate: () => {
        el.textContent = String(Math.round(box.v));
      },
      onComplete: () => {
        el.textContent = String(target);
      },
    });
  });
}

/**
 * Vertical scroll drives a horizontal track. Desktop only; below `lg` the track
 * renders as a normal stack and this is a no-op (see RESPONSIVE_SYSTEM.md).
 */
export function horizontalTrack(
  { gsap, root }: Ctx,
  selector = "[data-track]",
): void {
  const track = root.querySelector<HTMLElement>(selector);
  if (!track || !window.matchMedia("(min-width: 1024px)").matches) return;

  gsap.to(track, {
    x: () => -(track.scrollWidth - window.innerWidth),
    ease: EASE.scrub,
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: () => `+=${track.scrollWidth - window.innerWidth}`,
      pin: true,
      // see Statement.tsx: "fixed" pinning reflows and books a full CLS unit
      pinType: "transform",
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
}

export { DEPTH, DUR, EASE, STAGGER, START };
