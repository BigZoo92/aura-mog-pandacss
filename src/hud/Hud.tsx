import type { CSSProperties } from 'react'
import { css, cx } from '../../styled-system/css'
import { hudPlate } from '../../styled-system/recipes'
import type { PlayerStore } from '../animation/playback/player-store'
import type { Scene } from '../animation/timeline/scene'
import { bossHealthAt, comboAt } from '../animation/timeline/scoring'
import { FORM_LABEL } from '../character/rig/rig.types'
import { usePlayerValue } from '../player/hooks/usePlayer'
import { ACT_LABEL } from './act-labels'
import { AuraMeter } from './AuraMeter'


const hud = css({
  display: 'grid',
  gridTemplateColumns: 'minmax(150px, 1.1fr) minmax(0, 2fr) minmax(110px, 0.8fr) minmax(110px, 0.9fr)',
  gap: '10px',
  alignItems: 'stretch',
  mdDown: { gridTemplateColumns: '1fr 1fr', gap: '8px' },
})
const titleValue = css({ fontSize: 'clamp(16px, 2.4vw, 30px) !important' })
const subtitle = css({
  fontFamily: 'body',
  fontSize: '12px',
  color: 'text.muted',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})
const titlePlate = css({ mdDown: { gridColumn: '1 / -1', order: -1 } })
const comboValue = css({
  '&[data-hot=true]': { color: 'orange.400 !important' },
})

function ComboCounter({ store }: { store: PlayerStore }) {
  const combo = usePlayerValue(store, (state) => comboAt(store.timeline, state.time))
  const plate = hudPlate({ accent: combo >= 10 ? 'gold' : 'plain' })
  return (
    <div className={plate.root}>
      <span className={plate.label}>Combo</span>
      <span className={cx(plate.value, comboValue)} data-hot={combo >= 20 ? 'true' : undefined}>
        ×{combo}
      </span>
    </div>
  )
}

export function Hud({ store, scene }: { store: PlayerStore; scene: Scene }) {
  const { config } = scene.chapter
  const title = hudPlate({ accent: 'plain' })
  const form = hudPlate({
    accent: scene.form === 'gigaPandaChad' ? 'gold' : scene.form === 'auraBeast' ? 'violet' : 'lime',
  })
  return (
    <div className={hud}>
      <AuraMeter store={store} />
      <div className={cx(title.root, titlePlate)}>
        <span className={title.label}>{ACT_LABEL[config.act]}</span>
        <span className={cx(title.value, titleValue)}>{config.title}</span>
        <span className={subtitle}>{config.subtitle}</span>
      </div>
      <ComboCounter store={store} />
      <div className={form.root}>
        <span className={form.label}>Form</span>
        <span className={form.value}>{FORM_LABEL[scene.form]}</span>
      </div>
    </div>
  )
}

const bossBar = css({
  position: 'absolute',
  top: '3%',
  right: '3%',
  width: 'min(46%, 420px)',
  zIndex: 8,
  fontFamily: 'display',
  color: 'rival',
  textAlign: 'right',
  fontSize: 'clamp(11px, 1.6cqw, 18px)',
  letterSpacing: '0.06em',
  textShadow: '0 2px 0 token(colors.ink.900)',
})
const bossTrack = css({
  position: 'relative',
  height: 'clamp(10px, 1.8cqh, 18px)',
  marginTop: '4px',
  border: '3px solid token(colors.ink.900)',
  bg: 'ink.800',
  transform: 'skewX(-14deg)',
  boxShadow: '0 0 0 2px token(colors.rival)',
})
const bossFill = css({
  position: 'absolute',
  inset: '0',
  transformOrigin: '100% 50%',
  scale: 'var(--hp) 1',
  backgroundImage: 'linear-gradient(90deg, token(colors.cyan.600), token(colors.cyan.300))',
  '&[data-low=true]': { backgroundImage: 'linear-gradient(90deg, token(colors.orange.600), token(colors.orange.300))' },
})

export function BossBar({ store }: { store: PlayerStore }) {
  const hp = usePlayerValue(store, (state) => Math.round(bossHealthAt(store.timeline, state.time) * 10) / 10)
  return (
    <div className={bossBar} role="meter" aria-label="Tailwind CSS health" aria-valuemin={0} aria-valuemax={100} aria-valuenow={hp}>
      TAILWIND CSS · {Math.ceil(hp)}%
      <div className={bossTrack}>
        <div className={bossFill} data-low={hp < 30 ? 'true' : undefined} style={{ '--hp': hp / 100 } as CSSProperties} />
      </div>
    </div>
  )
}
