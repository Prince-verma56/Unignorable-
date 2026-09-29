# ANIMATION_SYSTEM

Implementation: `src/lib/motion/` (tokens + utilities), `src/hooks/useGsapContext.ts`,
`src/hooks/useSmoothScroll.ts`. One Lenis instance, one GSAP ticker, one ScrollTrigger
registry. No component may create its own RAF loop or scroll listener.

## Principles

1. **Motion clarifies, it never decorates.** If removing an animation costs nothing, remove it.
2. **Depth comes from difference.** Layers must move at *different* rates or the parallax
   cancels itself (audit H8). Uniform parallax is worse than none.
3. **Something must stay still.** The main content plane is the anchor; only the layers
   behind and in front of it move.
4. **Entrances are choreographed, not simultaneous.** Stagger with intent, in reading order.
5. **Scrubbed motion is linear.** `ease: "none"` for anything tied to scroll position;
   easing a scrub makes the page feel like it is fighting the wheel.
6. **Nothing pins for more than ~2 viewport heights.** The old `Comeback` held 5.2 (C3).

## Tokens (`src/lib/motion/tokens.ts`)

```
EASE.out      "expo.out"        entrances — fast start, long settle
EASE.inOut    "power2.inOut"    state changes, colour transitions
EASE.scrub    "none"            anything scrubbed to scroll
EASE.exit     "power3.in"       departures

DUR.xs 0.4   DUR.sm 0.65   DUR.md 0.9   DUR.lg 1.25   DUR.xl 1.8
STAGGER.tight 0.05   STAGGER.base 0.08   STAGGER.loose 0.14

START.early "top 92%"   START.base "top 82%"   START.late "top 68%"
```

## Depth layers

The one rule that makes the page feel spatial. Magnitudes are `yPercent` over the full
scroll of the section:

| Layer | Magnitude | Example |
| --- | --- | --- |
| `DEPTH.bg` | `8` | Full-bleed backdrops, texture plates |
| `DEPTH.far` | `10` | Secondary imagery behind the content plane |
| `DEPTH.mid` | `16` | The primary image in a composition |
| `DEPTH.anchor` | `0` | **Headlines and body copy. Deliberately still.** |
| `DEPTH.near` | `-10` | Foreground metadata rails, floating indices |

Two layers in one composition must never share a magnitude.

Magnitudes are bounded by `MEDIA_OVERSCAN`: `.media-inner` is `inset: -10%`, and
the largest layer (`mid`) travels ±8% of a 120%-tall inner, i.e. 9.6% of the
frame. Raising a magnitude past that means raising the overscan too, or the
frame will see an edge.

## Utilities (`src/lib/motion/`)

| Utility | What it does | Reduced motion |
| --- | --- | --- |
| `revealLines(root, sel)` | Masked line-by-line rise, `yPercent 112 → 0` | Renders static |
| `revealUp(root, sel, o)` | Opacity + `y` rise on scroll-in | Renders static |
| `revealImage(root, sel)` | `clip-path` wipe + inner scale `1.12 → 1` | Renders static |
| `parallax(el, depth)` | Scrubbed `yPercent` at one of the `DEPTH` steps | Skipped |
| `scaleOnScroll(el, o)` | Scrubbed scale, for full-bleed media | Skipped |
| `counter(el, to)` | Tabular count-up, fires once | Sets final value |
| `magnetic(el, s)` | Pointer attraction, fine pointers only | Skipped |
| `horizontalTrack(root)` | Vertical scroll drives an x-track, desktop only | Falls back to stack |

All of them take a GSAP-context-scoped root and are reverted by `useGsapContext`.

## Choreography — the page entrance

Not simultaneous. The sequence establishes the visual language before the reader scrolls.

```
0.00  preloader holds the ink field; counter runs to 100, rule draws across
0.45  hero media begins settling (scale 1.06 → 1, 1.25s, expo.out)
0.50  rule + eyebrow draw in
0.52  preloader clips upward (700ms), revealing the hero already composing
0.63  headline lines rise, stagger 0.08, masked
1.07  lead copy + CTA fade up
1.22  bottom rail fades in
1.25  ambient drift and scroll interaction are live
```

The hero starts composing *under* the preloader, so the clip reveals a page in
motion rather than a static one waiting to begin. Fully settled at ~1.4s; the
baseline held a flat cobalt field for ~2.0s before anything was legible
(audit M2). Verified frame by frame — see the entrance filmstrip note in
`QA_CHECKLIST.md`.

## Per-animation register

| Section | Trigger | Motion | Mobile | Reduced motion |
| --- | --- | --- | --- | --- |
| Preloader | mount | clip `inset(0 0 0 0) → inset(0 0 100% 0)`, `DUR.lg`, `EASE.inOut` | same, shorter | skipped, no overlay |
| Hero media | mount + scroll | scale settle, then `DEPTH.mid` parallax | parallax off | static |
| Hero lines | mount `+0.8` | `revealLines`, `STAGGER.base` | same | static |
| SignalStrip | CSS | marquee, `linear`, 30s | 22s | paused |
| CampaignGrid | `START.base` | `revealImage` per cell, `STAGGER.loose`; cells at `DEPTH.far`/`mid` | reveal only | static |
| EditorialMonolith | scrub | image `clip-path` wipe pinned to scroll; texture at `DEPTH.bg` | wipe on enter | static |
| Statement | pin, length derived from the track | horizontal exhibition; each panel lights its clause | **no pin** — native snapping touch scroller | static |
| Film (VideoSection) | pin `+=110%` | camera push into the frame, contrast up, second statement rises as the first leaves | **no pin** — both statements revealed normally | static |
| Process | pin `+=62% x steps` | active step expands and brightens, others collapse to a title; right frame changes with it | **no pin** — every step keeps its body and its own image | static |
| Stats | `START.base` | `counter`, `DUR.xl` | same | final value |
| ServicesList | hover / focus | row shift + preview crossfade | tap-through, no preview | no shift |
| WorkPreview | `START.base` | `revealImage` + `DEPTH.mid` per item | reveal only | static |
| Process | pin `+=track` | `horizontalTrack` | vertical stack | vertical stack |
| FinalCTA | scrub | scrim `DEPTH.bg`, headline `DEPTH.anchor` | scrim off | static |

## Reduced motion

`useGsapContext` skips the whole context when `prefers-reduced-motion: reduce`, so `from`
tweens never run and content renders in its natural state. The CSS side must match: the
current blanket `animation-duration: 0.001ms` makes marquees **jump to their end frame**
rather than stop (audit A2). Replace with `animation-play-state: paused` for looping
decorative animations and `animation: none` for entrances.

## Refresh discipline (fixes C6)

ScrollTrigger positions are computed against a layout that moves. Refresh on:

- `window.load` (all images settled)
- `document.fonts.ready` (metric swap)
- every below-fold image's `load` event, debounced to one refresh per frame
- `ResizeObserver` on `<main>`, debounced 150ms

Without this, pinned sections and lazy images push every downstream trigger out of place.


## Pinning

Every pin passes `pinType: "transform"`. The default `"fixed"` reflows the
document when the pin engages and books a full **1.0** unit of CLS each time.
See `decisions/pin-type-transform.md`.

Pins are also capped at ~2.2 viewport heights and are desktop-only — see
`decisions/pin-budget.md`.

## Programmatic scrolling

Nothing calls `window.scrollTo()`. Lenis reasserts its own position on the next
frame, so the call is silently reverted. Use `scrollToTop()` from
`hooks/useSmoothScroll.ts`. See `decisions/lenis-owns-scroll.md`.


## Route transitions

Native View Transitions, not an overlay and not a library. The old frame settles
back (420ms) while the new one rises through it (620ms), with a lime hairline
crossing the seam. See `decisions/route-transitions.md`.

## Pin budget

No pin exceeds ~2.2 viewport heights, and nothing pins below `lg`. Three pins
on the homepage — Statement, Film, and (on its own route) Process — each derived
from its own content rather than a fixed percentage where possible.

Every pin passes `pinType: "transform"`. The default `"fixed"` reflows the
document and books a full unit of CLS each time it engages.

## Two traps worth remembering

- **A responsive `display` utility silently defeats a collapse.** `lg:block` on
  a `grid`-based collapse re-set display at the exact breakpoint the collapse was
  for, so `grid-template-rows: 0fr` never applied and the rows stayed tall.
- **A pinned list must fit its frame.** With all five process steps expanded the
  list ran taller than the pinned viewport, so the step the timeline had just
  made active could scroll out of sight — the one thing the section exists to
  show.
