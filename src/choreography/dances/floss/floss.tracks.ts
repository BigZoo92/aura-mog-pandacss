import { arm, legs } from '../../motion/ik'
import { mirrorTrack } from '../../motion/mirror'
import { defineTracks, type TrackDefinition } from '../../motion/track'

/**
 * FLOSS — arms swing together side to side while the hips go the OTHER way.
 * One arm always crosses in front of the hips, the other always crosses
 * behind them (z-index on the shoulder joints), like floss around a tooth.
 * 0% / 100% = arms left, 50% = arms right.
 */
const FEET = { L: { x: -3.3 }, R: { x: 3.3 } }

const flossHips: TrackDefinition = {
  summary: 'Hips sway opposite to the arms, knees dip as they pass the centre.',
  duration: 1000,
  easing: 'inOut',
  frames: {
    0: { ...legs({ pelvis: { x: 1.5, y: 0.5, r: 5 }, ...FEET }), torso: -7, body: { sy: 1.02, sx: 0.99 } },
    25: { ...legs({ pelvis: { x: 0, y: 1.25, r: 0 }, ...FEET }), torso: 0, body: { sy: 0.97, sx: 1.02 } },
    50: { ...legs({ pelvis: { x: -1.5, y: 0.5, r: -5 }, ...FEET }), torso: 7, body: { sy: 1.02, sx: 0.99 } },
    75: { ...legs({ pelvis: { x: 0, y: 1.25, r: 0 }, ...FEET }), torso: 0, body: { sy: 0.97, sx: 1.02 } },
    100: { ...legs({ pelvis: { x: 1.5, y: 0.5, r: 5 }, ...FEET }), torso: -7, body: { sy: 1.02, sx: 0.99 } },
  },
}

const armsLeft = {
  ...arm('L', { x: -9.9, y: -3, elbow: 'out', hand: 52 }),
  ...arm('R', { x: -2.6, y: -0.6, elbow: 'down', hand: 40 }),
}
const armsRight = {
  ...arm('L', { x: 2.6, y: -0.6, elbow: 'down', hand: -40 }),
  ...arm('R', { x: 9.9, y: -3, elbow: 'out', hand: -52 }),
}
const armsCentre = {
  ...arm('L', { x: -3.4, y: 0.4, elbow: 'out', hand: 4 }),
  ...arm('R', { x: 3.4, y: 0.4, elbow: 'out', hand: -4 }),
}

const flossArms: TrackDefinition = {
  summary: 'Straight arms swing as one; right arm passes in front, left arm passes behind.',
  duration: 1000,
  easing: 'inOut',
  frames: {
    0: { ...armsLeft, shoulderR: { z: 3 }, shoulderL: { z: -1 } },
    25: { ...armsCentre },
    50: { ...armsRight },
    75: { ...armsCentre },
    100: { ...armsLeft, shoulderR: { z: 3 }, shoulderL: { z: -1 } },
  },
}

const flossHead: TrackDefinition = {
  summary: 'Head stays stubbornly level and bobs on every swing — proudly serious.',
  duration: 1000,
  easing: 'inOut',
  frames: {
    0: { neck: 6, head: { r: 2, y: 0 } },
    25: { neck: 0, head: { r: 0, y: 0.4 } },
    50: { neck: -6, head: { r: -2, y: 0 } },
    75: { neck: 0, head: { r: 0, y: 0.4 } },
    100: { neck: 6, head: { r: 2, y: 0 } },
  },
}

export const flossTracks = defineTracks({
  flossHips,
  flossArms,
  flossHead,
  flossHipsMirror: mirrorTrack(flossHips),
  flossArmsMirror: mirrorTrack(flossArms, 'Switch sides: left arm passes in front, right arm behind.'),
  flossHeadMirror: mirrorTrack(flossHead),
})
