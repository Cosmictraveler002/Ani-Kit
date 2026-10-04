/**
 * Lenis smooth scrolling wired into GSAP ScrollTrigger.
 *
 * Uses the canonical Lenis + GSAP recipe:
 *   lenis.on("scroll", ScrollTrigger.update)
 *   gsap.ticker.add(t => lenis.raf(t * 1000))
 *
 * Driving Lenis from GSAP's ticker (rather than its own rAF) keeps both
 * clocks on the same frame, which is what stops ScrollTrigger from stuttering.
 * Those ticker callbacks receive the *same* adjusted clock the tweens run on,
 * so GSAP's lag smoothing is deliberately left on: a stalled frame (GC pause,
 * buffer tick) advances one short step everywhere instead of snapping the
 * scroll and every scroll-linked tween to a new time at once. See
 * SmoothScrollOptions.lagSmoothing to retune it or restore the old opt-out.
 *
 * `useScrollerProxy: true` additionally proxies `document.documentElement`,
 * matching kalakritico.in's setup — only needed if you scroll a nested
 * element instead of the window.
 */
import Lenis from "lenis";
import { gsap, ScrollTrigger, initGSAP } from "./gsap.js";
import { prefersReducedMotion } from "./util.js";
import type { CommonOptions, Destroy } from "./types.js";

export interface SmoothScrollOptions extends CommonOptions {
  /** Interpolation factor — lower = floatier. @default 0.08 */
  lerp?: number;
  /** Smooth mouse-wheel input. @default true */
  smoothWheel?: boolean;
  /** Smooth touch input (can fight native scrolling). @default false */
  smoothTouch?: boolean;
  /** Direction to smooth. @default "vertical" */
  orientation?: "vertical" | "horizontal";
  /** Initial scroll position in px. @default 0 */
  initialScroll?: number;
  /** Proxy documentElement through ScrollTrigger (nested scrollers). @default false */
  useScrollerProxy?: boolean;
  /** Touch-drag sensitivity — forwarded to Lenis `touchMultiplier`. @default 1 */
  touchMultiplier?: number;
  /** Mouse-wheel sensitivity — forwarded to Lenis `wheelMultiplier`. @default 1 */
  wheelMultiplier?: number;
  /**
   * GSAP lag smoothing on the shared ticker: a frame longer than `threshold`
   * advances only `adjustedLag` ms, so a hitch can't teleport the scroll and
   * every scroll-linked tween in one jump.
   *
   * - `undefined` — leave GSAP's setup alone; its built-in compensation
   *   (500ms → 33ms) stays active.
   * - `false` — disable lag smoothing (anim-kit ≤1.4 behaviour, what the
   *   Lenis README recipe asks for): timing stays exactly wall-clock, but
   *   every frame longer than the threshold snaps.
   * - `{ threshold, adjustedLag }` — retune it. Lower the threshold (e.g.
   *   `150`) to smooth short mobile hitches; raise it if slow devices should
   *   keep real-time speed instead of briefly running slow-motion.
   *
   * `destroy()` restores GSAP's default (500/33) whenever this was set.
   */
  lagSmoothing?: false | { threshold?: number; adjustedLag?: number };
}

export interface SmoothScrollHandle {
  /** The Lenis instance, or null when smooth scrolling was skipped. */
  lenis: Lenis | null;
  /** Programmatic scroll that respects the smooth scroller. */
  scrollTo: (target: number | string | HTMLElement, opts?: { duration?: number; immediate?: boolean }) => void;
  /** True when Lenis is actually driving the page. */
  active: boolean;
  destroy: Destroy;
}

const INERT: SmoothScrollHandle = {
  lenis: null,
  scrollTo: () => {},
  active: false,
  destroy: () => {},
};

export function smoothScroll(options: SmoothScrollOptions = {}): SmoothScrollHandle {
  initGSAP();

  const {
    force = false,
    lerp = 0.08,
    smoothWheel = true,
    smoothTouch = false,
    orientation = "vertical",
    initialScroll = 0,
    useScrollerProxy = false,
    touchMultiplier,
    wheelMultiplier,
    lagSmoothing,
  } = options;

  if (typeof window === "undefined") return INERT;

  // Honour the OS-level preference: fall back to native scrolling.
  if (prefersReducedMotion() && !force) return INERT;

  const lenis = new Lenis({
    lerp,
    smoothWheel,
    syncTouch: smoothTouch,
    orientation,
    autoRaf: false,
    // undefined falls through to Lenis's own defaults (1 / 1).
    touchMultiplier,
    wheelMultiplier,
  });

  if (initialScroll) lenis.scrollTo(initialScroll, { immediate: true });

  // 1. Let ScrollTrigger know whenever Lenis moves.
  const onScroll = () => ScrollTrigger.update();
  lenis.on("scroll", onScroll);

  // 2. Run Lenis off GSAP's ticker so both share one frame clock.
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);

  // Lag smoothing drives *one* clock — the tweens' and this ticker's alike —
  // so leaving GSAP's compensation on turns a stalled frame into one short
  // step everywhere instead of a snap. Only touch the ticker when asked, so a
  // host page's own setup is never clobbered.
  let lagTouched = false;
  if (lagSmoothing !== undefined) {
    lagTouched = true;
    if (lagSmoothing === false) gsap.ticker.lagSmoothing(0);
    else gsap.ticker.lagSmoothing(lagSmoothing.threshold ?? 500, lagSmoothing.adjustedLag ?? 33);
  }

  // 3. Optional: proxy the scroller (for nested/element scrollers).
  if (useScrollerProxy) {
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value?: number) {
        if (arguments.length && typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
          return value;
        }
        return lenis.scroll;
      },
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }),
      // Lenis drives the window, so the documentElement is always visible.
      pinType: "fixed",
    });
    ScrollTrigger.defaults({ scroller: document.documentElement });
  }

  const onResize = () => {
    lenis.resize();
    ScrollTrigger.refresh();
  };
  window.addEventListener("resize", onResize);

  // Fonts and late images change layout; refresh once they land.
  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener("load", refresh);

  lenis.resize();
  ScrollTrigger.refresh();

  const destroy: Destroy = () => {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("load", refresh);
    gsap.ticker.remove(tick);
    if (lagTouched) gsap.ticker.lagSmoothing(500, 33); // undo our change — GSAP's default
    lenis.off("scroll", onScroll);
    if (useScrollerProxy) {
      ScrollTrigger.scrollerProxy(document.documentElement, {} as never);
      ScrollTrigger.defaults({ scroller: window });
    }
    lenis.destroy();
  };

  return {
    lenis,
    active: true,
    scrollTo: (target, opts) => lenis.scrollTo(target as never, opts),
    destroy,
  };
}
