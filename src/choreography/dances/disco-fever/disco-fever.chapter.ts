import { auraHit, beats, defineChapter, repeat } from '../../chapter-helpers'

export const discoFeverChapter = defineChapter({
  id: 'discoFever',
  act: 'act1',
  title: 'Disco Fever',
  subtitle: "Stayin' aura-live",
  dance: 'discoFever',
  theme: 'disco',
  transition: 'flash',
  segments: [
    { move: 'discoRight', duration: beats(6), label: 'Disco · right point' },
    { move: 'discoLeft', duration: beats(6), label: 'Disco · left point' },
  ],
  events: [
    ...repeat(2, beats(6), beats(2), (at) => auraHit(at, 6700)),
    ...repeat(6, beats(2), 0, (at) => ({ type: 'effect', at, duration: 520, effect: 'sparks', tone: 'gold', x: 64, y: 22 })),
    { type: 'caption', at: beats(4), duration: 2600, text: "STAYIN'\nAURA-LIVE", style: 'slam', tone: 'violet' },
    { type: 'camera', at: beats(6), duration: beats(4), shot: 'dutch' },
  ],
})
