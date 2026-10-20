import { defineMoves } from '../motion/move'

export const sixSevenMoves = defineMoves({
  sixSeven: {
    summary: 'The 67 gesture on its own, with the idle groove underneath.',
    tracks: ['sixSevenPalms', 'idleBob'],
    face: 'smug',
    hands: { L: 'palmUp', R: 'palmUp' },
  },
})
