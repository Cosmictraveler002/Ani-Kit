/**
 * Counter — the big tabular-nums number that ticks up.
 *
 * Drives an element's `textContent` from `from` to `to` with an easing curve,
 * optionally triggered by ScrollTrigger. Uses integer stepping so there is no
 * fractional flicker, and pairs with `tabular-nums` for stable layout.
 *
 *   counter("[data-count]", { to: 100, duration: 4, ease: "power1.inOut" })
 */
import { gsap, ScrollTrigger, initGSAP, killTweens } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { toArray } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface CounterOptions extends CommonOptions {
  /** Start value. @default 0 */
  from?: number;
  /** End value. @default 100 */
  to?: number;
  /** Duration in seconds. @default 4 */
  duration?: number;
  /** GSAP ease. @default "power1.inOut" */
  ease?: string;
  /** Pad with leading zeros to this width. @default 0 (no padding) */
  pad?: number;
  /** Suffix appended to the number, e.g. "+". @default "" */
  suffix?: string;
  /** Animate when scrolled into view instead of immediately. @default false */
  onScroll?: boolean;
  start?: string;
  onComplete?: (value: number) => void;
}

export function counter(target: TargetLike, options: CounterOptions = {}): Destroy {
  initGSAP();

  const els = toArray<HTMLElement>(target);
  if (!els.length) return () => {};

  const {
    from = 0,
    to = 100,
    duration = 4,
    ease = "power1.inOut",
    pad = 0,
    suffix = "",
    onScroll = false,
    start = "top 90%",
    onComplete,
  } = options;

  return guard(options, run);

  function run(): Destroy {
    const tweens: gsap.core.Tween[] = [];

    els.forEach((el) => {
      const state = { v: from };
      const render = () => {
        const n = Math.round(state.v);
        el.textContent = (pad ? String(n).padStart(pad, "0") : String(n)) + suffix;
      };
      render();

      const vars: gsap.TweenVars = {
        v: to,
        duration,
        ease,
        onUpdate: render,
        onComplete: () => {
          render();
          onComplete?.(Math.round(state.v));
        },
      };

      if (onScroll) {
        vars.scrollTrigger = { trigger: el, start, once: true };
      }

      tweens.push(gsap.to(state, vars));
    });

    if (onScroll) ScrollTrigger.refresh();

    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }
}

/**
 * Audio bars — the 5-bar equaliser inside the background-music button.
 *
 * Heights re-randomise on an interval and each bar springs to its new height,
 * giving that loose, twitchy look. `stop()` collapses the bars back down.
 *
 *   const eq = audioBars(".ak-eq");
 *   eq.start();          // on play
 *   eq.stop();           // on pause
 */
export interface AudioBarsOptions extends CommonOptions {
  /** Bars inside the container. @default ":scope > *" */
  bar?: string;
  /** Re-randomise interval in ms. @default 100 */
  interval?: number;
  /** Min bar height px. @default 4 */
  minHeight?: number;
  /** Max bar height px. @default 14 */
  maxHeight?: number;
  /**
   * Spring feel, 0..1. Higher = bouncier. Used to pick the overshoot ease.
   * @default 0.75
   */
  bounce?: number;
}

export interface AudioBarsHandle {
  start: () => void;
  stop: () => void;
  destroy: Destroy;
}

export function audioBars(
  target: TargetLike,
  options: AudioBarsOptions = {},
): AudioBarsHandle {
  initGSAP();

  const inert: AudioBarsHandle = { start: () => {}, stop: () => {}, destroy: () => {} };
  const root = toArray<HTMLElement>(target)[0];
  if (!root) return inert;

  const {
    bar = ":scope > *",
    interval = 100,
    minHeight = 4,
    maxHeight = 14,
    bounce = 0.75,
  } = options;

  const bars = toArray<HTMLElement>(bar, root);
  if (!bars.length) return inert;

  let timer = 0;

  const start = () => {
    if (timer) return;
    randomise();
    timer = window.setInterval(randomise, interval);
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = 0;
    bars.forEach((b) =>
      gsap.to(b, { height: minHeight, duration: 0.4, ease: "power2.out", overwrite: "auto" }),
    );
  };

  const destroy = guard(options, () => {
    gsap.set(bars, { height: minHeight, force3D: true });
    start();
    return () => {
      if (timer) window.clearInterval(timer); // match window.setInterval in start()
      timer = 0;
      // Kill in-flight bar tweens first — otherwise their next frame would
      // rewrite `height` *after* clearProps, mutating the DOM post-destroy.
      // killTweens() (not killTweensOf) also catches batches created since
      // the last ticker frame — those are still lazy and survive killTweensOf.
      killTweens(bars);
      gsap.set(bars, { clearProps: "height" });
    };
  });

  return { start, stop, destroy };

  function randomise() {
    bars.forEach((b) => {
      const v = Math.random() * 0.8 + 0.2;
      gsap.to(b, {
        height: Math.max(minHeight, maxHeight * v),
        duration: 0.45,
        // Underdamped springs overshoot; map the bounce option onto back.out.
        ease: `back.out(${(bounce * 1.8).toFixed(2)})`,
        overwrite: "auto",
      });
    });
  }
}
