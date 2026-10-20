import { arm, legs, STANCE } from '../motion/ik'
import { defineTracks } from '../motion/track'

/** Ambient and idle primitives shared by every chapter. */
export const idleTracks = defineTracks({
  idleBlink: {
    summary: 'Eyes blink every ~3 s (layered under every move that leaves the eyes alone).',
    duration: 3200,
    easing: 'linear',
    frames: {
      0: { eyes: { sx: 1, sy: 1 } },
      90: { eyes: { sx: 1, sy: 1 } },
      93: { eyes: { sx: 1.08, sy: 0.08 } },
      96: { eyes: { sx: 1, sy: 1 } },
      100: { eyes: { sx: 1, sy: 1 } },
    },
  },

  idleBob: {
    summary: 'Cocky two-beat groove: knees pump, shoulders roll, head nods late.',
    duration: 1000,
    frames: {
      0: { ...legs({ pelvis: { y: 0.3, x: -0.2 }, ...STANCE }), torso: -1.5, body: { sy: 1 } },
      25: { ...legs({ pelvis: { y: 0.95, x: 0 }, ...STANCE }), torso: 0, body: { sy: 0.985 } },
      50: { ...legs({ pelvis: { y: 0.3, x: 0.2 }, ...STANCE }), torso: 1.5, body: { sy: 1 } },
      75: { ...legs({ pelvis: { y: 0.95, x: 0 }, ...STANCE }), torso: 0, body: { sy: 0.985 } },
      100: { ...legs({ pelvis: { y: 0.3, x: -0.2 }, ...STANCE }), torso: -1.5, body: { sy: 1 } },
    },
  },

  idleArms: {
    summary: 'Loose rubber-hose arms swinging slightly behind the groove.',
    duration: 1000,
    frames: {
      0: { ...arm('L', { x: -6.3, y: 0.3, hand: 16 }), ...arm('R', { x: 6.6, y: -0.2, hand: -8 }) },
      50: { ...arm('L', { x: -6.6, y: -0.2, hand: 8 }), ...arm('R', { x: 6.3, y: 0.3, hand: -16 }) },
      100: { ...arm('L', { x: -6.3, y: 0.3, hand: 16 }), ...arm('R', { x: 6.6, y: -0.2, hand: -8 }) },
    },
  },

  idleHeadNod: {
    summary: 'Head nods on the off-beat, with a little tilt of attitude.',
    duration: 1000,
    frames: {
      0: { head: { r: -3, y: 0 } },
      35: { head: { r: 0, y: 0.35 } },
      50: { head: { r: 3, y: 0 } },
      85: { head: { r: 0, y: 0.35 } },
      100: { head: { r: -3, y: 0 } },
    },
  },
})
