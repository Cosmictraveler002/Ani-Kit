/**
 * Zero-dependency static server for the demo page.
 * Serves the package root so /demo/index.html can import /dist/index.js.
 *
 * API:
 *   GET /api/prompts  →  { count, prompts: [{ id, title, summary, text }] }
 *                        copy-paste prompts for every anim-kit effect
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { promptsById, promptsPayload } from "./prompts.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const port = Number(process.env.PORT) || 4321;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".map": "application/json",
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    /* ---------------- copy-prompt API ---------------- */
    if (url.pathname === "/api/prompts") {
      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
      res.end(JSON.stringify(promptsPayload(), null, 2));
      return;
    }
    const single = url.pathname.match(/^\/api\/prompts\/([\w-]+)$/);
    if (single) {
      const text = promptsById()[single[1]];
      if (!text) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end(`unknown prompt: ${single[1]}`);
        return;
      }
      res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      });
      res.end(text);
      return;
    }

    /* ---------------- static files ---------------- */
    let path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
    if (path.endsWith("/")) path += "index.html";

    let file = join(root, path);
    const info = await stat(file).catch(() => null);
    if (info?.isDirectory()) file = join(file, "index.html");

    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404");
  }
}).listen(port, () => {
  console.log(`anim-kit demo → http://localhost:${port}/demo/`);
});
