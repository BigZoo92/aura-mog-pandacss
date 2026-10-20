import { auraHit, beats, defineChapter, repeat } from '../../chapter-helpers'

export const orangeJusticeChapter = defineChapter({
  id: 'orangeJustice',
  act: 'act1',
  title: 'Orange Justice',
  subtitle: 'Knees of the law',
  dance: 'orangeJustice',
  theme: 'citrus',
  transition: 'swipe',
  segments: [{ move: 'orangeJustice', duration: beats(12), label: 'Orange Justice' }],
  events: [
    ...repeat(4, beats(3), beats(1), (at) => auraHit(at, 1337)),
    ...repeat(6, beats(2), beats(0.5), (at, i) => ({
      type: 'effect',
      at,
      duration: 600,
      effect: 'burst',
      tone: 'orange',
      x: i % 2 ? 72 : 28,
      y: 48,
      size: 9,
    })),
    { type: 'effect', at: beats(4), duration: beats(6), effect: 'speedLines', tone: 'orange' },
    { type: 'caption', at: beats(9), duration: 2200, text: 'JUSTICE\nSERVED', style: 'slam', tone: 'orange' },
    { type: 'camera', at: beats(9), duration: 500, shot: 'shake' },
  ],
})
