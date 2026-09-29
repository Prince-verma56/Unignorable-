# ROUTE_AUDIT

One film, seven chapters. Each route keeps its own personality; the system
underneath them is shared.

Re-run with `ROUTE=/work node brain/qa/shot.mjs <label>` (PowerShell — Git Bash
rewrites a leading-slash env value into a Windows path).

---

## The shared system

| Piece | What it guarantees |
| --- | --- |
| `<PageHeader />` | Every inner route opens the same way: micro-label → headline → supporting statement → visual anchor → scroll rail. |
| `<Seam />` | Register changes dissolve, and the three that matter carry the next section's photography rather than a colour ramp. |
| `<Action />` / `<ActionLink />` | One primary control and one secondary control across the whole site. |
| `data-register` | A subtree flips the semantic tokens; the nav reads what is under it and inverts. |
| View Transitions | Route changes are a camera move, not a replacement. See §Route transitions. |

---

## `/` — Home

**KEEP** · hero (full-bleed clip, ivory action, directional scrim) · lime
discipline band · reel grid · craft section · pinned exhibition · proof ·
capabilities · selected work · film · about · quote · client marquee · close.

**REWORKED this pass**
- The cobalt panel beside *Density with direction* became an ink field with
  oversized lime type and a single hairline. It read as a UI panel dropped into
  a page of photography.
- The film section was a static headline in a very large dark box. It is now
  scrub-driven: the camera pushes into the frame, contrast comes up, and the
  second statement rises out of the brightened image as the first leaves.
- The closing CTA gained framing rules and a metadata rail, so the last screen
  is a composition rather than a headline in an empty field.
- The marquee → CTA hand-off carries the CTA's own photograph, masked in, so the
  darkness arrives as an image.
- About's lower band: the right column held only a pull-line pinned to the floor
  of a 660px row. It now carries a metadata register above the quote.

**REMOVED** · the second discipline band · the standalone newsletter band
(folded into the footer) · the cobalt system entirely.

---

## `/work` — Proof

**Personality:** proof and case-study storytelling.

**REWORKED** · opening had ~400px of nothing above the label, because the header
combined `min-h-[100svh]`, `justify-center` and `pt-[20vh]`. Now a 76svh
composition anchored to the floor with `campaign-chrome` as the right bleed.
· `WorkPreview` runs `compact` here, so the page does not state its own title
twice in two type sizes.

**KEEP** · the alternating 7/4 project stagger · per-project metadata rail.

**Remaining:** project bodies are demo copy, labelled as such.

---

## `/services` — Capabilities

**Personality:** an interactive editorial list.

**REWORKED** · the hover preview was absolutely positioned at `right-[6vw]`,
which is exactly where the row descriptions are right-aligned — the image sat on
the copy it was meant to illustrate. Rows now end at column 8 and the preview
occupies 9–12 as a sticky rail, so they cannot collide at any width.
· The index turns lime on the active row; the row inverts to ink.
· `ServicesList` runs `compact` here.

**KEEP** · row-level hover, dimming, arrow displacement.

**Below `xl`:** the preview rail does not exist and the row carries its own
one-line summary — the row is always the affordance.

---

## `/about` — The studio

**Personality:** people, philosophy, operating system.

**REWORKED** · opening anchored on `studio-1` · the lower collage rebuilt on one
baseline (it previously pulled a portrait up with `mt-[-8vh]` into the frame
above it, which read as an accident) · right column now carries a metadata
register above the pull-line.

**KEEP** · headline-left / lead-right rhythm shared with the reel, capabilities
and work sections.

---

## `/process` — The method

**Personality:** progression.

**REPLACED** · was a headline, a paragraph and a horizontal track of five cards
floating in the middle of an otherwise empty pinned screen.

Now a progressive pinned timeline: the step list holds the left column, the
active step brightens and expands while the others collapse to a title, and the
right frame changes with it. The motion explains the sequence.

Two bugs found and fixed while building it, both invisible in the source:
- `lg:block` on the collapsing wrapper re-set `display` at the exact breakpoint
  the collapse is for, so `grid-template-rows: 0fr` never applied and the rows
  stayed tall.
- With all five bodies expanded the list ran taller than the pinned frame, so
  the step the timeline had just made active could be scrolled out of sight.

**Below `lg`:** no pin; every step keeps its body and its own image inline.

---

## `/contact` — The invitation

**Personality:** conversion and trust.

**KEEP** · the split composition · the WhatsApp tab overlapping the frame.

**REWORKED** · field labels sit above their input in meta type · focus restores
a real ring (inputs carried `outline-none` with only a 1px border change) ·
submit uses the system's primary action.

---

## `/work/$slug`, `/services/$slug` — Detail

**KEEP** · 21/9 key visual with the accent word in the scrim · sticky chapter
titles · results as tabular numerals · next-item navigation.

---

## Route transitions

Native View Transitions, enabled with `defaultViewTransition` on the router.

The outgoing frame settles back and dims (420ms) while the incoming one rises
through it (620ms, 80ms in), and a lime hairline sweeps the seam. Browsers
without support navigate normally — no flash, no overlay.

**What this replaced:** an overlay that swept a dark panel across a page that had
*already* been replaced. The new route popped in first and was then covered,
which is the reverse of a transition.

The preloader is separate and plays once per page load, never on navigation.

---

## Imagery

Approved language: black · warm ivory · acid chartreuse · chrome · monochrome
film · warm architecture. The lime is sampled from the hero clip (`#b6bf26`).

`editorial-monolith.jpg` carries a large blue glass plane — the one colour
outside that language. It is held to `saturate-[0.14] sepia-[0.12]` wherever it
appears, which lands it in the chrome/architecture register rather than
discarding a strong frame. Every other asset already belongs.
