/**
 * Pinned horizontal scroll — the "our work" gallery.
 *
 * A tall section is pinned while an inner track slides left; images inside
 * each panel get a secondary parallax driven by `containerAnimation`, so they
 * settle as they cross the viewport *horizontally* rather than vertically.
 *
 *   horizontalScroll(section, track, { panelImage: "img" })
 *
 * DOM contract:
 *   <section>            ← pinned (trigger)
 *     <div class="track">← translated on X (track)
 *       <div class="panel">…<img>…</div> × N
 */
import { gsap, ScrollTrigger, initGSAP } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { one } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface HorizontalScrollOptions extends CommonOptions {
  /** Pinned section (trigger). Defaults to the first argument's parent. */
  section?: TargetLike;
  /** Selector for images inside panels that get extra parallax. */
  panelImage?: string | null;
  /** Scrub smoothing for the horizontal movement. @default 0.5 */
  scrub?: number;
  /** Scrub smoothing for the image parallax. @default 0.2 */
  imageScrub?: number;
  /** Final X for the track; defaults to `track.scrollWidth - innerWidth`. */
  travel?: () => number;
  /** Kill ScrollTriggers created for the images. @default true */
  imageParallax?: boolean;
}

export function horizontalScroll(
  target: TargetLike,
  options: HorizontalScrollOptions = {},
): Destroy {
  initGSAP();

  const track = one<HTMLElement>(target);
  if (!track) return () => {};

  const section =
    (options.section ? one<HTMLElement>(options.section) : null) ??
    (track.closest("section") as HTMLElement | null) ??
    track;

  const {
    scrub = 0.5,
    imageScrub = 0.2,
    panelImage = "img",
    imageParallax = true,
  } = options;

  return guard(options, () => {
    const travel = () =>
      options.travel
        ? options.travel()
        : Math.max(0, track.scrollWidth - window.innerWidth);

    const tweens: gsap.core.Tween[] = [];
    const triggers: ScrollTrigger[] = [];

    const main = gsap.to(track, {
      x: () => -travel(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub,
        end: () => "+=" + travel(),
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
    tweens.push(main);
    if (main.scrollTrigger) triggers.push(main.scrollTrigger);

    if (imageParallax && panelImage) {
      const images = gsap.utils.toArray<HTMLElement>(panelImage, track);
      images.forEach((img) => {
        const t = gsap.fromTo(
          img,
          { scale: 0.9, yPercent: 30 },
          {
            scale: 1,
            yPercent: 0,
            ease: "power4.out",
            scrollTrigger: {
              trigger: img,
              containerAnimation: main,
              start: "left 100%",
              end: "left 20%",
              scrub: imageScrub,
            },
          },
        );
        tweens.push(t);
        if (t.scrollTrigger) triggers.push(t.scrollTrigger);
      });
    }

    // Late-loading images change track width — refresh once they land.
    const onLoad = () => ScrollTrigger.refresh();
    const imgs = Array.from(track.querySelectorAll("img"));
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", onLoad, { once: true });
    });
    window.addEventListener("load", onLoad);

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("load", onLoad);
      imgs.forEach((img) => img.removeEventListener("load", onLoad));
      triggers.forEach((t) => t.kill());
      tweens.forEach((t) => t.kill());
      gsap.set(track, { clearProps: "transform" });
      ScrollTrigger.refresh();
    };
  });
}
