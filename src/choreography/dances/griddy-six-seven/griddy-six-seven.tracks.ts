import { hold } from '../../motion/hold'
import { arm, legs } from '../../motion/ik'
import { defineTracks, type TrackFrame } from '../../motion/track'

/**
 * GRIDDY + 67 → GRIDDY + 67 BACK.
 *
 * The Griddy lives in the FEET: alternating heel taps — knee lifts, the heel
 * taps the floor out in front with the toes pointing up, then the foot
 * returns — with a bouncy, travelling rhythm. The usual Griddy arm swing is
 * replaced by the 67 palms (a separate, reusable track), first in front, then
 * BEHIND THE BACK while facing away.
 *
 * Sneakers are drawn toes-outward (cartoon style), so a toe raise reads as a
 * heel tap even in a straight front or back view.
 */
const PLANTED = { L: { x: -3 }, R: { x: 3 } }

const tap = (side: 'L' | 'R', phase: 'lift' | 'tap' | 'return'): TrackFrame => {
  const sign = side === 'L' ? -1 : 1
  const other = side === 'L' ? PLANTED.R : PLANTED.L
  const moving =
    phase === 'lift'
      ? { x: sign * 2.5, lift: 2.4, toes: -6, knee: 'out' as const }
      : phase === 'tap'
        ? { x: sign * 4.9, lift: 0.5, toes: 42 }
        : { x: sign * 3.3, lift: 1.1, toes: 12 }
  const pelvis =
    phase === 'lift' ? { x: -sign * 0.5, y: 0.5, r: -sign * 3 } : phase === 'tap' ? { x: -sign * 0.3, y: 1.7, r: sign * 2 } : { x: 0, y: 1.1, r: 0 }
  const feet = side === 'L' ? { L: moving, R: other } : { L: other, R: moving }
  return {
    ...legs({ pelvis, ...feet }),
    body: phase === 'tap' ? { sx: 1.04, sy: 0.95 } : { sx: 0.98, sy: 1.03 },
  }
}

const settled: TrackFrame = { ...legs({ pelvis: { y: 1.4 }, ...PLANTED }), body: { sx: 1, sy: 1 } }

const FORWARD = { s: 1.12, y: 1.4 }

const FLEX = {
  ...legs({ pelvis: { y: 1.2 }, L: { x: -4.4 }, R: { x: 4.4 } }),
  ...arm('L', { x: -8.6, y: -14.2, elbow: 'down', hand: 178 }),
  ...arm('R', { x: 8.6, y: -14.2, elbow: 'down', hand: -178 }),
  shoulderL: { x: -0.3, y: -0.5 },
  shoulderR: { x: 0.3, y: -0.5 },
  torso: -3,
  neck: -6,
  head: { r: -12, x: -1.6, y: 0.2, look: 1 },
}

export const griddySixSevenTracks = defineTracks({
  griddyFootwork: {
    summary: 'Griddy heel taps: knee up, heel taps out front (toes up), back — alternating feet.',
    duration: 1000,
    easing: 'inOut',
    frames: {
      0: settled,
      12: { ...tap('L', 'lift'), ease: 'out' },
      25: { ...tap('L', 'tap'), ease: 'snap' },
      38: tap('L', 'return'),
      50: settled,
      62: { ...tap('R', 'lift'), ease: 'out' },
      75: { ...tap('R', 'tap'), ease: 'snap' },
      88: tap('R', 'return'),
      100: settled,
    },
  },
  griddyBob: {
    summary: 'Head and neck bob on every heel tap — the bounce sells the Griddy.',
    duration: 500,
    easing: 'inOut',
    frames: {
      0: { neck: 0, head: { r: -2, y: 0 } },
      50: { neck: 3, head: { r: 3, y: 0.7 } },
      100: { neck: 0, head: { r: -2, y: 0 } },
    },
  },
  griddyAdvance: {
    summary: 'Travels toward the camera while griddying (scale up, down the stage).',
    duration: 3500,
    iterations: 1,
    easing: 'linear',
    frames: { 0: { world: { s: 1, y: 0 } }, 100: { world: FORWARD } },
  },
  griddyHoldForward: hold('Stays at the front of the stage.', { world: FORWARD }, { duration: 800 }),
  griddyRetreat: {
    summary: 'Griddies AWAY from the camera, back first.',
    duration: 4000,
    iterations: 1,
    easing: 'linear',
    frames: { 0: { world: FORWARD }, 100: { world: { s: 1.02, y: 0.2 } } },
  },
  griddyGlance: {
    summary: 'While facing away, the head snaps round for a smug look over the shoulder.',
    duration: 2000,
    easing: 'snap',
    frames: {
      0: { neck: 0, head: { r: 0, x: 0, y: 0, look: 0 } },
      30: { neck: 0, head: { r: 0, x: 0, y: 0, look: 0 } },
      38: { neck: -5, head: { r: -10, x: -1.5, y: 0.2, look: 1 } },
      70: { neck: -5, head: { r: -10, x: -1.5, y: 0.2, look: 1 } },
      78: { neck: 0, head: { r: 0, x: 0, y: 0, look: 0 } },
      100: { neck: 0, head: { r: 0, x: 0, y: 0, look: 0 } },
    },
  },
  griddyFlex: hold('Back-facing double-biceps flex, peeking over the shoulder.', FLEX, {
    duration: 500,
    tremble: 0.07,
  }),
})
