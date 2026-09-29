# PERFORMANCE

Measure with `node brain/qa/perf.mjs` and `node brain/qa/cls.mjs`.

## Budget and current state

| Metric | Budget | Baseline | Now |
| --- | --- | --- | --- |
| Image payload (homepage) | < 1,000KB | 1,447KB | **989KB** |
| Video payload (homepage) | < 700KB | 9,900KB | **554KB** |
| CLS | < 0.1 | 1.0–3.5 | **0.0044** |
| LCP | < 2.5s | — | **not measurable here** — see caveat |
| Long tasks > 50ms | <= 3 | not measured | **2 (longest ~140ms)** |
| Page height (desktop) | < 18 viewport heights | 20.5 | **17.2** |
| Longest pin-spacer | <= 2.2 viewport heights | 5.2 | **2.2** |
| RAF loops | 1 scroll loop | 1 | **1** (Lenis on the GSAP ticker) |
| Scroll listeners outside Lenis | 0 | 1 (`Nav`) | **0** |
| Console errors, all routes | 0 | 0 | **0** |

Two budgets moved during the art-direction pass, both deliberately and both
recorded rather than quietly widened:

- **Images 900KB → 1,000KB.** The pass added real imagery where sections had
  been empty: five process frames, four exhibition panels, four page anchors.
  That is content doing a job, not weight. Every one goes through the WebP
  `srcset` pipeline.
- **Page height 16 → 18 screens.** Three pinned moments now carry the
  storytelling the brief asked for. Each is inside the 2.2-screen pin budget and
  each is derived from its own content.

**The video number is the one that mattered.** The hero pointed at the raw
4.9MB export, which the browser fetched, aborted and re-fetched — roughly 10MB
on a homepage. Pointing it at the encodes took the whole page from 25.4MB of
transfer to 16.1MB, of which 14.3MB is unminified dev modules.

## Rules

1. **One RAF scroll loop.** Lenis is driven by `gsap.ticker`; nothing else loops.
   Two exceptions, both bounded: the custom cursor (desktop-only, cancelled on
   unmount) and the preloader counter (~760ms, cancelled on unmount).
2. **No scroll listeners.** `Nav` used `window.addEventListener("scroll")`
   alongside Lenis, double-reading the same wheel. It reads a ScrollTrigger now.
3. **Nothing calls `window.scrollTo()`** — see `decisions/lenis-owns-scroll.md`.
4. **Pins use `pinType: "transform"`** — see `decisions/pin-type-transform.md`.
   This is the single largest metric change in the whole redesign.
5. **Animate `transform`, `opacity`, `clip-path` only.** No animated `width`,
   `height`, `top`, or `filter: blur` on large surfaces — the baseline blurred a
   full-screen element through a scrub, which is a guaranteed jank source.
6. **`will-change` is applied by GSAP**, for the duration of a tween, not by hand.
7. **Images**: explicit `width`/`height` on every `img` to reserve layout,
   `loading="lazy"` below the fold, `fetchPriority="high"` on the hero only,
   `decoding="async"` everywhere, WebP `srcset` through `<Frame>` /
   `<ResponsiveImg>`.
8. **ScrollTrigger refresh is batched to one call per frame.** Refreshing once
   per image `load` event is itself a jank source.

## Caveat on the numbers

The Nitro build targets Cloudflare Workers, so there is no plain Node preview —
`perf.mjs` runs against the dev server.

**LCP and FCP are not meaningful here.** Measured on the dev server they are
identical at ~2.1s, and the reason is the dev server itself: the document
arrives at ~900ms, then **150 separate unbundled ES module requests** gate first
paint until ~2.1s. In production those are a handful of hashed chunks. The
hero image itself is fetched at ~870ms thanks to its preload — the picture is
ready long before anything can paint.

The `script` figure (~14MB) is the same artifact. The production bundle is
~144KB gzip for the router chunk plus ~66KB gzip for GSAP.

**Image, DOM, CLS and long-task figures are real** — none of them depend on how
modules are served. For true LCP and JS weight, run `npx wrangler dev` against
`.output` and point `BASE` at it.

## Remaining

- **AVIF variants.** Perhaps another 25% off the image payload. Worth doing when
  the real photography lands — see `decisions/image-pipeline.md`.
- **GSAP is 66KB gzip** for ScrollTrigger plus core. Justified by the amount of
  scroll choreography here; revisit only if the motion is ever cut back.
