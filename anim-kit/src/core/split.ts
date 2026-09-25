/**
 * Text splitting utilities.
 *
 * anim-kit prefers GSAP's SplitText when it is available (it ships with the
 * free GSAP package), but keeps a dependency-free fallback so the library
 * still works if SplitText is ever tree-shaken out or unavailable.
 */
import { gsap, SplitText, initGSAP } from "./gsap.js";

export type SplitType = "chars" | "words" | "lines";

export interface SplitResult {
  /** The elements that were produced (chars, words or lines). */
  elements: HTMLElement[];
  /** Undo the split and restore the original markup. */
  revert: () => void;
}

export interface SplitOptions {
  type: SplitType | Array<SplitType>;
  /** Wrap each line in an overflow-hidden mask so it can slide up. */
  mask?: boolean;
  /** Class template for generated elements — `++` becomes the index. */
  linesClass?: string;
  wordsClass?: string;
  charsClass?: string;
  /** Ignore lines shorter than this fraction of the container. @default 0.05 */
  lineThreshold?: number;
}

/**
 * Split an element's text into chars/words/lines.
 * Always returns a `revert()` that restores the original DOM.
 */
export function split(target: Element | string, options: SplitOptions): SplitResult {
  initGSAP();

  const el =
    typeof target === "string"
      ? (document.querySelector<HTMLElement>(target) ?? null)
      : (target as HTMLElement);

  if (!el) return { elements: [], revert: () => {} };

  const primary = Array.isArray(options.type) ? options.type[0] : options.type;

  // Prefer SplitText: it handles nested markup, <br> and font metrics properly.
  if (typeof SplitText !== "undefined" && SplitText?.create) {
    try {
      const st = SplitText.create(el, {
        type: options.type,
        // Mask the primary split type — "lines" for text reveals, "chars" for
        // per-character masked reveals (each fragment gets a -mask wrapper).
        mask: options.mask ? primary : undefined,
        linesClass: options.linesClass ?? "ak-line++",
        wordsClass: options.wordsClass ?? "ak-word++",
        charsClass: options.charsClass ?? "ak-char++",
        lineThreshold: options.lineThreshold ?? 0.05,
      } as ConstructorParameters<typeof SplitText>[1]);

      const elements = collect(st, options.type);
      return {
        elements,
        revert: () => {
          try {
            st.revert();
          } catch {
            /* already reverted */
          }
        },
      };
    } catch {
      /* fall through to the manual splitter */
    }
  }

  return manualSplit(el, options);
}

function collect(st: SplitText, type: SplitType | SplitType[]): HTMLElement[] {
  const wanted = Array.isArray(type) ? type : [type];
  const out: HTMLElement[] = [];
  if (wanted.includes("lines") && st.lines) out.push(...(st.lines as HTMLElement[]));
  else if (wanted.includes("words") && st.words) out.push(...(st.words as HTMLElement[]));
  else if (wanted.includes("chars") && st.chars) out.push(...(st.chars as HTMLElement[]));
  return out;
}

/* ------------------------------------------------------------------ */
/* Fallback: char / word splitting only (line detection is best-effort) */
/* ------------------------------------------------------------------ */

function manualSplit(el: HTMLElement, options: SplitOptions): SplitResult {
  const original = el.innerHTML;
  const type = Array.isArray(options.type) ? options.type[0] : options.type;
  const nodes = Array.from(el.childNodes);

  const generated: HTMLElement[] = [];

  const wrap = (text: string, cls: string, i: number) => {
    const span = document.createElement("span");
    span.className = cls.replace("++", String(i));
    span.textContent = text;
    generated.push(span);
    if (options.mask && type === "chars") {
      // Mirror SplitText: each char inside an overflow-hidden mask wrapper.
      // Return the wrapper so the caller inserts mask > span intact.
      const mask = document.createElement("span");
      mask.className = `${span.className}-mask`;
      mask.style.overflow = "hidden";
      mask.style.display = "inline-block";
      mask.appendChild(span);
      return mask;
    }
    return span;
  };

  const frag = document.createDocumentFragment();
  let index = 0;

  for (const node of nodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (type === "chars") {
        for (const ch of text) {
          frag.appendChild(
            ch === " "
              ? document.createTextNode(" ")
              : wrap(ch, options.charsClass ?? "ak-char++", index++),
          );
        }
      } else {
        const parts = text.split(/(\s+)/);
        for (const part of parts) {
          if (!part) continue;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
          else frag.appendChild(wrap(part, options.wordsClass ?? "ak-word++", index++));
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      frag.appendChild(node.cloneNode(true));
    }
  }

  el.innerHTML = "";
  el.appendChild(frag);

  if (options.mask && type !== "chars") {
    gsap.set(generated, { display: "inline-block" });
  }

  return {
    elements: generated,
    revert: () => {
      el.innerHTML = original;
      generated.length = 0;
    },
  };
}
