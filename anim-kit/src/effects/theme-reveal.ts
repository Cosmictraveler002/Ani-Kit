/**
 * Theme reveal — circular clip-path wipe between light and dark.
 *
 * Uses the View Transitions API when available: `document.startViewTransition()`
 * swaps the theme inside the callback while injected keyframes animate
 * `::view-transition-new(root)` from `circle(0%)` to `circle(100%)`, centred on
 * the button that was clicked. Falls back to an instant swap.
 *
 *   const theme = themeReveal({ toggle: "#theme-btn" });
 *   theme.set("dark");      // wipes to dark
 *   theme.toggle();         // flips and wipes
 */
import type { CommonOptions, Destroy, TargetLike } from "../core/types.js";
import { one } from "../core/util.js";

export type ThemeName = "light" | "dark";

export interface ThemeRevealOptions extends CommonOptions {
  /** Click target that triggers the wipe (usually the toggle button). */
  toggle?: TargetLike;
  /** Storage key for persistence. @default "ak-theme" */
  storageKey?: string;
  /** Initial theme; defaults to whatever is already on <html>. */
  initial?: ThemeName;
  /** Circle origin, e.g. "50% 50%" or an element to centre on. */
  origin?: string | TargetLike;
  /** Animation duration, seconds. @default 1 */
  duration?: number;
  onChange?: (theme: ThemeName) => void;
}

export interface ThemeRevealHandle {
  set: (theme: ThemeName) => void;
  toggle: () => void;
  current: () => ThemeName;
  destroy: Destroy;
}

const STYLE_ID = "ak-theme-reveal";

export function themeReveal(options: ThemeRevealOptions = {}): ThemeRevealHandle {
  const {
    toggle,
    storageKey = "ak-theme",
    origin = "50% 50%",
    duration = 1,
    onChange,
  } = options;

  const root = document.documentElement;
  const btn = toggle ? one<HTMLElement>(toggle) : null;

  const stored = (() => {
    try {
      return sessionStorage.getItem(storageKey) as ThemeName | null;
    } catch {
      return null;
    }
  })();

  let current: ThemeName =
    options.initial ??
    stored ??
    ((root.classList.contains("dark") ? "dark" : "light") as ThemeName);

  apply(current, false);

  const onClick = () => set(current === "dark" ? "light" : "dark");
  if (btn) btn.addEventListener("click", onClick);

  function resolveOrigin(): string {
    if (typeof origin === "string") return origin;
    const el = origin ? one<HTMLElement>(origin) : btn;
    if (!el) return "50% 50%";
    const r = el.getBoundingClientRect();
    return `${Math.round(r.left + r.width / 2)}px ${Math.round(r.top + r.height / 2)}px`;
  }

  function injectStyles(o: string) {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }
    const t = `${duration}s`;
    style.textContent = `
      @supports (view-transition-name: root) {
        ::view-transition-group(root) { animation-timing-function: cubic-bezier(0.76, 0, 0.24, 1); }
        ::view-transition-old(root),
        .dark::view-transition-old(root) { animation: none; z-index: -1; }
        ::view-transition-new(root) {
          animation: ak-theme-reveal ${t} cubic-bezier(0.76, 0, 0.24, 1);
          clip-path: circle(0% at ${o});
        }
        @keyframes ak-theme-reveal {
          from { clip-path: circle(0% at ${o}); }
          to   { clip-path: circle(142% at ${o}); }
        }
      }`;
  }

  function apply(theme: ThemeName, animate: boolean) {
    const commit = () => {
      root.classList.toggle("dark", theme === "dark");
      root.style.colorScheme = theme;
      current = theme;
      try {
        sessionStorage.setItem(storageKey, theme);
      } catch {
        /* private mode */
      }
      onChange?.(theme);
    };

    const supported =
      animate && !options.force && typeof document.startViewTransition === "function";

    if (!supported) {
      commit();
      return;
    }

    injectStyles(resolveOrigin());
    // startViewTransition returns a promise; ignore rejection on rapid toggles.
    void document.startViewTransition(commit);
  }

  return {
    set: (theme) => {
      if (theme !== current) set(theme);
    },
    toggle: () => set(current === "dark" ? "light" : "dark"),
    current: () => current,
    destroy: () => {
      if (btn) btn.removeEventListener("click", onClick);
      document.getElementById(STYLE_ID)?.remove();
    },
  };

  function set(theme: ThemeName) {
    apply(theme, true);
  }
}
