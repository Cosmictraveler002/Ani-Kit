/**
 * Dither reveal — a photo that punches through its placeholder in a speckled
 * ring expanding from the centre outward.
 *
 * The mask is the whole trick: a radial threshold displaced by fbm noise, so
 * the boundary is lumpy at low frequency and speckled at high frequency, and
 * every pixel on the boundary flips hard between "hole" and "not hole" — no
 * soft dissolve, no crossfade. The noise spread ramps to zero at both ends of
 * the travel, so progress 0 is exactly empty and progress 1 exactly solid
 * (no half-revealed corners, no leftover speckle).
 *
 * The image keeps owning layout and alt text; the effect paints it onto a
 * canvas that covers the wrapper and hands the pixels over only once its
 * texture has decoded — a 404 or a WebGL-less browser leaves the plain `<img>`
 * exactly where it was.
 *
 * - **Optional peer.** Lives behind the `@cosmictraveler002/anim-kit/three`
 *   subpath; the core barrel stays gsap+lenis only. `three` is an optional
 *   peer — install it to use this entry, the core never imports it.
 * - **Silent no-op ladder.** Missing target → no-op. No
 *   `WebGLRenderingContext` (jsdom, SSR, WebGL-disabled browsers) → no-op
 *   *before* a context is ever requested (a probe call would itself log).
 *   Renderer construction throws → no-op. Texture 404s → the plain `<img>`
 *   stays visible. Under `prefers-reduced-motion` the canvas never mounts —
 *   the image simply shows, which is the motion-reduced end state anyway.
 * - **Cover crop in-shader.** The texture is sampled with `object-fit: cover`
 *   maths (`scale = uRes / uTexSize`, windowed around the centre), so any
 *   source aspect fills the card without letterboxing.
 * - **Trigger model.** The reveal fires once, when the texture is decoded
 *   *and* the wrapper has been on screen (`play: "visible"`, the default) —
 *   a reveal that runs before anyone can see it is not a reveal. `play:
 *   "load"` fires it the moment the texture lands, regardless of viewport.
 * - **Fidelity.** `destroy()` kills the tween + observers/listeners, disposes
 *   geometry/material/texture/renderer, removes the canvas and restores the
 *   `<img>` opacity and wrapper position it changed.
 *
 *   ditherReveal("[data-reveal]", { plate: "#14140f", duration: 1.15 })
 *
 * Markup: a wrapper element containing `<img>` (or pass `src` explicitly):
 *
 *   <figure class="shot" data-reveal><img src="photo.jpg" alt="" /></figure>
 */
import * as THREE from "three";
import { gsap, initGSAP } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { one } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface DitherRevealOptions extends CommonOptions {
  /** Image source — defaults to the wrapper's first `<img>`. */
  src?: string;
  /** Reveal duration, seconds. @default 1.15 */
  duration?: number;
  /** GSAP ease for the reveal. @default "power4.out" */
  ease?: string;
  /**
   * Flat placeholder colour shown where the mask has not opened yet
   * (their "develop" plate). Omit to let the wrapper's own background
   * show through the not-yet-revealed area.
   */
  plate?: string;
  /** fbm frequency across the element — the lump scale of the edge. @default 50 */
  maskScale?: number;
  /**
   * How far (in normalised radius) the noise can push the boundary ahead of
   * and behind the clean circle. @default 0.35
   */
  spread?: number;
  /** fbm octaves — 1 is a soft blob, 6 is gritty. @default 4 */
  detail?: number;
  /** Hard-edged speckle (the signature) vs a soft dissolve. @default true */
  hard?: boolean;
  /**
   * When the reveal fires: on first viewport entry (default) or as soon as
   * the texture has decoded. Falls back to `"load"` without IntersectionObserver.
   * @default "visible"
   */
  play?: "load" | "visible";
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
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uTexSize;
uniform vec3 uPlate;
uniform float uPlateA;
uniform float uProgress;
uniform float uMaskScale;
uniform float uSpread;
uniform float uDetail;
uniform float uHard;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

/* Normalised to ~0..1 for any octave count, so spread means the same thing
   whether detail is 1 or 6. */
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 6; i++) {
    if (float(i) >= uDetail) break;
    v += a * vnoise(p);
    p = p * 2.03 + 17.0;
    a *= 0.5;
  }
  return v / max(1.0 - pow(0.5, uDetail), 0.0001);
}

void main() {
  /* object-fit: cover — window the texture around its centre. */
  vec2 scale = uRes / max(uTexSize, vec2(1.0));
  vec2 cover = (vUv - 0.5) * (scale / max(scale.x, scale.y)) + 0.5;
  vec3 photo = texture2D(uTex, cover).rgb;

  /* Radial distance in normalised half-diagonal units: 0 centre, 1 corners. */
  float d = length((vUv - 0.5) * uRes) / (0.5 * length(uRes));

  float mask;
  if (uProgress <= 0.0001) {
    mask = 0.0;                                    /* exactly empty        */
  } else if (uProgress >= 0.9999) {
    mask = 1.0;                                    /* exactly solid        */
  } else {
    /* Noise spread dies off at both ends of the travel: the start stays
       empty and the finish stays sealed however far the fbm drags. */
    float ramp = smoothstep(0.0, 0.18, uProgress) *
                 smoothstep(1.0, 0.82, uProgress);
    float gap = fbm(vUv * uMaskScale);
    float th = uProgress + (0.5 - gap) * uSpread * ramp;
    mask = uHard > 0.5
      ? 1.0 - step(th, d)                          /* round(): the speckle */
      : 1.0 - smoothstep(th - 0.04, th + 0.04, d);
  }

  vec3 col = mix(uPlate, photo, mask);
  float alpha = mix(uPlateA, 1.0, mask);
  if (alpha < 0.003) discard;
  gl_FragColor = vec4(col, alpha);
}
`;

export function ditherReveal(target: TargetLike, options: DitherRevealOptions = {}): Destroy {
  initGSAP();

  const host = one<HTMLElement>(target);
  if (!host) return () => {};

  const {
    src,
    duration = 1.15,
    ease = "power4.out",
    plate,
    maskScale = 50,
    spread = 0.35,
    detail = 4,
    hard = true,
    play = "visible",
    dpr = 2,
  } = options;

  return guard(options, () => {
    /* ---------------- availability ladder (silent, no probes) ---------------- */
    if (typeof window === "undefined" || !("WebGLRenderingContext" in window)) return () => {};

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return () => {}; // context refused (disabled/blacklisted) — plain img stays
    }

    const img =
      host.tagName === "IMG" ? null : (host.querySelector("img") as HTMLImageElement | null);
    const textureSrc = src || img?.currentSrc || img?.src;
    if (!textureSrc) {
      renderer.dispose();
      return () => {};
    }

    /* ---------------- layout + styles we must restore ---------------- */

    const prevPosition = host.style.position;
    if (!prevPosition && getComputedStyle(host).position === "static") {
      host.style.position = "relative";
    }
    const prevImgOpacity = img?.style.opacity ?? "";
    host.dataset.akReveal = "true";

    const w = Math.max(1, host.clientWidth);
    const h = Math.max(1, host.clientHeight);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dpr));
    renderer.setSize(w, h, false);
    const canvas = renderer.domElement;
    canvas.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;";

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, -100, 100);
    camera.position.z = 10;

    const plateColor = new THREE.Color(plate || "#000000");
    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    const uniforms = {
      uTex: { value: null as THREE.Texture | null },
      uRes: { value: new THREE.Vector2(w, h) },
      uTexSize: { value: new THREE.Vector2(1, 1) },
      uPlate: { value: plateColor },
      uPlateA: { value: plate ? 1 : 0 },
      uProgress: { value: 0 },
      uMaskScale: { value: maskScale },
      uSpread: { value: spread },
      uDetail: { value: detail },
      uHard: { value: hard ? 1 : 0 },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(w, h, 1);
    mesh.visible = false;
    scene.add(mesh);
    host.appendChild(canvas);

    /* ---------------- texture + play trigger ---------------- */

    let disposed = false;
    let loaded = false;
    let seen = play === "load"; // armed for "visible" once the wrapper is on screen
    let played = false;
    let revealTween: gsap.core.Tween | null = null;
    const loader = new THREE.TextureLoader();

    const tryPlay = () => {
      if (played || !loaded || !seen || disposed) return;
      played = true;
      /* With a plate the placeholder has been covering the <img> since the
         texture landed; without one the <img> only steps aside now, so the
         area is never empty before the reveal actually starts. */
      if (img && !plate) img.style.opacity = "0";
      revealTween = gsap.fromTo(
        uniforms.uProgress,
        { value: 0 },
        { value: 1, duration, ease, overwrite: true },
      );
    };

    loader.load(
      textureSrc,
      (texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        // No sRGB decode: the raw shader passes sampled values through, so the
        // texture must stay an ordinary RGBA8 upload (built-in colorSpace
        // conversion only happens inside three's own material chunks).
        uniforms.uTex.value = texture;
        uniforms.uTexSize.value.set(texture.image.width || 1, texture.image.height || 1);
        mesh.visible = true;
        loaded = true;
        if (plate && img) img.style.opacity = "0"; // plate owns the pixels now
        tryPlay();
      },
      undefined,
      () => {
        /* 404 / decode failure — the plain <img> was never hidden. */
      },
    );

    /* ---------------- loop / observers ---------------- */

    let visible = true;
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === "function") {
      io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (entry.isIntersecting) {
            seen = true;
            tryPlay();
          }
        },
        { rootMargin: "80px" },
      );
      io.observe(host);
    } else {
      seen = true; // no viewport signal available — play on load instead
      tryPlay();
    }

    let ro: ResizeObserver | null = null;
    const resize = () => {
      const rw = Math.max(1, host.clientWidth);
      const rh = Math.max(1, host.clientHeight);
      renderer.setSize(rw, rh, false);
      camera.left = -rw / 2;
      camera.right = rw / 2;
      camera.top = rh / 2;
      camera.bottom = -rh / 2;
      camera.updateProjectionMatrix();
      mesh.scale.set(rw, rh, 1);
      uniforms.uRes.value.set(rw, rh);
    };
    if (typeof ResizeObserver === "function") {
      ro = new ResizeObserver(resize);
      ro.observe(host);
    }

    const render = () => {
      if (!visible || !mesh.visible) return;
      renderer.render(scene, camera);
    };
    gsap.ticker.add(render);

    /* ---------------- teardown ---------------- */

    return () => {
      disposed = true;
      gsap.ticker.remove(render);
      revealTween?.kill();
      gsap.killTweensOf(uniforms.uProgress);
      io?.disconnect();
      ro?.disconnect();
      uniforms.uTex.value?.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
      delete host.dataset.akReveal;
      host.style.position = prevPosition;
      if (img) img.style.opacity = prevImgOpacity;
    };
  });
}
