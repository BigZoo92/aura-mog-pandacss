import { auraHit, beats, defineChapter, repeat } from '../../chapter-helpers'

export const flossChapter = defineChapter({
  id: 'floss',
  act: 'act1',
  title: 'Floss',
  subtitle: 'Dental hygiene for the soul',
  dance: 'floss',
  theme: 'dojo',
  transition: 'puff',
  segments: [
    { move: 'flossRight', duration: beats(6), label: 'Floss · right side' },
    { move: 'flossLeft', duration: beats(6), label: 'Floss · switch sides' },
  ],
  events: [
    { type: 'caption', at: 0, duration: 2200, text: 'ACT I\nTHE AURA FARMING BEGINS', style: 'title', tone: 'lime' },
    ...repeat(6, beats(2), beats(1), (at) => auraHit(at, 67)),
    ...repeat(6, beats(2), beats(1), (at) => ({ type: 'effect', at, duration: 700, effect: 'sparks', tone: 'lime', y: 60 })),
    { type: 'caption', at: beats(5), duration: 1600, text: 'FIRST COMBO!', style: 'aside' },
    { type: 'camera', at: beats(6), duration: 400, shot: 'punchIn' },
  ],
})
