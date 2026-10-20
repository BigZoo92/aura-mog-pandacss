import { arm, legs } from '../../motion/ik'
import { mirrorTrack } from '../../motion/mirror'
import { defineTracks, type TrackDefinition } from '../../motion/track'

/**
 * WEST SIDE STORY — the cool, crouched, finger-snapping sideways walk.
 *
 * The walk really travels: `world` slides at a constant speed while the leg
 * IK keeps the planted foot fixed on the ground (it drifts backwards in body
 * space by exactly the distance travelled), and the free foot swings forward.
 * Stride = 2 em per 1000 ms cycle, matching the world speed of 2 em/s.
 */
const CROUCH = 1.9

const westSideStep: TrackDefinition = {
  summary: 'Low, slow lateral steps — planted foot stays put while the body travels.',
  duration: 1000,
  easing: 'inOut',
  frames: {
    0: { ...legs({ pelvis: { y: CROUCH, r: 0 }, L: { x: -2.6 }, R: { x: 2.4 } }), torso: 3 },
    25: { ...legs({ pelvis: { y: CROUCH - 0.5, r: 2 }, L: { x: -3.1 }, R: { x: 3.2, lift: 1.2, toes: 12 } }) },
    50: { ...legs({ pelvis: { y: CROUCH, r: 0 }, L: { x: -3.6 }, R: { x: 3.4 } }), torso: -3 },
    75: { ...legs({ pelvis: { y: CROUCH - 0.5, r: -2 }, L: { x: -3, lift: 1.2, toes: 12 }, R: { x: 2.9 } }) },
    100: { ...legs({ pelvis: { y: CROUCH, r: 0 }, L: { x: -2.6 }, R: { x: 2.4 } }), torso: 3 },
  },
}

const westSideTravel: TrackDefinition = {
  summary: 'Constant sideways travel across the stage (2 em per second).',
  duration: 3000,
  iterations: 1,
  easing: 'linear',
  frames: {
    0: { world: { x: -3 } },
    100: { world: { x: 3 } },
  },
}

const westSideSnaps: TrackDefinition = {
  summary: 'Arms low and loose, fingers snapping on every beat, shoulders rolling.',
  duration: 500,
  easing: 'snap',
  frames: {
    0: {
      ...arm('L', { x: -7.2, y: -3.4, elbow: 'down', hand: 140 }),
      ...arm('R', { x: 7.2, y: -3.4, elbow: 'down', hand: -140 }),
      shoulderL: { x: -0.2, y: 0.3 },
      shoulderR: { x: 0.2, y: -0.2 },
    },
    15: {
      ...arm('L', { x: -7.6, y: -4.4, elbow: 'down', hand: 120 }),
      ...arm('R', { x: 7.6, y: -4.4, elbow: 'down', hand: -120 }),
      shoulderL: { x: 0, y: -0.4 },
      shoulderR: { x: 0, y: -0.4 },
    },
    60: { shoulderL: { x: 0.2, y: -0.1 }, shoulderR: { x: -0.2, y: 0.3 } },
    100: {
      ...arm('L', { x: -7.2, y: -3.4, elbow: 'down', hand: 140 }),
      ...arm('R', { x: 7.2, y: -3.4, elbow: 'down', hand: -140 }),
      shoulderL: { x: -0.2, y: 0.3 },
      shoulderR: { x: 0.2, y: -0.2 },
    },
  },
}

const westSideAttitude: TrackDefinition = {
  summary: 'Chin down, side-eye toward the travel direction: coolest guy in cinema.',
  duration: 1000,
  easing: 'inOut',
  frames: {
    0: { neck: -4, head: { r: -6, y: 0.4 }, eyes: { x: 0.5, y: 0.1 } },
    50: { neck: -2, head: { r: -3, y: 0.7 }, eyes: { x: 0.5, y: 0.1 } },
    100: { neck: -4, head: { r: -6, y: 0.4 }, eyes: { x: 0.5, y: 0.1 } },
  },
}

export const westSideStoryTracks = defineTracks({
  westSideStep,
  westSideTravel,
  westSideSnaps,
  westSideAttitude,
  westSideStepBack: mirrorTrack(westSideStep, 'Lateral steps travelling left (planted foot drifts the other way).'),
  westSideTravelBack: mirrorTrack(westSideTravel, 'Constant sideways travel back to the left.'),
  westSideAttitudeBack: mirrorTrack(westSideAttitude),
})
