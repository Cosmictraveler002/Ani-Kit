/**
 * Reel text — the per-character odometer roll.
 *
 * Every character gets its own overflow-hidden mask and a vertical strip of
 * ghost glyphs stacked under the final one; the strips roll upward (staggered
 * left→right) and land on the real text. This is the DOM twin of a shader
 * slot-reel: character cells spun per glyph (`u_roll`/`u_spin` style), ported
 * to plain GSAP so it needs no canvas. Why it is shaped this way:
 *
 * - **Built eagerly, rolled on trigger.** The masks exist as soon as the
 *   effect mounts (so layout is stable and tests can see the structure); the
 *   roll plays immediately or on scroll-enter. On completion the original
 *   `innerHTML` is restored — screen readers and copy/paste see clean text —
 *   and a `replay` re-entry re-splits from scratch. The ScrollTrigger is
 *   registered **once per element**, outside the rebuild path, so replay
 *   never stacks triggers.
 * - **Width probed, never guessed.** Each wrapper's width is measured from
 *   the *final* glyph (hidden probe in the body) so ghost frames of a
 *   different width can't jitter the line while it spins. jsdom reports 0 —
 *   the wrapper then shrink-wraps, which is why the unit smoke still passes.
 * - **Same-case ghosts.** Uppercase rolls through the uppercase alphabet,
 *   lowercase through lowercase, digits through digits — the line never
 *   changes colour/shape mid-roll the way mixed-case ghosts would. Spaces and
 *   punctuation stay as plain text (they don't spin).
 * - **Fidelity.** `destroy()` kills the timeline + trigger, clears the stamp
 *   and puts the original `innerHTML` back byte for byte.
 *
 *   reelText("[data-reel]", { mode: "scroll", frames: 4 })
 *
 * CSS: nothing required — masks, strip and frame heights are inline. Give the
 * target the `line-height` you want the cells to inherit.
 */
import { gsap, ScrollTrigger, initGSAP } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { toArray } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface ReelTextOptions extends CommonOptions {
  /** `'immediate'` rolls on mount; `'scroll'` rolls on viewport enter. @default `"immediate"` */
  mode?: "immediate" | "scroll";
  /** ScrollTrigger start (only with `mode: "scroll"`). @default `"top 85%"` */
  start?: string;
  /** Ghost frames per character before the final glyph. @default 4 */
  frames?: number;
  /** Roll duration per character, seconds. @default 0.8 */
  duration?: number;
  /** Stagger between characters, seconds. @default 0.05 */
  stagger?: number;
  /** GSAP ease for the roll. @default `"power4.out"` */
  ease?: string;
  /** Re-arm on every scroll re-entry instead of playing once. @default false */
  replay?: boolean;
}

interface Cell {
  el: HTMLElement;
  original: string;
}

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";

/** Only alphanumerics get a reel; spaces/punctuation pass through untouched. */
const spins = (ch: string) => /[A-Za-z0-9]/.test(ch);

const ghostsFor = (ch: string, count: number): string => {
  const pool = /[A-Z]/.test(ch) ? UPPERCASE : /[a-z]/.test(ch) ? LOWERCASE : DIGITS;
  let out = "";
  for (let i = 0; i < count; i++) out += pool[Math.floor(Math.random() * pool.length)];
  return out;
};

/** Width of a glyph — 0 in jsdom, where wrappers may shrink-wrap instead. */
const measureGlyph = (ch: string, sample: HTMLElement): number => {
  const doc = sample.ownerDocument;
  if (!doc.body) return 0;
  const probe = doc.createElement("span");
  probe.style.cssText = "position:absolute;visibility:hidden;white-space:pre;";
  probe.textContent = ch;
  doc.body.appendChild(probe);
  const w = probe.getBoundingClientRect().width;
  probe.remove();
  return Math.round(w);
};

export function reelText(target: TargetLike, options: ReelTextOptions = {}): Destroy {
  initGSAP();

  const els = toArray<HTMLElement>(target);
  if (!els.length) return () => {};

  const {
    mode = "immediate",
    start = "top 85%",
    frames = 4,
    duration = 0.8,
    stagger = 0.05,
    ease = "power4.out",
    replay = false,
  } = options;

  return guard(options, () => {
    const cells: Cell[] = [];
    const timelines = new Map<HTMLElement, gsap.core.Timeline>();
    const triggers: ScrollTrigger[] = [];

    /** Unwind to the original markup (on completion and on destroy). */
    const restore = (el: HTMLElement) => {
      const i = cells.findIndex((c) => c.el === el);
      if (i < 0) return;
      el.innerHTML = cells[i].original;
      delete el.dataset.akReel;
      cells.splice(i, 1);
    };

    /**
     * Split one element into masks + a paused roll timeline.
     * Returns the timeline; the caller decides when (and whether) it plays.
     */
    const build = (el: HTMLElement): gsap.core.Timeline | null => {
      const text = el.textContent ?? "";
      if (!text.trim()) return null;

      timelines.get(el)?.kill(); // a finished roll from a previous entry
      // Keep the FIRST original: a second build must not snapshot masked HTML.
      if (!cells.some((c) => c.el === el)) cells.push({ el, original: el.innerHTML });

      const lineHeight =
        parseFloat(getComputedStyle(el).lineHeight) || el.getBoundingClientRect().height || 16;

      // Original markup → per-char segments (the element must be plain text).
      el.textContent = "";
      const strips: HTMLElement[] = [];
      const ends: number[] = [];

      for (const ch of [...text]) {
        if (!spins(ch)) {
          el.appendChild(el.ownerDocument.createTextNode(ch));
          continue;
        }
        const wrapper = el.ownerDocument.createElement("span");
        wrapper.className = "ak-reel__ch";
        wrapper.style.cssText = `display:inline-block;overflow:hidden;vertical-align:top;height:${lineHeight}px;`;

        const width = measureGlyph(ch, el);
        if (width > 0) wrapper.style.width = `${width}px`;

        const strip = el.ownerDocument.createElement("span");
        strip.className = "ak-reel__strip";
        strip.style.cssText = "display:flex;flex-direction:column;will-change:transform;";

        for (const frame of ghostsFor(ch, frames) + ch) {
          const frameEl = el.ownerDocument.createElement("span");
          frameEl.style.cssText = `display:flex;align-items:center;justify-content:center;height:${lineHeight}px;flex:none;`;
          frameEl.textContent = frame;
          strip.appendChild(frameEl);
        }

        wrapper.appendChild(strip);
        el.appendChild(wrapper);
        strips.push(strip);
        ends.push(-frames * lineHeight);
      }

      el.dataset.akReel = "true";

      const tl = gsap.timeline({ paused: true, onComplete: () => restore(el) });
      strips.forEach((strip, i) => {
        tl.to(strip, { y: ends[i], duration, ease }, i * stagger);
      });
      timelines.set(el, tl);
      return tl;
    };

    els.forEach((el) => {
      const tl = build(el);
      if (!tl) return;

      if (mode === "immediate") {
        tl.play(0);
        return;
      }

      // Registered once per element — rebuilds on replay reuse this trigger.
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start,
          once: !replay,
          onEnter: () => {
            // Restored after the last roll (or never started) → rebuild first.
            const active = el.dataset.akReel === "true" ? timelines.get(el) : build(el);
            active?.play(0);
          },
        }),
      );
    });

    return () => {
      triggers.forEach((st) => st.kill());
      triggers.length = 0;
      timelines.forEach((tl) => tl.kill());
      timelines.clear();
      cells.slice().forEach((cell) => {
        cell.el.innerHTML = cell.original;
        delete cell.el.dataset.akReel;
      });
      cells.length = 0;
    };
  });
}
