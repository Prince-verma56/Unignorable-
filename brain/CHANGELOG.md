# CHANGELOG

Newest first.

## Hero, route transitions, seams, alignment

**Hero scrim removed.** The clip plays clean — no gradient, no fade. Legibility
for the copy that sits on bright frames now comes from full-strength colour and
a tight text shadow rather than from putting a dark ramp back over the film.

**Route transitions rebuilt a third time.** The View Transitions version
cross-faded the two pages, so both were on screen at once and you could read one
through the other. It is now a real panel that navigation waits for: the page
holds, the panel wipes up over it, the new route paints underneath, the panel
continues up and away. Exactly one page is visible at any moment.

The bug that hid this: `RouteTransition` was mounted inside `SiteFrame`, which
each route renders — so it unmounted mid-wipe and lost its state. Traced frame
by frame, the panel rose to cover and then snapped back instead of lifting. It
lives in `__root.tsx` now. See `decisions/route-transitions.md`.

**Seams replaced.** The gradient bands (and the masked photographs layered on
them) read as blurred grey smudges between the light and dark sections. The
boundary is a crisp edge with a single accent hairline, and the incoming
section's content rises into place with parallax as it crosses the viewport —
`riseIn` in `lib/motion`. See `decisions/section-seams.md`.

**Work grid fixed.** The narrow column was pulled up with `lg:-mt-[18vh]`, which
slid it into the copy of the item above — one project's summary was physically
overlapped by the next project's image. The offset is positive now. Project
metadata moved off `type-meta`: at 0.22em of tracking a three-service list is a
wall of spaced capitals that wraps badly in a narrow rail.

**About opening balanced** to the headline-left / lead-right rhythm the reel,
capabilities and work sections use, instead of leaving half the screen empty.

**Services active row** no longer bleeds off one edge and stops mid-page at the
preview column.

## Art direction pass — colour system, components, route transitions

**Colour.** The cobalt is gone. `--acid` is now the hero clip's own chartreuse,
sampled from the frame (`#b6bf26`) and solved to L .78 — where it measures
10.1:1 both as type on ink and as a field under ink type. `--ink` went deeper
and near-neutral; `--chrome` was added from the clip's speculars. Clay dropped to
a micro-accent. All 15 painted pairs meet AA.
See `decisions/lime-is-not-a-text-colour.md`.

**Controls.** One primary (`<Action>`, arrow isolated in a square
micro-container) and one secondary (`<ActionLink>`, a label over a rule that
grows on hover). Five button variants, 2px radius, no shadows or gradients.
Magnetic attraction capped at 7px, desktop only.

**Route transitions.** Native View Transitions replace an overlay that swept a
dark panel across a page React had *already* replaced — the new route popped in
and was then covered. The old frame now settles back while the new one rises
through it, with a lime hairline crossing the seam.
See `decisions/route-transitions.md`.

**Page openings.** Every inner route combined `min-h-[100svh]`,
`justify-center` and `pt-[20vh]`, so each one opened on several hundred pixels
of nothing. `<PageHeader>` is now a 76svh composition anchored to the floor with
its own visual anchor per route, and a scroll rail.

**The film section** was a static headline in a very large dark box. It is now
scrub-driven: the camera pushes into the frame, contrast comes up, and the
second statement rises out of the brightened image as the first leaves.

**The statement** became a pinned horizontal exhibition — four panels travelling
past a held column, each lighting the clause it belongs to. Below `lg` it is a
native snapping touch scroller, which took ~4,500px off the tablet page that a
vertical stack had added.

**The process page** became a progressive pinned timeline: the active step
expands and brightens, the others collapse to a title, and the right frame
changes with it.

**Section hand-offs** now carry the next section's photography, masked in, so
the register change arrives as an image rather than a CSS colour ramp.

**Fixed along the way**
- The services hover preview was absolutely positioned at `right-[6vw]` — exactly
  where the row descriptions are right-aligned — so it sat on the copy it was
  meant to illustrate. It has its own column now.
- The cursor grew a filled 96px disc over whatever the reader was about to read.
  It is a hollow ring with `mix-blend-difference`, so it never hides anything.
- `<Action asChild>` handed Radix `Slot` two children (the second being `null`),
  which threw on every render and took the whole page down to an error boundary.
- The nav painted an opaque bar at the top of the page whenever an ink section
  was under it; `.nav-on-ink` tints the tokens without touching the background.
- `bg-transparent` in the nav's base class was beating `bg-background/85` in the
  cascade, so the condensed bar never got its backdrop.
- The about collage pulled a portrait up with `mt-[-8vh]` into the frame above
  it, which read as an accident.
- Form inputs carried `outline-none` with only a 1px border change for focus.
- Hero video: pointed at the raw 4.9MB export, which the browser fetched,
  aborted and re-fetched — **~10MB on the homepage**. Now the 568KB / 211KB
  encodes with a poster, in the markup so the preload scanner sees them.
- The harness was reporting clipped marquee tracks as overflow and decorative
  `aria-hidden` elements as invisible content, which buried real findings.

## Hero video (concurrent with your edits)

- Encoded the 4.9MB source export to **568KB / 211KB** MP4s plus a poster, in
  `public/media/`. `decisions/image-pipeline.md` has the ffmpeg recipe.
- Made the "headline waits for the clip" choreography fail-safe — it previously
  had no path to the headline if the clip never ended.
- **Nav over a dark hero.** The bar was painting an opaque field the moment an
  ink section was under it, including at the top of the page where it should be
  clear. It now tints its tokens (`.nav-on-ink`) and leaves the background to
  the condensed state. Also removed a `bg-transparent` in the base class that
  was silently beating `bg-background/85` in the cascade.
- **Register detection now hit-tests** instead of measuring section boxes.
  Geometry does not survive pinning: the Statement is pinned with
  `pinType: "transform"`, so its rect no longer says where it is painted and the
  nav stayed light over it.

## Phase 8–12 — transitions, responsive, performance, accessibility, QA

- **Register seams.** `<Seam />` dissolves paper into ink and back at the three
  inversions, positioned inside the adjacent section so it adds no page height.
- **Nav inverts over ink.** A ScrollTrigger per ink section flips the bar to the
  ink register, so it stops dropping a pale strip across dark full-bleed moments.
- **CLS 1.0–3.5 → 0.0045.** The pinned `Statement` used ScrollTrigger's default
  `pinType: "fixed"`, which reflows the document and books a full unit of layout
  shift. Both pins now use `pinType: "transform"`.
- **Lenis owns the scroll position.** A bare `window.scrollTo()` is reverted on
  the next frame — which meant route changes were silently stranding the reader
  at the previous page's offset. Added `getLenis()` / `scrollToTop()`.
- **Image payload 1,447KB → 588KB.** WebP variants at 640/1024/1600 generated
  from the source JPEGs, wired through `lib/media.ts` and `<Frame>` /
  `<ResponsiveImg>`. No new runtime or project dependency.
- **Contrast to AA.** Clay solved to `L .52` on paper with a lighter override
  inside the ink register; every sub-60% alpha text value raised.
- **Testimonials** rebuilt around a named selector, which fills the right column
  and gives the control a real 44px target instead of a 2px hairline.
- **`Process` track** now fills the pinned frame instead of floating a row of
  cards in the middle of an empty screen.
- Added `brain/qa/contrast.mjs`, `perf.mjs`, `cls.mjs`, `a11y.mjs`. The harness
  now scrolls with real wheel events — `window.scrollTo` is reverted by Lenis,
  so the old harness was photographing a page that had not moved.

## Phase 4–7 — preloader, nav, hero, sections

- **`Comeback` → `Statement`.** 4,680px of pinned flat cobalt (a quarter of the
  page, and a scroll jail on mobile) became a 1,980px reading sequence that only
  pins from `lg` up.
- **Hero rebuilt.** Full-height right bleed the headline overlaps, a directional
  scrim so the photograph keeps its contrast, a supporting line that says what
  the studio does, and the accent set in the editorial italic instead of an
  outline stroke that collided with the line below.
- **Preloader** cut from ~2.0s of flat cobalt behind a clipped 154vw wordmark to
  ~0.9s that opens on ink and clips away to reveal a composed hero.
- **Nav** hides on the way down, returns with its own backing on the way up, and
  no longer runs a scroll listener alongside Lenis.
- **Footer joined the closing ink movement**; the newsletter folded into it.
- Every section rebuilt on the new type, space and depth systems. `PageHeader`
  replaced seven near-identical inner-page openings.

## Phase 1–3 — foundation

- **Colour.** `--ink` was a second cobalt, 0.07 lightness from `--acid`; it is
  now a true warm near-black. `acid-foreground` — used ~20 times, never defined —
  exists, along with every other `-foreground` pair. Added the `data-register`
  system so a subtree can flip the semantic tokens.
- **Typography.** Two voices (Inter + Instrument Serif, replacing a Playfair that
  was loaded and used once) and a real scale. `h3` is no longer display type;
  that single change is most of what gave the page hierarchy.
- **Motion.** `src/lib/motion/` with shared easings, durations and depth layers.
  Parallax magnitudes differentiated per layer — the baseline moved everything by
  roughly the same amount, which cancels the effect out.
- **ScrollTrigger refresh discipline.** Positions were computed once against a
  layout that then moved by thousands of pixels as lazy images and pins landed.
  Now batched to one refresh per frame on image load, font swap and resize.
- **`velocity-lean` → `scroll-lean`.** The old one wrote Lenis velocity straight
  to a CSS skew; Lenis stops emitting at rest, so the last value stuck and
  elements sat permanently sheared. The new one decays to zero on the ticker.
- **`Magnetic`** stopped setting `display` inline, which had been outranking
  `hidden` and leaking the desktop nav CTA onto mobile.

## Phase 0 — audit and instrumentation

- `/brain` established: audit, design system, animation system, section
  architecture, responsive and performance docs.
- `brain/qa/shot.mjs`: Playwright harness across 3 viewports and the full scroll,
  reporting horizontal overflow, zero-opacity blocks, console errors and the
  section box map.
- Baseline captured. Page height 18,488px; the 4,680px `Comeback` pin-spacer
  identified as the reference screenshot's "dead space".
