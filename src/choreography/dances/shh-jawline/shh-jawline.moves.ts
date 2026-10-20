import { defineMoves } from '../../motion/move'

export const shhJawlineMoves = defineMoves({
  shhStill: {
    summary: 'Abrupt stop.',
    tracks: ['shhStill'],
    face: 'neutral',
    hands: { L: 'open', R: 'open' },
  },
  shhRaise: {
    summary: 'Finger slowly rises to the lips.',
    tracks: ['shhRaise'],
    face: 'shush',
    hands: { L: 'open', R: 'point' },
  },
  shhHold: {
    summary: 'Shhh…',
    tracks: ['shhHold'],
    face: 'shush',
    hands: { L: 'open', R: 'point' },
  },
  shhTrace: {
    summary: 'Finger traces the jawline while the Giga Chad transformation happens.',
    tracks: ['shhTrace', 'chadMorph'],
    face: 'focus',
    hands: { L: 'fist', R: 'point' },
  },
  shhMogged: {
    summary: 'Giga Panda Chad — mogged.',
    tracks: ['moggedPose'],
    face: 'cool',
    hands: { L: 'fist', R: 'point' },
  },
})
