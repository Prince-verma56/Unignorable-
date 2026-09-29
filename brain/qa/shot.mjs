import { chromium } from './_browser.mjs';
import fs from 'node:fs';

const BASE = process.env.BASE || 'http://localhost:8080';
const OUT = process.env.OUT || 'brain/screenshots';
const LABEL = process.argv[2] || 'run';
// ROUTE via env: Git Bash rewrites a leading-slash argv into a Windows path
const ROUTE = process.env.ROUTE || process.argv[3] || '/';
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet',  width: 834,  height: 1112 },
  { name: 'mobile',  width: 390,  height: 844 },
];

const browser = await chromium.launch({ channel: 'chrome' });
const report = { label: LABEL, route: ROUTE, viewports: {} };

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 300)); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message.slice(0, 300)));
  page.on('requestfailed', r => errors.push('REQFAIL: ' + r.url().slice(0,160) + ' ' + (r.failure()?.errorText||'')));

  await page.goto(BASE + ROUTE, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2600); // let preloader + entry timeline finish

  const dir = `${OUT}/${LABEL}`;
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: `${dir}/${vp.name}-01-hero.png` });

  /*
   * Scroll with real wheel events rather than window.scrollTo.
   * Lenis owns the scroll position and reasserts its own animatedScroll on the
   * next frame, so a programmatic jump is silently reverted — the harness would
   * photograph a page that never actually moved, and scroll-triggered reveals
   * would not have fired. Wheeling is also what a reader does.
   */
  await page.mouse.move(vp.width / 2, vp.height / 2);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const steps = Math.min(14, Math.max(3, Math.ceil(total / vp.height)));

  const wheelTo = async (target) => {
    for (let guard = 0; guard < 400; guard++) {
      const y = await page.evaluate(() => window.scrollY);
      const delta = target - y;
      if (Math.abs(delta) < 12) break;
      await page.mouse.wheel(0, Math.max(-600, Math.min(600, delta)));
      await page.waitForTimeout(16);
    }
    // let the easing settle and scrubbed timelines catch up
    await page.waitForTimeout(700);
  };

  for (let i = 1; i <= steps; i++) {
    const y = Math.round((total - vp.height) * (i / steps));
    await wheelTo(y);
    const at = await page.evaluate(() => Math.round(window.scrollY));
    await page.screenshot({ path: `${dir}/${vp.name}-${String(i + 1).padStart(2, '0')}-y${at}.png` });
  }

  // measurements
  const metrics = await page.evaluate(() => {
    const de = document.documentElement;
    /*
     * Only report horizontal overflow that nothing clips. A marquee track or a
     * pinned horizontal row legitimately extends past the viewport inside an
     * `overflow: hidden|auto` parent — flagging those buries the real bugs in
     * twenty lines of noise.
     */
    const clipped = (el) => {
      for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
        const o = getComputedStyle(n).overflowX;
        if (o === 'hidden' || o === 'auto' || o === 'scroll' || o === 'clip') return true;
      }
      return false;
    };
    const overflow = [];
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > de.clientWidth + 2 || r.left < -2) && !clipped(el)) {
        overflow.push((el.tagName + '.' + (el.className?.toString?.().slice(0, 70) || '')).slice(0, 100));
      }
    });
    // find tall runs of blank vertical space by sampling section boxes
    const sections = [...document.querySelectorAll('main > *, main section, .pin-spacer')].map(el => {
      const r = el.getBoundingClientRect();
      return { tag: el.tagName, cls: (el.className?.toString?.()||'').slice(0,60), top: Math.round(r.top + window.scrollY), h: Math.round(r.height) };
    });
    const invisible = [];
    document.querySelectorAll('main *').forEach(el => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      // a decorative subtree is allowed to be invisible — only content counts
      if (r.height > 40 && parseFloat(cs.opacity) < 0.05 && cs.visibility !== 'hidden' && !el.closest('[aria-hidden="true"]')) {
        invisible.push((el.tagName + '.' + (el.className?.toString?.().slice(0,60)||'')).slice(0,90));
      }
    });
    return { scrollHeight: de.scrollHeight, clientWidth: de.clientWidth, scrollWidth: de.scrollWidth, overflow: [...new Set(overflow)].slice(0,25), sections, invisible: [...new Set(invisible)].slice(0,25) };
  });

  report.viewports[vp.name] = { ...metrics, errors: [...new Set(errors)].slice(0, 25) };
  await ctx.close();
}
await browser.close();
fs.writeFileSync(`${OUT}/${LABEL}/report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ label: LABEL, summary: Object.fromEntries(Object.entries(report.viewports).map(([k,v]) => [k, { scrollHeight: v.scrollHeight, horizOverflow: v.scrollWidth > v.clientWidth, overflowCount: v.overflow.length, invisibleCount: v.invisible.length, errors: v.errors.length }])) }, null, 2));
console.log('--- details ---');
for (const [k,v] of Object.entries(report.viewports)) {
  console.log(`\n[${k}] scrollW=${v.scrollWidth} clientW=${v.clientWidth}`);
  if (v.overflow.length) console.log(' OVERFLOW:', v.overflow.join(' | '));
  if (v.invisible.length) console.log(' INVISIBLE:', v.invisible.join(' | '));
  if (v.errors.length) console.log(' ERRORS:', v.errors.join('\n   '));
  console.log(' SECTIONS:', v.sections.map(s => `${s.tag}(${s.cls})@${s.top}+${s.h}`).join('\n   '));
}
