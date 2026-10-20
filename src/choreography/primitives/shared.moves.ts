import { defineMoves } from '../motion/move'

export const sharedMoves = defineMoves({
  introStrut: {
    summary: 'Strutting into frame like he owns the internet.',
    tracks: ['introStrutLegs', 'introStrutArms', 'introSlideIn'],
    face: 'smug',
    hands: { L: 'fist', R: 'fist' },
  },
  eyebrowRaise: {
    summary: 'Power pose + one eyebrow raised at the camera.',
    tracks: ['powerPoseBody', 'eyebrowRaise'],
    face: 'smug',
    hands: { L: 'fist', R: 'fist' },
  },
  heroPose: {
    summary: 'End-of-act heroic pose.',
    tracks: ['heroPose'],
    face: 'proud',
    hands: { L: 'fist', R: 'fist' },
  },
})
