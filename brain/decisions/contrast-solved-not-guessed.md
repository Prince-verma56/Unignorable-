# Accent lightness was solved, not picked

**Decision.** `--signal` is `oklch(0.52 0.165 42)` on paper and
`oklch(0.66 0.145 45)` inside the ink register.

**Why two values.** The clay is used for meta type at 0.7rem, which needs 4.5:1.
A single lightness cannot clear that on both a 0.962 paper and a 0.165 ink field.
The register override is the natural place for the second value.

**How they were chosen.** A lightness sweep measured in the browser, rather than
eyeballing an oklch value:

```
signal L    on bone   on bone-deep
0.520        5.29       4.70      ← chosen
0.585        4.08       3.62      ← the original: failed both
```

**A trap worth recording.** Chrome returns `oklch(...)` from `getComputedStyle`
for wide-gamut colours, so parsing the computed string gives you the oklch
components and a nonsense ratio — the first run of the probe reported "body on
paper" as 1.02:1 when it is actually 17.24:1. `brain/qa/contrast.mjs` paints to a
canvas and reads the pixel back instead, and composites alpha tokens over the
field they actually sit on rather than over white.

**Result.** All 14 pairs the page paints meet AA. Re-run with
`node brain/qa/contrast.mjs`; it exits non-zero on a regression.
