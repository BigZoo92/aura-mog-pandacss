import { auraHit, beats, defineChapter, repeat } from '../../chapter-helpers'

export const gangnamStyleChapter = defineChapter({
  id: 'gangnamStyle',
  act: 'act1',
  title: 'Gangnam Style',
  subtitle: 'Invisible horse, visible aura',
  dance: 'gangnamStyle',
  theme: 'gangnam',
  transition: 'flash',
  segments: [
    { move: 'gangnamRide', duration: beats(6), label: 'Horse riding' },
    { move: 'gangnamLasso', duration: beats(5), form: 'auraBeast', label: 'Lasso (Aura Beast)' },
    { move: 'heroPose', duration: beats(4), form: 'auraBeast', label: 'Heroic pose' },
  ],
  events: [
    ...repeat(2, beats(4), beats(2), (at) => auraHit(at, 9999)),
    // Fast camera cuts on the gallop
    ...repeat(4, beats(1.5), beats(0.5), (at) => ({ type: 'camera', at, duration: 300, shot: 'punchIn' })),
    { type: 'effect', at: beats(6), duration: 700, effect: 'impactRing', tone: 'violet', size: 18 },
    { type: 'effect', at: beats(6), duration: beats(5), effect: 'auraFlames', tone: 'violet', y: 93 },
    { type: 'caption', at: beats(6.5), duration: 2600, text: 'OPPA\nPANDA STYLE', style: 'slam', tone: 'gold' },
    // Heroic pose closes Act I
    { type: 'camera', at: beats(11), duration: beats(4), shot: 'heroLow' },
    { type: 'effect', at: beats(11), duration: beats(4), effect: 'beams', tone: 'gold' },
    { type: 'caption', at: beats(11.5), duration: 1600, text: 'ACT I CLEAR', style: 'stamp', tone: 'lime' },
  ],
})
