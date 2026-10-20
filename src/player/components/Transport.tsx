import { css } from '../../../styled-system/css'
import { arcadeButton } from '../../../styled-system/recipes'
import { SPEED_PRESETS, type PlayerStore } from '../../animation/playback/player-store'
import { usePlayerValue } from '../hooks/usePlayer'
import { formatClock } from '../format'

const bar = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '8px',
  smDown: { gap: '6px', justifyContent: 'center' },
})
const group = css({ display: 'flex', alignItems: 'center', gap: '6px' })
const clock = css({
  fontFamily: 'mono',
  fontSize: '13px',
  color: 'text.muted',
  minWidth: '92px',
  fontVariantNumeric: 'tabular-nums',
  '& b': { color: 'text' },
})
const speedGroup = css({
  display: 'flex',
  border: '2px solid token(colors.surface.line)',
  borderRadius: '10px',
  overflow: 'hidden',
  '& button': {
    minWidth: '44px',
    minHeight: '40px',
    fontFamily: 'mono',
    fontSize: '12px',
    fontWeight: '700',
    color: 'text.muted',
    bg: 'transparent',
    cursor: 'pointer',
    borderRight: '1px solid token(colors.surface.line)',
    _last: { borderRight: 'none' },
    _hover: { color: 'text', bg: 'surface.raised' },
    '&[aria-pressed=true]': { bg: 'aura.lime', color: 'text.inverse' },
  },
})
const spacer = css({ flex: '1', smDown: { display: 'none' } })

interface TransportProps {
  store: PlayerStore
  /** Labels for previous / next (chapters in the show, segments in the playground). */
  stepLabel?: string
  onFullscreen?: () => void
  fullscreenAvailable?: boolean
  isFullscreen?: boolean
}

export function Transport({ store, stepLabel = 'dance', onFullscreen, fullscreenAvailable, isFullscreen }: TransportProps) {
  const status = usePlayerValue(store, (s) => s.status)
  const userRate = usePlayerValue(store, (s) => s.userRate)
  const loop = usePlayerValue(store, (s) => s.loop)
  const seconds = usePlayerValue(store, (s) => Math.floor(s.time / 1000))
  const playing = status === 'playing'

  return (
    <div className={bar}>
      <div className={group}>
        <button type="button" className={arcadeButton({ size: 'sm' })} onClick={() => store.prevChapter()} aria-label={`Previous ${stepLabel}`}>
          ⏮
        </button>
        <button
          type="button"
          className={arcadeButton({ tone: 'lime', shape: 'round' })}
          onClick={() => store.toggle()}
          aria-label={playing ? 'Pause' : status === 'paused' ? 'Resume' : 'Play'}
        >
          {playing ? '❚❚' : '▶'}
        </button>
        <button type="button" className={arcadeButton({ size: 'sm' })} onClick={() => store.nextChapter()} aria-label={`Next ${stepLabel}`}>
          ⏭
        </button>
        <button type="button" className={arcadeButton({ size: 'sm' })} onClick={() => store.replay()} aria-label="Replay from the beginning">
          ⟲
        </button>
      </div>
      <div className={clock} aria-live="off">
        <b>{formatClock(seconds * 1000)}</b> / {formatClock(store.timeline.duration)}
      </div>
      <div className={spacer} />
      <div className={speedGroup} role="group" aria-label="Playback speed">
        {SPEED_PRESETS.map((rate) => (
          <button key={rate} type="button" aria-pressed={userRate === rate} onClick={() => store.setRate(rate)}>
            {rate}×
          </button>
        ))}
      </div>
      <div className={group}>
        <button
          type="button"
          className={arcadeButton({ tone: 'ghost', size: 'sm' })}
          aria-pressed={loop}
          onClick={() => store.setLoop(!loop)}
          aria-label="Loop"
          title="Loop"
        >
          ↻ LOOP
        </button>
        {fullscreenAvailable && (
          <button
            type="button"
            className={arcadeButton({ tone: 'ghost', size: 'sm' })}
            onClick={onFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            title="Fullscreen (F)"
          >
            ⛶
          </button>
        )}
      </div>
    </div>
  )
}
