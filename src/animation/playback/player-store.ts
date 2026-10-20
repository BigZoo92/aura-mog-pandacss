import { advanceShowTime, cinematicRateAt } from '../timeline/cinematic'
import { clampTime, locate, type Timeline } from '../timeline/timeline'

export type PlayerStatus = 'idle' | 'playing' | 'paused' | 'finished'

export const SPEED_PRESETS = [0.25, 0.5, 1, 1.5, 2] as const
export type PlaybackSpeed = (typeof SPEED_PRESETS)[number]

export interface PlayerState {
  status: PlayerStatus
  /** THE logical show time (ms). Single source of truth. */
  time: number
  /** The user's speed preference. Never modified by cinematic ramps. */
  userRate: PlaybackSpeed
  loop: boolean
  /**
   * Incremented on every discontinuity (seek, play, pause, speed change,
   * cinematic rate change). The animation adapter re-aligns on change;
   * continuous playback does not bump it.
   */
  revision: number
}

export interface SyncState {
  time: number
  rate: number
  playing: boolean
}

type Listener = () => void

/**
 * Framework-agnostic playback controller. It owns logical time and nothing
 * else: no DOM, no React. `tick(now)` is driven by requestAnimationFrame in
 * the browser and by hand in tests.
 */
export class PlayerStore {
  private state: PlayerState
  private listeners = new Set<Listener>()
  private lastNow: number | null = null
  private lastEffectiveRate = 1
  private suspended = false
  readonly timeline: Timeline

  constructor(timeline: Timeline, initial: Partial<Pick<PlayerState, 'userRate' | 'loop' | 'time'>> = {}) {
    this.timeline = timeline
    this.state = {
      status: 'idle',
      time: clampTime(timeline, initial.time ?? 0),
      userRate: initial.userRate ?? 1,
      loop: initial.loop ?? false,
      revision: 0,
    }
    this.lastEffectiveRate = this.effectiveRate()
  }

  // --- subscription (useSyncExternalStore-compatible) -------------------

  subscribe = (listener: Listener) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getSnapshot = (): PlayerState => this.state

  get listenerCount() {
    return this.listeners.size
  }

  private set(patch: Partial<PlayerState>, discontinuity: boolean) {
    this.state = {
      ...this.state,
      ...patch,
      revision: discontinuity ? this.state.revision + 1 : this.state.revision,
    }
    for (const listener of this.listeners) listener()
  }

  // --- derived ------------------------------------------------------------

  cinematicRate(time = this.state.time) {
    return cinematicRateAt(this.timeline.rateWindows, time)
  }

  /** userRate × cinematic multiplier — what CSS animations should run at. */
  effectiveRate(time = this.state.time) {
    return this.state.userRate * this.cinematicRate(time)
  }

  getSyncState(): SyncState {
    return { time: this.state.time, rate: this.effectiveRate(), playing: this.state.status === 'playing' }
  }

  // --- commands -----------------------------------------------------------

  play() {
    if (this.state.status === 'playing') return
    const restart = this.state.status === 'finished' || this.state.time >= this.timeline.duration
    this.lastNow = null
    this.set({ status: 'playing', ...(restart ? { time: 0 } : {}) }, true)
  }

  pause() {
    if (this.state.status !== 'playing') return
    this.lastNow = null
    this.set({ status: 'paused' }, true)
  }

  toggle() {
    if (this.state.status === 'playing') this.pause()
    else this.play()
  }

  /** Jump to an absolute show time. Works forwards and backwards. */
  seek(time: number) {
    const t = clampTime(this.timeline, time)
    const status = this.state.status === 'finished' && t < this.timeline.duration ? 'paused' : this.state.status
    this.lastNow = null
    this.lastEffectiveRate = this.state.userRate * this.cinematicRate(t)
    this.set({ time: t, status: status === 'idle' ? 'paused' : status }, true)
  }

  seekBy(delta: number) {
    this.seek(this.state.time + delta)
  }

  /** Change speed WITHOUT touching the current position. */
  setRate(userRate: PlaybackSpeed) {
    if (userRate === this.state.userRate) return
    this.state = { ...this.state, userRate }
    this.lastEffectiveRate = this.effectiveRate()
    this.set({}, true)
  }

  setLoop(loop: boolean) {
    this.set({ loop }, false)
  }

  /** Back to zero, playing. Every derived value (aura, form, boss...) resets with it. */
  replay() {
    this.lastNow = null
    this.lastEffectiveRate = this.state.userRate * this.cinematicRate(0)
    this.set({ time: 0, status: 'playing' }, true)
  }

  /** Reset to the very beginning without playing. */
  reset() {
    this.lastNow = null
    this.set({ time: 0, status: 'idle' }, true)
  }

  goToChapter(index: number) {
    const chapter = this.timeline.chapters[Math.max(0, Math.min(index, this.timeline.chapters.length - 1))]
    if (chapter) this.seek(chapter.start)
  }

  nextChapter() {
    const { chapter } = locate(this.timeline, this.state.time)
    if (chapter.index < this.timeline.chapters.length - 1) this.goToChapter(chapter.index + 1)
  }

  /** Like a music player: restart the chapter, or go to the previous one if near its start. */
  prevChapter(threshold = 1500) {
    const { chapter, chapterTime } = locate(this.timeline, this.state.time)
    if (chapterTime > threshold || chapter.index === 0) this.goToChapter(chapter.index)
    else this.goToChapter(chapter.index - 1)
  }

  /** Page hidden: freeze without changing the user-visible status. */
  suspend() {
    if (this.state.status !== 'playing') return
    this.suspended = true
    this.pause()
  }

  resumeFromSuspend() {
    if (!this.suspended) return
    this.suspended = false
    this.play()
  }

  // --- clock ----------------------------------------------------------------

  /** Advance the clock to wall-clock time `now` (ms). */
  tick(now: number) {
    if (this.state.status !== 'playing') {
      this.lastNow = null
      return
    }
    if (this.lastNow === null) {
      this.lastNow = now
      return
    }
    // Clamp huge gaps (debugger pauses, throttled tabs) so the show never leaps.
    const realDt = Math.min(Math.max(0, now - this.lastNow), 250)
    this.lastNow = now
    const next = advanceShowTime(this.timeline.rateWindows, this.state.time, realDt, this.state.userRate)

    if (next >= this.timeline.duration) {
      if (this.state.loop) {
        this.lastEffectiveRate = this.state.userRate * this.cinematicRate(0)
        this.set({ time: 0 }, true)
      } else {
        this.set({ time: this.timeline.duration, status: 'finished' }, true)
      }
      return
    }

    const rate = this.state.userRate * this.cinematicRate(next)
    const rateChanged = rate !== this.lastEffectiveRate
    this.lastEffectiveRate = rate
    this.set({ time: next }, rateChanged)
  }
}
