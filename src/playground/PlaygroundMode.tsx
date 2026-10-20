import { useMemo, useRef, useState } from 'react'
import { css, cva, cx } from '../../styled-system/css'
import { arcadeButton } from '../../styled-system/recipes'
import { PlayerStore } from '../animation/playback/player-store'
import { KEY_POSE_MS } from '../animation/playback/reduced-motion'
import { buildTimeline } from '../animation/timeline/timeline'
import type { ActId, ChapterConfig, ChapterId } from '../animation/timeline/timeline.types'
import { BattleLayer } from '../battle/BattleLayer'
import type { Joint } from '../character/rig/joints'
import { CHARACTER_FORMS, FORM_LABEL, type CharacterForm } from '../character/rig/rig.types'
import { SHOW } from '../choreography/choreography.config'
import { FINALE_CHAPTERS } from '../finale/finale.config'
import { FinaleLayer } from '../finale/FinaleLayer'
import { ACT_LABEL } from '../hud/act-labels'
import { TimelineBar } from '../player/components/TimelineBar'
import { Transport } from '../player/components/Transport'
import { useAnimationSync, usePlaybackClock, useScene } from '../player/hooks/usePlayer'
import { useShortcuts } from '../player/hooks/useShortcuts'
import { Stage } from '../stage/components/Stage'
import { Inspector } from './Inspector'

/**
 * PLAYGROUND — every dance on its own, with the same engine as the show:
 * a PlayerStore over a one-chapter timeline (Act V keeps its four scenes
 * together, because its smoke spans them). Loop, scrub, speed, form
 * override, effects toggle and the joint inspector.
 */
const FINALE_IDS = new Set<ChapterId>(FINALE_CHAPTERS.map((c) => c.id))

function timelineFor(id: ChapterId) {
  const chapters: readonly ChapterConfig[] = FINALE_IDS.has(id) ? FINALE_CHAPTERS : SHOW.filter((c) => c.id === id)
  return buildTimeline(chapters)
}

const layout = css({
  display: 'grid',
  gridTemplateColumns: 'minmax(220px, 280px) minmax(0, 1fr)',
  gap: '14px',
  width: '100%',
  maxWidth: '1500px',
  marginInline: 'auto',
  alignItems: 'start',
  '&[data-inspect=true]': { gridTemplateColumns: 'minmax(220px, 260px) minmax(0, 1fr) minmax(260px, 340px)' },
  lgDown: { gridTemplateColumns: '1fr !important' },
})
const picker = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  maxHeight: 'calc(100dvh - 140px)',
  overflowY: 'auto',
  padding: '12px',
  bg: 'surface.panel',
  border: '3px solid token(colors.outline)',
  borderRadius: '12px',
  boxShadow: '0 0 0 2px token(colors.surface.line)',
  lgDown: { maxHeight: 'none', flexDirection: 'row', overflowX: 'auto', overflowY: 'hidden' },
})
const actGroup = css({ display: 'flex', flexDirection: 'column', gap: '6px', lgDown: { flexDirection: 'row', flexShrink: '0' } })
const actLabel = css({
  fontFamily: 'body',
  fontWeight: '700',
  fontSize: '10px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'text.muted',
  lgDown: { display: 'none' },
})
const danceButton = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    minHeight: '44px',
    padding: '6px 10px',
    textAlign: 'left',
    color: 'text',
    bg: 'ink.800',
    border: '2px solid transparent',
    borderLeft: '6px solid var(--act)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 120ms',
    _hover: { bg: 'ink.700' },
    '&[aria-pressed=true]': { bg: 'ink.700', borderColor: 'var(--act)', boxShadow: '3px 3px 0 token(colors.ink.950)' },
    lgDown: { width: 'auto', flexShrink: '0' },
    '& b': { fontFamily: 'display', fontSize: '13px', fontWeight: '400', lineHeight: '1.1' },
    '& small': { display: 'block', fontSize: '11px', color: 'text.muted', lgDown: { display: 'none' } },
    '& i': { fontFamily: 'mono', fontStyle: 'normal', fontSize: '11px', color: 'var(--act)' },
  },
  variants: {
    act: {
      prologue: { '--act': 'token(colors.cream.200)' },
      act1: { '--act': 'token(colors.lime.400)' },
      act2: { '--act': 'token(colors.cyan.400)' },
      act3: { '--act': 'token(colors.violet.400)' },
      act4: { '--act': 'token(colors.yellow.400)' },
      finalBoss: { '--act': 'token(colors.cyan.300)' },
      act5: { '--act': 'token(colors.blush.400)' },
    },
  },
})
const center = css({ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '0' })
const frame = css({
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 9',
  border: '4px solid token(colors.cream.100)',
  borderRadius: '14px',
  overflow: 'hidden',
  boxShadow: '0 0 0 4px token(colors.ink.900), 8px 8px 0 4px token(colors.ink.900)',
  smDown: { aspectRatio: '4 / 5' },
})
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
const toolbar = css({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' })
const segmentChips = css({ display: 'flex', flexWrap: 'wrap', gap: '6px' })
const segmentChip = css({
  minHeight: '34px',
  padding: '4px 10px',
  fontFamily: 'body',
  fontWeight: '700',
  fontSize: '12px',
  color: 'text',
  bg: 'ink.800',
  border: '2px solid token(colors.surface.line)',
  borderRadius: '999px',
  cursor: 'pointer',
  _hover: { borderColor: 'aura.lime' },
  '&[aria-current=true]': { bg: 'aura.lime', color: 'text.inverse', borderColor: 'outline' },
})
const select = css({
  minHeight: '36px',
  padding: '0 10px',
  fontFamily: 'body',
  fontWeight: '700',
  fontSize: '12px',
  color: 'text',
  bg: 'ink.800',
  border: '2px solid token(colors.surface.line)',
  borderRadius: '8px',
})
const label = css({ fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', color: 'text.muted', textTransform: 'uppercase' })

const ACT_ORDER: ActId[] = ['prologue', 'act1', 'act2', 'act3', 'act4', 'finalBoss', 'act5']

interface PlaygroundProps {
  reducedMotion: boolean
  initialChapter?: ChapterId
  initialInspect?: boolean
}

export function PlaygroundMode({ reducedMotion, initialChapter = 'griddySixSeven', initialInspect = false }: PlaygroundProps) {
  const [chapterId, setChapterId] = useState<ChapterId>(initialChapter)
  return (
    <PlaygroundSession
      key={FINALE_IDS.has(chapterId) ? 'finale' : chapterId}
      chapterId={chapterId}
      onChapter={setChapterId}
      reducedMotion={reducedMotion}
      initialInspect={initialInspect}
    />
  )
}

interface SessionProps {
  chapterId: ChapterId
  onChapter: (id: ChapterId) => void
  reducedMotion: boolean
  initialInspect: boolean
}

function PlaygroundSession({ chapterId, onChapter, reducedMotion, initialInspect }: SessionProps) {
  const [store] = useState(() => {
    const s = new PlayerStore(timelineFor(chapterId), { loop: true })
    const start = s.timeline.chapters.find((c) => c.config.id === chapterId)?.start ?? 0
    s.seek(start)
    s.play()
    return s
  })
  const scene = useScene(store)
  const hostRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState<CharacterForm | 'auto'>('auto')
  const [effects, setEffects] = useState(true)
  const [inspect, setInspect] = useState(initialInspect)
  const [selected, setSelected] = useState<Joint>('hips')
  const segmentIndex = scene.segment.index

  usePlaybackClock(store)
  useAnimationSync(store, hostRef, scene.key, { freezeAt: reducedMotion ? KEY_POSE_MS : undefined })

  const shortcuts = useMemo(
    () => ({
      ' ': () => store.toggle(),
      ArrowLeft: () => store.seekBy(-1000),
      ArrowRight: () => store.seekBy(1000),
      r: () => store.replay(),
      i: () => setInspect((v) => !v),
      Escape: () => setInspect(false),
    }),
    [store],
  )
  useShortcuts(shortcuts)

  const choose = (id: ChapterId) => {
    onChapter(id)
    const target = store.timeline.chapters.find((c) => c.config.id === id)
    if (target) {
      store.seek(target.start)
      store.play()
    }
  }

  return (
    <section ref={hostRef} className={layout} data-inspect={inspect ? 'true' : undefined} aria-label="Dance playground">
      <nav className={picker} aria-label="Choose a dance">
        {ACT_ORDER.map((act) => {
          const chapters = SHOW.filter((c) => c.act === act)
          if (!chapters.length) return null
          return (
            <div key={act} className={actGroup}>
              <div className={actLabel}>{ACT_LABEL[act]}</div>
              {chapters.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={danceButton({ act })}
                  aria-pressed={c.id === chapterId}
                  onClick={() => choose(c.id)}
                >
                  <i>{String(SHOW.indexOf(c) + 1).padStart(2, '0')}</i>
                  <span>
                    <b>{c.title}</b>
                    <small>{c.subtitle}</small>
                  </span>
                </button>
              ))}
            </div>
          )
        })}
      </nav>

      <div className={center}>
        <div className={frame}>
          <Stage
            ref={stageRef}
            scene={scene}
            showEffects={effects && !reducedMotion}
            formOverride={form === 'auto' ? undefined : form}
            selected={inspect ? selected : null}
            battle={<BattleLayer scene={scene} />}
            foreground={<FinaleLayer store={store} scene={scene} reduced={reducedMotion} />}
          />
        </div>
        <div className={controls}>
          <div className={segmentChips} role="group" aria-label="Segments">
            {scene.chapter.segments.map((segment) => (
              <button
                key={segment.index}
                type="button"
                className={segmentChip}
                aria-current={segment.index === segmentIndex ? 'true' : undefined}
                onClick={() => store.seek(segment.start)}
              >
                {segment.label ?? segment.move}
              </button>
            ))}
          </div>
          <TimelineBar store={store} label="Dance timeline" />
          <Transport store={store} stepLabel="scene" />
          <div className={toolbar}>
            <label className={label}>
              Form{' '}
              <select className={select} value={form} onChange={(e) => setForm(e.target.value as CharacterForm | 'auto')}>
                <option value="auto">Auto (choreography)</option>
                {CHARACTER_FORMS.map((f) => (
                  <option key={f} value={f}>
                    {FORM_LABEL[f]}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className={arcadeButton({ tone: 'ghost', size: 'sm' })} aria-pressed={effects} onClick={() => setEffects((v) => !v)}>
              ✦ EFFECTS
            </button>
            <button
              type="button"
              className={cx(arcadeButton({ tone: 'ghost', size: 'sm' }))}
              aria-pressed={inspect}
              onClick={() => setInspect((v) => !v)}
              title="Inspect the aura (I)"
            >
              ⌕ INSPECT THE AURA
            </button>
          </div>
        </div>
      </div>

      {inspect && <Inspector store={store} scene={scene} stageRef={stageRef} selected={selected} onSelect={setSelected} />}
    </section>
  )
}
