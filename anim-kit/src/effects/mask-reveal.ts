/**
 * Mask reveal — the inline `overflow:hidden` + `y:100%` heading reveal.
 *
 * This is the studio's lighter alternative to `lineReveal`: you write
 * `overflow-hidden` wrappers yourself and animate the inner spans.
 *
 *   <h1>
 *     <span class="ak-mask"><span class="ak-mask__inner">Se</span></span>
 *   </h1>
 *
 *   maskReveal("h1 .ak-mask__inner", { start: "top 90%" })
 *
 * On the site it runs at `duration:.5, ease:[.165,.84,.44,1]` (their `ak-reveal`)
 * and the second line settles at `y:"-8%"` rather than 0 — configurable here.
 */
import { gsap, ScrollTrigger, initGSAP, EASES } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { toArray } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface MaskRevealOptions extends CommonOptions {
  /** Where the inner span starts. @default "100%" (fully below the mask) */
  from?: string;
  /** Where it settles. @default "0%" */
  to?: string;
  /** Duration, seconds. @default 0.5 */
  duration?: number;
  /** Ease name. @default EASES.reveal (".165,.84,.44,1") */
  ease?: string;
  /** Stagger across matched elements, seconds. @default 0.1 */
  stagger?: number;
  /** Delay before playing, seconds. @default 0 */
  delay?: number;
  /** ScrollTrigger start. @default "top 90%" */
  start?: string;
  /** ScrollTrigger end. @default "bottom 10%" */
  end?: string;
  /** "scroll" reverses on leave; "immediate" plays at once. @default "scroll" */
  mode?: "scroll" | "immediate";
}

export function maskReveal(target: TargetLike, options: MaskRevealOptions = {}): Destroy {
  initGSAP();

  const els = toArray<HTMLElement>(target);
  if (!els.length) return () => {};

  const {
    from = "100%",
    to = "0%",
    duration = 0.5,
    ease = EASES.reveal,
    stagger = 0.1,
    delay = 0,
    start = "top 90%",
    end = "bottom 10%",
    mode = "scroll",
  } = options;

  return guard(options, run);

  function run(): Destroy {
    // Group by parent so siblings stagger together rather than individually.
    const groups = new Map<Element, HTMLElement[]>();
    els.forEach((el) => {
      const parent = el.parentElement ?? el;
      const list = groups.get(parent) ?? [];
      list.push(el);
      groups.set(parent, list);
    });

    const tweens: gsap.core.Tween[] = [];

    gsap.set(els, { y: from });

    groups.forEach((members) => {
      const vars: gsap.TweenVars = {
        y: to,
        duration,
        stagger,
        delay,
        ease,
        overwrite: "auto",
      };
      if (mode === "scroll") {
        vars.scrollTrigger = {
          trigger: members[0].parentElement ?? members[0],
          start,
          end,
          toggleActions: "play reverse play reverse",
        };
      }
      tweens.push(gsap.to(members, vars));
    });

    ScrollTrigger.refresh();

    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      gsap.set(els, { clearProps: "transform" });
      ScrollTrigger.refresh();
    };
  }
}

/**
 * Rule reveal — the thin line that draws itself out to full width.
 *
 *   <div class="ak-rule"></div>
 *   revealRule(".ak-rule")
 *
 * `initial:{width:0}` → `whileInView:{width:"100%"}`, duration 1s, same ease.
 */
export function revealRule(
  target: TargetLike,
  options: CommonOptions & { duration?: number; delay?: number; ease?: string } = {},
): Destroy {
  initGSAP();
  const els = toArray<HTMLElement>(target);
  if (!els.length) return () => {};

  const { duration = 1, delay = 0, ease = EASES.reveal } = options;

  return guard(options, () => {
    gsap.set(els, { width: 0 });
    const tween = gsap.to(els, {
      width: "100%",
      duration,
      delay,
      ease,
      stagger: 0.1,
      scrollTrigger: {
        trigger: els[0],
        start: "top 92%",
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(els, { clearProps: "width" });
    };
  });
}
