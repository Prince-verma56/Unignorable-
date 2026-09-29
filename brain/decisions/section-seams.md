# Register changes are a crisp edge plus a parallax arrival

**Decision.** No gradient, no blur, no masked photograph at the boundary. A
1px accent rule marks the cut, and the incoming section's content rises into
place with parallax as the boundary crosses the viewport (`riseIn` in
`lib/motion`).

## What came before, and why both versions failed

1. **A colour ramp** from the outgoing register to the incoming one. A soft edge
   between a light section and a dark one is a blurred grey band, and it reads
   as exactly that — a CSS gradient, not a designed transition.

2. **A masked photograph layered on the ramp**, so the darkness would "arrive as
   an image". It still washed the edge grey before the photograph was legible,
   and then cut hard into the next section anyway. Putting imagery on top of the
   problem did not remove it.

The edge itself was never the thing that needed softening. What was missing was
any sense that the next section was *arriving*.

## What it does now

The boundary is honest — one plane ends, the next begins. The content of the
incoming section starts offset downward and settles as the section crosses the
viewport, so the two planes pass each other. The rule is a single hairline that
fades out at both ends.

Magnitude is `DEPTH`-scaled: full on desktop, half at `md`, off on phones, where
a parallax offset on a short screen is motion for its own sake.
