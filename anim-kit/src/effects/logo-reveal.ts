/**
 * Logo reveal — the DZ!NR wordmark that assembles letter by letter.
 *
 * Every path inside the SVG gets class `svg-anim-path`, is pre-set to
 * `y:-100%, opacity:0`, then slides down into place with a 0.05s stagger when
 * the mark scrolls into view (reversing back out when it leaves).
 *
 *   logoReveal(".logo svg")            ← animates [data-logo-path] children
 *   logoReveal(el, { path: ".my-class" })
 */
import { gsap, ScrollTrigger, initGSAP } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { one, toArray } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface LogoRevealOptions extends CommonOptions {
  /** Selector for the animatable paths inside the SVG. @default "[data-logo-path], .svg-anim-path" */
  path?: string;
  /** Stagger between paths, seconds. @default 0.05 */
  stagger?: number;
  duration?: number;
  ease?: string;
  start?: string;
  end?: string;
  /** Play once and never reverse. @default false */
  once?: boolean;
}

export function logoReveal(target: TargetLike, options: LogoRevealOptions = {}): Destroy {
  initGSAP();

  const el = one<HTMLElement>(target);
  if (!el) return () => {};

  const {
    path = "[data-logo-path], .svg-anim-path",
    stagger = 0.05,
    duration = 1,
    ease = "power2.out",
    start = "top 80%",
    end = "bottom top",
    once = false,
  } = options;

  return guard(options, () => {
    const paths = toArray<Element>(path, el);
    if (!paths.length) return () => {};

    gsap.set(paths, { yPercent: -100, opacity: 0, willChange: "transform" });

    const tween = gsap.to(paths, {
      yPercent: 0,
      opacity: 1,
      duration,
      delay: 0,
      ease,
      stagger,
      scrollTrigger: {
        trigger: el,
        start,
        end,
        once,
        toggleActions: once ? undefined : "play reverse play reverse",
      },
    });

    ScrollTrigger.refresh();

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(paths, { clearProps: "all" });
      ScrollTrigger.refresh();
    };
  });
}
