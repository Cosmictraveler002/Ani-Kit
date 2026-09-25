/**
 * Scatter text — the giant "So, are you ready to Stand out?" band.
 *
 * The line is split into per-character spans, then pinned and scrolled
 * horizontally. Every character carries a random initial `yPercent` (±60) and
 * `rotation` (±15) and settles to zero as it crosses the viewport, driven by
 * `containerAnimation` so the settle is tied to the *horizontal* scroll.
 */
import { gsap, ScrollTrigger, initGSAP } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { one } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface ScatterTextOptions extends CommonOptions {
  /** Element that holds the text and gets translated on X. */
  line?: TargetLike;
  /** Element pinned while the band scrolls. */
  pinTarget?: TargetLike;
  /** Split by "chars" (default) or "words". @default "chars" */
  granularity?: "chars" | "words";
  /** Max random vertical offset, in percent of the line height. @default 60 */
  scatterY?: number;
  /** Max random rotation, degrees. @default 15 */
  scatterRotation?: number;
  /** Scrub smoothing. @default 0.5 */
  scrub?: number;
  /** Per-character settle start/end as a fraction of the container. */
  settleStart?: string;
  settleEnd?: string;
}

export function scatterText(
  target: TargetLike,
  options: ScatterTextOptions = {},
): Destroy {
  initGSAP();

  const wrap = one<HTMLElement>(target);
  const line = (options.line ? one<HTMLElement>(options.line) : null) ?? wrap;
  if (!wrap || !line) return () => {};

  const pinTarget =
    (options.pinTarget ? one<HTMLElement>(options.pinTarget) : null) ??
    (wrap.querySelector<HTMLElement>("[data-pin]") ?? wrap);

  const {
    granularity = "chars",
    scatterY = 60,
    scatterRotation = 15,
    scrub = 0.5,
    settleStart = "left 100%",
    settleEnd = "left 15%",
  } = options;

  return guard(options, () => {
    const tweens: gsap.core.Tween[] = [];
    const triggers: ScrollTrigger[] = [];
    const text = line.textContent || "";

    const build = () => {
      // Split manually: spaces need a fixed-size slot so the band keeps flowing.
      line.innerHTML = text
        .split("")
        .map((ch) =>
          ch === " "
            ? `<span class="ak-space"> </span>`
            : granularity === "chars"
              ? `<span class="ak-char">${ch}</span>`
              : `<span class="ak-char">${ch}</span>`,
        )
        .join("");

      const travel = () => Math.max(0, line.scrollWidth - window.innerWidth);

      const master = gsap.to(line, {
        x: () => -travel(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          pin: pinTarget,
          scrub,
          end: () => "+=" + travel(),
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      tweens.push(master);
      if (master.scrollTrigger) triggers.push(master.scrollTrigger);

      const pieces = Array.from(line.querySelectorAll<HTMLElement>(".ak-char"));
      pieces.forEach((piece) => {
        const y = (Math.random() - 0.5) * scatterY;
        const r = (Math.random() - 0.5) * scatterRotation;
        const t = gsap.fromTo(
          piece,
          { yPercent: y, rotation: r },
          {
            yPercent: 0,
            rotation: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: piece,
              containerAnimation: master,
              start: settleStart,
              end: settleEnd,
              scrub: 0.5,
            },
          },
        );
        tweens.push(t);
        if (t.scrollTrigger) triggers.push(t.scrollTrigger);
      });

      ScrollTrigger.refresh();
    };

    // Measure only after webfonts land, or the travel distance is wrong.
    if (document.fonts?.ready) document.fonts.ready.then(build).catch(build);
    else build();

    return () => {
      triggers.forEach((t) => t.kill());
      tweens.forEach((t) => t.kill());
      line.textContent = text;
      gsap.set(line, { clearProps: "transform" });
      ScrollTrigger.refresh();
    };
  });
}
