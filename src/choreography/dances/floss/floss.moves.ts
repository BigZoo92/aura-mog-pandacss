import { defineMoves } from '../../motion/move'

export const flossMoves = defineMoves({
  flossRight: {
    summary: 'Floss — right arm flossing in front of the hips.',
    tracks: ['flossHips', 'flossArms', 'flossHead'],
    face: 'focus',
    hands: { L: 'fist', R: 'fist' },
  },
  flossLeft: {
    summary: 'Floss — switched sides, left arm in front.',
    tracks: ['flossHipsMirror', 'flossArmsMirror', 'flossHeadMirror'],
    face: 'focus',
    hands: { L: 'fist', R: 'fist' },
  },
})
