/**
 * anim-kit demo — wires up every exported effect.
 *
 * Run `npm run build && npm run demo`, then open http://localhost:4321/demo/
 */
import {
  smoothScroll,
  preloader,
  lineReveal,
  maskReveal,
  revealRule,
  counter,
  audioBars,
  marquee,
  horizontalScroll,
  parallax,
  heroShrink,
  stackedCards,
  scatterText,
  dragStrip,
  liquidButton,
  underlineLink,
  cursorFollower,
  navHide,
  logoReveal,
  menuOverlay,
  themeReveal,
  compose,
} from "anim-kit";

const cleanups = [];

/* ---------------------------------------------------------------- */
/* Smooth scroll — must come first so ScrollTrigger sees the proxy    */
/* ---------------------------------------------------------------- */
const scroller = smoothScroll({ lerp: 0.08, smoothWheel: true });
cleanups.push(scroller.destroy);

/* ---------------------------------------------------------------- */
/* Preloader                                                          */
/* ---------------------------------------------------------------- */
cleanups.push(
  preloader("[data-preloader]", {
    glyph: "[data-glyph]",
    counter: "[data-counter]",
    backdrop: "[data-backdrop]",
    duration: 4,
    step: 5,
    interval: 200,
    sessionGuard: false, // re-run every reload while demoing
    onComplete: () => {
      // Preloader overlays the page — kick ScrollTrigger once it is gone.
      window.dispatchEvent(new Event("resize"));
    },
  }),
);

/* ---------------------------------------------------------------- */
/* Nav + menu                                                         */
/* ---------------------------------------------------------------- */
cleanups.push(navHide("[data-nav]", { threshold: 200 }));

const menu = menuOverlay({
  overlay: "[data-menu]",
  openTrigger: "[data-menu-open], [data-menu-open-2]",
  closeTrigger: "[data-menu-close]",
  nav: "[data-nav]",
  link: ".menu-link a",
  chrome: "[data-menu-chrome]",
  duration: 1,
  stagger: 0.1,
});
cleanups.push(menu.destroy);

// Clicking a menu link closes the curtain.
document.querySelectorAll(".menu-link a").forEach((a) => {
  a.addEventListener("click", () => menu.close());
});

/* ---------------------------------------------------------------- */
/* Text                                                               */
/* ---------------------------------------------------------------- */
// Above the fold: plays immediately, like their `animateOnScroll:false`.
cleanups.push(lineReveal("[data-hero-text]", { mode: "immediate", delay: 0.35 }));

// Below the fold: plays on enter, reverses on leave.
cleanups.push(lineReveal("[data-lines]", { mode: "scroll" }));

cleanups.push(maskReveal("[data-mask]"));
cleanups.push(revealRule("[data-rule]"));
cleanups.push(logoReveal("[data-logo]"));

/* ---------------------------------------------------------------- */
/* Counters                                                           */
/* ---------------------------------------------------------------- */
cleanups.push(counter("[data-count]", { to: 240, duration: 3, suffix: "+" }));
cleanups.push(
  counter("[data-count-scroll]", { to: 98, duration: 2, onScroll: true, ease: "power2.out" }),
);
cleanups.push(counter("[data-count-pad]", { to: 42, duration: 2.5, pad: 3 }));

/* ---------------------------------------------------------------- */
/* Loops                                                              */
/* ---------------------------------------------------------------- */
cleanups.push(marquee("[data-marquee-track]", { speed: 40, pauseOnHover: false }));

/* ---------------------------------------------------------------- */
/* Scroll-driven scenes                                               */
/* ---------------------------------------------------------------- */
cleanups.push(
  horizontalScroll("[data-htrack]", {
    section: "[data-hsection]",
    panelImage: "[data-speed-img]",
    scrub: 0.5,
    imageScrub: 0.2,
  }),
);

cleanups.push(parallax("[data-parallax]"));

cleanups.push(heroShrink("[data-hero-media]", { offsetY: "49vh", scale: 0.23, scrub: 1 }));

cleanups.push(
  stackedCards("[data-stack-wrap]", {
    viewport: "[data-stack-viewport]",
    card: ".ak-card",
    stagger: 0.12,
  }),
);

cleanups.push(
  scatterText("[data-scatter-pin]", {
    line: "[data-scatter]",
    pinTarget: "[data-scatter-pin]",
    scatterY: 60,
    scatterRotation: 15,
  }),
);

/* ---------------------------------------------------------------- */
/* Micro-interactions                                                 */
/* ---------------------------------------------------------------- */
liquidButton("[data-liquid]", { direction: "up", duration: 900, fill: "var(--ak-primary)" });
// `direction` applies per call — scope the ones that should fill downward.
liquidButton('[data-liquid][data-dir="down"]', { direction: "down", duration: 900 });

underlineLink("a.ak-underline");

cleanups.push(
  cursorFollower("[data-showreel]", {
    follower: "[data-cursor]",
    offset: 14,
    spring: { mass: 0.1, stiffness: 120 },
  }),
);

cleanups.push(dragStrip("[data-drag]", { maxRotation: 60, rotationScale: 120 }));

/* Equaliser */
const eq = audioBars("[data-eq]", { minHeight: 3, maxHeight: 16, interval: 100 });
let playing = false;
const eqBtn = document.querySelector("[data-eq-toggle]");
const eqLabel = document.querySelector("[data-eq-label]");
eqBtn?.addEventListener("click", () => {
  playing = !playing;
  eqBtn.setAttribute("aria-pressed", String(playing));
  if (eqLabel) eqLabel.textContent = playing ? "Pause" : "Play";
  playing ? eq.start() : eq.stop();
});
cleanups.push(eq.destroy);

/* Theme wipe */
const theme = themeReveal({ toggle: "[data-theme]", duration: 1 });
cleanups.push(theme.destroy);

/* ---------------------------------------------------------------- */
/* Copy-prompt dock — implementation prompts served by the server     */
/* (GET /api/prompts from scripts/serve.mjs)                          */
/* ---------------------------------------------------------------- */
const promptApi = new URL("/api/prompts", document.baseURI);
let promptCache = null;

const loadPrompts = async () => {
  if (promptCache) return promptCache;
  const res = await fetch(promptApi);
  if (!res.ok) throw new Error(`GET ${promptApi} → ${res.status}`);
  const data = await res.json();
  promptCache = {
    count: data.count,
    categories: data.categories ?? [],
    map: Object.fromEntries(data.prompts.map((p) => [p.id, p])),
  };
  return promptCache;
};

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* not permitted (permissions/insecure context) — fall through */
    }
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
};

const flash = (btn, msg) => {
  if (btn.dataset.flashing) return;
  const original = btn.innerHTML;
  btn.dataset.flashing = "1";
  btn.textContent = msg;
  setTimeout(() => {
    delete btn.dataset.flashing;
    btn.innerHTML = original;
  }, 1500);
};

const copyPrompt = async (id, btn) => {
  try {
    const { map } = await loadPrompts();
    const entry = map[id];
    if (!entry) return flash(btn, "no prompt");
    flash(btn, (await copyText(entry.text)) ? "copied ✓" : "copy failed");
  } catch (err) {
    console.warn(`prompt fetch failed: ${err.message}`);
    flash(btn, "start server");
  }
};

/* One chip per effect, injected next to each labelled section. */
document.querySelectorAll("[data-effect]").forEach((host) => {
  host.dataset.effect.split(/\s+/).filter(Boolean).forEach((id) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-prompt";
    btn.dataset.copyPrompt = id;
    btn.textContent = "copy prompt";
    btn.title = `Copy a "how to implement ${id} with anim-kit" prompt`;
    host.appendChild(btn);
  });
});

/* Chips + dock list share one delegated handler. */
document.addEventListener("click", (e) => {
  const btn = e.target.closest?.("[data-copy-prompt]");
  if (btn) copyPrompt(btn.dataset.copyPrompt, btn);
});

const dock = document.getElementById("prompt-dock");
const dockToggle = document.getElementById("prompt-toggle");
const dockList = document.getElementById("prompt-list");
const dockCount = document.getElementById("prompt-count");

/* One item: effect id + subcategory tag on one row, title below. */
const dockItem = (p) => {
  const li = document.createElement("li");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "copy-prompt";
  btn.dataset.copyPrompt = p.id;
  btn.title = `Copy a "how to implement ${p.id} with anim-kit" prompt · ${p.categoryLabel} → ${p.subcategoryLabel}`;
  btn.innerHTML =
    '<span class="prompt-row"><span class="prompt-id"></span><span class="prompt-sub"></span></span><span class="prompt-title"></span>';
  btn.querySelector(".prompt-id").textContent = p.id;
  btn.querySelector(".prompt-sub").textContent = p.subcategoryLabel ?? "";
  btn.querySelector(".prompt-title").textContent = p.title;
  li.appendChild(btn);
  return li;
};

const renderDock = async () => {
  try {
    const { map, count, categories } = await loadPrompts();
    dockCount.textContent = `(${count})`;
    dockList.innerHTML = "";

    if (!categories.length) {
      /* Server without a taxonomy — flat fallback. */
      Object.values(map).forEach((p) => dockList.appendChild(dockItem(p)));
      return;
    }

    /* Group by category (sticky headers), taxonomy order, subcategory per item. */
    const groups = categories
      .map((c) => ({ ...c, items: Object.values(map).filter((p) => p.category === c.id) }))
      .filter((c) => c.items.length);

    /* Safety net: an effect with no category must still be reachable. */
    const grouped = new Set(groups.flatMap((g) => g.items.map((p) => p.id)));
    const strays = Object.values(map).filter((p) => !grouped.has(p.id));

    groups.forEach((cat) => {
      const li = document.createElement("li");
      li.className = "prompt-dock__group";
      const h = document.createElement("div");
      h.className = "prompt-dock__cat";
      h.textContent = `${cat.name} (${cat.items.length})`;
      h.title = cat.blurb ?? "";
      const ul = document.createElement("ul");
      ul.className = "prompt-dock__sublist";
      cat.items.forEach((p) => ul.appendChild(dockItem(p)));
      li.append(h, ul);
      dockList.appendChild(li);
    });

    if (strays.length) {
      const li = document.createElement("li");
      li.className = "prompt-dock__group";
      li.innerHTML = '<div class="prompt-dock__cat">Uncategorised</div>';
      const ul = document.createElement("ul");
      ul.className = "prompt-dock__sublist";
      strays.forEach((p) => ul.appendChild(dockItem(p)));
      li.appendChild(ul);
      dockList.appendChild(li);
    }
  } catch (err) {
    console.warn(`prompt fetch failed: ${err.message}`);
    dockList.innerHTML =
      '<li class="prompt-dock__empty">Prompts unavailable — start the demo server (<code>npm run demo</code>) so <code>/api/prompts</code> responds.</li>';
  }
};

dockToggle.addEventListener("click", async () => {
  const opening = dock.hasAttribute("hidden");
  if (opening) {
    await renderDock();
    dock.removeAttribute("hidden");
  } else {
    dock.setAttribute("hidden", "");
  }
  dockToggle.setAttribute("aria-expanded", String(opening));
});

dock.querySelector("[data-close-prompts]").addEventListener("click", () => {
  dock.setAttribute("hidden", "");
  dockToggle.setAttribute("aria-expanded", "false");
  dockToggle.focus();
});

dock.querySelector("[data-copy-all]").addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  try {
    const { map } = await loadPrompts();
    const all = Object.values(map)
      .map((p) => `<!-- ${p.id} — ${p.title} -->\n\n${p.text}`)
      .join(`\n\n${"=".repeat(64)}\n\n`);
    flash(btn, (await copyText(all)) ? `copied ${Object.keys(map).length} ✓` : "copy failed");
  } catch (err) {
    console.warn(`prompt fetch failed: ${err.message}`);
    flash(btn, "start server");
  }
});

/* Badge count, best-effort — failures surface in the dock when opened. */
loadPrompts()
  .then(({ count }) => {
    dockCount.textContent = `(${count})`;
  })
  .catch(() => {});

/* ---------------------------------------------------------------- */
/* Teardown on navigation (matters in SPAs / HMR)                     */
/* ---------------------------------------------------------------- */
window.addEventListener("beforeunload", () => compose(...cleanups)());

// Expose for poking around in devtools.
window.__animKit = { scroller, menu, theme, eq, cleanups };
