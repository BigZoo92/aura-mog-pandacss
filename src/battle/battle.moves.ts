import { defineMoves } from '../choreography/motion/move'

export const battleMoves = defineMoves({
  bossStare: {
    summary: 'Staring down the boss.',
    tracks: ['bossStare'],
    face: 'focus',
    hands: { L: 'fist', R: 'fist' },
  },
  bossDodge: {
    summary: 'Dodging utility-class projectiles.',
    tracks: ['bossDodge'],
    face: 'shock',
    hands: { L: 'open', R: 'open' },
  },
  auraBlast: {
    summary: 'The accumulated aura, released.',
    tracks: ['auraBlast'],
    face: 'focus',
    hands: { L: 'flat', R: 'flat' },
  },
  victory: {
    summary: 'Victory: the 67, but make it smug.',
    tracks: ['sixSevenPalms', 'idleBob'],
    face: 'proud',
    hands: { L: 'palmUp', R: 'palmUp' },
  },
})
