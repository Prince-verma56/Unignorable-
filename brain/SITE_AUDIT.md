# SITE_AUDIT — baseline (pass 00)

Measured at 1440×900, 834×1112, 390×844. Frame references below are to the
`00-baseline` capture, which is git-ignored like every QA run — regenerate any
run with `node brain/qa/shot.mjs <label>`.
Page height at baseline: **18,488px desktop (20.5 viewport heights)**.

## Stack (KEEP — it is sound)

TanStack Start 1.168 + React 19 + Vite 8 · Tailwind v4 (CSS-first `@theme`) · GSAP 3.15 +
ScrollTrigger · Lenis 1.3 · shadcn/radix for form primitives · Supabase for the enquiry and
newsletter server functions. One Lenis instance, one GSAP ticker, contexts reverted on
unmount. **No library changes are needed.** Everything below is design and wiring.

---

## CRITICAL

### C1 — `acid-foreground` is not a defined token, but is used ~20 times

`@theme inline` declares `--color-acid`, `--color-ink`, `--color-bone`, `--color-signal` —
but no `*-foreground` counterparts. Every `text-acid-foreground` / `bg-acid-foreground`
compiles to nothing and the element silently inherits `--foreground` (near-black).
Visible damage: `MATTER / MOTION` renders near-black on a dark photo (unreadable,
`00-baseline/desktop-02`), `CULTURE` disappears entirely, the preloader wordmark and the
`Comeback` statements are all unintentionally dark-on-blue.

### C2 — `--ink` and `--acid` are both blue, 0.07 lightness apart

`--ink: oklch(0.36 0.18 263)` and `--acid: oklch(0.43 0.2 265)`. "Ink" is meant to be the
dark neutral; it is actually a second, near-identical cobalt. So `text-ink` (WorkPreview
project titles), `bg-ink/75` (FinalCTA scrim) and `border-ink` all render blue. The page
reads as cream plus one blue plus one orange, with no true dark anchor and no depth.

### C3 — `Comeback` pins for 420% = 4,680px, a quarter of the whole page

One flat-blue screen with words flying at random holds the reader for **5.2 viewport
heights**. It is the "massive dead space" in the reference screenshot: in a full-page
capture the pinned child is `position: fixed`, so its 4,680px `pin-spacer` photographs as
void. It also pins on mobile (4,389px), where it is a scroll-jail with no escape.

### C4 — `velocity-lean` leaves elements permanently skewed

`.velocity-lean` applies `transform: skewY(var(--scroll-velocity))`, fed from
`lenis.on("scroll")`. Lenis stops emitting when scrolling stops, so the **last** velocity
value sticks forever. WorkPreview cards and the EditorialMonolith headline sit visibly
sheared at rest (`00-baseline/desktop-10`) and read as a rendering fault.

### C5 — `Magnetic` inline `display:inline-block` defeats `hidden`

`<Magnetic className="hidden md:inline-block">` in `Nav` sets `display` inline, which beats
the utility class. The desktop "LET'S TALK" button therefore renders at 390px, wraps to two
lines and collides with the MENU button (`00-baseline/mobile-boot-4000ms`).

### C6 — no `ScrollTrigger.refresh()` after images or fonts settle

Every below-fold image is `loading="lazy"`, two sections pin, and the webfont swaps late.
Trigger positions are computed once against a layout that then moves by thousands of
pixels. Reveals fire at the wrong scroll offsets or not at all.

---

## HIGH

### H1 — one typographic voice for everything

`h1, h2, h3, .display` all get Inter 900 / uppercase / `line-height: .88`. The wordmark,
hero, section heads, stat numbers, marquee, service names, project titles and footer links
are the same gesture at different sizes. There is no hierarchy, only scale, and nothing for
the eye to rest on. The Playfair italic is loaded but used exactly once.

### H2 — `CampaignGrid` clips its own headline

`md:grid-rows-[minmax(22rem,55vh)_minmax(18rem,42vh)]` fixes the row box while the blue
cell uses `justify-between`; `DENSITY WITH DIRECTION.` overflows and the last line is cut
(`00-baseline/desktop-02`). The row of four unequal photos below reads as a moodboard, not
a composition — no shared grid rhythm, four different aspect ratios.

### H3 — the hero is headline plus image plus two buttons

No supporting statement, no proof, no positioning line — nothing answers *what do you
actually do*. The right-hand "ATTENTION, ART DIRECTED." block is a white card with a drop
shadow and an orange square: a UI placeholder in a design that claims to reject cards.
`BRANDS` in outline with `ml-[0.45em]` collides with the line below at `line-height: .88`
and reads as a mistake rather than a device.

### H4 — the hero image is neutralised

`opacity-70` plus `mix-blend-multiply` plus two stacked background gradients
(`via-background/70` and `via-background/55`) leave grey mush. The most expensive asset on
the page carries no art direction.

### H5 — `WorkPreview` offsets open holes, not rhythm

`md:mt-40`, `md:ml-12`, `md:mt-24` are applied by index modulo with no relationship to the
grid. The result is ~600px of empty cream between items rather than an editorial stagger.

### H6 — sections butt-join with hard cuts

Fourteen sections, each self-contained, each with its own `py-[14vh]`. Nothing carries
across a boundary — no shared rule, no colour hand-off, no image continuation. The page is
a stack, not a composition.

### H7 — `Stats` reads as empty at rest

Numbers start at literal `0` and only animate when the trigger fires; with C6 they often
never do. `min-h-56` cells with `justify-end` leave the top two-thirds of each cell blank
regardless.

### H8 — parallax is uniform, so there is no depth

Every parallax call is roughly the same magnitude (`yPercent` between 7 and 18) on every
layer. Background, image and type move together, which cancels the effect it is trying to
create.

---

## MEDIUM

- **M1** `SignalStrip` appears twice with identical content; the second is filler.
- **M2** Preloader wordmark is `text-[14vw]` × 11 characters = ~154vw, clipped both sides.
  Total block is ~2.0s before the hero is legible, with nothing to look at.
- **M3** Route-transition overlay says literal `LOADING` in 8vw type — a placeholder.
- **M4** Custom cursor: four states all render the same 20–24px acid circle; the `view` and
  `explore` labels are `text-ink` (blue) on acid (blue), so invisible.
  `mix-blend-difference` on a blue-on-blue pair does nothing.
- **M5** `Cursor` hides the native cursor document-wide with no fallback if the RAF loop is
  interrupted.
- **M6** Nav is always visible and always the same height; it fights the hero rather than
  belonging to it, and it crops section headings on scroll.
- **M7** Ten JPEGs, 1.48MB total, no `srcset`, no width/height on half of them, no modern
  format. Hero JPEG is 198KB at one resolution for every breakpoint.
- **M8** `Process` (pinned horizontal) is only used on `/process`, not on the homepage — so
  the homepage has no process narrative at all.
- **M9** Footer is a four-column sitemap. It ends the film on an admin screen.

## LOW

- **L1** `Comeback` wraps its `section` in a bare `div` for no reason.
- **L2** `SplitLines` splits on newline only — no word-level or character-level control.
- **L3** `Reveal` hard-codes `y: 40` / `duration: 1` / `power3.out` per call site; no shared
  motion constants anywhere in the codebase.
- **L4** ~~`useIsMobile` duplicates `usePointerFine`~~ — **withdrawn.** It is a
  dependency of the vendored `ui/sidebar.tsx` primitive, so it stays.
- **L5** Demo copy ("Demo Client One", em-dash stat values) ships on the homepage.

---

## Accessibility

- Contrast: acid `oklch(.43 .2 265)` under near-black body text fails AA; every
  `text-acid-foreground` surface is currently an unintended, untested pairing (C1).
- `prefers-reduced-motion` is honoured by skipping GSAP entirely (correct) **but** the CSS
  marquees, `campaign-drift` and `signal-scan` are only damped to `0.001ms`, which makes
  them jump to their end state rather than stop.
- Focus states exist (2px acid outline) but the outline is invisible on acid surfaces.
- `Comeback` pinned scroll has no keyboard path through it.

## Verdict

| | |
| --- | --- |
| **KEEP** | Stack, routing, Lenis+GSAP wiring shape, Supabase server fns, data layer shape, shadcn form primitives, the photography itself |
| **REWORK** | Hero, CampaignGrid, EditorialMonolith, WorkPreview, Stats, ServicesList, AboutBlock, Nav, Preloader, Footer, colour tokens, type scale, all parallax magnitudes |
| **REPLACE** | `Comeback` (5-screen gimmick to 2-screen statement), `velocity-lean`, `Cursor` states, the hero side card, the route-transition overlay |
| **REMOVE** | Duplicate `SignalStrip`, decorative `signal-scan` bar, standalone `Newsletter` band (folded into the footer) |


---

## Resolution

Every Critical and High finding is closed. See `CHANGELOG.md` for what changed
and `decisions/` for the load-bearing calls.

| | Closed | Notes |
| --- | --- | --- |
| C1–C6 | all | Each was a wiring fault invisible in isolation — an undefined token, a stuck CSS variable, a missing refresh. |
| H1–H8 | all | |
| M1–M9 | M8 open by choice | `Process` stays off the homepage — `decisions/homepage-scope.md`. |
| L1–L5 | L4 withdrawn, L5 open | L5 is demo content, a studio decision, and labelled as demo in the UI. |
| A11y | all | 14/14 contrast pairs at AA, reduced motion verified, 54 keyboard stops clean. |

Two findings only surfaced because the page was rendered and measured rather
than read: the pinned section booking a full unit of CLS, and Lenis silently
reverting the route-change scroll-to-top. Neither is visible in the source.
