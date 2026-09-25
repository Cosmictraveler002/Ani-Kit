/**
 * Stacked cards — the pinned "services" deck.
 *
 * A tall wrapper scrolls normally while a sticky viewport holds still; cards
 * inside are pre-offset below centre (`yPercent:50, y:innerHeight/2`) and a
 * scrubbed timeline marches them up past centre with a stagger and the
 * studio's `ak-card-stack` bezier.
 *
 * DOM contract:
 *   <div class="ak-stack-wrap">      ← trigger, height e.g. 500vh
 *     <div class="ak-stack-viewport">← pinned (pinSpacing:false)
 *       <div class="ak-stack-cards"> ← the row of cards
 *         …cards…
 */
import { gsap, ScrollTrigger, initGSAP, EASES } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { one, toArray } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface StackedCardsOptions extends CommonOptions {
  /** Tall scroll wrapper (trigger). */
  wrap?: TargetLike;
  /** Element that stays on screen. Defaults to `wrap`'s first child. */
  viewport?: TargetLike;
  /** Card selector scoped to the viewport. @default ".ak-card" */
  card?: string;
  /** Scrub smoothing. @default 0.5 */
  scrub?: number;
  /** Delay between cards, seconds. @default 0.12 */
  stagger?: number;
  /** The cascading ease. @default EASES.cardStack */
  ease?: string;
}

export function stackedCards(
  target: TargetLike,
  options: StackedCardsOptions = {},
): Destroy {
  initGSAP();

  const wrap = one<HTMLElement>(target);
  if (!wrap) return () => {};

  const viewport =
    (options.viewport ? one<HTMLElement>(options.viewport) : null) ??
    (wrap.firstElementChild as HTMLElement | null) ??
    wrap;

  const { scrub = 0.5, stagger = 0.12, card = ".ak-card", ease = EASES.cardStack } = options;

  return guard(options, () => {
    const cards = toArray<HTMLElement>(card, viewport);
    if (!cards.length) return () => {};

    const offset = () => window.innerHeight / 2;

    // Cards start stacked below centre…
    gsap.set(cards, { yPercent: 50, y: offset() });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top top",
        end: "bottom bottom",
        scrub,
        invalidateOnRefresh: true,
      },
    });

    // …and are marched up past centre, one after another.
    tl.to(
      cards,
      { yPercent: -50, y: () => -offset(), duration: 1, stagger, ease },
      "step",
    );

    const st = tl.scrollTrigger;

    ScrollTrigger.refresh();

    return () => {
      st?.kill();
      tl.kill();
      gsap.set(cards, { clearProps: "all" });
      ScrollTrigger.refresh();
    };
  });
}

/**
 * Variant used when the sticky viewport is a sibling rather than a child —
 * pins `viewport` with `pinSpacing:false` over `wrap`'s scroll length.
 */
export function stackedCardsPinned(
  wrapTarget: TargetLike,
  options: StackedCardsOptions & { viewport: TargetLike } = { viewport: "" },
): Destroy {
  initGSAP();

  const wrap = one<HTMLElement>(wrapTarget);
  const viewport = one<HTMLElement>(options.viewport);
  if (!wrap || !viewport) return () => {};

  const { scrub = true, stagger = 0.1, card = ".ak-card", ease = EASES.cardStack } = options;

  return guard(options, () => {
    const cards = toArray<HTMLElement>(card, viewport);
    if (!cards.length) return () => {};

    gsap.set(cards, { yPercent: 50, y: window.innerHeight / 2 });

    const pin = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      pin: viewport,
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top top",
        end: "bottom bottom",
        scrub,
        invalidateOnRefresh: true,
      },
    });

    tl.to(
      cards,
      {
        yPercent: -50,
        y: () => -window.innerHeight / 2,
        duration: 1,
        stagger,
        ease,
      },
      0,
    );

    ScrollTrigger.refresh();

    return () => {
      pin.kill();
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set(cards, { clearProps: "all" });
      ScrollTrigger.refresh();
    };
  });
}
