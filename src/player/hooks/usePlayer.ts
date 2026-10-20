import { useEffect, useLayoutEffect, useRef, useSyncExternalStore, type RefObject } from 'react'
import { AnimationSync } from '../../animation/playback/animation-sync'
import type { PlayerState, PlayerStore } from '../../animation/playback/player-store'
import { sceneAt, type Scene } from '../../animation/timeline/scene'

/**
 * Subscribe to a slice of the player. The component re-renders only when the
 * selected value changes (compared with `isEqual`), so a HUD counter can
 * update every frame without touching the character tree.
 */
export function usePlayerValue<T>(
  store: PlayerStore,
  select: (state: PlayerState, store: PlayerStore) => T,
  isEqual: (a: T, b: T) => boolean = Object.is,
): T {
  const cache = useRef<{ value: T } | null>(null)
  const getSnapshot = () => {
    const next = select(store.getSnapshot(), store)
    if (cache.current && isEqual(cache.current.value, next)) return cache.current.value
    cache.current = { value: next }
    return next
  }
  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot)
}

/** The current scene — a new object only when `scene.key` changes. */
export function useScene(store: PlayerStore): Scene {
  return usePlayerValue(
    store,
    (state) => sceneAt(store.timeline, state.time),
    (a, b) => a.key === b.key,
  )
}

/**
 * The show clock: requestAnimationFrame drives `store.tick()` while playing.
 * Hidden tabs suspend playback so nothing runs (or drifts) in the background.
 */
export function usePlaybackClock(store: PlayerStore) {
  const status = usePlayerValue(store, (state) => state.status)

  useEffect(() => {
    if (status !== 'playing') return
    let frame = 0
    const loop = (now: number) => {
      store.tick(now)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [store, status])

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) store.suspend()
      else store.resumeFromSuspend()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [store])
}

interface SyncOptions {
  /** Reduced motion: hold each segment on a still key pose. */
  freezeAt?: number
}

/**
 * Keeps the CSS animations under `hostRef` aligned with the show clock.
 *
 *  - after every scene commit (new segment / effect mounted): collect + apply,
 *    in a layout effect, i.e. before the browser paints the new frame;
 *  - on every discontinuity (seek, pause, speed, cinematic ramp): apply;
 *  - while playing: a drift check twice per second.
 */
export function useAnimationSync(
  store: PlayerStore,
  hostRef: RefObject<HTMLElement | null>,
  sceneKey: string,
  { freezeAt }: SyncOptions = {},
) {
  const syncRef = useRef<AnimationSync | null>(null)
  const freezeRef = useRef(freezeAt)

  // Keep the latest reduced-motion setting for subscription callbacks (runs before the sync below).
  useLayoutEffect(() => {
    freezeRef.current = freezeAt
  }, [freezeAt])

  useLayoutEffect(() => {
    const host = hostRef.current
    if (!host) return
    const sync = new AnimationSync(host)
    syncRef.current = sync
    return () => {
      sync.dispose()
      syncRef.current = null
    }
  }, [hostRef])

  useLayoutEffect(() => {
    const sync = syncRef.current
    if (!sync) return
    sync.collect()
    sync.apply({ ...store.getSyncState(), freezeAt: freezeRef.current })
  }, [store, sceneKey, freezeAt])

  useEffect(() => {
    let revision = store.getSnapshot().revision
    let lastDriftCheck = 0
    return store.subscribe(() => {
      const state = store.getSnapshot()
      const sync = syncRef.current
      if (!sync) return
      if (state.revision !== revision) {
        revision = state.revision
        sync.apply({ ...store.getSyncState(), freezeAt: freezeRef.current })
        return
      }
      if (state.status === 'playing' && freezeRef.current === undefined) {
        const now = performance.now()
        if (now - lastDriftCheck > 500) {
          lastDriftCheck = now
          sync.correctDrift(state.time)
        }
      }
    })
  }, [store])
}
