/**
 * WebGL media — the shader card: a DOM `<img>` re-rendered as a rounded,
 * hover-reactive GL plane.
 *
 * The image keeps owning layout and alt text; the effect paints it onto a
 * canvas that covers the wrapper, so the card can do what CSS can't: press a
 * *dent* into the picture on hover (sample squeeze + fake dome lighting),
 * split its channels (chroma), and wipe in on reveal — all inside one
 * fragment shader. This is the media-card pattern from three.js portfolios,
 * kept dependency-honest:
 *
 * - **Optional peer.** Lives behind the `@cosmictraveler002/anim-kit/three`
 *   subpath; the core barrel stays gsap+lenis only. `three` is an optional
 *   peer — install it to use this entry, the core never imports it.
 * - **Silent no-op ladder.** Missing target → no-op. No
 *   `WebGLRenderingContext` (jsdom, SSR, WebGL-disabled browsers) → no-op
 *   *before* a context is ever requested (a probe call would itself log).
 *   Renderer construction throws → no-op. Texture 404s → the plain `<img>`
 *   stays visible. Under `prefers-reduced-motion` the canvas never mounts.
 * - **Cover crop in-shader.** The texture is sampled with `object-fit: cover`
 *   maths (`scale = uRes / uTexSize`, windowed around the centre), so any
 *   source aspect fills the card without letterboxing.
 * - **Rounded corners are shader-true.** A rounded-box SDF with a 1px smooth
 *   edge — not `border-radius` on the canvas — so the dent/chroma never bleed
 *   into the corner.
 * - **Fidelity.** `destroy()` kills ticker + tweens + observers/listeners,
 *   disposes geometry/material/texture/renderer, removes the canvas and
 *   restores the `<img>` opacity and wrapper position it changed.
 *
 *   webglMedia("[data-gl]", { corner: 18, dent: 70, chroma: 2 })
 *
 * Markup: a wrapper element containing `<img>` (or pass `src` explicitly):
 *
 *   <figure class="gl-card" data-gl><img src="photo.jpg" alt="" /></figure>
 */
import * as THREE from "three";
import { gsap, initGSAP } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { one } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface WebglMediaOptions extends CommonOptions {
  /** Image source — defaults to the wrapper's first `<img>`. */
  src?: string;
  /** Corner radius, px. @default 16 */
  corner?: number;
  /** Dent depth pressed into the card on hover, px. @default 70 */
  dent?: number;
  /** Chromatic split at full hover, px. @default 2 */
  chroma?: number;
  /** Wipe the card in when its texture loads. @default true */
  reveal?: boolean;
  /** Reveal duration, seconds. @default 1.1 */
  revealDuration?: number;
  /** Hover response duration, seconds. @default 0.6 */
  hoverDuration?: number;
  /** Device-pixel-ratio cap. @default 2 */
  dpr?: number;
}

const VERT = /* glsl */ `
varying vec2 vUv;
uniform float uHover;
uniform float uDent;
uniform float uTime;

void main() {
  vUv = uv;
  vec3 p = position;
  float dome = max(cos(uv.x * 3.14159265) * cos(uv.y * 3.14159265), 0.0);
  dome *= 0.94 + 0.06 * sin(uTime * 1.6);
  // Pressed-in curvature while hovered — the fragment does the visible work.
  p.z -= uHover * uDent * dome;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uTexSize;
uniform float uCorner;
uniform float uHover;
uniform float uDent;
uniform float uChroma;
uniform float uProgress;
uniform float uTime;

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
  vec2 px = (vUv - 0.5) * uRes;
  float d = sdRoundBox(px, uRes * 0.5, uCorner);
  float alpha = 1.0 - smoothstep(-1.0, 1.0, d); // 1px-ish AA on the corner

  // Entrance wipe: grows from the bottom with a soft leading edge.
  if (uProgress < 1.0) {
    alpha *= 1.0 - smoothstep(uProgress - 0.05, uProgress, vUv.y);
  }
  if (alpha < 0.003) discard;

  // object-fit: cover — window the texture around its centre.
  vec2 scale = uRes / max(uTexSize, vec2(1.0));
  vec2 cover = (vUv - 0.5) * (scale / max(scale.x, scale.y)) + 0.5;

  // Hover dent: squeeze the sample toward the centre (breathing slightly).
  vec2 c = cover - 0.5;
  float dome = max(cos(vUv.x * 3.14159265) * cos(vUv.y * 3.14159265), 0.0);
  dome *= 0.94 + 0.06 * sin(uTime * 1.6);
  vec2 suv = 0.5 + c * (1.0 - uHover * uDent * 0.0016 * dome);

  float chroma = uChroma * uHover * dome / max(uRes.x, 1.0);
  vec3 col;
  col.r = texture2D(uTex, suv + vec2(chroma, 0.0)).r;
  col.g = texture2D(uTex, suv).g;
  col.b = texture2D(uTex, suv - vec2(chroma, 0.0)).b;

  // Fake lighting off the dome slope: sheen at the crest, shade at the rim.
  float light = dome * uHover;
  col += light * 0.12;
  col *= 1.0 - 0.12 * uHover * (1.0 - dome);

  gl_FragColor = vec4(col, alpha);
}
`;

export function webglMedia(target: TargetLike, options: WebglMediaOptions = {}): Destroy {
  initGSAP();

  const host = one<HTMLElement>(target);
  if (!host) return () => {};

  const {
    src,
    corner = 16,
    dent = 70,
    chroma = 2,
    reveal = true,
    revealDuration = 1.1,
    hoverDuration = 0.6,
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
    host.dataset.akGl = "true";

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

    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    const uniforms = {
      uTex: { value: null as THREE.Texture | null },
      uRes: { value: new THREE.Vector2(w, h) },
      uTexSize: { value: new THREE.Vector2(1, 1) },
      uCorner: { value: corner },
      uHover: { value: 0 },
      uDent: { value: dent },
      uChroma: { value: chroma },
      uProgress: { value: reveal ? 0 : 1 },
      uTime: { value: 0 },
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

    /* ---------------- texture ---------------- */

    let disposed = false;
    const loader = new THREE.TextureLoader();
    let revealTween: gsap.core.Tween | null = null;

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
        if (img) img.style.opacity = "0"; // canvas owns the pixels from here
        if (reveal) {
          revealTween = gsap.fromTo(
            uniforms.uProgress,
            { value: 0 },
            { value: 1, duration: revealDuration, ease: "power2.inOut" },
          );
        }
      },
      undefined,
      () => {
        /* 404 / decode failure — the plain <img> was never hidden. */
      },
    );

    /* ---------------- hover ---------------- */

    let hoverTween: gsap.core.Tween | null = null;
    const hoverTo = (value: number) => {
      hoverTween = gsap.to(uniforms.uHover, {
        value,
        duration: hoverDuration,
        ease: "power3.out",
        overwrite: "auto",
      });
    };
    const onEnter = () => hoverTo(1);
    const onLeave = () => hoverTo(0);
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);

    /* ---------------- loop / observers ---------------- */

    let visible = true;
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === "function") {
      io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
        rootMargin: "120px",
      });
      io.observe(host);
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
      uniforms.uTime.value = gsap.ticker.time;
      renderer.render(scene, camera);
    };
    gsap.ticker.add(render);

    /* ---------------- teardown ---------------- */

    return () => {
      disposed = true;
      gsap.ticker.remove(render);
      hoverTween?.kill();
      revealTween?.kill();
      gsap.killTweensOf(uniforms.uHover);
      gsap.killTweensOf(uniforms.uProgress);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      io?.disconnect();
      ro?.disconnect();
      uniforms.uTex.value?.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
      delete host.dataset.akGl;
      host.style.position = prevPosition;
      if (img) img.style.opacity = prevImgOpacity;
    };
  });
}
