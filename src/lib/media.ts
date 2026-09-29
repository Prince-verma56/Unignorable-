/**
 * Responsive image sources.
 *
 * `src/assets/opt/` holds WebP variants at 640 / 1024 / 1600 generated from the
 * source JPEGs (no upscaling — a 1024px source has no real 1600 variant). Both
 * sets are globbed eagerly so Vite hashes and fingerprints them like any other
 * imported asset; nothing is resolved at runtime.
 *
 * Call sites keep importing the JPEG as before. Because Vite returns the same
 * URL string for the same module, that URL is a reliable key back to the base
 * name, and from there to the variant set.
 */

const RAW = import.meta.glob("../assets/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const OPT = import.meta.glob("../assets/opt/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const baseName = (path: string): string =>
  path.split("/").pop()!.replace(/\.(jpg|jpeg|png|webp)$/i, "");

/** Hashed JPEG url -> base name, e.g. "campaign-profile". */
const urlToName = new Map<string, string>();
for (const [path, url] of Object.entries(RAW)) urlToName.set(url, baseName(path));

/** base name -> [width, url][], ascending, deduped by url. */
const variants = new Map<string, Array<[number, string]>>();
for (const [path, url] of Object.entries(OPT)) {
  const match = /^(.*)-(\d+)$/.exec(baseName(path));
  if (!match) continue;
  const [, name, width] = match as unknown as [string, string, string];
  const list = variants.get(name) ?? [];
  list.push([Number(width), url]);
  variants.set(name, list);
}

for (const [name, list] of variants) {
  list.sort((a, b) => a[0] - b[0]);
  /*
   * Drop widths that resolve to the same file as a smaller one. Without this a
   * 1024px source would advertise a 1600w candidate, and the browser would pick
   * it on a wide viewport and upscale — a blurrier result than telling the
   * truth about the largest size we actually have.
   */
  const seen = new Set<string>();
  variants.set(
    name,
    list.filter(([, url]) => (seen.has(url) ? false : (seen.add(url), true))),
  );
}

/** WebP `srcset` for an imported JPEG url, or null when no variants exist. */
export function webpSrcSet(src: string): string | null {
  const name = urlToName.get(src);
  if (!name) return null;
  const list = variants.get(name);
  if (!list?.length) return null;
  return list.map(([w, url]) => `${url} ${w}w`).join(", ");
}

/**
 * Default `sizes` for the grid. Frames are at most half the viewport from `lg`
 * up and full width below it; call sites with a narrower slot should pass their
 * own rather than over-fetching.
 */
export const DEFAULT_SIZES = "(min-width: 1024px) 50vw, 100vw";
