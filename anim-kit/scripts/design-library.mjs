/**
 * Colour & font library — the data behind demo/library.html.
 *
 * Each entry samples one design system: a 7-token semantic palette plus a
 * Google Fonts pairing. When the original site uses a PREMIUM face, the
 * entry records it and pairs it with the closest FREE alternative (Google
 * Fonts / OFL) — only free families ever reach the page.
 *
 * Single source of truth:
 *   scripts/serve.mjs   → GET /api/library   (dev server)
 *   sync-demo-live.mjs  → library.json        (static host fallback)
 *   demo-smoke.mjs      → validateLibrary()   (fails the test suite)
 */
import { CDN_VERSION } from "./prompts.mjs";

/** Free Google Fonts families we ship, with their available weight range. */
export const FREE_FAMILIES = {
  "Inter": [100, 900],
  "Inter Tight": [100, 900],
  "Instrument Sans": [400, 700],
  "Archivo": [100, 900],
  "Oswald": [200, 700],
  "IBM Plex Mono": [100, 700],
  "Geist Mono": [100, 900],
  "Fragment Mono": [400, 400],
  "Space Grotesk": [300, 700],
  "DM Sans": [100, 1000],
  "Sometype Mono": [400, 400],
};

/**
 * The catalogue. Every palette value is sampled from the rendered site
 * (computed styles) or its stylesheet; every `original` font names the face
 * the site actually ships, every `family` is the free pairing that replaces it.
 */
export const LIBRARY = [
  {
    name: "Night Grain",
    slug: "night-grain",
    mood: "dark",
    blurb:
      "Charcoal grain and cream type on near-black — a moody studio dark warmed by paper highlights and one signal red.",
    source: { site: "bymonolog.com", url: "https://bymonolog.com/" },
    palette: {
      bg: "#080807",
      surface: "#181715",
      text: "#e8e8e3",
      muted: "#938f8a",
      accent: "#c90f0f",
      accent2: "#efeeec",
      border: "#393632",
    },
    fonts: {
      display: { family: "Instrument Sans", original: "Khteka", weights: [400, 500, 700], note: "Khteka is a licensed grotesque — Instrument Sans carries the same cut, characterful terminals." },
      body: { family: "Instrument Sans", original: "Khteka", weights: [400, 500], note: "The site runs one face throughout; Instrument Sans covers both roles." },
      mono: { family: "Geist Mono", original: "Suisse Mono", weights: [400, 500], note: "Suisse Intl Mono is premium — Geist Mono is the closest neutral grotesque mono." },
    },
  },
  {
    name: "Chalkline",
    slug: "chalkline",
    mood: "light",
    blurb:
      "Gallery white, gallery black, one deep cobalt jolt — monolithic display type over microscopic mono details.",
    source: { site: "noth.in", url: "https://www.noth.in/" },
    palette: {
      bg: "#ffffff",
      surface: "#fafafa",
      text: "#000000",
      muted: "#8e8e8e",
      accent: "#2500ad",
      accent2: "#0ba954",
      border: "#dddddd",
    },
    fonts: {
      display: { family: "Inter", original: "PP Neue Montreal", weights: [300, 400, 500, 600, 700], note: "PP Neue Montreal is premium — Inter matches its neutral neo-grotesque voice and full weight range." },
      body: { family: "Inter", original: "PP Neue Montreal", weights: [400, 500], note: "Same substitution as display — the site uses one family everywhere." },
      mono: { family: "IBM Plex Mono", original: "IBM Plex Mono", weights: [400, 500], note: "Already free — the source site ships IBM Plex Mono as-is." },
    },
  },
  {
    name: "Acid Bloom",
    slug: "acid-bloom",
    mood: "dark",
    blurb:
      "Ink-dark canvas, warm cream copy and acid-lime shouts — organic texture with pop-art red.",
    source: { site: "lamalama.com", url: "https://lamalama.com/" },
    palette: {
      bg: "#1a1c1c",
      surface: "#000000",
      text: "#f9f4eb",
      muted: "#f9f4eb99",
      accent: "#d0ff7e",
      accent2: "#e75d60",
      border: "#f9f4eb1a",
    },
    fonts: {
      display: { family: "Archivo", original: "Suisse BP Int'l", weights: [400, 700], note: "Suisse BP Int'l is a licensed Swiss grotesque — Archivo matches its wide, confident capitals." },
      body: { family: "Inter", original: "Suisse BP Int'l", weights: [400, 500], note: "Suisse Int'l is premium — Inter is the standard free stand-in for its neutral text colour." },
      mono: { family: "Sometype Mono", original: "Sometype", weights: [400], note: "The site's Sometype pairing maps to Sometype Mono on Google Fonts — free as-is." },
    },
  },
  {
    name: "Rose Static",
    slug: "rose-static",
    mood: "light",
    blurb:
      "Warm-white paper, condensed gothic black and lip-red — glam grunge with torn-collage energy.",
    source: { site: "serotoninn.com", url: "https://serotoninn.com/" },
    palette: {
      bg: "#fff9f7",
      surface: "#eedfdf",
      text: "#000000",
      muted: "#b9b8b8",
      accent: "#ed3833",
      accent2: "#2ec1c5",
      border: "#dedede",
    },
    fonts: {
      display: { family: "Oswald", original: "Thunder", weights: [200, 400, 500, 600, 700], note: "Thunder is a licensed condensed display face — Oswald is the closest free condensed with the same weight ladder." },
      body: { family: "Inter", original: "Inter", weights: [400, 500], note: "Already free — the source site ships Inter as-is." },
      mono: { family: "Fragment Mono", original: "PP Fraktion Mono", weights: [400], note: "PP Fraktion Mono is premium — Fragment Mono carries the same squared technical mono tone." },
    },
  },
  {
    name: "Paper Grid",
    slug: "paper-grid",
    mood: "light",
    blurb:
      "Cream graph paper, cornflower ink and hand-written notes — a working sketchbook, published.",
    source: { site: "illoca.unseen.co", url: "https://illoca.unseen.co/" },
    palette: {
      bg: "#fdf8f0",
      surface: "#e5d6bc",
      text: "#373737",
      muted: "#8b8b8b",
      accent: "#5073d0",
      accent2: "#ec633d",
      border: "#eadfc9",
    },
    fonts: {
      display: { family: "Space Grotesk", original: "F37 Analog", weights: [500, 600, 700], note: "F37 Analog is a licensed retro-technical face — Space Grotesk shares its quirks and geometric skeleton." },
      body: { family: "DM Sans", original: "Graphik Web", weights: [400, 500], note: "Graphik is premium — DM Sans matches its friendly, workmanlike text colour (and ships on the site too)." },
      mono: { family: "Geist Mono", original: "Geist Mono", weights: [400, 500], note: "Already free — the source site ships Geist Mono as-is." },
    },
  },
  {
    name: "Thermal Print",
    slug: "thermal-print",
    mood: "light",
    blurb:
      "Report-clean white and editorial black — thermal-gradient art, signal orange and pastel lilac.",
    source: { site: "stateofaidesign.com", url: "https://stateofaidesign.com/" },
    palette: {
      bg: "#ffffff",
      surface: "#000000",
      text: "#000000",
      muted: "#00000099",
      accent: "#fe7141",
      accent2: "#cdabfe",
      border: "#d1ddd3",
    },
    fonts: {
      display: { family: "Inter Tight", original: "Beausite Classic", weights: [400, 500, 700], note: "Beausite Classic is a licensed neo-grotesque — Inter Tight keeps its tight editorial setting." },
      body: { family: "Inter", original: "Inter", weights: [400, 500], note: "Already free — the source site ships Inter as-is." },
      mono: { family: "Geist Mono", original: "Geist Mono", weights: [400, 500], note: "Already free — the source site ships Geist Mono (and Fragment Mono) as-is." },
    },
  },
  {
    name: "Volt Chrome",
    slug: "volt-chrome",
    mood: "dark",
    blurb:
      "Electric ultramarine with chrome objects and white type — a portfolio floating in blue space.",
    source: { site: "k95.it", url: "https://k95.it/en" },
    palette: {
      bg: "#1500e1",
      surface: "#1100b8",
      text: "#ffffff",
      muted: "#ffffff8c",
      accent: "#ffffff",
      accent2: "#0c0a0c",
      border: "#ffffff1f",
    },
    fonts: {
      display: { family: "Archivo", original: "adaptive (custom)", weights: [400, 500, 700], note: "The site's custom variable grotesque spans 100–900 — Archivo covers the same range with a similar squared-neutral cut." },
      body: { family: "Archivo", original: "adaptive (custom)", weights: [400, 500], note: "One custom family drives the whole site — Archivo stands in for both roles." },
    },
  },
];

const TOKENS = ["bg", "surface", "text", "muted", "accent", "accent2", "border"];
const HEX = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/;
const ROLES = ["display", "body", "mono"];

/** Per-entry Google Fonts css2 URL — every role merged into one request. */
export function fontCssUrl(entry) {
  const byFam = new Map();
  for (const role of ROLES) {
    const f = entry.fonts[role];
    if (!f) continue;
    const set = byFam.get(f.family) ?? new Set();
    for (const w of f.weights) set.add(w);
    byFam.set(f.family, set);
  }
  const parts = [...byFam].map(
    ([fam, ws]) =>
      `family=${encodeURIComponent(fam).split("%20").join("+")}:wght@${[...ws].sort((a, b) => a - b).join(";")}`,
  );
  return `https://fonts.googleapis.com/css2?${parts.join("&")}&display=swap`;
}

/** Per-entry HTML snippet — preconnect hints + the stylesheet link. */
export function fontLinkHtml(entry) {
  return [
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    `<link rel="stylesheet" href="${fontCssUrl(entry)}">`,
  ].join("\n");
}

/** Per-entry copy block — the 7 tokens + font stacks as `:root` CSS. */
export function cssVars(entry) {
  const p = entry.palette;
  const lines = [
    `  --bg: ${p.bg};`,
    `  --surface: ${p.surface};`,
    `  --text: ${p.text};`,
    `  --muted: ${p.muted};`,
    `  --accent: ${p.accent};`,
    `  --accent-2: ${p.accent2};`,
    `  --border: ${p.border};`,
    "",
    `  --font-display: "${entry.fonts.display.family}", sans-serif;`,
    `  --font-body: "${entry.fonts.body.family}", sans-serif;`,
  ];
  if (entry.fonts.mono) lines.push(`  --font-mono: "${entry.fonts.mono.family}", monospace;`);
  return `/* ${entry.name} — palette + type from ${entry.source.site} */\n:root {\n${lines.join("\n")}\n}`;
}

/** GET /api/library + static library.json payload. */
export function libraryPayload() {
  return {
    version: CDN_VERSION,
    count: LIBRARY.length,
    entries: LIBRARY.map((e) => ({
      name: e.name,
      slug: e.slug,
      mood: e.mood,
      blurb: e.blurb,
      site: e.source.site,
      url: e.source.url,
      palette: { ...e.palette },
      fonts: Object.fromEntries(
        ROLES.filter((r) => e.fonts[r]).map((r) => [r, { ...e.fonts[r] }]),
      ),
      css: { fontsUrl: fontCssUrl(e), fontLink: fontLinkHtml(e), vars: cssVars(e) },
    })),
  };
}

/**
 * Validate every entry. Throws with a slug-anchored message — demo-smoke
 * calls this so a bad palette or a non-free font fails `npm test`.
 * Returns the entry count.
 */
export function validateLibrary() {
  const slugs = new Set();
  for (const e of LIBRARY) {
    const at = (m) => `library entry "${e.slug ?? e.name}": ${m}`;
    if (!e.name || !e.blurb) throw new Error(at("name + blurb are required"));
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.slug || "")) throw new Error(at("slug must be kebab-case"));
    if (slugs.has(e.slug)) throw new Error(at("duplicate slug"));
    slugs.add(e.slug);
    if (!e.source?.url?.startsWith("https://")) throw new Error(at("source.url must be https"));
    if (!e.source.site) throw new Error(at("source.site is required"));
    if (!["dark", "light"].includes(e.mood)) throw new Error(at('mood must be "dark" or "light"'));

    for (const t of TOKENS) {
      const v = e.palette?.[t];
      if (!v || !HEX.test(v)) throw new Error(at(`palette.${t} must be a 6- or 8-digit hex (saw ${v})`));
    }

    for (const role of ROLES) {
      const f = e.fonts?.[role];
      if (!f) {
        if (role === "mono") continue; // mono is optional
        throw new Error(at(`fonts.${role} is required`));
      }
      const range = FREE_FAMILIES[f.family];
      if (!range) throw new Error(at(`fonts.${role}.family "${f.family}" is not in FREE_FAMILIES (free fonts only)`));
      if (!Array.isArray(f.weights) || !f.weights.length)
        throw new Error(at(`fonts.${role}.weights must be a non-empty array`));
      for (const w of f.weights) {
        if (!Number.isInteger(w) || w < range[0] || w > range[1])
          throw new Error(at(`fonts.${role}.weights: ${w} outside ${f.family} ${range[0]}–${range[1]}`));
      }
      if (!f.original) throw new Error(at(`fonts.${role}.original must name the face the site ships`));
      if (!f.note) throw new Error(at(`fonts.${role}.note must explain the free pairing`));
    }

    if (!fontCssUrl(e).startsWith("https://fonts.googleapis.com/css2?family="))
      throw new Error(at("generated font URL must target fonts.googleapis.com"));
  }
  if (LIBRARY.length < 7) throw new Error(`library must ship at least 7 entries (saw ${LIBRARY.length})`);
  return LIBRARY.length;
}
