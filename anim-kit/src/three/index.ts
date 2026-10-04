/**
 * `@cosmictraveler002/anim-kit/three` — the WebGL entry.
 *
 * Everything here renders media through **three.js**, which is an *optional
 * peer dependency*: install `three` alongside anim-kit to use this subpath.
 * The core barrel (`@cosmictraveler002/anim-kit`) never imports three, so
 * plain DOM/scroll users keep a gsap+lenis-only dependency tree.
 *
 *   import { webglMedia, glRail } from "@cosmictraveler002/anim-kit/three";
 */
export { webglMedia } from "./webgl-media.js";
export type { WebglMediaOptions } from "./webgl-media.js";
export { glRail } from "./gl-rail.js";
export type { GlRailOptions } from "./gl-rail.js";
export { tearReveal } from "./tear-reveal.js";
export type { TearRevealOptions, TearRevealDirection } from "./tear-reveal.js";
export { ditherReveal } from "./dither-reveal.js";
export type { DitherRevealOptions } from "./dither-reveal.js";
