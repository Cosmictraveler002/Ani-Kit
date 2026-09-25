/**
 * anim-kit docs — renders the developer documentation from GET /api/prompts.
 *
 * The payload (prompts + taxonomy + version) is the same source the demo dock
 * uses, so the docs page, dock, copy prompts and README tree cannot drift
 * apart. Static pieces (install, process, boilerplate) live in docs.html; the
 * CDN version is interpolated here from `payload.version` — CDN_VERSION in
 * scripts/prompts.mjs is the single pin source.
 */
const api = new URL("/api/prompts", document.baseURI);

const $ = (sel) => document.querySelector(sel);

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** `code spans` → <code>, everything else plain text (no innerHTML anywhere). */
function rich(str) {
  const frag = document.createDocumentFragment();
  for (const part of String(str ?? "").split(/(`[^`]+`)/g)) {
    if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) {
      frag.append(el("code", null, part.slice(1, -1)));
    } else if (part) {
      frag.append(document.createTextNode(part));
    }
  }
  return frag;
}

function copyButton(read) {
  const btn = el("button", "d-copy", "copy");
  btn.type = "button";
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(read());
      btn.textContent = "copied \u2713";
    } catch {
      btn.textContent = "failed";
    }
    setTimeout(() => (btn.textContent = "copy"), 1400);
  });
  return btn;
}

function codeBlock(text) {
  const wrap = el("div", "d-code");
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  code.textContent = text;
  pre.append(code);
  wrap.append(pre, copyButton(() => text));
  return wrap;
}

function label(text) {
  return el("p", "label", text);
}

function optionsTable(rows) {
  const table = el("table", "d-table");
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const h of ["Option", "Default", "Notes"]) headRow.append(el("th", null, h));
  thead.append(headRow);
  const tbody = document.createElement("tbody");
  for (const [name, def, note] of rows) {
    const tr = document.createElement("tr");
    const nameTd = document.createElement("td");
    nameTd.append(el("code", null, name));
    const defTd = document.createElement("td");
    defTd.append(rich(def));
    const noteTd = document.createElement("td");
    noteTd.append(rich(note));
    tr.append(nameTd, defTd, noteTd);
    tbody.append(tr);
  }
  table.append(thead, tbody);
  return table;
}

/** One effect: head, summary, import/markup/usage blocks, options, notes. */
function effectArticle(p) {
  const art = el("article", "d-fx");
  art.id = `fx-${p.id}`;

  const head = el("header", "d-fx__head");
  const h4 = el("h4", "d-fx__title");
  h4.append(el("code", null, p.id));
  head.append(h4, el("span", "d-fx__tag", p.title));
  art.append(head);

  const sum = el("p", "d-fx__sum");
  sum.append(rich(p.summary));
  art.append(sum);

  art.append(label("Import"));
  art.append(codeBlock(`import { ${p.imports.join(", ")} } from "@cosmictraveler002/anim-kit";`));

  if (p.markup) {
    art.append(label("Markup"));
    art.append(codeBlock(p.markup));
  }
  if (p.usage) {
    art.append(label("Usage"));
    art.append(codeBlock(p.usage));
  }
  if (p.options?.length) {
    art.append(label("Options"));
    art.append(optionsTable(p.options));
  }
  if (p.notes?.length) {
    art.append(label("Notes"));
    const ul = el("ul", "d-notes");
    for (const note of p.notes) {
      const li = document.createElement("li");
      li.append(rich(note));
      ul.append(li);
    }
    art.append(ul);
  }

  const promptBtn = el("button", "d-prompt-btn", "copy full prompt");
  promptBtn.type = "button";
  promptBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(p.text ?? "");
      promptBtn.textContent = "copied \u2713";
    } catch {
      promptBtn.textContent = "copy failed";
    }
    setTimeout(() => (promptBtn.textContent = "copy full prompt"), 1400);
  });
  art.append(promptBtn);

  return art;
}

function navLink(hash, text, cls) {
  const a = el("a", cls, text);
  a.href = hash;
  return a;
}

/** Sidebar groups + one section per category, effects grouped by subcategory. */
function render(data) {
  const byId = new Map(data.prompts.map((p) => [p.id, p]));
  const nav = $("#d-nav");
  const content = $("#d-content");
  content.textContent = "";

  const missing = [];
  for (const cat of data.categories) {
    const group = el("div", "d-nav__group");
    group.append(navLink(`#cat-${cat.id}`, cat.name, "d-nav__cat"));

    const sec = el("section", "d-sec d-cat");
    sec.id = `cat-${cat.id}`;
    const h2 = el("h2", "d-h2", cat.name);
    const blurb = el("p", "d-lede");
    blurb.append(rich(cat.blurb));
    sec.append(h2, blurb);

    for (const sub of cat.subcategories) {
      sec.append(el("h3", "d-h3", sub.name));
      for (const id of sub.effects) {
        const p = byId.get(id);
        if (!p) {
          missing.push(id);
          continue;
        }
        sec.append(effectArticle(p));
        group.append(navLink(`#fx-${id}`, id, "d-nav__fx"));
      }
    }
    nav.append(group);
    content.append(sec);
  }

  if (missing.length) {
    content.append(el("p", "d-warn", `Catalogue is missing entries for: ${missing.join(", ")}`));
  }
}

/** Fill the static code blocks — version pin comes from the payload. */
function fillStatic(data) {
  const v = data.version;
  $("#d-version").textContent = v;

  const pkg = `https://cdn.jsdelivr.net/npm/@cosmictraveler002/anim-kit@${v}`;
  $("#d-cdn-css").textContent = `<link rel="stylesheet" href="${pkg}/dist/styles/anim-kit.css" />`;
  $("#d-cdn-map").textContent = [
    `<script type="importmap">`,
    `  {`,
    `    "imports": {`,
    `      "@cosmictraveler002/anim-kit": "${pkg}/dist/index.js",`,
    `      "gsap": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/index.js",`,
    `      "gsap/ScrollTrigger": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/ScrollTrigger.js",`,
    `      "gsap/SplitText": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/SplitText.js",`,
    `      "gsap/Draggable": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/Draggable.js",`,
    `      "gsap/CustomEase": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/CustomEase.js",`,
    `      "gsap/Flip": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/Flip.js",`,
    `      "gsap/ScrollSmoother": "https://cdn.jsdelivr.net/npm/gsap@3.15.0/ScrollSmoother.js",`,
    `      "lenis": "https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.mjs"`,
    `    }`,
    `  }`,
    `</script>`,
  ].join("\n");

  $("#d-boiler").textContent = `import {
  smoothScroll, lineReveal, clipWipe, mediaSettle,
} from "@cosmictraveler002/anim-kit";

// 1 — smooth scroll first: ScrollTrigger syncs to the Lenis proxy
const scroller = smoothScroll({ lerp: 0.08, smoothWheel: true });

// 2 — create effects once the markup is in the DOM; each returns destroy()
const teardown = [
  lineReveal("[data-lines]", { mode: "scroll" }),
  clipWipe("[data-figure]", { from: "left", replay: true }),
  mediaSettle("[data-settle]", { from: 1.15, replay: true }),
];

// 3 — destroy on page exit (or before an SPA route swap)
addEventListener("pagehide", () => {
  teardown.forEach((destroy) => destroy());
  scroller.destroy();
}, { once: true });`;
}

/** Copy buttons for the static blocks in docs.html. */
function wireStaticCopies() {
  for (const wrap of document.querySelectorAll(".d-code[data-static]")) {
    wrap.append(copyButton(() => wrap.querySelector("code").textContent));
  }
}

/** Highlight the sidebar entry for whatever section is in the reading band. */
function wireSpy() {
  if (!("IntersectionObserver" in window)) return;
  const links = new Map();
  for (const a of document.querySelectorAll("#d-nav a")) {
    links.set(a.getAttribute("href"), a);
  }

  const revealInNav = (link) => {
    const side = link.closest(".d-side");
    if (!side) return;
    const r = link.getBoundingClientRect();
    const s = side.getBoundingClientRect();
    if (r.top < s.top + 8 || r.bottom > s.bottom - 8) {
      side.scrollTop += r.top - s.top - 24;
    }
  };

  const obs = new IntersectionObserver(
    (entries) => {
      const hit = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!hit) return;
      const active = links.get(`#${hit.target.id}`);
      if (!active) return;
      document.querySelectorAll("#d-nav a.is-active").forEach((a) => a.classList.remove("is-active"));
      active.classList.add("is-active");
      revealInNav(active);
    },
    { rootMargin: "20% 0px -70% 0px" },
  );
  for (const sec of document.querySelectorAll("#getting-started, .d-cat, .d-fx")) {
    obs.observe(sec);
  }
}

async function main() {
  try {
    const res = await fetch(api);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    fillStatic(data);
    render(data);
    wireStaticCopies();
    wireSpy();
  } catch (err) {
    $("#d-version").textContent = "?";
    const content = $("#d-content");
    content.textContent = "";
    content.append(
      el(
        "p",
        "d-warn",
        `Catalogue unavailable — start the demo server (npm run demo) so /api/prompts responds. (${err})`,
      ),
    );
  }
}

main();
