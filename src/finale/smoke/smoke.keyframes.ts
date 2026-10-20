import { defineKeyframes } from '@pandacss/dev'
import { ARGUMENT_LIFE, VERDICT_FADE } from './smoke.config'

/**
 * Smoke keyframes. Per-element parameters (travel, size, drift) come in as
 * CSS custom properties, so 60-odd smoke elements share a handful of
 * keyframes. The argument-cloud percentages are COMPUTED from the same
 * constants as `smoke.state.ts`, so the CSS and the pure state functions
 * cannot disagree.
 */
const pct = (ms: number) => `${Math.round((ms / ARGUMENT_LIFE.total) * 1000) / 10}%`

const FORM = pct(ARGUMENT_LIFE.form)
const EMERGE_START = pct(ARGUMENT_LIFE.emerge[0])
const EMERGE_END = pct(ARGUMENT_LIFE.emerge[1])
const HOLD_END = pct(ARGUMENT_LIFE.holdUntil)

export const smokeKeyframes = defineKeyframes({
  /** One exhaled puff: leaves the lips tiny, swells and drifts out, thins away. */
  smokePuffTravel: {
    '0%': { translate: '0 0', scale: '0.12', rotate: '0deg', opacity: '0' },
    '5%': { opacity: '0.96' },
    '65%': { opacity: '0.88' },
    '100%': { translate: 'var(--dx) var(--dy)', scale: 'var(--s)', rotate: 'var(--r)', opacity: '0' },
  },
  /** A big billow: born at the mouth, rolls out to its place, drifts, then thins out. */
  smokeMassLife: {
    '0%': { translate: 'var(--from-x) var(--from-y)', scale: '0.1', opacity: '0' },
    '2.5%': { opacity: '0.97' },
    '11%': { translate: '0 0', scale: '1', opacity: '0.97' },
    // As the arguments start condensing, the billows thin into a haze so the
    // argument clouds (and Tung Tung) read through them.
    '18%': { opacity: '0.9' },
    '27%': { translate: 'calc(var(--drift-x) * 0.3) calc(var(--drift-y) * 0.3)', scale: '1.02', opacity: '0.5' },
    '88%': { translate: 'var(--drift-x) var(--drift-y)', scale: '1.08', opacity: '0.44' },
    '100%': { translate: 'var(--drift-x) var(--drift-y)', scale: '1.3', opacity: '0' },
  },
  /** Each lump of smoke breathes on its own clock — the cloud never looks rigid. */
  smokeLumpBreathe: {
    '0%, 100%': { scale: '0.94', translate: '0 0' },
    '50%': { scale: '1.07', translate: 'var(--wobble-x, 0.3em) var(--wobble-y, -0.3em)' },
  },
  /** A volute: a curl of smoke that spins in just before an argument appears. */
  smokeWispCurl: {
    '0%': { rotate: '-150deg', scale: '0.3', opacity: '0' },
    [EMERGE_START]: { opacity: '0.9' },
    [EMERGE_END]: { rotate: '40deg', scale: '1.15', opacity: '0' },
    '100%': { rotate: '40deg', scale: '1.15', opacity: '0' },
  },
  /** Argument cloud: billows in from a direction, holds and drifts, then dissipates. */
  smokeCloudLife: {
    '0%': { translate: 'var(--from-x) var(--from-y)', scale: '0.25', opacity: '0' },
    [FORM]: { translate: '0 0', scale: '1', opacity: '0.97' },
    [HOLD_END]: { translate: 'var(--drift-x) var(--drift-y)', scale: '1.04', opacity: '0.97' },
    '100%': { translate: 'var(--drift-x) calc(var(--drift-y) - 1.5em)', scale: '1.45', opacity: '0' },
  },
  /** Argument text: condenses out of the smoke, floats, then evaporates with its cloud. */
  smokeTextLife: {
    '0%': { opacity: '0', letterSpacing: '0.45em', filter: 'blur(0.35em)', maskPosition: '100% 0', scale: '1.12', translate: '0 0.4em' },
    [EMERGE_START]: { opacity: '0', letterSpacing: '0.45em', filter: 'blur(0.35em)', maskPosition: '100% 0', scale: '1.12', translate: '0 0.4em' },
    [EMERGE_END]: { opacity: '1', letterSpacing: '0.02em', filter: 'blur(0)', maskPosition: '0% 0', scale: '1', translate: '0 0' },
    [HOLD_END]: { opacity: '1', letterSpacing: '0.03em', filter: 'blur(0)', maskPosition: '0% 0', scale: '1', translate: '0 -0.3em' },
    '100%': { opacity: '0', letterSpacing: '0.2em', filter: 'blur(0.3em)', maskPosition: '0% 0', scale: '1.05', translate: '0 -1.6em' },
  },
  /** The verdict cloud: the biggest billow of all. */
  smokeVerdictCloud: {
    '0%': { scale: '0.3', opacity: '0' },
    '9%': { scale: '1', opacity: '0.98' },
    '100%': { scale: '1.04', opacity: '0.98' },
  },
  /** A verdict line condensing out of the cloud (then held). */
  smokeLineEmerge: {
    '0%': { opacity: '0', letterSpacing: '0.5em', filter: 'blur(0.35em)', maskPosition: '100% 0', scale: '1.15' },
    '100%': { opacity: '1', letterSpacing: '0.02em', filter: 'blur(0)', maskPosition: '0% 0', scale: '1' },
  },
  /** End of the verdict: the cloud breaks apart and blows off-stage. */
  smokeBlowAway: {
    '0%': { opacity: '1', translate: '0 0', scale: '1' },
    '100%': { opacity: '0', translate: 'var(--away-x, 0) var(--away-y, -6em)', scale: '1.5' },
  },
})

export const SMOKE_BLOW_AWAY_MS = VERDICT_FADE
