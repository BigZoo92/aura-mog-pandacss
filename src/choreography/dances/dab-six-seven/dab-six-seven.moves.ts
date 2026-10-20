import { defineMoves } from '../../motion/move'

export const dabSixSevenMoves = defineMoves({
  dabWindup: {
    summary: 'Dab anticipation.',
    tracks: ['dabWindup'],
    face: 'focus',
    hands: { L: 'fist', R: 'fist' },
  },
  dabHit: {
    summary: 'The Dab lands.',
    tracks: ['dabHit'],
    face: 'cool',
    hands: { L: 'fist', R: 'point' },
  },
  dabHold: {
    summary: 'Dab held.',
    tracks: ['dabHold'],
    face: 'cool',
    hands: { L: 'fist', R: 'point' },
  },
  dabGhosts: {
    summary: 'Dab held while two ghost arms emerge and do the 67.',
    tracks: ['dabHold', 'ghostEmerge', { track: 'sixSevenGhost', delay: 300 }],
    face: 'cool',
    hands: { L: 'fist', R: 'point' },
    ghostHands: { L: 'palmUp', R: 'palmUp' },
  },
  dabMiddleFinger: {
    summary: 'Dab + 67 + an oversized ghost middle finger aimed at the rival.',
    tracks: ['dabHold', 'ghostLeftSixSeven', 'ghostFlip'],
    face: 'smug',
    hands: { L: 'fist', R: 'point' },
    ghostHands: { L: 'palmUp', R: 'middleFinger' },
  },
  dabFinale: {
    summary: 'Freeze frame of the full Dab + 67 + middle finger, Giga Chad edition.',
    tracks: ['dabHold', 'ghostFinale'],
    face: 'cool',
    hands: { L: 'fist', R: 'point' },
    ghostHands: { L: 'palmUp', R: 'middleFinger' },
  },
})
