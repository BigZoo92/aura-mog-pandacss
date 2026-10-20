import type { RateWindow } from './timeline'

/**
 * Cinematic speed ramps. A slow-motion window multiplies time ON TOP of the
 * user's chosen playback speed — it never overwrites it:
 *
 *   effectiveRate(t) = userRate × cinematicRate(t)
 *
 * Because the cinematic rate is a pure function of show time, seeking into
 * (or out of) a slow-motion window is deterministic.
 */

export function cinematicRateAt(windows: readonly RateWindow[], t: number): number {
  for (const window of windows) {
    if (t < window.start) break
    if (t < window.end) return window.rate
  }
  return 1
}

/** Next window boundary strictly after `t`, or Infinity. */
function nextBoundary(windows: readonly RateWindow[], t: number): number {
  for (const window of windows) {
    if (window.start > t) return window.start
    if (window.end > t) return window.end
  }
  return Number.POSITIVE_INFINITY
}

/**
 * Advance show time by `realDt` ms of wall-clock time, integrating exactly
 * across slow-motion boundaries (a frame that straddles a boundary is split).
 */
export function advanceShowTime(
  windows: readonly RateWindow[],
  t: number,
  realDt: number,
  userRate: number,
): number {
  let time = t
  let remaining = Math.max(0, realDt)
  for (let guard = 0; remaining > 1e-9 && guard < 64; guard++) {
    const rate = userRate * cinematicRateAt(windows, time)
    if (rate <= 0) break
    const boundary = nextBoundary(windows, time)
    const realToBoundary = (boundary - time) / rate
    if (remaining >= realToBoundary) {
      time = boundary
      remaining -= realToBoundary
    } else {
      time += remaining * rate
      remaining = 0
    }
  }
  return time
}
