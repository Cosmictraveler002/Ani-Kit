/**
 * Marquee — the infinite, dual-row client-logo band.
 *
 * Two rows scroll in opposite directions at a constant px/s using a single
 * rAF loop. Each row's content is duplicated once; when the offset passes one
 * copy's width it wraps by exactly that width, so the seam is invisible.
 *
 *   <div class="ak-marquee">
 *     <div class="ak-marquee__viewport">
 *       <div class="ak-marquee__track" data-dir="left">…items…</div>
 *     </div>
 *   </div>
 *
 * Call `marquee()` once per track, or pass a container with `[data-marquee]`.
 */
import { gsap, initGSAP } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { toArray } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface MarqueeOptions extends CommonOptions {
  /** Pixels per second. @default 40 (the studio's rate) */
  speed?: number;
  /** Force a direction for every track. Otherwise read `data-dir`. */
  direction?: "left" | "right";
  /** Duplicate the content automatically if it isn't already doubled. @default true */
  clone?: boolean;
  /** Pause the loop on pointer enter. @default false */
  pauseOnHover?: boolean;
}

export function marquee(target: TargetLike, options: MarqueeOptions = {}): Destroy {
  initGSAP();

  const roots = toArray<HTMLElement>(target);
  if (!roots.length) return () => {};

  const { speed = 40, clone = true, pauseOnHover = false } = options;

  return guard(options, () => {
    const tracks: HTMLElement[] = [];
    roots.forEach((root) => {
      if (root.matches("[data-marquee-track]")) tracks.push(root);
      else root.querySelectorAll<HTMLElement>("[data-marquee-track]").forEach((t) => tracks.push(t));
    });

    const states = tracks.map((track) => {
      const originalCount = track.children.length;
      if (clone) duplicateOnce(track);
      const dir =
        options.direction ?? (track.dataset.dir === "right" ? "right" : "left");
      return {
        track,
        dir,
        offset: 0,
        width: 0,
        hovering: false,
        originalCount,
        // Only OUR duplication gets removed on destroy — a consumer who
        // pre-tiled the track (data-marquee-cloned) keeps their markup.
        cloned: track.children.length > originalCount,
      };
    });

    const measure = () => {
      states.forEach((s) => {
        s.width = measureCopy(s.track);
        if (s.dir === "right" && s.offset === 0) s.offset = -s.width;
      });
    };

    measure();

    let last = performance.now();
    let rafId = 0;
    let running = true;

    const loop = (now: number) => {
      if (!running) return;
      const dt = Math.min(64, now - last) / 1000;
      last = now;

      for (const s of states) {
        if (!s.width) continue;
        if (pauseOnHover && s.hovering) continue;
        const delta = speed * dt * (s.dir === "right" ? 1 : -1);
        s.offset += delta;
        // Wrap by exactly one copy width — seamless.
        if (s.offset <= -s.width) s.offset += s.width;
        if (s.offset >= 0) s.offset -= s.width;
        gsap.set(s.track, { x: s.offset });
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const onResize = () => {
      measure();
    };
    window.addEventListener("resize", onResize);

    const cleanups: Array<() => void> = [];
    if (pauseOnHover) {
      states.forEach((s) => {
        const enter = () => (s.hovering = true);
        const leave = () => (s.hovering = false);
        s.track.addEventListener("pointerenter", enter);
        s.track.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          s.track.removeEventListener("pointerenter", enter);
          s.track.removeEventListener("pointerleave", leave);
        });
      });
    }

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      cleanups.forEach((fn) => fn());
      states.forEach((s) => {
        gsap.set(s.track, { clearProps: "transform" });
        // Contract: destroy restores the original markup — drop our copy.
        if (s.cloned) {
          while (s.track.children.length > s.originalCount) {
            s.track.removeChild(s.track.lastElementChild!);
          }
          delete s.track.dataset.marqueeCloned;
        }
      });
    };
  });
}

function duplicateOnce(track: HTMLElement): void {
  if (track.dataset.marqueeCloned === "true") return;
  const copy = track.innerHTML;
  track.insertAdjacentHTML("beforeend", copy);
  track.dataset.marqueeCloned = "true";
}

/** Width of a single copy of the track content, in px. */
function measureCopy(track: HTMLElement): number {
  if (track.dataset.marqueeCloned !== "true") return track.scrollWidth;
  // Content was doubled, so one copy is half — but gaps can make it uneven,
  // so measure the first half of the children instead.
  const children = Array.from(track.children) as HTMLElement[];
  if (!children.length) return track.scrollWidth / 2;
  const half = Math.floor(children.length / 2);
  let width = 0;
  for (let i = 0; i < half; i++) {
    const r = children[i].getBoundingClientRect();
    const next = children[i + 1]?.getBoundingClientRect();
    width += next ? next.left - r.left : r.width;
  }
  return width > 0 ? width : track.scrollWidth / 2;
}
