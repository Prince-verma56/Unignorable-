# Route changes use a cover, not a cross-fade

**Decision.** A real DOM panel in `RouteTransition.tsx`, mounted in `__root.tsx`.
Navigation waits for it. No transition library, no View Transitions API.

## Three attempts, two wrong

1. **An overlay in `SiteFrame` on `pathname` change.** By the time that effect
   ran, React had already replaced the page — so the new route popped in and was
   *then* covered. The reverse of a transition.

2. **The View Transitions API.** It holds the old frame correctly, but
   cross-fades it with the new one: both pages are on screen together and you
   can read one through the other. Styling a cover onto `html::after` does not
   help, because the transition overlay renders above the document's own
   pseudo-elements.

3. **A real cover, with navigation gated on it.** This one.

## The sequence

```
click        panel below the fold
covering     panel rises to cover the current page   480ms
             → navigate
covered      panel holds while the new route paints  160ms
revealing    panel continues up and off              620ms
```

The panel always travels one direction, so the wipe reads as a single move
rather than a curtain returning the way it came. A lime rule rides its leading
edge. Exactly one page is visible at any moment — no blend, no split edge, no
flash of background.

## The bug that made this hard to find

`RouteTransition` was first mounted inside `SiteFrame`. **`SiteFrame` is
rendered by each route**, so it unmounts on navigation and takes the
transition's state with it — mid-wipe. Traced frame by frame, the panel rose to
`y=0`, then snapped back to `y=900` and hid, instead of lifting away:

```
ms   panelY  path
482      11  /
545       0  /          ← covered
764     900  /services  ← state lost on remount
```

It lives in `__root.tsx` now, above the `Outlet`, where it survives navigation.

## Interception

Clicks are caught in the capture phase on `document`, so every internal link
works without opting in. Modified clicks, new-tab clicks, external links, hashes
and downloads all fall through to the browser. Under `prefers-reduced-motion`
the listener is never attached and navigation is immediate.

Scroll reset goes through Lenis — see `lenis-owns-scroll.md`.
