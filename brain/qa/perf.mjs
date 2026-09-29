import { chromium } from "./_browser.mjs";

/**
 * Field-ish performance capture: LCP, CLS, long tasks and transfer weight,
 * measured while actually scrolling the page rather than on a cold idle load.
 *
 * Run against the production preview (`npm run build && npm run preview`) for
 * numbers that mean anything — the dev server serves unminified modules.
 */
const BASE = process.env.BASE || "http://localhost:8080";
const ROUTE = process.env.ROUTE || "/";

const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const transfers = [];
page.on("response", async (r) => {
  try {
    const h = r.headers();
    transfers.push({
      url: r.url(),
      type: (h["content-type"] || "").split(";")[0],
      bytes: Number(h["content-length"] || 0),
    });
  } catch {
    /* ignore */
  }
});

await page.addInitScript(() => {
  window.__perf = { lcp: 0, lcpEl: "", cls: 0, longTasks: [] };
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) {
      window.__perf.lcp = e.startTime;
      const n = e.element;
      // knowing WHICH element is the LCP candidate is the whole point — a slow
      // number means something different for an image than for gated text
      window.__perf.lcpEl = n
        ? `${n.tagName}.${String(n.className || "").slice(0, 45)} "${(n.textContent || "").trim().slice(0, 24)}"`
        : e.url || "(unknown)";
    }
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value;
  }).observe({ type: "layout-shift", buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) window.__perf.longTasks.push(Math.round(e.duration));
  }).observe({ type: "longtask", buffered: true });
});

await page.goto(BASE + ROUTE, { waitUntil: "load" });
await page.waitForTimeout(2500);
const afterLoad = await page.evaluate(() => ({ ...window.__perf }));

// scroll the whole page the way a reader would, so lazy media and scrubbed
// timelines are included in the measurement
await page.mouse.move(720, 450);
const total = await page.evaluate(() => document.documentElement.scrollHeight);
for (let guard = 0; guard < 900; guard++) {
  const y = await page.evaluate(() => window.scrollY);
  if (y >= total - 950) break;
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(16);
}
await page.waitForTimeout(1500);

const perf = await page.evaluate(() => ({
  ...window.__perf,
  domNodes: document.getElementsByTagName("*").length,
  imgs: document.images.length,
  scrollHeight: document.documentElement.scrollHeight,
}));

await b.close();

const byType = {};
let totalBytes = 0;
for (const t of transfers) {
  const key = t.type.startsWith("image/")
    ? "image"
    : t.type.includes("javascript")
      ? "script"
      : t.type.includes("css")
        ? "style"
        : t.type.includes("font")
          ? "font"
          : "other";
  byType[key] = (byType[key] || 0) + t.bytes;
  totalBytes += t.bytes;
}

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;
const longest = perf.longTasks.length ? Math.max(...perf.longTasks) : 0;
const over50 = perf.longTasks.filter((d) => d > 50).length;

console.log(`route            ${ROUTE}`);
console.log(`LCP              ${Math.round(afterLoad.lcp)}ms  ← ${afterLoad.lcpEl}`);
console.log(`CLS              ${perf.cls.toFixed(4)}`);
console.log(`long tasks >50ms ${over50} (longest ${longest}ms, ${perf.longTasks.length} total)`);
console.log(`DOM nodes        ${perf.domNodes}`);
console.log(`images in DOM    ${perf.imgs}`);
console.log(`page height      ${perf.scrollHeight}px (${(perf.scrollHeight / 900).toFixed(1)} screens)`);
console.log(`transfer total   ${kb(totalBytes)}`);
for (const [k, v] of Object.entries(byType).sort((a, c) => c[1] - a[1])) {
  console.log(`  ${k.padEnd(14)} ${kb(v)}`);
}
