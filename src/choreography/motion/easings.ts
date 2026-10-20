/**
 * Named easing curves. Registered as Panda `easings` tokens and used inside
 * compiled keyframes, so a curve is defined exactly once.
 */
export const EASINGS = {
  linear: 'linear',
  inOut: 'cubic-bezier(0.45, 0, 0.55, 1)',
  out: 'cubic-bezier(0.22, 1, 0.36, 1)',
  in: 'cubic-bezier(0.55, 0, 1, 0.45)',
  /** Fast attack, long settle — the "hit" of a dance move. */
  snap: 'cubic-bezier(0.1, 0.9, 0.2, 1)',
  /** Slow wind-up then a violent release: anticipation. */
  windup: 'cubic-bezier(0.7, -0.4, 0.8, 0.6)',
  /** Overshoot and settle back: follow-through. */
  overshoot: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  /** Rubbery bounce used for squash-and-stretch landings. */
  bounce: 'cubic-bezier(0.3, 1.8, 0.6, 0.9)',
  /** Discrete switch at the end of the interval (pose snaps). */
  hold: 'steps(1, end)',
} as const

export type Easing = keyof typeof EASINGS
