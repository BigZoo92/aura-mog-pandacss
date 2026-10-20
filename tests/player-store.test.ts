import { describe, expect, it, vi } from 'vitest'
import { PlayerStore } from '../src/animation/playback/player-store'
import { auraAt } from '../src/animation/timeline/scoring'
import { sceneAt } from '../src/animation/timeline/scene'
import { fixtureTimeline } from './fixtures'

/** Drive the store with a fake clock: `run(store, ms)` simulates frames. */
function run(store: PlayerStore, ms: number, frame = 16, start = { now: 0 }) {
  store.tick(start.now)
  for (let elapsed = 0; elapsed < ms; elapsed += frame) {
    start.now += frame
    store.tick(start.now)
  }
  return start
}

describe('PlayerStore', () => {
  it('starts idle at zero', () => {
    const store = new PlayerStore(fixtureTimeline())
    expect(store.getSnapshot()).toMatchObject({ status: 'idle', time: 0, userRate: 1, loop: false })
  })

  it('advances only while playing', () => {
    const store = new PlayerStore(fixtureTimeline())
    run(store, 160)
    expect(store.getSnapshot().time).toBe(0)
    store.play()
    run(store, 160)
    expect(store.getSnapshot().time).toBe(160)
  })

  it('pause freezes time and resume continues from the same position', () => {
    const store = new PlayerStore(fixtureTimeline())
    store.play()
    const clock = run(store, 320)
    store.pause()
    const frozen = store.getSnapshot().time
    run(store, 500, 16, clock)
    expect(store.getSnapshot().time).toBe(frozen)
    store.play()
    run(store, 160, 16, clock)
    expect(store.getSnapshot().time).toBe(frozen + 160)
  })

  it('changes speed without restarting or jumping', () => {
    const store = new PlayerStore(fixtureTimeline())
    store.play()
    const clock = run(store, 320)
    const before = store.getSnapshot().time
    store.setRate(2)
    expect(store.getSnapshot().time).toBe(before)
    expect(store.getSnapshot().status).toBe('playing')
    run(store, 160, 16, clock)
    expect(store.getSnapshot().time).toBe(before + 320)
  })

  it('seeks forwards and backwards and bumps the revision', () => {
    const store = new PlayerStore(fixtureTimeline())
    const r0 = store.getSnapshot().revision
    store.seek(5000)
    expect(store.getSnapshot().time).toBe(5000)
    store.seek(1200)
    expect(store.getSnapshot().time).toBe(1200)
    expect(store.getSnapshot().revision).toBe(r0 + 2)
    expect(store.getSnapshot().status).toBe('paused')
  })

  it('replay resets everything derived from time', () => {
    const timeline = fixtureTimeline()
    const store = new PlayerStore(timeline)
    store.seek(7950)
    expect(auraAt(timeline, store.getSnapshot().time)).toBeGreaterThan(999_999)
    store.replay()
    const { time, status } = store.getSnapshot()
    expect(time).toBe(0)
    expect(status).toBe('playing')
    expect(auraAt(timeline, time)).toBe(0)
    expect(sceneAt(timeline, time).form).toBe('brainrot')
    expect(sceneAt(timeline, time).chapter.index).toBe(0)
  })

  it('finishes at the end of the show', () => {
    const store = new PlayerStore(fixtureTimeline())
    store.seek(7900)
    store.play()
    run(store, 200)
    expect(store.getSnapshot()).toMatchObject({ status: 'finished', time: 8000 })
    store.play()
    expect(store.getSnapshot()).toMatchObject({ status: 'playing', time: 0 })
  })

  it('loops back to zero when looping is enabled', () => {
    const store = new PlayerStore(fixtureTimeline(), { loop: true })
    store.seek(7950)
    store.play()
    run(store, 100)
    const { status, time } = store.getSnapshot()
    expect(status).toBe('playing')
    expect(time).toBeLessThan(100)
  })

  it('navigates chapters like a music player', () => {
    const store = new PlayerStore(fixtureTimeline())
    store.nextChapter()
    expect(store.getSnapshot().time).toBe(3000)
    store.nextChapter()
    expect(store.getSnapshot().time).toBe(6000)
    store.seek(6200)
    store.prevChapter()
    expect(store.getSnapshot().time).toBe(3000)
    store.seek(5000)
    store.prevChapter()
    expect(store.getSnapshot().time).toBe(3000)
  })

  it('applies cinematic slow motion on top of the user speed and restores it after', () => {
    const store = new PlayerStore(fixtureTimeline(), { userRate: 2 })
    store.seek(3900)
    store.play()
    expect(store.effectiveRate()).toBe(2)
    const clock = run(store, 160)
    expect(store.effectiveRate()).toBe(0.5) // 2 × 0.25 inside the window
    expect(store.getSnapshot().userRate).toBe(2)
    store.seek(5100)
    store.play()
    run(store, 16, 16, clock)
    expect(store.effectiveRate()).toBe(2)
  })

  it('bumps the revision when the cinematic rate changes during playback', () => {
    const store = new PlayerStore(fixtureTimeline())
    store.seek(3990)
    store.play()
    const r = store.getSnapshot().revision
    run(store, 48)
    expect(store.getSnapshot().revision).toBeGreaterThan(r)
  })

  it('suspends on hidden pages and resumes where it left off', () => {
    const store = new PlayerStore(fixtureTimeline())
    store.play()
    const clock = run(store, 160)
    store.suspend()
    expect(store.getSnapshot().status).toBe('paused')
    clock.now += 60_000
    store.resumeFromSuspend()
    run(store, 16, 16, clock)
    expect(store.getSnapshot().time).toBe(176)
  })

  it('clamps huge frame gaps so the show never leaps', () => {
    const store = new PlayerStore(fixtureTimeline())
    store.play()
    store.tick(0)
    store.tick(5000)
    expect(store.getSnapshot().time).toBe(250)
  })

  it('notifies subscribers and cleans up', () => {
    const store = new PlayerStore(fixtureTimeline())
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)
    store.play()
    expect(listener).toHaveBeenCalled()
    unsubscribe()
    expect(store.listenerCount).toBe(0)
  })
})
