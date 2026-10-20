import { defineMoves } from '../../motion/move'

export const sixSevenWoahMoves = defineMoves({
  sixSevenFast: {
    summary: 'The 67, twice as fast — indecision intensifies.',
    tracks: ['sixSevenPalmsFast', { track: 'idleBob', duration: 500 }],
    face: 'shock',
    hands: { L: 'palmUp', R: 'palmUp' },
  },
  woahWindup: {
    summary: 'Woah anticipation.',
    tracks: ['woahWindup'],
    face: 'focus',
    hands: { L: 'open', R: 'open' },
  },
  woahHit: {
    summary: 'Woah — the hit.',
    tracks: ['woahHit'],
    face: 'focus',
    hands: { L: 'fist', R: 'fist' },
  },
  woahHold: {
    summary: 'Woah — locked freeze.',
    tracks: ['woahLock'],
    face: 'cool',
    hands: { L: 'fist', R: 'fist' },
  },
})
