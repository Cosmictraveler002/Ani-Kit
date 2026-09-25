# anim-kit

A modular, framework-agnostic animation library by
[kalakritico.in](https://kalakritico.in/) — GSAP + ScrollTrigger + Lenis
effects packaged as independent ES modules.

TypeScript source → compiled ESM + `.d.ts` output. No framework, no virtual DOM,
no components: every effect resolves plain DOM selectors, so it works with
**React, Vue, Next, Svelte, Astro or plain HTML**.

```ts
import { lineReveal, marquee, menuOverlay } from "@cosmictraveler002/anim-kit";

const destroy = lineReveal("[data-lines]", { mode: "scroll" });
// …later (route change, HMR, teardown):
destroy();
```

---

## Contents

- [Install](#install)
- [CDN usage](#cdn-usage)
- [Quick start](#quick-start)
- [The contract](#the-contract)
- [Smooth scroll](#smooth-scroll)
- [Effect categories](#effect-categories)
- [API](#api)
  - [Core](#core)
  - [Text animations](#text-animations)
  - [Scroll & media](#scroll--media)
  - [Loops & marquees](#loops--marquees)
  - [Buttons & links](#buttons--links)
  - [Navigation & overlays](#navigation--overlays)
  - [Intros & transitions](#intros--transitions)
  - [Logos & SVG](#logos--svg)
  - [Utilities](#utilities)
- [Styling](#styling)
- [Reduced motion](#reduced-motion)
- [Framework integration](#framework-integration)
- [Demo & tests](#demo--tests)
  - [Copy-prompt API](#copy-prompt-api)
- [Project structure](#project-structure)

---

## Install

```bash
npm install @cosmictraveler002/anim-kit
```

```ts
import { smoothScroll, horizontalScroll } from "@cosmictraveler002/anim-kit";
import "@cosmictraveler002/anim-kit/styles";   // companion stylesheet (plain .css, optional but recommended)
```

`anim-kit` ships **ESM only** with generated `.d.ts` declarations — no CJS
build, no runtime CSS-in-JS. `gsap` and `lenis` are regular `dependencies`,
so any bundler (Vite / Next / webpack / Remix) resolves them for you.

### From source (development)

```bash
git clone <this repo>
cd anim-kit
npm install
npm run build      # tsc → dist/ (ESM + .d.ts) + CSS copy + tsup standalone bundle
npm test           # build + unit smoke + demo wiring smoke
npm run demo       # visual demo on http://localhost:4321/demo/
```

### Subpath exports

Everything the `exports` map in `package.json` exposes (all paths resolve
inside the published tarball):

| Specifier | Resolves to | Use for |
|---|---|---|
| `@cosmictraveler002/anim-kit` | `dist/index.js` + `dist/index.d.ts` | the full barrel — 45 exports |
| `@cosmictraveler002/anim-kit/effects/<name>` | `dist/effects/<name>.js` + `.d.ts` | one effect in isolation (`marquee`, `lineReveal`, …) |
| `@cosmictraveler002/anim-kit/standalone` | `dist/anim-kit.standalone.js` (types → `index.d.ts`) | the self-contained bundle — same API |
| `@cosmictraveler002/anim-kit/styles` | `dist/styles/anim-kit.css` | untouched plain CSS |

```ts
import { marquee } from "@cosmictraveler002/anim-kit/effects/marquee";  // deep import, no barrel
import "@cosmictraveler002/anim-kit/styles";
```

TypeScript ≥ 4.7 with `moduleResolution: "bundler"` or `"node16"`/`"nodenext"`
resolves declarations through the same map — no `typesVersions` shim needed.

---

## CDN usage

No build step on the consumer's end: `dist/` is served as-is from the npm
tarball by any npm CDN. Every URL is **version-pinned** — npm versions are
immutable, so `@cosmictraveler002/anim-kit@1.2.0` always resolves to exactly that build, forever
(only a new version creates a new URL; nothing floats unless you ask for a
range).

### Option 1 — standalone bundle (simplest)

`dist/anim-kit.standalone.js` is a self-contained ESM bundle with `gsap` (+ the
plugins anim-kit uses) and `lenis` **inlined** — no import map, one URL, works
identically on jsDelivr and unpkg:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@cosmictraveler002/anim-kit@1.2.0/dist/styles/anim-kit.css" />

<script type="module">
  import {
    smoothScroll, lineReveal, marquee,
  } from "https://cdn.jsdelivr.net/npm/@cosmictraveler002/anim-kit@1.2.0/dist/anim-kit.standalone.js";

  smoothScroll();
  lineReveal("[data-lines]", { mode: "scroll" });
  marquee("[data-marquee-track]", { speed: 40 });
</script>
```

unpkg serves the same file: `https://unpkg.com/@cosmictraveler002/anim-kit@1.2.0/dist/anim-kit.standalone.js`

### Option 2 — jsDelivr `+esm`

jsDelivr bundles `anim-kit` with its dependencies on the fly (also immutable
per version):

```html
<script type="module">
  import { lineReveal } from "https://cdn.jsdelivr.net/npm/@cosmictraveler002/anim-kit@1.2.0/+esm";
</script>
```

### Option 3 — per-file ESM + import map (jsDelivr *and* unpkg)

The unbundled `dist/index.js` contains bare imports (`gsap`, `lenis`), so pin
them in an import map. This is the exact shape the [demo](#demo--tests) runs
locally, with CDN URLs — and the way to share one GSAP between anim-kit and
the rest of your page:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@cosmictraveler002/anim-kit@1.2.0/dist/styles/anim-kit.css" />

<script type="importmap">
  {
    "imports": {
      "@cosmictraveler002/anim-kit": "https://cdn.jsdelivr.net/npm/@cosmictraveler002/anim-kit@1.2.0/dist/index.js",
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
  import { smoothScroll, lineReveal } from "@cosmictraveler002/anim-kit";
  // per-effect deep imports work here too:
  // import { dragStrip } from "@cosmictraveler002/anim-kit/effects/dragStrip";
</script>
```

Swap the host for unpkg (`https://unpkg.com/@cosmictraveler002/anim-kit@1.2.0/dist/index.js`, …) —
the file layout is identical. GSAP subpaths are listed one by one because
import maps match specifiers literally: a trailing-slash prefix map would
produce extension-less URLs, which CDNs don't serve. The `gsap`/`lenis` pins
match `package-lock.json`.

### Version discipline — the pin must match the code

The pin is a contract between the URL and the importing code: a bundle older
than the names your code imports fails at **module instantiation**, before a
single line runs —

```text
SyntaxError: The requested module '…/anim-kit@<old-version>/dist/anim-kit.standalone.js'
does not provide an export named 'clipWipe'
```

On a page with a preloader that reads as **frozen on the loader**: the script
that would dismiss it never executed. Whenever a loader won't clear, open the
console first — an `… does not provide an export named 'X'` error is version
skew, not an effect bug.

Rules that keep it from happening:

- **Never hand-copy the demo or hand-edit CDN URLs.** Regenerate the
  deployable copy with `npm run sync:live` — it rewrites every pin from
  `CDN_VERSION` in `scripts/prompts.mjs`, the single source, and
  `demo-smoke` fails CI if `demo/`, `demo_live/` or this README drift from
  the release version.
- **On a release bump**, change `version` and `CDN_VERSION` together (the
  smoke enforces it); every copy prompt, the docs page and `demo_live/`
  follow automatically.
- **In your own project**, every CDN URL you ship must carry the *same*
  version — mixing a new JS pin with an old CSS pin (or vice versa) is the
  same bug in slow motion.

---

## Quick start

```html
<p data-lines>Every line of this paragraph is masked and slid up on scroll.</p>
<div class="ak-marquee">
  <div class="ak-marquee__viewport">
    <div class="ak-marquee__track" data-marquee-track data-dir="left">
      <span>Prink</span><span>Zerodha</span><span>Superyou</span>
    </div>
  </div>
</div>
```

```js
import { smoothScroll, lineReveal, marquee, compose } from "@cosmictraveler002/anim-kit";

const scroller = smoothScroll({ lerp: 0.08, smoothWheel: true });

const teardown = compose(
  scroller.destroy,
  lineReveal("[data-lines]", { mode: "scroll" }),
  marquee("[data-marquee-track]", { speed: 40 }),
);

window.addEventListener("pagehide", () => teardown(), { once: true });
```

---

## The contract

Every effect follows one shape:

```ts
effect(target, options) => destroy
```

- **`target`** — anything assignable to `TargetLike`: a selector `string`, an
  `Element`, an array of elements, a `NodeList`, or `null`/`undefined`.
- **`options`** — a plain object of documented, defaulted fields. Every options
  object also accepts `force?: boolean` (see [Reduced motion](#reduced-motion)).
- **`destroy`** — a `() => void` that kills tweens/ScrollTriggers (paused
  springs included), removes listeners and clones, restores the original
  markup, and reverts the inline styles the effect overwrote. Always safe to
  call once; call it on teardown.

A handful of effects need more than a destroy function and return a **handle**
instead — those handles still expose `.destroy()`:

| Effect          | Handle                                       |
| --------------- | -------------------------------------------- |
| `smoothScroll`  | `{ lenis, scrollTo, active, destroy }`       |
| `menuOverlay`   | `{ open, close, toggle, isOpen, destroy }`    |
| `themeReveal`   | `{ set, toggle, current, destroy }`           |
| `audioBars`     | `{ start, stop, destroy }`                    |

**Missing targets never throw.** If nothing matches, the effect returns an
immediate no-op destroy — safe to call during progressive enhancement.

`initGSAP()` runs automatically inside every effect (registration is
idempotent), but you can call it yourself if you want `gsap`/`ScrollTrigger`
configured before first paint.

---

## Smooth scroll

Lenis is wired to ScrollTrigger the canonical way: Lenis drives the scroll,
`lenis.on("scroll", ScrollTrigger.update)` keeps triggers in sync, `lenis.raf`
is ticked from `gsap.ticker`, and `lagSmoothing(0)` is disabled.

```ts
const scroller = smoothScroll({
  lerp: 0.08,          // interpolation factor (default) — lower = floatier
  smoothWheel: true,   // default
  smoothTouch: false,  // default; true fights native touch scrolling
  orientation: "vertical",
  initialScroll: 0,
  useScrollerProxy: false, // opt-in scrollerProxy for nested scrollers
});

scroller.scrollTo("#work", { duration: 1.2 }); // programmatic, smoothed
scroller.active;   // false when Lenis was skipped (e.g. reduced motion)
scroller.destroy();
```

Call it **before** creating scroll effects so the first refresh sees the right
scroller. When motion is reduced, `smoothScroll` stays inert and native
scrolling is left alone.

---

## Effect categories

Every effect belongs to exactly one **category → subcategory** slot. The tree
below is the library's map: it orders this API reference, groups the demo's
prompt dock, and backs the `category` / `subcategory` fields on
`GET /api/prompts`.

| Category | Subcategory | Effects |
| --- | --- | --- |
| Core & setup | Smooth scrolling | `smoothScroll` |
| Text animations | Line & mask reveals | `lineReveal`, `maskReveal` |
| Text animations | Per-character scatter | `scatterText` |
| Text animations | Decode & scramble | `scrambleText` |
| Text animations | Rolling text | `rollText` |
| Text animations | Counters | `counter` |
| Text animations | Layout transfers | `flipWords` |
| Scroll & media | Pinned galleries | `horizontalScroll`, `stackedCards`, `stackedCardsPinned` |
| Scroll & media | Parallax & depth | `parallax` |
| Scroll & media | Heroes & media | `heroShrink`, `mediaSettle` |
| Scroll & media | Enter reveals | `revealRule`, `unfoldReveal`, `clipWipe` |
| Loops & marquees | Marquees | `marquee` |
| Loops & marquees | Infinite draggables | `dragStrip` |
| Loops & marquees | Equalizers | `audioBars` |
| Buttons & links | Liquid fills | `liquidButton` |
| Buttons & links | Underlines | `underlineLink` |
| Buttons & links | Magnetic hover | `magnetic` |
| Navigation & overlays | Menus & nav | `navHide`, `menuOverlay` |
| Navigation & overlays | Cursors | `cursorFollower` |
| Intros & transitions | Preloaders | `preloader` |
| Intros & transitions | Theme wipes | `themeReveal` |
| Logos & SVG | Path reveals | `logoReveal` |

**Growing the library:** a subcategory is the slot sibling effects land in —
add the id to `TAXONOMY` in `scripts/prompts.mjs`, export the effect from
`src/index.ts`, and give it a prompt entry. The demo smoke fails when an
effect is unclassified, classified twice, or the tree references an effect
that does not exist.

---
## API

### Core

#### `initGSAP()`

Registers the plugins anim-kit relies on (`ScrollTrigger`, `SplitText`,
`Draggable`, `CustomEase`, `Flip`, `ScrollSmoother`) and the studio's custom eases.
Idempotent; called for you by every effect.

#### `EASES`

```ts
EASES.curtain    // "ak-curtain"     .76,0,.24,1   — menu curtain, panel wipes
EASES.cardStack  // "ak-card-stack"  SVG cubic bezier — cascading card deck
EASES.reveal     // "ak-reveal"      .165,.84,.44,1 — mask/rule reveals
EASES.preloadOut // "ak-preload-out" .895,.03,.685,.22 — preloader exit
```

Use them anywhere GSAP accepts an ease: `gsap.to(el, { ease: EASES.curtain })`.

#### `split(target, options) => { elements, revert }`

Text splitting with a dependency-free fallback if `SplitText` is unavailable.

```ts
const { elements, revert } = split("h1", {
  type: "lines",          // "chars" | "words" | "lines" (or an array)
  mask: true,             // wrap each line in an overflow-hidden mask
  linesClass: "ak-line++",// "++" is replaced by the index
  lineThreshold: 0.05,    // ignore lines shorter than 5% of the container
});
revert(); // restores the original markup exactly
```

#### `guard(options, run) => destroy`

Central reduced-motion gate. If the user prefers reduced motion and
`options.force` is not set, it returns a no-op destroy; otherwise it runs
`run()`. Every effect goes through it.

---

### Text animations

Typography in motion — masked lines, rising masks, per-character scatter,
decode reveals, rolling words, tickers, layout transfers.

#### `lineReveal(target, options?) => destroy`

Splits text into masked lines and staggers them up. The signature reveal of the
source site.

```ts
lineReveal("[data-hero-text]", { mode: "immediate", delay: 0.35 }); // above the fold
lineReveal("[data-lines]", { mode: "scroll" });                     // reverses on leave
lineReveal("[data-headline]", { split: "chars", stagger: 0.03 });    // per-character rise
```

| Option    | Default         | Notes                                   |
| --------- | --------------- | --------------------------------------- |
| `mode`    | `"scroll"`      | `"scroll"` or `"immediate"`             |
| `split`   | `"lines"`       | `"lines"` or `"chars"` (per-character masked rise) |
| `stagger` | `0.1`           | seconds between lines (`0.03` for chars) |
| `duration`| `1`             | seconds                                 |
| `ease`    | `"power4.out"`  |                                         |
| `delay`   | `0`             | seconds                                 |
| `start`   | `"top 90%"`     | ScrollTrigger start                     |
| `end`     | `"bottom 10%"`  | ScrollTrigger end                       |

**DOM:** any block of text — headings with `<br>` hard breaks work. Produces
`.ak-line-mask > .ak-line` per line (or `.ak-char-mask > .ak-char` with
`split: "chars"`); `destroy()` restores the original HTML.

#### `maskReveal(target, options?) => destroy`

Inline `overflow:hidden` heading reveal: the inner span rises from below the
mask and settles.

```html
<h2>
  <span class="ak-mask"><span class="ak-mask__inner" data-mask>Text that</span></span>
  <span class="ak-mask"><span class="ak-mask__inner" data-mask>rises into view.</span></span>
</h2>
```

```ts
maskReveal("[data-mask]"); // siblings inside one parent stagger together
```

| Option    | Default          |
| --------- | ---------------- |
| `from` / `to` | `"100%"` / `"0%"` |
| `duration`| `0.5`            |
| `ease`    | `EASES.reveal`   |
| `stagger` | `0.1`            |
| `delay`   | `0`              |
| `start` / `end` | `"top 90%"` / `"bottom 10%"` |
| `mode`    | `"scroll"` — or `"immediate"` to play at once |

#### `scatterText(wrap, options?) => destroy`

The giant pinned band ("So, are you ready to Stand out?"): the line scrolls
horizontally while each character starts at a random `yPercent`/rotation and
settles as it crosses the viewport.

```ts
scatterText("[data-scatter-pin]", {
  line: "[data-scatter]",
  pinTarget: "[data-scatter-pin]",
  granularity: "chars",   // or "words"
  scatterY: 60,           // ±60% of line height
  scatterRotation: 15,    // ±15°
  scrub: 0.5,
  settleStart: "left 100%",
  settleEnd: "left 15%",
});
```

**DOM:** `.ak-char` / `.ak-space` spans are generated for you (and removed on
`destroy()`). Line measurement waits for `document.fonts.ready` so travel
distance is correct with webfonts.

#### `scrambleText(target, options?) => destroy`

The decode / cipher reveal: each character churns through the charset and
settles on its final glyph, left to right. Letters scramble; digits,
punctuation and spaces stay put; case is preserved.

```ts
scrambleText("[data-scramble]");                                   // once, on enter
scrambleText("[data-headline]", { mode: "immediate", delay: 0.2 }); // right away
scrambleText(".nav-link", { mode: "hover", durationPerChar: 0.12 }); // on hover
```

| Option | Default | Notes |
| --- | --- | --- |
| `mode` | `"scroll"` | `"scroll"` (once on enter), `"immediate"`, or `"hover"` (re-scrambles on pointerenter) |
| `charset` | `"abcdefghijklmnopqrstuvwxyz"` | glyphs letters churn through |
| `durationPerChar` | `0.18` | seconds each character scrambles |
| `stagger` | `0.04` | seconds between character starts |
| `delay` | `0` | seconds before the timeline starts |
| `start` | `"top 80%"` | ScrollTrigger start (`mode: "scroll"`) |

**DOM:** plain-text elements only — the effect rewrites `textContent` while
scrambling and restores the original exactly on `destroy()`.

#### `rollText(target, options?) => destroy`

The rolling word rotator: two or more rows stacked into a hidden overflow box
one row tall, rolling to the next on an interval. The first row is cloned at
the end so the wrap is seamless (same trick as `marquee()`).

```html
<span class="ak-roll" data-roll>
  <span>Design</span><span>Build</span><span>Motion</span>
</span>
```

```ts
rollText("[data-roll]", { interval: 2.2, duration: 0.6 });
rollText("[data-roll-rev]", { direction: "down" }); // walk rows in reverse
```

| Option | Default | Notes |
| --- | --- | --- |
| `interval` | `2.2` | seconds each row is shown (including the roll) |
| `duration` | `0.6` | roll duration, seconds |
| `ease` | `"power4.inOut"` | GSAP ease for the roll |
| `direction` | `"up"` | `"up"` or `"down"` |

**DOM:** rows are direct children of the target; the effect stacks them as
blocks itself. `destroy()` unwraps the rows, removes the clone and restores
every inline style — markup comes back byte-identical.

#### `flipWords(target, { to }, options?) => destroy`

Words measured in one layout, moved into another and animated from where
they stood — the FLIP technique: a column of words fans out into a row,
driven by scroll progress or played once.

```ts
// Both blocks share one grid cell so the stage never reflows mid-flight:
flipWords("[data-flip-from]", { to: "[data-flip-to]", scrub: 0.6 });

// One-shot on enter (reverses on leave-back), or immediately:
flipWords("[data-flip-from]", { to: "[data-flip-to]", mode: "scroll" });
```

| Option | Default | Notes |
| --- | --- | --- |
| `to` | — (required) | destination block; every word is moved into it |
| `words` | source children | `[data-flip-word]` matches, else the source's element children |
| `duration` | `1.4` | seconds for one word's travel |
| `ease` | `"power4.inOut"` | GSAP ease |
| `stagger` | `0.2` | seconds between word starts |
| `scale` | `0.2` | mid-flight squash each word pops through (`0` disables) |
| `mode` | `"scroll"` | or `"immediate"` to play at once |
| `scrub` | unset | number = scrub smoothing seconds, `true` = immediate |
| `start / end` | `"top 75%"` / `"bottom 45%"` | ScrollTrigger positions |

**DOM:** put the source and destination blocks in the same grid cell
(`grid-area: 1 / 1`, a `min-height` on both keeps the stage stable). The words
live in the destination from init but render at their source positions until
the timeline runs, so scrubbing reverses perfectly. `destroy()` kills the
timeline, puts every word back in its original parent and restores the
inline transform.

#### `counter(target, options?) => destroy`

Tabular number ticker.

```ts
counter("[data-count]", { to: 240, duration: 3, suffix: "+" });
counter("[data-count-scroll]", { to: 98, onScroll: true });          // waits for view
counter("[data-count-pad]", { to: 42, pad: 3 });                     // 000 → 042
counter("[data-progress]", { progress: true, pad: 2, suffix: "%" }); // scrubs 00% → 100%
```

| Option       | Default        |
| ------------ | -------------- |
| `from` / `to`| `0` / `100`    |
| `duration`   | `4`            |
| `ease`       | `"power1.inOut"` |
| `pad`        | `0` (none)     |
| `suffix`     | `""`           |
| `onScroll`   | `false`        |
| `progress`   | `false` — scrub the value from scroll progress instead of a timed tween |
| `start` / `end` | `"top 90%"` / `"bottom top"` — ScrollTrigger positions (`end` with `progress`) |
| `onComplete` | `(value) => {}` |

---

### Scroll & media

Scroll-driven storytelling — enter reveals, depth, pinned galleries, hero media.

#### `revealRule(target, options?) => destroy`

The thin rule that draws itself to full width.

```ts
revealRule("[data-rule]", { duration: 1, delay: 0.2 }); // default ease: EASES.reveal
```

**DOM:** any element that should animate `width: 0 → 100%` when it enters.

#### `unfoldReveal(target, options?) => destroy`

Blocks that grow open from an edge: `scaleY: 0 → 1` from the top (or bottom)
for a vertical unfold, `scaleX: 0 → 1` from the left for a horizontal one —
targets stagger together off the first match's trigger.

```ts
unfoldReveal("[data-unfold]", { axis: "y", origin: "top" });
unfoldReveal("[data-unfold-x]", { axis: "x", origin: "left", duration: 1.2 });
```

| Option | Default | Notes |
| --- | --- | --- |
| `axis` | `"y"` | `"y"` → `scaleY`, `"x"` → `scaleX` |
| `origin` | `"top"` / `"left"` | `transformOrigin`, defaults per axis |
| `duration` | `0.7` | seconds |
| `ease` | `"power3.out"` | GSAP ease |
| `stagger` | `0.08` | seconds between targets |
| `delay` | `0` | seconds |
| `mode` | `"scroll"` | or `"immediate"` to play at once |
| `start` | `"top 85%"` | ScrollTrigger start |
| `replay` | `false` | re-unfold when leaving / re-entering |

`destroy()` clears `transform` + `transform-origin`, so elements rest exactly
as authored.

#### `clipWipe(target, options?) => destroy`

A `clip-path: inset()` reveal: the element is collapsed behind one edge,
corner (or inside a frame margin) and the inset animates to zero so it wipes
into view.

```ts
clipWipe("[data-clip]", { from: "left" });                    // inset(0 100% 0 0) → 0
clipWipe("[data-frame]", { from: "frame", inset: 12 });       // opens out of a frame
clipWipe("[data-corner]", { from: "bottom-right" });          // opens toward the opposite corner
clipWipe("[data-scrub]", { from: "frame", scrub: 0.5 });      // bound to scroll progress
```

| Option | Default | Notes |
| --- | --- | --- |
| `from` | `"left"` | `"left"` / `"right"` / `"top"` / `"bottom"`, a corner (`"top-left"` / `"top-right"` / `"bottom-left"` / `"bottom-right"`), or `"frame"` |
| `inset` | `15` | frame margin in % (`from: "frame"`) |
| `duration` | `1` | seconds |
| `ease` | `"power3.out"` | GSAP ease |
| `stagger` | `0.08` | seconds between targets |
| `mode` | `"scroll"` | or `"immediate"` to play at once |
| `start` | `"top 85%"` | ScrollTrigger start |
| `end` | `"top 20%"` | ScrollTrigger end (scrub mode) |
| `scrub` | unset | number = scrub smoothing seconds, `true` = immediate: tie the wipe to scroll progress |
| `replay` | `false` | re-wipe when leaving / re-entering |

Works on images, video, blocks and text. `destroy()` removes the inline
`clip-path`, restoring the authored (visible) state.

#### `parallax(target, options?) => destroy`

`data-speed` parallax over everything inside `target`.

```html
<img data-speed="-0.5" src="…" />  <!-- slower than scroll -->
<img data-speed="0.8"  src="…" />  <!-- faster than scroll -->
```

```ts
parallax("[data-parallax]", {
  attribute: "data-speed",
  scale: 50,            // yPercent multiplier
  start: "50% bottom",
  end: "bottom top",
});
```

Each element tweens `yPercent: value × scale` with `scrub: true` and
`ease: "none"` — so `data-speed="0.8"` settles at `yPercent: 40`; negative
speeds drift up against the scroll.

#### `horizontalScroll(track, options?) => destroy`

Pinned horizontal gallery; panel images get a secondary parallax driven by
`containerAnimation`, so they settle as they cross the viewport *horizontally*.

```ts
horizontalScroll("[data-htrack]", {
  section: "[data-hsection]",   // pinned trigger (defaults to track's <section>)
  panelImage: "[data-speed-img]", // extra parallax selector, null to disable
  scrub: 0.5,
  imageScrub: 0.2,
  travel: () => 1500,           // override the default scrollWidth − innerWidth
});
```

**DOM:**

```html
<section data-hsection>
  <div class="h-track" data-htrack>          <!-- width: max-content -->
    <div class="h-panel">…<img data-speed-img></div> × N
  </div>
</section>
```

#### `stackedCards(wrap, options?) => destroy`

Pinned card deck — cards cascade with the `ak-card-stack` bezier.

```ts
stackedCards("[data-stack-wrap]", {
  viewport: "[data-stack-viewport]", // defaults to wrap's first child
  card: ".ak-card",
  scrub: 0.5,
  stagger: 0.12,
  ease: EASES.cardStack,
});
```

**DOM:** a tall wrapper (e.g. `height: 500vh`) containing a sticky viewport that
holds the cards:

```html
<div class="stack-wrap" data-stack-wrap>       <!-- tall scroll runway -->
  <div class="stack-viewport" data-stack-viewport>  <!-- position: sticky; top: 0 -->
    <div class="stack-cards">
      <a class="ak-card">01 …</a> × N
    </div>
  </div>
</div>
```

#### `stackedCardsPinned(wrap, { viewport, … }) => destroy`

Same deck for when the sticky viewport is a **sibling** rather than a child —
pins `viewport` with `pinSpacing: false` across `wrap`'s scroll length.
`viewport` is required here.

#### `heroShrink(target, options?) => destroy`

Hero media that scales down and drifts as it scrolls away.

```ts
heroShrink("[data-hero-media]", { offsetY: "49vh", scale: 0.23, scrub: 1 });
// options: offsetX "0px", start "top top", end "bottom top"
```

#### `mediaSettle(target, options?) => destroy`

Images and video that arrive slightly oversized and ease down to size as the
section enters — content lands instead of popping in. Set `scrub` to bind the
settle to scroll progress, or `replay: true` to reverse back to `from` on
leave-back and replay on every re-enter.

```ts
mediaSettle("[data-settle]", { from: 1.15, duration: 1.5 });  // on enter
mediaSettle("[data-settle-scrub]", { scrub: 0.5, from: 1.2 }); // scroll-bound
```

| Option | Default | Notes |
| --- | --- | --- |
| `from` | `1.15` | starting scale — settles down to 1 |
| `duration` | `1.5` | seconds (enter mode) |
| `ease` | `"power2.out"` | GSAP ease (enter mode) |
| `origin` | `"center"` | `transformOrigin` |
| `stagger` | `0.06` | seconds between targets |
| `mode` | `"scroll"` | or `"immediate"` to play at once |
| `start` / `end` | `"top 75%"` / `"bottom top"` | ScrollTrigger positions |
| `scrub` | unset | number = scrub smoothing seconds, `true` = immediate |
| `replay` | `false` | re-settle when leaving / re-entering (enter mode) |

`destroy()` clears `transform` — media returns to its authored scale. Unlike
`heroShrink()` (which scrubs media down as it *leaves*), `mediaSettle()` plays
the entrance.

---

### Loops & marquees

Continuous motion — marquees, infinite draggables, equaliser bars.

#### `marquee(track, options?) => destroy`

Dual-row constant-speed marquee driven by `requestAnimationFrame` — 40 px/s,
matching the source site.

```ts
marquee("[data-marquee-track]", { speed: 40, direction: "left", pauseOnHover: false });
```

| Option         | Default | Notes                                             |
| -------------- | ------- | ------------------------------------------------- |
| `speed`        | `40`    | pixels per second                                 |
| `direction`    | `data-dir` | `"left"` / `"right"`; otherwise read from `data-dir` |
| `clone`        | `true`  | duplicate content when it isn't already doubled   |
| `pauseOnHover` | `false` |                                                 |

**DOM:** a flex track of `width: max-content` inside an
`overflow: hidden` viewport. Tracks are found by the `[data-marquee-track]`
marker (pass one track, or a container and every track inside it is picked up);
`data-dir="left|right"` sets each row's direction. The `.ak-marquee*` classes
in the companion stylesheet provide the viewport and its edge masks. `destroy()`
stops the rAF loop and removes the copy it duplicated (flag + children), so the
markup matches what you started with — a copy you tiled yourself is left alone.

#### `dragStrip(track, options?) => destroy`

Infinite draggable carousel (GSAP `Draggable`), with items tilting as you pull
and springing straight on release.

```ts
dragStrip("[data-drag]", { maxRotation: 60, rotationScale: 120, settleDuration: 1, inertia: false, clone: true, item: ":scope > *" });
```

| Option           | Default         | Notes                                                   |
| ---------------- | --------------- | ------------------------------------------------------- |
| `maxRotation`    | `100`           | max tilt in degrees at full drag speed                  |
| `rotationScale`  | `100`           | divisor on the normalised drag speed — higher is subtler |
| `settleDuration` | `1`             | spring-back duration on release, seconds                |
| `inertia`        | `false`         | throw after release — requires GSAP's `InertiaPlugin`   |
| `clone`          | `true`          | duplicate content for a seamless loop; `false` clamps   |
| `item`           | `":scope > *"`  | items inside the strip that tilt                        |

**How the loop works.** Draggable is the *single writer* of the track's X
transform — a `liveSnap` hook folds every position back into `[-loop, 0]`
(Draggable has no `modifiers` option; `liveSnap` is the supported place), so
dragging is 1:1 with the pointer and never stutters between a tween and the
drag. Folding is only invisible when the content tiles: with `clone: true`
the strip duplicates itself until one tile is at least as wide as the
viewport, and `loop` is always a whole multiple of the tile width — the same
trick `marquee()` uses, so the seam is invisible. With `clone: false` there is
nothing to fold against, so the strip clamps at the content edges instead
(finite, but never an empty gap). During an inertia throw, `liveSnap` keeps
folding each frame while the end target stays raw, so momentum keeps its
direction.

**Rotation** tracks pointer *speed* (normalised to a 60 fps frame so mouse
and touch event rates feel the same) rather than a raw per-event delta, and is
driven by two `quickTo` tweens: a fast follow during the drag, then a
`settleDuration` spring on release. `destroy()` kills both tweens and the
Draggable, removes the cloned tiles and restores the element's inline
cursor/user-select/touch-action.

**DOM:** an `overflow: hidden` viewport wrapping a flex track of
`width: max-content` (the effect sets `cursor: grab`, `user-select: none` and
`touch-action: pan-y` inline and restores them on destroy); items keep
`transform-origin: 50% 100%` so they pivot from their base.

#### `audioBars(target, options?) => handle`

Equaliser visualiser — returns `{ start, stop, destroy }`.

```ts
const eq = audioBars("[data-eq]", { interval: 100, minHeight: 4, maxHeight: 16, bounce: 0.75, bar: ":scope > *" });
eq.start();  // animate
eq.stop();   // hold
eq.destroy();
```

**DOM:** a row of `<i>` bars — `.ak-eq` in the companion stylesheet. `destroy()`
clears the interval, kills in-flight bar tweens (otherwise their next frame
would rewrite `height` *after* teardown) and clears the inline height.

---

### Buttons & links

Hover affordances for CTAs and inline links — fills, underlines, magnetic pulls.

#### `liquidButton(target, options?) => destroy`

SVG wave floods the button on hover.

```ts
liquidButton("[data-liquid]", { direction: "up", duration: 900, fill: "var(--ak-primary)", labelColor: "#fff" });
```

**DOM:** the `.ak-liquid` structure (the stylesheet defines the classes; the
wave path shape is yours to choose):

```html
<button class="ak-liquid" data-liquid>
  <svg class="ak-liquid__wave" viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d="M0,30 Q50,-5 100,30 L100,100 L0,100 Z" />
  </svg>
  <span class="ak-liquid__label">Lets Talk →</span>
</button>
```

The effect stamps each element with `data-ak-liquid="up|down"` plus the
`--ak-liquid-duration/fill/label` CSS variables (and removes them on destroy).
Because `direction` applies to every matched element, scope the call for buttons
that should fill the other way:

```ts
liquidButton("[data-liquid]", { direction: "up" });
liquidButton('[data-liquid][data-dir="down"]', { direction: "down" });
```

#### `underlineLink(target) => destroy`

Underline sweep for links — matches `a.ak-underline`.

```ts
underlineLink("a.ak-underline");   // or any link list
```

Pure CSS under the hood — it just adds/removes the `.ak-underline` class whose
`::after` sweep is styled by the companion stylesheet, and `destroy()` removes
the class again.

#### `magnetic(target, options?) => destroy`

Buttons and links that lean toward the pointer while hovered — following a
fraction of the pull with a tilt — then spring back to rest with an elastic
snap on leave.

```ts
magnetic("[data-magnet]", { strength: 0.5, rotation: 10, scale: 1.04 });
```

| Option | Default | Notes |
| --- | --- | --- |
| `strength` | `0.4` | how far the element follows the pointer — fraction of its own box |
| `rotation` | `8` | max tilt in degrees at full pull (`0` disables) |
| `scale` | `1` | scale held while the pointer is over the element (`1` = none) |
| `duration` | `1.2` | spring-back duration, seconds |
| `ease` | `"elastic.out(1, 0.35)"` | spring-back ease |

**DOM:** pass a list (selector, array, NodeList) — each element gets its own
listeners and its own pull. Keep CSS transitions off `transform` for magnetic
elements (GSAP animates transform directly). `destroy()` removes the
listeners, kills in-flight tweens and restores the inline transform.

---

### Navigation & overlays

Page chrome — header behaviour, fullscreen menu, cursor.

#### `navHide(nav, options?) => destroy`

Header that hides on scroll-down and returns on scroll-up.

```ts
navHide("[data-nav]", { threshold: 200, hideY: -100, mobileBreakpoint: 768, startHidden: true });
```

`destroy()` removes the scroll listener, kills any in-flight slide and clears
the nav's transform — it never starts a *new* animation during teardown.

#### `menuOverlay(options) => handle`

Full-screen curtain menu — clip-path polygon expands from the bottom edge,
links stagger in.

```ts
const menu = menuOverlay({
  overlay: "[data-menu]",                          // required
  openTrigger: "[data-menu-open], [data-menu-open-2]",
  closeTrigger: "[data-menu-close]",
  nav: "[data-nav]",                               // slides away while open
  link: ".menu-link a",                            // default
  chrome: "[data-menu-chrome]",                    // default
  duration: 1,
  stagger: 0.1,
  initialOpen: false,
  onOpen: () => {}, onClose: () => {},
});

menu.open(); menu.close(); menu.toggle(); menu.isOpen(); menu.destroy();
```

Curtain uses `EASES.curtain` (`.76,0,.24,1`).

#### `cursorFollower(zone, options?) => destroy`

Spring-followed cursor tag, e.g. "▶ Play Showreel" over a video. The tag is
pinned `position: fixed` and driven in viewport space (`clientX/Y + offset`),
so it can live anywhere in the DOM — it only reacts while the pointer is over
the zone. Style it with `opacity: 0` and light text (`color: #fff`): the
`exclusion` blend inverts the tag against whatever is behind it, which only
reads with a light source colour.

```ts
cursorFollower("[data-showreel]", {
  follower: "[data-cursor]",           // defaults to the first [data-cursor]
  offset: 14,
  spring: { mass: 0.1, stiffness: 120 },
  blendMode: "exclusion",
  fade: true,                          // fade in/out with the pointer
});
```

`destroy()` kills both spring tweens (they are paused at creation and would
otherwise live on the global timeline forever) plus any in-flight fade, removes
the listeners, and restores the inline styles it overwrote.

---

### Intros & transitions

Entrance and theme-change moments.

#### `preloader(target, options?) => destroy`

The 0→100 intro: counter ticks up while an SVG glyph fills via `inset()`
clip-path, then the glyph scales up and the backdrop fades.

```ts
preloader("[data-preloader]", {
  glyph: "[data-glyph]",        // defaults to the first <svg> inside the root
  counter: "[data-counter]",    // defaults to [data-counter] inside the root
  backdrop: "[data-backdrop]",  // defaults to [data-backdrop] inside the root
  duration: 4,                  // seconds
  step: 5,                      // increment per tick
  interval: 200,                // ms
  sessionGuard: true,           // skip when already shown this session
  storageKey: "ak-preloader-shown",
  onComplete: () => {},
});

// Options-object form also works:
preloader({ root: "#preloader", sessionGuard: false });
```

`destroy()` clears the timers and kills the tweens.

#### `themeReveal(options?) => handle`

Light/dark toggle with a circular **View Transitions** wipe (graceful fallback
to an instant swap when the API is missing).

```ts
const theme = themeReveal({
  toggle: "[data-theme]",
  storageKey: "ak-theme",
  initial: "dark",          // defaults to <html>'s current class
  origin: "50% 50%",        // or an element to centre the circle on
  duration: 1,
  onChange: (t) => {},
});

theme.set("dark"); theme.toggle(); theme.current(); theme.destroy();
```

---

### Logos & SVG

Vector reveals for brand marks.

#### `logoReveal(svg, options?) => destroy`

SVG wordmark assembling letter by letter (staggered `yPercent` + fade).

```ts
logoReveal("[data-logo]", { path: ".svg-anim-path", stagger: 0.05, once: false });
// defaults: duration 1, ease "power2.out", start "top 80%", end "bottom top"
```

**DOM:** `<svg data-logo>` containing paths matching
`[data-logo-path], .svg-anim-path`.

---

### Utilities

```ts
toArray(target, scope?)        // resolve TargetLike → Element[]
one(target, scope?)            // resolve TargetLike → first Element | null
onReady(fn)                    // run after DOMContentLoaded (or immediately)
compose(...fns)                // combine destroy fns → one destroy (skips holes)
raf(fn)                        // rAF loop → returns a stop function
prefersReducedMotion()         // boolean, honours matchMedia
```

Types: `TargetLike`, `Destroy`, `CommonOptions`.

---

## Styling

```ts
import "@cosmictraveler002/anim-kit/styles";   // → dist/styles/anim-kit.css
```

The companion stylesheet supplies:

- **Design tokens:** `--ak-primary`, `--ak-curtain`, `--ak-reveal`, `--ak-out`
- **Text masks:** `.ak-line-mask`, `.ak-line`, `.ak-char-mask`, `.ak-char`, `.ak-word`, `.ak-space`
- **Heading masks:** `.ak-mask`, `.ak-mask__inner`
- **Rolling text:** `.ak-roll`, `.ak-roll__inner`
- **Liquid button:** `.ak-liquid`, `.ak-liquid__wave`, `.ak-liquid__label`
- **Underline:** `.ak-underline`
- **Marquee:** `.ak-marquee`, `.ak-marquee__viewport`, `.ak-marquee__track`
- **Drag strip:** `.ak-drag-track`
- **Menu:** `.menu-overlay`, `.menu-overlay-bar`, `.menu-link`
- **Card deck:** `.ak-stack-viewport`, `.ak-stack-cards`, `.ak-card`
- **Misc:** `.ak-counter`, `.ak-eq`

Override the tokens to rebrand:

```css
:root {
  --ak-primary: #ff5c39;
  --ak-curtain: cubic-bezier(0.76, 0, 0.24, 1);
}
```

Effects only touch inline styles/transforms; the layout classes above are the
resting states (safe with reduced motion).

---

## Reduced motion

Everything routes through `guard()`:

- With `prefers-reduced-motion: reduce`, effects do **not** animate — they snap
  to a safe resting state (e.g. `preloader` hides the overlay, `menuOverlay`
  leaves the curtain collapsed, `smoothScroll` stays inert).
- Opt a single call out with `force: true`:

```ts
lineReveal("h1", { force: true });   // animate regardless
```

Keyboard focus styles (`.ak-liquid:focus-visible`, `.ak-underline:focus-visible`)
are preserved by the stylesheet.

---

## Framework integration

Because each effect is `target + options → destroy`, wiring is mechanical.

**React**

```tsx
useEffect(() => {
  const destroy = lineReveal(ref.current, { mode: "scroll" });
  return destroy;            // runs on unmount / StrictMode double-invoke
}, []);
```

**Vue**

```ts
onMounted(() => (destroy = marquee("[data-marquee-track]", { speed: 40 })));
onBeforeUnmount(() => destroy?.());
```

**Svelte**

```svelte
<script lang="ts">
  import { onMount } from "svelte";
  onMount(() => parallax("[data-parallax]")); // returned fn runs on destroy
</script>
```

**Next.js (App Router)** — effects touch `window`, so create them in
`useEffect`; never at module scope.

Mount effects **after** content is in the DOM (and after fonts/images if the
effect measures — `scatterText` waits for `document.fonts.ready` itself), then
destroy on teardown. Route changes and HMR are why `destroy()` exists.

---

## Demo & tests

```bash
npm run build     # tsc → dist/ (ESM + .d.ts) + CSS copy + tsup standalone bundle
npm run demo      # static server on http://localhost:4321/demo/
npm run sync:live # regenerate demo_live/ (static deploy) from demo/
npm test          # build + unit smoke + demo integration smoke
npm run smoke     # both smokes (expects dist/ to exist)
npm run typecheck # tsc --noEmit (what CI runs)
```

The demo page wires the whole effect set against one document —
`demo/index.html` + `demo/demo.js` — and every effect in the catalogue has
an on-page *copy prompt* chip (the demo smoke enforces the two-way mapping).
(`split()` is exercised by the unit smoke instead.)

Two trees share that wiring:

- **`demo/`** (default — `npm run demo` → `/demo/`) — import map on local
  files (`/node_modules/...`, `/dist/index.js`): fast iteration, works
  offline, and the pages `demo-smoke` drives.
- **`demo_live/`** (`npm run sync:live` regenerates it from `demo/`) — a
  deploy-anywhere copy: the **version-pinned CDN** import map and stylesheet
  (jsdelivr `@<version>` for the package, `gsap@3.15.0`, `lenis@1.3.26` —
  the exact URLs the prompts teach), relative internal links, a generated
  `prompts.json`, and agent crawler files (`robots.txt`, `sitemap.xml`,
  `llms.txt` with absolute URLs from `SITE_URL`), so the dock and docs run on
  any static host with no Node server (`/api/prompts` first, `prompts.json`
  fallback) and agents reach the full catalogue in one fetch instead of
  scraping HTML. Upload the folder as-is (Vercel, GitHub Pages, Netlify, S3).
  `demo-smoke` re-runs the generator and fails if the folder goes stale or a
  pin stops matching the release version.

### Copy-prompt API

The demo server doubles as a **prompt server**: every effect has a ready-to-
paste *"how to implement this with anim-kit"* prompt — markup, a numbered
copy-paste procedure that runs straight from the version-pinned CDN (no
build step, plus the npm import for bundlers), initialisation call, options
table, teardown and gotchas:

```bash
curl http://localhost:4321/api/prompts          # { count, categories, prompts: [{ id, title, summary, category, subcategory, text }] }
curl http://localhost:4321/api/prompts/marquee  # one prompt, text/plain
```

On the page, every labelled section carries a **copy prompt** chip, and the
floating **⧉ prompts (29)** button at the bottom right opens the full
catalogue grouped by [effect category](#effect-categories) — one click copies
an effect's prompt (the prompt states its category), *copy all* puts the
entire set on the clipboard. The catalogue lives in `scripts/prompts.mjs`:
one entry per effect rendered by `renderPrompt()`, plus the `TAXONOMY` tree
that classifies every effect. Adding a prompt is a matter of adding an entry
and slotting the effect into a subcategory.

**Unit smoke** (`scripts/smoke.mjs`) runs the built bundle in **jsdom** and
asserts:

1. all 45 exports are present;
2. plugins (`ScrollTrigger`, `SplitText`, `Draggable`, `CustomEase`,
   `Flip`, `ScrollSmoother`) and the 4 custom eases are registered;
3. every effect no-ops safely on missing targets;
4. 24 effects mount on real markup and unmount cleanly;
5. `preloader` ticks in both the positional and options-object call forms;
6. `lineReveal` actually splits into masked lines (and per-character masks
   with `split: "chars"`) and restores markup on destroy;
7. `scrambleText` restores its text, `rollText` wraps/unwraps its rows, and
   `counter({ progress: true })` renders a scrubbed readout;
8. `utils`, `compose` and `guard` behave per contract.

**Demo smoke** (`scripts/demo-smoke.mjs`) loads the real `demo/index.html` and
executes the real `demo/demo.js` wiring against it, then asserts the effects
actually *did* something (hero split, preloader counter ticking, marquee track
duplicated, per-call liquid directions, menu/theme/smooth-scroll handles in
their initial state), that ~50 ScrollTriggers + a Draggable were created, that
no console errors were logged, that `dragStrip` tiled its content for the
seamless loop, that every effect referenced on the page has a `/api/prompts`
entry, that the taxonomy classifies every effect exactly once, that the
prompt dock renders one group per category with every effect listed once,
and that teardown leaves **zero** live ScrollTriggers, Draggables or
page-element tweens behind while restoring the original markup (marquee and
drag-strip clones removed, rolling rows unwrapped, scrambled text restored).

> jsdom is used deliberately: GSAP's CSSPlugin/Draggable probe element
> style/computed values during registration, which a hand-rolled DOM stub
> cannot satisfy. Shared environment shims live in `scripts/env.mjs`.

---

## Project structure

```
anim-kit/
├─ src/
│  ├─ core/
│  │  ├─ gsap.ts           initGSAP() + EASES (single source of truth)
│  │  ├─ split.ts          SplitText wrapper + manual fallback
│  │  ├─ smooth-scroll.ts  Lenis ↔ ScrollTrigger bridge
│  │  ├─ guard.ts          reduced-motion gate
│  │  ├─ util.ts           toArray/one/onReady/compose/raf
│  │  └─ types.ts          TargetLike / Destroy / CommonOptions
│  ├─ effects/             one file per effect (24 files, 28 effect functions)
│  ├─ styles/anim-kit.css  companion stylesheet
│  └─ index.ts             barrel — 45 exports
├─ demo/                   visual demo (import map, no bundler)
├─ scripts/
│  ├─ serve.mjs            static server + /api/prompts (:4321)
│  ├─ prompts.mjs          prompt catalogue + effect TAXONOMY → /api/prompts
│  ├─ copy-assets.mjs      copies CSS into dist/
│  ├─ env.mjs              shared jsdom shims (matchMedia, scrollTo, rAF, …)
│  ├─ smoke.mjs            unit smoke test (incl. standalone API parity)
│  └─ demo-smoke.mjs       runs the real demo wiring against real markup
├─ tsup.config.ts          bundles dist/anim-kit.standalone.js (the CDN entry)
├─ LICENSE                 MIT
└─ dist/                   build output
   ├─ index.js / *.d.ts    per-file ESM + declarations (tsc)
   ├─ effects/*.js         one module per effect → @cosmictraveler002/anim-kit/effects/* subpaths
   ├─ anim-kit.standalone.js  self-contained CDN bundle (gsap+lenis inlined)
   └─ styles/anim-kit.css  plain CSS, copied verbatim
```

CI and release workflows live at the repository root:
`.github/workflows/ci.yml` (type-check + build + smoke + pack check on every
push/PR) and `.github/workflows/release.yml` (tag `v*` → `npm publish
--provenance`, needs the `NPM_TOKEN` repo secret).

Each effect is an independent module — if you only need the marquee, import
`marquee` and the bundler drops the rest, or deep-import
`@cosmictraveler002/anim-kit/effects/marquee` to skip the barrel entirely.

---

## Credits

Effects by [kalakritico.in](https://kalakritico.in/). Built on
[GSAP](https://gsap.com/) (free plugins only) and
[Lenis](https://lenis.darkroom.engineering/).

MIT © Kalakriti
