/**
 * Roll text — the rolling word rotator.
 *
 * The target holds two or more rows; they are stacked into a hidden overflow
 * box one row tall, and the box rolls to the next row on an interval — the
 * first row is cloned at the end so the wrap is seamless (same trick as
 * `marquee()`).
 *
 *   <span class="ak-roll" data-roll>
 *     <span>Design</span><span>Code</span><span>Motion</span>
 *   </span>
 *
 * destroy() unwraps the rows, removes the clone and restores every inline
 * style it touched — markup comes back byte-identical.
 */
import { gsap, initGSAP, killTweens } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { toArray } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface RollTextOptions extends CommonOptions {
  /** Seconds each row is shown (including the roll). @default 2.2 */
  interval?: number;
  /** Roll duration, seconds. @default 0.6 */
  duration?: number;
  /** GSAP ease for the roll. @default "power4.inOut" */
  ease?: string;
  /** "up" rolls rows upward, "down" walks them in reverse. @default "up" */
  direction?: "up" | "down";
}

export function rollText(target: TargetLike, options: RollTextOptions = {}): Destroy {
  initGSAP();

  const { interval = 2.2, duration = 0.6, ease = "power4.inOut", direction = "up" } = options;

  const els = toArray<HTMLElement>(target);
  if (!els.length) return () => {};

  return guard(options, () => {
    const setups: Array<{
      el: HTMLElement;
      inner: HTMLElement;
      rows: HTMLElement[];
      snapshots: Array<{ el: HTMLElement; cssText: string }>;
      timeline: gsap.core.Timeline | null;
    }> = [];

    els.forEach((el) => {
      const rows = Array.from(el.children).filter(
        (n): n is HTMLElement => n instanceof HTMLElement,
      );
      if (rows.length < 2) return;

      // Snapshot inline styles BEFORE touching them (restored on destroy).
      const snapshots: Array<{ el: HTMLElement; cssText: string }> = [
        { el, cssText: el.style.cssText },
        ...rows.map((r) => ({ el: r, cssText: r.style.cssText })),
      ];

      // Rows must stack as blocks for the box to measure one row.
      rows.forEach((r) => (r.style.display = "block"));
      if (window.getComputedStyle(el).display === "inline") el.style.display = "inline-block";

      const inner = document.createElement("div");
      inner.className = "ak-roll__inner";
      el.insertBefore(inner, rows[0]);
      rows.forEach((r) => inner.appendChild(r));
      const clone = rows[0].cloneNode(true) as HTMLElement;
      clone.setAttribute("data-ak-roll-clone", "");
      inner.appendChild(clone);

      const rowH = rows[0].getBoundingClientRect().height;
      el.style.overflow = "hidden";
      el.style.height = `${rowH}px`;
      el.dataset.akRoll = String(rows.length);

      let timeline: gsap.core.Timeline | null = null;
      if (rowH > 0) {
        const n = rows.length;
        const hold = Math.max(0.01, interval - duration);
        const tl = gsap.timeline({ repeat: -1, defaults: { ease } });
        if (direction === "up") {
          gsap.set(inner, { y: 0 });
          for (let i = 1; i <= n; i++) {
            tl.to(inner, { y: -i * rowH, duration });
            tl.to({}, { duration: hold });
          }
          tl.set(inner, { y: 0 });
        } else {
          gsap.set(inner, { y: -n * rowH });
          for (let i = n - 1; i >= 0; i--) {
            tl.to(inner, { y: -i * rowH, duration });
            tl.to({}, { duration: hold });
          }
          tl.set(inner, { y: -n * rowH });
        }
        timeline = tl;
      }

      setups.push({ el, inner, rows, snapshots, timeline });
      // Clone lives inside inner — remember it for teardown via the attribute.
    });

    return () => {
      setups.forEach(({ el, inner, rows, snapshots, timeline }) => {
        timeline?.kill();
        // Unwrap: rows home first, then drop the (now empty) inner box.
        rows.forEach((r) => el.appendChild(r));
        inner.remove();
        killTweens(inner);
        snapshots.forEach(({ el: node, cssText }) => (node.style.cssText = cssText));
        delete el.dataset.akRoll;
      });
      setups.length = 0;
    };
  });
}
