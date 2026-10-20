import { defineMoves } from '../../motion/move'

/** Twerk tracks shared by every twerking move; tempo changes retime them. */
const TWERK_COSTUME = ['tailWag', 'hoodEarsBounce'] as const

export const sixSevenTwerkyMoves = defineMoves({
  twerkyLook: {
    summary: 'A: arrogant look at the camera + prep pose.',
    tracks: ['twerkyLookPrep'],
    face: 'smug',
    hands: { L: 'fist', R: 'fist' },
  },
  twerkyTurn: {
    summary: 'A: progressive 180° turn — front, profile, back.',
    tracks: ['twerkyTurn', 'twerkyTurnBody'],
    face: 'smug',
    hands: { L: 'palmUp', R: 'palmUp' },
  },
  twerkyMain: {
    summary: 'B + C: back-facing twerk with the 67 on top — pelvis, torso, hips, cheeks and arms all independent.',
    tracks: ['twerkPelvis', 'twerkTorso', 'twerkHips', 'twerkCheeks', 'twerkHead', 'sixSevenTwerk', ...TWERK_COSTUME],
    orientation: 'back',
    face: 'proud',
    hands: { L: 'palmUp', R: 'palmUp' },
  },
  twerkyWind: {
    summary: 'B: tempo variation — slow lateral hip wind, half-time pops.',
    tracks: [
      'twerkWind',
      'twerkWindTorso',
      { track: 'twerkHips', duration: 500 },
      { track: 'twerkCheeks', duration: 500 },
      'twerkHead',
      'sixSevenTwerk',
      { track: 'tailWag', duration: 500 },
      { track: 'hoodEarsBounce', duration: 500 },
    ],
    orientation: 'back',
    face: 'proud',
    hands: { L: 'palmUp', R: 'palmUp' },
  },
  twerkyFast: {
    summary: 'D: accelerated twerk, 67 still going, smug look over the shoulder.',
    tracks: [
      { track: 'twerkPelvis', duration: 340 },
      { track: 'twerkTorso', duration: 340 },
      { track: 'twerkHips', duration: 170 },
      { track: 'twerkCheeks', duration: 170 },
      'twerkLookBack',
      { track: 'sixSevenTwerk', duration: 420 },
      { track: 'tailWag', duration: 170 },
      { track: 'hoodEarsBounce', duration: 170 },
    ],
    orientation: 'back',
    face: 'smug',
    hands: { L: 'palmUp', R: 'palmUp' },
  },
  twerkyFreeze: {
    summary: 'D: freeze frame over the shoulder — back view unlocked.',
    tracks: ['twerkFreeze'],
    orientation: 'back',
    face: 'smug',
    hands: { L: 'palmUp', R: 'palmUp' },
  },
})
