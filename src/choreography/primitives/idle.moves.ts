import { defineMoves } from '../motion/move'

export const idleMoves = defineMoves({
  idle: {
    summary: 'Default groove — Tung Tung waiting to be adored.',
    tracks: ['idleBob', 'idleArms', 'idleHeadNod'],
    face: 'smug',
    hands: { L: 'open', R: 'open' },
  },
})
