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

/** Version-pinned CDN release that every prompt's procedure points at. */
const CDN_VERSION = "1.2.0";

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
      { id: "rolls", name: "Rolling text", effects: ["rollText"] },
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
    id: "loops",
    name: "Loops & marquees",
    blurb: "Continuous motion — tickers, infinite draggables, indicators.",
    subcategories: [
      { id: "marquees", name: "Marquees", effects: ["marquee"] },
      { id: "draggables", name: "Infinite draggables", effects: ["dragStrip"] },
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
  const { title, summary, imports, markup, usage, options = [], notes = [] } = entry;

  const out = [PREAMBLE(title, summary)];

  const cls = classify(entry.id);
  if (cls) out.push(`> **Category:** ${cls.categoryLabel} → ${cls.subcategoryLabel}\n`);

  out.push(`## 1. Markup\n\n\`\`\`html\n${markup.trim()}\n\`\`\`\n`);

  // Step 2: the copy-paste procedure — complete file from the CDN first,
  // then alternative loaders and the npm/bundler fallback.
  out.push(PROCEDURE_SECTION(title, imports, markup, usage));

  out.push(`## 3. Initialise\n\nRun this after the DOM is ready (and after fonts/images if it measures layout):\n\n\`\`\`js\n${usage.trim()}\n\`\`\`\n`);

  if (options.length) {
    out.push(`## 4. Options\n\n| Option | Default | Description |\n| --- | --- | --- |\n${options
      .map(([name, def, desc]) => `| \`${name}\` | ${def} | ${desc} |`)
      .join("\n")}\n`);
  }

  if (notes.length) {
    out.push(`## Notes\n\n${notes.map((n) => `- ${n}`).join("\n")}\n`);
  }

  out.push(EPILOGUE);
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
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "Call it **before** creating scroll effects so the first refresh sees the right scroller.",
      "The bridge uses the canonical recipe: `lenis.on('scroll', ScrollTrigger.update)`, `lenis.raf` driven from `gsap.ticker`, `ScrollTrigger.lagSmoothing(0)`.",
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
      ["force", "`false`", "Run even under `prefers-reduced-motion`."],
    ],
    notes: [
      "`destroy()` kills the tween and clears `transform` — media returns to its authored scale.",
      "Give media `object-fit: cover` inside a fixed box; the scale animates the element, not its intrinsic size.",
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
      "Position the tag with CSS (`position: fixed; opacity: 0`) — the effect animates it.",
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
];

/** id → rendered prompt text. */
export function promptsById() {
  return Object.fromEntries(PROMPT_ENTRIES.map((e) => [e.id, renderPrompt(e)]));
}

/** The JSON body served at GET /api/prompts. */
export function promptsPayload() {
  return {
    count: PROMPT_ENTRIES.length,
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
      text: renderPrompt(e),
    })),
  };
}
