# The lime is sampled, and it never sets type on paper

**Decision.** `--acid` is `oklch(0.78 0.175 112)` — the hero clip's own
chartreuse. It is either a field carrying ink type, or type on ink. It never
sets type on paper.

## Where the value came from

Sampled from the hero frame rather than chosen. The clip's most saturated
greens cluster at `#b6bf26` / `#a2b51d` / `#c0c932`; the warm highlights at
`#e3a127`; the specular chrome at `#ebe5e2`. Those three became the accent, the
micro-accent and `--chrome`.

A lightness sweep then picked the working value:

```
lime L    as text on ink    as a field under ink type    on paper
0.70          7.60                  7.60                   2.33
0.78         10.13                 10.13                   1.75   ← chosen
0.86         13.21                 13.21                   1.34
```

**L .78 measures 10.1:1 in both directions** — one token does both jobs, which
is why the discipline band, the accent panel and the statement accent can all
be the same colour without a second variable.

## The rule this forces

Lime never clears 2:1 on ivory at any lightness that still reads as lime. So:

- lime **field** + ink type — the discipline band, the accent panel
- lime **type** on ink — the statement accent, the closing headline, indices on
  a hovered row
- **never** lime type on paper

The focus ring follows the same rule: `--ring` is the anchor on paper and the
lime inside the ink register, because a lime ring on ivory is invisible.

## What it replaced

`--acid` was `oklch(0.455 0.215 264)` — a cobalt with no relationship to the
photography, and `--ink` was a second cobalt 0.07 lightness from it. The page
read as cream plus two blues. Nothing in the imagery was blue except one glass
plane in `editorial-monolith.jpg`, which is now held to
`saturate(0.14) sepia(0.12)` so it sits in the chrome register instead.

Verify with `node brain/qa/contrast.mjs` — 15 pairs, all AA.
