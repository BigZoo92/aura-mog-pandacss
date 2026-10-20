import type { AbsoluteEvent, Timeline } from './timeline'

/**
 * The aura economy. Every value is DERIVED from show time — never accumulated
 * frame by frame — so seeking backwards un-earns aura exactly.
 */

/** Gauge capacity: beyond this the gauge "overflows" (purely visual). */
export const AURA_CAP = 60_000

const DEFAULT_RAMP = 450

const ramp = (t: number, at: number, duration: number) =>
  duration <= 0 ? 1 : Math.min(1, Math.max(0, (t - at) / duration))

/** Aura earned at time t. Each gain rolls up over its ramp, like an arcade counter. */
export function auraAt(timeline: Timeline, t: number): number {
  let total = 0
  for (const event of timeline.events) {
    if (event.at > t) break
    if (event.type === 'aura') total += event.amount * ramp(t, event.at, event.ramp ?? DEFAULT_RAMP)
  }
  return Math.round(total)
}

/** Combo = aura hits since the last combo break. */
export function comboAt(timeline: Timeline, t: number): number {
  let combo = 0
  for (const event of timeline.events) {
    if (event.at > t) break
    if (event.type === 'aura') combo += 1
    else if (event.type === 'comboBreak') combo = 0
  }
  return combo
}

/** Boss health in percent. */
export function bossHealthAt(timeline: Timeline, t: number): number {
  let damage = 0
  for (const event of timeline.events) {
    if (event.at > t) break
    if (event.type === 'bossDamage') damage += event.amount * ramp(t, event.at, event.ramp ?? 300)
  }
  return Math.max(0, Math.min(100, 100 - damage))
}

export type GaugeState = 'charging' | 'full' | 'overflow' | 'burst'

export interface Gauge {
  /** 0..1 fill of the normal gauge. */
  fill: number
  /** How far past capacity (0 = not overflowing, 1 = double the cap...). */
  overflow: number
  state: GaugeState
}

export function gaugeAt(timeline: Timeline, t: number, aura = auraAt(timeline, t)): Gauge {
  const burst = timeline.events.some((event) => event.type === 'gaugeBurst' && event.at <= t)
  const ratio = aura / AURA_CAP
  const fill = Math.min(1, ratio)
  const overflow = Math.max(0, ratio - 1)
  const state: GaugeState = burst ? 'burst' : overflow > 0.02 ? 'overflow' : fill >= 0.999 ? 'full' : 'charging'
  return { fill, overflow, state }
}

/** Sum of every aura event in the show — the final score. */
export function totalAura(timeline: Timeline): number {
  return timeline.events.reduce(
    (sum, event: AbsoluteEvent) => (event.type === 'aura' ? sum + event.amount : sum),
    0,
  )
}

/** Compact, absurd-number-friendly formatting: 1 234 567. */
export function formatAura(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
