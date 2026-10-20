import { defineMoves } from '../../motion/move'

export const westSideStoryMoves = defineMoves({
  westSideRight: {
    summary: 'Snapping sideways walk, travelling right.',
    tracks: ['westSideStep', 'westSideTravel', 'westSideSnaps', 'westSideAttitude'],
    face: 'cool',
    hands: { L: 'snap', R: 'snap' },
  },
  westSideLeft: {
    summary: 'Snapping sideways walk, travelling back left.',
    tracks: ['westSideStepBack', 'westSideTravelBack', 'westSideSnaps', 'westSideAttitudeBack'],
    face: 'cool',
    hands: { L: 'snap', R: 'snap' },
  },
})
