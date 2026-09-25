# Ani-Kit

> Repository for **anim-kit** — a modular, framework-agnostic animation library
> (GSAP + ScrollTrigger + Lenis)
>
> **Everything actionable lives in [`anim-kit/`](anim-kit/).** Full package documentation:
> **[`anim-kit/README.md`](anim-kit/README.md)**.

[![CI](https://github.com/Cosmictraveler002/Ani-Kit/actions/workflows/ci.yml/badge.svg)](https://github.com/Cosmictraveler002/Ani-Kit/actions/workflows/ci.yml)

## At a glance

|                      |                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| npm package          | `@cosmictraveler002/anim-kit` — ESM-only + `.d.ts`, published on npm                     |
| Package directory    | [`anim-kit/`](anim-kit/) — source, tests, demo, package docs                                   |
| Full documentation   | [`anim-kit/README.md`](anim-kit/README.md) — install, CDN, API reference, taxonomy             |
| Runtime dependencies | exactly two: `gsap`, `lenis` — never add more without a deliberate decision                    |
| Build                | `tsc` → per-file ESM + declarations; CSS copied verbatim; `tsup` → one standalone CDN bundle   |
| Tests                | `npm test` in `anim-kit/` (build + unit smoke + demo wiring smoke)                             |
| Demo                 | `npm run demo` → <http://localhost:4321/demo/> · deployable copy: `/demo_live/` (CDN, static)     |
| CI / Release         | [`.github/workflows/`](.github/workflows/) — build+test on push/PR; tag `v*` publishes to npm  |
| License              | MIT — [`anim-kit/LICENSE`](anim-kit/LICENSE)                                                   |

## Repository layout

```
.
├── anim-kit/                 the npm package — all source, tests, demo and docs
│   ├── src/
│   │   ├── core/             6 modules: gsap setup, split, smooth-scroll, guard, util, types
│   │   ├── effects/          24 files / 28 effect functions — one concern per file
│   │   ├── styles/           anim-kit.css (ships untouched as plain CSS)
│   │   └── index.ts          public barrel — the 45-export contract
│   ├── demo/                 demo page + developer docs page (import map, no bundler)
│   ├── scripts/              prompts + taxonomy, demo server, build helper, smoke tests
│   ├── dist/                 build output (gitignored)
│   ├── tsup.config.ts        standalone CDN bundle config
│   └── README.md             full package documentation
├── _scrape/                  READ-ONLY reference: raw CSS/JS scraped from the source sites
├── .github/workflows/        ci.yml (push/PR) + release.yml (tag → npm publish)
├── .gitignore                ignores node_modules/, dist/, *.tgz
└── README.md                 this file
```

## Commands (run inside `anim-kit/`)

```bash
cd anim-kit
npm ci                # install (npm install also works)
npm run build         # tsc → dist/ (ESM + .d.ts) + CSS copy + tsup standalone bundle
npm run typecheck     # tsc --noEmit
npm test              # build + unit smoke + demo smoke — MUST pass before committing
npm run smoke         # both smokes against an existing dist/ (no rebuild)
npm run demo          # server on :4321 — demo page + /api/prompts (build first if dist/ is stale)
```

## Source of truth — edit THIS for THAT

| Change                                            | Where                                                                                                                                                                                                    |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Add or modify an effect                           | `anim-kit/src/effects/<name>.ts` → export from `anim-kit/src/index.ts` → add to `expected` in `anim-kit/scripts/smoke.mjs` → add a prompt in `anim-kit/scripts/prompts.mjs` → wire into `anim-kit/demo/` |
| Public API surface (45 exports)                   | `anim-kit/src/index.ts` — must stay in sync with the `expected` list in `scripts/smoke.mjs`                                                                                                              |
| GSAP setup, custom eases, internal `killTweens()` | `anim-kit/src/core/gsap.ts`                                                                                                                                                                              |
| Effect taxonomy (categories → subcategories)      | `TAXONOMY` in `anim-kit/scripts/prompts.mjs`                                                                                                                                                             |
| Copy-prompt text served by the demo               | `renderPrompt()` in `anim-kit/scripts/prompts.mjs`                                                                                                                                                       |
| CDN version pin (prompts, docs page, README pins) | `CDN_VERSION` in `anim-kit/scripts/prompts.mjs` — must equal `package.json` `version`; `demo-smoke.mjs` enforces both                                                                                    |
| Styles (`.ak-*` classes, keyframes)               | `anim-kit/src/styles/anim-kit.css` — copied byte-for-byte to `dist/styles/`; never import CSS from JS                                                                                                    |
| npm exports map, version, dependencies            | `anim-kit/package.json`                                                                                                                                                                                  |
| Standalone CDN bundle behaviour                   | `anim-kit/tsup.config.ts`                                                                                                                                                                                |
| CI and npm publishing                             | `.github/workflows/ci.yml`, `.github/workflows/release.yml`                                                                                                                                              |

## Invariants (read before changing anything)

1. **Uniform effect API** — `effect(target, options) => destroy()`. Only
   `menuOverlay`, `audioBars`, `smoothScroll` and `themeReveal` return a small
   handle with `.destroy()` instead.
2. **Exactly two runtime dependencies** (`gsap`, `lenis`). Dev tooling
   (typescript, tsup, jsdom) must never leak into `dependencies`.
3. **Two-level taxonomy only** — category → subcategory → effect, every effect
   in exactly one slot, no tags. The `TAXONOMY` tree is the single source of
   truth for the API payload, demo dock grouping, README tree and tests.
4. **45-export contract** — `src/index.ts` and the `expected` list in
   `scripts/smoke.mjs` must match exactly.
5. **CSS ships untouched** — plain `.css` on its own subpath
   (`anim-kit/styles`), never run through the JS compiler.
6. **`npm test` green before every commit** — includes the teardown gate:
   destroying all effects leaves 0 ScrollTriggers, 0 Draggables, 0 tweens and
   restores the original markup.
7. **`_scrape/` is read-only reference material** — consult it, never edit it
   and never ship it.
8. **Reduced motion goes through `guard()`** (`force: true` opts out per call)
   — don't hand-roll `matchMedia` checks inside effects.
9. **GSAP gotchas already paid for** — Draggable has no `modifiers` option (use
   `liveSnap`); `gsap.killTweensOf()` silently misses lazy tweens (use the
   internal `killTweens()` in `core/gsap.ts`, deliberately not exported);
   minified bundles must keep plugin class names (`keepNames` in
   `tsup.config.ts`) or `gsap.core.globals()` gets corrupted.
10. **Never commit** `node_modules/`, `dist/` or `*.tgz` — see `.gitignore`.

## Recent structural fixes — bug classes and how to fix the next one

Two "doesn't work" reports from browser verification of the demo, plus the
check that stopped a third class before it shipped. All three are paid for
with regression tests; treat them as the template for similar reports.

### A. Position math must match the positioning mode (`cursorFollower`)

**What happened.** The effect pinned the follower tag `position: absolute`
but computed coordinates relative to the hover zone. Those two spaces only
line up when the tag is a child of the zone — the demo and the prompt markup
put it at body level, so it rendered near the document origin: above the
viewport, invisible on hover.

**Rule.** Any effect that writes `x` / `y` / `left` / `top` must compute
coordinates in the space its positioning mode resolves in: `fixed` → viewport
space (`clientX/Y`), `absolute` → its containing block, `transform` → the
parent box. If the element may live anywhere in the DOM, `position: fixed` +
`clientX/Y` is the only space that always holds.

**The fix.** Switch to viewport space, and snap on the first pointer move so
the spring does not fly the tag in from a corner. Two follow-on gotchas came
with it: `mix-blend-mode: exclusion` needs a light source colour
(`color: #fff`) or the element blends down into the backdrop and "vanishes";
and teardown must restore the inline styles it overwrote.

**How to verify.** Unit: `scripts/smoke.mjs` dispatches a synthetic
`pointermove` and asserts the snap lands at `clientX/Y + offset`. Visual:
headless Edge + puppeteer — hover, assert
`follower.getBoundingClientRect() ≈ pointer + offset`, move again, leave,
assert opacity returns to 0.

### B. One-shot triggers read as dead effects (enter reveals)

**What happened.** `unfoldReveal` / `clipWipe` / `mediaSettle` animated
correctly on a slow first pass but used `toggleActions: "play none none
none"` / `once: true` — any second pass (scroll back up and re-enter, or a
reload with restored scroll) played nothing, which reads as "the animation
doesn't work".

**Rule.** Entrance effects a visitor can re-approach need a `replay: true`
variant (`toggleActions: "play reverse play reverse"`), and the demo should
wire it so every pass animates.

**The fix.** Add a `replay` option with default `false` (existing behaviour
unchanged), document it in the prompt + README, wire the demo with
`replay: true`.

**How to verify.** Script a slow down → up → down scroll and sample computed
styles at each stop: initial (hidden) → revealed → initial again → revealed
again. Fast, one-pass checks hide exactly this bug.

### C. "Looks the same" needs evidence before changing code

`stackedCards` and `stackedCardsPinned` render the same card choreography
**on purpose** (one timeline, two DOM structures); only the pinning differs —
CSS `position: sticky` vs a GSAP pin with `pinSpacing: false`. Check computed
`position` mid-scrub (`sticky` vs `fixed`) before "fixing" them apart.

### Process notes

- `npm test` (build + unit smoke + demo smoke) gates every commit; visual
  claims get a headless-Edge + puppeteer script that logs computed styles at
  known scroll positions and screenshots each state. Prefer slow, stepped
  scrolls over jumps.
- Release pins are single-sourced: `CDN_VERSION` → `payload.version` → the
  docs page interpolates its CDN blocks from it; `demo-smoke.mjs` fails if
  `package.json` or the README drifts from that pin.

## Releasing

1. Bump `version` in `anim-kit/package.json` (npm versions are immutable —
   CDN URLs pin to them forever).
2. Push a tag: `git tag v1.0.1 && git push origin v1.0.1`.
3. `release.yml` builds, tests and runs `npm publish --provenance`.
4. jsDelivr/unpkg pick the new version up automatically — no manual CDN step.

**Publish auth (one-time setup)** — classic npm "Automation" tokens no longer
exist; there are two phases:

- **Bootstrap (first publish):** create a _granular access token_ on npmjs.com
  (Access Tokens → Generate New Token → **Granular access token** → Permissions:
  **Read and write (publish and stage)** → Packages and scopes: **All packages**
  → tick **Bypass two-factor authentication** if 2FA is enabled) and store it
  as the repository secret **`NPM_TOKEN`** (Settings → Secrets and variables →
  Actions → _Secrets_ tab, not Variables).
- **After `anim-kit` exists on npm:** switch to tokenless _Trusted Publishing_ —
  npmjs.com → package **Settings → Trusted publishing** → GitHub Actions →
  repo `Cosmictraveler002/Ani-Kit`, workflow file `release.yml`, and **allow
  direct `npm publish`** (configurations created after Sep 2026 default to
  stage-only). Then delete the `NPM_TOKEN` secret. Direct-publish granular
  tokens stop working in **January 2027**, so complete this migration before
  then.

## Documentation map (`anim-kit/README.md`)

| Topic                                        | Section                                                   |
| -------------------------------------------- | --------------------------------------------------------- |
| npm install, subpath exports                 | [Install](anim-kit/README.md#install)                     |
| CDN usage (standalone / `+esm` / import map) | [CDN usage](anim-kit/README.md#cdn-usage)                 |
| Effect taxonomy and how to grow it           | [Effect categories](anim-kit/README.md#effect-categories) |
| Every effect, options, return values         | [API](anim-kit/README.md#api)                             |
| AI-assisted implementation prompts           | [Copy-prompt API](anim-kit/README.md#copy-prompt-api)     |
| Package internals                            | [Project structure](anim-kit/README.md#project-structure) |

Interactive developer docs site (install, initialisation process, every
effect's markup/options/boilerplate, category navigation):
[`anim-kit/demo/docs.html`](anim-kit/demo/docs.html) — served by `npm run demo`
→ <http://localhost:4321/demo/docs.html>, linked as **Docs** in the demo nav.
A static-host-ready copy of both pages lives in
[`anim-kit/demo_live/`](anim-kit/demo_live/) — fixed CDN pins plus a generated
`prompts.json`, no server required (regenerate from `demo/` with
`npm run sync:live`).

---

Effects by [kalakritico.in](https://kalakritico.in/).
Built on [GSAP](https://gsap.com/) (free plugins only) and [Lenis](https://lenis.darkroom.engineering/).
MIT © Kalakriti.
