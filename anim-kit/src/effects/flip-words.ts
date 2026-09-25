/**
 * Flip word transfer — words glide from one layout into another (FLIP).
 *
 * The source block holds the words; `to` is the block they land in. Both
 * blocks should share one grid cell so the page never reflows when the
 * words move:
 *
 *     .flip-stage     { display: grid; }
 *     .flip-stage > div { grid-area: 1 / 1; }  // source + destination overlap
 *
 * On trigger every word is measured where it stands, moved into the
 * destination, and animated from its old position (the classic FLIP
 * technique), with a mid-flight squash so the words pop as they travel.
 * Because the measurement happens up front, the words *look* like they are
 * still in the source at scroll progress 0 even though they already live in
 * the destination — so a scrubbed transfer reverses perfectly.
 *
 *   flipWords("[data-flip-from]", { to: "[data-flip-to]", scrub: 1 });
 *
 * destroy() kills the timeline, puts every word back in its original
 * parent (in the original order) and restores its inline transform.
 */
import { gsap, Flip, ScrollTrigger, initGSAP, killTweens } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { one, toArray } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface FlipWordsOptions extends CommonOptions {
  /** Destination block — every word is moved into it. */
  to: TargetLike;
  /**
   * The words inside the source.
   * @default `[data-flip-word]` matches, else the source's element children
   */
  words?: TargetLike;
  /** Seconds for one word's travel. @default 1.4 */
  duration?: number;
  /** GSAP ease. @default "power4.inOut" */
  ease?: string;
  /** Seconds between word starts. @default 0.2 */
  stagger?: number;
  /** Mid-flight scale a word squashes to (0 disables the squash). @default 0.2 */
  scale?: number;
  /** "scroll" plays on enter (reverses on leave-back), "immediate" plays now. @default "scroll" */
  mode?: "scroll" | "immediate";
  /**
   * Bind the transfer to scroll progress instead of playing it on enter —
   * number = scrub smoothing seconds, `true` = immediate. unset = one-shot.
   */
  scrub?: number | boolean;
  /** ScrollTrigger start. @default "top 75%" */
  start?: string;
  /** ScrollTrigger end (scrub mode). @default "bottom 45%" */
  end?: string;
}

export function flipWords(from: TargetLike, options: FlipWordsOptions): Destroy {
  initGSAP();

  const src = one<HTMLElement>(from);
  const dest = one<HTMLElement>(options?.to);
  if (!src || !dest) return () => {};

  const {
    words,
    duration = 1.4,
    ease = "power4.inOut",
    stagger = 0.2,
    scale = 0.2,
    mode = "scroll",
    scrub,
    start = "top 75%",
    end = "bottom 45%",
  } = options;

  const marked = toArray<HTMLElement>(src.querySelectorAll("[data-flip-word]"));
  const wordEls = words
    ? toArray<HTMLElement>(words, src)
    : marked.length
      ? marked
      : [...src.children] as HTMLElement[];
  if (!wordEls.length) return () => {};

  return guard(options, () => {
    // Remember each word's home so destroy() can put everything back in order.
    const home = wordEls.map((w) => ({ parent: w.parentNode, next: w.nextSibling }));
    const prevTransform = wordEls.map((w) => w.style.transform);

    // Measure in the source, move into the destination, then animate from
    // the measurement — the FLIP. The wrapper timeline owns the flight so
    // ScrollTrigger can scrub it and the scale accents can share its clock.
    const state = Flip.getState(wordEls);
    wordEls.forEach((w) => dest.appendChild(w));

    const tl = gsap.timeline({ paused: true });
    // The wrapper is paused, and `add` is synchronous, so the Flip child
    // never renders on the global timeline before the wrapper owns it.
    tl.add(Flip.from(state, { duration, ease, stagger: { each: stagger } }), 0);

    if (scale > 0) {
      wordEls.forEach((w, i) => {
        const at = i * stagger;
        tl.to(w, { scale, duration: duration * 0.5, ease }, at);
        tl.to(w, { scale: 1, duration: duration * 0.5, ease }, at + duration * 0.5);
      });
    }

    let st: ScrollTrigger | undefined;
    if (mode === "immediate") {
      tl.play(0);
    } else if (scrub !== undefined) {
      st = ScrollTrigger.create({
        trigger: src,
        start,
        end,
        scrub: scrub === true ? true : scrub,
        animation: tl,
      });
    } else {
      st = ScrollTrigger.create({
        trigger: src,
        start,
        animation: tl,
        toggleActions: "play none none reverse",
      });
    }
    ScrollTrigger.refresh();

    return () => {
      st?.kill();
      tl.kill();
      killTweens(wordEls);
      // Reparent home. A stored `next` sibling that has moved with the words
      // is not in the parent anymore — fall back to appending in order.
      wordEls.forEach((w, i) => {
        const h = home[i];
        if (!h.parent) return;
        const ref = h.next && h.next.parentNode === h.parent ? h.next : null;
        h.parent.insertBefore(w, ref);
      });
      gsap.set(wordEls, { clearProps: "transform" });
      wordEls.forEach((w, i) => {
        w.style.transform = prevTransform[i];
      });
      ScrollTrigger.refresh();
    };
  });
}
