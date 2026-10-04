/**
 * Tear reveal — a torn-edge sheet that sweeps a section in (or out).
 *
 * A noise-displaced boundary travels across the overlay: the fbm is added to
 * the field *before* thresholding, so patches of the sheet tear away ahead of
 * the front and ride across as separate shards. A barrel warp (`lens`) bows
 * the boundary so it arrives as a curve — flat in the middle, sweeping at the
 * edges — instead of a straight line wobbling in place.
 *
 * The sheet paints a flat colour or a two-stop gradient and can run
 * `mix-blend-mode` (multiply tints the section's own artwork darker-red;
 * normal covers it outright).
 *
 * Modes mirror clipWipe:
 *   mode "scroll"   plays once when the section enters (default)
 *   scrub           progress follows the scroll, so stopping half way leaves
 *                   a half-torn screen — a real place to be, not a glitch
 *
 * Works as a page-sized overlay too: give it `document.body` with
 * `position: fixed` styling via the `fixed` option for a fullscreen sweep.
 *
 * No WebGL (SSR, jsdom, disabled) → silent no-op; destroy() removes the
 * canvas and restores the host's styles.
 */
import * as THREE from "three";
import { gsap, ScrollTrigger, initGSAP } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { one } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export type TearRevealDirection = "up" | "down" | "left" | "right";

export interface TearRevealOptions extends CommonOptions {
  /** Sheet colour — one colour or `[foot, top]` gradient stops. @default "#111111" */
  color?: string | [string, string];
  /**
   * CSS `mix-blend-mode` for the canvas. `multiply` tints everything under
   * the sheet instead of covering it; `none` = plain overlay.
   * @default "none"
   */
  blend?: string;
  /** Which way the boundary travels. @default "up" */
  direction?: TearRevealDirection;
  /** How far the noise drags the boundary. @default 0.175 */
  dispAmp?: number;
  /** Tear size — high is shrapnel, low is a wave. @default 12.2 */
  dispScale?: number;
  /** Noise octaves — 1 is a smooth wobble, 5 is debris. @default 5 */
  dispDetail?: number;
  /** How fast the noise pattern crawls (0 holds it still). @default 0 */
  dispDrift?: number;
  /** Threshold half-width — small keeps shards crisp. @default 0.001 */
  soft?: number;
  /**
   * Barrel warp strength — negative bows the middle of the boundary up,
   * 0 is a flat horizon. @default -0.275
   */
  lens?: number;
  /** Timed-run duration, seconds (ignored when `scrub` is set). @default 1 */
  duration?: number;
  /** GSAP ease for the timed run. @default "power2.inOut" */
  ease?: string;
  /** "scroll" plays on enter, "immediate" plays at once. @default "scroll" */
  mode?: "scroll" | "immediate";
  /** ScrollTrigger start position. @default "top 85%" */
  start?: string;
  /** ScrollTrigger end position (scrub mode). @default "top 25%" */
  end?: string;
  /** Re-run when leaving / re-entering the viewport. @default false */
  replay?: boolean;
  /**
   * Bind progress to scroll instead of playing it on enter —
   * number = scrub smoothing seconds, `true` = immediate. unset = one-shot.
   */
  scrub?: number | boolean;
  /** Mount the canvas over the viewport instead of the target box. @default false */
  fixed?: boolean;
  /** Canvas z-index inside its stacking context. @default 1 */
  z?: number;
  /** Device-pixel-ratio cap. @default 2 */
  dpr?: number;
}

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uP, uTime, uAspect, uOut, uLens, uDir;
uniform float uDispAmp, uDispScale, uDispDrift, uSoft;
uniform int uDetail;
uniform vec3 uTop, uFoot;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
             mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p, int oct){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 6; i++){
    if (i >= oct) break;
    v += a * vnoise(p); p *= 2.03; a *= 0.5;
  }
  return v;
}

/* Canonical sweep space: "along" grows toward the travel direction,
   "cross" runs along the boundary. uDir: 0 up, 1 down, 2 left, 3 right. */
vec2 sweepSpace(vec2 uv){
  if (uDir < 0.5) return vec2(uv.x, uv.y);            /* up    : along = y  */
  if (uDir < 1.5) return vec2(uv.x, 1.0 - uv.y);      /* down  : along = 1-y*/
  if (uDir < 2.5) return vec2(uv.y, uv.x);            /* right : along = x  */
  return vec2(uv.y, 1.0 - uv.x);                      /* left  : along = 1-x*/
}

void main(){
  bool outside = false;
  vec2 uv = vUv;
  if (uLens != 0.0) {
    vec2 d = uv - 0.5;
    vec2 w = 0.5 + d * (1.0 + uLens * dot(d, d) * 4.0);
    if (w.x < 0.0 || w.x > 1.0 || w.y < 0.0 || w.y > 1.0) outside = true;
    uv = w;
  }
  /* Corners the warp threw out of frame clamp back in: a hole here would be
     a see-through patch in a sheet meant to be closed. */
  if (outside) uv = clamp(uv, 0.0, 1.0);

  vec2 sc = sweepSpace(uv);
  float along = sc.y;          /* 0 = where the sheet starts, 1 = far side  */
  float cross = sc.x;

  /* The torn boundary: noise joins the field before the threshold, so
     patches cross zero early and ride ahead as detached shards. */
  float edge = mix(-uDispAmp, 1.0 + uDispAmp, uP);
  float n = fbm(vec2(cross * uAspect, along) * uDispScale +
                vec2(0.0, uTime * uDispDrift), uDetail) - 0.5;
  float field = (edge - along) + n * uDispAmp * 2.0;
  /* field > 0 is the covered side; both ends of the travel are sealed so the
     last half-covered pixels never read as speckle or leftover haze. */
  float a = smoothstep(-uSoft, uSoft, field);
  a = max(a, smoothstep(0.985, 1.0, uP));
  a = max(a, step(0.999, uP));
  /* uOut = 1 makes the sheet the part that is LEAVING: the same rising edge
     goes on rising and clears the screen instead of reversing downhill. */
  a = mix(a, 1.0 - a, uOut);
  if (a <= 0.001) discard;

  vec3 col = mix(uFoot, uTop, clamp(vUv.y, 0.0, 1.0));
  gl_FragColor = vec4(col, a);
}
`;

export function tearReveal(target: TargetLike, options: TearRevealOptions = {}): Destroy {
  initGSAP();

  const host = one<HTMLElement>(target);
  if (!host) return () => {};

  const {
    color = "#111111",
    blend = "none",
    direction = "up",
    dispAmp = 0.175,
    dispScale = 12.2,
    dispDetail = 5,
    dispDrift = 0,
    soft = 0.001,
    lens = -0.275,
    duration = 1,
    ease = "power2.inOut",
    mode = "scroll",
    start = "top 85%",
    end = "top 25%",
    replay = false,
    scrub,
    fixed = false,
    z = 1,
    dpr = 2,
  } = options;

  return guard(options, () => {
    /* ---------------- availability ladder (silent, no probes) ---------------- */
    if (typeof window === "undefined" || !("WebGLRenderingContext" in window)) return () => {};

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    } catch {
      return () => {}; // context refused — the section simply stays as it is
    }

    /* ---------------- layout + styles we must restore ---------------- */
    const prevPosition = host.style.position;
    if (!fixed && !prevPosition && getComputedStyle(host).position === "static") {
      host.style.position = "relative";
    }

    const w = Math.max(1, fixed ? window.innerWidth : host.clientWidth);
    const h = Math.max(1, fixed ? window.innerHeight : host.clientHeight);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dpr));
    renderer.setSize(w, h, false);
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.cssText = fixed
      ? `position:fixed;inset:0;width:100%;height:100%;display:block;pointer-events:none;z-index:${z};`
      : `position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;z-index:${z};`;

    const stops: [string, string] = Array.isArray(color) ? color : [color, color];
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, -100, 100);
    camera.position.z = 10;

    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    const uniforms = {
      uP: { value: 0 },
      uTime: { value: 0 },
      uAspect: { value: direction === "up" || direction === "down" ? w / Math.max(1, h) : h / Math.max(1, w) },
      uOut: { value: 0 },
      uLens: { value: lens },
      uDir: { value: direction === "up" ? 0 : direction === "down" ? 1 : direction === "right" ? 2 : 3 },
      uDispAmp: { value: dispAmp },
      uDispScale: { value: dispScale },
      uDispDrift: { value: dispDrift },
      uSoft: { value: soft },
      uDetail: { value: dispDetail },
      uTop: { value: new THREE.Color(stops[1]) },
      uFoot: { value: new THREE.Color(stops[0]) },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(w, h, 1);
    scene.add(mesh);
    host.appendChild(canvas);
    if (blend && blend !== "none") canvas.style.mixBlendMode = blend;

    const render = () => renderer.render(scene, camera);

    /* ---------------- progress control (clipWipe's modes) ---------------- */

    let tween: gsap.core.Tween | null = null;
    let st: ScrollTrigger | null = null;
    let disposed = false;

    const setP = (v: number) => {
      uniforms.uP.value = v;
      render();
    };

    if (scrub !== undefined) {
      st = ScrollTrigger.create({
        trigger: host,
        start: fixed ? "top top" : start,
        end: fixed ? "bottom bottom" : end,
        scrub: scrub === true ? true : scrub,
        onUpdate: (self) => setP(self.progress),
      });
      setP(st.progress);
    } else if (mode === "immediate") {
      tween = gsap.to(uniforms.uP, {
        value: 1,
        duration,
        ease,
        onUpdate: render,
      });
    } else {
      st = ScrollTrigger.create({
        trigger: host,
        start,
        end,
        toggleActions: replay ? "play reverse play reverse" : "play none none none",
        onEnter: () => {
          tween?.kill();
          tween = gsap.to(uniforms.uP, { value: 1, duration, ease, overwrite: true, onUpdate: render });
        },
        onLeaveBack: () => {
          if (!replay) return;
          tween?.kill();
          tween = gsap.to(uniforms.uP, { value: 0, duration, ease, overwrite: true, onUpdate: render });
        },
      });
      render();
    }

    /* Drift only costs something when the pattern should crawl. */
    const renderTime = () => {
      uniforms.uTime.value = gsap.ticker.time;
      render();
    };
    if (dispDrift > 0) gsap.ticker.add(renderTime);

    /* ---------------- resize ---------------- */
    let ro: ResizeObserver | null = null;
    const resize = () => {
      const rw = Math.max(1, fixed ? window.innerWidth : host.clientWidth);
      const rh = Math.max(1, fixed ? window.innerHeight : host.clientHeight);
      renderer.setSize(rw, rh, false);
      camera.left = -rw / 2;
      camera.right = rw / 2;
      camera.top = rh / 2;
      camera.bottom = -rh / 2;
      camera.updateProjectionMatrix();
      mesh.scale.set(rw, rh, 1);
      uniforms.uAspect.value =
        direction === "up" || direction === "down" ? rw / Math.max(1, rh) : rh / Math.max(1, rw);
      render();
    };
    if (typeof ResizeObserver === "function") {
      ro = new ResizeObserver(resize);
      ro.observe(fixed ? document.body : host);
    }
    if (fixed) window.addEventListener("resize", resize);

    ScrollTrigger.refresh();

    /* ---------------- teardown ---------------- */
    return () => {
      if (disposed) return;
      disposed = true;
      if (dispDrift > 0) gsap.ticker.remove(renderTime);
      tween?.kill();
      gsap.killTweensOf(uniforms.uP);
      st?.kill();
      ro?.disconnect();
      if (fixed) window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
      host.style.position = prevPosition;
      ScrollTrigger.refresh();
    };
  });
}
