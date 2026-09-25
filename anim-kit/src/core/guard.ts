/**
 * Reduced-motion helper.
 *
 * Every effect calls `guard(options, run)`.
 *  - normal motion  -> runs `run()` and returns its destroy fn
 *  - reduced motion -> returns a no-op so nothing animates. Effects that need
 *                      content visible in both states should render the final
 *                      state in CSS (see styles/anim-kit.css).
 */
import { initGSAP } from "./gsap.js";
import { prefersReducedMotion } from "./util.js";
import type { CommonOptions, Destroy } from "./types.js";

export function guard(options: CommonOptions, run: () => Destroy): Destroy {
  initGSAP();
  if (prefersReducedMotion() && !options.force) return () => {};
  return run();
}
