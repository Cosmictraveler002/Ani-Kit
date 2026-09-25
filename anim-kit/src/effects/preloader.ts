/**
 * Preloader — the full-screen intro from dzinrstudio.com.
 *
 * What it does on the real site:
 *   1. A big number counts 0 → 100 in the bottom-left corner (steps of 5,
 *      every 200ms — i.e. a 4s counter), sliding in from x:-100px.
 *   2. An SVG "!" glyph is revealed bottom-up via `clip-path: inset(N% 0 0 0)`
 *      driven by the same progress.
 *   3. When the count hits 100 the glyph scales to 35x and fades out with the
 *      `ak-preload-out` ease (delay 5s), then the backdrop fades (delay 5.5s).
 *   4. The whole overlay unmounts ~1s later. A `sessionStorage` flag skips the
 *      preloader on subsequent visits within the session.
 */
import { gsap, initGSAP, EASES, killTweens } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { one, prefersReducedMotion } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface PreloaderOptions extends CommonOptions {
  /** Root overlay element. */
  root: string | HTMLElement;
  /** The SVG glyph that fills up. Defaults to the first svg inside `root`. */
  glyph?: string | HTMLElement;
  /** Element receiving the 0→100 number. Defaults to first element with `[data-counter]`. */
  counter?: string | HTMLElement;
  /** Solid backdrop behind the glyph. Defaults to `[data-backdrop]`. */
  backdrop?: string | HTMLElement;
  /** Total counter duration in seconds. @default 4 */
  duration?: number;
  /** Counter increment per tick. @default 5 */
  step?: number;
  /** Interval between ticks in ms. @default 200 */
  interval?: number;
  /** Hide when already shown this session. @default true */
  sessionGuard?: boolean;
  /** sessionStorage key. @default "ak-preloader-shown" */
  storageKey?: string;
  /** Called once the overlay has finished and should be removed. */
  onComplete?: () => void;
}

/**
 * Intro preloader — 0→100 counter, glyph `inset()` fill, scale-out exit.
 *
 * Accepts the library's standard positional form **or** an options object:
 *   preloader("#preloader", { duration: 4 })
 *   preloader({ root: "#preloader", duration: 4 })
 */
export function preloader(options: PreloaderOptions): Destroy;
export function preloader(target: TargetLike, options?: Partial<PreloaderOptions>): Destroy;
export function preloader(
  targetOrOptions: PreloaderOptions | TargetLike,
  maybeOptions: Partial<PreloaderOptions> = {},
): Destroy {
  initGSAP();

  const options: PreloaderOptions = isTargetArg(targetOrOptions)
    ? { ...maybeOptions, root: (targetOrOptions ?? maybeOptions.root) as PreloaderOptions["root"] }
    : targetOrOptions;

  const {
    duration = 4,
    step = 5,
    interval = 200,
    sessionGuard = true,
    storageKey = "ak-preloader-shown",
    onComplete,
  } = options;

  const root = one(options.root);
  if (!root) return () => {};
  const overlay: HTMLElement = root;

  const glyph = options.glyph ? one(options.glyph) : root.querySelector("svg");
  const counterEl = options.counter
    ? one(options.counter)
    : root.querySelector<HTMLElement>("[data-counter]");
  const backdrop = options.backdrop
    ? one(options.backdrop)
    : root.querySelector<HTMLElement>("[data-backdrop]");

  if (sessionGuard && sessionStorage.getItem(storageKey)) {
    overlay.style.display = "none";
    onComplete?.();
    return () => {};
  }

  // Reduced motion: never block the page behind a counting intro.
  if (prefersReducedMotion() && !options.force) {
    overlay.style.display = "none";
    onComplete?.();
    return () => {};
  }

  return guard(options, () => run());

  function run(): Destroy {
    const timers: number[] = [];
    let value = 0;
    let done = false;

    // Entrance: number slides in from the left.
    if (counterEl) {
      gsap.fromTo(
        counterEl,
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
      );
    }

    // Glyph fills bottom → top, tied to the counter.
    if (glyph) {
      gsap.set(glyph, { clipPath: "inset(100% 0px 0px 0px)" });
      gsap.to(glyph, {
        clipPath: "inset(0% 0px 0px 0px)",
        duration,
        ease: "power1.inOut",
      });
    }

    const tick = () => {
      value = Math.min(100, value + step);
      if (counterEl) counterEl.textContent = String(value);
      if (value >= 100) {
        finish();
        return;
      }
      timers.push(window.setTimeout(tick, interval));
    };
    timers.push(window.setTimeout(tick, interval));

    function finish() {
      if (done) return;
      done = true;

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem(storageKey, "true");
          overlay.style.display = "none";
          onComplete?.();
        },
      });

      // Glyph blows up and dissolves…
      if (glyph) {
        tl.to(
          glyph,
          {
            scale: 35,
            opacity: 0,
            duration: 0.6,
            ease: EASES.preloadOut,
            transformOrigin: "center 50%",
          },
          1,
        );
      }
      // …the number exits, …
      if (counterEl) {
        tl.to(counterEl, { opacity: 0, x: -40, duration: 0.35, ease: "power2.in" }, 1.15);
      }
      // …then the backdrop fades to reveal the page.
      if (backdrop) {
        tl.to(backdrop, { opacity: 0, duration: 0.5, ease: "power2.out" }, 1.5);
      } else {
        tl.to(root, { opacity: 0, duration: 0.5 }, 1.5);
      }
      tl.set(root, { pointerEvents: "none" }, 1.6);
      tl.call(() => onComplete?.(), undefined, ">-0.1");
    }

    return () => {
      timers.forEach(clearTimeout);
      killTweens([root, glyph, counterEl, backdrop]);
    };
  }
}

/** Distinguish a positional DOM target from an options object. */
function isTargetArg(v: PreloaderOptions | TargetLike): v is TargetLike {
  if (typeof v === "string" || v == null) return true;
  if (typeof v !== "object") return false;
  if (Array.isArray(v)) return true;
  const rec = v as unknown as Record<string, unknown>;
  if ("nodeType" in rec) return true; // Element / Node
  return typeof rec.length === "number" && "item" in rec; // NodeList
}
