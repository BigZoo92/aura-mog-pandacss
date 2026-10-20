import { css, cva, cx } from '../../styled-system/css'
import type { BossPhase } from '../animation/timeline/timeline.types'

/**
 * The Tailwind CSS boss — an affectionate caricature built from CSS shapes:
 * two cyan "wind" swooshes with an angry face and a monospace name tag.
 * No logo file, no SVG. Its phase animation (enter / attack / KO) and its
 * hit flash each carry their own `data-t0`.
 */
const root = cva({
  base: {
    position: 'absolute',
    left: '76%',
    top: '44%',
    width: '0',
    height: '0',
    animationFillMode: 'both',
  },
  variants: {
    phase: {
      enter: { animation: 'bossEnter 1400ms token(easings.out) both' },
      taunt: { animation: 'bossTaunt 600ms token(easings.inOut) infinite alternate' },
      attack: { animation: 'bossAttack 720ms token(easings.out) infinite' },
      hurt: {},
      ko: { animation: 'bossKnockout 1300ms token(easings.in) 850ms both' },
      // Act V: falls back to earth at the seat position, then lies there as an armchair.
      crash: { left: 'calc(50% + 9.5em)', top: 'auto', bottom: '7%', animation: 'bossCrashLand 900ms token(easings.in) both' },
      down: { left: 'calc(50% + 9.5em)', top: 'auto', bottom: '7%' },
    },
  },
})
const float = css({
  animation: 'bossFloat 1600ms ease-in-out infinite',
  '[data-boss=crash] &, [data-boss=down] &': { animation: 'none' },
})
/** Knocked out: flattened into a cartoon pancake, resting on the floor. */
const pancake = css({
  // Mirrored so his dizzy face sticks out beside Tung Tung's legs.
  '[data-boss=crash] &, [data-boss=down] &': { translate: '0 -5.6em', scale: '-1.35 0.8', rotate: '3deg' },
})
const koOnly = css({ display: 'none', '[data-boss=crash] &, [data-boss=down] &': { display: 'block' } })
const xEye = css({
  position: 'absolute',
  top: '-6em',
  width: '2.6em',
  height: '2.6em',
  zIndex: 2,
  backgroundImage:
    'linear-gradient(45deg, transparent 42%, token(colors.ink.900) 42% 58%, transparent 58%), linear-gradient(-45deg, transparent 42%, token(colors.ink.900) 42% 58%, transparent 58%)',
  bg: 'cream.50',
  borderRadius: 'full',
  border: '0.3em solid token(colors.ink.900)',
})
const dizzy = css({
  position: 'absolute',
  left: '-3em',
  top: '-12.5em',
  width: '9em',
  height: '3em',
  animation: 'bossDizzy 1400ms linear infinite',
  '& span': {
    position: 'absolute',
    width: '1.6em',
    height: '1.6em',
    bg: 'yellow.400',
    clipPath: 'polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
  },
})
const hurt = css({
  '&[data-hurt=true]': { animation: 'bossHurt 420ms linear both' },
})
const glow = css({
  position: 'absolute',
  left: '-13em',
  top: '-11em',
  width: '26em',
  height: '22em',
  borderRadius: '50%',
  backgroundImage: 'radial-gradient(ellipse, rgba(53,216,255,0.55), transparent 65%)',
  animation: 'auraPulse 900ms ease-in-out infinite',
})
const swoosh = css({
  position: 'absolute',
  borderStyle: 'solid',
  borderColor: 'ink.900',
  borderWidth: '0.45em',
  borderRadius: '0 100% 0 100% / 0 100% 0 100%',
  backgroundImage: 'linear-gradient(135deg, token(colors.cyan.300), token(colors.cyan.400) 45%, token(colors.cyan.600))',
  boxShadow: 'inset 0.6em 0.6em 0 rgba(255,255,255,0.35)',
})
const swooshTop = css({ left: '-9em', top: '-8em', width: '12em', height: '6.4em', rotate: '-8deg' })
const swooshBottom = css({ left: '-4em', top: '-1.6em', width: '13.5em', height: '7em', rotate: '-8deg' })
const eye = css({
  position: 'absolute',
  top: '-5.7em',
  width: '2.4em',
  height: '1.6em',
  bg: 'cream.50',
  border: '0.3em solid token(colors.ink.900)',
  borderRadius: '50% 50% 45% 45%',
  backgroundImage: 'radial-gradient(circle at 50% 60%, token(colors.ink.900) 0 0.36em, transparent 0.4em)',
})
const brow = css({
  position: 'absolute',
  top: '-7em',
  width: '2.9em',
  height: '0.7em',
  bg: 'ink.900',
  borderRadius: '0.3em',
})
const mouth = css({
  position: 'absolute',
  left: '-4.6em',
  top: '-3.6em',
  width: '3.6em',
  height: '1.2em',
  borderTop: '0.38em solid token(colors.ink.900)',
  borderRadius: '50% 50% 0 0',
})
const tag = css({
  position: 'absolute',
  left: '-7em',
  top: '6.4em',
  width: '18em',
  textAlign: 'center',
  fontFamily: 'mono',
  fontWeight: '700',
  fontSize: '1.3em',
  color: 'cyan.300',
  textShadow: '0 0.1em 0 token(colors.ink.900)',
  letterSpacing: '0.04em',
  // Lengths above are in this element's em (1.3× the rig unit).
  scale: '0.77',
  transformOrigin: '50% 0',
  // The knocked-out pancake is mirrored; keep the name tag readable.
  '[data-boss=crash] &, [data-boss=down] &': { scale: '-0.77 0.95' },
})

interface TailwindBossProps {
  phase: BossPhase
  phaseT0: number
  /** Time of the hit currently flashing, if any. */
  hitAt?: number
}

export function TailwindBoss({ phase, phaseT0, hitAt }: TailwindBossProps) {
  return (
    <div className={root({ phase })} data-t0={phaseT0} data-boss={phase} aria-hidden="true">
      <div className={float}>
        <div className={cx(hurt, pancake)} data-hurt={hitAt !== undefined ? 'true' : undefined} data-t0={hitAt}>
          <div className={glow} />
          <div className={cx(swoosh, swooshBottom)} />
          <div className={cx(swoosh, swooshTop)} />
          <div className={cx(eye, css({ left: '-6.6em' }))} />
          <div className={cx(eye, css({ left: '-3.2em' }))} />
          <div className={cx(brow, css({ left: '-7em', rotate: '18deg' }))} />
          <div className={cx(brow, css({ left: '-3.3em', rotate: '-18deg' }))} />
          <div className={mouth} />
          <div className={tag}>tailwindcss</div>
          <div className={koOnly}>
            <div className={cx(xEye, css({ left: '-7em' }))} />
            <div className={cx(xEye, css({ left: '-3.6em' }))} />
          </div>
        </div>
      </div>
      <div className={cx(koOnly, dizzy)}>
        <span style={{ left: '0', top: '0.6em' }} />
        <span style={{ left: '3.6em', top: '0' }} />
        <span style={{ left: '7.2em', top: '0.8em' }} />
      </div>
    </div>
  )
}
