/**
 * Lenis smooth scrolling wired into GSAP ScrollTrigger.
 *
 * Uses the canonical Lenis + GSAP recipe:
 *   lenis.on("scroll", ScrollTrigger.update)
 *   gsap.ticker.add(t => lenis.raf(t * 1000))
 *   gsap.ticker.lagSmoothing(0)
 *
 * Driving Lenis from GSAP's ticker (rather than its own rAF) keeps both
 * clocks on the same frame, which is what stops ScrollTrigger from stuttering.
 *
 * `useScrollerProxy: true` additionally proxies `document.documentElement`,
 * matching dzinrstudio.com's setup — only needed if you scroll a nested
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
  });

  if (initialScroll) lenis.scrollTo(initialScroll, { immediate: true });

  // 1. Let ScrollTrigger know whenever Lenis moves.
  const onScroll = () => ScrollTrigger.update();
  lenis.on("scroll", onScroll);

  // 2. Run Lenis off GSAP's ticker so both share one frame clock.
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

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
