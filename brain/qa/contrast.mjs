import { chromium } from "./_browser.mjs";

/**
 * WCAG contrast for the token pairs the page actually paints.
 *
 * Two things this has to get right:
 *  - Chrome returns `oklch(...)` from getComputedStyle for wide-gamut colours,
 *    so parsing the computed string gives you oklch components, not sRGB.
 *    Painting to a canvas and reading the pixel back is the reliable route.
 *  - `--signal` is redefined inside `[data-register="ink"]`, so it has to be
 *    read from an element in that register, not from `:root`.
 */
const BASE = process.env.BASE || "http://localhost:8080";

const b = await chromium.launch({ channel: "chrome" });
const p = await (await b.newContext()).newPage();
await p.goto(BASE, { waitUntil: "load" });
await p.waitForTimeout(1200);

const rows = await p.evaluate(() => {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 1;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  /*
   * `backdrop` matters: several tokens are declared with an alpha (the ink
   * register's --muted-foreground is bone at 58%). Compositing them over white
   * would report a contrast the user never sees, so the caller passes the
   * field the colour is actually painted on.
   */
  const rgb = (v, backdrop = "#ffffff") => {
    cx.fillStyle = backdrop;
    cx.fillRect(0, 0, 1, 1);
    cx.fillStyle = v;
    cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  };
  const hex = (c) => "#" + c.map((n) => Math.round(n).toString(16).padStart(2, "0")).join("");
  const lum = ([r, g, bb]) => {
    const f = (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bb);
  };
  const ratio = (a, c) => {
    const [x, y] = [lum(a), lum(c)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };
  const over = (fg, alpha, bg) => fg.map((c, i) => c * alpha + bg[i] * (1 - alpha));

  /*
   * Resolve tokens by painting them, not by reading them.
   *
   * `getComputedStyle().getPropertyValue("--ring")` returns the raw token
   * stream, so a token defined as `var(--acid)` comes back as the literal
   * string "var(--acid)" — which is not a colour, silently paints nothing, and
   * reports a contrast of exactly 1.00. Setting `color` on a probe element
   * inside the right scope forces substitution and gives the value the browser
   * actually paints.
   */
  const inkScope = document.querySelector('main [data-register="ink"]') ?? document.documentElement;
  const probes = new Map();
  const probeIn = (scope) => {
    let el = probes.get(scope);
    if (!el) {
      el = document.createElement("span");
      el.style.display = "none";
      scope.appendChild(el);
      probes.set(scope, el);
    }
    return el;
  };
  const resolve = (name, scope = document.documentElement) => {
    const el = probeIn(scope === document.documentElement ? document.body : scope);
    el.style.color = "";
    el.style.color = `var(${name})`;
    return getComputedStyle(el).color;
  };
  const tok = (name, scope = document.documentElement, backdrop) =>
    rgb(resolve(name, scope), backdrop);

  const bone = tok("--bone");
  const boneHex = hex(bone);
  const boneDeep = tok("--bone-deep");
  const ink = tok("--ink");
  const inkHex = hex(ink);
  const acid = tok("--acid");
  const out = [];
  const add = (label, fg, bg, size) => out.push([label, ratio(fg, bg), size]);

  add("body on paper", tok("--ink"), bone, "text");
  add("muted on paper", tok("--muted-foreground", document.documentElement, boneHex), bone, "text");
  add("clay meta on paper", tok("--signal"), bone, "text");
  add("clay meta on paper-deep", tok("--signal"), boneDeep, "text");
  add("foreground/60 on paper", over(tok("--ink"), 0.6, bone), bone, "text");
  add("foreground/70 on paper", over(tok("--ink"), 0.7, bone), bone, "text");
  add("body on ink", tok("--ink-foreground"), ink, "text");
  add("clay on ink", tok("--signal", inkScope, inkHex), ink, "text");
  add("bone/60 on ink", over(tok("--ink-foreground"), 0.6, ink), ink, "text");
  add("muted on ink", tok("--muted-foreground", inkScope, inkHex), ink, "text");
  add("ink text on lime", tok("--acid-foreground"), acid, "text");
  add("acid-fg/75 on lime", over(tok("--acid-foreground"), 0.75, acid), acid, "text");
  add("focus ring on paper", tok("--ring"), bone, "large");
  add("focus ring on ink", tok("--ring", inkScope, inkHex), ink, "large");
  add("lime text on ink", tok("--acid", inkScope, inkHex), ink, "text");
  probes.forEach((el) => el.remove());
  return out;
});

await b.close();

let failed = 0;
for (const [label, r, size] of rows) {
  const need = size === "large" ? 3 : 4.5;
  const ok = r >= need;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(6)}  (needs ${need})  ${label}`);
}
console.log(failed ? `\n${failed} pair(s) below AA` : "\nall pairs meet AA");
process.exit(failed ? 1 : 0);
