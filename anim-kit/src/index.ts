/**
 * anim-kit — modular animation library extracted from dzinrstudio.com.
 *
 * Core:
 *   smoothScroll()   Lenis + ScrollTrigger bridge (lerp 0.08)
 *   initGSAP()       registers GSAP plugins + the studio's custom eases
 *   split()          text splitting with mask support
 *
 * Scroll effects:
 *   lineReveal()     masked staggered text reveal (lines or chars)
 *   maskReveal()     inline overflow-hidden heading reveal
 *   revealRule()     line that draws to full width
 *   unfoldReveal()   blocks that scale open from an edge
 *   clipWipe()       clip-path inset wipe reveal
 *   parallax()       data-speed parallax
 *   horizontalScroll()   pinned horizontal gallery
 *   stackedCards() / stackedCardsPinned()   pinned card deck
 *   scatterText()    pinned horizontal band with per-char settle
 *   heroShrink()     media that scales down as it scrolls away
 *   mediaSettle()    media that settles from a larger entrance scale
 *   navHide()        header that hides on scroll-down
 *   logoReveal()     SVG wordmark assembling letter by letter
 *
 * Infinite / loops:
 *   marquee()        dual-row constant-speed marquee
 *   dragStrip()      infinite draggable carousel with rotation
 *   rollText()       rolling word rotator (seamless row loop)
 *
 * Text extras:
 *   scrambleText()   decode / cipher reveal per character
 *   flipWords()      words that glide between two layouts (FLIP)
 *
 * Micro-interactions:
 *   liquidButton()   SVG wave flood on hover
 *   underlineLink()  underline wipe on hover
 *   cursorFollower() spring-follow cursor tag
 *   magnetic()       elements that pull toward the pointer and spring back
 *   counter()        tabular number ticker (timed or scroll-progress)
 *   audioBars()      equaliser visualiser
 *   themeReveal()    View Transitions circular wipe
 *   menuOverlay()    clip-path curtain menu
 *   preloader()      0→100 counter intro
 */

/* ---- core ---- */
export { gsap, ScrollTrigger, SplitText, Draggable, CustomEase, ScrollSmoother, initGSAP, EASES } from "./core/gsap.js";
export type { SmoothScrollOptions, SmoothScrollHandle } from "./core/smooth-scroll.js";
export { smoothScroll } from "./core/smooth-scroll.js";
export { split } from "./core/split.js";
export type { SplitOptions, SplitResult, SplitType } from "./core/split.js";
export { guard } from "./core/guard.js";
export { toArray, one, onReady, compose, raf, prefersReducedMotion } from "./core/util.js";
export type { TargetLike, Destroy, CommonOptions } from "./core/types.js";

/* ---- scroll effects ---- */
export { lineReveal } from "./effects/line-reveal.js";
export type { LineRevealOptions } from "./effects/line-reveal.js";

export { maskReveal, revealRule } from "./effects/mask-reveal.js";
export type { MaskRevealOptions } from "./effects/mask-reveal.js";

export { unfoldReveal } from "./effects/unfold-reveal.js";
export type { UnfoldRevealOptions } from "./effects/unfold-reveal.js";

export { clipWipe } from "./effects/clip-wipe.js";
export type { ClipWipeOptions, ClipWipeFrom } from "./effects/clip-wipe.js";

export { parallax } from "./effects/parallax.js";
export type { ParallaxOptions } from "./effects/parallax.js";

export { horizontalScroll } from "./effects/horizontal-scroll.js";
export type { HorizontalScrollOptions } from "./effects/horizontal-scroll.js";

export { stackedCards, stackedCardsPinned } from "./effects/stacked-cards.js";
export type { StackedCardsOptions } from "./effects/stacked-cards.js";

export { scatterText } from "./effects/scatter-text.js";
export type { ScatterTextOptions } from "./effects/scatter-text.js";

export { heroShrink } from "./effects/hero-shrink.js";
export type { HeroShrinkOptions } from "./effects/hero-shrink.js";

export { mediaSettle } from "./effects/media-settle.js";
export type { MediaSettleOptions } from "./effects/media-settle.js";

export { navHide } from "./effects/nav-hide.js";
export type { NavHideOptions } from "./effects/nav-hide.js";

export { logoReveal } from "./effects/logo-reveal.js";
export type { LogoRevealOptions } from "./effects/logo-reveal.js";

/* ---- loops ---- */
export { marquee } from "./effects/marquee.js";
export type { MarqueeOptions } from "./effects/marquee.js";

export { rollText } from "./effects/roll-text.js";
export type { RollTextOptions } from "./effects/roll-text.js";

export { dragStrip } from "./effects/drag-strip.js";
export type { DragStripOptions } from "./effects/drag-strip.js";

/* ---- text extras ---- */
export { scrambleText } from "./effects/scramble-text.js";
export type { ScrambleTextOptions } from "./effects/scramble-text.js";

export { flipWords } from "./effects/flip-words.js";
export type { FlipWordsOptions } from "./effects/flip-words.js";

/* ---- micro-interactions ---- */
export { liquidButton, underlineLink } from "./effects/liquid-button.js";
export type { LiquidButtonOptions } from "./effects/liquid-button.js";

export { cursorFollower } from "./effects/cursor-follower.js";
export type { CursorFollowerOptions } from "./effects/cursor-follower.js";

export { magnetic } from "./effects/magnetic.js";
export type { MagneticOptions } from "./effects/magnetic.js";

export { counter, audioBars } from "./effects/counter.js";
export type { CounterOptions, AudioBarsOptions, AudioBarsHandle } from "./effects/counter.js";

export { themeReveal } from "./effects/theme-reveal.js";
export type { ThemeRevealOptions, ThemeRevealHandle, ThemeName } from "./effects/theme-reveal.js";

export { menuOverlay } from "./effects/menu-overlay.js";
export type { MenuOverlayOptions, MenuOverlayHandle } from "./effects/menu-overlay.js";

export { preloader } from "./effects/preloader.js";
export type { PreloaderOptions } from "./effects/preloader.js";
