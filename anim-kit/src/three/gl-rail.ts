/**
 * GL rail — the WebGL overlay rail: physics below, bent cards above.
 *
 * `dragRail` owns the motion (intent/pos ticker, tanh rubber-band, throw
 * momentum, Lenis-safe wheel, auto axis); this effect adds the GPU layer the
 * flat DOM can't draw: every card re-rendered onto **one fixed canvas** whose
 * surfaces bend around an invisible cylinder, over a perspective grid floor.
 * Why it is shaped this way (audit notes):
 *
 * - **The DOM stays the source of truth.** Cards keep owning layout, labels,
 *   hit areas and alt text; each frame reads their viewport rects and the
 *   shader re-creates the pixels *beneath* the labels. A label never drifts
 *   off its card, because the card **is** the rect the label sits in — only
 *   the picture curves.
 * - **The bend lives in the vertex shader.** Each vertex takes its offset
 *   along the rail axis (`uOffset + local`), maps it onto a cylinder of
 *   `uRadius` (`a = o / R`, `x = R·sin a`, `z = −R·(1−cos a)`) and re-centres
 *   so the card's middle stays glued to its DOM position while its edges
 *   foreshorten onto the curve. One uniform per card, no per-vertex CPU work
 *   — and the rotation the cards need arrives free from the bend itself.
 * - **One renderer for the whole rail.** A single alpha canvas inserted
 *   *under* the track (the track's transform creates a stacking context that
 *   paints above it): labels stay DOM, card backgrounds stay transparent, and
 *   the only pixels the canvas needs are the `<img>`s it hides — each one
 *   only after its texture has actually loaded.
 * - **The axis follows the layout.** `axis: "auto"` hands the same
 *   `resolveRailAxis()` rule to the physics *and* the bend: row overflows →
 *   horizontal rail + bend around Y, only the column overflows (mobile
 *   stack) → vertical rail + bend around X. One init serves both.
 * - **Silent no-op ladder.** Missing target → no-op. No
 *   `WebGLRenderingContext` (jsdom, SSR, WebGL-disabled browsers) → the flat
 *   `dragRail` rail alone, *before* any context is requested (a probe call
 *   would itself log). Renderer construction throws → flat rail. Texture 404
 *   → that one card's `<img>` stays visible. Under `prefers-reduced-motion`
 *   nothing mounts at all (the outer `guard` owns that decision). Nothing
 *   ever logs.
 * - **Fidelity.** `destroy()` unwinds the physics, then the GPU: ticker,
 *   observers, geometry, materials, textures and the renderer are disposed,
 *   the canvas is removed and image opacities + the stage's inline position
 *   are restored.
 *
 *   glRail("[data-rail]", { radius: 1200, grid: true })
 *
 * CSS: the stage (viewport) `position: relative; overflow: hidden` — the
 * canvas covers it; the track `display: flex; width: max-content; gap: 1rem;
 * cursor: grab; user-select: none; touch-action: pan-y` (flip to a column +
 * `width: 100%; height: max-content` for the vertical layout). Cards
 * `position: relative` with a **transparent background** — labels paint above
 * the canvas for free, the effect hides only the media.
 */
import * as THREE from "three";
import { gsap, initGSAP } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { one, toArray } from "../core/util.js";
import { dragRail, resolveRailAxis } from "../effects/drag-rail.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface GlRailOptions extends CommonOptions {
  /** Stage around the track — the canvas covers it. Defaults to `track.parentElement`. */
  viewport?: TargetLike;
  /** Cards re-rendered on the canvas — each needs an `<img>`. @default `":scope > *"` */
  card?: string;
  /** Motion + bend axis: `"x"`, `"y"`, or the layout's choice. @default `"auto"` */
  axis?: "x" | "y" | "auto";
  /** Cylinder radius the cards bend around, px — smaller = stronger bend. @default 1200 */
  radius?: number;
  /** Corner radius, px (rounded-box SDF in the fragment shader). @default 16 */
  corner?: number;
  /** Perspective grid floor under the cards. @default true */
  grid?: boolean;
  /** Device-pixel-ratio cap. @default 2 */
  dpr?: number;
  /** Follow speed toward the intent, per 60fps frame (0..1). @default 0.1 */
  lerp?: number;
  /** Rubber-band resistance distance past the ends, px. @default 140 */
  edge?: number;
  /** Momentum multiplier on release. @default 14 */
  throwScale?: number;
  /** Wheel / trackpad drives the rail (consumed while it can still move). @default true */
  wheel?: boolean;
  /** `(pos, velocity) => {}` called every rendered frame while mounted. */
  onTick?: (pos: number, velocity: number) => void;
}

/* Card: the cylinder bend in the vertex shader, cover-crop + SDF corners in
   the fragment — the pixel contract is webglMedia's, bent to the rail. */
const CARD_VERT = /* glsl */ `
varying vec2 vUv;
uniform vec2 uSize;    // card size, px
uniform float uOffset; // centre offset from the stage centre along the rail axis, px
uniform float uRadius; // cylinder radius, px
uniform float uAxis;   // 0 = rail runs x (bend around Y), 1 = rail runs y (bend around X)

void main() {
  vUv = uv;
  vec3 p = vec3(position.xy * uSize, 0.0);
  float along = uAxis < 0.5 ? p.x : p.y;
  float a = (uOffset + along) / uRadius;
  // Re-centre on the card's own middle: the centre stays glued to the DOM
  // rect while the edges foreshorten onto the cylinder.
  float bent = uRadius * sin(a) - uRadius * sin(uOffset / uRadius) + uOffset;
  if (uAxis < 0.5) p.x = bent; else p.y = bent;
  p.z = -uRadius * (1.0 - cos(a));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const CARD_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uTexSize;
uniform float uCorner;

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
  vec2 px = (vUv - 0.5) * uRes;
  float d = sdRoundBox(px, uRes * 0.5, uCorner);
  float alpha = 1.0 - smoothstep(-1.0, 1.0, d); // 1px-ish AA on the corner
  if (alpha < 0.003) discard;

  // object-fit: cover — window the texture around its centre.
  vec2 scale = uRes / max(uTexSize, vec2(1.0));
  vec2 cover = (vUv - 0.5) * (scale / max(scale.x, scale.y)) + 0.5;
  gl_FragColor = vec4(texture2D(uTex, cover).rgb, alpha);
}
`;

/* Floor: one plane lying at the bottom of the stage, lines in world space,
   fading toward the horizon and the sides, drifting slightly with the rail. */
const GRID_VERT = /* glsl */ `
varying vec2 vWorld; // world xz under this fragment
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const GRID_FRAG = /* glsl */ `
precision highp float;
varying vec2 vWorld;
uniform vec2 uShift;    // parallax drift with the rail position, px
uniform vec3 uColor;
uniform float uOpacity;
uniform float uSpacing;

void main() {
  vec2 cell = (vWorld + uShift) / uSpacing;
  vec2 grad = abs(fract(cell - 0.5) - 0.5) / max(fwidth(cell), 1e-5);
  float line = 1.0 - min(min(grad.x, grad.y), 1.0);
  float depth = smoothstep(-5200.0, -400.0, vWorld.y); // melt into the horizon
  float side = 1.0 - smoothstep(1300.0, 3600.0, abs(vWorld.x));
  gl_FragColor = vec4(uColor, line * uOpacity * depth * side);
}
`;

/** Floor geometry constants — near edge slightly in front of the cards, far
    edge past the horizon; the stage bottom sits where the z=0 plane ends. */
const GRID_SPAN = 7200;
const GRID_DEPTH = 6000;
const GRID_NEAR_Z = 520;

export function glRail(target: TargetLike, options: GlRailOptions = {}): Destroy {
  initGSAP();

  const track = one<HTMLElement>(target);
  if (!track) return () => {};

  const {
    viewport,
    card = ":scope > *",
    axis = "auto",
    radius = 1200,
    corner = 16,
    grid = true,
    dpr = 2,
    lerp,
    edge,
    throwScale,
    wheel,
    onTick,
  } = options;

  return guard(options, () => {
    const vp = one<HTMLElement>(viewport) ?? track.parentElement ?? track;

    /* ---------------- physics first: the rail works with or without a GPU ---------------- */

    let lastPos = 0;
    const stopPhysics = dragRail(track, {
      viewport: vp,
      axis,
      lerp,
      edge,
      throwScale,
      wheel,
      // The outer guard already decided about reduced motion for both of us.
      force: true,
      onTick: (pos, velocity) => {
        lastPos = pos;
        onTick?.(pos, velocity);
      },
    });

    /* ---------------- availability ladder (silent, no probes) ---------------- */

    if (typeof window === "undefined" || !("WebGLRenderingContext" in window)) return stopPhysics;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return stopPhysics; // context refused — the flat DOM rail is the fallback
    }

    /* ---------------- stage + camera ---------------- */

    const prevPosition = vp.style.position;
    if (!prevPosition && getComputedStyle(vp).position === "static") {
      vp.style.position = "relative";
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dpr));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 10, 14000);

    // Pixel-space at z = 0: the z=0 plane exactly fills the stage.
    const fitCamera = (w: number, h: number) => {
      camera.aspect = w / h;
      camera.position.set(0, 0, h / 2 / Math.tan((camera.fov * Math.PI) / 360));
      camera.updateProjectionMatrix();
    };

    /* ---------------- grid floor ---------------- */

    let gridMesh: THREE.Mesh | null = null;
    let gridShift: THREE.Vector2 | null = null;
    if (grid) {
      gridShift = new THREE.Vector2();
      const material = new THREE.ShaderMaterial({
        vertexShader: GRID_VERT,
        fragmentShader: GRID_FRAG,
        uniforms: {
          uShift: { value: gridShift },
          uColor: { value: new THREE.Color(0.66, 0.7, 0.78) },
          uOpacity: { value: 0.24 },
          uSpacing: { value: 150 },
        },
        transparent: true,
        depthWrite: false,
        depthTest: false,
      });
      gridMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
      gridMesh.rotation.x = -Math.PI / 2;
      gridMesh.renderOrder = -1; // floor first, cards over it
      scene.add(gridMesh);
    }

    /* ---------------- cards ---------------- */

    type Entry = {
      el: HTMLElement;
      img: HTMLImageElement;
      mesh: THREE.Mesh;
      material: THREE.ShaderMaterial;
      prevOpacity: string;
    };

    const geometry = new THREE.PlaneGeometry(1, 1, 24, 12);
    const entries: Entry[] = [];
    const loader = new THREE.TextureLoader();
    let disposed = false;

    for (const el of toArray<HTMLElement>(card, track)) {
      const img = el.querySelector("img") as HTMLImageElement | null;
      const src = img?.currentSrc || img?.src;
      if (!img || !src) continue; // label-only card — nothing to paint

      const uniforms = {
        uTex: { value: null as THREE.Texture | null },
        uRes: { value: new THREE.Vector2(1, 1) },
        uTexSize: { value: new THREE.Vector2(1, 1) },
        uCorner: { value: corner },
        uSize: { value: new THREE.Vector2(1, 1) },
        uOffset: { value: 0 },
        uRadius: { value: radius },
        uAxis: { value: 0 },
      };
      const material = new THREE.ShaderMaterial({
        vertexShader: CARD_VERT,
        fragmentShader: CARD_FRAG,
        uniforms,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      });
      // Positions come from the shader (uOffset/uSize), not the 1×1 geometry —
      // the default bounding sphere would cull every card off-screen.
      const mesh = new THREE.Mesh(geometry, material);
      mesh.frustumCulled = false;
      mesh.visible = false;
      scene.add(mesh);

      const prevOpacity = img.style.opacity;
      entries.push({ el, img, mesh, material, prevOpacity });

      loader.load(
        src,
        (texture) => {
          if (disposed) {
            texture.dispose();
            return;
          }
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          // No sRGB decode: the raw shader passes sampled values through, so
          // the texture stays an ordinary RGBA8 upload (same contract as
          // webglMedia — built-in colourSpace conversion only happens inside
          // three's own material chunks).
          uniforms.uTex.value = texture;
          uniforms.uTexSize.value.set(texture.image?.width || 1, texture.image?.height || 1);
          mesh.visible = true;
          img.style.opacity = "0"; // the canvas owns these pixels from here
        },
        undefined,
        () => {
          /* 404 / decode failure — this card's <img> was never hidden. */
        },
      );
    }

    if (!entries.length) {
      // Nothing renderable — plain dragRail is the whole effect.
      geometry.dispose();
      gridMesh?.geometry.dispose();
      (gridMesh?.material as THREE.Material | undefined)?.dispose();
      renderer.dispose();
      return stopPhysics;
    }

    /* ---------------- canvas: under the track, over the stage ---------------- */

    const canvas = renderer.domElement;
    canvas.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;";
    vp.insertBefore(canvas, track);
    vp.dataset.akGlRail = "true";

    /* ---------------- sizing ---------------- */

    const resize = () => {
      const w = Math.max(1, vp.clientWidth);
      const h = Math.max(1, vp.clientHeight);
      renderer.setSize(w, h, false);
      fitCamera(w, h);
      if (gridMesh) {
        gridMesh.scale.set(GRID_SPAN, GRID_DEPTH, 1);
        // Local +y maps to world −z, so centre the plane to span
        // [GRID_NEAR_Z − GRID_DEPTH, GRID_NEAR_Z] in z.
        gridMesh.position.set(0, -h / 2 + 2, GRID_NEAR_Z - GRID_DEPTH / 2);
      }
    };
    resize();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver === "function") {
      ro = new ResizeObserver(resize);
      ro.observe(vp);
    }

    /* ---------------- loop ---------------- */

    let visible = true;
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === "function") {
      io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
        rootMargin: "120px",
      });
      io.observe(vp);
    }

    const sync = () => {
      const stage = vp.getBoundingClientRect();
      const cx = stage.left + stage.width / 2;
      const cy = stage.top + stage.height / 2;
      const vertical = resolveRailAxis(track, vp, axis) === "y";
      for (const entry of entries) {
        const rect = entry.el.getBoundingClientRect();
        const u = entry.material.uniforms;
        u.uOffset.value = vertical
          ? cy - (rect.top + rect.height / 2)
          : rect.left + rect.width / 2 - cx;
        u.uSize.value.set(rect.width, rect.height);
        u.uRes.value.set(rect.width, rect.height);
        u.uAxis.value = vertical ? 1 : 0;
      }
    };

    const render = () => {
      if (!visible) return;
      sync();
      gridShift?.set(lastPos * 0.1, 0); // subtle parallax: the floor trails the rail
      renderer.render(scene, camera);
    };
    gsap.ticker.add(render);

    /* ---------------- teardown ---------------- */

    return () => {
      disposed = true;
      stopPhysics();
      gsap.ticker.remove(render);
      io?.disconnect();
      ro?.disconnect();
      for (const entry of entries) {
        (entry.material.uniforms.uTex.value as THREE.Texture | null)?.dispose();
        entry.material.dispose();
        entry.img.style.opacity = entry.prevOpacity;
      }
      geometry.dispose();
      if (gridMesh) {
        gridMesh.geometry.dispose();
        (gridMesh.material as THREE.Material).dispose();
      }
      renderer.dispose();
      canvas.remove();
      delete vp.dataset.akGlRail;
      vp.style.position = prevPosition;
    };
  });
}
