import { beats, defineChapter } from '../chapter-helpers'

export const introChapter = defineChapter({
  id: 'intro',
  act: 'prologue',
  title: 'Tung Tung Tung CSSHUR',
  subtitle: 'A wooden legend in a panda onesie. Zero Tailwind.',
  theme: 'dojo',
  segments: [
    { move: 'introStrut', duration: beats(4), label: 'The arrival' },
    { move: 'eyebrowRaise', duration: beats(4), label: 'One eyebrow, raised' },
  ],
  events: [
    { type: 'caption', at: 300, duration: 3400, text: 'TUNG TUNG TUNG\nCSSHUR', style: 'title', tone: 'lime' },
    { type: 'caption', at: beats(5), duration: 1800, text: 'aura: 0 (for now)', style: 'aside' },
    { type: 'effect', at: beats(5.2), duration: 420, effect: 'snap', tone: 'white', x: 44, y: 22, size: 3 },
  ],
})
