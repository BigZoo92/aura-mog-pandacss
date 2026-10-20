import { arm, legs } from '../../motion/ik'
import { defineTracks } from '../../motion/track'

/**
 * ORANGE JUSTICE — three independent tracks on a 1 : 2 : 4 rhythm:
 *   knees knock in/out every half beat, arms swing low cross ↔ wide every beat,
 *   and the whole body drifts side to side every two beats.
 * Separate tracks, separate joints, perfectly in sync because their cycle
 * lengths divide each other — composition, not a monolithic keyframe.
 */
const FEET = { L: { x: -3.9 }, R: { x: 3.9 } }

export const orangeJusticeTracks = defineTracks({
  orangeJusticeKnees: {
    summary: 'Knees knock inward then swing outward, feet planted.',
    duration: 500,
    easing: 'inOut',
    frames: {
      0: { ...legs({ pelvis: { y: 1.3 }, L: { ...FEET.L, knee: 'in' }, R: { ...FEET.R, knee: 'in' } }), body: { sy: 0.98 } },
      50: { ...legs({ pelvis: { y: 1.4 }, L: { ...FEET.L, knee: 'out' }, R: { ...FEET.R, knee: 'out' } }), body: { sy: 1.01 } },
      100: { ...legs({ pelvis: { y: 1.3 }, L: { ...FEET.L, knee: 'in' }, R: { ...FEET.R, knee: 'in' } }), body: { sy: 0.98 } },
    },
  },

  orangeJusticeArms: {
    summary: 'Arms cross low in front of the hips, fling wide open, swing back to centre.',
    duration: 1000,
    easing: 'inOut',
    frames: {
      0: {
        ...arm('L', { x: 2.2, y: 0.4, elbow: 'out', hand: -30 }),
        ...arm('R', { x: -2.2, y: 0.6, elbow: 'out', hand: 30 }),
        shoulderL: { z: 2 },
        shoulderR: { z: 3 },
        ease: 'out',
      },
      45: {
        ...arm('L', { x: -9.6, y: -4.6, elbow: 'down', hand: 70 }),
        ...arm('R', { x: 9.6, y: -4.6, elbow: 'down', hand: -70 }),
        ease: 'inOut',
      },
      100: {
        ...arm('L', { x: 2.2, y: 0.4, elbow: 'out', hand: -30 }),
        ...arm('R', { x: -2.2, y: 0.6, elbow: 'out', hand: 30 }),
        shoulderL: { z: 2 },
        shoulderR: { z: 3 },
      },
    },
  },

  orangeJusticeDrift: {
    summary: 'Upper body leans into the swing and drifts side to side every two beats.',
    duration: 2000,
    easing: 'inOut',
    frames: {
      0: { torso: -5, neck: 4, head: { r: -4, y: 0 }, world: { x: -0.8 } },
      25: { torso: 0, neck: 0, head: { r: 0, y: 0.5 } },
      50: { torso: 5, neck: -4, head: { r: 4, y: 0 }, world: { x: 0.8 } },
      75: { torso: 0, neck: 0, head: { r: 0, y: 0.5 } },
      100: { torso: -5, neck: 4, head: { r: -4, y: 0 }, world: { x: -0.8 } },
    },
  },
})
