# /brain — persistent context for the UNIGNORABLE redesign

This folder is the memory of the redesign. Read it before changing the visual
system; change it here first, then in the code.

| File | What it holds |
| --- | --- |
| `SITE_AUDIT.md` | The state of the site at baseline, with severities, KEEP/REWORK/REPLACE calls, and how each finding was resolved |
| `DESIGN_SYSTEM.md` | Colour, type, space, grid, border, ratio tokens — the single source of truth |
| `ANIMATION_SYSTEM.md` | Motion principles, easing/duration/depth constants, the entrance choreography, per-animation spec |
| `SECTION_ARCHITECTURE.md` | Why each section exists, its register, and how it hands off to the next |
| `RESPONSIVE_SYSTEM.md` | Per-breakpoint composition rules (not just shrinking) |
| `PERFORMANCE.md` | Budget, measurements, invariants, and what the dev server cannot tell you |
| `IMPLEMENTATION_PLAN.md` | Phases with status, and what was deliberately not done |
| `QA_CHECKLIST.md` | The gate that must pass before "done" |
| `PROGRESS.md` | Current state, headline numbers, known issues |
| `CHANGELOG.md` | Meaningful changes, newest first |
| `decisions/` | One file per load-bearing decision, with the measurement behind it |
| `qa/` | The harness (see below) |
| `screenshots/` | Generated captures — git-ignored |

## The QA loop

The dev server runs on `:8080`. Nothing is finished until all four pass.

```sh
node brain/qa/shot.mjs <label>     # 3 viewports, full scroll: overflow, invisible blocks, errors
node brain/qa/contrast.mjs         # WCAG AA on every painted token pair (exits non-zero on fail)
node brain/qa/a11y.mjs             # reduced motion renders fully + full keyboard pass
node brain/qa/perf.mjs             # LCP element, CLS, long tasks, payload by type
node brain/qa/cls.mjs              # per-shift breakdown, when CLS regresses
```

Inner routes take a `ROUTE` env var. Use PowerShell or `$env:`/`set` — Git Bash
rewrites a leading-slash value into a Windows path:

```powershell
$env:ROUTE = "/work/meridian-coffee"; node brain/qa/shot.mjs case-study
```

Results land in `brain/screenshots/<label>/` with a `report.json`.

### Things the harness had to learn the hard way

- **It scrolls with real wheel events.** `window.scrollTo` is reverted by Lenis on
  the next frame, so the original harness was photographing a page that had not
  moved, with reveals that had never fired.
- **Contrast is read back from a canvas.** Chrome returns `oklch(...)` from
  `getComputedStyle` for wide-gamut colours, so parsing the computed string
  gives you the oklch components and a nonsense ratio.
- **Zero-opacity is not the only way content hides.** A line pushed outside its
  own `overflow: hidden` mask is invisible at full opacity; `a11y.mjs` checks for
  that under reduced motion, where no GSAP runs to bring it back.

Playwright is resolved from the npx cache by `qa/_browser.mjs` and drives the
system Chrome, so it is not a project dependency. If it cannot be found, run
`npx playwright@latest --version` once, or set `PLAYWRIGHT_PATH`.
