import { useState } from 'react'
import { css } from '../../styled-system/css'
import { arcadeButton } from '../../styled-system/recipes'
import type { ChapterId } from '../animation/timeline/timeline.types'
import { SHOW } from '../choreography/choreography.config'
import { ShowMode } from '../player/components/ShowMode'
import { PlaygroundMode } from '../playground/PlaygroundMode'
import { usePrefersReducedMotion } from '../player/hooks/useMediaPreferences'

type Mode = 'show' | 'playground'

const params = new URLSearchParams(window.location.search)

const shell = css({
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  padding: '12px clamp(12px, 2.4vw, 28px) 20px',
  backgroundImage:
    'linear-gradient(rgba(168,224,95,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(168,224,95,0.05) 1px, transparent 1px)',
  backgroundSize: '32px 32px',
})
const header = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '12px 20px',
  smDown: { gap: '8px' },
  maxWidth: '1400px',
  width: '100%',
  marginInline: 'auto',
})
const logo = css({
  display: 'flex',
  flexDirection: 'column',
  lineHeight: '0.9',
  marginRight: 'auto',
})
const logoTitle = css({
  fontFamily: 'display',
  fontSize: 'clamp(22px, 3vw, 34px)',
  color: 'aura.lime',
  WebkitTextStroke: '0.05em token(colors.ink.900)',
  paintOrder: 'stroke fill',
  textShadow: '3px 3px 0 token(colors.violet.600)',
  letterSpacing: '0.02em',
})
const tagline = css({
  fontFamily: 'body',
  fontWeight: '700',
  fontSize: '12px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'text.muted',
  marginTop: '6px',
  smDown: { display: 'none' },
})
const modeSwitch = css({
  display: 'flex',
  padding: '4px',
  gap: '4px',
  bg: 'surface.panel',
  border: '3px solid token(colors.outline)',
  borderRadius: '12px',
  boxShadow: '0 0 0 2px token(colors.surface.line)',
})
const modeTab = css({
  minHeight: '40px',
  px: '14px',
  smDown: { px: '10px', fontSize: '11px' },
  fontFamily: 'display',
  fontSize: '13px',
  color: 'text.muted',
  borderRadius: '8px',
  cursor: 'pointer',
  _hover: { color: 'text' },
  '&[aria-selected=true]': { bg: 'aura.lime', color: 'text.inverse' },
})
const toggles = css({ display: 'flex', gap: '8px', flexWrap: 'wrap' })
const footer = css({
  maxWidth: '1400px',
  width: '100%',
  marginInline: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: '8px',
  fontSize: '12px',
  color: 'text.muted',
  '& strong': { color: 'aura.lime', fontFamily: 'display', fontWeight: '400' },
})

export function App() {
  const prefersReduced = usePrefersReducedMotion()
  // Deep links: ?mode=playground&dance=sixSevenTwerky&inspect
  const [mode, setMode] = useState<Mode>(() => (params.get('mode') === 'playground' ? 'playground' : 'show'))
  const [playground, setPlayground] = useState<{ chapter: ChapterId; inspect: boolean }>(() => ({
    chapter: SHOW.some((c) => c.id === params.get('dance')) ? (params.get('dance') as ChapterId) : 'griddySixSeven',
    inspect: params.has('inspect'),
  }))
  const openPlayground = (chapter: ChapterId, inspect: boolean) => {
    setPlayground({ chapter, inspect })
    setMode('playground')
    window.scrollTo({ top: 0 })
  }
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null)
  const [calm, setCalm] = useState(false)
  const reducedMotion = motionOverride ?? prefersReduced

  return (
    <div className={shell} data-effects={calm || reducedMotion ? 'calm' : 'full'}>
      <header className={header}>
        <div className={logo}>
          <span className={logoTitle}>AURA BATTLE</span>
          <span className={tagline}>One panda. Infinite aura. Zero Tailwind.</span>
        </div>
        <div className={modeSwitch} role="tablist" aria-label="Experience mode">
          {(['show', 'playground'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              className={modeTab}
              onClick={() => setMode(m)}
            >
              {m === 'show' ? 'SHOW MODE' : 'PLAYGROUND'}
            </button>
          ))}
        </div>
        <div className={toggles}>
          <button
            type="button"
            className={arcadeButton({ tone: 'ghost', size: 'sm' })}
            aria-pressed={calm}
            onClick={() => setCalm((v) => !v)}
            title="Disable flashes, shakes and camera moves"
          >
            CALM FX
          </button>
          <button
            type="button"
            className={arcadeButton({ tone: 'ghost', size: 'sm' })}
            aria-pressed={reducedMotion}
            onClick={() => setMotionOverride(!reducedMotion)}
            title="Still key poses instead of continuous motion"
          >
            REDUCED MOTION
          </button>
        </div>
      </header>

      <main>
        {mode === 'show' ? (
          <ShowMode
            reducedMotion={reducedMotion}
            onExplore={() => openPlayground('griddySixSeven', false)}
            onInspect={() => openPlayground('sixSevenTwerky', true)}
          />
        ) : (
          <PlaygroundMode
            key={`${playground.chapter}-${playground.inspect}`}
            reducedMotion={reducedMotion}
            initialChapter={playground.chapter}
            initialInspect={playground.inspect}
          />
        )}
      </main>

      <footer className={footer}>
        <span>
          Every pixel of Tung Tung (and his onesie) is CSS. Choreography compiled by <strong>Panda CSS</strong>.
        </span>
        <span>Performance claims require benchmarks. The aura is fictional.</span>
      </footer>
    </div>
  )
}
