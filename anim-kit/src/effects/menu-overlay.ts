/**
 * Menu overlay — the full-screen curtain menu.
 *
 * The panel is a `position:fixed` layer whose `clip-path` polygon animates
 * between collapsed-at-bottom and fully-open, using the studio's `ak-curtain`
 * ease (`.76,0,.2,1`). Menu links slide in/out of their own masks with a
 * stagger, and the nav logo + toggle lift out of the way first.
 *
 *   menuOverlay({ overlay: ".menu-overlay", open: ".menu-toggle-open", close: … })
 *
 * Requires the markup contract in styles/anim-kit.css (`.menu-overlay`,
 * `.menu-link`, `.menu-overlay-bar`).
 */
import { gsap, ScrollTrigger, initGSAP, EASES } from "../core/gsap.js";
import { one, toArray, prefersReducedMotion } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface MenuOverlayOptions extends CommonOptions {
  /** The fixed full-screen panel. */
  overlay: TargetLike;
  /** Element that opens the menu (or a boolean-ish toggle target). */
  openTrigger?: TargetLike;
  /** Element that closes the menu. */
  closeTrigger?: TargetLike;
  /** Nav bar that slides away while the menu is open. */
  nav?: TargetLike;
  /** Selector for the menu links inside `overlay`. @default ".menu-link a" */
  link?: string;
  /** Elements in the overlay chrome that rise into view. @default "[data-menu-chrome]" */
  chrome?: string;
  /** Duration of the curtain, seconds. @default 1 */
  duration?: number;
  /** Stagger between links, seconds. @default 0.1 */
  stagger?: number;
  /** Start open. @default false */
  initialOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export interface MenuOverlayHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
  destroy: Destroy;
}

const COLLAPSED_BOTTOM = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
const COLLAPSED_TOP = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
const OPEN = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

export function menuOverlay(
  options: MenuOverlayOptions,
): MenuOverlayHandle {
  initGSAP();

  const {
    overlay: overlayTarget,
    openTrigger,
    closeTrigger,
    nav: navTarget,
    link = ".menu-link a",
    chrome = "[data-menu-chrome]",
    duration = 1,
    stagger = 0.1,
    initialOpen = false,
    onOpen,
    onClose,
  } = options;

  const noop = { open: () => {}, close: () => {}, toggle: () => {}, isOpen: () => false, destroy: () => {} };

  const overlay = one<HTMLElement>(overlayTarget);
  if (!overlay) return noop;

  const nav = navTarget ? one<HTMLElement>(navTarget) : null;
  const openBtns = toArray<HTMLElement>(openTrigger);
  const closeBtns = toArray<HTMLElement>(closeTrigger);
  const links = toArray<HTMLElement>(link, overlay);
  const chromeEls = toArray<HTMLElement>(chrome, overlay);

  // Reduced motion: leave the overlay collapsed and expose inert controls.
  if (prefersReducedMotion() && !options.force) {
    gsap.set(overlay, { clipPath: COLLAPSED_BOTTOM, pointerEvents: "none" });
    return noop;
  }

  return setup();

  function setup(): MenuOverlayHandle {
    let open = initialOpen;
    const ease = EASES.curtain;

    // Initial state: curtain collapsed at the bottom edge, links waiting below.
    gsap.set(overlay, {
      clipPath: COLLAPSED_BOTTOM,
      pointerEvents: "none",
    });
    if (links.length) gsap.set(links, { y: "100%" });
    if (chromeEls.length) gsap.set(chromeEls, { y: 20 });

    const tweens: gsap.core.Tween[] = [];

    const openMenu = () => {
      if (open) return;
      open = true;
      const tl = gsap.timeline({ onComplete: () => onOpen?.() });

      // Curtain sweeps up to fill the viewport.
      tl.to(overlay, {
        clipPath: OPEN,
        duration,
        ease,
        onStart: () => {
          gsap.set(overlay, { pointerEvents: "all" });
          if (nav) gsap.set(nav, { pointerEvents: "none" });
        },
      }, 0);

      // Nav chrome lifts out of the way ahead of the curtain.
      if (nav) {
        const navBits = toArray<HTMLElement>("a, p", nav);
        if (navBits.length) {
          gsap.set(navBits, { y: 0 });
          tl.to(navBits, { y: -20, duration, stagger, ease }, 0);
        }
      }

      // Links slide up into place.
      if (links.length) {
        tl.fromTo(
          links,
          { y: "100%" },
          { y: "0%", duration, stagger: stagger / 2, ease: "power3.out" },
          duration * 0.5,
        );
      }
      if (chromeEls.length) {
        tl.to(chromeEls, { y: 0, duration, stagger, ease }, duration * 0.5);
      }

      tweens.push(tl as unknown as gsap.core.Tween);
    };

    const closeMenu = () => {
      if (!open) return;
      open = false;
      const tl = gsap.timeline({ onComplete: () => onClose?.() });

      if (chromeEls.length) {
        tl.to(chromeEls, { y: -20, duration: duration * 0.75, stagger: stagger / 2, ease }, 0);
      }
      if (links.length) {
        tl.to(links, {
          y: "100%",
          duration: duration * 0.75,
          stagger: 0.05,
          ease: "power4.in",
        }, 0);
      }

      tl.to(
        overlay,
        {
          clipPath: COLLAPSED_TOP,
          duration,
          delay: 0.5,
          ease,
          onComplete: () => {
            gsap.set(overlay, { pointerEvents: "none" });
            if (nav) gsap.set(nav, { pointerEvents: "all" });
            // Reset for next open so the curtain always starts at the bottom.
            gsap.set(overlay, { clipPath: COLLAPSED_BOTTOM });
            if (links.length) gsap.set(links, { y: "100%" });
            if (chromeEls.length) gsap.set(chromeEls, { y: 20 });
          },
        },
        0,
      );

      if (nav) {
        const navBits = toArray<HTMLElement>("a, p", nav);
        if (navBits.length) tl.to(navBits, { y: 0, duration, stagger, ease }, duration * 0.5);
      }

      tweens.push(tl as unknown as gsap.core.Tween);
    };

    const toggle = () => (open ? closeMenu() : openMenu());

    const listeners: Array<[HTMLElement, string, () => void]> = [];
    openBtns.forEach((el) => {
      el.addEventListener("click", openMenu);
      listeners.push([el, "click", openMenu]);
    });
    closeBtns.forEach((el) => {
      el.addEventListener("click", closeMenu);
      listeners.push([el, "click", closeMenu]);
    });

    if (initialOpen) openMenu();

    return {
      open: openMenu,
      close: closeMenu,
      toggle,
      isOpen: () => open,
      destroy: () => {
        listeners.forEach(([el, type, fn]) => el.removeEventListener(type, fn));
        tweens.forEach((t) => t.kill());
        gsap.set(overlay, { clearProps: "all" });
        gsap.set([...links, ...chromeEls], { clearProps: "all" });
        void ScrollTrigger;
      },
    };
  }
}
