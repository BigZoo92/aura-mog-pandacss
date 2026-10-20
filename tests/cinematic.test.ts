import { describe, expect, it } from 'vitest'
import { advanceShowTime, cinematicRateAt } from '../src/animation/timeline/cinematic'

const windows = [
  { start: 1000, end: 2000, rate: 0.25 },
  { start: 5000, end: 5500, rate: 0.5 },
]

describe('cinematic speed ramps', () => {
  it('returns the multiplier active at a time', () => {
    expect(cinematicRateAt(windows, 0)).toBe(1)
    expect(cinematicRateAt(windows, 1000)).toBe(0.25)
    expect(cinematicRateAt(windows, 1999)).toBe(0.25)
    expect(cinematicRateAt(windows, 2000)).toBe(1)
    expect(cinematicRateAt(windows, 5200)).toBe(0.5)
  })

  it('advances at the user rate outside windows', () => {
    expect(advanceShowTime(windows, 0, 100, 1)).toBe(100)
    expect(advanceShowTime(windows, 0, 100, 2)).toBe(200)
    expect(advanceShowTime(windows, 0, 100, 0.5)).toBe(50)
  })

  it('combines user rate and cinematic rate multiplicatively', () => {
    expect(advanceShowTime(windows, 1200, 100, 1)).toBeCloseTo(1225)
    expect(advanceShowTime(windows, 1200, 100, 2)).toBeCloseTo(1250)
  })

  it('splits a frame that crosses into a slow-motion window', () => {
    // 50 ms at 1× reaches 1000, the remaining 50 ms run at 0.25×.
    expect(advanceShowTime(windows, 950, 100, 1)).toBeCloseTo(1012.5)
  })

  it('splits a frame that leaves a slow-motion window', () => {
    // 1990 → 2000 takes 40 ms of real time at 0.25×; the last 60 ms run at 1×.
    expect(advanceShowTime(windows, 1990, 100, 1)).toBeCloseTo(2060)
  })

  it('is deterministic regardless of frame slicing', () => {
    let sliced = 900
    for (let i = 0; i < 300; i++) sliced = advanceShowTime(windows, sliced, 16.6667, 1.5)
    const whole = advanceShowTime(windows, 900, 300 * 16.6667, 1.5)
    expect(sliced).toBeCloseTo(whole, 6)
  })
})
