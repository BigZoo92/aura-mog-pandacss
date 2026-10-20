import type { TimelineEvent } from '../../../animation/timeline/timeline.types'
import { beats, defineChapter, repeat } from '../../chapter-helpers'

/** One snap per beat: +67 aura, a tiny starburst near each hand, a "SNAP" pop. */
const snap = (at: number, index: number): TimelineEvent[] => {
  const travel = at < beats(6) ? -3 + (at / beats(6)) * 6 : 3 - ((at - beats(6)) / beats(6)) * 6
  const x = 50 + travel * 1.15
  return [
    { type: 'aura', at, amount: 67, ramp: 120 },
    { type: 'effect', at, duration: 380, effect: 'snap', tone: 'gold', x: x - 10, y: 60, size: 3 },
    { type: 'effect', at, duration: 380, effect: 'snap', tone: 'gold', x: x + 10, y: 60, size: 3 },
    ...(index % 3 === 0
      ? [{ type: 'caption', at, duration: 900, text: 'SNAP +67', style: 'pop', tone: 'gold', x: index % 2 ? 70 : 18, y: 40 } as const]
      : []),
  ]
}

export const westSideStoryChapter = defineChapter({
  id: 'westSideStory',
  act: 'act2',
  title: 'West Side Story',
  subtitle: 'When you’re a Panda, you’re a Panda all the way',
  dance: 'westSideStory',
  theme: 'urban',
  transition: 'swipe',
  segments: [
    { move: 'westSideRight', duration: beats(6), label: 'Snap walk · right' },
    { move: 'westSideLeft', duration: beats(6), label: 'Snap walk · left' },
  ],
  events: [
    { type: 'caption', at: 0, duration: 2400, text: 'ACT II\nTHE MEME MULTIVERSE', style: 'title', tone: 'cyan' },
    ...repeat(12, beats(1), 0, snap),
  ],
})
