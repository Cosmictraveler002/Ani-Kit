/**
 * Drag rail — the bounded, inertia-driven horizontal rail.
 *
 * A grab-and-throw rail with real physics, extracted from the drag-driven
 * portfolio rail pattern: pointer drag, wheel and trackpad all feed one
 * *intent* value, and the track follows it with a per-frame lerp. Why it is
 * shaped this way (audit notes):
 *
 * - **Two values, not one.** `intent` is where the rail wants to be (drag
 *   delta, wheel delta, throw momentum); `pos` is what is rendered. The tick
 *   lerps intent → pos (`lerp * deltaRatio`), which is what gives the
 *   buttery catch-up after a hard throw. Writing the transform directly from
 *   pointermove (v1) felt like dragging a brick.
 * - **tanh rubber-band.** Past either end, intent is squashed through
 *   `edge * tanh(overshoot / edge)` — the further you pull, the less each
 *   pixel buys you, but it never hard-stops. On release a restore force pulls
 *   the overscrolled intent back inside the bounds while the lerp chases it,
 *   producing the settle. This is the same soft-edge maths as the original
 *   rail's `a.t = a.a + tanh(l / t) * t`.
 * - **Release throw.** Velocity is sampled as a smoothed per-frame pointer
 *   delta (0.7 smoothing) and multiplied by `throwScale` into intent — a flick
 *   coasts, a slow release barely moves. No InertiaPlugin dependency; the
 *   ticker *is* the inertia.
 * - **Wheel coexistence.** While the rail can still move in the wheel's
 *   direction the event is consumed (`preventDefault` + `stopPropagation` —
 *   the stop matters: Lenis listens above us and would scroll the page in
 *   parallel). Once overscrolled a full `edge`, the wheel passes through to
 *   the page again, so the section never traps the reader.
 * - **Velocity-reactive items.** `tilt` rotates children proportionally to the
 *   rendered per-frame velocity (the cards lean into motion and spring flat at
 *   rest); `onTick` exposes pos/velocity for WebGL or custom consumers.
 * - **Fidelity.** `destroy()` removes every listener + the ticker, kills the
 *   tilt state and restores the inline cursor/user-select/touch-action the
 *   effect had overwritten.
 *
 *   dragRail(".ak-rail-track", { tilt: 0.05 })
 *
 * CSS: viewport `overflow: hidden`; track `display: flex; width: max-content;
 * gap: 1rem; cursor: grab; user-select: none; touch-action: pan-y`.
 */
import { gsap, initGSAP } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { one, toArray } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface DragRailOptions extends CommonOptions {
  /** Scroll viewport around the track — defaults to `track.parentElement`. */
  viewport?: TargetLike;
  /** Children that tilt with velocity. @default `":scope > *"` */
  item?: string;
  /** Follow speed toward the intent, per 60fps frame (0..1). @default 0.1 */
  lerp?: number;
  /** Rubber-band resistance distance past the ends, px. @default 140 */
  edge?: number;
  /** Momentum multiplier on release (px of coast per px/frame of flick). @default 14 */
  throwScale?: number;
  /** Wheel / trackpad drives the rail (consumed while it can still move). @default true */
  wheel?: boolean;
  /** Degrees of tilt per px/frame of velocity — `0` disables. @default 0 */
  tilt?: number;
  /** Tilt clamp, degrees. @default 8 */
  tiltMax?: number;
  /** `(pos, velocity) => {}` called every rendered frame while mounted. */
  onTick?: (pos: number, velocity: number) => void;
}

export function dragRail(target: TargetLike, options: DragRailOptions = {}): Destroy {
  initGSAP();

  const track = one<HTMLElement>(target);
  if (!track) return () => {};

  const {
    viewport,
    item = ":scope > *",
    lerp = 0.1,
    edge = 140,
    throwScale = 14,
    wheel = true,
    tilt = 0,
    tiltMax = 8,
    onTick,
  } = options;

  return guard(options, () => {
    const vp = one<HTMLElement>(viewport) ?? track.parentElement ?? track;
    const prevStyle = {
      cursor: track.style.cursor,
      userSelect: track.style.userSelect,
      touchAction: track.style.touchAction,
    };

    /* ---------------- bounds ---------------- */

    let min = 0; // most-negative resting x (content overflows left)
    let max = 0; // start of the rail
    let pos = 0; // rendered x
    let intent = 0; // wanted x (drag/wheel/throw feed this)

    const measure = () => {
      const overflow = Math.max(0, track.scrollWidth - vp.clientWidth);
      min = -overflow;
      max = 0;
      // Fold an out-of-range position back through the soft edge (no jump).
      intent = soft(intent);
      pos = soft(pos);
    };

    /** tanh soft-edge: unbounded input, saturating output around [min, max]. */
    function soft(v: number): number {
      if (v > max) return max + edge * Math.tanh((v - max) / edge);
      if (v < min) return min + edge * Math.tanh((v - min) / edge);
      return v;
    }

    /* ---------------- pointer drag ---------------- */

    let dragging = false;
    let lastX = 0;
    let velocity = 0; // smoothed pointer delta (px/frame-ish)
    let renderedVel = 0; // rendered per-frame velocity (drives tilt/onTick)

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      lastX = e.clientX;
      velocity = 0;
      try {
        vp.setPointerCapture(e.pointerId);
      } catch {
        /* capture is best-effort — moves still land while the pointer is down */
      }
      track.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      velocity = velocity * 0.7 + dx * 0.3; // smooth out event-rate jitter
      intent = soft(intent + dx);
    };

    const endDrag = (e?: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      track.style.cursor = prevStyle.cursor || "grab";
      if (e) {
        try {
          vp.releasePointerCapture(e.pointerId);
        } catch {
          /* already released */
        }
      }
      // A flick coasts on its sampled momentum, then the soft edge reclaims it.
      intent = soft(intent + velocity * throwScale);
    };

    const onPointerUp = (e: PointerEvent) => endDrag(e);
    const onPointerCancel = (e: PointerEvent) => endDrag(e);
    const onDragStart = (e: Event) => e.preventDefault(); // no native img drag

    /* ---------------- wheel / trackpad ---------------- */

    const onWheel = (e: WheelEvent) => {
      if (!wheel) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const bound = delta > 0 ? max : min;
      const outward = (intent - bound) * (delta > 0 ? 1 : -1);
      if (outward > edge) return; // over-extended — hand the scroll back to the page
      e.preventDefault();
      e.stopPropagation(); // Lenis listens above us; it must not scroll in parallel
      intent = soft(intent + delta);
    };

    /* ---------------- tick ---------------- */

    const items = tilt ? toArray<HTMLElement>(item, track) : [];
    if (items.length) gsap.set(items, { transformOrigin: "50% 50%" });

    const tick = () => {
      const ratio = gsap.ticker.deltaRatio(60); // frames since last tick, clamped
      // Release restore: once input stops, overscrolled intent springs home.
      if (!dragging) {
        const bound = intent < min ? min : intent > max ? max : null;
        if (bound !== null) intent += (bound - intent) * Math.min(1, 0.18 * ratio);
      }
      const prev = pos;
      pos += (intent - pos) * Math.min(1, lerp * ratio);
      renderedVel = pos - prev;
      if (renderedVel === 0 && pos === intent) return; // idle: skip the write
      gsap.set(track, { x: pos });
      if (items.length) {
        gsap.set(items, {
          rotation: gsap.utils.clamp(-tiltMax, tiltMax, renderedVel * tilt),
        });
      }
      onTick?.(pos, renderedVel);
    };

    /* ---------------- wiring ---------------- */

    measure();
    track.dataset.akRail = "true";
    track.style.cursor = "grab";
    track.style.userSelect = "none";
    track.style.touchAction = "pan-y";

    vp.addEventListener("pointerdown", onPointerDown);
    vp.addEventListener("pointermove", onPointerMove);
    vp.addEventListener("pointerup", onPointerUp);
    vp.addEventListener("pointercancel", onPointerCancel);
    vp.addEventListener("wheel", onWheel, { passive: false });
    track.addEventListener("dragstart", onDragStart);
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("resize", onResize);
      vp.removeEventListener("pointerdown", onPointerDown);
      vp.removeEventListener("pointermove", onPointerMove);
      vp.removeEventListener("pointerup", onPointerUp);
      vp.removeEventListener("pointercancel", onPointerCancel);
      vp.removeEventListener("wheel", onWheel);
      track.removeEventListener("dragstart", onDragStart);
      gsap.ticker.remove(tick);
      delete track.dataset.akRail;
      track.style.cursor = prevStyle.cursor;
      track.style.userSelect = prevStyle.userSelect;
      track.style.touchAction = prevStyle.touchAction;
      gsap.set(track, { clearProps: "transform" });
      if (items.length) gsap.set(items, { clearProps: "rotation,transformOrigin" });
    };
  });
}
