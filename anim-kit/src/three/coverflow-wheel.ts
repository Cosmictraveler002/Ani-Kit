/**
 * Coverflow wheel — a deck of `<img>` cards riding a flattened spinning
 * wheel: the front card faces you, its neighbours curve away to both sides,
 * the far half of the wheel shows the blurred, dimmed card *backs*, and the
 * whole strip dissolves into the bottom of the screen.
 *
 * - **Cards bend along the arc.** Each card's geometry spans exactly one
 *   slot, so every vertex is placed on the circle from its own angle —
 *   `circleProgress = −(slot + x·stride) + progress + ¼`, `angle = 2π·cp`,
 *   `x = cos(angle)·r`, `z = sin(angle)·r·0.5` — which is why the side
 *   cards visibly curve; a stack of rigid `rotateY` planes would not.
 *   The radius follows the deck, `r = 1/(2·sin(π/N))`, so the wheel
 *   tightens as cards are added.
 * - **One scalar drives everything.** `progress` is unbounded and one full
 *   unit equals one trip around the wheel (N cards): while idle the wheel
 *   creeps an eighth of a slot toward the next card over `idle` seconds,
 *   then eases the rest of the way (`power2.inOut`, `duration`), dragging
 *   maps `−(dx/width)·0.15` onto it, and a release past `0.05·step`
 *   commits to the neighbour you pulled toward — anything less springs
 *   back over 0.3 s. `goTo/next/prev` always land on the shortest path.
 * - **Parallax is a quaternion**: the wheel node slerps toward a small
 *   yaw/pitch built from the pointer at `dt·5` a frame, and dragging
 *   squeezes the whole wheel by `1 − 0.02·easeInOutCubic(dragTime)`.
 * - **Silent no-op ladder.** Missing target / fewer than two card images /
 *   no `WebGLRenderingContext` / `prefers-reduced-motion` → an inert
 *   handle, the plain images left exactly where they are. Images that
 *   fail to decode drop out of the wheel; if fewer than two survive,
 *   nothing mounts. Off-screen wheels stop ticking (IntersectionObserver),
 *   so the autoplay never advances unseen.
 * - **Fidelity.** The camera is a *horizontal* 35° FOV converted to
 *   three's vertical one (near 0.1, far 10); the wheel node sits at
 *   `y −0.1, z −(2r) −0.8, rotateX −0.18, rotateZ 0.12`; back faces
 *   sample one mip of blur at half rgb; cards fade out below NDC −0.8.
 *   Every card carries a rim-glow band and soft blurred edges
 *   (`glow` / `edgeBlur`). `destroy()` kills the tween/ticker/observers/listeners, disposes the
 *   GL objects and restores every style it touched — including the card
 *   opacities.
 *
 *   coverflowWheel("#deck", { autoplay: false }).goTo(3)
 *
 * Markup: a container holding two or more `<img>` cards:
 *
 *   <div class="hero__deck"><img src="card-01.jpg" alt="" /> …</div>
 */
import * as THREE from "three";
import { gsap, initGSAP } from "../core/gsap.js";
import { one, prefersReducedMotion } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface CoverflowWheelOptions extends CommonOptions {
  /** First card on show (wraps). @default 0 */
  index?: number;
  /** Keep advancing on its own while idle. @default true */
  autoplay?: boolean;
  /** Seconds of stillness before the wheel moves on. @default 5 */
  idle?: number;
  /** `goTo()` tween, seconds — `next()`/`prev()` use 0.5. @default 1.15 */
  duration?: number;
  /** Gap between cards, as a fraction of one slot (0 = cards touching). @default 0.1 */
  margin?: number;
  /** Rim-glow intensity around every card, 0–1 (0 = hard flat cards). @default 0.32 */
  glow?: number;
  /** Soft blurred + feathered card edges, 0–1 (0 = sharp edges). @default 1 */
  edgeBlur?: number;
  /** Device-pixel-ratio cap for the canvas. @default 2 */
  dpr?: number;
}

export interface CoverflowWheelHandle {
  /** Show a card (wraps). Omit `duration` for the programmatic 1.15 s. */
  goTo(index: number, duration?: number): void;
  /** Next card — arrow speed, 0.5 s. */
  next(duration?: number): void;
  /** Previous card — arrow speed, 0.5 s. */
  prev(duration?: number): void;
  destroy: Destroy;
}

const VERT = /* glsl */ `
uniform float uProgress;
uniform float uSlot;
uniform float uStride;
uniform float uRadius;
uniform float uMargin;

varying vec2 vUv;
varying float vNdcY;

void main() {
  /* Geometry spans one stride, so each card bends along the arc instead of
     staying a rigid plane — position.x picks the vertex's spot on the wheel
     before being replaced by the circle itself. */
  vec2 p = position.xy * (1.0 - uMargin);
  float circleProgress = -(uSlot + p.x * uStride) + uProgress + 0.25;
  float angle = circleProgress * 6.28318530718;
  vec3 arc = vec3(cos(angle) * uRadius, p.y, sin(angle) * uRadius * 0.5);

  vec4 clip = projectionMatrix * modelViewMatrix * vec4(arc, 1.0);
  vUv = uv;
  vNdcY = clip.y / clip.w;
  gl_Position = clip;
}
`;

/** Rim-glow band width — each side of the plane as a fraction of it. The
 *  geometry is inflated by 1/(1 − 2·GM), so the inner region stays the exact
 *  5:3 card (1 × 0.6) while the outer band renders the glow. */
const GM = 0.045;

const FRAG = /* glsl */ `
precision highp float;

const float GM = ${GM}; // rim-glow band width, uv units of the whole plane

uniform sampler2D uMap;
uniform float uGlow;
uniform float uBlur;

varying vec2 vUv;
varying float vNdcY;

/* 9-tap disc blur — the taps collapse to the centre where the card is sharp. */
vec4 tapBlur(vec2 uv, float r, float bias) {
  vec4 s = texture2D(uMap, uv, bias) * 2.0;
  s += texture2D(uMap, uv + vec2(r, 0.0), bias);
  s += texture2D(uMap, uv - vec2(r, 0.0), bias);
  s += texture2D(uMap, uv + vec2(0.0, r), bias);
  s += texture2D(uMap, uv - vec2(0.0, r), bias);
  s += texture2D(uMap, uv + vec2(r, r) * 0.7071, bias);
  s += texture2D(uMap, uv + vec2(-r, r) * 0.7071, bias);
  s += texture2D(uMap, uv + vec2(r, -r) * 0.7071, bias);
  s += texture2D(uMap, uv + vec2(-r, -r) * 0.7071, bias);
  return s * 0.1;
}

void main() {
  /* The plane carries a rim-glow band around the card image: inner region =
     content, outer band = glow. Front faces sample the sharp mip at full rgb;
     back faces are mirrored, one mip blurrier and half-lit — the reference
     fragment spec (gl_FrontFacing picks the side you actually see). */
  float front = gl_FrontFacing ? 1.0 : 0.0;
  vec2 cuv = (vUv - GM) / (1.0 - 2.0 * GM);
  vec2 tc = cuv;
  tc.x = front > 0.5 ? tc.x : 1.0 - tc.x;

  /* distance to the card edge — inside drives the soft border, outside the glow */
  float dIn = min(min(cuv.x, 1.0 - cuv.x), min(cuv.y, 1.0 - cuv.y));
  vec2 q = abs(vUv - 0.5) - (0.5 - GM);
  float dOut = min(max(q.x, q.y), 0.0) + length(max(q, 0.0)); // signed box, round outside

  /* every card's edge gets a gentle blur + a thin feather — just enough to
     kill the hard cut, not enough to look soft */
  float r = (1.0 - smoothstep(0.0, 0.035, dIn)) * uBlur * 0.006;
  vec4 col = tapBlur(tc, r, 1.0 - front);
  col.rgb *= mix(0.5, 1.0, front);

  /* cards dissolve into the strip below NDC −0.8 instead of a hard edge */
  float fade = clamp(smoothstep(-1.0, -0.8, vNdcY), 0.0, 1.0);
  col.a *= fade * smoothstep(0.0, 0.01, dIn);

  /* rim glow: brightest hugging the card outline, tight falloff inside the band */
  float band = dOut > 0.0 ? pow(1.0 - clamp(dOut / GM, 0.0, 1.0), 2.4) : 0.0;
  float glowA = band * uGlow * mix(0.6, 1.0, front) * fade;

  /* glow sits behind the card content — composited as one normal blend */
  float a = col.a + glowA * (1.0 - col.a);
  vec3 rgb = (col.rgb * col.a + glowA * (1.0 - col.a)) / max(a, 1e-4);
  gl_FragColor = vec4(rgb, a);
}
`;

/** Handles from the silent no-op ladder — every call is safe. */
const INERT: CoverflowWheelHandle = {
  goTo: () => {},
  next: () => {},
  prev: () => {},
  destroy: () => {},
};

const mod = (n: number, m: number) => ((n % m) + m) % m;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** three wants a vertical FOV; the reference camera is specified horizontally. */
const vfovFor = (aspect: number) =>
  (2 * Math.atan(Math.tan((35 / 2) * (Math.PI / 180)) / aspect) * 180) / Math.PI;

export function coverflowWheel(
  target: TargetLike,
  options: CoverflowWheelOptions = {},
): CoverflowWheelHandle {
  initGSAP();

  const host = one<HTMLElement>(target);
  if (!host) return INERT;
  if (prefersReducedMotion() && !options.force) return INERT;

  const {
    index = 0,
    autoplay = true,
    idle = 5,
    duration = 1.15,
    margin = 0.1,
    glow = 0.32,
    edgeBlur = 1,
    dpr = 2,
  } = options;

  /* ---------------- availability ladder (silent, no probes) ---------------- */
  if (typeof window === "undefined" || !("WebGLRenderingContext" in window)) {
    return INERT;
  }

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch {
    return INERT; // context refused — plain images stay
  }

  const imgs = Array.from(host.querySelectorAll("img")) as HTMLImageElement[];
  if (imgs.length < 2) {
    renderer.dispose();
    return INERT;
  }

  /* ---------------- scene (card count lands after decode) ---------------- */

  let w = Math.max(1, host.clientWidth);
  let h = Math.max(1, host.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dpr));
  renderer.setSize(w, h, false);
  const canvas = renderer.domElement;
  canvas.style.cssText =
    "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(vfovFor(w / h), w / h, 0.1, 10);

  /* 40 verts / 114 indices — the reference card mesh, inflated by the glow
     margin: the inner region is still the exact 5:3 card (1 × 0.6), the
     outer band renders the rim glow. */
  const geometry = new THREE.PlaneGeometry(1 / (1 - 2 * GM), 0.6 / (1 - 2 * GM), 19, 1);

  const node = new THREE.Group(); // pose + drag squeeze
  const sway = new THREE.Group(); // pointer parallax
  node.add(sway);
  scene.add(node);

  const shared = {
    uProgress: { value: 0 },
    uStride: { value: 0 },
    uRadius: { value: 1 },
    uMargin: { value: margin },
    uGlow: { value: clamp01(glow) },
    uBlur: { value: clamp01(edgeBlur) },
  };
  const materials: THREE.ShaderMaterial[] = [];
  const textures: THREE.Texture[] = [];

  /* ---------------- state ---------------- */

  let disposed = false;
  let ready = false;
  let visible = true;
  let N = 0;
  let step = 0; // one card slot of progress (1/N)
  let progress = 0; // continuous; card i is front when progress ≡ i/N
  let currentCard = mod(Math.round(index), imgs.length);
  let mode = 0; // 0 idle · 1 tween · 2 drag
  let idleTime = 0;
  let dragStartProgress = 0;
  let dragStartX = 0;
  let dragDelta = 0;
  let dragTime = 0;
  let active: number | null = null;
  let rawX = 0;
  let rawY = 0; // pointer, element-normalised [-1, 1]
  let tween: gsap.core.Tween | null = null;
  const proxy = { v: 0 };
  const swayEuler = new THREE.Euler();
  const swayTarget = new THREE.Quaternion();

  /* ---------------- style hooks we must restore ---------------- */

  const prevPosition = host.style.position;
  const prevCursor = host.style.cursor;
  const prevTouchAction = host.style.touchAction;
  const prevUserSelect = host.style.userSelect;
  const prevImgOpacity: string[] = [];
  let styled = false;

  const applyStyles = () => {
    if (!prevPosition && getComputedStyle(host).position === "static") {
      host.style.position = "relative";
    }
    host.style.cursor = "grab";
    host.style.touchAction = "pan-y"; // vertical scroll stays native
    host.style.userSelect = "none";
    host.dataset.akCoverflow = "true";
    prevImgOpacity.length = 0;
    for (const im of imgs) {
      prevImgOpacity.push(im.style.opacity);
      im.style.opacity = "0"; // the canvas owns the pixels now
    }
    styled = true;
  };

  /* ---------------- navigation ---------------- */

  const goTo = (cardIndex: number, tweenDuration?: number) => {
    const wanted = Math.round(cardIndex);
    if (!ready) {
      currentCard = mod(wanted, Math.max(2, imgs.length));
      return;
    }
    currentCard = mod(wanted, N);
    const base = currentCard * step;
    /* Shortest path: the target ± one lap, whichever is nearer. */
    const target = base + Math.round(progress - base);
    mode = 1;
    idleTime = 0;
    tween?.kill();
    proxy.v = progress;
    tween = gsap.to(proxy, {
      v: target,
      duration: tweenDuration ?? duration,
      ease: "power2.inOut",
      overwrite: true,
      onUpdate: () => {
        progress = proxy.v;
      },
      onComplete: () => {
        progress = target;
        tween = null;
        mode = 0;
        idleTime = 0;
      },
    });
  };

  const rollback = () => {
    mode = 1;
    idleTime = 0;
    tween?.kill();
    proxy.v = progress;
    tween = gsap.to(proxy, {
      v: dragStartProgress,
      duration: 0.3,
      ease: "power2.inOut",
      overwrite: true,
      onUpdate: () => {
        progress = proxy.v;
      },
      onComplete: () => {
        progress = dragStartProgress;
        tween = null;
        mode = 0;
        idleTime = 0;
      },
    });
  };

  const next = (tweenDuration?: number) => goTo(currentCard + 1, tweenDuration ?? 0.5);
  const prev = (tweenDuration?: number) => goTo(currentCard - 1, tweenDuration ?? 0.5);

  /* ---------------- texture build (after every card decodes) ---------------- */

  /** object-fit: cover — crop the source into a 5:3 layer on a 2D canvas. */
  const coverCrop = (img: HTMLImageElement, lw: number, lh: number): THREE.Texture => {
    const c = document.createElement("canvas");
    c.width = lw;
    c.height = lh;
    const g = c.getContext("2d")!;
    const s = Math.max(lw / img.naturalWidth, lh / img.naturalHeight);
    const dw = img.naturalWidth * s;
    const dh = img.naturalHeight * s;
    g.drawImage(img, (lw - dw) / 2, (lh - dh) / 2, dw, dh);
    const tex = new THREE.CanvasTexture(c);
    // No colourSpace decode: the raw fragment passes sampled values through
    // (same rule as ditherReveal — the upload stays an ordinary RGBA8).
    tex.minFilter = THREE.LinearMipmapLinearFilter; // back faces bias one mip
    tex.magFilter = THREE.LinearFilter;
    return tex;
  };

  const settle = (im: HTMLImageElement): Promise<HTMLImageElement | null> => {
    if (typeof im.decode === "function") {
      return im
        .decode()
        .then<HTMLImageElement | null>(() => im)
        .catch(() => null);
    }
    if (im.complete) return Promise.resolve(im.naturalWidth ? im : null);
    return new Promise((resolve) => {
      const done = () => {
        im.removeEventListener("load", done);
        im.removeEventListener("error", done);
        resolve(im.naturalWidth ? im : null);
      };
      im.addEventListener("load", done);
      im.addEventListener("error", done);
    });
  };

  let mounted: HTMLImageElement[] = [];

  void (async () => {
    const settled = await Promise.all(imgs.map(settle));
    const loaded = settled.filter((im): im is HTMLImageElement => im !== null);
    if (disposed) return;
    if (loaded.length < 2) return; // nothing usable — the plain images stay
    mounted = loaded;

    /* A layout can still be 0×0 (display:none) at this point — read it fresh. */
    w = Math.max(1, host.clientWidth);
    h = Math.max(1, host.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = vfovFor(camera.aspect);
    camera.updateProjectionMatrix();

    N = loaded.length;
    step = 1 / N;
    currentCard = mod(currentCard, N);

    /* Layer budget: the front card ≈ 0.55 of the host at up to 1024 px,
       never more than ~6 M texels across the whole deck (mips included). */
    const dprEff = Math.min(window.devicePixelRatio || 1, dpr);
    const budget = Math.round(Math.sqrt(6e6 / (N * 0.6)));
    const lw = Math.max(256, Math.min(1024, Math.round(w * 0.6 * dprEff), budget));
    const lh = Math.round(lw * 0.6);

    loaded.forEach((im, i) => {
      const tex = coverCrop(im, lw, lh);
      textures.push(tex);
      const material = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uProgress: shared.uProgress,
          uStride: shared.uStride,
          uRadius: shared.uRadius,
          uMargin: shared.uMargin,
          uGlow: shared.uGlow,
          uBlur: shared.uBlur,
          uSlot: { value: i * (1 / N) },
          uMap: { value: tex },
        },
        side: THREE.DoubleSide,
        transparent: true,
      });
      materials.push(material);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.frustumCulled = false; // the vertex shader picks every position
      sway.add(mesh);
    });

    const radius = 1 / (2 * Math.sin(Math.PI / N));
    shared.uStride.value = step;
    shared.uRadius.value = radius;
    node.position.set(0, -0.1, -(2 * radius) - 0.8);
    node.rotation.set(-0.18, 0, 0.12);

    progress = currentCard * step;
    idleTime = 0;
    mode = 0;
    applyStyles();
    host.appendChild(canvas);
    ready = true;
    shared.uProgress.value = progress;
    if (visible) renderer.render(scene, camera);
  })();

  /* ---------------- pointer: parallax + drag ---------------- */

  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    if (r.width > 1 && r.height > 1) {
      rawX = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      rawY = Math.max(-1, Math.min(1, 1 - ((e.clientY - r.top) / r.height) * 2));
    }
    if (ready && mode === 2 && e.pointerId === active) {
      dragDelta = ((e.clientX - dragStartX) / w) * 0.15;
      progress = dragStartProgress - dragDelta;
    }
  };

  const onDown = (e: PointerEvent) => {
    if (!ready || active !== null || e.button !== 0) return;
    active = e.pointerId;
    mode = 2; // grab: kill whatever was animating and anchor to where we are
    idleTime = 0;
    tween?.kill();
    tween = null;
    dragStartProgress = progress;
    dragStartX = e.clientX;
    dragDelta = 0;
    currentCard = mod(Math.round(progress * N), N);
    host.style.cursor = "grabbing";
    host.setPointerCapture?.(e.pointerId);
  };

  const onUp = (e: PointerEvent) => {
    if (e.pointerId !== active) return;
    active = null;
    host.style.cursor = "grab";
    if (mode !== 2) return; // a programmatic goTo() won the race
    if (Math.abs(dragDelta) > 0.05 * step) {
      /* Fling: commit to the neighbour the pull was heading for —
         dragged right (progress fell) settles one slot back. */
      goTo(currentCard + (dragDelta > 0 ? -1 : 1), 0.5);
    } else {
      rollback(); // barely moved — spring back to where the grab began
    }
    dragDelta = 0;
  };

  const onLeave = () => {
    if (mode !== 2) {
      rawX = 0;
      rawY = 0; // pointer gone: the wheel levels out
    }
  };

  /* Native <img> drag-and-drop would swallow the pointer stream the moment
     a drag starts (pointercancel) — our cards are dragged, not the images. */
  const onDragStart = (e: Event) => e.preventDefault();

  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerdown", onDown);
  host.addEventListener("pointerleave", onLeave);
  host.addEventListener("dragstart", onDragStart);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);

  /* ---------------- loop / observers ---------------- */

  const tick = (_time: number, dtMs: number) => {
    if (disposed || !ready || !visible) return;
    let dt = dtMs / 1000;
    if (dt > 0.2 || dt <= 0) dt = 1 / 60; // a suspended tab must not jump the wheel

    if (mode === 0 && autoplay) {
      /* Idle: creep an eighth of a slot over `idle` seconds, then advance. */
      idleTime += dt;
      progress = currentCard * step + Math.min(idleTime / idle, 1) * step * 0.125;
      if (idleTime >= idle) goTo((currentCard + 1) % N);
    }

    /* Parallax — one slerp toward the pointer's yaw/pitch per frame. */
    swayEuler.set(0.05 * rawY, -0.05 * rawX, 0);
    swayTarget.setFromEuler(swayEuler);
    sway.quaternion.slerp(swayTarget, Math.min(1, dt * 5));

    /* Drag squeeze — the whole wheel shrinks 2 % while held. */
    dragTime = clamp01(dragTime + (mode === 2 ? 5 : -5) * dt);
    node.scale.setScalar(1 - 0.02 * easeInOutCubic(dragTime));

    shared.uProgress.value = progress;
    renderer.render(scene, camera);
  };
  gsap.ticker.add(tick);

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
    if (rw === w && rh === h) return;
    w = rw;
    h = rh;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = vfovFor(camera.aspect);
    camera.updateProjectionMatrix();
  };
  if (typeof ResizeObserver === "function") {
    ro = new ResizeObserver(resize);
    ro.observe(host);
  }

  /* ---------------- teardown ---------------- */

  const destroy: Destroy = () => {
    if (disposed) return;
    disposed = true;
    gsap.ticker.remove(tick);
    tween?.kill();
    tween = null;
    io?.disconnect();
    ro?.disconnect();
    host.removeEventListener("pointermove", onMove);
    host.removeEventListener("pointerdown", onDown);
    host.removeEventListener("pointerleave", onLeave);
    host.removeEventListener("dragstart", onDragStart);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
    if (styled) {
      for (let i = 0; i < mounted.length; i++) mounted[i].style.opacity = prevImgOpacity[i] ?? "";
      host.style.position = prevPosition;
      host.style.cursor = prevCursor;
      host.style.touchAction = prevTouchAction;
      host.style.userSelect = prevUserSelect;
      delete host.dataset.akCoverflow;
      canvas.remove();
    }
    geometry.dispose();
    for (const m of materials) m.dispose();
    for (const t of textures) t.dispose();
    renderer.dispose();
  };

  return { goTo, next, prev, destroy };
}
