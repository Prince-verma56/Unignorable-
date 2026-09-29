# Pins use `pinType: "transform"`

**Decision.** Every `ScrollTrigger` pin passes `pinType: "transform"`.

**Why.** ScrollTrigger's default is `"fixed"`, which switches the pinned element
to `position: fixed` when the pin engages. That reflows the document, and the
browser books it as a layout shift. Measured on this page: a single **1.0** CLS
entry every time the pin activated, and up to **3.54** cumulative across a full
scroll — a failing Core Web Vital from one section.

With `"transform"` the element is translated instead, which pins with no reflow
and plays better with Lenis owning the scroll position.

**Measured.** `node brain/qa/cls.mjs`

```
before   during scroll: 1 shift,  total 1.000   (SECTION … min-h-[100svh] …)
after    during scroll: 0 shifts, total 0.000
```

Page CLS went from 1.0–3.5 to **0.0045**, all of it in two sub-0.004 shifts
during load.
