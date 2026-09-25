/**
 * Unfold reveal — blocks that grow open from an edge.
 *
 * `scaleY: 0 → 1` from the top (or bottom) edge for a vertical unfold,
 * `scaleX: 0 → 1` from the left for a horizontal one — the staggered block
 * grow-in used for labels, headings and buttons as a section enters.
 *
 *   unfoldReveal("[data-unfold]", { axis: "y", origin: "top" });
 *   unfoldReveal("[data-unfold-x]", { axis: "x", origin: "left" });
 *
 * Targets stagger together off the first match's trigger. destroy() kills the
 * tween and clears the transform, so elements rest exactly as authored.
 */
import { gsap, ScrollTrigger, initGSAP } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { toArray } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface UnfoldRevealOptions extends CommonOptions {
  /** Which axis grows open. @default "y" */
  axis?: "y" | "x";
  /** transformOrigin — defaults to "top" (y) / "left" (x). */
  origin?: string;
  /** Animation duration, seconds. @default 0.7 */
  duration?: number;
  /** GSAP ease. @default "power3.out" */
  ease?: string;
  /** Stagger between targets, seconds. @default 0.08 */
  stagger?: number;
  /** Delay before playing, seconds. @default 0 */
  delay?: number;
  /** "scroll" plays on enter, "immediate" plays at once. @default "scroll" */
  mode?: "scroll" | "immediate";
  /** ScrollTrigger start position. @default "top 85%" */
  start?: string;
  /** Re-unfold when leaving / re-entering the viewport. @default false */
  replay?: boolean;
}

export function unfoldReveal(target: TargetLike, options: UnfoldRevealOptions = {}): Destroy {
  initGSAP();

  const {
    axis = "y",
    origin,
    duration = 0.7,
    ease = "power3.out",
    stagger = 0.08,
    delay = 0,
    mode = "scroll",
    start = "top 85%",
    replay = false,
  } = options;

  const els = toArray<HTMLElement>(target);
  if (!els.length) return () => {};

  return guard(options, run);

  function run(): Destroy {
    const prop = axis === "x" ? "scaleX" : "scaleY";
    const from = origin ?? (axis === "x" ? "left" : "top");

    gsap.set(els, { [prop]: 0, transformOrigin: from });

    const vars: gsap.TweenVars = {
      [prop]: 1,
      duration,
      ease,
      stagger,
      delay,
      overwrite: "auto",
    };
    if (mode === "scroll") {
      vars.scrollTrigger = {
        trigger: els[0],
        start,
        toggleActions: replay ? "play reverse play reverse" : "play none none none",
      };
    }

    const tween = gsap.to(els, vars);
    ScrollTrigger.refresh();

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(els, { clearProps: "transform,transformOrigin" });
      ScrollTrigger.refresh();
    };
  }
}
