/**
 * Line reveal — the masked, staggered text reveal used all over DZ!NR.
 *
 * Text is split into lines, each line gets an `overflow:hidden` mask, and the
 * inner line slides up from `y:100%` to `y:0%`.
 *
 * Two modes:
 *   mode: "scroll"   → plays when the element enters the viewport and reverses
 *                      when it leaves (`toggleActions: "play reverse play reverse"`,
 *                      start `top 90%` / end `bottom 10%`) — their default.
 *   mode: "immediate"→ plays right away (used above the fold with
 *                      `animateOnScroll: false`).
 */
import { gsap, ScrollTrigger, initGSAP, EASES } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { split, type SplitResult } from "../core/split.js";
import { toArray } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface LineRevealOptions extends CommonOptions {
  /** "scroll" plays on enter/reverse on leave; "immediate" plays at once. */
  mode?: "scroll" | "immediate";
  /** Stagger between lines, seconds. @default 0.1 */
  stagger?: number;
  /** Animation duration, seconds. @default 1 */
  duration?: number;
  /** GSAP ease name. @default "power4.out" */
  ease?: string;
  /** Delay before playing, seconds. @default 0 */
  delay?: number;
  /** ScrollTrigger start position. @default "top 90%" */
  start?: string;
  /** ScrollTrigger end position. @default "bottom 10%" */
  end?: string;
}

export function lineReveal(target: TargetLike, options: LineRevealOptions = {}): Destroy {
  initGSAP();

  const {
    mode = "scroll",
    stagger = 0.1,
    duration = 1,
    ease = "power4.out",
    delay = 0,
    start = "top 90%",
    end = "bottom 10%",
  } = options;

  const els = toArray<HTMLElement>(target);
  if (!els.length) return () => {};

  return guard(options, run);

  function run(): Destroy {
    const splits: SplitResult[] = [];
    const tweens: gsap.core.Tween[] = [];

    els.forEach((el) => {
      const res = split(el, {
        type: "lines",
        mask: true,
        linesClass: "ak-line++",
        lineThreshold: 0.05,
      });
      splits.push(res);

      // SplitText copies aria-labels onto the fragments; drop them for a11y.
      el.querySelectorAll("[aria-label]").forEach((n) => n.removeAttribute("aria-label"));

      if (!res.elements.length) return;

      gsap.set(res.elements, { y: "100%" });

      const vars: gsap.TweenVars = {
        y: "0%",
        duration,
        stagger,
        ease,
        delay,
        overwrite: "auto",
      };

      if (mode === "scroll") {
        vars.scrollTrigger = {
          trigger: el,
          start,
          end,
          toggleActions: "play reverse play reverse",
        };
      }

      tweens.push(gsap.to(res.elements, vars));
    });

    ScrollTrigger.refresh();

    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      splits.forEach((s) => s.revert());
      ScrollTrigger.refresh();
    };
  }
}

export { EASES };
