import { auraHit, beats, defineChapter, repeat } from '../../chapter-helpers'

export const scubaChapter = defineChapter({
  id: 'scuba',
  act: 'act2',
  title: 'Scuba',
  subtitle: 'Holding breath, farming aura',
  dance: 'scuba',
  theme: 'abyss',
  transition: 'puff',
  segments: [
    { move: 'scubaDive', duration: beats(6), label: 'Scuba · pinch & wave' },
    { move: 'scubaSwitch', duration: beats(6), label: 'Scuba · switch hands' },
  ],
  events: [
    ...repeat(2, beats(6), beats(2), (at) => auraHit(at, 4200)),
    { type: 'caption', at: beats(4), duration: 2600, text: 'DEEP SEA\nAURA', style: 'slam', tone: 'cyan' },
    { type: 'effect', at: beats(4), duration: 900, effect: 'shockwave', tone: 'cyan', size: 20, y: 50 },
    { type: 'caption', at: beats(8.5), duration: 1700, text: 'he has not breathed in 6 seconds', style: 'aside' },
  ],
})
