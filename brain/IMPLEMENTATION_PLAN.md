# IMPLEMENTATION_PLAN

Status: `[ ]` todo · `[~]` in progress · `[x]` done + QA'd

| Phase | Work | Status |
| --- | --- | --- |
| 0 | Audit, QA harness, brain | `[x]` |
| 1 | **Foundation** — colour tokens (C1, C2), space/grid tokens, kill `velocity-lean` (C4) | `[x]` |
| 2 | **Typography** — two voices, real scale, stop 900-uppercase-everything (H1) | `[x]` |
| 3 | **Motion core** — `lib/motion`, depth layers, ScrollTrigger refresh discipline (C6, H8) | `[x]` |
| 4 | **Preloader + Nav** — shorter entrance (M2), scroll-direction nav, fix `Magnetic` (C5) | `[x]` |
| 5 | **Hero** — composition, art direction, supporting copy (H3, H4) | `[x]` |
| 6 | **Section architecture** — `Statement` replaces `Comeback` (C3), footer register (M9) | `[x]` |
| 7 | **Sections** — CampaignGrid (H2), Monolith, Stats (H7), Services, Work (H5), About | `[x]` |
| 8 | **Transitions** — register seams, nav inversion over ink (H6) | `[x]` |
| 9 | **Responsive** — mobile compositions, unpin below `lg` | `[x]` |
| 10 | **Performance** — WebP srcset pipeline, CLS fix, payload budget (M7) | `[x]` |
| 11 | **Accessibility** — contrast pass, reduced motion, focus on dark (A1–A4) | `[x]` |
| 12 | **Visual QA** — full loop across three viewports, all routes | `[x]` |

## Not done, deliberately

- **AVIF variants.** WebP already took the image payload from 1,447KB to 588KB.
  AVIF would save perhaps another 25%, at the cost of doubling the generated
  asset count. Worth doing when the real photography replaces the placeholders.
- **`Process` on the homepage** (audit M8). The homepage is already 15.5 screens
  and the process narrative has its own route, linked from the nav. Adding a
  pinned horizontal track would spend another ~1.5 screens on content that is
  one click away. See `decisions/homepage-scope.md`.
- **Replacing demo copy.** "Demo Client One", the em-dash result values and the
  placeholder wordmarks are content decisions for the studio, not design work.
  Every one of them is labelled as demo in the UI.
