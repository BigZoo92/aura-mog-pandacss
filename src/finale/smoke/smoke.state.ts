import {
  ARGUMENT_LIFE,
  ARGUMENTS,
  VERDICT_AT,
  VERDICT_END,
  VERDICT_FADE,
  VERDICT_LINE_EMERGE,
  VERDICT_LINES,
  type SmokeArgument,
  type VerdictLine,
} from './smoke.config'

/**
 * The smoke reveal as pure functions of time (ms since the smoke origin).
 * The CSS keyframes are generated from the same constants, so this is the
 * exact state the animation shows — used by tests, by the reduced-motion
 * still frame, and by the screen-reader announcement.
 */

export type ArgumentPhase = 'hidden' | 'forming' | 'emerging' | 'holding' | 'dissipating' | 'gone'

export function argumentPhase(argument: SmokeArgument, t: number): ArgumentPhase {
  const local = t - argument.at
  if (local < 0) return 'hidden'
  if (local < ARGUMENT_LIFE.emerge[0]) return 'forming'
  if (local < ARGUMENT_LIFE.emerge[1]) return 'emerging'
  if (local < ARGUMENT_LIFE.holdUntil) return 'holding'
  if (local < ARGUMENT_LIFE.total) return 'dissipating'
  return 'gone'
}

/** Is the argument's text readable at time t? */
export const isArgumentLegible = (argument: SmokeArgument, t: number) => {
  const phase = argumentPhase(argument, t)
  return phase === 'emerging' || phase === 'holding'
}

/** Every argument whose text is on screen at time t. */
export function legibleArgumentsAt(t: number): SmokeArgument[] {
  return ARGUMENTS.filter((argument) => isArgumentLegible(argument, t))
}

/** The newest legible argument — what the screen-reader line announces. */
export function currentArgumentAt(t: number): SmokeArgument | null {
  return legibleArgumentsAt(t).at(-1) ?? null
}

export type VerdictPhase = 'hidden' | 'revealing' | 'complete' | 'dissipating' | 'gone'

export function verdictPhase(t: number): VerdictPhase {
  const last = VERDICT_LINES.at(-1) as VerdictLine
  if (t < VERDICT_AT) return 'hidden'
  if (t < last.at + VERDICT_LINE_EMERGE) return 'revealing'
  if (t < VERDICT_END) return 'complete'
  if (t < VERDICT_END + VERDICT_FADE) return 'dissipating'
  return 'gone'
}

/** Verdict lines visible at time t (revealed and not yet blown away). */
export function verdictLinesAt(t: number): VerdictLine[] {
  if (t >= VERDICT_END) return []
  return VERDICT_LINES.filter((line) => t >= line.at)
}
