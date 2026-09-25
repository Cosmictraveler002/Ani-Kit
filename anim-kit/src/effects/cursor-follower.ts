/**
 * Cursor follower — the "Play Showreel" tag that trails the pointer.
 *
 * Two springs drive X and Y independently (mass 0.1, as on the site), and the
 * whole thing fades/blurs in when the pointer enters the hot zone. The label
 * uses `mix-blend-mode: exclusion` so it inverts over any background.
 *
 * The tag is pinned `position: fixed` and driven in VIEWPORT space
 * (clientX/clientY + offset), so it can live anywhere in the DOM — it only
 * reacts while the pointer is over the zone.
 *
 *   cursorFollower(zone, { follower: ".ak-cursor" })
 */
import { gsap, initGSAP, killTweens } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { one } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface CursorFollowerOptions extends CommonOptions {
  /** The floating element. Defaults to the first `[data-cursor]` in the document. */
  follower?: TargetLike;
  /** Offset added to the pointer position, px. @default 14 */
  offset?: number;
  /** Spring config for the follower. @default { mass: 0.1, stiffness: 120 } */
  spring?: { mass?: number; stiffness?: number; damping?: number };
  /** Blend mode applied to the follower. @default "exclusion" */
  blendMode?: string;
  /** Fade the follower in/out with the pointer. @default true */
  fade?: boolean;
}

export function cursorFollower(
  zone: TargetLike,
  options: CursorFollowerOptions = {},
): Destroy {
  initGSAP();

  const el =
    (options.follower ? one<HTMLElement>(options.follower) : null) ??
    document.querySelector<HTMLElement>("[data-cursor]");
  const area = one<HTMLElement>(zone);

  if (!el || !area) return () => {};

  const { offset = 14, spring = { mass: 0.1, stiffness: 120 }, blendMode = "exclusion", fade = true } =
    options;

  return guard(options, () => {
    const prevStyle = {
      mixBlendMode: el.style.mixBlendMode,
      position: el.style.position,
      left: el.style.left,
      top: el.style.top,
      pointerEvents: el.style.pointerEvents,
    };

    el.style.mixBlendMode = blendMode as never;
    // Viewport space: position:fixed + clientX/clientY keeps the tag at the
    // pointer wherever it sits in the DOM. (The old position:absolute +
    // zone-relative math only lined up when the tag was a child of the zone —
    // a body-level tag landed near the document origin instead, off-screen.)
    el.style.position = "fixed";
    el.style.left = "0";
    el.style.top = "0";
    el.style.pointerEvents = "none";

    gsap.set(el, { opacity: fade ? 0 : 1, x: 0, y: 0 });

    const xTo = gsap.quickTo(el, "x", { ...spring, duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { ...spring, duration: 0.4, ease: "power3" });

    // First move lands on the pointer; later moves spring after it — starting
    // from (0,0), the spring would otherwise carry the tag in from the corner.
    let snapped = false;
    const onMove = (e: PointerEvent) => {
      const x = e.clientX + offset;
      const y = e.clientY + offset;
      if (snapped) {
        xTo(x);
        yTo(y);
      } else {
        gsap.set(el, { x, y });
        snapped = true;
      }
      if (fade) gsap.to(el, { opacity: 1, duration: 0.25, overwrite: "auto" });
    };

    const onLeave = () => {
      if (fade) gsap.to(el, { opacity: 0, duration: 0.25, overwrite: "auto" });
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        /* host app handles activation; keep zone keyboard-reachable */
      }
    };

    area.addEventListener("pointermove", onMove);
    area.addEventListener("pointerleave", onLeave);
    area.addEventListener("keydown", onKey);

    return () => {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      area.removeEventListener("keydown", onKey);
      // quickTo tweens are paused at creation and would otherwise sit on the
      // global timeline forever; fade tweens may still be in flight.
      xTo.tween.kill();
      yTo.tween.kill();
      killTweens(el);
      // Restore the inline styles we overwrote, clear only what gsap set
      // (the old clearProps:"all" also wiped the consumer's own styles).
      el.style.mixBlendMode = prevStyle.mixBlendMode;
      el.style.position = prevStyle.position;
      el.style.left = prevStyle.left;
      el.style.top = prevStyle.top;
      el.style.pointerEvents = prevStyle.pointerEvents;
      gsap.set(el, { clearProps: "opacity,transform" });
    };
  });
}
