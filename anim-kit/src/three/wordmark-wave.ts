/**
 * Wordmark wave — the giant wordmark that ripples under the pointer and
 * throws red/cyan chromatic fringes while it deforms.
 *
 * The whole effect is one deformable plane textured with the wordmark drawn
 * from the target's own text and font — no bundled typeface, no baked mesh:
 *
 * - **The sim runs on the CPU, per vertex** (a ~5 k-vertex grid is nothing
 *   at 60 Hz), stepping the reference's frame constants verbatim: pointer
 *   falloff `1/(1 + d/0.05) − 0.1`, a `0.02` pointer-velocity "drag" term,
 *   a `0.1` spring back to rest, `0.9` damping, `0.1` integration scale.
 *   The step is fixed at 1/60 s (accumulated, max 4 per frame) so the
 *   physics are identical on 60/120/144 Hz displays; pointer velocity is
 *   measured per frame, folded to 1/60 s after a stall and zeroed above
 *   10 units/s (teleport guard).
 * - **The chroma is three additive draws, not a post effect.** The same
 *   geometry renders once per channel with the displacement scaled
 *   0.9 / 1.0 / 1.1 — at rest the passes coincide and the wordmark is solid;
 *   wherever the mesh moves the channels separate into red/cyan fringes.
 *   (Light base colours only — a saturated colour kills its own channels.)
 * - **Normalized space.** Positions, cursor and falloff live in half-width
 *   units (x ∈ [−1, 1], y ∈ [−h/w, h/w]) so waves stay circles on screen at
 *   any element aspect; the vertex shader converts y to NDC with one aspect
 *   multiply.
 * - **Silent no-op ladder.** Missing target / empty text → no-op. No WebGL
 *   (SSR, jsdom, disabled) → no-op before any context is requested.
 *   Renderer construction throws → no-op. Off-screen → the ticker idles
 *   (IntersectionObserver) and a settled wordmark stops stepping entirely.
 *   Under `prefers-reduced-motion` nothing mounts — the real text simply
 *   stays visible (it is only hidden while the effect owns it).
 * - **Fidelity.** `destroy()` restores the text colour and the inline
 *   position, removes the canvas, listeners and observers, and disposes
 *   geometry, materials, texture and renderer.
 *
 *   wordmarkWave("[data-wordmark]", { outline: 3, tracking: 8 });
 *
 * CSS: the target holds a single line of text; it is hidden (colour
 * transparent) while mounted and re-drawn centred in its own box. Style the
 * font there — the effect inherits it.
 */
import * as THREE from "three";
import { gsap, initGSAP } from "../core/gsap.js";
import { guard } from "../core/guard.js";
import { one } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface WordmarkWaveOptions extends CommonOptions {
  /** Text to draw — defaults to the target's own (trimmed) text. */
  text?: string;
  /** CSS font shorthand; defaults to the target's computed font. */
  font?: string;
  /** Base colour; defaults to the target's computed colour. */
  color?: string;
  /** Overall opacity. @default 1 */
  opacity?: number;
  /** Stroke width, px, for an outlined wordmark — 0 = filled. @default 0 */
  outline?: number;
  /** Extra letter spacing, px. @default 0 */
  tracking?: number;
  /** Pointer-velocity ("drag") term of the sim. @default 1 */
  drag?: number;
  /** Radial push term — vertices flee the cursor while it sits still. @default 0 */
  push?: number;
  /** Red/cyan chromatic split while deforming. @default true */
  chroma?: boolean;
  /** Device-pixel-ratio cap for both canvases. @default 2 */
  dpr?: number;
  /** Horizontal grid columns — auto (≈10 px cells) when omitted. */
  segments?: number;
  /** Canvas stacking order. @default 1 */
  z?: number;
}

/* Reference frame constants — the sim is stepped at a fixed 60 Hz so these
   stay exactly as measured, whatever the display's refresh rate. */
const FALLOFF = 0.05; // pointer falloff radius, half-width units
const FLOOR = 0.1; // strength = 1/(1+d/FALLOFF) − FLOOR, clamped
const REACH = FALLOFF * (1 / FLOOR - 1); // where strength hits 0 → 0.45
const DRAG_K = 0.02; // pointer-velocity term
const SPRING = 0.1; // return-to-rest term
const DAMP = 0.9; // velocity damping per step
const INTEG = 0.1; // displacement per velocity per step
const STEP = 1 / 60; // fixed sim step, seconds
const MAX_STEPS = 4; // accumulated steps allowed per frame
const V_CLAMP = 10; // pointer speed above which the delta is discarded
const SETTLE_EPS = 1e-4; // |disp|/|vel| below which the sim sleeps

const VERT = /* glsl */ `
attribute vec2 aDisp;     // sim displacement, half-width units
uniform float uDispScale; // chroma pass multiplier: 0.9 / 1.0 / 1.1
uniform float uAspect;    // w/h — sim y to NDC (y extent is h/w)
varying vec2 vUv;

void main() {
  vUv = uv;
  vec2 p = position.xy + aDisp * uDispScale;
  gl_Position = vec4(p.x, p.y * uAspect, 0.0, 1.0);
}
`;

/* Chroma pass: premultiplied rgb, alpha = opacity/3. The three passes add up
   to base * coverage * opacity at rest; where only one channel reaches, the
   fringe sits at a third of the coverage — brighter than its alpha says,
   which is exactly the additive look the reference has. */
const CHROMA_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uMap;
uniform vec3 uPass; // channel * base colour
uniform float uOpacity;
varying vec2 vUv;

void main() {
  float a = texture2D(uMap, vUv).a;
  if (a <= 0.002) discard;
  gl_FragColor = vec4(uPass * a * uOpacity, a * uOpacity / 3.0);
}
`;

/* Single pass (chroma: false): straight alpha, like every other overlay. */
const PLAIN_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uMap;
uniform vec3 uPass;
uniform float uOpacity;
varying vec2 vUv;

void main() {
  float a = texture2D(uMap, vUv).a;
  if (a <= 0.002) discard;
  gl_FragColor = vec4(uPass, a * uOpacity);
}
`;

export function wordmarkWave(target: TargetLike, options: WordmarkWaveOptions = {}): Destroy {
  initGSAP();

  const host = one<HTMLElement>(target);
  if (!host) return () => {};

  const text = (options.text ?? host.textContent ?? "").trim().replace(/\s+/g, " ");
  if (!text) return () => {};

  const {
    color,
    opacity = 1,
    outline = 0,
    tracking = 0,
    drag = 1,
    push = 0,
    chroma = true,
    dpr = 2,
    segments = 0,
    z = 1,
  } = options;

  return guard(options, () => {
    /* ---------------- availability ladder (silent, no probes) ---------------- */
    if (typeof window === "undefined" || !("WebGLRenderingContext" in window)) return () => {};

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    } catch {
      return () => {}; // context refused — the plain text simply stays
    }

    /* --------------- the font + colour live on the element ------------------ */
    const computed = getComputedStyle(host);
    const family = computed.fontFamily;
    const weight = computed.fontWeight;
    const style = computed.fontStyle;
    const variant = computed.fontVariant;
    const size0 = parseFloat(computed.fontSize) || 16;
    const baseColor = color || computed.color || "#ffffff";
    const pass = new THREE.Color(baseColor);

    /* ---------------- layout + styles we must restore ---------------- */
    const prevPosition = host.style.position;
    if (!prevPosition && computed.position === "static") host.style.position = "relative";
    const prevColor = host.style.color;
    host.style.color = "transparent"; // the canvas owns the pixels now

    let w = Math.max(1, host.clientWidth);
    let h = Math.max(1, host.clientHeight);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dpr));
    renderer.setSize(w, h, false);
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.cssText = `position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;z-index:${z};`;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

    /* ---------------- the wordmark texture ---------------- */
    const texCanvas = document.createElement("canvas");
    const ctx = texCanvas.getContext("2d")!;
    let texture: THREE.CanvasTexture | null = null;

    /* The font: the target's computed shorthand by default; options.font
       verbatim when the canvas accepts it (px sizes are never rewritten —
       a rejected value falls back to the computed one). */
    const applyFont = () => {
      const fallback = `${style} ${variant} ${weight} ${size0}px ${family}`;
      const cand = options.font || fallback;
      ctx.font = "1px monospace"; // sentinel: survives a rejected assignment
      ctx.font = cand;
      if (ctx.font === "1px monospace") ctx.font = fallback;
    };

    const drawText = () => {
      const capDpr = Math.min(window.devicePixelRatio || 1, dpr);
      texCanvas.width = Math.max(1, Math.round(w * capDpr));
      texCanvas.height = Math.max(1, Math.round(h * capDpr));
      ctx.setTransform(capDpr, 0, 0, capDpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      applyFont();
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = outline;

      /* Letter spacing: native where it exists (Chromium 99+, FF 128+),
         manual elsewhere. typeof keeps this a runtime probe — an `in` check
         would narrow ctx to never (the property is in the type lib). */
      const canTrack = typeof ctx.letterSpacing === "string";
      if (tracking && canTrack) ctx.letterSpacing = `${tracking}px`;
      const chars = [...text];
      const manual = tracking > 0 && !canTrack;
      const trackW = manual ? tracking * (chars.length - 1) : 0;
      const m = ctx.measureText(text);
      const inkH =
        isFinite(m.actualBoundingBoxAscent) && isFinite(m.actualBoundingBoxDescent)
          ? m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
          : size0 * 1.2;

      /* Fit-to-box on both axes: scale the whole drawing (font, stroke,
         tracking) rather than parsing sizes out of arbitrary shorthands.
         Padding leaves the stroke room to breathe at the edges. */
      const padW = Math.min(16, w * 0.06) + outline;
      const padH = Math.min(12, h * 0.06) + outline;
      const fw = m.width + trackW > 0 ? (w - padW) / (m.width + trackW) : 1;
      const fh = inkH > 0 ? (h - padH) / inkH : 1;
      const f = Math.max(0.05, Math.min(1, fw, fh));
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(f, f);
      const paint = () => (outline > 0 ? ctx.strokeText(text, 0, 0) : ctx.fillText(text, 0, 0));

      if (!manual) {
        ctx.textAlign = "center";
        paint();
      } else {
        /* Manual tracking: left-align each glyph on a running cursor. */
        const widths = chars.map((c) => ctx.measureText(c).width);
        const total = widths.reduce((a, b) => a + b, 0) + trackW;
        ctx.textAlign = "left";
        let x = -total / 2;
        chars.forEach((c, i) => {
          if (outline > 0) ctx.strokeText(c, x, 0);
          else ctx.fillText(c, x, 0);
          x += widths[i] + tracking;
        });
      }
      ctx.restore();
    };

    const buildTexture = () => {
      drawText();
      if (texture) texture.dispose();
      texture = new THREE.CanvasTexture(texCanvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      /* Uniform values are read every render — no material.needsUpdate,
         which would recompile the program on every resize. */
      for (const m of materials) {
        m.uniforms.uMap.value = texture;
        m.uniforms.uAspect.value = w / Math.max(1, h);
      }
    };

    /* ---------------- materials + the three chroma passes ---------------- */
    const passColors = chroma
      ? [new THREE.Color(pass.r, 0, 0), new THREE.Color(0, pass.g, 0), new THREE.Color(0, 0, pass.b)]
      : [pass];
    const passScales = chroma ? [0.9, 1, 1.1] : [1];
    const materials: THREE.ShaderMaterial[] = passColors.map(
      (pc, i) =>
        new THREE.ShaderMaterial({
          vertexShader: VERT,
          fragmentShader: chroma ? CHROMA_FRAG : PLAIN_FRAG,
          uniforms: {
            uMap: { value: null },
            uPass: { value: pc },
            uOpacity: { value: opacity },
            uDispScale: { value: passScales[i] },
            uAspect: { value: w / Math.max(1, h) },
          },
          transparent: true,
          depthTest: false,
          depthWrite: false,
          blending: chroma ? THREE.CustomBlending : THREE.NormalBlending,
          blendSrc: THREE.OneFactor,
          blendDst: THREE.OneFactor,
          blendEquation: THREE.AddEquation,
        }),
    );

    /* ---------------- grid + sim state ---------------- */
    let geometry: THREE.PlaneGeometry;
    let meshes: THREE.Mesh[] = [];
    let disp = new Float32Array(0); // x,y displacement
    let vel = new Float32Array(0); // x,y velocity
    let verts = 0;

    const buildGrid = () => {
      geometry?.dispose();
      for (const m of meshes) scene.remove(m);
      const cols = segments > 0 ? Math.round(segments) : Math.min(160, Math.max(40, Math.round(w / 10)));
      const cell = w / cols;
      const rows = Math.min(96, Math.max(8, Math.round(h / cell)));
      /* Half-width space: x spans ±1, y spans ±h/w (isotropic units). */
      geometry = new THREE.PlaneGeometry(2, (2 * h) / w, cols, rows);
      verts = geometry.attributes.position.count;
      disp = new Float32Array(verts * 2);
      vel = new Float32Array(verts * 2);
      const attr = new THREE.BufferAttribute(disp, 2);
      attr.setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute("aDisp", attr);
      meshes = passColors.map((_, i) => {
        const mesh = new THREE.Mesh(geometry, materials[i]);
        mesh.frustumCulled = false; // the shader moves the verts
        scene.add(mesh);
        return mesh;
      });
    };

    buildTexture();
    buildGrid();
    host.appendChild(canvas);

    /* ---------------- pointer + sim ---------------- */
    const cursor = { x: 0, y: 0 };
    const prevCursor = { x: 0, y: 0 };
    let hasCursor = false;
    let settled = true;
    let needsRender = true;
    let acc = 0;

    const toSim = (cx: number, cy: number, rect: DOMRect) => {
      const rw = Math.max(1, rect.width);
      const rh = Math.max(1, rect.height);
      return { x: (cx / rw) * 2 - 1, y: (1 - (cy / rh) * 2) * (rh / rw) };
    };

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const p = toSim(e.clientX - rect.left, e.clientY - rect.top, rect);
      if (!hasCursor) {
        prevCursor.x = p.x; // first sighting: no delta from the origin
        prevCursor.y = p.y;
        hasCursor = true;
      }
      cursor.x = p.x;
      cursor.y = p.y;
      /* Outside the box + reach nothing can move — don't wake the sim. */
      const dx = Math.max(0, Math.abs(p.x) - 1);
      const dy = Math.max(0, Math.abs(p.y) - h / Math.max(1, w));
      if (Math.hypot(dx, dy) < REACH + 0.05) settled = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    /* One fixed 1/60 s step — mirrors the reference's transform-feedback
       shader: velocity += drag + spring + push, damping, integrate, clamp. */
    const step = (vx: number, vy: number) => {
      const rest = geometry.attributes.position.array as Float32Array;
      const stride = geometry.attributes.position.itemSize; // 3: x,y,z
      let maxD = 0;
      let maxV = 0;
      for (let i = 0; i < verts; i++) {
        const ix = i * 2;
        const iy = ix + 1;
        const rx = i * stride;
        /* cursorToPos: from the cursor to the vertex's current position */
        const ox = rest[rx] + disp[ix] - cursor.x;
        const oy = rest[rx + 1] + disp[iy] - cursor.y;
        const dist = Math.hypot(ox, oy);
        let strength = 1 / (1 + dist / FALLOFF) - FLOOR;
        if (strength <= 0) strength = 0;
        else if (strength > 1) strength = 1;
        vel[ix] =
          (vel[ix] + vx * DRAG_K * strength * drag - disp[ix] * SPRING + ox * strength * push) * DAMP;
        vel[iy] =
          (vel[iy] + vy * DRAG_K * strength * drag - disp[iy] * SPRING + oy * strength * push) * DAMP;
        disp[ix] += vel[ix] * INTEG;
        disp[iy] += vel[iy] * INTEG;
        disp[ix] = disp[ix] > 1 ? 1 : disp[ix] < -1 ? -1 : disp[ix];
        disp[iy] = disp[iy] > 1 ? 1 : disp[iy] < -1 ? -1 : disp[iy];
        vel[ix] = vel[ix] > 1 ? 1 : vel[ix] < -1 ? -1 : vel[ix];
        vel[iy] = vel[iy] > 1 ? 1 : vel[iy] < -1 ? -1 : vel[iy];
        const ad = Math.abs(disp[ix]) + Math.abs(disp[iy]);
        const av = Math.abs(vel[ix]) + Math.abs(vel[iy]);
        if (ad > maxD) maxD = ad;
        if (av > maxV) maxV = av;
      }
      /* Asleep only when every vertex is back at rest: strength is 0 beyond
         REACH anyway, so a pointer moving elsewhere can't wake it — onMove
         does that when it comes back within reach. */
      if (maxD < SETTLE_EPS && maxV < SETTLE_EPS) settled = true;
    };

    const render = () => {
      (geometry.attributes.aDisp as THREE.BufferAttribute).needsUpdate = true;
      renderer.render(scene, camera);
      needsRender = false;
    };

    /* ---------------- visibility gate ---------------- */
    let visible = true;
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === "function") {
      io = new IntersectionObserver(
        ([entry]) => {
          const was = visible;
          visible = entry.isIntersecting;
          if (visible && !was) needsRender = true;
        },
        { rootMargin: "80px" }, // wake just before it scrolls in — no pop
      );
      io.observe(host);
    }

    /* ---------------- ticker: frame velocity + fixed-step sim ---------------- */
    const tick = (_t: number, deltaMs: number) => {
      let dt = deltaMs / 1000;
      if (!(dt > 0)) dt = STEP;
      if (dt > 0.2) dt = STEP; // a stalled tab folds into one clean step

      /* Pointer velocity is a per-frame quantity: cursor - last frame's.
         Consumed every frame — even off-screen — so a delta accumulated
         while hidden never lands as one phantom impulse on re-entry. */
      let vx = 0;
      let vy = 0;
      if (hasCursor) {
        vx = (cursor.x - prevCursor.x) / dt;
        vy = (cursor.y - prevCursor.y) / dt;
        if (Math.hypot(vx, vy) > V_CLAMP) {
          vx = 0;
          vy = 0;
        }
        prevCursor.x = cursor.x;
        prevCursor.y = cursor.y;
      }

      if (!visible) {
        needsRender = true;
        return;
      }
      if (settled) {
        if (needsRender) render();
        return;
      }

      acc += dt;
      let n = Math.floor(acc / STEP);
      if (n > MAX_STEPS) n = MAX_STEPS;
      acc -= n * STEP;
      if (n <= 0) {
        if (needsRender) render();
        return;
      }
      for (let i = 0; i < n; i++) step(vx, vy);
      render();
    };
    gsap.ticker.add(tick);

    /* ---------------- resize ---------------- */
    let ro: ResizeObserver | null = null;
    const resize = () => {
      const rw = Math.max(1, host.clientWidth);
      const rh = Math.max(1, host.clientHeight);
      if (rw === w && rh === h) return;
      w = rw;
      h = rh;
      renderer.setSize(w, h, false);
      buildTexture();
      buildGrid();
      settled = false;
      needsRender = true;
    };
    /* ResizeObserver alone: a vw-sized host reflows on window resize too,
       so the box change is always what actually needs the rebuild. */
    if (typeof ResizeObserver === "function") {
      ro = new ResizeObserver(resize);
      ro.observe(host);
    }

    render(); // the rest state, before the pointer ever arrives

    /* ---------------- teardown ---------------- */
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
      io?.disconnect();
      ro?.disconnect();
      for (const m of meshes) scene.remove(m);
      geometry.dispose();
      for (const m of materials) m.dispose();
      texture?.dispose();
      renderer.dispose();
      canvas.remove();
      host.style.color = prevColor;
      host.style.position = prevPosition;
    };
  });
}
