# QA_CHECKLIST

The gate. Re-run all four before calling anything done.

```sh
node brain/qa/shot.mjs <label>        # 3 viewports, full scroll, overflow + errors
node brain/qa/contrast.mjs            # WCAG AA on every painted token pair
node brain/qa/a11y.mjs                # reduced motion + keyboard pass
node brain/qa/perf.mjs                # LCP, CLS, long tasks, payload
node brain/qa/cls.mjs                 # per-shift breakdown when CLS regresses
```

`ROUTE=/about node brain/qa/shot.mjs <label>` for inner routes (use PowerShell
or set the env var — Git Bash rewrites a leading-slash argument into a Windows
path).

## Automated — last run: all green

- [x] `horizOverflow: false` at 1440 / 834 / 390, on all seven routes
- [x] `overflowCount` contains only `.media-inner` and marquee tracks, each
      inside an `overflow: hidden` parent
- [x] `invisibleCount: 0` — no content block stuck at opacity 0
- [x] `errors: 0` — console and network clean, all routes
- [x] Page height under 16 viewport heights at 1440 (15.5)
- [x] No pin-spacer taller than 2.2 viewport heights (2.2)
- [x] All 14 contrast pairs meet AA
- [x] Reduced motion: no preloader, nothing masked, nothing dimmed
- [x] Keyboard: 54 stops, all on screen, all with a focus indicator
- [x] CLS 0.0045

## Visual — judged from the frames

- [x] Hero legible within ~1s, composed, art-directed
- [x] Typography has hierarchy, not just scale (display / title / subtitle /
      lead / body / meta, and `h3` is no longer display type)
- [x] No headline clipped by its own container
- [x] No dead band taller than one viewport without narrative reason
- [x] Registers hand off through seams — the one hard cut is the cobalt strip
- [x] Parallax layers move at visibly different rates (`DEPTH` steps)
- [x] Nothing left skewed, offset or mid-transform at rest
- [x] Cobalt appears at most once per viewport-height
- [x] Footer belongs to the film — it shares the CTA's ink field
- [x] Inner routes share the homepage's system (`PageHeader`, `Frame`, seams)

## Interaction

- [x] Scroll is smooth, not floaty; no hijacking
- [x] Route change returns to the top (it did not, before Lenis owned the scroll)
- [x] Mobile: no pinning, no hover-only affordance, 44px targets
- [x] Forms submit and report state

## Known gaps

- Production JS weight is unverified — the Nitro build needs `wrangler dev`.
  See the caveat in `PERFORMANCE.md`.
- Demo content (client names, case bodies, stat values) is still placeholder,
  and labelled as such in the UI.
