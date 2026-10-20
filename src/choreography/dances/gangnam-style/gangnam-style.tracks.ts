import { arm, legs } from '../../motion/ik'
import { defineTracks } from '../../motion/track'

/**
 * GANGNAM STYLE — the invisible horse. Wrists crossed at the chest holding the
 * reins, a skipping gallop (step-hop, alternate legs), shoulders bouncing;
 * then the lasso: one hand circles above the head while the other keeps the
 * reins.
 */
const REINS_L = { x: 1.3, y: -4.4, elbow: 'down' as const, hand: -130 }
const REINS_R = { x: -1.3, y: -4.9, elbow: 'down' as const, hand: 130 }

export const gangnamStyleTracks = defineTracks({
  gangnamGallop: {
    summary: 'Horse-riding gallop: step, hop, switch legs — double bounce per beat.',
    duration: 1000,
    easing: 'inOut',
    frames: {
      0: { ...legs({ pelvis: { y: 1.8 }, L: { x: -3.4 }, R: { x: 3.4 } }), body: { y: 0, sy: 0.96, sx: 1.03 } },
      15: { ...legs({ pelvis: { y: 0.8 }, L: { x: -2.6, lift: 2.6, toes: -10 }, R: { x: 3.2 } }), body: { y: -1.4, sy: 1.04, sx: 0.98 } },
      30: { ...legs({ pelvis: { y: 1.8 }, L: { x: -3.2 }, R: { x: 3.4 } }), body: { y: 0, sy: 0.95, sx: 1.04 }, ease: 'bounce' },
      50: { ...legs({ pelvis: { y: 1.8 }, L: { x: -3.4 }, R: { x: 3.4 } }), body: { y: 0, sy: 0.96, sx: 1.03 } },
      65: { ...legs({ pelvis: { y: 0.8 }, L: { x: -3.2 }, R: { x: 2.6, lift: 2.6, toes: -10 } }), body: { y: -1.4, sy: 1.04, sx: 0.98 } },
      80: { ...legs({ pelvis: { y: 1.8 }, L: { x: -3.4 }, R: { x: 3.2 } }), body: { y: 0, sy: 0.95, sx: 1.04 }, ease: 'bounce' },
      100: { ...legs({ pelvis: { y: 1.8 }, L: { x: -3.4 }, R: { x: 3.4 } }), body: { y: 0, sy: 0.96, sx: 1.03 } },
    },
  },
  gangnamReins: {
    summary: 'Wrists crossed at the chest, tugging the invisible reins on every hop.',
    duration: 500,
    easing: 'inOut',
    frames: {
      0: { ...arm('L', REINS_L), ...arm('R', REINS_R), shoulderL: { x: 0, y: 0 }, shoulderR: { x: 0, y: 0, z: 3 } },
      30: {
        ...arm('L', { ...REINS_L, y: REINS_L.y - 1 }),
        ...arm('R', { ...REINS_R, y: REINS_R.y - 1 }),
        shoulderL: { x: 0, y: -0.6 },
        shoulderR: { x: 0, y: -0.6, z: 3 },
      },
      100: { ...arm('L', REINS_L), ...arm('R', REINS_R), shoulderL: { x: 0, y: 0 }, shoulderR: { x: 0, y: 0, z: 3 } },
    },
  },
  gangnamLasso: {
    summary: 'Right hand lassos above the head; left hand keeps the reins.',
    duration: 1000,
    easing: 'linear',
    frames: {
      0: { ...arm('R', { x: 3.4, y: -19.2, elbow: 'out', hand: -170 }), ...arm('L', REINS_L) },
      25: { ...arm('R', { x: 6.2, y: -18, elbow: 'out', hand: -150 }) },
      50: { ...arm('R', { x: 3.6, y: -16.8, elbow: 'out', hand: -170 }) },
      75: { ...arm('R', { x: 0.8, y: -18, elbow: 'out', hand: 170 }) },
      100: { ...arm('R', { x: 3.4, y: -19.2, elbow: 'out', hand: -170 }), ...arm('L', REINS_L) },
    },
  },
  gangnamHead: {
    summary: 'Deadpan head bob — the face stays dead serious.',
    duration: 500,
    easing: 'inOut',
    frames: {
      0: { head: { r: 0, y: 0.3 }, torso: 0 },
      30: { head: { r: -3, y: -0.4 }, torso: -2 },
      100: { head: { r: 0, y: 0.3 }, torso: 0 },
    },
  },
})
