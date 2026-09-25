/**
 * Scramble text — the decode / cipher reveal.
 *
 * Each character churns through the charset and settles on its final glyph,
 * left to right; letters scramble, everything else (digits, punctuation,
 * spaces) stays put, and case is preserved. Three triggers:
 *
 *   mode: "scroll"    → plays once when the element enters the viewport.
 *   mode: "immediate" → plays at once (above the fold).
 *   mode: "hover"     → re-scrambles on every pointer enter.
 *
 * The element's textContent is restored exactly on destroy.
 */
import { gsap, ScrollTrigger, initGSAP } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { toArray } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface ScrambleTextOptions extends CommonOptions {
  /** "scroll" plays on enter, "immediate" now, "hover" on pointerenter. @default "scroll" */
  mode?: "scroll" | "immediate" | "hover";
  /** Glyphs each letter churns through. @default "abcdefghijklmnopqrstuvwxyz" */
  charset?: string;
  /** Seconds each character spends scrambling. @default 0.18 */
  durationPerChar?: number;
  /** Delay between character starts, seconds. @default 0.04 */
  stagger?: number;
  /** Delay before the timeline starts, seconds. @default 0 */
  delay?: number;
  /** ScrollTrigger start position (mode: "scroll"). @default "top 80%" */
  start?: string;
}

export function scrambleText(target: TargetLike, options: ScrambleTextOptions = {}): Destroy {
  initGSAP();

  const {
    mode = "scroll",
    charset = "abcdefghijklmnopqrstuvwxyz",
    durationPerChar = 0.18,
    stagger = 0.04,
    delay = 0,
    start = "top 80%",
  } = options;

  const els = toArray<HTMLElement>(target);
  if (!els.length) return () => {};

  return guard(options, () => {
    const originals = new Map<HTMLElement, string>();
    const timelines: gsap.core.Timeline[] = [];
    const cleanups: Array<() => void> = [];

    /** Fill a timeline with one eased scramble tween per letter. */
    const fill = (el: HTMLElement, original: string, tl: gsap.core.Timeline) => {
      Array.from(original).forEach((ch, i) => {
        if (!/[a-z]/i.test(ch)) return; // digits / punctuation / spaces stay put
        const upper = ch === ch.toUpperCase();
        const state = { p: 0 };
        tl.to(
          state,
          {
            p: 1,
            duration: durationPerChar,
            ease: "power3.out",
            onUpdate: () => {
              if (state.p >= 1) return;
              const glyph = charset[Math.floor(Math.random() * charset.length)];
              el.textContent =
                original.slice(0, i) + (upper ? glyph.toUpperCase() : glyph) + original.slice(i + 1);
            },
          },
          i * stagger,
        );
      });
      tl.eventCallback("onComplete", () => (el.textContent = original));
    };

    els.forEach((el) => {
      const original = el.textContent ?? "";
      if (!original) return;
      originals.set(el, original);
      el.dataset.akScramble = "true";

      if (mode === "scroll") {
        const tl = gsap.timeline({
          delay,
          scrollTrigger: { trigger: el, start, once: true },
        });
        fill(el, original, tl);
        timelines.push(tl);
      } else if (mode === "immediate") {
        const tl = gsap.timeline({ delay });
        fill(el, original, tl);
        timelines.push(tl);
      } else {
        const tl = gsap.timeline({ delay, paused: true });
        fill(el, original, tl);
        timelines.push(tl);
        const onEnter = () => tl.restart();
        el.addEventListener("pointerenter", onEnter);
        cleanups.push(() => el.removeEventListener("pointerenter", onEnter));
      }
    });

    ScrollTrigger.refresh();

    return () => {
      cleanups.forEach((fn) => fn());
      timelines.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
      originals.forEach((text, el) => {
        el.textContent = text;
        delete el.dataset.akScramble;
      });
      originals.clear();
      ScrollTrigger.refresh();
    };
  });
}
