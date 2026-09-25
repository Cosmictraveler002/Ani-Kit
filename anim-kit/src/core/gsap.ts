/**
 * Central GSAP bootstrap: registers every plugin anim-kit touches, and the
 * custom eases that give the DZ!NR feel.
 *
 * Importing this module twice is safe — registration is idempotent.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { CustomEase } from "gsap/CustomEase";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { Flip } from "gsap/Flip";
import { toArray } from "./util.js";
import type { TargetLike } from "./types.js";

export { gsap, ScrollTrigger, SplitText, Draggable, CustomEase, ScrollSmoother, Flip };

/** Named eases recovered from dzinrstudio.com's bundles. */
export const EASES = {
  /** `.76,0,.2,1` — the studio's signature menu / nav curtain ease. */
  curtain: "ak-curtain",
  /** SVG path used for the stacked service-card cascade. */
  cardStack: "ak-card-stack",
  /** `.165,.84,.44,1` — their headline mask reveal. */
  reveal: "ak-reveal",
  /** `.895,.03,.685,.22` — preloader logo scale-out. */
  preloadOut: "ak-preload-out",
} as const;

let initted = false;

/** Register all plugins + custom eases exactly once. */
export function initGSAP(): void {
  if (initted || typeof window === "undefined") return;
  initted = true;

  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, CustomEase, Flip);

  // ScrollSmoother is a bonus for people who prefer it over Lenis; it is only
  // registered so `ScrollSmoother.create()` works if you call it yourself.
  try {
    gsap.registerPlugin(ScrollSmoother);
  } catch {
    /* not fatal — smoother is optional */
  }

  if (!CustomEase.get(EASES.curtain)) {
    CustomEase.create(EASES.curtain, ".76,0,.2,1");
    CustomEase.create(EASES.cardStack, "M0,0 C0,0 0.098,0.613 0.5,0.5 0.899,0.386 1,1 1,1");
    CustomEase.create(EASES.reveal, ".165,.84,.44,1");
    CustomEase.create(EASES.preloadOut, ".895,.03,.685,.22");
  }

  // Keep ScrollTrigger honest when images/fonts land late.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

initGSAP();

/**
 * Kill every tween that animates `target`.
 *
 * Deliberately **not** `gsap.killTweensOf()`. That forwards to
 * `tween.kill(targets, …)`, which walks each tween's *initialised*
 * prop-tween lookup — but a tween created between ticker frames is still
 * lazy (`_initted === false`), its lookup is empty, and the kill silently
 * no-ops. Such a tween then fires *after* teardown (e.g. an equaliser batch
 * rewriting `height` post-destroy). The no-arg `tween.kill()` takes the
 * full-kill path and removes both initialised and lazy tweens from the
 * timeline.
 *
 * Internal helper — effects import it from `core/gsap.js`; it is not part of
 * the public barrel.
 */
export function killTweens(target: TargetLike | Array<Element | null | undefined>): void {
  const raw: Array<Element | null | undefined> = Array.isArray(target) ? target : toArray(target);
  const list = raw.filter((el): el is Element => el instanceof Element);
  gsap.getTweensOf(list).forEach((t) => t.kill());
}
