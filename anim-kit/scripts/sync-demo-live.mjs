/**
 * Generate demo_live/ from demo/ — a deployment-ready copy of the demo that
 * runs from any static host (GitHub Pages, Netlify, S3, …) with no build:
 *
 *   • import map + stylesheet → version-pinned jsdelivr CDN URLs (the same
 *     ones the copy prompts and docs teach); nothing under /node_modules,
 *     /dist or /src is needed on the host.
 *   • internal links          → relative ("/demo/x" → "./x") so the folder
 *     works at any base path.
 *   • prompts.json            → static snapshot of promptsPayload(), so the
 *     dock + docs work without the Node server (demo.js/docs.js try
 *     /api/prompts first and fall back to this file).
 *
 * demo.js and docs.js are copied byte-for-byte — the static fallback lives
 * in the source so both trees stay identical.
 *
 * demo-smoke re-runs this transform and fails if demo_live/ is stale:
 * edit demo/, then `npm run sync:live`.
 */
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { CDN_VERSION, promptsPayload } from "./prompts.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

/** Installed version of a dependency — keeps CDN pins truthful (gsap@…, lenis@…). */
const depVersion = (name) =>
  JSON.parse(readFileSync(join(root, "node_modules", name, "package.json"), "utf8")).version;

/** Rewrite the page's local import map to version-pinned CDN URLs. */
const wireImportMap = (html) =>
  html.replace(/<script type="importmap">([\s\S]*?)<\/script>/, (block, body) => {
    const imports = JSON.parse(body).imports;
    const cdn = {};
    for (const [spec, url] of Object.entries(imports)) {
      if (spec === "@cosmictraveler002/anim-kit") {
        cdn[spec] = `https://cdn.jsdelivr.net/npm/@cosmictraveler002/anim-kit@${CDN_VERSION}/dist/index.js`;
        continue;
      }
      const m = url.match(/^\/node_modules\/((?:@[^/]+\/)?[^/]+)\/(.+)$/);
      if (!m) throw new Error(`sync-demo-live: unmapped import ${spec} → ${url}`);
      cdn[spec] = `https://cdn.jsdelivr.net/npm/${m[1]}@${depVersion(m[1])}/${m[2]}`;
    }
    const json = JSON.stringify({ imports: cdn }, null, 2)
      .split("\n")
      .map((line) => `      ${line}`)
      .join("\n");
    return `<script type="importmap">\n${json}\n    </script>`;
  });

/** HTML rewrites: CDN stylesheet + (if present) import map, relative links. */
const wireHtml = (html) =>
  wireImportMap(html)
    .replace(
      'href="/src/styles/anim-kit.css"',
      `href="https://cdn.jsdelivr.net/npm/@cosmictraveler002/anim-kit@${CDN_VERSION}/dist/styles/anim-kit.css"`,
    )
    .split('"/demo/')
    .join('"./');

/**
 * demo_live/ contents as { fileName: contents }. The CLI below writes them;
 * demo-smoke compares the on-disk folder against this to catch staleness.
 */
export function buildFiles() {
  const files = {};
  for (const name of ["index.html", "docs.html"]) {
    files[name] = wireHtml(readFileSync(join(root, "demo", name), "utf8"));
  }
  for (const name of ["demo.js", "docs.js"]) {
    files[name] = readFileSync(join(root, "demo", name), "utf8");
  }
  files["prompts.json"] = JSON.stringify(promptsPayload(), null, 2);
  // Vercel hosts answer /api/prompts from the static file — other hosts use
  // the client-side prompts.json fallback in demo.js/docs.js.
  files["vercel.json"] =
    JSON.stringify({ rewrites: [{ source: "/api/prompts", destination: "/prompts.json" }] }, null, 2) + "\n";
  return files;
}

function main() {
  const files = buildFiles();
  const dir = join(root, "demo_live");
  mkdirSync(dir, { recursive: true });
  for (const [name, body] of Object.entries(files)) {
    writeFileSync(join(dir, name), body);
  }
  for (const name of readdirSync(dir)) {
    if (!(name in files)) rmSync(join(dir, name), { recursive: true, force: true });
  }
  console.log(`demo_live regenerated: ${Object.keys(files).join(", ")}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
