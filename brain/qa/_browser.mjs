/**
 * Resolves Playwright without adding it to the project's dependencies.
 * It drives the system Chrome (channel: "chrome"), so no browser download is
 * needed — only the package itself, which `npx playwright` has already cached.
 *
 * Override with PLAYWRIGHT_PATH=/path/to/node_modules/playwright if needed.
 */
import { createRequire } from 'node:module';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const require = createRequire(import.meta.url);

function candidates() {
  const out = [];
  if (process.env.PLAYWRIGHT_PATH) out.push(process.env.PLAYWRIGHT_PATH);
  const npxCache = path.join(os.homedir(), 'AppData', 'Local', 'npm-cache', '_npx');
  const nixCache = path.join(os.homedir(), '.npm', '_npx');
  for (const cache of [npxCache, nixCache]) {
    if (!existsSync(cache)) continue;
    for (const dir of readdirSync(cache)) {
      const p = path.join(cache, dir, 'node_modules', 'playwright');
      if (existsSync(p)) out.push(p);
    }
  }
  out.push('playwright');
  return out;
}

let loaded = null;
for (const c of candidates()) {
  try {
    loaded = require(c);
    break;
  } catch {
    /* next */
  }
}

if (!loaded) {
  console.error(
    'Playwright not found. Run `npx playwright@latest --version` once to cache it, ' +
      'or set PLAYWRIGHT_PATH to its node_modules path.',
  );
  process.exit(1);
}

export const chromium = loaded.chromium;
