/**
 * Smoke test: verify the built bundle loads, exports what the demo imports,
 * and that effect factories degrade gracefully when nothing matches.
 *
 * Runs against jsdom so GSAP's CSSPlugin/Draggable feature-probing sees a real
 * DOM (a hand-rolled stub is not enough — they inspect element style/computed
 * values during registration).
 *
 *   node scripts/smoke.mjs
 */
import { strict as assert } from "node:assert";
import { setupDom } from "./env.mjs";

const { dom, window } = setupDom(
  `<!doctype html><html class="light"><body>
     <div id="fixture">
       <h1 data-hero>Hero<br/>line two</h1>
       <p data-lines>Some body copy that should split into lines.</p>
       <span class="ak-mask"><span data-mask>masked</span></span>
       <div class="rule" data-rule></div>
       <svg data-logo viewBox="0 0 100 40"><path class="svg-anim-path" d="M0 0h100v40H0z"/></svg>
       <div data-count>0</div>
       <div class="ak-marquee"><div data-marquee-track><span>a</span><span>b</span></div></div>
       <div data-drag><i>x</i><i>y</i></div>
       <div data-eq><i></i><i></i><i></i></div>
       <button data-liquid><span>hi</span></button>
       <a href="#" class="ak-underline">link</a>
       <div data-showreel><span>play</span></div>
       <div data-counter>0</div>
       <div data-backdrop></div>
       <div data-preloader><svg data-glyph></svg></div>
       <div data-menu><div class="menu-link"><a href="#">Home</a></div></div>
       <nav data-nav><p>brand</p></nav>
     </div>
   </body></html>`,
  { url: "http://localhost:4321/demo/" },
);

/* ---------------- import the library ---------------- */
const lib = await import("../dist/index.js");
const expected = [
  // core
  "gsap", "ScrollTrigger", "SplitText", "Draggable", "CustomEase", "ScrollSmoother",
  "initGSAP", "EASES", "smoothScroll", "split", "guard",
  "toArray", "one", "onReady", "compose", "raf", "prefersReducedMotion",
  // scroll effects
  "lineReveal", "maskReveal", "revealRule", "parallax", "horizontalScroll",
  "stackedCards", "stackedCardsPinned", "scatterText", "heroShrink", "navHide",
  "logoReveal",
  // loops
  "marquee", "dragStrip",
  // micro
  "liquidButton", "underlineLink", "cursorFollower", "counter", "audioBars",
  "themeReveal", "menuOverlay", "preloader",
];

const missing = expected.filter((k) => !(k in lib));
assert.deepEqual(missing, [], `missing exports: ${missing.join(", ")}`);
console.log(`ok  ${expected.length} exports present`);

/* ---------------- standalone CDN bundle mirrors the barrel ---------------- */
const standalone = await import("../dist/anim-kit.standalone.js");
const barrelKeys = Object.keys(lib).sort();
const standaloneKeys = Object.keys(standalone).sort();
assert.deepEqual(
  standaloneKeys,
  barrelKeys,
  "standalone bundle must export the exact same API as dist/index.js",
);
// GSAP plugins register under constructor names — minification must not mangle
// them (would silently corrupt gsap.core.globals() in the CDN bundle).
const standaloneGlobals = Object.keys(standalone.gsap.core.globals());
for (const plugin of ["ScrollTrigger", "_SplitText", "Draggable", "CustomEase", "ScrollSmoother"]) {
  assert.ok(
    standaloneGlobals.includes(plugin),
    `standalone gsap must register ${plugin} under its real name (got: ${standaloneGlobals.join(", ")})`,
  );
}
console.log(`ok  standalone bundle self-contained + API parity (${standaloneKeys.length} exports), plugin names intact`);

/* ---------------- initGSAP registered the plugins it relies on ---------------- */
const globals = Object.keys(lib.gsap.core.globals());
assert.ok(globals.includes("ScrollTrigger"), "ScrollTrigger must be registered");
// SplitText registers itself under "_SplitText".
assert.ok(
  globals.includes("_SplitText") || globals.includes("SplitText"),
  "SplitText must be registered",
);
assert.ok(globals.includes("Draggable"), "Draggable must be registered");
assert.ok(lib.ScrollTrigger.version, "ScrollTrigger should be usable");
assert.equal(typeof lib.SplitText.create, "function", "SplitText.create missing");
assert.equal(typeof lib.CustomEase.get(lib.EASES.curtain), "function", "ak-curtain ease missing");
assert.equal(typeof lib.CustomEase.get(lib.EASES.cardStack), "function", "ak-card-stack ease missing");
assert.equal(typeof lib.CustomEase.get(lib.EASES.reveal), "function", "ak-reveal ease missing");
assert.equal(typeof lib.CustomEase.get(lib.EASES.preloadOut), "function", "ak-preload-out ease missing");
console.log(`ok  plugins registered [${globals.join(", ")}] + 4 custom eases`);

/* ---------------- missing targets no-op instead of throwing ---------------- */
// Most effects return a bare destroy fn; audioBars returns { start, stop, destroy }.
const asDestroy = (ret) => (typeof ret === "function" ? ret : ret?.destroy);

const factories = [
  "lineReveal", "maskReveal", "revealRule", "parallax", "horizontalScroll",
  "stackedCards", "scatterText", "heroShrink", "navHide", "logoReveal",
  "marquee", "dragStrip", "liquidButton", "underlineLink",
  "cursorFollower", "counter", "audioBars",
];
for (const name of factories) {
  const destroy = asDestroy(lib[name]("[data-nope]"));
  assert.equal(typeof destroy, "function", `${name} must return a destroy fn`);
  destroy();
}
const pinnedDestroy = asDestroy(lib.stackedCardsPinned("[data-nope]", { viewport: "[data-nope]" }));
assert.equal(typeof pinnedDestroy, "function");
pinnedDestroy();
console.log(`ok  ${factories.length + 1} effects no-op safely on missing targets`);

/* ---------------- real targets: create then destroy ---------------- */
// horizontalScroll/scatterText rewrite their container's innerHTML, so they
// must NOT share #fixture — the later lineReveal assertion reads [data-lines]
// from it. Give each destructive effect its own throwaway host.
const mountHost = (id, html) => {
  const el = window.document.createElement("div");
  el.id = id;
  el.innerHTML = html;
  window.document.body.appendChild(el);
  return el;
};
const hsHost = mountHost(
  "hs-host",
  `<section><div class="track"><div class="panel"><i>1</i></div><div class="panel"><i>2</i></div></div></section>`,
);
const scatterHost = mountHost("scatter-host", `<p>So, are you ready to Stand out?</p>`);

const createDestroy = [
  ["maskReveal", ["[data-mask]"]],
  ["revealRule", ["[data-rule]"]],
  ["logoReveal", ["[data-logo]"]],
  ["parallax", ["#fixture"]],
  ["counter", ["[data-count]", { to: 5, duration: 0.01 }]],
  ["marquee", ["[data-marquee-track]", { speed: 40 }]],
  ["liquidButton", ["[data-liquid]", { direction: "down", duration: 300 }]],
  ["underlineLink", ["a.ak-underline"]],
  ["cursorFollower", ["[data-showreel]", { follower: "[data-showreel] span" }]],
  ["navHide", ["[data-nav]"]],
  ["dragStrip", ["[data-drag]"]],
  ["audioBars", ["[data-eq]", { interval: 50 }]],
  ["horizontalScroll", ["#hs-host .track"]],
  ["scatterText", ["#scatter-host"]],
  ["menuOverlay", [{ overlay: "[data-menu]", nav: "[data-nav]" }]],
  ["preloader", ["[data-preloader]", { sessionGuard: false }]],
];
for (const [name, args] of createDestroy) {
  const destroy = asDestroy(lib[name](...args));
  assert.equal(typeof destroy, "function", `${name} must be disposable`);
  destroy();
}
console.log(`ok  ${createDestroy.length} effects mount and unmount`);
hsHost.remove();
scatterHost.remove();

/* ---------------- preloader: both call forms must actually mount ---------------- */
// Regression guard: the positional form used to drop the target, silently
// no-op and leave the fixed overlay covering the page forever.
const preCounter = window.document.querySelector("[data-preloader] [data-counter]")
  ?? window.document.querySelector("[data-counter]");
const preDestroy = lib.preloader("[data-preloader]", {
  sessionGuard: false,
  counter: "[data-counter]",
  glyph: "[data-glyph]",
  duration: 5,
  step: 5,
  interval: 10,
});
await new Promise((r) => setTimeout(r, 45));
const ticked = preCounter.textContent;
preDestroy();
assert.ok(ticked !== "0", `positional preloader must tick the counter (saw "${ticked}")`);

const preDestroy2 = lib.preloader({ root: "[data-preloader]", sessionGuard: false, duration: 5, interval: 10 });
assert.equal(typeof preDestroy2, "function", "options-object preloader must return destroy");
preDestroy2();
console.log(`ok  preloader mounts in positional and options form (counter → ${ticked})`);

/* ---------------- lineReveal actually splits + masks ---------------- */
const linesDestroy = lib.lineReveal("[data-lines]", { mode: "immediate" });
const splitNodes = window.document.querySelectorAll("[data-lines] .ak-line");
assert.ok(splitNodes.length > 0, "lineReveal should produce .ak-line masks");
linesDestroy();
const restored = window.document.querySelector("[data-lines]").textContent.trim();
assert.ok(restored.includes("body copy"), "lineReveal must restore markup on destroy");
console.log(`ok  lineReveal split into ${splitNodes.length} masked line(s) and reverted`);

/* ---------------- utils ---------------- */
assert.deepEqual(lib.toArray("[data-xyz-nope]"), [], "toArray on missing selector");
assert.equal(lib.one(null), null, "one(null) is null");
let composed = 0;
lib.compose(() => { composed++; }, undefined, () => { composed++; })();
assert.equal(composed, 2, "compose runs every fn and skips holes");
assert.equal(lib.prefersReducedMotion(), false, "stub should report no reduced motion");
console.log("ok  utils behave");

/* ---------------- guard honours its contract ---------------- */
let ran = false;
const d1 = lib.guard({}, () => { ran = true; return () => {}; });
assert.ok(ran, "guard should run the effect when motion is allowed");
d1();
let ranForced = false;
lib.guard({ force: true }, () => { ranForced = true; return () => {}; });
assert.ok(ranForced, "guard should honour force");
console.log("ok  guard() contract");

/* ---------------- killTweens also catches lazy (uninitted) tweens --------- */
// GSAP quirk regression: gsap.killTweensOf(x) forwards to tween.kill(x, …),
// which walks each tween's *initialised* prop-tween lookup. A tween created
// between ticker frames hasn't initialised yet (lazy), so that lookup is empty
// and the kill silently no-ops — the tween would fire *after* teardown (this
// is how an equaliser batch once rewrote `height` post-destroy). anim-kit's
// internal killTweens() uses the no-arg full kill, which covers both states.
const { killTweens } = await import("../dist/core/gsap.js");
const lazyA = document.createElement("i");
const lazyB = document.createElement("b");
document.body.append(lazyA, lazyB);
const twA = lib.gsap.to(lazyA, { height: 9, duration: 0.4, overwrite: "auto" });
const twB = lib.gsap.to(lazyB, { height: 7, duration: 0.4, overwrite: "auto" });
// Two elements on purpose: killTweensOf's single-target tweens only reach the
// safe interrupt path when the kill list array-matches the tween's own targets
// (same length, same order). With a multi-element list they take the partial
// path — empty lookup while lazy → the kill silently no-ops.
lib.gsap.killTweensOf([lazyA, lazyB]);
const missed = lib.gsap.getTweensOf([lazyA, lazyB]).length;
killTweens([lazyA, lazyB]); // must finish the job either way
assert.equal(
  lib.gsap.getTweensOf([lazyA, lazyB]).length,
  0,
  "killTweens must remove lazy tweens that killTweensOf misses",
);
twA.kill();
twB.kill();
lazyA.remove();
lazyB.remove();
console.log(`ok  killTweens kills lazy tweens (killTweensOf missed ${missed}/2)`);

console.log("\nsmoke test passed");

dom.window.close();
process.exit(0);
