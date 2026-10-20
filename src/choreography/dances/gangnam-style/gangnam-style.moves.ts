import { defineMoves } from '../../motion/move'

export const gangnamStyleMoves = defineMoves({
  gangnamRide: {
    summary: 'Gangnam Style — invisible horse, crossed wrists, gallop.',
    tracks: ['gangnamGallop', 'gangnamReins', 'gangnamHead'],
    face: 'focus',
    hands: { L: 'fist', R: 'fist' },
  },
  gangnamLasso: {
    summary: 'Gangnam Style — lasso overhead while galloping.',
    tracks: ['gangnamGallop', 'gangnamLasso', 'gangnamHead'],
    face: 'cool',
    hands: { L: 'fist', R: 'point' },
  },
})
