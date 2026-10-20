import { auraHit, beats, defineChapter, repeat } from '../../chapter-helpers'

export const freshChapter = defineChapter({
  id: 'fresh',
  act: 'act1',
  title: 'Fresh',
  subtitle: 'Now this is a story all about aura',
  dance: 'fresh',
  theme: 'retro',
  transition: 'flash',
  segments: [{ move: 'fresh', duration: beats(12), label: 'Fresh · side-step' }],
  events: [
    ...repeat(4, beats(3), beats(1), (at) => auraHit(at, 420, '+420 FRESHNESS')),
    { type: 'caption', at: beats(7), duration: 2400, text: 'FRESHNESS\n+420', style: 'slam', tone: 'pink' },
    { type: 'effect', at: beats(7), duration: 600, effect: 'impactRing', tone: 'pink', size: 16 },
    { type: 'camera', at: beats(7), duration: 450, shot: 'punchIn' },
    { type: 'caption', at: beats(2), duration: 1800, text: 'Est. 1990', style: 'aside' },
  ],
})
