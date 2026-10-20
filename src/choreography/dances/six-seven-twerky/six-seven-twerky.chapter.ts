import { beats, defineChapter, repeat } from '../../chapter-helpers'

const LOOK = 900
const TURN = 1200
const MAIN = beats(6)
const WIND = beats(3)
const FAST = beats(2.5)
const FREEZE = 1400
const MAIN_AT = LOOK + TURN
const WIND_AT = MAIN_AT + MAIN
const FAST_AT = WIND_AT + WIND
const FREEZE_AT = FAST_AT + FAST

export const sixSevenTwerkyChapter = defineChapter({
  id: 'sixSevenTwerky',
  act: 'act3',
  title: '67 Twerky',
  subtitle: 'Back view unlocked. Absolutely no notes.',
  dance: 'sixSevenTwerky',
  theme: 'mythic',
  form: 'auraBeast',
  transition: 'puff',
  segments: [
    { move: 'twerkyLook', duration: LOOK, label: 'A · Arrogant look' },
    { move: 'twerkyTurn', duration: TURN, label: 'A · The turn (front → profile → back)' },
    { move: 'twerkyMain', duration: MAIN, label: 'B+C · Twerk + 67' },
    { move: 'twerkyWind', duration: WIND, label: 'B · Tempo variation' },
    { move: 'twerkyFast', duration: FAST, label: 'D · Faster, looking back' },
    { move: 'twerkyFreeze', duration: FREEZE, label: 'D · Freeze frame' },
  ],
  events: [
    { type: 'caption', at: 150, duration: 900, text: 'watch this.', style: 'aside', x: 58, y: 30 },
    { type: 'effect', at: LOOK + 300, duration: TURN - 300, effect: 'speedLines', tone: 'pink' },
    ...repeat(6, beats(1.5), MAIN_AT + beats(0.5), (at, i) => [
      { type: 'aura', at, amount: 22_067 },
      { type: 'caption', at, duration: 950, text: `×${(i + 1) * 67} COMBO`, style: 'pop', tone: i % 2 ? 'pink' : 'gold' },
      { type: 'effect', at, duration: 480, effect: 'burst', tone: 'pink', size: 6, x: i % 2 ? 36 : 64, y: 70 },
    ]),
    { type: 'caption', at: WIND_AT + 200, duration: 1300, text: 'tempo change', style: 'aside', x: 8, y: 30 },
    { type: 'camera', at: FAST_AT, duration: FAST, shot: 'rumble' },
    // D — the freeze
    { type: 'slowmo', at: FREEZE_AT, duration: 500, rate: 0.35 },
    { type: 'chad', at: FREEZE_AT + 80, duration: 600 },
    { type: 'effect', at: FREEZE_AT, duration: 220, effect: 'flash', tone: 'white' },
    { type: 'effect', at: FREEZE_AT, duration: 700, effect: 'impactRing', tone: 'pink', size: 26, y: 58 },
    { type: 'effect', at: FREEZE_AT, duration: FREEZE, effect: 'actionLines' },
    { type: 'camera', at: FREEZE_AT, duration: 380, shot: 'punchIn' },
    { type: 'aura', at: FREEZE_AT, amount: 67_067, ramp: 900 },
    { type: 'caption', at: FREEZE_AT + 100, duration: FREEZE - 100, text: '67 TWERKY — BACK VIEW UNLOCKED', style: 'banner', tone: 'pink' },
  ],
})
