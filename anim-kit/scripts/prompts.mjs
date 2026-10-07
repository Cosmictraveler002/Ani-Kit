/**
 * Prompt catalogue served by the demo server.
 *
 *   GET /api/prompts  →  { prompts: [{ id, title, text }] }
 *
 * Each entry describes one anim-kit effect: the markup it expects, the import,
 * the initialisation call, its options, teardown, and gotchas. `renderPrompt()`
 * turns an entry into a self-contained "how to implement this with anim-kit"
 * prompt that the demo page puts on the clipboard.
 */

/** Shared preamble + epilogue so every prompt is self-contained. */
const PREAMBLE = (title, summary) => `Implement the "${title}" effect in my project using the **anim-kit** library.

${summary}

anim-kit is a framework-agnostic ESM animation library (TypeScript source, compiled to \`dist/\` JS + \`.d.ts\`) built on GSAP (ScrollTrigger, SplitText, Draggable, CustomEase, Flip) and Lenis. It works with plain HTML and with React/Vue/Next/Svelte — effects are DOM-selector based, no components involved. Every effect follows one contract:

    effect(target, options) => destroy

It is published on npm **and** loadable straight from a version-pinned CDN — step 2 below is a complete, copy-paste \`index.html\` that runs as-is with no build step.
`;

const EPILOGUE = `## 5. Teardown

Always keep the destroy function and call it when the effect is no longer
needed (component unmount, route change, HMR reload):

    const destroy = /* result of step 3 */;
    destroy();

## 6. Behaviour guarantees

- \`target\` accepts a selector string, an Element, an array or a NodeList.
  When nothing matches, the effect returns a no-op destroy — never throws.
- \`prefers-reduced-motion: reduce\` skips the animation and snaps to a safe
  resting state. Pass \`force: true\` in options to animate regardless.
- \`initGSAP()\` runs inside every effect; call it yourself only if you need
  \`gsap\`/\`ScrollTrigger\` configured before first paint.
- npm and the CDN serve the **same** files — the CDN imports from §2 and the
  npm import are interchangeable, byte for byte.
- Custom eases live in the \`EASES\` map (\`EASES.curtain\`, \`EASES.cardStack\`,
  \`EASES.reveal\`, \`EASES.preloadOut\`).
`;

/**
 * Appended to the shared epilogue for /three effects — the dependency
 * contract differs there: three is an optional peer, never a core dependency.
 */
const THREE_EPILOGUE = `
- \`three\` is an **optional peer dependency**: the core package never
  imports it — only \`@cosmictraveler002/anim-kit/three\` does, so installing
  anim-kit alone keeps your tree gsap+lenis. Add \`three\` when you use WebGL
  effects (the §2 import map already serves a pinned build — no install needed
  for the CDN path).
`;

/** Version-pinned CDN release that every prompt's procedure points at. */
export const CDN_VERSION = "1.6.0";

/**
 * Optional peer served by the `./three` subpath — the pin printed in WebGL
 * procedures. demo-smoke asserts it against node_modules/three, so it cannot
 * drift from what is installed.
 */
export const THREE_VERSION = "0.186.1";

/** Import specifiers: core barrel vs the WebGL (three.js) subpath. */
const PKG_CORE = "@cosmictraveler002/anim-kit";
const PKG_THREE = "@cosmictraveler002/anim-kit/three";

/** Indent every line of a snippet (for nesting it inside the example file). */
const indent = (text, spaces) =>
  text.replace(/^(.*)$/gm, (line) => (line ? " ".repeat(spaces) + line : line));

/**
 * Step 2 of every prompt: a numbered, copy-paste procedure that runs the
 * effect straight from our version-pinned CDN — a complete `index.html`
 * first (markup + init in one file), then the alternative loaders, the
 * bundler fallback, and what the loaded pieces actually are.
 * (Mirrors README §CDN usage — all three strategies, all pinned.)
 */
const PROCEDURE_SECTION = (title, imports, markup, usage) => `## 2. Procedure — run it from our CDN (no build step)

Every URL is **version-pinned** — npm versions are immutable, so
\`@cosmictraveler002/anim-kit@${CDN_VERSION}\` always resolves to this exact
build, forever.

**Step 1 — save this as \`index.html\`.** A complete working file: the markup
from §1 plus initialisation, nothing else required:

\`\`\`html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <!-- companion stylesheet: masks, tokens, resting states -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@cosmictraveler002/anim-kit@${CDN_VERSION}/dist/styles/anim-kit.css"
    />
    <style>
      body { font-family: system-ui, sans-serif; margin: 0; padding: 12vh 8vw; }
    </style>
  </head>
  <body>
${indent(markup.trim(), 4)}

    <script type="module">
      // One URL — gsap (with the plugins anim-kit uses) and lenis are inlined.
      import { ${imports.join(", ")} } from "https://cdn.jsdelivr.net/npm/@cosmictraveler002/anim-kit@${CDN_VERSION}/dist/anim-kit.standalone.js";

      // Selectors that match nothing no-op safely — this never throws.
${indent(usage.trim(), 6)}

      // Keep the destroy function (see §5) and call it when the effect should
      // stop: route change, content swap, HMR reload.
    </script>
  </body>
</html>
\`\`\`

**Step 2 — open it.** Double-click the file, or serve it statically
(\`npx serve\`, \`python -m http.server\`). No bundler, no \`npm install\`, no
config — the CDN delivers the same ESM files as the npm tarball.

**Step 3 — swap the loader only if you need a different strategy** (all
pinned to \`@${CDN_VERSION}\`):

- **unpkg instead of jsDelivr** — byte-identical standalone file:
  \`https://unpkg.com/@cosmictraveler002/anim-kit@${CDN_VERSION}/dist/anim-kit.standalone.js\`

- **jsDelivr \`+esm\`** — the CDN bundles the package with its dependencies:

  \`\`\`html
  <script type="module">
    import { ${imports.join(", ")} } from "https://cdn.jsdelivr.net/npm/@cosmictraveler002/anim-kit@${CDN_VERSION}/+esm";
  </script>
  \`\`\`

- **per-file ESM + import map** — unbundled files, one shared gsap between
  anim-kit and the rest of your page. Import maps match specifiers
  literally, so list GSAP subpaths one by one (a trailing-slash map
  produces extension-less URLs CDNs don't serve):

  \`\`\`html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@cosmictraveler002/anim-kit@${CDN_VERSION}/dist/styles/anim-kit.css" />
  <script type="importmap">
    {
      "imports": {
        "@cosmictraveler002/anim-kit": "https://cdn.jsdelivr.net/npm/@cosmictraveler002/anim-kit@${CDN_VERSION}/dist/index.js",
        "gsap": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/index.js",
        "gsap/ScrollTrigger": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/ScrollTrigger.js",
        "gsap/SplitText": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/SplitText.js",
        "gsap/Draggable": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/Draggable.js",
        "gsap/CustomEase": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/CustomEase.js",
        "gsap/Flip": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/Flip.js",
        "gsap/ScrollSmoother": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/ScrollSmoother.js",
        "lenis": "https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.mjs"
      }
    }
  </script>
  <script type="module">
    import { ${imports.join(", ")} } from "@cosmictraveler002/anim-kit";
  </script>
  \`\`\`

- **already using a bundler (Vite / Next / Webpack / Astro)?** Skip the CDN,
  install the package and import it — same code, same files:

  \`\`\`js
  import { ${imports.join(", ")} } from "@cosmictraveler002/anim-kit";
  import "@cosmictraveler002/anim-kit/styles"; // companion stylesheet (classes, masks, tokens)
  \`\`\`

**The building blocks you just loaded:**

- \`gsap\` + \`ScrollTrigger\` drive every tween, scrub and trigger;
  \`SplitText\` powers the masked text splits; \`Draggable\` powers the drag
  carousels; \`Flip\` powers the layout transfers; \`CustomEase\` registers
  the studio eases exported as \`EASES\`.
- \`lenis\` powers \`smoothScroll()\` — create it **first** so ScrollTrigger
  syncs with its scroller.
- The stylesheet ships resting states, mask classes and the pure-CSS pieces
  (\`.ak-liquid\`, \`.ak-underline\`, \`.ak-marquee\`, \`.ak-roll\`); the motion
  itself is 100% JS.
- It is plain ESM with \`.d.ts\` files — TypeScript consumers get types straight
  from the same URLs, and deep imports work as CDN URLs too, e.g.
  \`https://cdn.jsdelivr.net/npm/@cosmictraveler002/anim-kit@${CDN_VERSION}/dist/styles/anim-kit.css\`
  for \`@cosmictraveler002/anim-kit/styles\`.
`;

/**
 * Step 2 for WebGL effects (`/three` subpath) — same shape as
 * PROCEDURE_SECTION, but the standalone bundle does NOT inline three, so
 * Step 1 is an import map that pins `three`, the anim-kit /three entry and
 * the same gsap/lenis pins the core procedure prints.
 *
 * `extras` carries per-effect Step-1 `<style>` blocks and "building blocks"
 * bullets — the pieces that legitimately differ between WebGL effects (a
 * hover card's wrapper CSS is not a rail stage's CSS).
 */
const WEBGL_MEDIA_STYLE = `      /* the WebGL wrapper: the canvas covers it, the <img> lays it out */
      [data-gl] { position: relative; aspect-ratio: 4 / 3; overflow: hidden; border-radius: 16px; }
      [data-gl] img { width: 100%; height: 100%; object-fit: cover; display: block; }`;

const WEBGL_MEDIA_PIECES = `- \`three\` — one \`WebGLRenderer\` per card, an orthographic camera in pixel
  space and a single \`ShaderMaterial\`: rounded-box SDF corners, the hover
  dent (sample squeeze + dome shading), chroma split and the reveal wipe all
  run in one fragment shader.`;

const PROCEDURE_SECTION_THREE = (title, imports, markup, usage, extras = {}) => {
  const pkg = PKG_THREE;
  const style = extras.style ?? WEBGL_MEDIA_STYLE;
  const pieces = extras.pieces ?? WEBGL_MEDIA_PIECES;
  const map = [
    `          "three": "https://cdn.jsdelivr.net/npm/three@${THREE_VERSION}/build/three.module.js",`,
    `          "${PKG_THREE}": "https://cdn.jsdelivr.net/npm/@cosmictraveler002/anim-kit@${CDN_VERSION}/dist/three/index.js",`,
    `          "${PKG_CORE}": "https://cdn.jsdelivr.net/npm/@cosmictraveler002/anim-kit@${CDN_VERSION}/dist/index.js",`,
    `          "gsap": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/index.js",`,
    `          "gsap/ScrollTrigger": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/ScrollTrigger.js",`,
    `          "gsap/SplitText": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/SplitText.js",`,
    `          "gsap/Draggable": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/Draggable.js",`,
    `          "gsap/CustomEase": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/CustomEase.js",`,
    `          "gsap/Flip": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/Flip.js",`,
    `          "gsap/ScrollSmoother": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/ScrollSmoother.js",`,
    `          "lenis": "https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.mjs"`,
  ].join("\n");

  return `## 2. Procedure — run it from our CDN (no build step)

Every URL is **version-pinned** — npm versions are immutable, so
\`@cosmictraveler002/anim-kit@${CDN_VERSION}\` and \`three@${THREE_VERSION}\`
always resolve to these exact builds, forever.

**Step 1 — save this as \`index.html\`.** A complete working file: the markup
from §1 plus initialisation, nothing else required:

\`\`\`html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <!-- companion stylesheet: masks, tokens, resting states -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@cosmictraveler002/anim-kit@${CDN_VERSION}/dist/styles/anim-kit.css"
    />
    <!-- import map: three (optional peer) + the anim-kit WebGL entry, both pinned -->
    <script type="importmap">
      {
        "imports": {
${map}
        }
      }
    </script>
    <style>
      body { font-family: system-ui, sans-serif; margin: 0; padding: 12vh 8vw; }
${style}
    </style>
  </head>
  <body>
${indent(markup.trim(), 4)}

    <script type="module">
      // three, gsap + lenis come from the import map; this line loads the entry.
      import { ${imports.join(", ")} } from "${pkg}";

      // Selectors that match nothing no-op safely — this never throws.
${indent(usage.trim(), 6)}

      // Keep the destroy function (see §5) and call it when the effect should
      // stop: route change, content swap, HMR reload.
    </script>
  </body>
</html>
\`\`\`

**Step 2 — open it.** Double-click the file, or serve it statically
(\`npx serve\`, \`python -m http.server\`). No bundler, no \`npm install\`, no
config — the import map pulls pinned ESM files straight from the CDN, the
same bytes the npm tarball ships.

**Step 3 — swap the loader only if you need a different strategy** (all
pinned to \`@${CDN_VERSION}\`):

- **unpkg instead of jsDelivr** — same import map, swap the CDN host:

  \`\`\`
  https://unpkg.com/@cosmictraveler002/anim-kit@${CDN_VERSION}/dist/three/index.js
  https://unpkg.com/three@${THREE_VERSION}/build/three.module.js
  \`\`\`

- **already using a bundler (Vite / Next / Webpack / Astro)?** Install both
  packages and skip the map — node resolves \`three\` from your lockfile:

  \`\`\`sh
  npm install three @cosmictraveler002/anim-kit
  \`\`\`

  \`\`\`js
  import { ${imports.join(", ")} } from "${pkg}";
  import "@cosmictraveler002/anim-kit/styles"; // companion stylesheet
  \`\`\`

**The building blocks you just loaded:**

${pieces}
- \`gsap\` drives the ticker, tweens and anything you compose; \`lenis\` powers
  \`smoothScroll()\`.
- The DOM keeps the layout (elements, sizing, alt text); the canvas only
  paints. Without WebGL the GL layer steps aside and the images show.
- It is plain ESM with \`.d.ts\` files — TypeScript consumers get types from
  the same URLs, e.g. \`https://cdn.jsdelivr.net/npm/@cosmictraveler002/anim-kit@${CDN_VERSION}/dist/three/index.d.ts\`.
`;

};

/**
 * Effect taxonomy — the single source of truth for how anim-kit's effects are
 * classified. Two levels: category → subcategory → effects.
 *
 * Rules:
 *   - Every catalogue entry sits in exactly ONE subcategory (enforced by tests).
 *   - A subcategory may start with one effect; it is the slot siblings land in.
 *   - Order here drives the demo dock, the payload and the README tree.
 *
 * This is NOT a public runtime API — it exists so docs, demo and prompt text
 * cannot drift apart.
 */
export const TAXONOMY = [
  {
    id: "core",
    name: "Core & setup",
    blurb: "Foundation pieces every page needs before the effects run.",
    subcategories: [
      { id: "scrolling", name: "Smooth scrolling", effects: ["smoothScroll"] },
    ],
  },
  {
    id: "text",
    name: "Text animations",
    blurb: "Typography reveals — lines, characters, decoding, rolling words, numbers, layout transfers.",
    subcategories: [
      { id: "reveals", name: "Line & mask reveals", effects: ["lineReveal", "maskReveal"] },
      { id: "scatter", name: "Per-character scatter", effects: ["scatterText"] },
      { id: "decode", name: "Decode & scramble", effects: ["scrambleText"] },
      { id: "rolls", name: "Rolling text", effects: ["rollText", "reelText"] },
      { id: "counters", name: "Counters", effects: ["counter"] },
      { id: "transfer", name: "Layout transfers", effects: ["flipWords"] },
    ],
  },
  {
    id: "scroll",
    name: "Scroll & media",
    blurb: "Scroll-driven storytelling: galleries, parallax, pinned media.",
    subcategories: [
      { id: "pinned", name: "Pinned galleries", effects: ["horizontalScroll", "stackedCards", "stackedCardsPinned"] },
      { id: "parallax", name: "Parallax & depth", effects: ["parallax"] },
      { id: "heroes", name: "Heroes & media", effects: ["heroShrink", "mediaSettle"] },
      { id: "enter", name: "Enter reveals", effects: ["revealRule", "unfoldReveal", "clipWipe"] },
    ],
  },
  {
    id: "webgl",
    name: "WebGL",
    blurb: "GPU media — shader cards, kinetic type and reveal scenes drawn with three.js, straight over your content.",
    subcategories: [
      { id: "shadermedia", name: "Shader media", effects: ["webglMedia", "glRail", "coverflowWheel"] },
      { id: "scenes", name: "Scenes & overlays", effects: ["tearReveal", "ditherReveal"] },
      { id: "type", name: "Kinetic type", effects: ["wordmarkWave"] },
    ],
  },
  {
    id: "loops",
    name: "Loops & marquees",
    blurb: "Continuous motion — tickers, infinite draggables, indicators.",
    subcategories: [
      { id: "marquees", name: "Marquees", effects: ["marquee"] },
      { id: "draggables", name: "Draggables & rails", effects: ["dragStrip", "dragRail"] },
      { id: "equalizers", name: "Equalizers", effects: ["audioBars"] },
    ],
  },
  {
    id: "buttons",
    name: "Buttons & links",
    blurb: "Interactive affordances — hover fills, underlines, magnetic pulls.",
    subcategories: [
      { id: "fills", name: "Liquid fills", effects: ["liquidButton"] },
      { id: "underlines", name: "Underlines", effects: ["underlineLink"] },
      { id: "magnetic", name: "Magnetic hover", effects: ["magnetic"] },
    ],
  },
  {
    id: "nav",
    name: "Navigation & overlays",
    blurb: "Page chrome: headers, menus, cursor.",
    subcategories: [
      { id: "menus", name: "Menus & nav", effects: ["navHide", "menuOverlay"] },
      { id: "cursors", name: "Cursors", effects: ["cursorFollower"] },
    ],
  },
  {
    id: "intro",
    name: "Intros & transitions",
    blurb: "Entrance moments — loaders, theme wipes.",
    subcategories: [
      { id: "preloaders", name: "Preloaders", effects: ["preloader"] },
      { id: "theme", name: "Theme wipes", effects: ["themeReveal"] },
      { id: "pagetransitions", name: "Page transitions", effects: ["inkWipe"] },
    ],
  },
  {
    id: "svg",
    name: "Logos & SVG",
    blurb: "Vector reveals — logos, paths, brand marks.",
    subcategories: [
      { id: "paths", name: "Path reveals", effects: ["logoReveal"] },
    ],
  },
];

/** effect id → classification record (or null if unclassified). */
export function classify(id) {
  for (const cat of TAXONOMY) {
    for (const sub of cat.subcategories) {
      if (sub.effects.includes(id)) {
        return {
          category: cat.id,
          categoryLabel: cat.name,
          subcategory: sub.id,
          subcategoryLabel: sub.name,
        };
      }
    }
  }
  return null;
}

/** Every effect id in the tree, flattened (tests assert uniqueness + coverage). */
export function taxonomyEffects() {
  return TAXONOMY.flatMap((c) => c.subcategories.flatMap((s) => s.effects));
}

/** Render one catalogue entry into a full prompt. */
export function renderPrompt(entry) {
  const { title, summary, imports, markup, usage, options = [], notes = [], importsFrom } = entry;

  // WebGL effects load from the /three subpath (different procedure + note).
  const three = importsFrom === PKG_THREE;
  const out = [PREAMBLE(title, summary)];

  const cls = classify(entry.id);
  if (cls) out.push(`> **Category:** ${cls.categoryLabel} → ${cls.subcategoryLabel}\n`);

  out.push(`## 1. Markup\n\n\`\`\`html\n${markup.trim()}\n\`\`\`\n`);

  // Step 2: the copy-paste procedure — complete file from the CDN first,
  // then alternative loaders and the npm/bundler fallback. WebGL entries may
  // carry per-effect `procedure` extras (their Step-1 style + pieces).
  out.push(
    three
      ? PROCEDURE_SECTION_THREE(title, imports, markup, usage, entry.procedure)
      : PROCEDURE_SECTION(title, imports, markup, usage),
  );

  out.push(`## 3. Initialise\n\nRun this after the DOM is ready (and after fonts/images if it measures layout):\n\n\`\`\`js\n${usage.trim()}\n\`\`\`\n`);

  if (options.length) {
    out.push(`## 4. Options\n\n| Option | Default | Description |\n| --- | --- | --- |\n${options
      .map(([name, def, desc]) => `| \`${name}\` | ${def} | ${desc} |`)
      .join("\n")}\n`);
  }

  if (notes.length) {
    out.push(`## Notes\n\n${notes.map((n) => `- ${n}`).join("\n")}\n`);
  }

  out.push(EPILOGUE + (three ? THREE_EPILOGUE : ""));
  return out.join("\n");
}

/** The catalogue: every exported effect. */
export const PROMPT_ENTRIES = [
  {
    id: "smoothScroll",
    title: "Smooth scroll (Lenis + ScrollTrigger bridge)",
    summary:
      "A floaty, inertial page scroll. Lenis drives the scroll and anim-kit keeps ScrollTrigger in sync with it.",
    imports: ["smoothScroll"],
    markup: `<!-- No special markup — works on the document itself.
     Optional: give the scroller a wrapper if you are not scrolling <body>. -->`,
    usage: `const scroller = smoothScroll({ lerp: 0.08, smoothWheel: true });

// Programmatic scrolling that respects the smooth scroller:
scroller.scrollTo("#work", { duration: 1.2 });

// True only when Lenis is actually driving the page.
console.log(scroller.active);`,
    options: [
      ["lerp", "`0.08`", "Interpolation factor — lower = floatier."],
      ["smoothWheel", "`true`", "Smooth mouse-wheel input."],
      ["smoothTouch", "`false`", "Smooth touch input (can fight native scrolling)."],
      ["orientation", "`'vertical'`", "`'vertical'` or `'horizontal'`."],
      ["initialScroll", "`0`", "Initial scroll position in px."],
      ["useScrollerProxy", "`false`", "Proxy documentElement through ScrollTrigger (nested scrollers)."],
      ["touchMultiplier", "`1`", "Touch-drag sensitivity — Lenis `touchMultiplier`."],
      ["wheelMultiplier", "`1`", "Mouse-wheel sensitivity — Lenis `wheelMultiplier`."],
      [
        "lagSmoothing",
        "`undefined`",
        "GSAP lag smoothing: `false` disables it (≤1.4 behaviour), `{ threshold, adjustedLag }` retunes it — unset keeps GSAP's 500/33 compensation, so a hitch can't teleport the scroll.",
      ],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Call it **before** creating scroll effects so the first refresh sees the right scroller.",
      "The bridge uses the canonical recipe: `lenis.on('scroll', ScrollTrigger.update)` with `lenis.raf` driven from `gsap.ticker`. GSAP's lag smoothing stays on — the ticker and the tweens share one adjusted clock, so a stalled frame steps them together instead of snapping (opt out with `lagSmoothing: false`).",
      "Under reduced motion the handle comes back inert (`active: false`) and native scrolling is untouched.",
    ],
  },
  {
    id: "preloader",
    title: "Preloader (0→100 counter intro)",
    summary:
      "The intro overlay: a number counts 0→100 while an SVG glyph fills with an inset() clip-path, then the glyph blows up and the backdrop fades away.",
    imports: ["preloader"],
    markup: `<div id="preloader">
  <div data-backdrop></div>
  <div class="glyph-wrap">
    <svg data-glyph viewBox="0 0 76 343"><!-- glyph paths --></svg>
  </div>
  <div data-counter>0</div>
</div>`,
    usage: `const destroy = preloader("[data-preloader]", {
  duration: 4,          // seconds for the count
  step: 5,              // increment per tick
  interval: 200,        // ms between ticks
  sessionGuard: true,   // skip when already shown this session
  onComplete: () => ScrollTrigger.refresh(),
});

// Options-object form works too:
// preloader({ root: "#preloader", sessionGuard: false });`,
    options: [
      ["root", "— (1st arg)", "Overlay element — the target argument, or `root` in the options-object form."],
      ["glyph", "first `<svg>` inside root", "Element that fills up."],
      ["counter", "`[data-counter]` in root", "Element receiving the 0→100 number."],
      ["backdrop", "`[data-backdrop]` in root", "Solid backdrop behind the glyph."],
      ["duration", "`4`", "Total counter duration, seconds."],
      ["step", "`5`", "Counter increment per tick."],
      ["interval", "`200`", "Interval between ticks, ms."],
      ["sessionGuard", "`true`", "Hide when already shown this session."],
      ["storageKey", "`'ak-preloader-shown'`", "sessionStorage key for the guard."],
      ["onComplete", "—", "Called once the overlay has finished and can be removed."],
    ],
    notes: [
      "Accepts **both** call forms: `preloader(target, options)` and `preloader({ root, ... })`.",
      "Reduced motion: the overlay is hidden immediately — never block the page behind a counting intro.",
      "The overlay covers the viewport (`position: fixed; inset: 0`) until it finishes, so make sure `onComplete` fires.",
      "`destroy()` clears the timers and kills the tweens.",
    ],
  },
  {
    id: "inkWipe",
    title: "Ink wipe — brush-stroke page transition",
    summary:
      "A brush-loaded ink sheet sweeps across the whole page: cover() paints it over, the swap happens at full cover, unveil() lets the new page arrive behind the *same* stroke — one continuous left-to-right travel whose edge is seeded, so it never boils between frames. Bristle spurs and flecks run ahead of the front.",
    imports: ["inkWipe"],
    markup: `<a href="/next.html" data-wipe>Next</a> <!-- links to intercept -->`,
    usage: `// MPA form — intercepts the links, the next page auto-unveils:
const wipe = inkWipe({ links: "[data-wipe]" });

// Manual form (SPA route change, view transitions, demos):
await wipe.cover();   // resolves at full cover — swap your DOM here
await wipe.unveil();  // the new page arrives behind the same stroke
wipe.destroy();`,
    options: [
      ["host", "`document.body`", "Overlay host — the canvas is appended here (target argument also works)."],
      ["color", "`\"#0b0b0b\"`", "Ink colour."],
      ["coverMs", "`550`", "Cover duration, ms."],
      ["unveilMs", "`650`", "Unveil duration, ms."],
      ["ease", "`\"power2.inOut\"`", "GSAP ease for both halves."],
      ["tilt", "`0.35`", "Edge lean — fraction of viewport height the top edge leads by."],
      ["rough", "`44`", "Noise amplitude on the edge, px."],
      ["bristle", "`180`", "Longest bristle spur, px."],
      ["links", "—", "Selector for links that run the wipe before navigating."],
      ["sessionKey", "`'ak-ink-wipe'`", "sessionStorage key for the cross-page handoff."],
      ["autoUnveil", "`true`", "Unveil automatically when the session flag says the page loaded covered."],
      ["z", "`9998`", "Overlay z-index."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Accepts **both** call forms: `inkWipe(options)` and `inkWipe(host, options)`.",
      "**The MPA handoff is a sessionStorage flag**: a covered navigation stores `sessionKey`; the next page with `autoUnveil` reads it, covers instantly and unveils — no flash between documents. Same-stroke means cover and unveil share one seeded edge, so the brush reads as a single sweep passing *through* the page swap.",
      "**Reduced motion**: cover/unveil snap instantly to a solid sheet — navigation still never flashes the swap. No 2D context at all (SSR, jsdom): both promises resolve immediately, nothing paints.",
      "`destroy()` removes the canvas, its listeners and the link interception.",
    ],
  },
  {
    id: "navHide",
    title: "Hide-on-scroll nav",
    summary: "A header that slides out of view when you scroll down and returns when you scroll up.",
    imports: ["navHide"],
    markup: `<nav data-nav>
  <span class="brand">Brand</span>
  <div class="links">…</div>
</nav>`,
    usage: `const destroy = navHide("[data-nav]", { threshold: 200 });`,
    options: [
      ["threshold", "`200`", "Distance from the top under which the nav is always visible."],
      ["hideY", "`-100`", "Hide offset in px (negative = slide up)."],
      ["mobileBreakpoint", "`768`", "Below this width the nav is pinned visible."],
      ["startHidden", "`true`", "Start hidden."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Give the nav `position: fixed` (or sticky) in CSS — the effect only animates the transform.",
      "Destroy kills its ScrollTrigger and clears the transform.",
    ],
  },
  {
    id: "menuOverlay",
    title: "Curtain menu overlay",
    summary:
      "A full-screen menu that opens like a curtain: a clip-path polygon expands from the bottom edge while the links stagger up.",
    imports: ["menuOverlay"],
    markup: `<div class="menu-overlay" data-menu>
  <div class="menu-overlay-bar" data-menu-chrome>
    <span class="brand">Brand</span>
    <button data-menu-close>Close</button>
  </div>
  <div class="menu-links">
    <div class="menu-link"><a href="#work">Work</a></div>
    <div class="menu-link"><a href="#about">About</a></div>
  </div>
</div>

<nav data-nav>
  <button data-menu-open>Menu</button>
</nav>`,
    usage: `const menu = menuOverlay({
  overlay: "[data-menu]",
  openTrigger: "[data-menu-open]",
  closeTrigger: "[data-menu-close]",
  nav: "[data-nav]",          // slides away while the menu is open
  duration: 1,
  stagger: 0.1,
});

menu.open(); menu.close(); menu.toggle();
console.log(menu.isOpen());`,
    options: [
      ["overlay", "— (required)", "The fixed full-screen panel."],
      ["openTrigger", "—", "Element(s) that open the menu."],
      ["closeTrigger", "—", "Element(s) that close the menu."],
      ["nav", "—", "Nav bar that slides away while open."],
      ["link", "`'.menu-link a'`", "Selector for the menu links, scoped to `overlay`."],
      ["chrome", "`'[data-menu-chrome]'`", "Overlay chrome elements that rise into view."],
      ["duration", "`1`", "Curtain duration, seconds (`EASES.curtain`)."],
      ["stagger", "`0.1`", "Stagger between links, seconds."],
      ["initialOpen", "`false`", "Start open."],
      ["onOpen / onClose", "—", "Lifecycle callbacks."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Returns a **handle** (`{ open, close, toggle, isOpen, destroy }`), not a bare destroy fn.",
      "Attach `menu.close()` to link clicks so the curtain shuts on navigation.",
      "Reduced motion: the overlay stays collapsed and the controls stay inert.",
      "Curtain eases with `EASES.curtain` (`.76,0,.24,1`).",
    ],
  },
  {
    id: "lineReveal",
    title: "Masked line reveal",
    summary:
      "Split a paragraph or heading into overflow-hidden lines and stagger them up — the signature text reveal of the source site.",
    imports: ["lineReveal"],
    markup: `<h1 data-hero-text>Animations,<br />extracted and<br />made reusable.</h1>

<p data-lines>
  Every line of this paragraph is split into a mask and slid up on scroll.
</p>`,
    usage: `// Above the fold — plays immediately:
lineReveal("[data-hero-text]", { mode: "immediate", delay: 0.35 });

// Below the fold — plays on enter, reverses on leave:
const destroy = lineReveal("[data-lines]", { mode: "scroll" });

// Per-character masked rise (each char in its own overflow-hidden mask):
const perChar = lineReveal("[data-headline]", { split: "chars", stagger: 0.03 });`,
    options: [
      ["mode", "`'scroll'`", "`'scroll'` plays on enter/reverses on leave; `'immediate'` plays at once."],
      ["split", "`'lines'`", "`'lines'` masks per line; `'chars'` masks per character (tighter default stagger)."],
      ["stagger", "`0.1`", "Seconds between lines (`0.03` when `split: 'chars'`)."],
      ["duration", "`1`", "Seconds."],
      ["ease", "`'power4.out'`", "GSAP ease name."],
      ["delay", "`0`", "Seconds before playing."],
      ["start / end", "`'top 90%'` / `'bottom 10%'`", "ScrollTrigger positions."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Produces `.ak-line-mask > .ak-line` wrappers (via anim-kit's `split()` → GSAP SplitText, with a manual fallback); `split: 'chars'` produces `.ak-char-mask > .ak-char`.",
      "Headings with `<br>` hard breaks split correctly.",
      "`destroy()` restores the original markup byte-for-byte.",
      "Splitting measures line boxes, so run it after fonts are ready for pixel-perfect masks.",
    ],
  },
  {
    id: "maskReveal",
    title: "Masked heading reveal",
    summary:
      "Inline `overflow: hidden` masks: each inner span rises from below its mask and settles — used for stacked display headings.",
    imports: ["maskReveal"],
    markup: `<h2>
  <span class="ak-mask"><span class="ak-mask__inner" data-mask>Text that</span></span>
  <span class="ak-mask"><span class="ak-mask__inner" data-mask>rises into view.</span></span>
</h2>`,
    usage: `const destroy = maskReveal("[data-mask]");`,
    options: [
      ["from / to", "`'100%'` / `'0%'`", "Start and end of the inner span's Y offset."],
      ["duration", "`0.5`", "Seconds."],
      ["ease", "`EASES.reveal`", "`.165,.84,.44,1`."],
      ["stagger", "`0.1`", "Seconds — siblings under one parent stagger together."],
      ["delay", "`0`", "Seconds."],
      ["start / end", "`'top 90%'` / `'bottom 10%'`", "ScrollTrigger positions."],
      ["mode", "`'scroll'`", "`'scroll'` reverses on leave; `'immediate'` plays at once."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Target the **inner** spans; the mask is the parent (`.ak-mask` sets `overflow: hidden`).",
      "Both classes ship in `anim-kit/styles`.",
    ],
  },
  {
    id: "revealRule",
    title: "Rule line draw",
    summary: "A thin divider line that draws itself out to full width when it enters the viewport.",
    imports: ["revealRule"],
    markup: `<div class="rule" data-rule></div>`,
    usage: `const destroy = revealRule("[data-rule]", { duration: 1, delay: 0.2 });`,
    options: [
      ["duration", "`1`", "Seconds."],
      ["delay", "`0`", "Seconds."],
      ["ease", "`EASES.reveal`", "`.165,.84,.44,1`."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Animates `width: 0 → 100%` — give the element a background colour and a 1px height in CSS.",
      "Plays at `top 92%` and reverses on leave-back.",
    ],
  },
  {
    id: "unfoldReveal",
    title: "Unfold reveal (scale from an edge)",
    summary:
      "Blocks that grow open from one edge — scaleY from the top/bottom or scaleX from the left — staggered as the section enters.",
    imports: ["unfoldReveal"],
    markup: `<p data-unfold>Unfolds from the top edge.</p>
<p data-unfold>Its sibling staggers in with it.</p>

<div class="rule" data-unfold-x></div>`,
    usage: `// Vertical unfold from the top edge:
const destroy = unfoldReveal("[data-unfold]", { axis: "y", origin: "top" });

// Horizontal grow from the left:
unfoldReveal("[data-unfold-x]", { axis: "x", origin: "left", duration: 1.2 });`,
    options: [
      ["axis", "`'y'`", "`'y'` animates `scaleY`; `'x'` animates `scaleX`."],
      ["origin", "`'top'` / `'left'`", "`transformOrigin` — defaults per axis."],
      ["duration", "`0.7`", "Seconds."],
      ["ease", "`'power3.out'`", "GSAP ease name."],
      ["stagger", "`0.08`", "Seconds between targets (all stagger off the first match's trigger)."],
      ["delay", "`0`", "Seconds before playing."],
      ["mode", "`'scroll'`", "`'scroll'` plays on enter; `'immediate'` plays at once."],
      ["start", "`'top 85%'`", "ScrollTrigger start."],
      ["replay", "`false`", "Re-unfold when leaving / re-entering the viewport."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "`destroy()` kills the tween and clears `transform` + `transform-origin` — elements rest exactly as authored.",
      "Works on text and blocks; give plain divs a background so the grow-in reads as a block opening.",
      "For per-character masked rises use `lineReveal({ split: 'chars' })`; for masked word lines use `lineReveal()`.",
    ],
  },
  {
    id: "clipWipe",
    title: "Clip wipe (inset reveal)",
    summary:
      "A `clip-path: inset()` wipe: the element is collapsed behind one edge (or inside a frame margin) and the inset animates to zero so it wipes into view.",
    imports: ["clipWipe"],
    markup: `<figure data-clip><img src="…" alt="…" /></figure>
<h2 data-clip-frame>Wipes out of a frame.</h2>
<figure data-clip-scrub><img src="…" alt="…" /></figure>`,
    usage: `// Grow rightward from the left edge:
const destroy = clipWipe("[data-clip]", { from: "left" });

// Open out of a centered frame (inset 15%):
clipWipe("[data-clip-frame]", { from: "frame", inset: 15, duration: 1.2 });

// Out of a corner — diagonal growth toward the opposite corner:
clipWipe("[data-clip-corner]", { from: "bottom-right", duration: 1.1 });

// Scroll-bound: the inset opens as the element travels through the
// viewport — and closes again when you scroll back up:
clipWipe("[data-clip-scrub]", { from: "frame", inset: 8, scrub: 0.5, start: "top bottom", end: "top 20%" });`,
    options: [
      ["from", "`'left'`", "`'left'` / `'right'` / `'top'` / `'bottom'` edge, a corner (`'top-left'` / `'top-right'` / `'bottom-left'` / `'bottom-right'`), or `'frame'`."],
      ["inset", "`15`", "Frame margin in % (`from: 'frame'` only)."],
      ["duration", "`1`", "Seconds."],
      ["ease", "`'power3.out'`", "GSAP ease name."],
      ["stagger", "`0.08`", "Seconds between targets."],
      ["delay", "`0`", "Seconds before playing."],
      ["mode", "`'scroll'`", "`'scroll'` plays on enter; `'immediate'` plays at once."],
      ["start", "`'top 85%'`", "ScrollTrigger start."],
      ["end", "`'top 20%'`", "ScrollTrigger end (scrub mode)."],
      ["scrub", "unset", "number = scrub smoothing seconds, `true` = immediate: bind the wipe to scroll progress instead of playing on enter."],
      ["replay", "`false`", "Re-wipe when leaving / re-entering the viewport."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Works on images, video, blocks and text — anything with a box.",
      "`from: 'left'` starts at `inset(0 100% 0 0)` and animates to `inset(0 0% 0 0%)`; the other edges mirror it, and corners start collapsed into their own corner (e.g. `from: 'bottom-right'` starts at `inset(100% 0 0 100%)` and opens toward the top-left).",
      "With `scrub` set, the wipe tracks scroll progress from `start` to `end` and reverses when you scroll back — `duration` no longer applies.",
      "`destroy()` kills the tween and removes the inline `clip-path`, restoring the authored (visible) state.",
    ],
  },
  {
    id: "logoReveal",
    title: "SVG logo path reveal",
    summary: "A wordmark that assembles letter by letter: each path drops in and fades up with a stagger.",
    imports: ["logoReveal"],
    markup: `<svg data-logo viewBox="0 0 400 80">
  <path class="svg-anim-path" d="…" fill="currentColor" />
  <path class="svg-anim-path" d="…" fill="currentColor" />
</svg>`,
    usage: `const destroy = logoReveal("[data-logo]", { stagger: 0.05 });`,
    options: [
      ["path", "`'[data-logo-path], .svg-anim-path'`", "Selector for the animatable paths, scoped to the SVG."],
      ["stagger", "`0.05`", "Seconds between paths."],
      ["duration", "`1`", "Seconds."],
      ["ease", "`'power2.out'`", "GSAP ease name."],
      ["start / end", "`'top 80%'` / `'bottom top'`", "ScrollTrigger positions."],
      ["once", "`false`", "Play once and never reverse."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: ["Paths start at `yPercent: -100, opacity: 0` — keep a static fallback for no-JS.", "Duplicate ids are not involved, but keep paths `fill=\"currentColor\"` so themes work."],
  },
  {
    id: "counter",
    title: "Number counter",
    summary: "A tabular number that ticks from one value to another, optionally when scrolled into view.",
    imports: ["counter"],
    markup: `<div class="stats">
  <div class="n" data-count>0</div>
  <div class="n" data-count-scroll>0</div>
  <div class="n" data-count-pad>0</div>
</div>`,
    usage: `counter("[data-count]", { to: 240, duration: 3, suffix: "+" });
counter("[data-count-scroll]", { to: 98, onScroll: true });
counter("[data-count-pad]", { to: 42, pad: 3 });

// Scroll-scrubbed readout — the number follows scroll progress (a hero %):
counter("[data-progress]", { progress: true, to: 100, pad: 2, suffix: "%" });`,
    options: [
      ["from / to", "`0` / `100`", "Start and end values."],
      ["duration", "`4`", "Seconds."],
      ["ease", "`'power1.inOut'`", "GSAP ease name."],
      ["pad", "`0`", "Pad with leading zeros to this width (0 = off)."],
      ["suffix", "`''`", "Appended to the number, e.g. `'+'`."],
      ["onScroll", "`false`", "Animate when scrolled into view instead of immediately."],
      ["progress", "`false`", "Scrub the value from scroll progress instead of a timed tween (ignores `onScroll`/`onComplete`)."],
      ["start / end", "`'top 90%'` / `'bottom top'`", "ScrollTrigger positions (`end` only with `progress`)."],
      ["onComplete", "—", "`(value) => {}` callback."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Use `font-variant-numeric: tabular-nums` so the width doesn't jitter.",
      "Reduced motion snaps to the final value.",
    ],
  },
  {
    id: "marquee",
    title: "Infinite marquee",
    summary:
      "A constant-speed logo/text band driven by one shared rAF loop — 40 px/s, the studio's rate. Rows can run in opposite directions.",
    imports: ["marquee"],
    markup: `<div class="ak-marquee">
  <div class="ak-marquee__viewport">
    <div class="ak-marquee__track" data-marquee-track data-dir="left">
      <span>Prink</span><span>Zerodha</span><span>Superyou</span>
    </div>
  </div>
</div>`,
    usage: `// One call covers every [data-marquee-track] you pass (or inside the container):
const destroy = marquee("[data-marquee-track]", { speed: 40, pauseOnHover: false });`,
    options: [
      ["speed", "`40`", "Pixels per second."],
      ["direction", "`data-dir`", "`'left'` / `'right'` forced for every track; otherwise each track reads its `data-dir`."],
      ["clone", "`true`", "Duplicate the content automatically if it isn't already doubled."],
      ["pauseOnHover", "`false`", "Pause the loop on pointer enter."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Wraps by exactly one copy's width, so the seam is invisible — that requires the content to be duplicated (automatic with `clone: true`).",
      "Give the track `width: max-content` inside an `overflow: hidden` viewport; `.ak-marquee*` classes in the stylesheet provide the edge masks.",
      "`destroy()` stops the rAF loop, removes the duplicated copy and restores the original markup.",
    ],
  },
  {
    id: "horizontalScroll",
    title: "Pinned horizontal gallery",
    summary:
      "A tall section pins while its inner track slides left; panel images get a secondary parallax driven by containerAnimation so they settle as they cross the viewport horizontally.",
    imports: ["horizontalScroll"],
    markup: `<section data-hsection>
  <div class="h-track" data-htrack>          <!-- width: max-content -->
    <div class="h-panel"><img data-speed-img alt="" /></div>
    <div class="h-panel"><img data-speed-img alt="" /></div>
    <div class="h-panel"><img data-speed-img alt="" /></div>
  </div>
</section>`,
    usage: `const destroy = horizontalScroll("[data-htrack]", {
  section: "[data-hsection]",
  panelImage: "[data-speed-img]",
  scrub: 0.5,
  imageScrub: 0.2,
});`,
    options: [
      ["section", "track's `<section>`", "Pinned section (trigger)."],
      ["panelImage", "`'img'`", "Selector for images inside panels that get extra parallax; `null` to disable."],
      ["scrub", "`0.5`", "Scrub smoothing for the horizontal movement."],
      ["imageScrub", "`0.2`", "Scrub smoothing for the image parallax."],
      ["travel", "`scrollWidth - innerWidth`", "Function returning the final X for the track."],
      ["imageParallax", "`true`", "Kill/keep the per-image ScrollTriggers."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "The track must be wider than the viewport (`width: max-content`) or there is nothing to travel.",
      "Late-loading images trigger one `ScrollTrigger.refresh()` so the travel distance stays correct.",
      "`destroy()` kills every trigger/tween and clears the track transform.",
    ],
  },
  {
    id: "parallax",
    title: "data-speed parallax",
    summary: "Elements drift faster or slower than the scroll, driven by a data attribute.",
    imports: ["parallax"],
    markup: `<div data-parallax>
  <img data-speed="-0.5" alt="" />  <!-- drifts up against the scroll -->
  <img data-speed="0.8"  alt="" />  <!-- runs ahead of the scroll -->
</div>`,
    usage: `const destroy = parallax("[data-parallax]", {
  attribute: "data-speed",
  scale: 50,             // yPercent multiplier
  start: "50% bottom",
  end: "bottom top",
});`,
    options: [
      ["attribute", "`'data-speed'`", "Attribute holding the speed multiplier."],
      ["scale", "`50`", "Multiplier applied to the attribute value (`yPercent`)."],
      ["start / end", "`'50% bottom'` / `'bottom top'`", "ScrollTrigger positions."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "`data-speed=\"0.8\"` settles at `yPercent: 40` (0.8 × 50).",
      "Scrubbed with `ease: 'none'` — pure, linear parallax.",
      "Scope it with a container: only descendants carrying the attribute are picked up.",
    ],
  },
  {
    id: "heroShrink",
    title: "Hero media shrink",
    summary:
      "Hero media that scales down and drifts as it scrolls away — the 'video shrinks into a card' move.",
    imports: ["heroShrink"],
    markup: `<div class="hero-media" data-hero-media>
  <img alt="" src="hero.jpg" />
</div>`,
    usage: `const destroy = heroShrink("[data-hero-media]", {
  offsetY: "49vh",
  scale: 0.23,
  scrub: 1,
});`,
    options: [
      ["offsetY", "`'49vh'`", "How far down the element drifts, CSS length."],
      ["offsetX", "`'0px'`", "Shift on X at the end."],
      ["scale", "`0.23`", "Final scale."],
      ["scrub", "`1`", "Scrub smoothing — higher = laggier."],
      ["start / end", "`'top top'` / `'bottom top'`", "ScrollTrigger positions."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Wrap media in `overflow: hidden` with a border radius so the shrink reads as a card.",
      "`destroy()` clears the transform.",
    ],
  },
  {
    id: "mediaSettle",
    title: "Media settle (entrance zoom)",
    summary:
      "Images and video that arrive slightly oversized and ease down to size as the section enters — or scrubbed to scroll progress. Content lands instead of popping in.",
    imports: ["mediaSettle"],
    markup: `<figure data-settle><img src="…" alt="…" /></figure>
<figure data-settle><img src="…" alt="…" /></figure>`,
    usage: `// One-shot on enter (scale 1.15 → 1):
const destroy = mediaSettle("[data-settle]", { from: 1.15, duration: 1.5 });

// Reverse on leave-back, replay on re-enter — every scroll pass animates:
mediaSettle("[data-settle]", { from: 1.15, replay: true });

// Bound to scroll progress instead (0.5s scrub smoothing):
mediaSettle("[data-settle-scrub]", { scrub: 0.5, start: "top bottom", end: "top 30%" });`,
    options: [
      ["from", "`1.15`", "Starting scale — settles down to 1."],
      ["duration", "`1.5`", "Seconds (enter mode only)."],
      ["ease", "`'power2.out'`", "GSAP ease (enter mode only)."],
      ["origin", "`'center'`", "`transformOrigin`."],
      ["stagger", "`0.06`", "Seconds between targets."],
      ["delay", "`0`", "Seconds before playing."],
      ["mode", "`'scroll'`", "`'scroll'` plays once on enter; `'immediate'` plays at once."],
      ["start", "`'top 75%'`", "ScrollTrigger start."],
      ["end", "`'bottom top'`", "ScrollTrigger end (scrub mode only)."],
      ["scrub", "unset", "Number = scrub smoothing seconds, `true` = immediate — binds the settle to scroll progress."],
      ["replay", "`false`", "Re-settle when leaving / re-entering the viewport (mode `'scroll'` only)."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "`destroy()` kills the tween and clears `transform` — media returns to its authored scale.",
      "Give media `object-fit: cover` inside a fixed box; the scale animates the element, not its intrinsic size.",
      "By default the settle is one-shot (`once: true`) — it plays on the first enter and never again. Pass `replay: true` to reverse back to `from` on leave-back and replay on every re-enter.",
      "Complements `heroShrink()`: that scrubs media down as it *leaves*; `mediaSettle()` plays the entrance.",
    ],
  },
  {
    id: "stackedCards",
    title: "Stacked card deck",
    summary:
      "A pinned deck: cards cascade up and settle into a stack while you scroll a tall wrapper — eased with the studio's cardStack bezier.",
    imports: ["stackedCards"],
    markup: `<div class="stack-wrap" data-stack-wrap>          <!-- tall runway: height 500vh -->
  <div class="stack-viewport" data-stack-viewport>  <!-- position: sticky; top: 0; height: 100vh -->
    <div class="stack-cards">
      <a class="ak-card" href="#">01 …</a>
      <a class="ak-card" href="#">02 …</a>
      <a class="ak-card" href="#">03 …</a>
    </div>
  </div>
</div>`,
    usage: `const destroy = stackedCards("[data-stack-wrap]", {
  viewport: "[data-stack-viewport]",
  card: ".ak-card",
  stagger: 0.12,
});`,
    options: [
      ["viewport", "wrap's first child", "Element that stays on screen (sticky)."],
      ["card", "`'.ak-card'`", "Card selector scoped to the viewport."],
      ["scrub", "`0.5`", "Scrub smoothing."],
      ["stagger", "`0.12`", "Delay between cards, seconds."],
      ["ease", "`EASES.cardStack`", "The cascading bezier."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "The wrapper's height is the scroll runway — 3–5 cards want ~400–600vh.",
      "Use `stackedCardsPinned()` when the viewport is a **sibling** of the runway instead of a child.",
      "Reduced motion: cards snap to their stacked state.",
    ],
  },
  {
    id: "stackedCardsPinned",
    title: "Stacked card deck (sibling viewport)",
    summary:
      "Same deck as stackedCards, for layouts where the pinned viewport is a sibling of the tall runway rather than a child of it — pins with pinSpacing: false.",
    imports: ["stackedCardsPinned"],
    markup: `<div class="pinned-viewport" data-pinned-viewport>
  <div class="stack-cards">
    <a class="ak-card" href="#">01 …</a>
    <a class="ak-card" href="#">02 …</a>
  </div>
</div>

<div class="pinned-wrap" data-pinned-wrap>   <!-- tall runway, sibling below -->
  <!-- extra scroll length -->
</div>`,
    usage: `const destroy = stackedCardsPinned("[data-pinned-wrap]", {
  viewport: "[data-pinned-viewport]",   // required in this variant
  card: ".ak-card",
  stagger: 0.1,
});`,
    options: [
      ["viewport", "— (required)", "The sibling element that gets pinned with `pinSpacing: false`."],
      ["card", "`'.ak-card'`", "Card selector scoped to the viewport."],
      ["scrub", "`true`", "Scrub smoothing."],
      ["stagger", "`0.1`", "Delay between cards, seconds."],
      ["ease", "`EASES.cardStack`", "The cascading bezier."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Cards animate from `yPercent: 50` + half-viewport below to `-50` + half-viewport above.",
      "`destroy()` kills the pin and timeline and clears card transforms.",
    ],
  },
  {
    id: "scatterText",
    title: "Scatter text band",
    summary:
      "A giant pinned band that scrolls horizontally while every character starts at a random offset/rotation and settles as it crosses the viewport.",
    imports: ["scatterText"],
    markup: `<section id="scatter">
  <div class="s-pin" data-scatter-pin>
    <p class="s-line" data-scatter>So, are you ready to Stand out?</p>
  </div>
</section>`,
    usage: `const destroy = scatterText("[data-scatter-pin]", {
  line: "[data-scatter]",
  pinTarget: "[data-scatter-pin]",
  granularity: "chars",
  scatterY: 60,
  scatterRotation: 15,
});`,
    options: [
      ["line", "the target itself", "Element that holds the text and is translated on X."],
      ["pinTarget", "`[data-pin]` in target", "Element pinned while the band scrolls."],
      ["granularity", "`'chars'`", "`'chars'` or `'words'`."],
      ["scatterY", "`60`", "Max random vertical offset, % of line height."],
      ["scatterRotation", "`15`", "Max random rotation, degrees."],
      ["scrub", "`0.5`", "Scrub smoothing."],
      ["settleStart / settleEnd", "`'left 100%'` / `'left 15%'`", "Per-character settle window."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Rewrites the line's `innerHTML` into `.ak-char` / `.ak-space` spans — `destroy()` restores the original text.",
      "Waits for `document.fonts.ready` before measuring, so webfonts travel the right distance.",
      "Give the line `white-space: nowrap` and let it overflow; the section should be `overflow: hidden`.",
    ],
  },
  {
    id: "scrambleText",
    title: "Scramble text (decode reveal)",
    summary:
      "Each character churns through the alphabet and settles on its final glyph, left to right — the cipher/decode reveal for headlines, labels and links.",
    imports: ["scrambleText"],
    markup: `<p data-scramble>Characters decode before they land.</p>

<a href="#" data-scramble-hover>hover me</a>`,
    usage: `// Plays once when scrolled into view:
const destroy = scrambleText("[data-scramble]");

// Above the fold — play right away:
scrambleText("[data-headline]", { mode: "immediate", delay: 0.2 });

// Re-scramble on every hover:
scrambleText("[data-scramble-hover]", { mode: "hover", durationPerChar: 0.12 });`,
    options: [
      ["mode", "`'scroll'`", "`'scroll'` plays once on enter; `'immediate'` plays now; `'hover'` re-scrambles on pointerenter."],
      ["charset", "`'abcdefghijklmnopqrstuvwxyz'`", "Glyphs letters churn through."],
      ["durationPerChar", "`0.18`", "Seconds each character scrambles (eased out)."],
      ["stagger", "`0.04`", "Seconds between character starts."],
      ["delay", "`0`", "Seconds before the timeline starts."],
      ["start", "`'top 80%'`", "ScrollTrigger start (`mode: 'scroll'` only)."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Targets must be **plain-text** elements — the effect rewrites `textContent` while scrambling.",
      "Letters scramble; digits, punctuation and spaces stay put, and letter case is preserved.",
      "`destroy()` kills the timelines, removes listeners and restores the original text exactly.",
      "Reduced motion never touches the text — it is already at its final state.",
    ],
  },
  {
    id: "rollText",
    title: "Rolling text (word rotator)",
    summary:
      "Stack two or more rows in a hidden overflow box and roll to the next one on an interval — the seamless vertical word rotator for taglines, badges and labels.",
    imports: ["rollText"],
    markup: `<span class="ak-roll" data-roll>
  <span>Design</span>
  <span>Build</span>
  <span>Motion</span>
</span>`,
    usage: `const destroy = rollText("[data-roll]", { interval: 2.2, duration: 0.6 });

// Walking the rows in reverse:
rollText("[data-roll-rev]", { direction: "down" });`,
    options: [
      ["interval", "`2.2`", "Seconds each row is shown (including the roll)."],
      ["duration", "`0.6`", "Roll duration, seconds."],
      ["ease", "`'power4.inOut'`", "GSAP ease for the roll."],
      ["direction", "`'up'`", "`'up'` rolls upward; `'down'` walks in reverse."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Rows must be direct children of the target; the effect stacks them as blocks itself.",
      "The first row is cloned at the end so the wrap is seamless (same trick as `marquee()`); `.ak-roll` in the stylesheet is the authored base.",
      "`destroy()` unwraps the rows, removes the clone and restores every inline style — markup comes back byte-identical.",
      "Reduced motion never touches the markup — rows stay exactly as authored.",
    ],
  },
  {
    id: "flipWords",
    title: "Flip word transfer (layout morph)",
    summary:
      "Words measured in one layout, moved into another and animated from where they stood — the FLIP technique: a column of words fans out into a row, driven by scroll progress or played once.",
    imports: ["flipWords"],
    markup: `<div class="flip-stage">
  <div data-flip-from>
    <span data-flip-word>Make</span>
    <span data-flip-word>it</span>
    <span data-flip-word>move.</span>
  </div>
  <div data-flip-to></div>
</div>

<style>
  /* Both blocks share one grid cell — the stage never reflows mid-flight. */
  .flip-stage { display: grid; }
  .flip-stage > [data-flip-from],
  .flip-stage > [data-flip-to] { grid-area: 1 / 1; min-height: 40vh; }
  [data-flip-from] { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 0.06em; }
  [data-flip-to]   { display: flex; justify-content: space-between; align-items: center; }
  .flip-stage span { font-size: clamp(40px, 7vw, 110px); font-weight: 600; line-height: 1; }
</style>`,
    usage: `// Scroll drives the transfer — scrubbing back up reverses it:
const destroy = flipWords("[data-flip-from]", {
  to: "[data-flip-to]",  // destination block — every word lands here
  scrub: 0.6,
});

// Or play once on enter (reverses on leave-back), or immediately:
// flipWords("[data-flip-from]", { to: "[data-flip-to]", mode: "scroll" });
// flipWords("[data-flip-from]", { to: "[data-flip-to]", mode: "immediate" });`,
    options: [
      ["to", "— (required)", "Destination block — every word is moved into it."],
      ["words", "source children", "The word elements: `[data-flip-word]` matches, else the source's element children."],
      ["duration", "`1.4`", "Seconds for one word's travel."],
      ["ease", "`'power4.inOut'`", "GSAP ease."],
      ["stagger", "`0.2`", "Seconds between word starts."],
      ["scale", "`0.2`", "Mid-flight squash each word pops through (0 disables)."],
      ["mode", "`'scroll'`", "`'scroll'` plays on enter (reverses on leave-back); `'immediate'` plays now."],
      ["scrub", "unset", "number = scrub smoothing seconds, `true` = immediate: tie the transfer to scroll progress instead of playing on enter."],
      ["start / end", "`'top 75%'` / `'bottom 45%'`", "ScrollTrigger positions (`end` applies to scrub mode)."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Both blocks should share one grid cell (`grid-area: 1 / 1`) so reparenting never reflows the page — see the markup.",
      "The words are moved into the destination up front but rendered at their source positions until the timeline runs, so a scrubbed transfer reverses perfectly with no layout jump.",
      "The scale accents assume source and destination words are the same size (the usual layout morph); pass `scale: 0` if the sizes differ.",
      "`destroy()` kills the timeline, puts every word back in its original parent (original order) and restores the inline transform.",
      "Reduced motion never moves the words — they stay visible in the source block.",
    ],
  },
  {
    id: "dragStrip",
    title: "Infinite drag strip",
    summary:
      "A grabbable carousel you can drag forever: GSAP Draggable moves the strip, a modifier folds every position back into one loop, and the cards tilt in proportion to your pull before springing straight on release.",
    imports: ["dragStrip"],
    markup: `<div class="drag-viewport">
  <div class="drag-track" data-drag>
    <div class="drag-card">Image 01</div>
    <div class="drag-card">Image 02</div>
    <div class="drag-card">Image 03</div>
  </div>
</div>`,
    usage: `const destroy = dragStrip("[data-drag]", {
  maxRotation: 60,
  rotationScale: 120,
  clone: true,          // duplicate content so the loop is seamless
  inertia: false,       // true needs GSAP's InertiaPlugin
});`,
    options: [
      ["maxRotation", "`100`", "Max tilt in degrees at full drag speed."],
      ["rotationScale", "`100`", "Divisor on the normalised drag speed — higher = subtler tilt."],
      ["settleDuration", "`1`", "Seconds to spring back to 0 on release."],
      ["clone", "`true`", "Duplicate the content so the wrap is seamless (removes clones on destroy)."],
      ["inertia", "`false`", "Throw after release — requires GSAP's InertiaPlugin; silently skipped without it."],
      ["item", "`':scope > *'`", "Items inside the strip that rotate."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "The track is the **single-source** transform: Draggable owns X and a `modifiers` wrapper does the looping, so there is no fighting writer and no lag.",
      "One tile must be at least as wide as the viewport for a seamless loop — anim-kit keeps duplicating until that holds.",
      "`touch-action: pan-y` keeps vertical page scrolling working over the strip.",
      "`destroy()` kills the Draggable and rotation tweens, removes the cloned tiles and restores the element's original inline styles.",
      "Accessibility: the strip is pointer/touch only by design — it is decorative content, so keep links inside it keyboard-reachable elsewhere if it carries navigation.",
    ],
  },
  {
    id: "liquidButton",
    title: "Liquid-fill button",
    summary: "An SVG wave floods the button on hover and the label flips to the fill colour.",
    imports: ["liquidButton"],
    markup: `<button class="ak-liquid" data-liquid>
  <svg class="ak-liquid__wave" viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d="M0,30 Q50,-5 100,30 L100,100 L0,100 Z" />
  </svg>
  <span class="ak-liquid__label">Lets Talk →</span>
</button>`,
    usage: `const destroy = liquidButton("[data-liquid]", {
  direction: "up",
  duration: 900,
  fill: "var(--ak-primary)",
});

// Scope the ones that fill the other way:
liquidButton('[data-liquid][data-dir="down"]', { direction: "down" });`,
    options: [
      ["duration", "`900`", "Wave travel time, ms."],
      ["fill", "`var(--ak-primary, #6c5ce7)`", "CSS colour for the wave fill."],
      ["direction", "`'up'`", "`'up'` (rise from the bottom) or `'down'` (fall from the top)."],
      ["labelColor", "`'#fff'`", "Colour the label takes on hover."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "The effect stamps each element with `data-ak-liquid` and the `--ak-liquid-*` CSS variables — `destroy()` removes them.",
      "`direction` applies to every matched element, so scope the call for buttons that fill the other way.",
      "The wave behaviour itself is pure CSS (`.ak-liquid__wave` in `anim-kit/styles`) — hover/focus works without JS too.",
    ],
  },
  {
    id: "underlineLink",
    title: "Underline sweep link",
    summary: "An underline that wipes across a link on hover.",
    imports: ["underlineLink"],
    markup: `<a class="ak-underline" href="#work">Work</a>`,
    usage: `const destroy = underlineLink("a.ak-underline");`,
    options: [["force", "`false`", "Run even under `prefers-reduced-motion`."]],
    notes: [
      "Pure CSS under the hood — the helper just adds/removes the `.ak-underline` class whose `::after` does the sweep.",
      "`destroy()` removes the class again.",
    ],
  },
  {
    id: "magnetic",
    title: "Magnetic hover buttons",
    summary:
      "Buttons and links that lean toward the pointer while hovered — following a fraction of the pull with a tilt — then spring back to rest with an elastic snap on leave.",
    imports: ["magnetic"],
    markup: `<button class="pill" data-magnet>Book a call</button>
<button class="pill" data-magnet>Say hello</button>

<style>
  .pill { padding: 12px 24px; border: 0; border-radius: 999px; font: inherit; cursor: pointer; }
</style>`,
    usage: `const destroy = magnetic("[data-magnet]", {
  strength: 0.5,   // follow half the pointer offset
  rotation: 10,    // tilt up to 10° at full pull
  scale: 1.04,     // grow slightly while pulled
});`,
    options: [
      ["strength", "`0.4`", "How far the element follows the pointer — fraction of its own box."],
      ["rotation", "`8`", "Max tilt in degrees at full pull (0 disables rotation)."],
      ["scale", "`1`", "Scale held while the pointer is over the element (1 = none)."],
      ["duration", "`1.2`", "Spring-back duration, seconds."],
      ["ease", "`'elastic.out(1, 0.35)'`", "Spring-back ease."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Pass a list (selector, array, NodeList) — each element gets its own listeners and its own pull.",
      "Keep CSS transitions off `transform` for magnetic elements — GSAP animates transform directly and the two fight.",
      "Pairs well with `cursor: none` zones and `underlineLink` for a fully pointer-driven feel.",
      "`destroy()` removes the listeners, kills in-flight tweens and restores the inline transform.",
    ],
  },
  {
    id: "cursorFollower",
    title: "Cursor follower tag",
    summary: "A floating tag that springs after the pointer inside a zone — e.g. a 'Play showreel' label.",
    imports: ["cursorFollower"],
    markup: `<div class="cursor-tag" data-cursor>▶ Play Showreel</div>

<div class="showreel-zone" data-showreel>
  <span>Hover me</span>
</div>`,
    usage: `const destroy = cursorFollower("[data-showreel]", {
  follower: "[data-cursor]",
  offset: 14,
  spring: { mass: 0.1, stiffness: 120 },
});`,
    options: [
      ["follower", "first `[data-cursor]`", "The floating element."],
      ["offset", "`14`", "Offset added to the pointer position, px."],
      ["spring", "`{ mass: 0.1, stiffness: 120 }`", "Spring config for the follower."],
      ["blendMode", "`'exclusion'`", "Blend mode applied to the follower."],
      ["fade", "`true`", "Fade the follower in/out with the pointer."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Style the tag with `opacity: 0` — the effect pins it `position: fixed` and drives it in viewport space, so it can live anywhere in the DOM.",
      "`mix-blend-mode: exclusion` needs light text to invert — give the tag `color: #fff`, otherwise it blends down into the backdrop and disappears.",
      "Pair it with `cursor: none` on the zone for the full effect.",
    ],
  },
  {
    id: "audioBars",
    title: "Audio equaliser bars",
    summary: "A little equaliser visualiser whose bars re-randomise on an interval — start/stop it like a media element.",
    imports: ["audioBars"],
    markup: `<span class="ak-eq" data-eq>
  <i></i><i></i><i></i><i></i><i></i>
</span>`,
    usage: `const eq = audioBars("[data-eq]", { interval: 100, minHeight: 4, maxHeight: 16 });

eq.start();   // animate
eq.stop();    // hold
eq.destroy(); // tear down`,
    options: [
      ["bar", "`':scope > *'`", "Bars inside the container."],
      ["interval", "`100`", "Re-randomise interval, ms."],
      ["minHeight / maxHeight", "`4` / `14`", "Bar height range, px."],
      ["bounce", "`0.75`", "Spring feel, 0..1 — picks the overshoot ease."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Returns a **handle** (`{ start, stop, destroy }`).",
      "Reduced motion: bars render a static resting pattern.",
      "`.ak-eq` in the stylesheet supplies the flex row and bar width.",
    ],
  },
  {
    id: "themeReveal",
    title: "Theme toggle with circular wipe",
    summary:
      "Light/dark switching with a View Transitions circular wipe expanding from the toggle — falls back to an instant swap.",
    imports: ["themeReveal"],
    markup: `<button class="eq-btn" data-theme>Toggle theme</button>`,
    usage: `const theme = themeReveal({
  toggle: "[data-theme]",
  storageKey: "ak-theme",
  origin: "50% 50%",       // or an element to centre the circle on
  duration: 1,
});

theme.toggle();
theme.set("dark");
console.log(theme.current());`,
    options: [
      ["toggle", "—", "Click target that triggers the wipe."],
      ["storageKey", "`'ak-theme'`", "localStorage key for persistence."],
      ["initial", "`<html>` class", "Initial theme; defaults to whatever is on `<html>`."],
      ["origin", "`'50% 50%'`", "Circle origin — CSS position or an element."],
      ["duration", "`1`", "Animation duration, seconds."],
      ["onChange", "—", "`(theme) => {}` callback."],
    ],
    notes: [
      "Returns a **handle** (`{ set, toggle, current, destroy }`).",
      "Define your themes as `html.light` / `html.dark` classes with CSS custom properties.",
      "Uses `document.startViewTransition` when available; otherwise swaps immediately.",
      "`destroy()` removes the injected styles and listeners but leaves the current theme applied.",
    ],
  },

  {
    id: "reelText",
    title: "Reel text — per-character odometer roll",
    summary:
      "Every character gets a masked vertical strip of ghost glyphs that rolls upward and lands on the real text — a DOM slot-machine decode for headlines and stat lines, scroll-triggered or immediate.",
    imports: ["reelText"],
    markup: `<p data-reel>Every character rolls into place.</p>`,
    usage: `// immediate (default) or scroll: roll when the line enters the viewport
const destroy = reelText("[data-reel]", {
  mode: "scroll",
  frames: 4,      // ghost glyphs per character before the final one
  stagger: 0.05,  // left-to-right wave between characters
  duration: 0.8,  // roll time per character
  replay: false,  // true = re-arm on every scroll re-entry
});`,
    options: [
      ["mode", "`'immediate'`", "`'scroll'` rolls on viewport enter instead of on mount."],
      ["start", "`'top 85%'`", "ScrollTrigger start (only with `mode: 'scroll'`)."],
      ["frames", "`4`", "Ghost frames per character before the final glyph."],
      ["duration", "`0.8`", "Roll duration per character, seconds."],
      ["stagger", "`0.05`", "Delay between characters, seconds."],
      ["ease", "`'power4.out'`", "GSAP ease for the roll."],
      ["replay", "`false`", "Re-arm on every scroll re-entry instead of playing once."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Targets must be **plain text** — the effect snapshots `innerHTML`, splits the text into masks and restores the original markup byte for byte when the roll completes (and on `destroy()`), so screen readers and copy/paste always see the final line.",
      "Only alphanumerics spin; spaces and punctuation pass through. Ghost glyphs match the character's case (uppercase rolls through A–Z), so the line never changes colour mid-roll.",
      "No stylesheet required: each wrapper is measured from its *final* glyph (no width jitter while spinning), inherits the target's `line-height`, and carries inline mask styles.",
      "Reduced motion leaves the target completely untouched.",
    ],
  },
  {
    id: "dragRail",
    title: "Drag rail — bounded inertia rail",
    summary:
      "A grabbable rail with real physics: pointer, wheel and trackpad feed one intent value, the track lerps toward it, the ends give way through a tanh rubber-band, and a flick coasts on sampled momentum. Horizontal by default — `axis: \"auto\"` flips it vertical when only the column overflows (a mobile card stack). Finite — unlike dragStrip's infinite loop.",
    imports: ["dragRail"],
    markup: `<div class="rail-viewport"> <!-- overflow: hidden -->
  <div data-rail> <!-- display: flex; width: max-content; gap: 1rem;
                       cursor: grab; user-select: none; touch-action: pan-y -->
    <img src="card-01.jpg" alt="" draggable="false" />
    <img src="card-02.jpg" alt="" draggable="false" />
    <img src="card-03.jpg" alt="" draggable="false" />
  </div>
</div>`,
    usage: `const destroy = dragRail("[data-rail]", {
  tilt: 0.05,      // children lean into motion (deg per px/frame), 0 = off
  throwScale: 14,  // momentum multiplier on release
  wheel: true,     // trackpad/wheel drives the rail too
  axis: "auto",    // "x" | "y" | "auto" — auto follows the layout
});`,
    options: [
      ["viewport", "track's parent", "Scroll viewport around the track."],
      ["axis", "`\"x\"`", "`\"x\"`, `\"y\"`, or `\"auto\"` — auto runs vertical when only the column overflows (touch-action claims the rail's own axis: `pan-y` / `pan-x`)."],
      ["item", "`:scope > *`", "Children that tilt with velocity."],
      ["lerp", "`0.1`", "Follow speed toward the intent, per 60fps frame (0..1)."],
      ["edge", "`140`", "Rubber-band resistance distance past the ends, px."],
      ["throwScale", "`14`", "Momentum multiplier on release."],
      ["wheel", "`true`", "Wheel/trackpad drives the rail (consumed while it can still move)."],
      ["tilt", "`0`", "Degrees of tilt per px/frame of velocity — `0` disables."],
      ["tiltMax", "`8`", "Tilt clamp, degrees."],
      ["onTick", "—", "`(pos, velocity) => {}` every rendered frame (pos along the active axis) — feed shaders/skews."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "**Single writer.** One ticker renders `intent → pos` with a `lerp * deltaRatio` catch-up; pointermove, wheel and release only ever touch *intent*. Nothing else writes the track's transform — that separation is what gives a hard throw its buttery settle.",
      "**tanh rubber-band.** Past either end, intent squashes through `edge * tanh(overshoot / edge)`: pull further, gain less, never a hard stop. When input stops a restore force springs the overscrolled intent home while the lerp chases it.",
      "**Wheel is Lenis-safe.** While the rail can still move in that direction the event gets `preventDefault` **and** `stopPropagation` (Lenis listens above us and would scroll the page in parallel). Once over-extended a full `edge`, the wheel passes through to the page — the section never traps the reader.",
      "**Two axes.** `axis: \"auto\"` resolves per layout (only the column overflows → vertical, otherwise horizontal) and re-resolves on resize, re-keying the transform on a flip. For a vertical stack give the track `flex-direction: column; width: 100%; height: max-content` inside an `overflow: hidden` viewport.",
      "**vs dragStrip**: `dragStrip` clones tiles for a seamless *infinite* loop; `dragRail` is *bounded* with elastic ends — use one per page-role, not both on the same content.",
      "**vs glRail**: `glRail` (the `/three` subpath) runs this exact physics under a WebGL overlay — the cards bend around a cylinder over a grid floor. Pick `dragRail` for plain-DOM rails, `glRail` when the media should curve.",
      "`destroy()` removes every listener + the ticker, clears the track transform/tilt and restores the inline cursor / user-select / touch-action the effect overwrote.",
    ],
  },
  {
    id: "webglMedia",
    title: "WebGL media — three.js shader card",
    summary:
      "Re-renders a plain <img> as a rounded GL plane: hover presses a dent into the picture (sample squeeze + fake dome lighting), splits its channels, and the card wipes in on reveal — one fragment shader, silent no-op wherever WebGL isn't available.",
    imports: ["webglMedia"],
    importsFrom: "@cosmictraveler002/anim-kit/three",
    markup: `<figure data-gl> <!-- position: relative; aspect-ratio: 4/3; overflow: hidden -->
  <img src="photo.jpg" alt="" />
</figure>`,
    usage: `const destroy = webglMedia("[data-gl]", {
  corner: 18, // rounded-corner radius, px (shader SDF, not border-radius)
  dent: 70,   // hover press depth, px
  chroma: 2,  // rgb split at full hover, px
});`,
    options: [
      ["src", "first `<img>`", "Image source override when the wrapper has no image."],
      ["corner", "`16`", "Corner radius, px (rounded-box SDF in the fragment shader)."],
      ["dent", "`70`", "Dent depth pressed into the card on hover, px."],
      ["chroma", "`2`", "Chromatic split at full hover, px."],
      ["reveal", "`true`", "Wipe the card in bottom-up when its texture loads."],
      ["revealDuration", "`1.1`", "Reveal duration, seconds."],
      ["hoverDuration", "`0.6`", "Hover response duration, seconds."],
      ["dpr", "`2`", "Device-pixel-ratio cap."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "**Optional peer.** Imports from `@cosmictraveler002/anim-kit/three` — `three` is never a core dependency. Bundler: `npm i three`; CDN: the §2 import map serves the pinned build.",
      "**Silent no-op ladder**: missing target → no-op; no `WebGLRenderingContext` (SSR, jsdom, WebGL disabled) → no-op *before* any context probe; renderer refused → no-op; texture 404 → the plain `<img>` stays visible. Nothing ever logs.",
      "The `<img>` keeps layout and alt text (the canvas covers the wrapper and only takes over its pixels once the texture has loaded); destroy removes the canvas and puts the image back.",
      "Corners are shader-true (SDF with a 1px AA edge), cover-crop runs in-shader (`object-fit: cover` maths), so any source aspect fills any card aspect without letterboxing.",
      "Reduced motion → the canvas never mounts; the static image is the resting state. `destroy()` kills ticker + tweens + observers and disposes geometry, material, texture and renderer.",
    ],
  },
  {
    id: "glRail",
    title: "GL rail — WebGL overlay drag rail",
    summary:
      "The bounded drag rail drawn as a WebGL layer: every card re-rendered onto one fixed canvas, its surface bent around an invisible cylinder, over a perspective grid floor — while the DOM keeps layout, labels and hit areas. dragRail's physics underneath (inertia throw, tanh rubber-band, Lenis-safe wheel) with an axis that flips vertical when only the column overflows, so the same init serves a desktop row and a mobile stack.",
    imports: ["glRail"],
    importsFrom: "@cosmictraveler002/anim-kit/three",
    markup: `<div class="rail-screen"> <!-- position: relative; overflow: hidden; dark stage -->
  <div data-rail> <!-- flex row (column when stacked); width: max-content;
                       cursor: grab; user-select: none -->
    <article class="rail-card"> <!-- position: relative; transparent background -->
      <img src="card-01.jpg" alt="" draggable="false" />
      <p>Night Atlas ↗</p> <!-- label: DOM, paints above the canvas -->
    </article>
    <article class="rail-card">
      <img src="card-02.jpg" alt="" draggable="false" />
      <p>Signal Bloom ↗</p>
    </article>
  </div>
</div>`,
    usage: `const destroy = glRail("[data-rail]", {
  radius: 1200,   // cylinder radius, px — smaller = stronger bend
  grid: true,     // perspective grid floor under the cards
  corner: 16,     // SDF corner radius, px
  axis: "auto",   // row/vertical — the layout decides (same rule as dragRail)
});`,
    options: [
      ["viewport", "track's parent", "The stage the canvas covers — keep it `overflow: hidden`."],
      ["card", "`:scope > *`", "Cards re-rendered on the canvas — each needs an `<img>`."],
      ["axis", "`\"auto\"`", "`\"x\"`, `\"y\"`, or `\"auto\"` — picks the motion *and* the bend axis from the layout (only the column overflows → vertical)."],
      ["radius", "`1200`", "Cylinder radius the cards bend around, px — smaller = stronger bend."],
      ["corner", "`16`", "Corner radius, px (rounded-box SDF in the fragment shader)."],
      ["grid", "`true`", "Perspective grid floor under the cards (drifts slightly with the rail)."],
      ["dpr", "`2`", "Device-pixel-ratio cap."],
      ["lerp", "`0.1`", "Follow speed toward the intent, per 60fps frame (0..1)."],
      ["edge", "`140`", "Rubber-band resistance distance past the ends, px."],
      ["throwScale", "`14`", "Momentum multiplier on release."],
      ["wheel", "`true`", "Wheel/trackpad drives the rail (consumed while it can still move)."],
      ["onTick", "—", "`(pos, velocity) => {}` every rendered frame (pos along the active axis)."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "**Physics is dragRail.** The same single-writer intent/pos ticker, tanh rubber-band, throw momentum and Lenis-safe wheel — `glRail` only adds the GPU layer on top (plus the axis rule shared with `dragRail`, so a desktop row and a mobile stack need no re-init).",
      "**The DOM stays the source of truth.** Cards keep owning layout, labels, hit areas and alt text; each frame the effect reads their viewport rects and the shader re-creates the pixels beneath them. Labels never drift off their card because the card *is* the rect the label sits in — only the picture curves.",
      "**The bend is a uniform, not CPU work.** The vertex shader maps each vertex onto the cylinder (`a = o / R`, `x = R·sin a`, `z = −R·(1−cos a)`) re-centred on the card's own middle: the centre stays glued to the DOM position while the edges foreshorten, and the rotation the cards need arrives free from the curve.",
      "**Card backgrounds must stay transparent** — the single alpha canvas paints *under* the track (the track's transform creates a stacking context above it), so DOM labels sit over the GL media for free. The effect hides only each `<img>` — and only once its texture has actually loaded.",
      "**Silent no-op ladder**: missing target → no-op; no `WebGLRenderingContext` (SSR, jsdom, WebGL disabled) → the **flat dragRail rail** still runs (motion works, plain `<img>`s show), *before* any context probe; renderer refused → flat rail; texture 404 → that one card keeps its image; reduced motion → nothing mounts. Nothing ever logs.",
      "`destroy()` unwinds the physics and the GPU together: listeners, ticker, observers, geometry, materials, textures and the renderer are disposed, the canvas is removed, and image opacities + the stage's inline position are restored.",
    ],
    procedure: {
      style: `      /* the rail stage: the canvas covers it, the DOM keeps the labels */
      .rail-screen { position: relative; overflow: hidden; height: 64vh;
                     background: #07080b; border-radius: 28px; cursor: grab; }
      .rail-track { display: flex; gap: 16px; width: max-content; height: 100%;
                    align-items: center; padding: 0 32px;
                    user-select: none; touch-action: pan-y; }
      .rail-card { position: relative; flex: none; height: 58%;
                   aspect-ratio: 2048 / 1172; border-radius: 16px;
                   background: transparent; }
      .rail-card img { width: 100%; height: 100%; object-fit: cover; display: block;
                       pointer-events: none; }
      .rail-card p { position: absolute; inset: auto 0 0; margin: 0;
                     padding: 14px 18px; color: #fff; font-size: 15px;
                     background: linear-gradient(to top, rgba(4,5,8,.7), transparent); }
      @media (max-width: 700px) {
        .rail-track { flex-direction: column; width: 100%; height: max-content;
                      padding: 18px 14px; touch-action: pan-x; }
        .rail-card { height: auto; width: 100%; }
      }`,
      pieces: `- \`three\` — ONE \`WebGLRenderer\` for the whole rail on a single fixed alpha
  canvas under the track: every card's picture recreated from its DOM rect
  each frame, bent onto the cylinder in the vertex shader (rounded-box SDF
  corners + in-shader cover-crop in the fragment), over a grid-floor shader
  that fades into the horizon and drifts with the rail.`,
    },
  },
  {
    id: "tearReveal",
    title: "Tear reveal — torn-edge sheet sweep",
    summary:
      "A noise-displaced boundary sweeps a section in or out: the fbm joins the field before thresholding, so patches tear away ahead of the front and ride across as separate shards, while a barrel warp bows the edge into an arriving curve instead of a straight line wobbling in place. The sheet paints flat colour or a two-stop gradient and can multiply-tint the artwork under it.",
    imports: ["tearReveal"],
    importsFrom: "@cosmictraveler002/anim-kit/three",
    markup: `<section data-tear> <!-- position: relative; overflow: hidden -->
  …content the sheet sweeps over…
</section>`,
    usage: `const destroy = tearReveal("[data-tear]", {
  color: ["#ff1f1f", "#ff5252"], // [foot, top] gradient stops (or one colour)
  blend: "multiply",             // tint the section instead of covering it
  direction: "up",               // up | down | left | right
  mode: "scroll",                // play on enter — or "immediate"
  duration: 1,                   // seconds for the timed run
});

// scrub: 0.4  -> progress follows the scroll; stopping half way leaves a
//                half-torn screen (a real place to be)
// fixed: true -> the canvas covers the viewport for a page-sized sweep
destroy();`,
    options: [
      ["color", "`\"#111111\"`", "Sheet colour — one colour or `[foot, top]` gradient stops."],
      ["blend", "`\"none\"`", "CSS `mix-blend-mode` for the canvas — `multiply` tints what is under it."],
      ["direction", "`\"up\"`", "Which way the boundary travels: `up` `down` `left` `right`."],
      ["dispAmp", "`0.175`", "How far the noise drags the boundary."],
      ["dispScale", "`12.2`", "Tear size — high is shrapnel, low is a wave."],
      ["dispDetail", "`5`", "Noise octaves — 1 is a smooth wobble, 5 is debris."],
      ["dispDrift", "`0`", "How fast the noise pattern crawls (0 holds it still)."],
      ["soft", "`0.001`", "Threshold half-width — small keeps shards crisp."],
      ["lens", "`-0.275`", "Barrel warp — negative bows the middle of the boundary up, 0 is flat."],
      ["duration", "`1`", "Timed-run duration, seconds (ignored when `scrub` is set)."],
      ["ease", "`\"power2.inOut\"`", "GSAP ease for the timed run."],
      ["mode", "`\"scroll\"`", "`\"scroll\"` plays on enter, `\"immediate\"` plays at once."],
      ["scrub", "—", "number = scrub smoothing seconds, `true` = immediate — binds progress to scroll."],
      ["start", "`\"top 85%\"`", "ScrollTrigger start position."],
      ["end", "`\"top 25%\"`", "ScrollTrigger end position (scrub mode)."],
      ["replay", "`false`", "Re-run when leaving / re-entering the viewport."],
      ["fixed", "`false`", "Mount the canvas over the viewport instead of the target box."],
      ["z", "`1`", "Canvas z-index inside its stacking context."],
      ["dpr", "`2`", "Device-pixel-ratio cap."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "**Optional peer.** Imports from `@cosmictraveler002/anim-kit/three` — `three` is never a core dependency. Bundler: `npm i three`; CDN: the §2 import map serves the pinned build.",
      "**Modes mirror clipWipe**: `scroll` / `immediate` timed runs, or `scrub` for a boundary that tracks scroll position — scrubbing back re-tears the screen the way it came.",
      "Both ends of the travel are **sealed**: the displaced boundary reaches the far side with its deepest tear at exactly zero, so the last half-covered pixels never read as speckle or leftover haze.",
      "**Silent no-op ladder**: missing target → no-op; no `WebGLRenderingContext` (SSR, jsdom, WebGL disabled) → no-op *before* any context probe; renderer refused → no-op; reduced motion → nothing mounts. Nothing ever logs.",
      "`destroy()` kills the tween + ScrollTrigger, removes the canvas and restores the host styles it changed.",
    ],
  },
  {
    id: "ditherReveal",
    title: "Dither reveal — speckled punch-through photo",
    summary:
      "A photo punches through its placeholder in a hard-edged, fbm-speckled ring expanding from the centre outward — no soft dissolve, no crossfade: every pixel on the boundary flips between hole and not-hole. The noise spread ramps to zero at both ends of the travel, so progress 0 is exactly empty and progress 1 exactly solid.",
    imports: ["ditherReveal"],
    importsFrom: "@cosmictraveler002/anim-kit/three",
    markup: `<figure data-reveal> <!-- position: relative; overflow: hidden; background: plate -->
  <img src="photo.jpg" alt="" />
</figure>`,
    usage: `const destroy = ditherReveal("[data-reveal]", {
  plate: "#14140f", // flat placeholder shown where the mask has not opened
  duration: 1.15,   // seconds
  maskScale: 50,    // fbm frequency across the element — lump scale of the edge
  hard: true,       // the signature speckle (false = soft dissolve)
  play: "visible",  // fire when the wrapper scrolls into view
});
destroy();`,
    options: [
      ["src", "first `<img>`", "Image source override when the wrapper has no image."],
      ["duration", "`1.15`", "Reveal duration, seconds."],
      ["ease", "`\"power4.out\"`", "GSAP ease for the reveal."],
      ["plate", "—", "Flat placeholder colour under the not-yet-revealed area (omit to show the wrapper's own background)."],
      ["maskScale", "`50`", "fbm frequency across the element — the lump scale of the edge."],
      ["spread", "`0.35`", "How far (normalised radius) the noise can push the boundary ahead of / behind the clean circle."],
      ["detail", "`4`", "fbm octaves — 1 is a soft blob, 6 is gritty."],
      ["hard", "`true`", "Hard-edged speckle (the signature) vs a soft dissolve."],
      ["play", "`\"visible\"`", "`\"visible\"` fires on first viewport entry, `\"load\"` when the texture decodes (falls back to `load` without IntersectionObserver)."],
      ["dpr", "`2`", "Device-pixel-ratio cap."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "**Optional peer.** Imports from `@cosmictraveler002/anim-kit/three` — `three` is never a core dependency. Bundler: `npm i three`; CDN: the §2 import map serves the pinned build.",
      "**The `<img>` keeps layout and alt text**: the canvas covers the wrapper and only takes over its pixels once the texture has decoded — with a plate the placeholder covers from load, without one the image only steps aside when the reveal actually starts. A texture 404 leaves the plain `<img>` untouched.",
      "**Cover crop in-shader** (`object-fit: cover` maths), so any source aspect fills any card aspect without letterboxing.",
      "**Silent no-op ladder**: missing target → no-op; no `WebGLRenderingContext` (SSR, jsdom, WebGL disabled) → no-op *before* any context probe; renderer refused → no-op; reduced motion → the canvas never mounts and the static image is the resting state. Nothing ever logs.",
      "`destroy()` kills the tween + observers, disposes geometry/material/texture/renderer, removes the canvas and restores the image opacity and wrapper position.",
    ],
  },
  {
    id: "wordmarkWave",
    title: "Wordmark wave — liquid type with chromatic fringes",
    summary:
      "Your own headline rendered to a texture and simulated as a spring lattice: the pointer shears the letters like thick liquid, red and cyan split out of the colour while the surface deforms, and every vertex springs back to exact rest. The text, font and colour are the target's own — nothing to export, nothing to align.",
    imports: ["wordmarkWave"],
    importsFrom: "@cosmictraveler002/anim-kit/three",
    markup: `<h2 id="mark">ANIMKIT</h2> <!-- display type, one line — its own text becomes the texture -->`,
    usage: `const destroy = wordmarkWave("#mark", {
  drag: 1,      // pointer-velocity term — how hard the letters smear
  push: 0,      // radial push — vertices flee the cursor while it sits still
  chroma: true, // red/cyan split while deforming
  outline: 0,   // stroke width, px (0 = solid fill)
});
destroy();`,
    procedure: {
      style: `      /* the wordmark: the canvas covers it, the text underneath is the texture */
      #mark { display: block; width: 100%; margin: 0; text-align: center; white-space: nowrap;
        font: 400 clamp(96px, 24vw, 380px)/0.84 Impact, "Haettenschweiler", "Arial Narrow", sans-serif; }`,
      pieces: `- \`three\` — one \`WebGLRenderer\` draws a ~5 k-vertex grid textured with the
  target's own text; the spring simulation uploads per-vertex displacement each
  frame and the fragment shader blends three additive chroma passes (0.9 / 1.0 /
  1.1) for the red/cyan fringes.`,
    },
    options: [
      ["text", "target's text", "Text to draw — defaults to the target's own (trimmed) text."],
      ["font", "computed font", "CSS font shorthand for the drawn wordmark."],
      ["color", "computed colour", "Base colour — the host's own colour is hidden while mounted."],
      ["opacity", "`1`", "Overall opacity of the canvas."],
      ["outline", "`0`", "Stroke width, px — `0` is a filled wordmark."],
      ["tracking", "`0`", "Extra letter spacing, px."],
      ["drag", "`1`", "Pointer-velocity (\"drag\") term of the simulation."],
      ["push", "`0`", "Radial push — vertices flee the cursor while it sits still."],
      ["chroma", "`true`", "Red/cyan chromatic split while deforming."],
      ["segments", "`0`", "Horizontal grid columns — auto (≈10 px cells) when omitted."],
      ["dpr", "`2`", "Device-pixel-ratio cap."],
      ["z", "`1`", "Canvas stacking order."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "**Optional peer.** Imports from `@cosmictraveler002/anim-kit/three` — `three` is never a core dependency. Bundler: `npm i three`; CDN: the §2 import map serves the pinned build.",
      "**The host text is the texture**: one canvas draws the target's own letters and the host's colour goes transparent behind it — `destroy()` restores the colour it hid, so the real heading is the resting state.",
      "**Fixed 60 Hz simulation** — the spring lattice runs on an accumulator (max 4 steps per frame, a gap over 0.2 s counts as one step) so a backgrounded tab resumes where it left instead of exploding.",
      "**Off-screen it sleeps**: the ticker idles while the host is out of view and wakes on re-entry; a host resize re-fits the canvas without touching the sim.",
      "**Silent no-op ladder**: missing target → no-op; no `WebGLRenderingContext` (SSR, jsdom, WebGL disabled) → no-op *before* any context probe; renderer refused → no-op; reduced motion → nothing mounts, the real text simply stays. Nothing ever logs.",
      "`destroy()` stops the ticker + observers, disposes geometry/materials/renderer, removes the canvas and restores the host colour.",
    ],
  },
  {
    id: "coverflowWheel",
    title: "Coverflow wheel — arc-bent card carousel",
    summary:
      "Media cards ride a flattened vertical wheel: each card bends along the arc instead of staying a rigid plane, fronts face you bright while the backs show mirrored, dimmed and half-lit, every card carries a soft rim glow with blurred, feathered edges, and the strip dissolves into the floor below instead of ending on a hard edge. Drag to scrub the wheel, let go and it snaps to the nearest card — then keeps idling forward one slot at a time.",
    imports: ["coverflowWheel"],
    importsFrom: "@cosmictraveler002/anim-kit/three",
    markup: `<div id="deck"> <!-- position: relative; overflow: hidden -->
  <img alt="" src="card-01.jpg" />
  <img alt="" src="card-02.jpg" />
  <img alt="" src="card-03.jpg" />
  <!-- …two or more cards; each <img> keeps its own alt text… -->
</div>`,
    usage: `const wheel = coverflowWheel("#deck", {
  index: 0,       // first card on show (wraps)
  autoplay: true, // keep advancing on its own while idle
  idle: 5,        // seconds of stillness before the wheel moves on
  duration: 1.15, // goTo() tween, seconds — next()/prev() use 0.5
  margin: 0.1,    // gap between cards, as a fraction of one slot
  glow: 0.5,      // rim-glow intensity around every card, 0–1
  edgeBlur: 1,    // soft blurred + feathered card edges, 0–1
});

wheel.goTo(3); // jump to a card — wraps
wheel.next();  // one card on, arrow speed (0.5 s)
wheel.destroy();`,
    procedure: {
      style: `      /* the wheel: a box the canvas covers; the imgs lay it out until mount */
      #deck { position: relative; height: 60vh; overflow: hidden;
        background: linear-gradient(180deg, #1b2740 0%, #0d0d12 100%); }
      #deck img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }`,
      pieces: `- \`three\` — ONE \`WebGLRenderer\` for the whole wheel: a shared \`PlaneGeometry\`
  per card bent along the arc in the vertex shader, cover-cropped canvas
  textures from the host's own \`<img>\`s, and card backs that mirror, dim and
  bottom-fade the front texture in-shader — no second texture, no extra pass.`,
    },
    options: [
      ["index", "`0`", "First card on show (wraps)."],
      ["autoplay", "`true`", "Keep advancing on its own while idle (with a 1/8-slot lead-in creep)."],
      ["idle", "`5`", "Seconds of stillness before the wheel moves on."],
      ["duration", "`1.15`", "`goTo()` tween, seconds — `next()`/`prev()` use 0.5."],
      ["margin", "`0.1`", "Gap between cards, as a fraction of one slot (0 = cards touching)."],
      ["glow", "`0.5`", "Rim-glow intensity around every card, 0–1 (0 = hard flat cards)."],
      ["edgeBlur", "`1`", "Soft blurred + feathered card edges, 0–1 (0 = sharp edges)."],
      ["dpr", "`2`", "Device-pixel-ratio cap for the canvas."],
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "**Optional peer.** Imports from `@cosmictraveler002/anim-kit/three` — `three` is never a core dependency. Bundler: `npm i three`; CDN: the §2 import map serves the pinned build.",
      "**It returns a handle, not a destroy fn**: `goTo(i, duration?)` shows a card (wraps), `next()`/`prev()` step at arrow speed, `destroy()` tears down — and on a no-op handle every one of those calls is still safe.",
      "**Cards are the host's own `<img>`s** — cover-cropped into textures at mount; a failed decode drops that card (fewer than two survivors → inert). The images stay in the DOM, hidden, and `destroy()` brings them back along with every style + `data-ak-coverflow` it set.",
      "**Drag never gets stolen**: pointer capture keeps the gesture over the deck wherever the pointer is, native image-dragging is blocked so a card can't swallow the stream, and a release within 5 % of a slot commits to the neighbouring card — smaller drags spring back.",
      "**Backs are free** — the wheel's far half is the front texture mirrored, one mip blurrier, at half light, fading out into the strip below NDC −0.8.",
      "**Rim glow + soft edges** — the plane carries a glow band around the card image (brightest at the outline, rounded falloff) and every border blurs + feathers away instead of ending on a hard cut; `glow: 0` / `edgeBlur: 0` restore flat hard-edged cards.",
      "**Silent no-op ladder**: missing target / reduced motion → an inert handle; no `WebGLRenderingContext` / renderer refused / fewer than two images → inert. Nothing ever logs.",
      "`destroy()` kills the tween + ticker, disconnects the observers, removes the canvas and restores the images, host styles and dataset.",
    ],
  },];

/** id → rendered prompt text. */
export function promptsById() {
  return Object.fromEntries(PROMPT_ENTRIES.map((e) => [e.id, renderPrompt(e)]));
}

/** The JSON body served at GET /api/prompts. */
export function promptsPayload() {
  return {
    count: PROMPT_ENTRIES.length,
    // release pin — the docs page interpolates its CDN blocks from this, and
    // demo-smoke fails the build if package.json/README drift from it.
    version: CDN_VERSION,
    // release pin for the optional three peer (docs import map + asserts)
    threeVersion: THREE_VERSION,
    categories: TAXONOMY.map((c) => ({
      id: c.id,
      name: c.name,
      blurb: c.blurb,
      subcategories: c.subcategories.map((s) => ({ id: s.id, name: s.name, effects: s.effects })),
    })),
    prompts: PROMPT_ENTRIES.map((e) => ({
      id: e.id,
      title: e.title,
      summary: e.summary,
      ...classify(e.id),
      // structured fields — the docs page (demo/docs.js) renders these as
      // import/markup/usage/options/notes blocks alongside the rendered text.
      imports: e.imports,
      ...(e.importsFrom ? { importsFrom: e.importsFrom } : {}),
      markup: e.markup,
      usage: e.usage,
      options: e.options ?? [],
      notes: e.notes ?? [],
      text: renderPrompt(e),
    })),
  };
}
