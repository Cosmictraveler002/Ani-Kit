import { defineConfig } from "tsup";

/**
 * Bundle step for the CDN standalone entry.
 *
 * Everything else in this repo builds with plain `tsc` (per-file ESM + .d.ts)
 * — this config produces exactly one extra artifact:
 *
 *   dist/anim-kit.standalone.js(.map)
 *
 * A self-contained ESM bundle with `gsap` (+ its plugins) and `lenis`
 * inlined, so a single
 *
 *   import { lineReveal } from "…/anim-kit.standalone.js";
 *
 * works in a plain `<script type="module">` with no import map and no build
 * step, identically on jsDelivr and unpkg. The CSS is intentionally NOT
 * bundled — it ships untouched via scripts/copy-assets.mjs.
 *
 * Types are not generated here: the bundle exposes the exact same API as the
 * main entry, so `anim-kit/standalone` reuses `dist/index.d.ts`.
 */
export default defineConfig({
  entry: { "anim-kit.standalone": "src/index.ts" },
  format: ["esm"],
  platform: "browser",
  target: "es2020",
  bundle: true,
  splitting: false,
  treeshake: true,
  minify: true,
  sourcemap: true,
  dts: false,
  clean: false, // never wipe the tsc output that lands in dist/ first
  // tsup externalizes package.json `dependencies` by default — but the whole
  // point of this entry is a zero-resolution CDN file, so bundle everything.
  noExternal: [/.*/],
  // GSAP derives plugin registration keys from constructor names — a minifier
  // that mangles them corrupts gsap.core.globals() (Draggable → "o", …).
  esbuildOptions(options) {
    options.keepNames = true;
  },
  outExtension: () => ({ js: ".js" }),
});
