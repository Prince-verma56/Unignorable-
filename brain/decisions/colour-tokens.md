# Token names kept, values corrected

> **Superseded in part.** The values here were the first correction, away from
> the two-cobalt palette. The palette was then rebuilt again around the hero
> clip's chartreuse — see `lime-is-not-a-text-colour.md`. What still holds is
> the reasoning for keeping the *names*, and the `data-register` system.

**Decision.** The brand token names from the original build (`ink`, `bone`,
`acid`, `signal`) were kept. Their values were replaced and the missing
`-foreground` pairs added.

**Why not rename.** The names appear across seven routes and every section.
Renaming would have been a large mechanical diff touching files the redesign did
not otherwise need to change, for no user-visible gain. Correcting the values
fixed every call site at once.

**What was wrong.**

- `--ink` was `oklch(0.36 0.18 263)` — a second cobalt, 0.07 lightness from
  `--acid`. "Ink" is the dark anchor, so `text-ink` (project titles) and
  `bg-ink/75` (the CTA scrim) were rendering blue, and the page had no true dark.
  It is now `oklch(0.165 0.012 75)`.
- `--color-acid-foreground` was never declared, but `text-acid-foreground` was
  used ~20 times. Each one compiled to nothing and silently inherited near-black,
  which is why `MATTER / MOTION` was unreadable on its photograph and `CULTURE`
  was invisible entirely.

**Added.** `data-register="ink|paper-deep"` flips the semantic tokens for a
subtree, so a component does not need to know which field it is sitting on. It is
what lets the nav invert over dark sections, the preloader share the page's dark
register, and `<Seam />` name a target register rather than a hex value.
