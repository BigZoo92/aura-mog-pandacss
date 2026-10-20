import { describe, expect, it } from 'vitest'
import { AnimationSync, type AnimationHost, type AnimationLike } from '../src/animation/playback/animation-sync'

/** Minimal stand-in for a browser `Animation`, including the play()-rewinds-when-finished quirk. */
class FakeAnimation implements AnimationLike {
  currentTime: number | null = 0
  playbackRate = 1
  playState: AnimationPlayState = 'running'
  effect = null
  readonly origin: number
  readonly duration: number
  constructor(origin: number, duration = Number.POSITIVE_INFINITY) {
    this.origin = origin
    this.duration = duration
  }
  play() {
    if (this.playState === 'finished' || (this.currentTime ?? 0) >= this.duration) this.currentTime = 0
    this.playState = 'running'
  }
  pause() {
    this.playState = 'paused'
  }
}

function setup(animations: FakeAnimation[]) {
  const host: AnimationHost = { getAnimations: () => animations }
  const sync = new AnimationSync(host, (a) => (a as FakeAnimation).origin)
  sync.collect()
  return sync
}

describe('AnimationSync (WAAPI adapter)', () => {
  it('aligns currentTime to show time minus each animation origin', () => {
    const a = new FakeAnimation(1000)
    const b = new FakeAnimation(2500)
    const sync = setup([a, b])
    sync.apply({ time: 3000, rate: 1, playing: true })
    expect(a.currentTime).toBe(2000)
    expect(b.currentTime).toBe(500)
  })

  it('never seeks before an origin', () => {
    const a = new FakeAnimation(5000)
    setup([a]).apply({ time: 1000, rate: 1, playing: true })
    expect(a.currentTime).toBe(0)
  })

  it('pauses and resumes without losing position', () => {
    const a = new FakeAnimation(0)
    const sync = setup([a])
    sync.apply({ time: 1200, rate: 1, playing: false })
    expect(a.playState).toBe('paused')
    expect(a.currentTime).toBe(1200)
    sync.apply({ time: 1200, rate: 1, playing: true })
    expect(a.playState).toBe('running')
    expect(a.currentTime).toBe(1200)
  })

  it('sets currentTime AFTER play() so finished animations are not rewound', () => {
    const a = new FakeAnimation(0, 300)
    a.playState = 'finished'
    a.currentTime = 300
    setup([a]).apply({ time: 900, rate: 1, playing: true })
    expect(a.currentTime).toBe(900)
  })

  it('propagates the effective playback rate', () => {
    const a = new FakeAnimation(0)
    setup([a]).apply({ time: 0, rate: 0.5, playing: true })
    expect(a.playbackRate).toBe(0.5)
  })

  it('freezes on a key pose in reduced-motion mode', () => {
    const a = new FakeAnimation(1000)
    setup([a]).apply({ time: 4000, rate: 1, playing: true, freezeAt: 240 })
    expect(a.playState).toBe('paused')
    expect(a.currentTime).toBe(240)
  })

  it('corrects only drifted running animations', () => {
    const a = new FakeAnimation(0)
    const b = new FakeAnimation(0)
    const sync = setup([a, b])
    sync.apply({ time: 1000, rate: 1, playing: true })
    a.currentTime = 1010
    b.currentTime = 1200
    expect(sync.correctDrift(1000, 40)).toBe(1)
    expect(a.currentTime).toBe(1010)
    expect(b.currentTime).toBe(1000)
  })

  it('re-collects after a scene change and releases old references', () => {
    let list = [new FakeAnimation(0), new FakeAnimation(0)]
    const host: AnimationHost = { getAnimations: () => list }
    const sync = new AnimationSync(host, (a) => (a as FakeAnimation).origin)
    sync.collect()
    expect(sync.size).toBe(2)
    list = [new FakeAnimation(0)]
    sync.collect()
    expect(sync.size).toBe(1)
    sync.dispose()
    expect(sync.size).toBe(0)
  })

  it('ignores animations without a time origin', () => {
    const host: AnimationHost = { getAnimations: () => [new FakeAnimation(0)] }
    const sync = new AnimationSync(host, () => null)
    sync.collect()
    expect(sync.size).toBe(0)
  })
})
