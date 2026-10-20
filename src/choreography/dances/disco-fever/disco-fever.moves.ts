import { defineMoves } from '../../motion/move'

export const discoFeverMoves = defineMoves({
  discoRight: {
    summary: 'Disco point with the right hand, left fist on the hip.',
    tracks: ['discoPoint', 'discoHips', 'discoHead'],
    face: 'cool',
    hands: { L: 'fist', R: 'point' },
  },
  discoLeft: {
    summary: 'Disco point, switched to the left hand.',
    tracks: ['discoPointMirror', 'discoHipsMirror', 'discoHeadMirror'],
    face: 'cool',
    hands: { L: 'point', R: 'fist' },
  },
})
