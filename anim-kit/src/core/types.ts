/**
 * Shared types for anim-kit.
 *
 * Every effect in this library follows the same contract:
 *   effect(target, options) => destroy
 * so effects can be composed, torn down and re-created safely.
 */

/** Anything that can be resolved to a list of elements. */
export type TargetLike =
  | string
  | Element
  | Element[]
  | NodeListOf<Element>
  | null
  | undefined;

/** Dispose function returned by every effect. */
export type Destroy = () => void;

export interface CommonOptions {
  /**
   * Run the effect even when the user has `prefers-reduced-motion: reduce`.
   * @default false
   */
  force?: boolean;
}

/** The animation state an effect should snap to when motion is reduced. */
export type ReducedState = Record<string, string | number>;
