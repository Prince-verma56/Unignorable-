# RESPONSIVE_SYSTEM

Breakpoints are composition changes, not scale changes.

| Name | Range | Composition |
| --- | --- | --- |
| `sm` | < 640 | Single column. One idea per screen. No pinning, no horizontal tracks, no parallax on media. Display type caps at 13vw. |
| `md` | 640–1023 | Two-column where it earns it (image + meta). Still no pinning. Parallax at half magnitude. |
| `lg` | 1024–1439 | Full 12-col grid, asymmetry on, pinning on, parallax at full magnitude. |
| `xl` | >= 1440 | Adds the metadata rails and hover previews. Display type stops growing at 11rem. |

## Rules

1. **Pinning is desktop-only.** `Statement` and `Process` pin at `lg` and above. Below
   that they render as vertical sequences. A pinned section on a touch device is a scroll
   jail (audit C3).
2. **Parallax scales with the breakpoint**, via `DEPTH` multiplier: `sm` 0, `md` 0.5,
   `lg+` 1. Mobile GPUs and 60fps matter more than depth.
3. **Hover-only affordances need a touch equivalent.** The services hover preview and the
   image zoom do not exist below `xl`; the row itself is the affordance.
4. **Type does not just shrink.** `clamp()` floors are set so display type stays a display
   at 390px (13vw) rather than becoming a heading.
5. **No horizontal overflow, ever.** Decorative marquees are the only elements allowed to
   exceed the viewport, and only inside `overflow: hidden` parents with the parent clipping
   verified by the QA harness.
6. **Touch targets** are 44px minimum. The baseline services rows and testimonial dots
   were 2px tall.

## Known mobile fixes from baseline

- Nav CTA rendered at 390px because of the `Magnetic` inline `display` (C5) and collided
  with the menu button.
- Hero left ~40% dead space above the headline; mobile now anchors the composition and
  caps the media at 62svh.
- `Comeback` pinned 4,389px on mobile; `Statement` does not pin below `lg`.
- `text-[18vw]` stat numerals and `text-[13vw]` menu items overflowed their gutters.
