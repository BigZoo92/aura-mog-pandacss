/**
 * The bridge between logical show time and the browser's CSS animations.
 *
 * CSS `@keyframes` do all the moving. This adapter only CONTROLS the
 * animation objects the browser already created (Web Animations API):
 * pause / play / currentTime / playbackRate. It never generates keyframes.
 *
 * Time origin rule: every animated subtree declares the show time at which
 * its animations start, with a `data-t0` attribute (a dance segment, an
 * impact effect, a caption...). For each animation:
 *
 *     animation.currentTime = showTime − t0
 *
 * After a scene change, `collect()` registers the newly mounted animations
 * once; `apply()` aligns them. Between discontinuities they run natively on
 * the compositor; `correctDrift()` is a cheap periodic safety net.
 */

/** The subset of `Animation` we rely on — easy to mock in tests. */
export interface AnimationLike {
  currentTime: CSSNumberish | null
  playbackRate: number
  readonly playState: AnimationPlayState
  play(): void
  pause(): void
  readonly effect: { readonly target?: Element | null } | AnimationEffect | null
}

export interface AnimationHost {
  getAnimations(options?: GetAnimationsOptions): AnimationLike[]
}

export interface SyncTarget {
  time: number
  rate: number
  playing: boolean
  /**
   * Reduced-motion mode: hold every animation at `t0 + freezeAt` instead of
   * following the show time — a still, readable key pose per segment.
   */
  freezeAt?: number
}

export type OriginResolver = (animation: AnimationLike) => number | null

/** Default origin lookup: nearest `[data-t0]` ancestor (or self) of the animation target. */
export const resolveDataOrigin: OriginResolver = (animation) => {
  const effect = animation.effect as KeyframeEffect | null
  const target = effect && 'target' in effect ? effect.target : null
  const host = target?.closest?.('[data-t0]') as HTMLElement | null | undefined
  const value = host?.dataset.t0
  if (value === undefined || value === '') return null
  const origin = Number(value)
  return Number.isFinite(origin) ? origin : null
}

const toMs = (value: CSSNumberish | null): number | null => (typeof value === 'number' ? value : null)

export class AnimationSync {
  private tracked = new Map<AnimationLike, number>()
  private readonly host: AnimationHost
  private readonly resolveOrigin: OriginResolver

  constructor(host: AnimationHost, resolveOrigin: OriginResolver = resolveDataOrigin) {
    this.host = host
    this.resolveOrigin = resolveOrigin
  }

  get size() {
    return this.tracked.size
  }

  /** (Re)register the host's animations. Call once after each scene commit. */
  collect() {
    const next = new Map<AnimationLike, number>()
    for (const animation of this.host.getAnimations({ subtree: true })) {
      const origin = this.resolveOrigin(animation)
      if (origin !== null) next.set(animation, origin)
    }
    this.tracked = next
  }

  /** Align every tracked animation with the show. */
  apply({ time, rate, playing, freezeAt }: SyncTarget) {
    for (const [animation, origin] of this.tracked) {
      const local = freezeAt !== undefined ? freezeAt : Math.max(0, time - origin)
      const shouldRun = playing && freezeAt === undefined
      if (animation.playbackRate !== rate && rate > 0) animation.playbackRate = rate
      // Order matters: play() on a finished animation rewinds it to 0,
      // so set the time AFTER changing the play state.
      if (shouldRun && animation.playState !== 'running') animation.play()
      if (!shouldRun && animation.playState !== 'paused') animation.pause()
      animation.currentTime = local
    }
  }

  /**
   * Compare running animations against the show clock and re-align any that
   * drifted beyond `tolerance` ms. Returns how many were corrected.
   */
  correctDrift(time: number, tolerance = 40): number {
    let corrected = 0
    for (const [animation, origin] of this.tracked) {
      if (animation.playState !== 'running') continue
      const current = toMs(animation.currentTime)
      const expected = Math.max(0, time - origin)
      if (current === null || Math.abs(current - expected) > tolerance) {
        animation.currentTime = expected
        corrected++
      }
    }
    return corrected
  }

  /** Forget every reference (component unmount). */
  dispose() {
    this.tracked.clear()
  }
}
