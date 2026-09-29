# DESIGN_SYSTEM

Source of truth: `src/styles.css`. Nothing below should be re-invented at a call site.

## Principle

The page should read expensive because of **composition, contrast and restraint** — not
effects. One accent colour. One dark. One paper. Two type voices. Everything else is
spacing.

## Colour

Sampled from the hero clip, not chosen. See
`decisions/lime-is-not-a-text-colour.md`.

| Token | Value | Role |
| --- | --- | --- |
| `--bone` | `oklch(0.963 0.008 92)` | Paper. The default page. Warm, not white. |
| `--bone-deep` | `oklch(0.925 0.012 92)` | Second surface — proof, the quiet band. |
| `--ink` | `oklch(0.145 0.008 100)` | The anchor. A deep, near-neutral black. |
| `--ink-foreground` | `oklch(0.958 0.008 92)` | Type on ink. |
| `--chrome` | `oklch(0.925 0.004 60)` | From the clip's speculars (`#ebe5e2`). A surface and a rule colour, never type. |
| `--acid` | `oklch(0.78 0.175 112)` | **The signature.** The clip's own chartreuse (`#b6bf26`), solved to L .78. |
| `--acid-foreground` | `--ink` | Type on lime. 10.1:1. |
| `--signal` | `oklch(0.52 0.165 52)` | Kiln clay. Micro-accent only: indices, one editorial italic, punctuation. |
| `--muted-foreground` | `oklch(0.46 0.014 75)` | Secondary copy. |
| `--border` / `--border-strong` | `ink / 14%` · `ink / 28%` | Hairlines, never heavier than 1px. |

Rules:

1. **Lime is either a field with ink type on it, or type on ink.** It measures
   1.75:1 on paper at any lightness that still reads as lime, so it never sets
   type there. The focus ring follows the same rule — ink on paper, lime on ink.
2. **One lime field per page.** The discipline band is it. The accent panel
   carries lime *type* on ink instead, which is why it reads as part of the
   photography rather than as a coloured rectangle.
3. **Clay never fills.** It marks: section indices, the editorial italic, a rule.
   It never competes with the lime.
4. `data-register="ink|paper-deep"` flips the semantic tokens for a subtree, so
   a component never needs to know which field it is sitting on.
5. **No blue.** The one asset carrying a blue plane
   (`editorial-monolith.jpg`) is held to `saturate(.14) sepia(.12)` so it sits
   in the chrome register.

## Controls

One primary, one secondary, across the whole site. `src/components/ui/action.tsx`.

| | |
| --- | --- |
| `<Action>` | The primary. 2px radius, meta type at full tracking, a hairline rather than a shadow, and an arrow isolated in its own square micro-container: `[ LABEL ↗ ]`. |
| `<ActionLink>` | The secondary. Not a second filled button — a label over a rule that grows from 2.5rem to full width on hover while the label and arrow shift 3px. The hierarchy is unmistakable at a glance. |

Variants: `default` (ink → lime), `inverse` (bone → lime, for ink fields),
`accent` (lime → ink), `outline`, `ghost`. Five, not fifteen.

Interaction: 320ms on a `cubic-bezier(.16,1,.3,1)`, `active:scale-[0.985]` for
physical compression, arrow displaces 3px on hover. Magnetic attraction is
capped at **7px** and is desktop-only — a control that chases the cursor reads
as a toy.

Radius is `2px` everywhere; `4px` maximum on media. No pills, no rounded cards,
no shadows, no gradients.

## Typography

Two voices, deliberately far apart.

- **Inter** (variable, 400–900) — structure, display, UI, data.
- **Instrument Serif** (italic) — the editorial counterweight. Replaces Playfair, which was
  loaded and then used once. Used for exactly one idea per section, never for a paragraph.

| Class | Face | Size | Weight / LH / Tracking | Use |
| --- | --- | --- | --- | --- |
| `.type-display` | Inter | `clamp(3.6rem, 9.5vw, 11rem)` | 900 / .84 / -.045em | Hero only |
| `.type-title` | Inter | `clamp(2.4rem, 5.6vw, 5.5rem)` | 800 / .88 / -.035em | Section h2 |
| `.type-subtitle` | Inter | `clamp(1.5rem, 2.6vw, 2.6rem)` | 700 / 1.0 / -.02em | h3, project names |
| `.type-lead` | Inter | `clamp(1.05rem, 1.5vw, 1.35rem)` | 400 / 1.55 / -.005em | Section lead copy |
| `.type-body` | Inter | `0.95rem` | 400 / 1.65 / 0 | Paragraphs |
| `.type-meta` | Inter | `0.7rem` | 500 / 1.3 / .22em, upper | Eyebrows, labels, nav |
| `.type-numeral` | Inter | contextual | 800, `tabular-nums` | Stats, indices |
| `.editorial` | Instrument Serif | contextual | italic 400 / .95 | One phrase per section |

Rules:

1. **`h3` is not a display face.** It is 700, sentence case, `line-height: 1`. The original
   build made every heading Inter-900-uppercase; that is why nothing had hierarchy (H1).
2. Uppercase is reserved for `.type-display`, `.type-title` and `.type-meta`. Nothing else.
3. Optical tracking tightens as size grows — never let a 9vw headline sit at `0`.
4. Body copy never exceeds `68ch`; lead copy never exceeds `46ch`.
5. Numerals in data contexts are tabular so columns align.

## Space

Sections stop inventing their own padding.

| Token | Value |
| --- | --- |
| `--space-band-sm` | `clamp(3.5rem, 7vh, 6rem)` |
| `--space-band` | `clamp(5.5rem, 12vh, 10rem)` |
| `--space-band-lg` | `clamp(7rem, 17vh, 14rem)` |
| `--edge` | `clamp(1.25rem, 4.5vw, 5rem)` |
| `--gutter` | `clamp(0.75rem, 1.6vw, 1.75rem)` |

`.band`, `.band-sm`, `.band-lg` apply vertical rhythm. `.edge` applies the horizontal
gutter. A section that needs different spacing has to justify it in `decisions/`.

## Grid

12 columns, `--gutter` between. Compositions are built from a small set of column spans so
the page has a repeating skeleton the eye can learn:

- `7 / 5` — image left, text right (the editorial default)
- `5 / 7` — the inversion, used once per page as a hinge
- `8 / 4` — dominant image with a metadata rail
- `12` — full-bleed moments only

Asymmetry comes from **which** span is used and from vertical offset on a shared baseline —
not from arbitrary `mt-40` on every fourth item (H5).

## Borders, radius, ratio

- Radius: `2px` everywhere. Not rounded. `4px` maximum on media.
- Borders: `1px`, `--border`. A section boundary uses `--border-strong`.
- Image ratios, fixed set: `16/10` (landscape editorial), `4/5` (portrait), `1/1` (detail),
  `21/9` (full-bleed band). Four ratios across the whole site — no fifth.

## Containers

- `--measure-wide`: `88rem` — the outer bound for grid compositions
- `--measure-text`: `68ch` — body copy
- `--measure-lead`: `46ch` — lead copy
- Full-bleed sections ignore both and run edge to edge.
