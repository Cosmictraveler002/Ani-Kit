/**
 * Drag strip — the grabbable, infinitely looping image carousel.
 *
 * Built on GSAP Draggable. Why it is shaped this way (audit notes):
 *
 * - **Single writer.** Draggable owns the track's X transform; the loop is a
 *   `liveSnap` function Draggable itself calls on every move (and every frame
 *   of an inertia throw). Nothing else writes X — the first version let a
 *   0.5s `quickTo` fight Draggable's own transform, which stuttered between
 *   wrapped and unwrapped positions. (Note: Draggable has no `modifiers`
 *   option; `liveSnap` is the supported hook.)
 * - **Seamless loop.** Folding positions is only invisible when the content
 *   tiles: with `clone: true` (default) the strip duplicates itself until one
 *   tile is at least as wide as the viewport, and the fold distance is always
 *   a whole multiple of the tile width — the same trick `marquee()` uses.
 *   Without cloning there is nothing to fold against, so the strip clamps at
 *   the content edges instead (finite, but never a gap).
 * - **Rotation on pull.** Children tilt against pointer *speed* (normalised to
 *   a 60fps frame so mouse and touch event rates feel identical) and spring
 *   back to 0 on release. Pointer movement is used rather than Draggable's
 *   `deltaX`, because deltaX jumps by a full loop at the seam.
 * - **Fidelity.** `destroy()` kills the Draggable and both rotation tweens,
 *   removes cloned tiles (original markup back) and restores the inline
 *   cursor/user-select/touch-action the effect had overwritten.
 *
 *   dragStrip(".ak-drag-track", { maxRotation: 60 })
 *
 * CSS: viewport `overflow: hidden`; track `display: flex; width: max-content;
 * gap: 1rem; cursor: grab; user-select: none; touch-action: pan-y`.
 */
import { gsap, Draggable, initGSAP } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { one, toArray } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface DragStripOptions extends CommonOptions {
  /** Max rotation at full drag speed, degrees. @default 100 */
  maxRotation?: number;
  /** Rotation response — divisor on the normalised drag speed. @default 100 */
  rotationScale?: number;
  /** Spring-back duration on release, seconds. @default 1 */
  settleDuration?: number;
  /** Enable inertia after release (requires GSAP InertiaPlugin). @default false */
  inertia?: boolean;
  /** Duplicate content so the loop is seamless; `false` clamps instead. @default true */
  clone?: boolean;
  /** Items inside the strip that rotate. @default ":scope > *" */
  item?: string;
}

export function dragStrip(target: TargetLike, options: DragStripOptions = {}): Destroy {
  initGSAP();

  const track = one<HTMLElement>(target);
  if (!track) return () => {};

  const {
    maxRotation = 100,
    rotationScale = 100,
    settleDuration = 1,
    inertia = false,
    clone = true,
    item = ":scope > *",
  } = options;

  return guard(options, () => {
    const viewport = track.parentElement;
    const prevStyle = {
      cursor: track.style.cursor,
      userSelect: track.style.userSelect,
      touchAction: track.style.touchAction,
    };

    /* ---------------- tiling (seamless infinite) ---------------- */

    const originalCount = track.children.length;
    const originalNodes = Array.from(track.children);
    const trackWidth = () => Math.max(track.scrollWidth, track.clientWidth);

    let tile = originalCount > 0 ? trackWidth() : 0; // width of one copy
    let viewportW = 1; // width of the scroll viewport (the parent)
    let loop = 0; // fold distance — whole tiles, or 0 when nothing to fold
    let pointerDown = false;
    let throwing = false;

    /** Clone a tile, stripping ids so duplicated markup stays valid. */
    const cloneTile = () =>
      originalNodes.map((node) => {
        const copy = node.cloneNode(true);
        if (copy instanceof Element) {
          if (copy.id) copy.removeAttribute("id");
          copy.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
        }
        return copy;
      });

    const measure = () => {
      viewportW = Math.max(1, viewport?.clientWidth || track.clientWidth || 1);
      if (tile > 0 && clone) {
        // One tile must be ≥ the viewport, with a spare tile to fold into.
        for (let i = 8; i > 0 && trackWidth() - tile < viewportW; i--) {
          track.append(...cloneTile());
        }
      }
      if (tile <= 0) {
        loop = 0; // unmeasurable (hidden / jsdom) — drag without folding
      } else if (clone) {
        // Largest multiple of `tile` that still leaves room for the viewport.
        loop = Math.max(0, Math.floor((trackWidth() - viewportW) / tile)) * tile;
      } else {
        // Finite mode: keep the content aligned, never an empty gap.
        loop = Math.max(0, trackWidth() - viewportW);
      }
    };

    const fold = (value: number) => {
      if (loop <= 0) return value;
      return clone
        ? gsap.utils.wrap(-loop, 0, value)
        : Math.max(-loop, Math.min(0, value));
    };

    /**
     * Handed to Draggable as `liveSnap.x`. Folds while Draggable is driving
     * the value (pointer down, or a throw in progress). InertiaPlugin parses
     * its *end target* with both flags false — that value stays raw so the
     * throw keeps its direction; syncXY folds every frame of the throw instead.
     */
    const foldWhenDriven = (value: number) =>
      pointerDown || throwing ? fold(value) : value;

    measure();

    /* ---------------- rotation on pull ---------------- */

    const items = toArray<HTMLElement>(item, track); // after cloning: tiles tilt too
    gsap.set(items, { transformOrigin: "50% 100%" });

    const followRotation = gsap.quickTo(items, "rotation", {
      duration: 0.12,
      ease: "power2.out",
    });
    const settleRotation = gsap.quickTo(items, "rotation", {
      duration: settleDuration,
      ease: "power3.out",
    });

    let lastPointerX = 0;
    let lastMoveTime = 0;

    /* ---------------- drag ---------------- */

    track.style.cursor = "grab";
    track.style.userSelect = "none";
    track.style.touchAction = "pan-y";

    const draggable = Draggable.create(track, {
      type: "x",
      dragClickables: true,
      inertia,
      liveSnap: { x: foldWhenDriven },
      onPress() {
        pointerDown = true;
        throwing = false;
        // A spring from the previous release has had its chance — start fresh.
        if (settleRotation.tween.isActive()) settleRotation.tween.totalProgress(1);
        lastPointerX = this.pointerX || 0;
        lastMoveTime = performance.now();
        track.style.cursor = "grabbing";
      },
      onDrag() {
        const now = performance.now();
        const dt = Math.min(64, Math.max(8, now - lastMoveTime));
        const pointerX = this.pointerX || 0;
        const dx = pointerX - lastPointerX;
        lastPointerX = pointerX;
        lastMoveTime = now;
        // Pointer speed normalised to a 60fps frame → same feel for every
        // event rate (mouse vs touch), unlike a raw per-event delta.
        const speed = (dx / dt) * 16.667;
        const rotation = gsap.utils.clamp(
          -maxRotation,
          maxRotation,
          -(speed / rotationScale) * 100,
        );
        followRotation(rotation);
      },
      onRelease() {
        pointerDown = false;
        track.style.cursor = prevStyle.cursor || "grab";
        // Hold the last tilt, then spring it back over settleDuration.
        if (followRotation.tween.isActive()) followRotation.tween.totalProgress(1);
        settleRotation(0);
      },
      onThrowUpdate: () => {
        throwing = true; // from here on, liveSnap folds each frame
      },
      onThrowComplete: () => {
        throwing = false;
      },
      // (throw interruption resets `throwing` on the next press)
    })[0];

    /* ---------------- resize ---------------- */

    const onResize = () => {
      const x = parseFloat(String(gsap.getProperty(track, "x") ?? 0)) || 0;
      measure(); // widen if the viewport grew; never removes tiles
      gsap.set(track, { x: fold(x) }); // re-fold into the new range
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      followRotation.tween.kill();
      settleRotation.tween.kill();
      draggable.kill();
      // Restore the exact inline styles we overwrote (not clearProps:"all",
      // which would also wipe the consumer's own inline styles).
      track.style.cursor = prevStyle.cursor;
      track.style.userSelect = prevStyle.userSelect;
      track.style.touchAction = prevStyle.touchAction;
      // Original markup back: drop cloned tiles, then clear our transforms.
      while (track.children.length > originalCount) track.removeChild(track.lastElementChild!);
      gsap.set([track, ...track.children], { clearProps: "transform,transformOrigin" });
    };
  });
}
