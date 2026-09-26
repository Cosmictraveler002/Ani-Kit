/**
 * Colour & font library — renders demo/library.html from the catalogue.
 *
 * Data comes from GET /api/library (scripts/serve.mjs). On a static host
 * (demo_live/ deployed without the Node server) /api/library is missing, so
 * library.json beside the page is the fallback — same pattern as the prompt
 * dock (demo.js) and the docs page (docs.js).
 */
const api = new URL("/api/library", document.baseURI);
const apiStatic = new URL("library.json", document.baseURI);

const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return res.json();
};

const loadLibrary = async () => {
  try {
    return await fetchJson(api);
  } catch {
    return await fetchJson(apiStatic); /* static host: no /api/library */
  }
};

const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

/** One css2 request covering every family the grid renders (no drift, one round-trip). */
const loadFonts = (entries) => {
  const byFam = new Map();
  for (const e of entries) {
    for (const role of ["display", "body", "mono"]) {
      const f = e.fonts[role];
      if (!f) continue;
      const set = byFam.get(f.family) ?? new Set();
      for (const w of f.weights) set.add(w);
      byFam.set(f.family, set);
    }
  }
  if (!byFam.size) return;
  const parts = [...byFam].map(
    ([fam, ws]) =>
      `family=${encodeURIComponent(fam).split("%20").join("+")}:wght@${[...ws].sort((a, b) => a - b).join(";")}`,
  );
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?${parts.join("&")}&display=swap`;
  document.head.appendChild(link);
};

/** Readable swatch label colour for any hex (WCAG relative luminance). */
const readable = (hex) => {
  const h = hex.replace("#", "").slice(0, 6); // drop alpha if 8-digit
  const chan = (i) => parseInt(h.slice(i * 2, i * 2 + 2), 16) / 255;
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * lin(chan(0)) + 0.7152 * lin(chan(1)) + 0.0722 * lin(chan(2));
  // pick whichever label colour yields the higher contrast (crossover at L≈0.179)
  return L > 0.179 ? "#000000" : "#ffffff";
};

const TOKENS = ["bg", "surface", "text", "muted", "accent", "accent2", "border"];

const cardHtml = (e) => {
  const p = e.palette;
  const tokenVars = [
    ...TOKENS.map((t) => `--${t === "accent2" ? "accent-2" : t}:${p[t]}`),
    // single-quoted stacks: the whole thing sits inside a double-quoted
    // style attribute — double quotes here would terminate it early.
    `--font-display:'${e.fonts.display.family}', sans-serif`,
    `--font-body:'${e.fonts.body.family}', sans-serif`,
    ...(e.fonts.mono ? [`--font-mono:'${e.fonts.mono.family}', monospace`] : []),
  ].join(";");

  const swatches = TOKENS.map((t) => {
    const hex = p[t];
    const fg = readable(hex);
    const label = t === "accent2" ? "accent-2" : t;
    return `<button class="l-swatch" type="button" data-hex="${hex}" style="background:${hex};color:${fg}" title="Copy ${hex}">
      <span class="l-swatch__name">${label}</span><span class="l-swatch__hex">${hex}</span></button>`;
  }).join("");

  const fontRows = ["display", "body", "mono"]
    .filter((r) => e.fonts[r])
    .map((r) => {
      const f = e.fonts[r];
      const orig =
        f.original === f.family
          ? `<span class="l-free">free as-is on the source</span>`
          : `<s class="l-orig">${esc(f.original)}</s>`;
      return `<li><strong>${esc(f.family)}</strong><span class="l-role">${r}</span>${orig}<span class="l-free">${f.weights.join(" · ")}</span></li>`;
    })
    .join("");

  const monoFamily = (e.fonts.mono ?? e.fonts.body).family;
  return `<article class="l-card" data-mood="${e.mood}" id="lib-${e.slug}" style="${tokenVars}">
    <div class="l-card__bar"><h2>${esc(e.name)}</h2><span class="l-mood">${e.mood}</span></div>
    <div class="l-preview">
      <span class="l-preview__mono">${esc(e.site)} — ${esc(monoFamily)}</span>
      <h3 class="l-preview__display">${esc(e.name)}</h3>
      <p class="l-preview__body">Body copy in ${esc(e.fonts.body.family)} — the quick brown fox jumps over the lazy dog.</p>
      <span class="l-preview__btn">Get started</span>
    </div>
    <p class="l-blurb">${esc(e.blurb)}</p>
    <div class="l-swatches">${swatches}</div>
    <ul class="l-fonts">${fontRows}</ul>
    <div class="l-actions">
      <button class="l-copy" type="button" data-copy="vars">copy CSS vars</button>
      <button class="l-copy" type="button" data-copy="link">copy &lt;link&gt;</button>
    </div>
    <details class="l-source"><summary>inspired by</summary>
      <a href="${e.url}" target="_blank" rel="noreferrer">${esc(e.site)}</a>
    </details>
  </article>`;
};

const copyText = async (text) => {
  // async clipboard first — it needs a focused document; fall back to the
  // textarea trick when it's missing OR rejects (unfocused window, older
  // browsers), so a copy can never silently die.
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fall through */
    }
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const done = document.execCommand("copy");
    ta.remove();
    return done;
  } catch {
    return false;
  }
};

const flash = (btn, label) => {
  const old = btn.textContent;
  btn.textContent = label;
  btn.classList.add("is-done");
  clearTimeout(btn._t);
  btn._t = setTimeout(() => {
    btn.textContent = old;
    btn.classList.remove("is-done");
  }, 1200);
};

const grid = document.getElementById("l-grid");

try {
  const data = await loadLibrary();
  const payload = new Map(data.entries.map((e) => [e.slug, e]));

  document.getElementById("l-count").textContent = data.count;
  loadFonts(data.entries);
  grid.innerHTML = data.entries.map(cardHtml).join("");

  grid.addEventListener("click", async (ev) => {
    const copyBtn = ev.target.closest("[data-copy]");
    if (copyBtn) {
      const slug = copyBtn.closest(".l-card").id.replace(/^lib-/, "");
      const e = payload.get(slug);
      const text = copyBtn.dataset.copy === "vars" ? e.css.vars : e.css.fontLink;
      const done = await copyText(text);
      flash(copyBtn, done ? "✓ copied" : "copy failed");
      return;
    }
    const swatch = ev.target.closest("[data-hex]");
    if (swatch) {
      const done = await copyText(swatch.dataset.hex);
      if (done) {
        const out = swatch.querySelector(".l-swatch__hex");
        const old = out.textContent;
        out.textContent = "✓ copied";
        setTimeout(() => (out.textContent = old), 1000);
      }
    }
  });

  /* mood filters */
  const filters = [...document.querySelectorAll(".l-filter")];
  for (const btn of filters) {
    btn.addEventListener("click", () => {
      const want = btn.dataset.filter;
      for (const f of filters) f.setAttribute("aria-pressed", String(f === btn));
      for (const card of grid.querySelectorAll(".l-card")) {
        card.hidden = want !== "all" && card.dataset.mood !== want;
      }
    });
  }
} catch (err) {
  grid.innerHTML = `<p class="l-empty">Library unavailable — run <code>npm run demo</code> (serves <code>/api/library</code>) or keep library.json beside the page on a static host. (${esc(err)})</p>`;
  console.error(err);
}
