import { defineMoves } from '../../motion/move'

export const griddySixSevenMoves = defineMoves({
  griddyFront: {
    summary: 'Griddy footwork + 67 palms, advancing toward the camera.',
    tracks: ['griddyFootwork', 'sixSevenPalmsQuiet', 'griddyBob', 'griddyAdvance'],
    face: 'smug',
    hands: { L: 'palmUp', R: 'palmUp' },
  },
  griddyTurn: {
    summary: 'The exaggerated 180° spin to face away.',
    tracks: ['turnToBack', 'turnLegs', 'griddyHoldForward'],
    face: 'proud',
    hands: { L: 'fist', R: 'fist' },
  },
  griddyBack: {
    summary: 'Griddy footwork facing AWAY, 67 palms behind the back.',
    tracks: ['griddyFootwork', 'sixSevenBehind', 'griddyGlance', 'griddyRetreat'],
    orientation: 'back',
    face: 'smug',
    hands: { L: 'palmUp', R: 'palmUp' },
  },
  griddyFlex: {
    summary: 'Back-facing flex, looking over the shoulder.',
    tracks: ['griddyFlex'],
    orientation: 'back',
    face: 'smug',
    hands: { L: 'fist', R: 'fist' },
  },
})
