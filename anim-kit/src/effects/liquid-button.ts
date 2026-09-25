/**
 * Liquid button — the SVG wave that floods a button from the bottom on hover.
 *
 * Pure CSS/SVG geometry + a transition, exactly as the studio does it: an
 * oversized (`160%`) SVG sits below the button and translates up on hover with
 * a curved top edge, so the fill looks like liquid rising rather than a flat
 * rectangle. Text colour cross-fades on top of it.
 *
 * Usage:
 *   <button class="ak-liquid" data-ak-liquid>
 *     <svg class="ak-liquid__wave" viewBox="0 0 100 100" preserveAspectRatio="none">
 *       <path d="M0,30 Q50,-5 100,30 L100,100 L0,100 Z"/>
 *     </svg>
 *     <span class="ak-liquid__label">Lets Talk</span>
 *   </button>
 *
 * This module just wires the custom properties (`--ak-liquid-duration`,
 * `--ak-liquid-fill`) from JS options onto the markup, so a single stylesheet
 * drives every instance.
 */
import { toArray } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface LiquidButtonOptions extends CommonOptions {
  /** Wave travel time in ms. @default 900 */
  duration?: number;
  /** CSS colour for the wave fill. @default "var(--ak-primary, #6c5ce7)" */
  fill?: string;
  /** Which edge the liquid rises from. @default "up" */
  direction?: "up" | "down";
  /** Colour the label turns on hover. @default "#fff" */
  labelColor?: string;
}

export function liquidButton(
  target: TargetLike,
  options: LiquidButtonOptions = {},
): Destroy {
  const els = toArray<HTMLElement>(target);
  if (!els.length) return () => {};

  const {
    duration = 900,
    fill = "var(--ak-primary, #6c5ce7)",
    direction = "up",
    labelColor = "#fff",
  } = options;

  els.forEach((el) => {
    el.dataset.akLiquid = direction;
    el.style.setProperty("--ak-liquid-duration", `${duration}ms`);
    el.style.setProperty("--ak-liquid-fill", fill);
    el.style.setProperty("--ak-liquid-label", labelColor);
  });

  return () => {
    els.forEach((el) => {
      delete el.dataset.akLiquid;
      el.style.removeProperty("--ak-liquid-duration");
      el.style.removeProperty("--ak-liquid-fill");
      el.style.removeProperty("--ak-liquid-label");
    });
  };
}

/**
 * Underline sweep — the `after:` pseudo-element that wipes left→right on
 * hover. Applied as a class so it works with zero JS; this helper exists so
 * the same behaviour can be scoped programmatically.
 */
export function underlineLink(target: TargetLike): Destroy {
  const els = toArray<HTMLElement>(target);
  els.forEach((el) => el.classList.add("ak-underline"));
  return () => els.forEach((el) => el.classList.remove("ak-underline"));
}
