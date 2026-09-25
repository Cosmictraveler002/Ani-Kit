/**
 * Hide-on-scroll nav — the header that slides away when you scroll down and
 * snaps back when you scroll up.
 *
 * Their exact rules:
 *   - within `threshold` px of the top  → hide (slow, 1s power2.out)
 *   - scrolling down                     → hide (fast, 0.3s)
 *   - scrolling up                       → show  (fast, 0.3s)
 * On viewports under 768px the nav is always visible.
 */
import { gsap, initGSAP, killTweens } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { one } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface NavHideOptions extends CommonOptions {
  /** Distance from the top under which the nav is hidden. @default 200 */
  threshold?: number;
  /** Hide offset in px. @default -100 */
  hideY?: number;
  /** Below this width the nav is pinned visible. @default 768 */
  mobileBreakpoint?: number;
  /** Start hidden. @default true */
  startHidden?: boolean;
}

export function navHide(target: TargetLike, options: NavHideOptions = {}): Destroy {
  initGSAP();

  const nav = one<HTMLElement>(target);
  if (!nav) return () => {};

  const {
    threshold = 200,
    hideY = -100,
    mobileBreakpoint = 768,
    startHidden = true,
  } = options;

  return guard(options, () => {
    let last = window.scrollY;
    let visible = !startHidden;

    const isMobile = () => window.innerWidth < mobileBreakpoint;

    const setHidden = (hidden: boolean, duration: number) => {
      if (hidden === !visible) return;
      visible = !hidden;
      gsap.to(nav, {
        y: hidden ? hideY : 0,
        duration,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    // Initial placement — no animation, just the right resting state.
    gsap.set(nav, { y: isMobile() || !startHidden ? 0 : hideY });
    visible = !isMobile() && !startHidden ? true : startHidden ? false : true;

    const onScroll = () => {
      const y = window.scrollY;

      if (isMobile()) {
        setHidden(false, 0.3);
      } else if (y <= threshold) {
        // Near the top: park the nav out of the way.
        if (visible) setHidden(true, 1);
      } else if (y > last) {
        setHidden(true, 0.3);
      } else if (y < last) {
        setHidden(false, 0.3);
      }

      last = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      // A destroy() must not leave new work behind: kill any in-flight slide
      // and drop the transform we own instead of tweening back (the old code
      // started a fresh 0.3s tween *from* destroy, which also survived it).
      killTweens(nav);
      gsap.set(nav, { clearProps: "transform" });
    };
  });
}
