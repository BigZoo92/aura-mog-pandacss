import { hold } from '../../motion/hold'
import { arm, legs } from '../../motion/ik'
import { defineTracks } from '../../motion/track'

/**
 * SIX SEVEN → WOAH. The 67 accelerates, then: anticipation (arms wind up and
 * back, body rises), a violently fast circular sweep, and a locked freeze —
 * one fist up by the face, the other forearm across the chest, knees bent,
 * body leaning into the hit.
 */
const WINDUP = {
  ...legs({ pelvis: { y: 0.1, x: -0.6, r: -3 }, L: { x: -3.2 }, R: { x: 3.2, lift: 0.4 } }),
  ...arm('L', { x: 6.4, y: -15.8, elbow: 'up', hand: -150 }),
  ...arm('R', { x: 9.6, y: -13.4, elbow: 'up', hand: -130 }),
  torso: -9,
  neck: -4,
  head: { r: -8, y: -0.3 },
  body: { sy: 1.05, sx: 0.97 },
}

const WOAH_LOCK = {
  ...legs({ pelvis: { y: 2.3, x: 0.7, r: 4 }, L: { x: -4.2, knee: 'out' }, R: { x: 3.8, knee: 'out' } }),
  ...arm('L', { x: -2.4, y: -13.6, elbow: 'down', hand: 175 }),
  ...arm('R', { x: -2.2, y: -8.6, elbow: 'down', hand: 92 }),
  torso: 8,
  neck: 6,
  head: { r: 12, y: 0.5 },
  body: { sy: 0.97, sx: 1.02 },
}

export const sixSevenWoahTracks = defineTracks({
  woahWindup: {
    summary: 'Anticipation: arms swing up and back, body rises and leans away.',
    duration: 500,
    iterations: 1,
    easing: 'out',
    frames: {
      0: {
        ...legs({ pelvis: { y: 0.6 }, L: { x: -3 }, R: { x: 3 } }),
        ...arm('L', { x: -7.2, y: -6.6, elbow: 'down', hand: 104 }),
        ...arm('R', { x: 6.4, y: -1.5, elbow: 'down', hand: -104 }),
        torso: 0,
        neck: 0,
        head: { r: 0, y: 0 },
        body: { sy: 1, sx: 1 },
      },
      100: WINDUP,
    },
  },
  woahHit: {
    summary: 'The hit: a violent circular sweep that slams into the locked Woah pose.',
    duration: 300,
    iterations: 1,
    easing: 'in',
    frames: {
      0: WINDUP,
      45: {
        ...arm('L', { x: 5.4, y: -2, elbow: 'down', hand: -40 }),
        ...arm('R', { x: 7.6, y: -1.2, elbow: 'down', hand: -60 }),
        torso: 0,
        body: { sy: 1, sx: 1 },
      },
      75: { ...WOAH_LOCK, torso: 11, head: { r: 16, y: 0.7 }, body: { sy: 0.92, sx: 1.06 }, ease: 'overshoot' },
      100: WOAH_LOCK,
    },
  },
  woahLock: hold('The locked Woah freeze, trembling with power.', WOAH_LOCK, { duration: 400, tremble: 0.08 }),
})
