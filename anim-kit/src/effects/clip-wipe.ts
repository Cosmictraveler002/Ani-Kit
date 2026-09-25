/**
 * Clip wipe — a `clip-path: inset()` reveal.
 *
 * The element is collapsed behind one edge (or inside a frame margin) and
 * the inset animates to zero, wiping it into view:
 *
 *   from: "left"   inset(0 100% 0 0)   → grows rightward from the left edge
 *   from: "right"  inset(0 0 0 100%)   → grows leftward from the right edge
 *   from: "top"    inset(0 0 100% 0)   → grows downward from the top edge
 *   from: "bottom" inset(100% 0 0 0)   → grows upward from the bottom edge
 *   from: "frame"  inset(15% 15% 15% 15%) → opens out of a centered frame
 *
 * The wipe can also be bound to scroll progress (`scrub`), so the inset
 * opens as the element travels through the viewport — the reveal then
 * reverses with the scroll instead of playing once.
 *
 * Works on images, videos, blocks and text. destroy() kills the tween and
 * removes the inline clip-path.
 */
import { gsap, ScrollTrigger, initGSAP } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { toArray } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface ClipWipeOptions extends CommonOptions {
  /** Which edge the wipe starts from. @default "left" */
  from?: "left" | "right" | "top" | "bottom" | "frame";
  /** Frame margin in % (only used when `from: "frame"`). @default 15 */
  inset?: number;
  /** Animation duration, seconds. @default 1 */
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
  /** ScrollTrigger end position (scrub mode). @default "top 20%" */
  end?: string;
  /** Re-wipe when leaving / re-entering the viewport. @default false */
  replay?: boolean;
  /**
   * Bind the wipe to scroll progress instead of playing it on enter —
   * number = scrub smoothing seconds, `true` = immediate. unset = one-shot.
   */
  scrub?: number | boolean;
}

const FROM: Record<string, string> = {
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  top: "inset(0% 0% 100% 0%)",
  bottom: "inset(100% 0% 0% 0%)",
};
const TO = "inset(0% 0% 0% 0%)";

export function clipWipe(target: TargetLike, options: ClipWipeOptions = {}): Destroy {
  initGSAP();

  const {
    from = "left",
    inset = 15,
    duration = 1,
    ease = "power3.out",
    stagger = 0.08,
    delay = 0,
    mode = "scroll",
    start = "top 85%",
    end = "top 20%",
    replay = false,
    scrub,
  } = options;

  const els = toArray<HTMLElement>(target);
  if (!els.length) return () => {};

  return guard(options, run);

  function run(): Destroy {
    const startClip = from === "frame" ? `inset(${inset}% ${inset}% ${inset}% ${inset}%)` : FROM[from];

    gsap.set(els, { clipPath: startClip });

    const vars: gsap.TweenVars = {
      clipPath: TO,
      duration,
      ease,
      stagger,
      delay,
      overwrite: "auto",
    };
    if (scrub !== undefined) {
      vars.ease = "none";
      vars.scrollTrigger = {
        trigger: els[0],
        start,
        end,
        scrub: scrub === true ? true : scrub,
      };
    } else if (mode === "scroll") {
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
      gsap.set(els, { clearProps: "clipPath" });
      ScrollTrigger.refresh();
    };
  }
}
