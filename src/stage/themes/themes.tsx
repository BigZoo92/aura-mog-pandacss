import type { CSSProperties, ReactNode } from 'react'
import { css, cva, cx } from '../../../styled-system/css'
import type { StageTheme } from '../../animation/timeline/timeline.types'

/**
 * Stage themes: one backdrop recipe (lighting + floor colour through CSS
 * variables) plus a little CSS-only decor per theme. Decor animations run on
 * the chapter's time origin, so they pause, seek and replay with the show.
 */
const backdrop = cva({
  base: {
    position: 'absolute',
    inset: '0',
    overflow: 'hidden',
    '--floor': 'token(colors.bamboo.600)',
    '--floor-line': 'rgba(16,16,20,0.35)',
    '--horizon': '72%',
    transition: 'background 300ms',
  },
  variants: {
    theme: {
      dojo: {
        bg: 'lime.400',
        backgroundImage:
          'radial-gradient(circle at 50% 42%, token(colors.cream.100) 0 12%, token(colors.lime.400) 38%, token(colors.bamboo.500) 80%)',
      },
      retro: {
        '--floor': 'token(colors.violet.600)',
        bg: 'cyan.300',
        backgroundImage:
          'radial-gradient(circle at 50% 40%, token(colors.yellow.300) 0 14%, transparent 15%), linear-gradient(160deg, token(colors.cyan.400), token(colors.violet.300) 70%)',
      },
      citrus: {
        '--floor': 'token(colors.orange.600)',
        bg: 'orange.300',
        backgroundImage:
          'repeating-conic-gradient(from 0deg at 50% 45%, token(colors.orange.400) 0 10deg, token(colors.yellow.400) 10deg 20deg), radial-gradient(circle at 50% 45%, token(colors.yellow.300), token(colors.orange.400))',
        backgroundBlendMode: 'soft-light',
      },
      disco: {
        '--floor': 'token(colors.violet.900)',
        '--floor-line': 'rgba(200,255,77,0.5)',
        bg: 'violet.900',
        backgroundImage:
          'radial-gradient(ellipse 70% 60% at 50% 35%, token(colors.violet.600), token(colors.violet.900) 70%, token(colors.ink.950))',
      },
      gangnam: {
        '--floor': 'token(colors.ink.800)',
        '--floor-line': 'rgba(255,228,83,0.55)',
        bg: 'blush.400',
        backgroundImage:
          'radial-gradient(circle at 50% 40%, token(colors.yellow.300), token(colors.blush.400) 45%, token(colors.violet.400) 100%)',
      },
      urban: {
        '--floor': 'token(colors.ink.700)',
        '--floor-line': 'rgba(255,228,83,0.22)',
        bg: 'ink.800',
        backgroundImage:
          'linear-gradient(to bottom, token(colors.ink.900) 0 10%, #3b2a2a 60%, #2a1e1e 72%)',
      },
      abyss: {
        '--floor': '#0b3d55',
        '--floor-line': 'rgba(139,235,255,0.25)',
        bg: 'cyan.900',
        backgroundImage:
          'linear-gradient(to bottom, token(colors.cyan.600) 0%, #0b4a6b 45%, token(colors.cyan.900) 100%)',
      },
      impact: {
        '--floor': 'token(colors.ink.900)',
        '--floor-line': 'rgba(255,255,255,0.3)',
        bg: 'cream.50',
        backgroundImage:
          'repeating-conic-gradient(from 0deg at 50% 42%, token(colors.ink.900) 0 1.2deg, transparent 1.2deg 9deg), radial-gradient(circle at 50% 42%, token(colors.cream.50) 0 22%, token(colors.yellow.300) 60%)',
      },
      violet: {
        '--floor': 'token(colors.violet.900)',
        '--floor-line': 'rgba(183,150,255,0.7)',
        bg: 'violet.900',
        backgroundImage:
          'radial-gradient(ellipse 80% 60% at 50% 45%, token(colors.violet.400), token(colors.violet.900) 70%), linear-gradient(to bottom, token(colors.ink.950), transparent)',
      },
      mythic: {
        '--floor': '#3a0d2e',
        '--floor-line': 'rgba(255,158,181,0.5)',
        bg: '#5b1048',
        backgroundImage:
          'radial-gradient(ellipse 70% 60% at 50% 55%, token(colors.orange.400), #b0136f 45%, #2a0620 100%)',
      },
      golden: {
        '--floor': '#3a2a05',
        '--floor-line': 'rgba(255,228,83,0.4)',
        bg: 'ink.900',
        backgroundImage:
          'radial-gradient(circle at 50% 38%, token(colors.yellow.300) 0 6%, token(colors.yellow.600) 22%, #5a3a00 50%, token(colors.ink.950) 85%)',
      },
      domain: {
        '--floor': 'token(colors.ink.950)',
        '--floor-line': 'rgba(138,85,255,0.6)',
        bg: 'ink.950',
        backgroundImage:
          'radial-gradient(circle at 50% 42%, token(colors.violet.600) 0 10%, token(colors.violet.900) 32%, token(colors.ink.950) 70%)',
      },
      boss: {
        '--floor': 'token(colors.cyan.900)',
        '--floor-line': 'rgba(53,216,255,0.55)',
        bg: 'cyan.900',
        backgroundImage:
          'radial-gradient(ellipse 80% 70% at 70% 35%, rgba(53,216,255,0.45), transparent 60%), linear-gradient(to bottom, token(colors.ink.950), token(colors.cyan.900))',
      },
      aftermath: {
        '--floor': '#1d1630',
        '--floor-line': 'rgba(183,150,255,0.18)',
        bg: '#1a1426',
        backgroundImage:
          'radial-gradient(ellipse 70% 55% at 55% 70%, rgba(255,158,181,0.22), transparent 70%), linear-gradient(to bottom, #0d0a16, #2a1d3d 60%, #3b2448 72%)',
      },
      lounge: {
        '--floor': '#24132a',
        '--floor-line': 'rgba(255,158,181,0.16)',
        bg: '#1b0f22',
        backgroundImage:
          'radial-gradient(ellipse 34% 60% at 58% 48%, rgba(255,214,170,0.28), transparent 70%), radial-gradient(ellipse 90% 70% at 50% 40%, #3a1d44, #170b1d 75%)',
      },
      victory: {
        '--floor': 'token(colors.bamboo.700)',
        bg: 'yellow.400',
        backgroundImage:
          'repeating-conic-gradient(from 0deg at 50% 45%, rgba(255,255,255,0.45) 0 8deg, transparent 8deg 20deg), radial-gradient(circle at 50% 45%, token(colors.cream.50), token(colors.yellow.400) 40%, token(colors.lime.400) 100%)',
      },
    },
  },
})

const floor = css({
  position: 'absolute',
  left: '-50%',
  right: '-50%',
  top: 'var(--horizon)',
  bottom: '-40%',
  bg: 'var(--floor)',
  backgroundImage:
    'repeating-linear-gradient(90deg, var(--floor-line) 0 0.12em, transparent 0.12em 6em), repeating-linear-gradient(0deg, var(--floor-line) 0 0.12em, transparent 0.12em 6em)',
  transformOrigin: '50% 0',
  transform: 'perspective(30em) rotateX(62deg)',
  _after: {
    content: '""',
    position: 'absolute',
    inset: '0',
    backgroundImage: 'linear-gradient(to bottom, rgba(8,8,11,0.55), transparent 40%)',
  },
})
const floorMoving = css({ animation: 'floorScroll 1000ms linear infinite' })

const halftone = css({
  position: 'absolute',
  inset: '0',
  backgroundImage: 'radial-gradient(rgba(16,16,20,0.16) 22%, transparent 24%)',
  backgroundSize: '1.1em 1.1em',
  maskImage: 'radial-gradient(ellipse 60% 55% at 50% 42%, transparent 40%, black 90%)',
  pointerEvents: 'none',
})

// --- decor primitives -------------------------------------------------------

const stalkDecor = css({
  position: 'absolute',
  bottom: '20%',
  width: '2.4em',
  height: '80%',
  bg: 'bamboo.600',
  border: '0.3em solid token(colors.ink.900)',
  borderRadius: '0.6em',
  backgroundImage:
    'repeating-linear-gradient(to bottom, transparent 0 5.4em, token(colors.bamboo.800) 5.4em 6em), linear-gradient(90deg, rgba(255,255,255,0.25) 0 30%, transparent 30%)',
  opacity: 0.9,
})

const discoBall = css({
  position: 'absolute',
  left: 'calc(50% - 3.4em)',
  top: '2%',
  width: '6.8em',
  height: '6.8em',
  borderRadius: 'full',
  border: '0.3em solid token(colors.ink.900)',
  backgroundColor: 'ink.400',
  backgroundImage:
    'radial-gradient(circle at 32% 30%, rgba(255,255,255,0.95) 0 8%, transparent 26%), repeating-linear-gradient(90deg, rgba(255,255,255,0.55) 0 0.5em, rgba(16,16,20,0.35) 0.5em 0.62em, transparent 0.62em 1.2em), repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0 0.5em, rgba(16,16,20,0.35) 0.5em 0.62em, transparent 0.62em 1.2em)',
  boxShadow: '0 0 3em token(colors.violet.300), inset -1em -1em 2em rgba(16,16,20,0.5)',
  animation: 'discoBallSpin 1200ms linear infinite',
  _before: {
    content: '""',
    position: 'absolute',
    left: 'calc(50% - 0.15em)',
    bottom: '100%',
    width: '0.3em',
    height: '20em',
    bg: 'ink.900',
  },
})
const discoBeam = css({
  position: 'absolute',
  left: '50%',
  top: '8%',
  width: '7em',
  height: '120%',
  marginLeft: '-3.5em',
  transformOrigin: '50% 0',
  backgroundImage: 'linear-gradient(to bottom, var(--beam), transparent 85%)',
  clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0 100%)',
  mixBlendMode: 'screen',
  opacity: 0.55,
  animation: 'discoBeamSweep 2000ms ease-in-out infinite',
})
const twinkles = css({
  position: 'absolute',
  inset: '0',
  backgroundImage:
    'radial-gradient(circle, token(colors.cream.50) 0 0.12em, transparent 0.14em), radial-gradient(circle, token(colors.lime.400) 0 0.1em, transparent 0.12em)',
  backgroundSize: '5.3em 4.1em, 7.7em 6.3em',
  backgroundPosition: '0 0, 2.4em 1.7em',
  animation: 'dotsTwinkle 1000ms steps(2) infinite',
})

const memphis = css({
  position: 'absolute',
  inset: '0',
  backgroundImage:
    'radial-gradient(circle at 12% 22%, token(colors.yellow.400) 0 1.6em, transparent 1.7em), radial-gradient(circle at 86% 30%, token(colors.orange.400) 0 1.2em, transparent 1.3em), linear-gradient(45deg, transparent 47%, token(colors.ink.900) 47% 53%, transparent 53%), repeating-linear-gradient(-45deg, rgba(16,16,20,0.18) 0 0.35em, transparent 0.35em 1.2em)',
  backgroundSize: '100% 100%, 100% 100%, 4em 4em, 100% 100%',
  backgroundPosition: '0 0, 0 0, 78% 12%, 0 0',
  backgroundRepeat: 'no-repeat, no-repeat, no-repeat, repeat',
  maskImage: 'linear-gradient(to bottom, black 55%, transparent 75%)',
})
const spotlight = css({
  position: 'absolute',
  left: 'calc(50% - 9em)',
  top: '-10%',
  width: '18em',
  height: '95%',
  transformOrigin: '50% 0',
  backgroundImage: 'linear-gradient(to bottom, rgba(255,245,222,0.85), rgba(255,245,222,0.15))',
  clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)',
  mixBlendMode: 'soft-light',
  animation: 'spotlightSway 4000ms ease-in-out infinite',
})

const brick = css({
  position: 'absolute',
  inset: '0 0 28% 0',
  backgroundImage:
    'linear-gradient(rgba(0,0,0,0.25) 0.18em, transparent 0.18em), linear-gradient(90deg, rgba(0,0,0,0.25) 0.18em, transparent 0.18em)',
  backgroundSize: '4em 2em, 4em 4em',
  backgroundPosition: '0 0, 2em 2em',
  opacity: 0.8,
})
const streetlight = css({
  position: 'absolute',
  bottom: '28%',
  width: '0.7em',
  height: '62%',
  bg: 'ink.900',
  _before: {
    content: '""',
    position: 'absolute',
    top: '-0.4em',
    left: '-1.6em',
    width: '3.8em',
    height: '1.3em',
    borderRadius: '1.2em 1.2em 0.2em 0.2em',
    bg: 'ink.900',
    boxShadow: '0 0.9em 2.4em 0.6em rgba(255,200,90,0.8)',
  },
  _after: {
    content: '""',
    position: 'absolute',
    top: '0.8em',
    left: '-8em',
    width: '17em',
    height: '40em',
    backgroundImage: 'radial-gradient(ellipse 50% 60% at 50% 0%, rgba(255,200,90,0.5), transparent 70%)',
    clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0 100%)',
    animation: 'lampFlicker 3000ms linear infinite',
  },
})
const sideShadow = css({
  position: 'absolute',
  inset: '0',
  backgroundImage: 'linear-gradient(90deg, rgba(8,8,11,0.75), transparent 35%, transparent 65%, rgba(8,8,11,0.6))',
})

const caustics = css({
  position: 'absolute',
  inset: '0',
  backgroundImage:
    'radial-gradient(ellipse 3em 1.2em, rgba(139,235,255,0.35), transparent 70%), radial-gradient(ellipse 2.4em 1em, rgba(255,255,255,0.25), transparent 70%)',
  backgroundSize: '9em 5em, 7em 6em',
  animation: 'causticDrift 4000ms linear infinite',
  mixBlendMode: 'screen',
})
const bubble = css({
  position: 'absolute',
  bottom: '-2em',
  width: 'var(--size, 1.2em)',
  height: 'var(--size, 1.2em)',
  borderRadius: 'full',
  border: '0.18em solid rgba(255,255,255,0.8)',
  backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0 15%, transparent 30%)',
  animation: 'bubbleRise var(--dur, 3000ms) ease-in infinite',
  animationDelay: 'var(--delay, 0ms)',
})
const seaweed = css({
  position: 'absolute',
  bottom: '24%',
  width: '1.6em',
  height: '14em',
  borderRadius: '50% 50% 0 0',
  bg: 'bamboo.700',
  border: '0.25em solid token(colors.ink.900)',
  transformOrigin: '50% 100%',
  animation: 'spotlightSway 3000ms ease-in-out infinite',
})

const actionLines = css({
  position: 'absolute',
  inset: '-20%',
  backgroundImage:
    'repeating-conic-gradient(from 0deg at 50% 45%, rgba(16,16,20,0.85) 0 0.6deg, transparent 0.6deg 6deg)',
  maskImage: 'radial-gradient(circle at 50% 45%, transparent 26%, black 60%)',
  animation: 'backdropBeamsRotate 20000ms linear infinite',
})
const radialBeams = css({
  position: 'absolute',
  inset: '-40%',
  backgroundImage: 'repeating-conic-gradient(from 0deg at 50% 50%, var(--beam) 0 7deg, transparent 7deg 18deg)',
  maskImage: 'radial-gradient(circle at 50% 50%, black 10%, transparent 60%)',
  animation: 'backdropBeamsRotate 9000ms linear infinite',
  mixBlendMode: 'screen',
})
const neonHorizon = css({
  position: 'absolute',
  left: '0',
  right: '0',
  top: 'calc(var(--horizon) - 0.3em)',
  height: '0.6em',
  bg: 'violet.300',
  boxShadow: '0 0 2em 0.6em token(colors.violet.400)',
})
const sigil = css({
  position: 'absolute',
  left: '50%',
  top: '42%',
  width: '34em',
  height: '34em',
  margin: '-17em 0 0 -17em',
  borderRadius: 'full',
  border: '0.3em solid rgba(183,150,255,0.6)',
  boxShadow: 'inset 0 0 0 2.4em rgba(138,85,255,0.08), inset 0 0 0 2.7em rgba(183,150,255,0.5)',
  backgroundImage:
    'repeating-conic-gradient(from 0deg, rgba(183,150,255,0.55) 0 1deg, transparent 1deg 30deg)',
  maskImage: 'radial-gradient(circle, transparent 38%, black 40%)',
  animation: 'backdropBeamsRotate 12000ms linear infinite',
})
const strobe = css({
  position: 'absolute',
  inset: '0',
  bg: 'cream.50',
  mixBlendMode: 'overlay',
  animation: 'flashStrobe 1000ms linear infinite',
})
const bossGrid = css({
  position: 'absolute',
  inset: '0',
  backgroundImage:
    'linear-gradient(rgba(53,216,255,0.12) 0.1em, transparent 0.1em), linear-gradient(90deg, rgba(53,216,255,0.12) 0.1em, transparent 0.1em)',
  backgroundSize: '3em 3em',
  maskImage: 'linear-gradient(to bottom, black, transparent 70%)',
})
const confetti = css({
  position: 'absolute',
  top: '0',
  width: '0.8em',
  height: '1.4em',
  bg: 'var(--c)',
  border: '0.12em solid token(colors.ink.900)',
  animation: 'confettiFall var(--dur, 3000ms) linear infinite',
  animationDelay: 'var(--delay, 0ms)',
})

/** Settling dust after the fight. */
const dust = css({
  position: 'absolute',
  inset: '0',
  backgroundImage:
    'radial-gradient(circle, rgba(255,245,222,0.55) 0 0.1em, transparent 0.12em), radial-gradient(circle, rgba(255,158,181,0.45) 0 0.08em, transparent 0.1em)',
  backgroundSize: '6.4em 5.2em, 9.1em 7.7em',
  animation: 'dustSettle 6000ms linear infinite',
})
/** A warm spotlight on the throne (the knocked-out boss). */
const loungeSpot = css({
  position: 'absolute',
  left: 'calc(50% + 7.5em - 14em)',
  top: '-10%',
  width: '28em',
  height: '110%',
  backgroundImage: 'linear-gradient(to bottom, rgba(255,214,170,0.35), rgba(255,214,170,0.05))',
  clipPath: 'polygon(40% 0, 60% 0, 100% 100%, 0 100%)',
  mixBlendMode: 'screen',
})

const CONFETTI_COLORS = ['#C8FF4D', '#FF743D', '#8A55FF', '#35D8FF', '#FFE453', '#FFF5DE']
const BUBBLES = [
  { left: '18%', size: '1em', dur: '3400ms', delay: '0ms', sway: '1.5em' },
  { left: '29%', size: '1.6em', dur: '4200ms', delay: '-1200ms', sway: '-1em' },
  { left: '41%', size: '0.8em', dur: '2800ms', delay: '-600ms', sway: '0.6em' },
  { left: '63%', size: '1.3em', dur: '3800ms', delay: '-2200ms', sway: '1.2em' },
  { left: '74%', size: '0.9em', dur: '3000ms', delay: '-300ms', sway: '-1.4em' },
  { left: '85%', size: '1.8em', dur: '4600ms', delay: '-3000ms', sway: '0.8em' },
  { left: '52%', size: '1.1em', dur: '3600ms', delay: '-1800ms', sway: '-0.6em' },
]

type Vars = Record<`--${string}`, string>
const vars = (values: Vars) => values as CSSProperties

function Decor({ theme }: { theme: StageTheme }): ReactNode {
  switch (theme) {
    case 'dojo':
      return (
        <>
          <div className={stalkDecor} style={{ left: '6%' }} />
          <div className={stalkDecor} style={{ left: '11%', height: '64%' }} />
          <div className={stalkDecor} style={{ right: '7%' }} />
          <div className={stalkDecor} style={{ right: '13%', height: '58%' }} />
        </>
      )
    case 'retro':
      return (
        <>
          <div className={memphis} />
          <div className={spotlight} />
        </>
      )
    case 'citrus':
      return <div className={radialBeams} style={vars({ '--beam': 'rgba(255,245,222,0.35)' })} />
    case 'disco':
      return (
        <>
          <div className={twinkles} />
          <div className={discoBeam} style={vars({ '--beam': '#C8FF4D', '--from': '-40deg', '--to': '25deg' })} />
          <div className={discoBeam} style={vars({ '--beam': '#35D8FF', '--from': '35deg', '--to': '-20deg' })} />
          <div className={discoBeam} style={vars({ '--beam': '#FF743D', '--from': '-10deg', '--to': '45deg' })} />
          <div className={discoBall} />
        </>
      )
    case 'gangnam':
      return (
        <>
          <div className={radialBeams} style={vars({ '--beam': 'rgba(255,255,255,0.4)' })} />
          <div className={strobe} />
        </>
      )
    case 'urban':
      return (
        <>
          <div className={brick} />
          <div className={streetlight} style={{ left: '14%' }} />
          <div className={streetlight} style={{ right: '14%' }} />
          <div className={sideShadow} />
        </>
      )
    case 'abyss':
      return (
        <>
          <div className={caustics} />
          <div className={seaweed} style={{ left: '8%' }} />
          <div className={seaweed} style={{ left: '12%', height: '10em', animationDelay: '-800ms' }} />
          <div className={seaweed} style={{ right: '10%', height: '12em', animationDelay: '-1600ms' }} />
          {BUBBLES.map((b) => (
            <span
              key={b.left}
              className={bubble}
              style={{
                left: b.left,
                ...vars({ '--size': b.size, '--dur': b.dur, '--delay': b.delay, '--sway': b.sway }),
              }}
            />
          ))}
        </>
      )
    case 'impact':
      return <div className={actionLines} />
    case 'violet':
      return (
        <>
          <div className={neonHorizon} />
          <div className={radialBeams} style={vars({ '--beam': 'rgba(183,150,255,0.25)' })} />
        </>
      )
    case 'mythic':
      return <div className={radialBeams} style={vars({ '--beam': 'rgba(255,228,83,0.35)' })} />
    case 'golden':
      return <div className={radialBeams} style={vars({ '--beam': 'rgba(255,240,154,0.55)' })} />
    case 'domain':
      return (
        <>
          <div className={sigil} />
          <div className={twinkles} />
        </>
      )
    case 'boss':
      return <div className={bossGrid} />
    case 'aftermath':
      return (
        <>
          <div className={dust} />
          <div className={dust} style={{ animationDelay: '-2400ms', backgroundPosition: '3em 1em, 1em 2.5em' }} />
        </>
      )
    case 'lounge':
      return (
        <>
          <div className={loungeSpot} />
          <div className={twinkles} style={{ opacity: 0.35 }} />
        </>
      )
    case 'victory':
      return (
        <>
          {CONFETTI_COLORS.flatMap((color, i) =>
            [0, 1].map((k) => (
              <span
                key={`${color}${k}`}
                className={confetti}
                style={{
                  left: `${8 + i * 15 + k * 7}%`,
                  ...vars({
                    '--c': color,
                    '--dur': `${2600 + ((i * 3 + k * 5) % 7) * 250}ms`,
                    '--delay': `-${(i * 700 + k * 1100) % 2600}ms`,
                    '--sway': `${(i % 2 ? 1 : -1) * (2 + k)}em`,
                  }),
                }}
              />
            )),
          )}
        </>
      )
  }
}

const MOVING_FLOORS = new Set<StageTheme>(['violet', 'boss', 'disco'])

export function StageBackdrop({ theme, t0 }: { theme: StageTheme; t0: number }) {
  return (
    <div className={backdrop({ theme })} data-t0={t0} data-theme={theme}>
      <div className={halftone} />
      <Decor theme={theme} />
      <div className={cx(floor, MOVING_FLOORS.has(theme) && floorMoving)} />
    </div>
  )
}
