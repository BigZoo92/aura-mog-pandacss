import { arm, legs } from '../../motion/ik'
import { mirrorTrack } from '../../motion/mirror'
import { defineTracks, type TrackDefinition } from '../../motion/track'

/**
 * DISCO FEVER — the iconic point: right index finger stabs up to the sky,
 * then down across the body to the opposite hip, while the left fist rests on
 * the hip and the hips sway foot to foot. Switches sides halfway through.
 */
const discoPoint: TrackDefinition = {
  summary: 'The disco point: up-right to the sky, down-left across the body.',
  duration: 1000,
  easing: 'snap',
  frames: {
    0: {
      ...arm('R', { x: 10.6, y: -15.6, elbow: 'down', hand: -140 }),
      ...arm('L', { x: -5, y: -1.8, elbow: 'out', hand: -40 }),
      shoulderR: { x: 0, y: -0.5 },
    },
    40: {
      ...arm('R', { x: 10.6, y: -15.6, elbow: 'down', hand: -140 }),
      shoulderR: { x: 0, y: -0.5 },
    },
    50: {
      ...arm('R', { x: -3.6, y: 0.4, elbow: 'out', hand: 30 }),
      ...arm('L', { x: -5, y: -1.8, elbow: 'out', hand: -40 }),
      shoulderR: { x: 0, y: 0.3 },
    },
    90: { ...arm('R', { x: -3.6, y: 0.4, elbow: 'out', hand: 30 }), shoulderR: { x: 0, y: 0.3 } },
    100: {
      ...arm('R', { x: 10.6, y: -15.6, elbow: 'down', hand: -140 }),
      ...arm('L', { x: -5, y: -1.8, elbow: 'out', hand: -40 }),
      shoulderR: { x: 0, y: -0.5 },
    },
  },
}

const discoHips: TrackDefinition = {
  summary: 'Weight rocks foot to foot, hips sway, the free knee pops.',
  duration: 1000,
  easing: 'inOut',
  frames: {
    0: { ...legs({ pelvis: { x: 1.2, y: 0.6, r: 7 }, L: { x: -3.2, lift: 0.4, toes: 20, knee: 'in' }, R: { x: 3.4 } }), torso: -8 },
    50: { ...legs({ pelvis: { x: -1.2, y: 0.6, r: -7 }, L: { x: -3.4 }, R: { x: 3.2, lift: 0.4, toes: 20, knee: 'in' } }), torso: 6 },
    100: { ...legs({ pelvis: { x: 1.2, y: 0.6, r: 7 }, L: { x: -3.2, lift: 0.4, toes: 20, knee: 'in' }, R: { x: 3.4 } }), torso: -8 },
  },
}

const discoHead: TrackDefinition = {
  summary: 'Head follows the finger up, bobs down on the hip.',
  duration: 1000,
  easing: 'snap',
  frames: {
    0: { neck: -6, head: { r: -10, y: -0.3 } },
    45: { neck: -6, head: { r: -10, y: -0.3 } },
    50: { neck: 4, head: { r: 6, y: 0.4 } },
    95: { neck: 4, head: { r: 6, y: 0.4 } },
    100: { neck: -6, head: { r: -10, y: -0.3 } },
  },
}

export const discoFeverTracks = defineTracks({
  discoPoint,
  discoHips,
  discoHead,
  discoPointMirror: mirrorTrack(discoPoint, 'The disco point, left hand.'),
  discoHipsMirror: mirrorTrack(discoHips),
  discoHeadMirror: mirrorTrack(discoHead),
})
