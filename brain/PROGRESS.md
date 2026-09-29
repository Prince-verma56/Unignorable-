# PROGRESS

## State: art-direction pass complete, all routes QA'd

Seven routes x three viewports (1440 / 834 / 390): no horizontal overflow, no
unclipped overflow, no content stuck invisible, **zero console errors**.
15 contrast pairs at AA. Reduced motion renders the full page. 55 keyboard
stops, all visible with a focus ring. CLS 0.005.

## Headline numbers

| | Original baseline | Now |
| --- | --- | --- |
| Page height, desktop | 18,488px (20.5 screens) | 15,485px (17.2) |
| Longest pin | 4,680px (5.2 screens) | ~2,000px (2.2) |
| CLS | 1.0-3.5 | **0.005** |
| Homepage transfer (media) | 1,447KB images + 9.9MB video | **991KB images + 554KB video** |
| Undefined colour tokens in use | 1 (~20 call sites) | 0 |
| Token pairs failing AA | 6 of 14 | **0 of 15** |
| Blue in the palette | 2 of 4 brand tokens | **none** |

## In flight on your side (not mine to finish)

You were editing `Hero.tsx` and `Preloader.tsx` while this ran, so those two are
yours. What I did there, and what is still open:

- **Kept and hardened your idea** that the clip's `onEnded` releases the
  headline. It was a hard failure as written: if the clip never ends — autoplay
  refused, a 404, a stalled network — the lines sit at `yPercent: 112` inside
  their masks with nothing to bring them back. `revealText` is now idempotent
  and fires from `onEnded`, `onError`, a rejected `play()`, and a 3.2s failsafe.
- **Closed an unterminated `style={{` in `Preloader.tsx`** that was breaking the
  build mid-edit. Nothing else in that file was touched.
- **Open: the hero still points at `/Videos/UNIGNORABLE Video 1.mp4` (4.9MB).**
  Re-encoded sources are ready at `/media/reel-1280.mp4` (568KB) and
  `/media/reel-720.mp4` (211KB), with `/media/reel-poster.jpg`. Swapping the
  `src` for the two `<source>` elements is the last remaining console error.
- **Open: `public/Videos/` is deployed as-is.** Everything under `public/` ships.
  Delete it once you are happy with the encodes.
- **Open: the fullscreen video hero has no scrim.** "See selected work" and the
  bottom rail labels sit directly on the bright frames. The right-bleed layout
  solved this with a directional gradient; a fullscreen clip needs its own.

## Known issues / remaining

- **Demo content.** Client names, case-study bodies and stat values are
  placeholders and are labelled as such in the UI. Replace before launch.
- **Tablet `WorkPreview` runs long** (834px: the `lg:` stagger does not apply,
  so four projects stack full width). Correct, just tall. A 2-up at `md` would
  shorten it if the length becomes a problem.
- **AVIF not generated** — see `IMPLEMENTATION_PLAN.md`.
- **Production perf is unmeasured.** The Nitro build targets Cloudflare
  Workers, so `brain/qa/perf.mjs` runs against the dev server; its `script`
  figure is unminified dev modules and means nothing. Image, DOM, CLS and
  long-task numbers are real. Run it through `wrangler dev` for true JS weight.

## Observations

- The stack was never the problem. One Lenis, one ticker, contexts reverted —
  all correct at baseline. Every finding was design or wiring.
- The two highest-leverage fixes were both invisible in the source: the 5-screen
  pin (a quarter of the page) and `pinType: "fixed"` booking a full unit of CLS.
  Neither would have been found without rendering the page and measuring it.
