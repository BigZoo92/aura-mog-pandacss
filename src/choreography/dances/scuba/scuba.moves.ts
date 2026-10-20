import { defineMoves } from '../../motion/move'

export const scubaMoves = defineMoves({
  scubaDive: {
    summary: 'Scuba — left hand pinches the nose, right hand waves.',
    tracks: ['scubaPinch', 'scubaWave', 'scubaKnees', 'scubaFloat'],
    face: 'shush',
    hands: { L: 'pinch', R: 'flat' },
  },
  scubaSwitch: {
    summary: 'Scuba — switch hands.',
    tracks: ['scubaPinchMirror', 'scubaWaveMirror', 'scubaKnees', 'scubaFloat'],
    face: 'shush',
    hands: { L: 'flat', R: 'pinch' },
  },
})
