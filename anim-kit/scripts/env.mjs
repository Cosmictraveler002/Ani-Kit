/**
 * Shared jsdom environment for anim-kit's smoke tests.
 *
 * jsdom is used deliberately: GSAP's CSSPlugin/Draggable feature-probe element
 * style/computed values during registration, which a hand-rolled DOM stub
 * cannot satisfy. jsdom also lacks a few browser APIs the library touches
 * (matchMedia, scrollTo, ResizeObserver), so those are stubbed here — once —
 * before anything imports gsap/lenis.
 *
 *   import { setupDom } from "./env.mjs";
 *   const { dom, window, errors } = setupDom("<html>…</html>");
 */
import { JSDOM, VirtualConsole } from "jsdom";

export function setupDom(html, options = {}) {
  const { url = "http://localhost:4321/demo/", verbose = true } = options;

  const errors = [];
  const report = (err) => {
    errors.push(err);
    if (verbose) console.error(err);
  };

  // jsdom does not implement window.scrollTo — ScrollTrigger calls it during
  // refresh. Swallow that specific "not implemented" only; keep real errors.
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", (err) => {
    if (!String(err.message ?? err).includes("scrollTo")) report(err);
  });
  virtualConsole.on("error", (...args) => report(args.length > 1 ? args : args[0]));
  virtualConsole.on("warn", () => {});
  virtualConsole.on("log", () => {});

  const dom = new JSDOM(html, {
    url,
    pretendToBeVisual: true,
    runScripts: "outside-only", // inline/import-map scripts are inert; tests drive JS themselves
    virtualConsole,
  });
  const { window } = dom;

  // Expose the jsdom window/document before anything imports gsap.
  for (const key of [
    "document", "navigator", "location", "history", "localStorage", "sessionStorage",
    "requestAnimationFrame", "cancelAnimationFrame", "getComputedStyle",
    "Element", "HTMLElement", "Node", "NodeList", "SVGElement", "Event", "CustomEvent",
    "MutationObserver", "devicePixelRatio", "ResizeObserver",
    "Window", "Document", "CSSStyleDeclaration",
  ]) {
    if (key in window && window[key] !== undefined) {
      Object.defineProperty(globalThis, key, {
        value: window[key],
        configurable: true,
        writable: true,
      });
    }
  }

  // jsdom has no matchMedia; make reduced-motion resolve deterministically.
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
  Object.defineProperty(globalThis, "window", { value: window, configurable: true });

  // jsdom does not implement scrollTo; ScrollTrigger calls it on refresh.
  window.scrollTo = () => {};
  window.scroll = 0;

  // Lenis observes its content box with ResizeObserver, unconditionally.
  if (typeof window.ResizeObserver !== "function") {
    class ResizeObserverStub {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    window.ResizeObserver = ResizeObserverStub;
    globalThis.ResizeObserver = ResizeObserverStub;
  }

  // jsdom only provides rAF when pretendToBeVisual is set; guarantee it anyway.
  const raf = window.requestAnimationFrame ?? ((fn) => setTimeout(() => fn(Date.now()), 16));
  const caf = window.cancelAnimationFrame ?? ((id) => clearTimeout(id));
  window.requestAnimationFrame = raf;
  window.cancelAnimationFrame = caf;
  globalThis.requestAnimationFrame = raf;
  globalThis.cancelAnimationFrame = caf;
  // Never copy jsdom's performance onto globalThis — Performance.now recurses.
  globalThis.performance ??= { now: () => Date.now() };

  return { dom, window, errors };
}
