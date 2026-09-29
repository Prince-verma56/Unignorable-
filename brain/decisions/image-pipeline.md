# Responsive images without a project dependency

**Decision.** WebP variants at 640 / 1024 / 1600 are generated from the source
JPEGs and committed to `src/assets/opt/`. `src/lib/media.ts` globs both sets
eagerly and builds the `srcset`.

**Why not an image plugin.** `vite-imagetools` would be cleaner long-term, but it
adds a build dependency to a Lovable-synced `package.json` for something a
one-off generation step solves. The variants are produced with `npx sharp-cli`,
which never enters the project's dependency tree.

**Regenerating** (after the placeholder photography is replaced):

```sh
for w in 640 1024 1600; do
  npx --yes sharp-cli@5 --input "src/assets/*.jpg" --output "/tmp/opt-$w" \
    resize "$w" --withoutEnlargement --fit inside -f webp -q 72
  for f in "/tmp/opt-$w"/*.webp; do
    cp "$f" "src/assets/opt/$(basename "$f" .webp)-$w.webp"
  done
done
```

**Two details that matter.**

- `--withoutEnlargement` means a 1024px source has no real 1600 variant.
  `lib/media.ts` drops widths that resolve to the same file as a smaller one, so
  the page never advertises a 1600w candidate it cannot deliver — which would
  make a wide viewport pick it and upscale to a blurrier result than the truth.
- `<picture>` is `display: inline` by default, so it needs `block size-full` or
  the `size-full` on the `img` resolves against a shrink-wrapped box.

**One TypeScript trap.** JSX skips excess-property checks on hyphenated attribute
names, so `<ResponsiveImg data-media />` type-checks and is then silently
dropped. `ResponsiveImg` takes an explicit `dataMedia` boolean instead.

**Result.** Homepage image payload 1,447KB → **588KB**.
