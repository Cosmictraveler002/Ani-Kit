import type { Destroy, TargetLike } from "./types.js";

/**
 * Resolve a selector / element / list into a real array of elements.
 *
 * When `scope` is given, string targets are queried inside it — this is what
 * lets effects take both `".card"` and `".card" within container`.
 */
export function toArray<T extends Element = HTMLElement>(
  target: TargetLike,
  scope?: ParentNode | null,
): T[] {
  if (!target) return [];
  if (typeof target === "string") {
    const root: ParentNode = scope ?? document;
    return Array.from(root.querySelectorAll<T>(target));
  }
  if (target instanceof Element) return [target as T];
  if (target instanceof NodeList || Array.isArray(target)) {
    return Array.from(target) as T[];
  }
  return [];
}

/** Resolve to a single element, or null. */
export function one<T extends Element = HTMLElement>(
  target: TargetLike,
  scope?: ParentNode | null,
): T | null {
  return toArray<T>(target, scope)[0] ?? null;
}

/** Run `fn` once the DOM is ready (no-op if it is already interactive/complete). */
export function onReady(fn: () => void): void {
  if (typeof document === "undefined") return;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();
  }
}

/** Compose several destroy functions into one. */
export function compose(...fns: Array<Destroy | undefined | null>): Destroy {
  return () => {
    for (let i = fns.length - 1; i >= 0; i--) {
      try {
        fns[i]?.();
      } catch {
        /* destroying twice must never throw */
      }
    }
  };
}

/** Schedule a callback on the next animation frame; returns a cancel fn. */
export function raf(fn: () => void): () => void {
  let id = 0;
  let pending = false;
  const run = () => {
    pending = false;
    fn();
  };
  const schedule = () => {
    if (pending) return;
    pending = true;
    id = requestAnimationFrame(run);
  };
  schedule();
  return () => cancelAnimationFrame(id);
}

/** Read the user's motion preference (safe outside the browser). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
