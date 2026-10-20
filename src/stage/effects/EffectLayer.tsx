import type { CSSProperties } from 'react'
import { css, cva, cx } from '../../../styled-system/css'
import type { WindowedEvent } from '../../animation/timeline/scene'
import type { EffectKind } from '../../animation/timeline/timeline.types'
import { TONE_VAR } from './tones'

/**
 * The effects vocabulary: a dozen reusable CSS-only effects, positioned and
 * timed by timeline events. Each instance carries `data-t0` = its event time,
 * so the playback adapter pauses/seeks it with everything else.
 */

type EffectEvent = WindowedEvent & { type: 'effect' }


/** Effects drawn behind Tung Tung; everything else is drawn in front. */
const BACK_EFFECTS = new Set<EffectKind>(['beams', 'auraFlames', 'shockwave'])
/** Full-frame effects ignore x / y. */
const FULL_FRAME = new Set<EffectKind>(['speedLines', 'flash', 'invert', 'actionLines', 'beams'])

const effect = cva({
  base: {
    position: 'absolute',
    pointerEvents: 'none',
    animationDuration: 'var(--dur)',
    animationFillMode: 'both',
    animationTimingFunction: 'token(easings.out)',
  },
  variants: {
    kind: {
      impactRing: {
        width: 'var(--size)',
        height: 'var(--size)',
        margin: 'calc(var(--size) / -2) 0 0 calc(var(--size) / -2)',
        borderRadius: 'full',
        borderStyle: 'solid',
        borderColor: 'var(--tone)',
        boxShadow: '0 0 0 0.3em token(colors.ink.900), inset 0 0 0 0.3em token(colors.ink.900)',
        animationName: 'auraImpactRing',
      },
      burst: {
        width: 'var(--size)',
        height: 'var(--size)',
        margin: 'calc(var(--size) / -2) 0 0 calc(var(--size) / -2)',
        bg: 'var(--tone)',
        clipPath:
          'polygon(50% 0, 58% 32%, 85% 10%, 68% 40%, 100% 45%, 70% 58%, 92% 85%, 60% 70%, 52% 100%, 42% 68%, 12% 90%, 30% 58%, 0 50%, 30% 40%, 10% 12%, 42% 30%)',
        filter: 'drop-shadow(0 0 0.4em var(--tone))',
        animationName: 'auraBurst',
      },
      speedLines: {
        inset: '0',
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent 0 1.6em, rgba(255,253,246,0.85) 1.6em 1.75em, transparent 1.75em 3.1em, var(--tone) 3.1em 3.2em)',
        backgroundSize: '60em 100%',
        maskImage: 'linear-gradient(90deg, black, transparent 35%, transparent 65%, black)',
        animationName: 'speedLinesRush',
        animationTimingFunction: 'linear',
      },
      sparks: { width: '0', height: '0' },
      smoke: { width: '0', height: '0' },
      shockwave: {
        width: 'var(--size)',
        height: 'var(--size)',
        margin: 'calc(var(--size) / -2) 0 0 calc(var(--size) / -2)',
        borderRadius: 'full',
        backgroundImage:
          'radial-gradient(circle, transparent 52%, var(--tone) 58%, rgba(255,255,255,0.9) 62%, transparent 70%)',
        animationName: 'shockwaveExpand',
      },
      flash: { inset: '0', bg: 'var(--tone)', animationName: 'flashFade', zIndex: 5 },
      invert: { inset: '0', backdropFilter: 'invert(1) hue-rotate(180deg)', animationName: 'invertFlash', zIndex: 5 },
      beams: {
        inset: '-40%',
        backgroundImage: 'repeating-conic-gradient(from 0deg at 50% 50%, var(--tone) 0 6deg, transparent 6deg 15deg)',
        maskImage: 'radial-gradient(circle at 50% 50%, black 5%, transparent 55%)',
        mixBlendMode: 'screen',
        animationName: 'beamsSpin',
        animationTimingFunction: 'linear',
      },
      auraFlames: { width: '0', height: '0' },
      actionLines: {
        inset: '-10%',
        backgroundImage:
          'repeating-conic-gradient(from 0deg at 50% 48%, token(colors.ink.900) 0 0.8deg, transparent 0.8deg 7deg)',
        maskImage: 'radial-gradient(circle at 50% 48%, transparent 30%, black 62%)',
        animationName: 'actionLinesPulse',
      },
      snap: {
        width: 'var(--size)',
        height: 'var(--size)',
        margin: 'calc(var(--size) / -2) 0 0 calc(var(--size) / -2)',
        bg: 'var(--tone)',
        clipPath: 'polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%)',
        animationName: 'snapPop',
      },
      silhouette: { display: 'none' },
    },
  },
})

const particle = css({
  position: 'absolute',
  animationDuration: 'var(--dur)',
  animationFillMode: 'both',
  animationTimingFunction: 'token(easings.out)',
})
const spark = css({
  width: '1.1em',
  height: '1.1em',
  margin: '-0.55em',
  bg: 'var(--tone)',
  clipPath: 'polygon(50% 0, 64% 36%, 100% 50%, 64% 64%, 50% 100%, 36% 64%, 0 50%, 36% 36%)',
  animationName: 'sparkRise',
})
const puff = css({
  width: '4em',
  height: '4em',
  margin: '-2em',
  borderRadius: 'full',
  bg: 'cream.50',
  border: '0.3em solid token(colors.ink.900)',
  animationName: 'smokePuff',
})
const flame = css({
  bottom: '0',
  width: '6em',
  height: '14em',
  marginLeft: '-3em',
  borderRadius: '50% 50% 40% 40% / 70% 70% 30% 30%',
  backgroundImage: 'linear-gradient(to top, var(--tone), rgba(255,255,255,0.85) 55%, transparent 90%)',
  transformOrigin: '50% 100%',
  mixBlendMode: 'screen',
  opacity: 0.9,
  animationName: 'auraFlameFlicker',
  animationDuration: '420ms',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'ease-in-out',
})

const SPARKS = [
  { x: -6, y: -2, dx: '-3em', delay: 0 },
  { x: 5, y: -4, dx: '2em', delay: 60 },
  { x: -2, y: -8, dx: '-1em', delay: 120 },
  { x: 7, y: 1, dx: '4em', delay: 40 },
  { x: -8, y: 3, dx: '-4em', delay: 180 },
  { x: 2, y: -11, dx: '1.5em', delay: 90 },
  { x: -4, y: 5, dx: '-2em', delay: 220 },
  { x: 9, y: -7, dx: '3em', delay: 150 },
]
const PUFFS = [
  { x: -5, y: 0, delay: 0 },
  { x: 4, y: -1, delay: 40 },
  { x: -1, y: -3, delay: 80 },
  { x: 7, y: 1, delay: 120 },
  { x: -8, y: 1, delay: 60 },
]
const FLAMES = [-9, -5.5, -2, 2, 5.5, 9]

type StyleVars = CSSProperties & Record<`--${string}`, string>

function EffectInstance({ event }: { event: EffectEvent }) {
  const full = FULL_FRAME.has(event.effect)
  const style: StyleVars = {
    '--dur': `${event.duration}ms`,
    '--tone': TONE_VAR[event.tone ?? 'white'],
    '--size': `${event.size ?? 12}em`,
    ...(full ? {} : { left: `${event.x ?? 50}%`, top: `${event.y ?? 52}%` }),
  }

  if (event.effect === 'sparks' || event.effect === 'smoke' || event.effect === 'auraFlames') {
    return (
      <div data-t0={event.at} data-effect={event.effect} className={effect({ kind: event.effect })} style={style}>
        {event.effect === 'sparks' &&
          SPARKS.map((s) => (
            <span
              key={`${s.x}${s.y}`}
              className={cx(particle, spark)}
              style={{ left: `${s.x}em`, top: `${s.y}em`, animationDelay: `${s.delay}ms`, '--dx': s.dx } as StyleVars}
            />
          ))}
        {event.effect === 'smoke' &&
          PUFFS.map((p) => (
            <span
              key={`${p.x}${p.y}`}
              className={cx(particle, puff)}
              style={{ left: `${p.x}em`, top: `${p.y}em`, animationDelay: `${p.delay}ms` }}
            />
          ))}
        {event.effect === 'auraFlames' &&
          FLAMES.map((x, i) => (
            <span
              key={x}
              className={cx(particle, flame)}
              style={{ left: `${x}em`, height: `${12 + (i % 3) * 3}em`, animationDelay: `${-i * 70}ms` }}
            />
          ))}
      </div>
    )
  }

  return <div data-t0={event.at} data-effect={event.effect} className={effect({ kind: event.effect })} style={style} />
}

const layer = css({ position: 'absolute', inset: '0', pointerEvents: 'none', _calmEffects: { display: 'none' } })

export function EffectLayer({ active, plane }: { active: readonly WindowedEvent[]; plane: 'back' | 'front' }) {
  const effects = active.filter(
    (event): event is EffectEvent =>
      event.type === 'effect' && BACK_EFFECTS.has(event.effect) === (plane === 'back'),
  )
  return (
    <div className={layer}>
      {effects.map((event) => (
        <EffectInstance key={event.id} event={event} />
      ))}
    </div>
  )
}
