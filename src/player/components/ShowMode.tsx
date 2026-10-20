import { useMemo, useRef, useState } from 'react'
import { css, cx } from '../../../styled-system/css'
import { arcadeButton } from '../../../styled-system/recipes'
import { PlayerStore } from '../../animation/playback/player-store'
import { KEY_POSE_MS } from '../../animation/playback/reduced-motion'
import { SHOW_TIMELINE } from '../../choreography/choreography.config'
import { BossBar, Hud } from '../../hud/Hud'
import { Stage } from '../../stage/components/Stage'
import { BattleLayer } from '../../battle/BattleLayer'
import { AuraKingCard } from '../../finale/AuraKingCard'
import { CARD_DELAY } from '../../finale/finale.config'
import { FinaleLayer, SmokeAnnouncer } from '../../finale/FinaleLayer'
import { useAnimationSync, usePlaybackClock, usePlayerValue, useScene } from '../hooks/usePlayer'
import { useFullscreen } from '../hooks/useMediaPreferences'
import { useShortcuts } from '../hooks/useShortcuts'
import { TimelineBar } from './TimelineBar'
import { Transport } from './Transport'


const layout = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
  maxWidth: '1400px',
  marginInline: 'auto',
})
const frame = css({
  position: 'relative',
  width: 'min(100%, calc((100dvh - 350px) * 16 / 9))',
  minWidth: 'min(100%, 560px)',
  aspectRatio: '16 / 9',
  // Overlays (final card) size themselves in container units of the frame.
  containerType: 'size',
  marginInline: 'auto',
  border: '4px solid token(colors.cream.100)',
  borderRadius: '14px',
  overflow: 'hidden',
  boxShadow: '0 0 0 4px token(colors.ink.900), 10px 10px 0 4px token(colors.ink.900), 0 0 60px rgba(200,255,77,0.12)',
  bg: 'ink.900',
  smDown: { aspectRatio: '4 / 5', width: '100%', minWidth: '0', borderWidth: '3px', borderRadius: '10px' },
  '&:fullscreen': { width: '100vw', height: '100vh', aspectRatio: 'auto', border: 'none', borderRadius: '0' },
})
const chip = css({
  position: 'absolute',
  left: '12px',
  top: '10px',
  zIndex: 8,
  display: 'flex',
  gap: '6px',
  alignItems: 'center',
  padding: '3px 8px',
  fontFamily: 'mono',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.12em',
  color: 'cream.100',
  bg: 'rgba(8,8,11,0.7)',
  borderRadius: '4px',
  pointerEvents: 'none',
  '& i': { width: '8px', height: '8px', borderRadius: 'full', bg: 'orange.400' },
  '&[data-live=true] i': { bg: 'lime.400', boxShadow: '0 0 8px token(colors.lime.400)' },
})
const overlay = css({
  position: 'absolute',
  inset: '0',
  zIndex: 9,
  display: 'grid',
  placeItems: 'center',
  alignContent: 'center',
  gap: '18px',
  padding: '24px',
  textAlign: 'center',
  bg: 'rgba(8,8,11,0.55)',
  backdropFilter: 'blur(2px)',
})
const overlayTitle = css({
  fontFamily: 'display',
  fontSize: 'clamp(28px, 6cqw, 84px)',
  lineHeight: '0.9',
  color: 'aura.lime',
  WebkitTextStroke: '0.06em token(colors.ink.900)',
  paintOrder: 'stroke fill',
  textShadow: '0.06em 0.06em 0 token(colors.ink.900)',
  '& small': { display: 'block', fontSize: '0.36em', color: 'cream.100', marginTop: '0.4em' },
})
const hint = css({ fontFamily: 'mono', fontSize: '12px', color: 'cream.200', '& kbd': { color: 'aura.lime' } })
const controls = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '14px 16px',
  bg: 'surface.panel',
  border: '3px solid token(colors.outline)',
  borderRadius: '12px',
  boxShadow: '0 0 0 2px token(colors.surface.line)',
})
const srOnly = css({ srOnly: true })
/** Phones: the stage comes first, then the controls, then the HUD. */
const hudSlot = css({ smDown: { order: 3 } })
const controlsSlot = css({ smDown: { order: 2 } })
const frameSlot = css({ smDown: { order: 1 } })

interface ShowModeProps {
  reducedMotion: boolean
  /** Final-card actions: open the playground, optionally with the inspector. */
  onExplore: () => void
  onInspect: () => void
}

/**
 * QA / sharing helper: `?seek=finalPuff:6200` (chapter id + ms) or `?seek=95000`
 * opens the show paused at that exact moment.
 */
function initialSeek(store: PlayerStore) {
  const value = new URLSearchParams(window.location.search).get('seek')
  if (!value) return
  const [id, offset = '0'] = value.split(':')
  const chapter = store.timeline.chapters.find((c) => c.config.id === id)
  const time = chapter ? chapter.start + Number(offset) : Number(value)
  if (Number.isFinite(time)) store.seek(time)
}

export function ShowMode({ reducedMotion, onExplore, onInspect }: ShowModeProps) {
  const [store] = useState(() => {
    const s = new PlayerStore(SHOW_TIMELINE)
    initialSeek(s)
    return s
  })
  const scene = useScene(store)
  const hostRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const status = usePlayerValue(store, (s) => s.status)
  const fullscreen = useFullscreen(frameRef)
  const cardAt = useMemo(() => {
    const king = store.timeline.chapters.find((c) => c.config.id === 'auraKing')
    return king ? king.start + CARD_DELAY : Number.POSITIVE_INFINITY
  }, [store])
  const showCard = usePlayerValue(store, (s) => s.time >= cardAt)

  usePlaybackClock(store)
  useAnimationSync(store, hostRef, scene.key, { freezeAt: reducedMotion ? KEY_POSE_MS : undefined })

  const shortcuts = useMemo(
    () => ({
      ' ': () => store.toggle(),
      ArrowLeft: () => store.seekBy(-5000),
      ArrowRight: () => store.seekBy(5000),
      r: () => store.replay(),
      l: () => store.setLoop(!store.getSnapshot().loop),
      f: () => fullscreen.toggle(),
      n: () => store.nextChapter(),
      p: () => store.prevChapter(),
    }),
    [store, fullscreen],
  )
  useShortcuts(shortcuts)

  const { config } = scene.chapter
  return (
    <section ref={hostRef} className={layout} aria-label="Aura Battle show">
      <div className={hudSlot}>
        <Hud store={store} scene={scene} />
      </div>
      <div ref={frameRef} className={cx(frame, frameSlot)}>
        <Stage
          scene={scene}
          showEffects={!reducedMotion}
          battle={<BattleLayer scene={scene} />}
          foreground={<FinaleLayer store={store} scene={scene} reduced={reducedMotion} />}
        />
        <div className={chip} data-live={status === 'playing' ? 'true' : undefined} aria-hidden="true">
          <i />
          CH {String(scene.chapter.index + 1).padStart(2, '0')}/{String(store.timeline.chapters.length).padStart(2, '0')}
        </div>
        {(config.bossBar ?? config.boss) && <BossBar store={store} />}
        {showCard && <AuraKingCard t0={cardAt} onReplay={() => store.replay()} onExplore={onExplore} onInspect={onInspect} />}
        {status === 'idle' && (
          <div className={overlay}>
            <div className={overlayTitle}>
              AURA BATTLE
              <small>Tung Tung Tung CSSHUR (in a panda onesie) vs. the utility-class menace</small>
            </div>
            <button type="button" className={arcadeButton({ tone: 'lime', size: 'lg' })} onClick={() => store.play()} autoFocus>
              ▶ START AURA FARMING
            </button>
            <p className={hint}>
              <kbd>Space</kbd> play/pause · <kbd>← →</kbd> seek · <kbd>R</kbd> replay · <kbd>F</kbd> fullscreen
            </p>
          </div>
        )}
      </div>
      <div className={cx(controls, controlsSlot)}>
        <TimelineBar store={store} />
        <Transport
          store={store}
          onFullscreen={fullscreen.toggle}
          fullscreenAvailable={fullscreen.available}
          isFullscreen={fullscreen.isFullscreen}
        />
      </div>
      <p className={srOnly} aria-live="polite">
        {`Chapter ${scene.chapter.index + 1}: ${config.title}. ${config.subtitle}`}
      </p>
      <SmokeAnnouncer store={store} />
    </section>
  )
}
