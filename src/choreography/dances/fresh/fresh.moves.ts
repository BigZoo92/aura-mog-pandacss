import { defineMoves } from '../../motion/move'

export const freshMoves = defineMoves({
  fresh: {
    summary: 'Fresh — 90s sitcom side-step with pumping elbows.',
    tracks: ['freshStepTouch', 'freshArmPump', 'freshShimmy', 'freshHead'],
    face: 'grin',
    hands: { L: 'fist', R: 'fist' },
  },
})
