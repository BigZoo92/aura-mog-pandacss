import { auraHit, beats, defineChapter, repeat } from '../../chapter-helpers'

const FRONT = 3500
const TURN = 800
const BACK = 4000
const TURN_AT = FRONT
const BACK_AT = FRONT + TURN
const FLEX_AT = BACK_AT + BACK

export const griddySixSevenChapter = defineChapter({
  id: 'griddySixSeven',
  act: 'act3',
  title: 'Griddy 67 Backshot',
  subtitle: 'Forbidden technique: the Griddy, facing away',
  dance: 'griddySixSeven',
  theme: 'violet',
  form: 'auraBeast',
  transition: 'flash',
  segments: [
    { move: 'griddyFront', duration: FRONT, label: 'A · Front Griddy + 67' },
    { move: 'griddyTurn', duration: TURN, label: 'B · The turn' },
    { move: 'griddyBack', duration: BACK, label: 'C · Back Griddy + 67' },
    { move: 'griddyFlex', duration: 3200, label: 'D · The flex' },
  ],
  events: [
    { type: 'caption', at: 0, duration: 2400, text: 'ACT III\nFORBIDDEN BRAINROT TECHNIQUES', style: 'title', tone: 'violet' },
    ...repeat(3, beats(2), beats(1), (at) => auraHit(at, 6767)),
    // B — the turn
    { type: 'camera', at: TURN_AT, duration: TURN, shot: 'spin' },
    { type: 'effect', at: TURN_AT, duration: TURN, effect: 'speedLines', tone: 'violet' },
    { type: 'effect', at: TURN_AT + 380, duration: 500, effect: 'smoke', y: 88 },
    // C — facing away
    { type: 'caption', at: BACK_AT + 300, duration: 1600, text: 'wait… he’s facing AWAY?!', style: 'aside' },
    ...repeat(4, beats(2), BACK_AT + beats(0.5), (at) => auraHit(at, 16767)),
    { type: 'effect', at: BACK_AT, duration: BACK, effect: 'auraFlames', tone: 'violet', y: 92 },
    // D — the flex
    { type: 'camera', at: FLEX_AT, duration: 3200, shot: 'heroLow' },
    { type: 'effect', at: FLEX_AT, duration: 700, effect: 'impactRing', tone: 'violet', size: 26, y: 45 },
    { type: 'effect', at: FLEX_AT, duration: 3200, effect: 'beams', tone: 'violet' },
    { type: 'chad', at: FLEX_AT + 500, duration: 650 },
    { type: 'caption', at: FLEX_AT + 200, duration: 2900, text: 'GRIDDY 67 BACKSHOT EDITION', style: 'banner', tone: 'violet' },
    { type: 'caption', at: FLEX_AT + 1300, duration: 1900, text: 'ILLEGAL AURA\nTECHNIQUE', style: 'stamp', tone: 'orange' },
    { type: 'aura', at: FLEX_AT + 500, amount: 67_067, ramp: 1400 },
    { type: 'caption', at: FLEX_AT + 600, duration: 1500, text: '×67 MULTIPLIER', style: 'pop', tone: 'gold', x: 8, y: 30 },
  ],
})
