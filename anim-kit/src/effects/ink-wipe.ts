/**
 * Ink wipe — a brush-stroke page transition.
 *
 * A full-screen ink sheet sweeps the viewport on a tilted, noise-torn edge
 * with bristle spurs and flung flecks:
 *
 *   cover()   the sheet sweeps in one direction and swallows the page —
 *             swap your DOM (or navigate) while it sits at full cover;
 *   unveil()  the sheet keeps going and exits the far side, so the new page
 *             arrives behind the same stroke that removed the old one.
 *
 * One continuous left→right stroke across both halves — the edge never
 * reverses, which is what keeps the two halves reading as a single gesture
 * instead of a wipe and its undo.
 *
 * The transition is also wired for multi-page sites: pass `links` to catch
 * navigations (cover → leave), and the next page's `inkWipe()` finds the
 * session flag, paints covered on first frame and unveils itself.
 *
 * Reduced motion: cover/unveil snap instantly (a solid sheet while covered,
 * no brush detail) so navigation still never flashes the swap.
 *
 * Works without any 2D context (SSR, jsdom): cover/unveil resolve
 * immediately and nothing paints — destroy() is always safe to call.
 */
import { gsap, initGSAP } from "../core/gsap.js";
import { one, prefersReducedMotion } from "../core/util.js";
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";

export interface InkWipeOptions extends CommonOptions {
  /** Overlay host — the canvas is appended here. @default document.body */
  host?: TargetLike;
  /** Ink colour. @default "#0b0b0b" */
  color?: string;
  /** Cover duration, ms. @default 550 */
  coverMs?: number;
  /** Unveil duration, ms. @default 650 */
  unveilMs?: number;
  /** GSAP ease for both halves. @default "power2.inOut" */
  ease?: string;
  /** Edge lean — fraction of viewport height the top edge leads by. @default 0.35 */
  tilt?: number;
  /** Noise amplitude on the edge, px. @default 44 */
  rough?: number;
  /** Longest bristle spur, px. @default 180 */
  bristle?: number;
  /**
   * Selector for links that should run the wipe before navigating
   * (intercepted clicks; the next page unveils itself via `sessionKey`).
   */
  links?: string;
  /** sessionStorage key for the cross-page handoff. @default "ak-ink-wipe" */
  sessionKey?: string;
  /** Automatically unveil when the session flag says the page loaded covered. @default true */
  autoUnveil?: boolean;
  /** Overlay z-index. @default 9998 */
  z?: number;
}

export interface InkWipeHandle {
  /** Sweep the sheet across the page. Resolves at full cover. */
  cover(): Promise<void>;
  /** Sweep the sheet off the far side. Resolves when the page is clear. */
  unveil(): Promise<void>;
  /** Remove the canvas, listeners and link interception. */
  destroy: Destroy;
}

/** Distinguish inkWipe("#host", {...}) from inkWipe({ ... }). */
const isTargetArg = (v: unknown): v is TargetLike =>
  v === undefined ||
  v === null ||
  typeof v === "string" ||
  (typeof Element !== "undefined" && v instanceof Element) ||
  (typeof NodeList !== "undefined" && v instanceof NodeList) ||
  Array.isArray(v);

/** jsdom reports a 2D context it cannot actually provide — probe safely. */
const hasCanvas2D = (): boolean => {
  if (typeof document === "undefined") return false;
  if (typeof navigator !== "undefined" && /jsdom/i.test(navigator.userAgent || "")) return false;
  try {
    const probe = document.createElement("canvas");
    if (typeof probe.getContext !== "function") return false;
    return !!probe.getContext("2d");
  } catch {
    return false;
  }
};

/* Deterministic pseudo-random: same seed → same stroke every frame, so the
   edge shape is stable while it travels instead of boiling. */
const hash2 = (x: number, y: number, seed: number): number => {
  const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return s - Math.floor(s);
};
const smooth = (t: number) => t * t * (3 - 2 * t);
/** 2D value noise, -0.5..0.5. */
const noise2 = (x: number, y: number, seed: number): number => {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = smooth(xf), v = smooth(yf);
  const a = hash2(xi, yi, seed), b = hash2(xi + 1, yi, seed);
  const c = hash2(xi, yi + 1, seed), d = hash2(xi + 1, yi + 1, seed);
  const top = a + (b - a) * u;
  const bot = c + (d - c) * u;
  return top + (bot - top) * v - 0.5;
};
/** Fractal edge profile along y — the torn, organic boundary. */
const fbmY = (y: number, seed: number, octaves = 4): number => {
  let v = 0, amp = 0.55, freq = 1;
  for (let i = 0; i < octaves; i++) {
    v += amp * noise2(y * freq, i * 13.7, seed + i);
    amp *= 0.52;
    freq *= 2.13;
  }
  return v;
};

export function inkWipe(options: InkWipeOptions): InkWipeHandle;
export function inkWipe(target: TargetLike, options?: Partial<InkWipeOptions>): InkWipeHandle;
export function inkWipe(
  targetOrOptions: InkWipeOptions | TargetLike,
  maybeOptions: Partial<InkWipeOptions> = {},
): InkWipeHandle {
  initGSAP();

  const options: InkWipeOptions = isTargetArg(targetOrOptions)
    ? { ...maybeOptions, host: targetOrOptions ?? maybeOptions.host }
    : targetOrOptions;

  if (typeof document === "undefined") return inertHandle();

  const {
    color = "#0b0b0b",
    coverMs = 550,
    unveilMs = 650,
    ease = "power2.inOut",
    tilt = 0.35,
    rough = 44,
    bristle = 180,
    links,
    sessionKey = "ak-ink-wipe",
    autoUnveil = true,
    z = 9998,
  } = options;

  const host =
    options.host === undefined ? document.body : one<HTMLElement>(options.host);
  if (!host) return inertHandle();

  const reduced = prefersReducedMotion() && !options.force;
  const canvas = document.createElement("canvas");
  canvas.className = "ak-ink";
  canvas.setAttribute("aria-hidden", "true");
  const ctx = hasCanvas2D() ? canvas.getContext("2d") : null;
  if (!ctx) {
    /* No painter (SSR/jsdom): the handle still sequences. */
    return inertHandle();
  }

  /* Sweep state: sheet spans [trail, lead] in t-space; t 0→1 crosses the
     viewport, ±1 parks it off either side. lead <= trail = nothing drawn. */
  const state = { trail: 1, lead: -1 };
  const seed = 1 + Math.floor(Math.random() * 1e6);
  let w = 0, h = 0, dpr = 1;
  let destroyed = false;
  let current: gsap.core.Tween | null = null;
  let pendingResolve: (() => void) | null = null;

  /** Kill the in-flight sweep, settling its promise (never strand an await). */
  const killSweep = () => {
    const r = pendingResolve;
    pendingResolve = null;
    if (current) {
      current.kill();
      current = null;
    }
    r?.();
  };

  const pad = () => Math.max(w, h) * 0.5 + rough * 2 + bristle;
  /** Edge x at sweep position t, y-coordinate y (tilt + noise applied). */
  const edgeX = (t: number, y: number): number => {
    const base = -pad() + t * (w + 2 * pad());
    const lean = (0.5 - y / Math.max(1, h)) * h * tilt;
    const n = fbmY((y / Math.max(1, h)) * 6 + t * 1.7, seed) * rough;
    return base + lean + n;
  };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.max(2, Math.round(w * dpr));
    canvas.height = Math.max(2, Math.round(h * dpr));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  };

  /** One bristle spur: a thin wedge reaching away from the sheet interior. */
  const spur = (x: number, y: number, dir: 1 | -1, len: number, width: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y - width / 2);
    ctx.lineTo(x + dir * len, y - width * 0.18);
    ctx.lineTo(x + dir * len * 0.96, y + width * 0.22);
    ctx.lineTo(x, y + width / 2);
    ctx.closePath();
    ctx.fill();
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const { trail, lead } = state;
    if (lead <= trail || w === 0) return;

    ctx.fillStyle = color;

    /* --- the sheet: a quad between the two edges, sampled along y --- */
    const STEPS = Math.max(16, Math.min(64, Math.round(h / 18)));
    ctx.beginPath();
    for (let i = 0; i <= STEPS; i++) {
      const y = (i / STEPS) * h;
      const x = edgeX(lead, y);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    for (let i = STEPS; i >= 0; i--) {
      const y = (i / STEPS) * h;
      ctx.lineTo(edgeX(trail, y), y);
    }
    ctx.closePath();
    ctx.fill();

    /* --- bristle spurs + flung flecks, away from the sheet interior --- */
    const strands = 30;
    for (let i = 0; i < strands; i++) {
      const y = hash2(i, 3.1, seed) * h;
      /* lead edge pushes into untouched page (+x), trail leaves through
         cleared page (-x) — both reach away from the ink body. */
      const len = (0.25 + 0.75 * hash2(i, 7.7, seed)) * bristle;
      const width = 1.5 + hash2(i, 11.3, seed) * 7;
      const lx = edgeX(lead, y);
      if (lx < w + bristle) spur(lx - 2, y, 1, len, width);
      const tx = edgeX(trail, y);
      if (tx > -bristle) spur(tx + 2, y, -1, len, width);
    }
    /* Flecks: flung when an edge passes their land point, drawn only while
       they sit outside the sheet (they vanish under it as it catches up). */
    const flecks = 46;
    for (let i = 0; i < flecks; i++) {
      const landT = hash2(i, 21.7, seed);
      const y = hash2(i, 5.9, seed) * h;
      const throwLen = 24 + hash2(i, 9.4, seed) * 170;
      const r = 0.8 + hash2(i, 13.6, seed) * 3.4;
      const lx = edgeX(landT, y) + throwLen;
      if (landT <= lead && lx > edgeX(lead, y) + 6 && lx < w + r) {
        ctx.beginPath();
        ctx.arc(lx, y + r, r, 0, Math.PI * 2);
        ctx.fill();
      }
      const tx = edgeX(landT, y) - throwLen;
      if (landT <= trail && tx < edgeX(trail, y) - 6 && tx > -r) {
        ctx.beginPath();
        ctx.arc(tx, y - r, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const paintSolid = () => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
  };

  const sweep = (prop: "lead" | "trail", to: number, ms: number): Promise<void> =>
    new Promise((resolve) => {
      if (destroyed) return resolve();
      killSweep();
      pendingResolve = resolve;
      current = gsap.to(state, {
        [prop]: to,
        duration: ms / 1000,
        ease,
        overwrite: true,
        onUpdate: draw,
        onComplete: () => {
          current = null;
          const r = pendingResolve;
          pendingResolve = null;
          draw();
          r?.();
        },
      });
    });

  /* ---- mounting ---- */
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = String(z);
  host.appendChild(canvas);
  resize();
  window.addEventListener("resize", resize);

  /* ---- multi-page handoff ---- */
  const readFlag = (): string | null => {
    try {
      return sessionStorage.getItem(sessionKey);
    } catch {
      return null;
    }
  };
  const writeFlag = (v: string | null): void => {
    try {
      v === null ? sessionStorage.removeItem(sessionKey) : sessionStorage.setItem(sessionKey, v);
    } catch {
      /* private mode — the wipe still works, just without the handoff */
    }
  };

  if (autoUnveil && readFlag() === "covered") {
    writeFlag(null);
    state.trail = -1;
    state.lead = 1;
    draw();
    canvas.style.pointerEvents = "auto";
    /* Let first paint land, then sweep the new page in. */
    requestAnimationFrame(() => void unveil());
  }

  /* ---- link interception ---- */
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a || !a.href || a.target === "_blank" || a.hasAttribute("download")) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.href === location.href) return;
    if (links && !a.matches(links)) return;
    e.preventDefault();
    void cover().then(() => {
      writeFlag("covered");
      location.href = url.href;
    });
  };
  if (links) document.addEventListener("click", onClick);

  async function cover(): Promise<void> {
    if (destroyed) return;
    killSweep();
    if (reduced) {
      state.trail = -1;
      state.lead = 1;
      paintSolid();
      canvas.style.pointerEvents = "auto";
      return;
    }
    state.trail = -1;
    state.lead = 0;
    draw();
    await sweep("lead", 1, coverMs);
    if (!destroyed) canvas.style.pointerEvents = "auto";
  }

  async function unveil(): Promise<void> {
    if (destroyed) return;
    killSweep();
    canvas.style.pointerEvents = "none";
    if (reduced) {
      state.trail = 1;
      state.lead = -1;
      ctx?.clearRect(0, 0, w, h);
      return;
    }
    state.trail = -1;
    state.lead = 1;
    draw();
    await sweep("trail", 1, unveilMs);
    if (!destroyed) {
      /* park ready for the next cover() */
      state.trail = 1;
      state.lead = -1;
      ctx?.clearRect(0, 0, w, h);
    }
  }

  function destroy(): void {
    if (destroyed) return;
    destroyed = true;
    killSweep();
    window.removeEventListener("resize", resize);
    if (links) document.removeEventListener("click", onClick);
    canvas.remove();
  }

  return { cover, unveil, destroy };
}

/** Missing host / no 2D context: sequence instantly, never throw. */
function inertHandle(): InkWipeHandle {
  return {
    cover: () => Promise.resolve(),
    unveil: () => Promise.resolve(),
    destroy: () => {},
  };
}
