/**
 * Hero shrink — the showreel video that scales down as you scroll away.
 *
 *   fromTo(el, { scale: 1, x: 0, y: 0 },
 *              { x: 0, y: "49vh", scale: 0.23, force3D: true,
 *                scrollTrigger: { trigger: el, start: "top top",
 *                                 end: "bottom top", scrub: 1 } })
 *
 * The video stays full-bleed at the top of the page and shrinks toward the
 * bottom-centre as the section scrolls past, with `scrub: 1` giving it that
 * heavy, lagging feel.
 */
import { gsap, ScrollTrigger, initGSAP } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { one } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface HeroShrinkOptions extends CommonOptions {
  /** How far down the element drifts, as a CSS length. @default "49vh" */
  offsetY?: string;
  /** Final scale. @default 0.23 */
  scale?: number;
  /** Scrub smoothing — higher = laggier. @default 1 */
  scrub?: number;
  start?: string;
  end?: string;
  /** Shift on X at the end. @default 0 */
  offsetX?: string;
}

export function heroShrink(target: TargetLike, options: HeroShrinkOptions = {}): Destroy {
  initGSAP();

  const el = one<HTMLElement>(target);
  if (!el) return () => {};

  const {
    offsetY = "49vh",
    offsetX = "0px",
    scale = 0.23,
    scrub = 1,
    start = "top top",
    end = "bottom top",
  } = options;

  return guard(options, () => {
    const tween = gsap.fromTo(
      el,
      { scale: 1, x: 0, y: 0 },
      {
        x: offsetX,
        y: offsetY,
        scale,
        force3D: true,
        ease: "none",
        scrollTrigger: { trigger: el, start, end, scrub },
      },
    );

    ScrollTrigger.refresh();

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: "transform" });
      ScrollTrigger.refresh();
    };
  });
}
