const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

const OUT = "C:/Kalakriti/_scrape/noth/_live";
const ASSETS = path.join(OUT, "assets");
fs.mkdirSync(ASSETS, { recursive: true });

const PAGES = [
  ["home", "https://www.noth.in/"],
  ["works", "https://www.noth.in/works"],
  ["w_aurbse", "https://www.noth.in/works/aurbse"],
  ["w_france-chimie", "https://www.noth.in/works/france-chimie"],
  ["w_haptify", "https://www.noth.in/works/haptify"],
  ["w_in-cognita", "https://www.noth.in/works/in-cognita"],
  ["w_lgm", "https://www.noth.in/works/lgm"],
  ["w_mova", "https://www.noth.in/works/mova"],
  ["w_utopia", "https://www.noth.in/works/utopia"],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const safeName = (url) => {
  try {
    const u = new URL(url);
    let s = (u.host + u.pathname).replace(/[^a-zA-Z0-9._-]+/g, "_");
    if (s.length > 120) s = s.slice(0, 110) + "_" + u.pathname.length;
    if (!/\.(js|mjs|css|json)$/.test(s)) s += ".txt";
    return s;
  } catch {
    return "bad_url";
  }
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new",
    args: ["--hide-scrollbars", "--disable-features=TranslateUI"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const savedBodies = new Set(); // dedupe across whole session
  let currentKey = "init";
  const perPage = {};

  const record = () => {
    if (!perPage[currentKey]) perPage[currentKey] = { requests: [], failed: [], console: [], errors: [] };
    return perPage[currentKey];
  };

  page.on("request", (req) => {
    record().requests.push({
      url: req.url(),
      method: req.method(),
      type: req.resourceType(),
      initiator: (req.initiator() && req.initiator().type) || "",
    });
  });
  page.on("requestfailed", (req) => {
    record().failed.push({ url: req.url(), error: (req.failure() && req.failure().errorText) || "" });
  });
  page.on("response", (resp) => {
    const type = resp.request().resourceType();
    const url = resp.url();
    const wantBody =
      ["script", "stylesheet", "xhr", "fetch"].includes(type) ||
      /\.(js|mjs|css|json)(\?|$)/.test(url);
    record().requests.push({ status: resp.status(), url, type });
    if (!wantBody || savedBodies.has(url)) return;
    savedBodies.add(url);
    resp
      .buffer()
      .then((buf) => {
        if (buf.length > 0 && buf.length < 25 * 1024 * 1024) {
          fs.writeFileSync(path.join(ASSETS, safeName(url)), buf);
        }
      })
      .catch(() => {});
  });
  page.on("console", (msg) => {
    if (["error", "warning"].includes(msg.type())) record().console.push(msg.type() + ": " + msg.text().slice(0, 300));
  });
  page.on("pageerror", (e) => record().errors.push(String(e).slice(0, 300)));

  for (const [key, url] of PAGES) {
    currentKey = key;
    const dir = path.join(OUT, key);
    fs.mkdirSync(dir, { recursive: true });
    const t0 = Date.now();

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 }).catch((e) => record().errors.push("goto: " + e));
    await sleep(4500); // let preloader/IX2 boot

    // --- method: runtime animation config (Webflow IX2 store + animation globals)
    const runtime = await page.evaluate(() => {
      const out = { globals: [], ix2: null, webflowKeys: null };
      try {
        out.globals = Object.keys(window).filter((k) =>
          /gsap|lenis|three|lottie|swiper|splitting|motion|anime|barba|scrolltrigger|matter|pixi|texture|video/i.test(k),
        );
      } catch {}
      try {
        if (window.Webflow) {
          out.webflowKeys = Object.keys(window.Webflow);
          const ix2 = window.Webflow.require && window.Webflow.require("ix2");
          if (ix2 && ix2.store) out.ix2 = ix2.store.getState();
        }
      } catch (e) { out.ix2Error = String(e).slice(0, 200); }
      return out;
    });
    fs.writeFileSync(path.join(dir, "runtime.json"), JSON.stringify(runtime, null, 1));

    // --- method: DOM snapshot before interaction
    const dom0 = await page.evaluate(() => document.documentElement.outerHTML);
    fs.writeFileSync(path.join(dir, "dom-initial.html"), dom0);

    // --- method: drive the page like a user (scroll to bottom in steps)
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= height; y += 700) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await sleep(90);
    }
    await sleep(800);

    // hover work cards (triggers cursor pill / hover IX2) + move cursor around
    const cards = await page.evaluate(() =>
      [...document.querySelectorAll('a[href*="/works/"]')].slice(0, 3).map((a) => {
        const r = a.getBoundingClientRect();
        return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2), w: r.width };
      }),
    );
    for (const c of cards) {
      if (c.w > 0 && c.y > 0 && c.y < 890) { await page.mouse.move(c.x, c.y, { steps: 8 }); await sleep(500); }
    }

    // open the MENU (captures overlay markup/state), snapshot, close
    const menuClicked = await page.evaluate(() => {
      const el = [...document.querySelectorAll("div, a, button")].find(
        (e) => e.children.length <= 2 && e.textContent.trim().toUpperCase().startsWith("MENU") && e.getBoundingClientRect().width > 0,
      );
      if (el) { el.click(); return true; }
      return false;
    });
    await sleep(900);
    const domMenu = await page.evaluate(() => document.documentElement.outerHTML);
    fs.writeFileSync(path.join(dir, "dom-menu-open.html"), domMenu);
    if (menuClicked) {
      await page.evaluate(() => {
        const el = [...document.querySelectorAll("div, a, button")].find(
          (e) => e.children.length <= 2 && e.textContent.trim().toUpperCase().startsWith("MENU") && e.getBoundingClientRect().width > 0,
        );
        if (el) el.click();
      });
      await sleep(500);
    }

    // --- method: DOM snapshot after all interaction (lazy content, injected nodes)
    const dom1 = await page.evaluate(() => document.documentElement.outerHTML);
    fs.writeFileSync(path.join(dir, "dom-after-scroll.html"), dom1);

    // complete URL list from the performance timeline (catches anything the events missed)
    const res = await page.evaluate(() =>
      performance.getEntriesByType("resource").map((r) => ({
        name: r.name,
        type: r.initiatorType,
        size: Math.round(r.transferSize || r.encodedBodySize || 0),
      })),
    );
    fs.writeFileSync(path.join(dir, "resources.json"), JSON.stringify(res, null, 1));

    console.log(key + " done in " + ((Date.now() - t0) / 1000).toFixed(1) + "s, resources=" + res.length);
  }

  fs.writeFileSync(path.join(OUT, "session-requests.json"), JSON.stringify(perPage, null, 1));
  console.log("assets saved: " + savedBodies.size);
  await browser.close();
})().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
