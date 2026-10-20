import { defineMoves } from '../../motion/move'

export const orangeJusticeMoves = defineMoves({
  orangeJustice: {
    summary: 'Orange Justice — knock-knee swing with low crossing arms.',
    tracks: ['orangeJusticeKnees', 'orangeJusticeArms', 'orangeJusticeDrift'],
    face: 'grin',
    hands: { L: 'open', R: 'open' },
  },
})
