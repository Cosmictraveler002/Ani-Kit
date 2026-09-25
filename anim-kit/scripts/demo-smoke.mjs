/**
 * Integration smoke: runs the REAL demo wiring (demo/demo.js) against the REAL
 * demo markup (demo/index.html) inside jsdom.
 *
 * The unit smoke test exercises each effect in isolation; this one catches the
 * class of bug that only shows up when they are wired together against real
 * markup — e.g. an effect silently no-oping because a call passed the target in
 * the wrong position, leaving a fixed overlay covering the page forever.
 *
 *   node scripts/demo-smoke.mjs        (expects dist/ + demo/ to exist)
 */
import { strict as assert } from "node:assert";
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";
import { setupDom } from "./env.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

/* ---------------- real demo markup ---------------- */
const html = readFileSync(path.join(root, "demo", "index.html"), "utf8");
const { dom, window, errors } = setupDom(html, { verbose: false });
const doc = window.document;

/* ---------------- run the real demo wiring ---------------- */
// demo.js imports the bare specifier "anim-kit"; Node has no import maps, so
// rewrite it to the built bundle and execute it as a module.
const demoSrc = readFileSync(path.join(root, "demo", "demo.js"), "utf8").replace(
  'from "anim-kit"',
  'from "../dist/index.js"',
);
const tmp = path.join(here, ".tmp-demo-run.mjs");
writeFileSync(tmp, demoSrc, "utf8");

/* ---------------- geometry + markup snapshots (before wiring) ---------------- */
// jsdom reports 0 for every layout value. dragStrip only tiles when one tile
// is ≥ the viewport, so fake a 6-card / 1280px strip whose width follows its
// child count — that exercises the real seamless-loop math.
const dragTrackEl = doc.querySelector("[data-drag]");
const dragCountBefore = dragTrackEl?.children.length ?? 0;
const perCard = dragCountBefore ? 1280 / dragCountBefore : 0;
if (dragTrackEl) {
  const widthOf = () => dragTrackEl.children.length * perCard;
  Object.defineProperty(dragTrackEl, "scrollWidth", { configurable: true, get: widthOf });
  Object.defineProperty(dragTrackEl, "clientWidth", { configurable: true, get: widthOf });
  const vp = dragTrackEl.parentElement;
  if (vp) Object.defineProperty(vp, "clientWidth", { configurable: true, get: () => 1280 });
}
const marqueeTracks = [...doc.querySelectorAll("[data-marquee-track]")];
const marqueeCounts = marqueeTracks.map((t) => t.children.length);

/* ---------------- real prompt payload (GET /api/prompts) ---------------- */
// demo.js fetches the catalogue at module scope; serve the REAL payload so the
// dock renders exactly what scripts/serve.mjs ships.
const {
  PROMPT_ENTRIES,
  renderPrompt,
  classify,
  taxonomyEffects,
  promptsPayload,
} = await import("../scripts/prompts.mjs");
const payload = promptsPayload();
const promptIds = new Set(PROMPT_ENTRIES.map((e) => e.id));
const realFetch = globalThis.fetch;
globalThis.fetch = async (url) => {
  if (String(url).includes("/api/prompts")) {
    return { ok: true, status: 200, json: async () => payload };
  }
  throw new Error(`unexpected fetch: ${url}`);
};

let wiringError = null;
try {
  await import(pathToFileURL(tmp).href);
} catch (err) {
  wiringError = err;
} finally {
  rmSync(tmp, { force: true });
}

assert.equal(wiringError, null, `demo wiring threw: ${wiringError?.stack ?? wiringError}`);
assert.deepEqual(
  errors.map((e) => String(e?.message ?? e?.error?.message ?? e)),
  [],
  "demo wiring must not log errors",
);
console.log("ok  demo.js wires up against demo/index.html without errors");

/* ---------------- each effect actually did something ---------------- */
const kit = window.__animKit;
assert.ok(kit, "demo should expose window.__animKit");

// lineReveal split the hero heading (synchronous split, before the delayed tween).
assert.ok(
  doc.querySelectorAll("[data-hero-text] .ak-line").length > 0,
  "hero lineReveal should produce .ak-line masks",
);

// preloader — the positional call form against real markup must tick.
const preCounter = doc.querySelector("#preloader [data-counter]");
assert.ok(preCounter, "preloader counter element missing");
assert.equal(preCounter.textContent, "0", "preloader counter should start at 0");
await new Promise((r) => setTimeout(r, 500));
assert.notEqual(preCounter.textContent, "0", `preloader must tick (saw "${preCounter.textContent}")`);

// marquee duplicated its track for the seamless wrap.
assert.equal(
  doc.querySelector("[data-marquee-track]")?.dataset.marqueeCloned,
  "true",
  "marquee should duplicate track content",
);

// liquid buttons: direction applies per call, so the scoped call must win.
assert.equal(
  doc.querySelector('[data-liquid][data-dir="down"]')?.dataset.akLiquid,
  "down",
  "down-filling button should be stamped data-ak-liquid=down",
);
assert.equal(
  doc.querySelector("[data-liquid]:not([data-dir])")?.dataset.akLiquid,
  "up",
  "default button should be stamped data-ak-liquid=up",
);

// handles are wired and in their initial state.
assert.equal(kit.menu.isOpen(), false, "curtain menu starts closed");
assert.equal(kit.theme.current(), "light", "theme should follow <html class=\"light\">");
assert.equal(typeof kit.scroller.scrollTo, "function", "smoothScroll handle missing");
console.log("ok  lineReveal / preloader / marquee / liquid / menu / theme / smoothScroll all live");

// scroll effects registered real ScrollTriggers; drag strip a Draggable.
const lib = await import("../dist/index.js");
const dragTrack = doc.querySelector("[data-drag]");
const triggers = lib.ScrollTrigger.getAll();
assert.ok(triggers.length >= 8, `expected many ScrollTriggers, saw ${triggers.length}`);
assert.ok(lib.Draggable.get(dragTrack), "dragStrip should create a Draggable");
console.log(`ok  effects mounted — ${triggers.length} ScrollTriggers, 1 Draggable`);

// dragStrip tiled its content: one tile ≥ viewport → duplicated exactly once
// (loop distance = one whole tile, so the seam never shows).
assert.equal(
  dragTrackEl.children.length,
  dragCountBefore * 2,
  `dragStrip should duplicate content for a seamless loop (saw ${dragTrackEl.children.length}, want ${dragCountBefore * 2})`,
);
const dragLiveTweens = lib.gsap.getTweensOf(Array.from(dragTrackEl.children));
assert.ok(dragLiveTweens.length >= 1, "dragStrip rotation tweens should exist while mounted");
console.log("ok  dragStrip tiled the strip for the infinite wrap");

/* ---------------- copy-prompt catalogue ---------------- */
// (entries, classify, payload — imported above so the dock could fetch them)

// every effect the page advertises has a prompt behind its chip...
const pageEffects = [...doc.querySelectorAll("[data-effect]")].flatMap((el) =>
  el.dataset.effect.split(/\s+/).filter(Boolean),
);
for (const id of pageEffects) {
  assert.ok(promptIds.has(id), `no /api/prompts entry for on-page effect "${id}"`);
}
// ...and the panel-only effects are covered too.
const panelOnly = [
  "smoothScroll", "preloader", "navHide", "menuOverlay",
  "underlineLink", "cursorFollower", "stackedCardsPinned",
];
for (const id of panelOnly) {
  assert.ok(promptIds.has(id), `no /api/prompts entry for "${id}"`);
}
// each prompt is a self-contained implementation guide.
for (const entry of PROMPT_ENTRIES) {
  const text = renderPrompt(entry);
  assert.ok(
    text.includes(`import { ${entry.imports.join(", ")} } from "anim-kit"`),
    `prompt "${entry.id}" must show the import`,
  );
  assert.ok(text.includes("destroy()"), `prompt "${entry.id}" must show teardown`);
  assert.ok(text.includes("## 1. Markup"), `prompt "${entry.id}" must include markup`);
  const cls = classify(entry.id);
  assert.ok(cls, `effect "${entry.id}" must be classified in the taxonomy`);
  assert.ok(
    text.includes(`**Category:** ${cls.categoryLabel} → ${cls.subcategoryLabel}`),
    `prompt "${entry.id}" must state its category`,
  );
}

/* Taxonomy: exactly one home per effect, no ghosts, payload mirrors it. */
const treeEffects = taxonomyEffects();
assert.equal(
  new Set(treeEffects).size,
  treeEffects.length,
  "an effect may sit in only one subcategory",
);
assert.deepEqual(
  [...promptIds].filter((id) => !treeEffects.includes(id)),
  [],
  "every catalogue entry must be classified",
);
assert.deepEqual(
  treeEffects.filter((id) => !promptIds.has(id)),
  [],
  "taxonomy must not reference unknown effects",
);
assert.equal(payload.count, PROMPT_ENTRIES.length, "payload count must match");
assert.ok(payload.categories.length >= 8, "payload should ship the category tree");
for (const p of payload.prompts) {
  assert.ok(p.category && p.categoryLabel, `payload entry "${p.id}" must carry its category`);
  assert.ok(p.subcategory && p.subcategoryLabel, `payload entry "${p.id}" must carry its subcategory`);
}
// the README documents the same tree (docs must not drift from the payload).
const readme = readFileSync(path.join(root, "README.md"), "utf8");
assert.ok(readme.includes("## Effect categories"), "README must document the effect categories");
for (const cat of payload.categories) {
  assert.ok(readme.includes(`| ${cat.name} |`), `README must list category "${cat.name}"`);
  for (const sub of cat.subcategories) {
    assert.ok(readme.includes(`| ${sub.name} |`), `README must list subcategory "${sub.name}"`);
  }
}
// chips were injected next to each labelled section.
assert.ok(doc.querySelectorAll("[data-copy-prompt]").length >= pageEffects.length,
  "copy-prompt chips should be injected for every data-effect");
console.log(
  `ok  prompts — ${PROMPT_ENTRIES.length} entries, ${pageEffects.length} on-page chips covered, ` +
    `${payload.categories.length} categories, ${new Set(treeEffects).size} classified effects`,
);

/* ---------------- dock groups the catalogue by category ---------------- */
const dockEl = doc.getElementById("prompt-dock");
const dockToggle = doc.getElementById("prompt-toggle");
assert.ok(dockEl.hasAttribute("hidden"), "prompt dock starts hidden");
dockToggle.click();
await new Promise((r) => setTimeout(r, 0)); // let the async click handler finish
assert.ok(!dockEl.hasAttribute("hidden"), "clicking the toggle should open the dock");

const groups = [...dockEl.querySelectorAll("#prompt-list > li.prompt-dock__group")];
assert.equal(
  groups.length,
  payload.categories.length,
  `dock should render one group per category (saw ${groups.length}, want ${payload.categories.length})`,
);
const dockItems = [...dockEl.querySelectorAll("#prompt-list [data-copy-prompt]")];
assert.equal(
  dockItems.length,
  PROMPT_ENTRIES.length,
  "every effect must be reachable exactly once in the dock",
);
for (const g of groups) {
  const head = g.querySelector(".prompt-dock__cat");
  const n = g.querySelectorAll(".prompt-dock__sublist [data-copy-prompt]").length;
  const label = head.textContent;
  const m = label.match(/\((\d+)\)$/);
  assert.ok(m, `group header "${label}" should end with a count`);
  assert.equal(Number(m[1]), n, `group header "${label}" count must match its items`);
}
for (const item of dockItems) {
  const cls = classify(item.dataset.copyPrompt);
  assert.equal(
    item.querySelector(".prompt-sub").textContent,
    cls.subcategoryLabel,
    `dock item "${item.dataset.copyPrompt}" must show its subcategory`,
  );
}
console.log(`ok  prompt dock — ${groups.length} category groups, sticky headers + subcategory tags`);
if (realFetch === undefined) delete globalThis.fetch;
else globalThis.fetch = realFetch;

/* ---------------- teardown kills everything ---------------- */
const failures = [];
for (const fn of kit.cleanups) {
  try {
    fn();
  } catch (err) {
    failures.push(String(err?.stack ?? err));
  }
}
assert.deepEqual(failures, [], `cleanup must not throw: ${failures.join("\n")}`);

const leaked = lib.ScrollTrigger.getAll();
assert.equal(leaked.length, 0, `${leaked.length} ScrollTrigger(s) leaked after teardown`);
assert.ok(!lib.Draggable.get(dragTrack), "Draggable leaked after teardown");

// Audit contract: teardown restores the original markup and kills our tweens.
assert.equal(
  dragTrackEl.children.length,
  dragCountBefore,
  `dragStrip must remove its cloned tiles (saw ${dragTrackEl.children.length}, want ${dragCountBefore})`,
);
marqueeTracks.forEach((t, i) => {
  assert.equal(t.children.length, marqueeCounts[i], `marquee track ${i} must lose its duplicated copy`);
});
assert.equal(
  doc.querySelector("[data-marquee-track]")?.dataset.marqueeCloned,
  undefined,
  "marquee teardown must clear the data-marquee-cloned flag",
);
assert.equal(
  lib.gsap.getTweensOf(Array.from(dragTrackEl.children)).length,
  0,
  "dragStrip rotation tweens leaked after teardown",
);
// No tween may survive teardown **on our elements**. GSAP/Draggable
// internals (delayed refreshes — their targets are functions) are not ours
// to kill; they self-remove once the ticker runs.
const survivors = lib.gsap.globalTimeline
  .getChildren(true, true, true)
  .filter((t) =>
    (typeof t.targets === "function" ? t.targets() : []).some(
      (el) => typeof el === "object" && el !== null,
    ),
  );
assert.deepEqual(
  survivors.map((t) => {
    const tgts = t.targets?.() ?? [];
    return `${t.vars?.data ?? "Tween"}→${tgts
      .map((el) =>
        el.nodeName
          ? `${el.nodeName}.${el.className || ""}#${el.id || ""}[${el.getAttribute?.("data-eq") !== null ? "data-eq" : [...(el.attributes ?? [])].map((a) => a.name).join("|")}] html=${String(el.outerHTML ?? "").slice(0, 80)} vars=${JSON.stringify(t.vars)} paused=${t.paused()}`
          : `?${el}`,
      )
      .join(",")}`;
  }),
  [],
  `${survivors.length} tween(s) still targeting page elements after teardown`,
);
console.log("ok  teardown leaves 0 ScrollTriggers / 0 Draggables / 0 tweens, markup restored");

console.log("\ndemo smoke test passed");

dom.window.close();
process.exit(0);
