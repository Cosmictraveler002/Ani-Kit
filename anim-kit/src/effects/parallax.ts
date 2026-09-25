/**
 * Parallax — the studio's `data-speed` utility.
 *
 *   <img data-speed="-0.4" />
 *
 * Each matching element is tweened `yPercent: 50 * speed` across
 * `start:"50% bottom"` → `end:"bottom top"` with `scrub:true`, so negative
 * speeds drift up and positive speeds lag down. Pure `ease:"none"`.
 */
import { gsap, ScrollTrigger, initGSAP } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { one } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface ParallaxOptions extends CommonOptions {
  /** Attribute holding the speed multiplier. @default "data-speed" */
  attribute?: string;
  /** Multiplier applied to the attribute value. @default 50 */
  scale?: number;
  start?: string;
  end?: string;
}

export function parallax(target: TargetLike, options: ParallaxOptions = {}): Destroy {
  initGSAP();

  const root = one<HTMLElement>(target);
  if (!root) return () => {};

  const {
    attribute = "data-speed",
    scale = 50,
    start = "50% bottom",
    end = "bottom top",
  } = options;

  return guard(options, () => {
    const items: Array<{ el: HTMLElement; st?: ScrollTrigger }> = [];

    root.querySelectorAll<HTMLElement>(`[${attribute}]`).forEach((el) => {
      const raw = parseFloat(el.getAttribute(attribute) || "0");
      if (Number.isNaN(raw)) return;
      const speed = raw * scale;

      const tw = gsap.to(el, {
        yPercent: speed,
        ease: "none",
        scrollTrigger: { trigger: el, start, end, scrub: true },
      });
      items.push({ el, st: tw.scrollTrigger });
      // Track tweens for cleanup via a WeakMap-free trick: kill through ST.
      (el as unknown as Record<string, unknown>).__akParallax = tw;
    });

    ScrollTrigger.refresh();

    return () => {
      items.forEach(({ el, st }) => {
        st?.kill();
        const tw = (el as unknown as { __akParallax?: gsap.core.Tween }).__akParallax;
        tw?.kill();
        delete (el as unknown as Record<string, unknown>).__akParallax;
        gsap.set(el, { clearProps: "transform" });
      });
      ScrollTrigger.refresh();
    };
  });
}
