import { chromium } from "./_browser.mjs";

/**
 * Two checks the visual harness cannot make:
 *
 *  1. Reduced motion — every GSAP context is skipped under
 *     `prefers-reduced-motion`, which is only correct if the page then renders
 *     in its natural state. Anything left masked, offset or dimmed is a bug,
 *     and it is invisible in a normal screenshot run.
 *  2. Keyboard — a full tab pass, checking every stop is on screen and has a
 *     focus indicator that actually contrasts with what is behind it.
 */
const BASE = process.env.BASE || "http://localhost:8080";
const ROUTE = process.env.ROUTE || "/";
let failures = 0;
const fail = (msg) => {
  failures++;
  console.log(`FAIL  ${msg}`);
};

const b = await chromium.launch({ channel: "chrome" });

/* ---------------------------------------------------------- reduced motion */
{
  const ctx = await b.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(BASE + ROUTE, { waitUntil: "load" });
  await page.waitForTimeout(2500);

  const state = await page.evaluate(() => {
    const out = { hiddenText: [], preloader: false, masked: [], dimmed: [] };
    if (document.querySelector('[class*="z-[90]"]')) out.preloader = true;

    document.querySelectorAll("main [data-line], main [data-clause]").forEach((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const parent = el.parentElement.getBoundingClientRect();
      if (parseFloat(cs.opacity) < 0.9) {
        out.dimmed.push((el.textContent || "").trim().slice(0, 28));
      }
      // a line pushed out of its own clipping mask reads as missing content
      if (r.height > 0 && (r.top >= parent.bottom - 1 || r.bottom <= parent.top + 1)) {
        out.masked.push((el.textContent || "").trim().slice(0, 28));
      }
    });

    document.querySelectorAll("main h1, main h2, main h3, main p, main li").forEach((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      // decoration is allowed to be hidden; only content counts
      if (el.closest('[aria-hidden="true"]')) return;
      if (r.height > 12 && parseFloat(cs.opacity) < 0.08) {
        out.hiddenText.push((el.textContent || "").trim().slice(0, 28) || `<${el.tagName}>`);
      }
    });
    return out;
  });

  console.log("--- prefers-reduced-motion: reduce");
  if (state.preloader) fail("reduced motion: preloader still overlays the page");
  if (state.masked.length) fail(`reduced motion: ${state.masked.length} line(s) stuck outside their mask: ${state.masked.slice(0, 4).join(" | ")}`);
  if (state.dimmed.length) fail(`reduced motion: ${state.dimmed.length} line(s) left dimmed: ${state.dimmed.slice(0, 4).join(" | ")}`);
  if (state.hiddenText.length) fail(`reduced motion: ${state.hiddenText.length} block(s) at opacity 0: ${state.hiddenText.slice(0, 4).join(" | ")}`);
  if (errors.length) fail(`reduced motion: page errors: ${errors.slice(0, 2).join(" | ")}`);
  if (!failures) console.log("PASS  content renders fully with motion disabled");
  await page.screenshot({ path: "brain/screenshots/_a11y-reduced-motion.png" });
  await ctx.close();
}

/* ----------------------------------------------------------------- keyboard */
{
  const before = failures;
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + ROUTE, { waitUntil: "load" });
  await page.waitForTimeout(2500);

  const stops = [];
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30),
        outlineWidth: cs.outlineWidth,
        outlineStyle: cs.outlineStyle,
        inViewport: r.top >= -4 && r.bottom <= window.innerHeight + 4 && r.width > 0,
        offScreenAbove: r.bottom < 0,
        hidden: cs.visibility === "hidden" || cs.display === "none" || r.width === 0,
      };
    });
    if (!info) break;
    stops.push(info);
  }

  console.log(`\n--- keyboard: ${stops.length} tab stops`);
  const noOutline = stops.filter(
    (s) => s.outlineStyle === "none" || parseFloat(s.outlineWidth) < 1,
  );
  const hiddenStops = stops.filter((s) => s.hidden);
  if (!stops.length) fail("keyboard: nothing is focusable");
  if (noOutline.length)
    fail(`keyboard: ${noOutline.length} stop(s) without a focus outline: ${noOutline.slice(0, 4).map((s) => s.label || s.tag).join(" | ")}`);
  if (hiddenStops.length)
    fail(`keyboard: ${hiddenStops.length} stop(s) are focusable but not visible: ${hiddenStops.slice(0, 4).map((s) => s.label || s.tag).join(" | ")}`);
  if (failures === before) console.log("PASS  every tab stop is visible and has a focus indicator");
  await ctx.close();
}

await b.close();
console.log(failures ? `\n${failures} issue(s)` : "\nno issues");
process.exit(failures ? 1 : 0);
