import { auraHit, beats, defineChapter } from '../../chapter-helpers'

/** The Woah lands at the end of the 300 ms hit segment. */
const HIT = beats(6) + 500 + 300

export const sixSevenWoahChapter = defineChapter({
  id: 'sixSevenWoah',
  act: 'act2',
  title: 'Six Seven Woah',
  subtitle: 'Weighing two choices, choosing violence',
  dance: 'sixSevenWoah',
  theme: 'impact',
  transition: 'swipe',
  segments: [
    { move: 'sixSeven', duration: beats(3), label: '67 · slow' },
    { move: 'sixSevenFast', duration: beats(3), label: '67 · fast' },
    { move: 'woahWindup', duration: 500, label: 'Woah · anticipation' },
    { move: 'woahHit', duration: 300, form: 'auraBeast', label: 'Woah · hit' },
    { move: 'woahHold', duration: 1700, form: 'auraBeast', label: 'Woah · freeze' },
    { move: 'sixSeven', duration: 1500, form: 'auraBeast', label: '67 · victory lap' },
  ],
  events: [
    { type: 'caption', at: 200, duration: 1000, text: 'SIX', style: 'pop', tone: 'white', x: 14, y: 34 },
    { type: 'caption', at: 500, duration: 1000, text: 'SEVEN', style: 'pop', tone: 'white', x: 70, y: 34 },
    ...auraHit(beats(2), 6767),
    // The hit — anticipation, a fast impact and a powerful hold
    { type: 'slowmo', at: beats(6), duration: 500, rate: 0.6 },
    { type: 'camera', at: HIT, duration: 1600, shot: 'punchIn' },
    { type: 'camera', at: HIT, duration: 450, shot: 'shake' },
    { type: 'effect', at: HIT, duration: 240, effect: 'flash', tone: 'white' },
    { type: 'effect', at: HIT, duration: 700, effect: 'impactRing', tone: 'gold', size: 22, y: 42 },
    { type: 'effect', at: HIT + 80, duration: 800, effect: 'impactRing', tone: 'violet', size: 30, y: 42 },
    { type: 'effect', at: HIT, duration: 1600, effect: 'actionLines' },
    { type: 'caption', at: HIT + 60, duration: 1700, text: 'WOAH!!!', style: 'slam', tone: 'gold' },
    { type: 'chad', at: HIT + 300, duration: 550 },
    { type: 'aura', at: HIT, amount: 13337, ramp: 900 },
    { type: 'caption', at: HIT + 400, duration: 1300, text: '+13,337 AURA', style: 'pop', tone: 'lime' },
    { type: 'effect', at: HIT + 1700, duration: 520, effect: 'smoke', y: 70 },
  ],
})
