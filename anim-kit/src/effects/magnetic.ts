/**
 * Magnetic hover — buttons and links that pull toward the pointer.
 *
 * While the pointer is over the element it follows the cursor (a fraction
 * of its own box), tilts toward the pull, and optionally grows a touch.
 * On leave it springs back to rest with an elastic snap:
 *
 *   magnetic("[data-magnet]", { strength: 0.5, rotation: 10 });
 *
 * Attach it to individual buttons/links (or a container's children — pass
 * the list). destroy() removes the listeners, kills in-flight tweens and
 * restores the inline transform.
 */
import { gsap, initGSAP, killTweens } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { toArray } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface MagneticOptions extends CommonOptions {
  /** How far the element follows the pointer — fraction of its own box. @default 0.4 */
  strength?: number;
  /** Max tilt in degrees at full pull (0 disables rotation). @default 8 */
  rotation?: number;
  /** Scale held while the pointer is over the element (1 = none). @default 1 */
  scale?: number;
  /** Spring-back duration, seconds. @default 1.2 */
  duration?: number;
  /** Spring-back ease. @default "elastic.out(1, 0.35)" */
  ease?: string;
}

export function magnetic(target: TargetLike, options: MagneticOptions = {}): Destroy {
  initGSAP();

  const els = toArray<HTMLElement>(target);
  if (!els.length) return () => {};

  const {
    strength = 0.4,
    rotation = 8,
    scale = 1,
    duration = 1.2,
    ease = "elastic.out(1, 0.35)",
  } = options;

  return guard(options, () => {
    const prevTransform = els.map((el) => el.style.transform);
    const listeners: Array<{ el: HTMLElement; type: string; fn: EventListener }> = [];

    els.forEach((el) => {
      const onMove = (e: Event) => {
        const ptr = e as PointerEvent;
        const r = el.getBoundingClientRect();
        const dx = ptr.clientX - (r.left + r.width / 2);
        const dy = ptr.clientY - (r.top + r.height / 2);
        const nx = r.width ? dx / (r.width / 2) : 0; // -1 … 1 across the box
        gsap.to(el, {
          x: dx * strength,
          y: dy * strength,
          rotation: rotation ? nx * rotation : 0,
          scale,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });
      };
      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, rotation: 0, scale: 1, duration, ease, overwrite: "auto" });
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      listeners.push(
        { el, type: "pointermove", fn: onMove },
        { el, type: "pointerleave", fn: onLeave },
      );
    });

    return () => {
      listeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
      killTweens(els);
      els.forEach((el, i) => {
        el.style.transform = prevTransform[i];
      });
    };
  });
}
