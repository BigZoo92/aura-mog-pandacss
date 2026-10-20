import { describe, expect, it } from 'vitest'
import { AURA_CAP, auraAt, bossHealthAt, comboAt, formatAura, gaugeAt, totalAura } from '../src/animation/timeline/scoring'
import { fixtureTimeline } from './fixtures'

describe('aura economy (derived from show time)', () => {
  const timeline = fixtureTimeline()

  it('earns nothing before the first event', () => {
    expect(auraAt(timeline, 0)).toBe(0)
    expect(auraAt(timeline, 499)).toBe(0)
  })

  it('applies instant gains and rolls up ramped gains', () => {
    expect(auraAt(timeline, 500)).toBe(67)
    expect(auraAt(timeline, 2000)).toBe(67 + 50)
    expect(auraAt(timeline, 2500)).toBe(167)
  })

  it('is identical when reached forwards or by seeking backwards', () => {
    const forward = auraAt(timeline, 3500)
    auraAt(timeline, 7900)
    expect(auraAt(timeline, 3500)).toBe(forward)
  })

  it('counts combos and resets them on a combo break', () => {
    expect(comboAt(timeline, 400)).toBe(0)
    expect(comboAt(timeline, 3200)).toBe(3)
    expect(comboAt(timeline, 5950)).toBe(0)
    expect(comboAt(timeline, 7900)).toBe(1)
  })

  it('derives boss health from damage events and never goes below zero', () => {
    expect(bossHealthAt(timeline, 6000)).toBe(100)
    expect(bossHealthAt(timeline, 6600)).toBe(60)
    expect(bossHealthAt(timeline, 7600)).toBe(0)
  })

  it('reports gauge states: charging → overflow → burst', () => {
    expect(gaugeAt(timeline, 600).state).toBe('charging')
    const overflow = gaugeAt(timeline, 7850)
    expect(overflow.state).toBe('overflow')
    expect(overflow.fill).toBe(1)
    expect(overflow.overflow).toBeGreaterThan(0)
    expect(gaugeAt(timeline, 7950).state).toBe('burst')
    expect(gaugeAt(timeline, 0, AURA_CAP).state).toBe('full')
  })

  it('sums the total and formats absurd numbers', () => {
    expect(totalAura(timeline)).toBe(67 + 100 + 1000 + 999_999)
    expect(formatAura(999_999)).toBe('999 999')
    expect(formatAura(1_234_567)).toBe('1 234 567')
  })
})
