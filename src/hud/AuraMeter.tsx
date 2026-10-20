import { useMemo, type CSSProperties } from 'react'
import { css, cx } from '../../styled-system/css'
import { hudPlate } from '../../styled-system/recipes'
import type { PlayerStore } from '../animation/playback/player-store'
import { AURA_CAP, auraAt, formatAura, gaugeAt, type GaugeState } from '../animation/timeline/scoring'
import { usePlayerValue } from '../player/hooks/usePlayer'

/**
 * Aura counter + gauge. The number re-renders every frame while it rolls —
 * this tiny component is the only thing that does.
 *
 * Overflow is a visual layer AROUND a fixed-size gauge (spill, cracks, shake),
 * never a wider layout. Its animations carry `data-t0` (the moment the gauge
 * overflowed / burst) so they pause and seek with the show.
 */
const gauge = css({
  position: 'relative',
  height: '14px',
  marginTop: '4px',
  border: '2px solid token(colors.outline)',
  borderRadius: '3px',
  bg: 'ink.800',
  boxShadow: '0 0 0 1px token(colors.surface.line)',
  '&[data-state=overflow]': {
    animation: 'gaugeShake 180ms linear infinite',
  },
})
const fill = css({
  position: 'absolute',
  inset: '0',
  transformOrigin: '0 50%',
  scale: 'var(--fill) 1',
  backgroundImage:
    'linear-gradient(90deg, token(colors.bamboo.500), token(colors.lime.400) 70%, token(colors.cream.50))',
  boxShadow: '0 0 12px token(colors.lime.400)',
  '[data-state=overflow] &, [data-state=full] &': {
    backgroundImage: 'linear-gradient(90deg, token(colors.lime.400), token(colors.yellow.400), token(colors.violet.400))',
  },
})
const spill = css({
  position: 'absolute',
  top: '-6px',
  bottom: '-6px',
  left: 'calc(100% - 4px)',
  width: '34px',
  transformOrigin: '0 50%',
  scale: 'var(--spill) 1',
  borderRadius: '0 50% 50% 0',
  backgroundImage: 'radial-gradient(ellipse at 0% 50%, token(colors.yellow.300), token(colors.violet.400) 55%, transparent 72%)',
  filter: 'blur(1px)',
  pointerEvents: 'none',
})
const cracks = css({
  position: 'absolute',
  inset: '-2px',
  backgroundImage:
    'linear-gradient(115deg, transparent 30%, token(colors.ink.900) 30% 33%, transparent 33%), linear-gradient(65deg, transparent 58%, token(colors.ink.900) 58% 61%, transparent 61%), linear-gradient(140deg, transparent 78%, token(colors.ink.900) 78% 80%, transparent 80%)',
  opacity: 0,
  '[data-state=overflow] &': { opacity: 1 },
  pointerEvents: 'none',
})
const warning = css({
  fontFamily: 'display',
  fontSize: '10px',
  letterSpacing: '0.12em',
  color: 'yellow.400',
  minHeight: '12px',
  marginTop: '3px',
  '&[data-on=true]': { animation: 'captionAnnounce 1000ms linear infinite' },
})
const burstRing = css({
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: '40px',
  height: '40px',
  margin: '-20px',
  borderRadius: 'full',
  border: '6px solid token(colors.yellow.400)',
  animation: 'auraImpactRing 700ms token(easings.out) both',
  pointerEvents: 'none',
})

const WARNINGS: Record<GaugeState, string> = {
  charging: '',
  full: 'GAUGE FULL',
  overflow: '⚠ AURA OVERFLOW ⚠',
  burst: 'GAUGE DESTROYED · ∞',
}

export function AuraMeter({ store }: { store: PlayerStore }) {
  const timeline = store.timeline
  const aura = usePlayerValue(store, (state) => auraAt(timeline, state.time))
  const state = gaugeAt(timeline, store.getSnapshot().time, aura)

  // When did the gauge first overflow / burst? (Time origins for its animations.)
  const origins = useMemo(() => {
    let overflowAt: number | undefined
    let running = 0
    for (const event of timeline.events) {
      if (event.type === 'aura') {
        running += event.amount
        if (overflowAt === undefined && running > AURA_CAP * 1.02) overflowAt = event.at
      }
    }
    const burstAt = timeline.events.find((e) => e.type === 'gaugeBurst')?.at
    return { overflowAt, burstAt }
  }, [timeline])

  const plate = hudPlate({ accent: state.state === 'charging' ? 'lime' : 'gold' })
  const style = {
    '--fill': state.state === 'burst' ? 1 : state.fill,
    '--spill': Math.min(1, state.overflow / 8),
  } as CSSProperties

  return (
    <div className={plate.root}>
      <span className={plate.label}>Aura</span>
      <span className={plate.value} aria-label={`Aura ${formatAura(aura)}`}>
        {formatAura(aura)}
      </span>
      <div className={gauge} data-state={state.state} data-t0={state.state === 'overflow' ? origins.overflowAt : undefined} style={style}>
        <div className={fill} />
        {state.state === 'overflow' && <div className={spill} />}
        <div className={cracks} />
        {state.state === 'burst' && <div className={burstRing} data-t0={origins.burstAt} />}
      </div>
      <span
        className={cx(warning)}
        data-on={state.state === 'overflow' ? 'true' : undefined}
        data-t0={state.state === 'overflow' ? origins.overflowAt : undefined}
      >
        {WARNINGS[state.state]}
      </span>
    </div>
  )
}
