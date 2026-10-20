import { hold } from '../../motion/hold'
import { arm, legs, STANCE } from '../../motion/ik'
import { defineTracks } from '../../motion/track'

/**
 * SHHH INTO JAWLINE — the most cinematic presentation possible for the
 * dumbest possible gesture. A dead stop. A finger slowly rises to the lips.
 * Then the finger traces down to the chin and along the jaw — and the jaw
 * GROWS under it: Giga Panda Chad is born, one keyframe at a time.
 *
 * The transformation is driven by tracks on the form layers (jaw, chad eyes,
 * bulk, biceps, sparkle), so seeking into the middle shows the exact
 * in-between morph.
 */
const STILL = { ...legs({ pelvis: { y: 0.4 }, ...STANCE }), torso: 0, neck: 0, head: { r: 0, y: 0 } }
const L_ARM_DOWN = arm('L', { x: -6.4, y: 0.2, elbow: 'out', hand: 10 })
const R_ARM_DOWN = arm('R', { x: 6.4, y: 0.2, elbow: 'out', hand: -10 })
const AT_LIPS = { x: 0.9, y: -11.4, elbow: 'down' as const, hand: 178 }
const AT_CHIN = { x: 1.1, y: -9.5, elbow: 'down' as const, hand: 172 }
const AT_JAW = { x: 6.6, y: -10.6, elbow: 'down' as const, hand: 140, shoulder: { x: 1, y: -0.3 } }

const BROWS_CALM = { browL: { x: 0, y: 0, r: 0 }, browR: { x: 0, y: 0, r: 0 } }
const BROWS_MENACE = { browL: { x: 0.3, y: 0.7, r: 22 }, browR: { x: -0.3, y: 0.7, r: -22 } }

export const shhJawlineTracks = defineTracks({
  shhStill: hold('Dead stop. Total silence.', { ...STILL, ...L_ARM_DOWN, ...R_ARM_DOWN }, { duration: 800 }),

  shhRaise: {
    summary: 'One finger rises, slowly, to the lips. The eyes narrow.',
    duration: 1400,
    iterations: 1,
    easing: 'inOut',
    frames: {
      0: { ...STILL, ...L_ARM_DOWN, ...R_ARM_DOWN, eyes: { sx: 1, sy: 1 }, ...BROWS_CALM },
      70: { ...arm('R', { ...AT_LIPS, y: AT_LIPS.y + 0.6 }), eyes: { sx: 1, sy: 0.8 } },
      100: { ...STILL, ...L_ARM_DOWN, ...arm('R', AT_LIPS), eyes: { sx: 1.04, sy: 0.62 }, ...BROWS_MENACE },
    },
  },

  shhHold: hold(
    'Shhh.',
    { ...STILL, ...L_ARM_DOWN, ...arm('R', AT_LIPS), eyes: { sx: 1.04, sy: 0.62 }, ...BROWS_MENACE },
    { duration: 1000, tremble: 0.03 },
  ),

  shhTrace: {
    summary: 'The finger slides from the lips to the chin and along the jawline.',
    duration: 2400,
    iterations: 1,
    easing: 'inOut',
    frames: {
      0: { ...STILL, ...L_ARM_DOWN, ...arm('R', AT_LIPS), eyes: { sx: 1.04, sy: 0.62 }, ...BROWS_MENACE },
      28: { ...arm('R', AT_CHIN), head: { r: -3, y: -0.2 } },
      100: {
        ...STILL,
        ...arm('L', { x: -7.2, y: 0.4, elbow: 'out', hand: 16, shoulder: { x: -1, y: -0.3 } }),
        ...arm('R', AT_JAW),
        head: { r: -7, y: -0.5 },
        neck: -3,
        eyes: { sx: 1.04, sy: 0.62 },
        ...BROWS_MENACE,
      },
    },
  },

  chadMorph: {
    summary: 'Giga Chad transformation: jaw grows, eyes sharpen, traps and biceps inflate, sparkle rides the jawline.',
    duration: 2400,
    iterations: 1,
    easing: 'inOut',
    frames: {
      0: {
        jaw: { o: 0, sx: 0.55, sy: 0.25 },
        chadEyes: { o: 0 },
        bulk: { o: 0, s: 0.6 },
        muscleL: { o: 0, s: 0.3 },
        muscleR: { o: 0, s: 0.3 },
        sparkle: { o: 0, s: 0.3, x: 0, y: 0 },
      },
      22: { jaw: { o: 1, sx: 0.62, sy: 0.32 }, sparkle: { o: 0, s: 0.4, x: 6.8, y: 2.6 } },
      30: { sparkle: { o: 1, s: 1, x: 6.8, y: 2.6 } },
      45: { chadEyes: { o: 0 } },
      70: { chadEyes: { o: 1 }, bulk: { o: 1, s: 0.9 }, muscleL: { o: 1, s: 0.8 }, muscleR: { o: 1, s: 0.8 } },
      92: { jaw: { o: 1, sx: 1.08, sy: 1.12 }, sparkle: { o: 1, s: 1.3, x: 15, y: -0.6 } },
      100: {
        jaw: { o: 1, sx: 1, sy: 1 },
        chadEyes: { o: 1 },
        bulk: { o: 1, s: 1 },
        muscleL: { o: 1, s: 1 },
        muscleR: { o: 1, s: 1 },
        sparkle: { o: 0, s: 0.2, x: 15.4, y: -1 },
      },
    },
  },

  moggedPose: hold(
    'Finger on the jawline, chin up. Held. For. Too. Long.',
    {
      ...legs({ pelvis: { y: 0.6 }, L: { x: -3.6 }, R: { x: 3.6 } }),
      ...arm('L', { x: -7.6, y: 0.4, elbow: 'out', hand: 16, shoulder: { x: -1, y: -0.3 } }),
      ...arm('R', AT_JAW),
      torso: -1,
      neck: -4,
      head: { r: -8, y: -0.6 },
    },
    { duration: 700, tremble: 0.05 },
  ),
})
