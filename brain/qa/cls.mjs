import { chromium } from './_browser.mjs';

/** Reports every layout shift with the element that moved and by how much. */
const BASE = process.env.BASE || 'http://localhost:8080';
const b = await chromium.launch({ channel: 'chrome' });
const page = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

await page.addInitScript(() => {
  window.__shifts = [];
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) {
      if (e.hadRecentInput) continue;
      window.__shifts.push({
        t: Math.round(e.startTime),
        value: e.value,
        scrollY: Math.round(window.scrollY),
        sources: (e.sources || []).slice(0, 3).map((s) => {
          const n = s.node;
          return {
            tag: n ? n.tagName : '?',
            cls: n && n.className ? String(n.className).slice(0, 70) : '',
            from: `${Math.round(s.previousRect.y)}`,
            to: `${Math.round(s.currentRect.y)}`,
          };
        }),
      });
    }
  }).observe({ type: 'layout-shift', buffered: true });
});

await page.goto(BASE, { waitUntil: 'load' });
await page.waitForTimeout(3000);
const atLoad = await page.evaluate(() => window.__shifts.slice());
console.log(`--- during load: ${atLoad.length} shifts, total ${atLoad.reduce((a, s) => a + s.value, 0).toFixed(3)}`);
for (const s of atLoad.slice(0, 12)) {
  console.log(`  t=${s.t}ms v=${s.value.toFixed(4)} y=${s.scrollY} :: ` +
    s.sources.map((x) => `${x.tag}.${x.cls} ${x.from}->${x.to}`).join(' | '));
}

await page.evaluate(() => { window.__shifts.length = 0; });
await page.mouse.move(720, 450);
const total = await page.evaluate(() => document.documentElement.scrollHeight);
for (let g = 0; g < 900; g++) {
  const y = await page.evaluate(() => window.scrollY);
  if (y >= total - 950) break;
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(16);
}
await page.waitForTimeout(1200);
const onScroll = await page.evaluate(() => window.__shifts.slice());
console.log(`\n--- during scroll: ${onScroll.length} shifts, total ${onScroll.reduce((a, s) => a + s.value, 0).toFixed(3)}`);
const top = onScroll.sort((a, c) => c.value - a.value).slice(0, 12);
for (const s of top) {
  console.log(`  v=${s.value.toFixed(4)} y=${s.scrollY} :: ` +
    s.sources.map((x) => `${x.tag}.${x.cls} ${x.from}->${x.to}`).join(' | '));
}
await b.close();
