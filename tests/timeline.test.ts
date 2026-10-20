import { describe, expect, it } from 'vitest'
import { sceneAt } from '../src/animation/timeline/scene'
import { clampTime, locate } from '../src/animation/timeline/timeline'
import { fixtureTimeline } from './fixtures'

describe('timeline: time → chapter mapping', () => {
  const timeline = fixtureTimeline()

  it('computes absolute chapter and segment boundaries', () => {
    expect(timeline.duration).toBe(8000)
    expect(timeline.chapters.map((c) => [c.start, c.end])).toEqual([
      [0, 3000],
      [3000, 6000],
      [6000, 8000],
    ])
    expect(timeline.segments.map((s) => s.start)).toEqual([0, 1000, 3000, 4500, 6000])
  })

  it.each([
    [0, 0, 0],
    [999, 0, 0],
    [1000, 0, 1],
    [2999, 0, 1],
    [3000, 1, 2],
    [4500, 1, 3],
    [7999, 2, 4],
  ])('t=%i → chapter %i, segment %i', (t, chapter, segment) => {
    const location = locate(timeline, t)
    expect(location.chapter.index).toBe(chapter)
    expect(location.segment.index).toBe(segment)
  })

  it('computes chapter-local and segment-local time', () => {
    const location = locate(timeline, 4000)
    expect(location.chapterTime).toBe(1000)
    expect(location.segmentTime).toBe(1000)
  })

  it('maps the exact end of the show to the last segment', () => {
    const location = locate(timeline, 8000)
    expect(location.segment.index).toBe(4)
    expect(location.segmentTime).toBe(2000)
  })

  it('clamps out-of-range and invalid times', () => {
    expect(clampTime(timeline, -50)).toBe(0)
    expect(clampTime(timeline, 99_999)).toBe(8000)
    expect(clampTime(timeline, Number.NaN)).toBe(0)
  })

  it('converts chapter-relative events to absolute, sorted times with stable ids', () => {
    const times = timeline.events.map((e) => e.at)
    expect(times).toEqual([...times].sort((a, b) => a - b))
    const slowmo = timeline.events.find((e) => e.type === 'slowmo')
    expect(slowmo?.at).toBe(4000)
    expect(slowmo?.id).toBe('floss:1')
  })
})

describe('scene derivation', () => {
  const timeline = fixtureTimeline()

  it('resolves forms from chapter and segment config', () => {
    expect(sceneAt(timeline, 500).form).toBe('brainrot')
    expect(sceneAt(timeline, 3200).form).toBe('auraBeast')
    expect(sceneAt(timeline, 5000).form).toBe('gigaPandaChad')
  })

  it('applies brief Giga Chad flashes, then returns to normal', () => {
    expect(sceneAt(timeline, 1999).form).toBe('brainrot')
    const flash = sceneAt(timeline, 2100)
    expect(flash.form).toBe('gigaPandaChad')
    expect(flash.formSince).toBe(2000)
    expect(sceneAt(timeline, 2500).form).toBe('brainrot')
  })

  it('records when a form started, for reveal animations', () => {
    expect(sceneAt(timeline, 3700).formSince).toBe(3000)
    expect(sceneAt(timeline, 5500).formSince).toBe(4500)
  })

  it('lists windowed events and assigns camera layers', () => {
    const scene = sceneAt(timeline, 2600)
    expect(scene.camera.motion?.shot).toBe('shake')
    expect(sceneAt(timeline, 1300).active.map((e) => e.type)).toContain('caption')
    expect(sceneAt(timeline, 2100).active.some((e) => e.type === 'caption')).toBe(false)
  })

  it('produces a stable key that only changes on visible scene changes', () => {
    expect(sceneAt(timeline, 1600).key).toBe(sceneAt(timeline, 1700).key)
    expect(sceneAt(timeline, 1100).key).not.toBe(sceneAt(timeline, 1300).key)
  })

  it('restores state after jumping straight into a later chapter', () => {
    const later = sceneAt(timeline, 5200)
    expect(later.chapter.config.id).toBe('floss')
    expect(later.segment.move).toBe('idle')
    expect(later.form).toBe('gigaPandaChad')
    const back = sceneAt(timeline, 600)
    expect(back.chapter.config.id).toBe('intro')
    expect(back.form).toBe('brainrot')
  })
})
