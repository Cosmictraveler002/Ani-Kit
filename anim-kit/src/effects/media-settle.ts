/**
 * Media settle — images that arrive slightly oversized and settle to size.
 *
 * The classic entrance for grids and heroes: media enters at `scale > 1`
 * and eases down to 1 as the section arrives (or across the scroll range in
 * `scrub` mode), so content lands instead of popping in.
 *
 *   mediaSettle("[data-settle]", { from: 1.3 });            // on enter
 *   mediaSettle("[data-settle]", { scrub: 0.5 });           // scroll-bound
 *   mediaSettle("[data-settle]", { replay: true });         // reverse on leave-back, replay on re-enter
 *
 * destroy() kills the tween and restores the original scale.
 */
import { gsap, ScrollTrigger, initGSAP } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { toArray } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface MediaSettleOptions extends CommonOptions {
  /** Starting scale — settles down to 1. @default 1.15 */
  from?: number;
  /** Animation duration, seconds (enter mode). @default 1.5 */
  duration?: number;
  /** GSAP ease. @default "power2.out" */
  ease?: string;
  /** transformOrigin. @default "center" */
  origin?: string;
  /** Stagger between targets, seconds. @default 0.06 */
  stagger?: number;
  /** Delay before playing, seconds. @default 0 */
  delay?: number;
  /** "scroll" plays on enter, "immediate" plays at once. @default "scroll" */
  mode?: "scroll" | "immediate";
  /** ScrollTrigger start position. @default "top 75%" */
  start?: string;
  /** ScrollTrigger end position (scrub mode). @default "bottom top" */
  end?: string;
  /** Re-settle when leaving / re-entering the viewport (enter mode). @default false */
  replay?: boolean;
  /**
   * Bind the settle to scroll progress instead of playing it on enter —
   * number = scrub smoothing seconds, `true` = immediate. unset = one-shot.
   */
  scrub?: number | boolean;
}

export function mediaSettle(target: TargetLike, options: MediaSettleOptions = {}): Destroy {
  initGSAP();

  const {
    from = 1.15,
    duration = 1.5,
    ease = "power2.out",
    origin = "center",
    stagger = 0.06,
    delay = 0,
    mode = "scroll",
    start = "top 75%",
    end = "bottom top",
    replay = false,
    scrub,
  } = options;

  const els = toArray<HTMLElement>(target);
  if (!els.length) return () => {};

  return guard(options, run);

  function run(): Destroy {
    gsap.set(els, { scale: from, transformOrigin: origin });

    const vars: gsap.TweenVars = { scale: 1, stagger, delay, overwrite: "auto" };

    if (scrub !== undefined) {
      vars.ease = "none";
      vars.scrollTrigger = {
        trigger: els[0],
        start,
        end,
        scrub: scrub === true ? true : scrub,
      };
    } else {
      vars.duration = duration;
      vars.ease = ease;
      if (mode === "scroll") {
        vars.scrollTrigger = replay
          ? { trigger: els[0], start, toggleActions: "play reverse play reverse" }
          : { trigger: els[0], start, once: true };
      }
    }

    const tween = gsap.fromTo(
      els,
      { scale: from, transformOrigin: origin },
      { ...vars, immediateRender: true },
    );
    ScrollTrigger.refresh();

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(els, { clearProps: "transform,transformOrigin" });
      ScrollTrigger.refresh();
    };
  }
}
