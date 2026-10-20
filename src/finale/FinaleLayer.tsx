import { css } from '../../styled-system/css'
import type { PlayerStore } from '../animation/playback/player-store'
import type { Scene } from '../animation/timeline/scene'
import { usePlayerValue } from '../player/hooks/usePlayer'
import { SMOKE_CHAPTERS } from './finale.config'
import { smokeOrigin } from './smoke/smoke-origin'
import { SmokeLayer, SmokeStill } from './smoke/SmokeLayer'
import { currentArgumentAt, verdictPhase } from './smoke/smoke.state'

function StillSmoke({ store, origin }: { store: PlayerStore; origin: number }) {
  const local = usePlayerValue(store, (s) => Math.round((s.time - origin) / 100) * 100)
  return <SmokeStill time={local} />
}

/**
 * Act V's foreground: the smoke, mounted ONCE across the three chapters it
 * spans so its animations are continuous over chapter boundaries.
 * Reduced motion shows the same content as a still frame.
 */
export function FinaleLayer({ store, scene, reduced }: { store: PlayerStore; scene: Scene; reduced: boolean }) {
  const origin = smokeOrigin(store.timeline)
  if (origin === null || !SMOKE_CHAPTERS.has(scene.chapter.config.id)) return null
  return reduced ? <StillSmoke store={store} origin={origin} /> : <SmokeLayer origin={origin} />
}

const srOnly = css({ srOnly: true })

/** Screen readers hear each argument once, as it condenses out of the smoke. */
export function SmokeAnnouncer({ store }: { store: PlayerStore }) {
  const origin = smokeOrigin(store.timeline)
  const message = usePlayerValue(store, (s) => {
    if (origin === null) return ''
    const t = s.time - origin
    const argument = currentArgumentAt(t)
    if (argument) return `${argument.title}. ${argument.detail}`
    const phase = verdictPhase(t)
    return phase === 'revealing' || phase === 'complete'
      ? 'Why Panda over Tailwind? Readability. Composition. Type safety. Maintainability. Panda CSS. Infinite aura.'
      : ''
  })
  return (
    <p className={srOnly} aria-live="polite">
      {message}
    </p>
  )
}
