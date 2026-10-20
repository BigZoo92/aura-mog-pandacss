import { arm, legs } from '../../motion/ik'
import { mirrorTrack } from '../../motion/mirror'
import { defineTracks, type TrackDefinition } from '../../motion/track'

/**
 * SCUBA — one hand pinches the nose, the free arm reaches out and waves its
 * hand back and forth, knees open and close, the torso dips. Everything is a
 * little slow and floaty, as if underwater.
 */
const FEET = { L: { x: -3.6 }, R: { x: 3.6 } }

const scubaPinch: TrackDefinition = {
  summary: 'Left hand pinches the nose (holding breath).',
  duration: 1000,
  easing: 'inOut',
  frames: {
    0: { ...arm('L', { x: -0.9, y: -10.8, elbow: 'down', hand: 172 }), shoulderL: { x: 0, y: -0.2 } },
    50: { ...arm('L', { x: -0.9, y: -10.4, elbow: 'down', hand: 168 }), shoulderL: { x: 0, y: 0 } },
    100: { ...arm('L', { x: -0.9, y: -10.8, elbow: 'down', hand: 172 }), shoulderL: { x: 0, y: -0.2 } },
  },
}

const scubaWave: TrackDefinition = {
  summary: 'Free arm extended forward, hand waving back and forth like a fin.',
  duration: 500,
  easing: 'inOut',
  frames: {
    0: { ...arm('R', { x: 11.4, y: -7.2, elbow: 'down', hand: -125 }) },
    50: { ...arm('R', { x: 11.2, y: -6.2, elbow: 'down', hand: -60 }) },
    100: { ...arm('R', { x: 11.4, y: -7.2, elbow: 'down', hand: -125 }) },
  },
}

const scubaKnees: TrackDefinition = {
  summary: 'Knees open and close while the torso dips — slow, underwater rhythm.',
  duration: 1000,
  easing: 'inOut',
  frames: {
    0: { ...legs({ pelvis: { y: 1.2 }, L: { ...FEET.L, knee: 'out' }, R: { ...FEET.R, knee: 'out' } }), torso: 0 },
    50: { ...legs({ pelvis: { y: 2.2 }, L: { ...FEET.L, knee: 'in' }, R: { ...FEET.R, knee: 'in' } }), torso: 4 },
    100: { ...legs({ pelvis: { y: 1.2 }, L: { ...FEET.L, knee: 'out' }, R: { ...FEET.R, knee: 'out' } }), torso: 0 },
  },
}

const scubaFloat: TrackDefinition = {
  summary: 'The whole panda drifts upward and sinks back — he is floating.',
  duration: 2000,
  easing: 'inOut',
  frames: {
    0: { world: { x: 0, y: 0 }, shadow: { s: 1, o: 1 }, head: { r: -4, y: 0 } },
    50: { world: { x: 0.6, y: -2.6 }, shadow: { s: 0.7, o: 0.6 }, head: { r: 4, y: 0 } },
    100: { world: { x: 0, y: 0 }, shadow: { s: 1, o: 1 }, head: { r: -4, y: 0 } },
  },
}

export const scubaTracks = defineTracks({
  scubaPinch,
  scubaWave,
  scubaKnees,
  scubaFloat,
  scubaPinchMirror: mirrorTrack(scubaPinch, 'Right hand pinches the nose.'),
  scubaWaveMirror: mirrorTrack(scubaWave, 'Left arm extended, waving.'),
})
