import { defineChapter } from '../../chapter-helpers'

const STILL = 800
const RAISE = 1400
const HOLD = 1000
const TRACE = 2400
const MOG = 3400
const TRACE_AT = STILL + RAISE + HOLD
const MOG_AT = TRACE_AT + TRACE

export const shhJawlineChapter = defineChapter({
  id: 'shhJawline',
  act: 'act4',
  title: 'Shhh into Jawline',
  subtitle: 'The quietest aura in recorded history',
  dance: 'shhJawline',
  theme: 'golden',
  transition: 'flash',
  segments: [
    { move: 'shhStill', duration: STILL, label: 'Dead stop' },
    { move: 'shhRaise', duration: RAISE, label: 'Finger to the lips' },
    { move: 'shhHold', duration: HOLD, label: 'Shhh…' },
    { move: 'shhTrace', duration: TRACE, label: 'Jawline trace (transformation)' },
    { move: 'shhMogged', duration: MOG, form: 'gigaPandaChad', formEntrance: 'instant', label: 'MOGGED' },
  ],
  events: [
    { type: 'comboBreak', at: 0 },
    { type: 'caption', at: 0, duration: 2600, text: 'ACT IV\nTHE ULTIMATE AURAMOGGING', style: 'title', tone: 'gold' },
    { type: 'caption', at: STILL + RAISE + 200, duration: 1100, text: 'shhh…', style: 'aside', x: 58, y: 40 },
    // Massive slow push-in to the face, through the whole gesture
    { type: 'camera', at: STILL + RAISE, duration: HOLD + TRACE + 900, shot: 'pushFace' },
    { type: 'slowmo', at: TRACE_AT + 900, duration: 1500, rate: 0.45 },
    { type: 'effect', at: TRACE_AT + 600, duration: TRACE, effect: 'beams', tone: 'gold' },
    // MOGGED: the background explodes
    { type: 'effect', at: MOG_AT, duration: 260, effect: 'flash', tone: 'gold' },
    { type: 'effect', at: MOG_AT, duration: 800, effect: 'impactRing', tone: 'gold', size: 30, y: 40 },
    { type: 'effect', at: MOG_AT + 120, duration: 900, effect: 'shockwave', tone: 'gold', size: 26, y: 45 },
    { type: 'effect', at: MOG_AT, duration: MOG, effect: 'auraFlames', tone: 'gold', y: 93 },
    { type: 'effect', at: MOG_AT, duration: MOG, effect: 'actionLines' },
    { type: 'camera', at: MOG_AT + 900, duration: 1400, shot: 'zoomOut' },
    { type: 'camera', at: MOG_AT, duration: 500, shot: 'shake' },
    { type: 'caption', at: MOG_AT + 150, duration: 3100, text: 'MOGGED', style: 'stamp', tone: 'gold' },
    { type: 'aura', at: MOG_AT, amount: 420_000, ramp: 2400 },
    { type: 'caption', at: MOG_AT + 600, duration: 1800, text: '+420,000 AURA', style: 'pop', tone: 'gold', x: 64, y: 22 },
  ],
})
