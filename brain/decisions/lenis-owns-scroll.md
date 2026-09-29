# Lenis owns the scroll position

**Decision.** Nothing calls `window.scrollTo()` directly. Programmatic scrolling
goes through `scrollToTop()` / `getLenis()` in `hooks/useSmoothScroll.ts`.

**Why.** Lenis reasserts its own `animatedScroll` on the next frame, so a bare
`window.scrollTo()` is silently reverted. Demonstrated:

```
after wheel     scrollY 2398
scrollTo(4000) + 900ms
after jump      scrollY 2400     ← the jump never happened
```

`SiteFrame` was calling `window.scrollTo(0, 0)` on every route change. With Lenis
active that call did nothing, so navigating from deep in one page left the reader
stranded at the previous page's offset on the new one.

**Also affected the QA harness.** It stepped through the page with
`window.scrollTo`, which meant it was photographing a page that had not moved and
reveals that had never fired. `brain/qa/shot.mjs` now drives real wheel events,
which is both accurate and closer to what a reader does.

**Exception.** `scrollToTop()` falls back to `window.scrollTo` when Lenis is
absent — under `prefers-reduced-motion`, and before mount.

**Checked and fine.** Native focus scrolling still works: a full 54-stop tab pass
leaves nothing off-screen (`brain/qa/a11y.mjs`).
