# Pinned sections get at most ~2 viewport heights

**Decision.** No section pins for more than ~2.2 viewport heights, and nothing
pins below the `lg` breakpoint.

**Why.** The baseline's `Comeback` pinned for `+=420%` — 4,680px, a quarter of
the entire 18,488px page — to fly eight words around a flat cobalt field at
random. It was also pinned on mobile at 4,389px, where it becomes a scroll jail
with no way out and no keyboard path through it.

It is also what produced the "massive dead space" in the reference screenshot:
in a full-page capture the pinned child is taken out of flow, so its pin-spacer
photographs as void.

**What replaced it.** `Statement` holds for `+=120%` (1,980px including the
section) and the motion has a job — each clause lifts from dim to full as it is
reached, so scrolling *is* the act of reading the manifesto. Below `lg` it is a
plain staggered reveal.

**Applies to.** `Statement`, and `horizontalTrack` in `lib/motion` (used by
`Process`), which is desktop-only for the same reason.
