import type { TimelineEvent } from '../animation/timeline/timeline.types'
import { defineChapter } from '../choreography/chapter-helpers'
import { SEAT } from './seat'
import {
  ARGUMENTS,
  CARD_DELAY,
  EXHALE_AT,
  FINAL_PUFF_DURATION,
  KING_BEATS,
  KING_DURATION,
  PUFF_BEATS,
  REVEAL_AT,
  REVEAL_DURATION,
  VERDICT_AT,
  VERDICT_LINES,
} from './smoke/smoke.config'

/**
 * ACT V — THE FINAL PUFF. Four chapters, so Next / Previous lands on each scene.
 * Everything is regular timeline data: segments (moves), events (captions,
 * camera, aura, slow motion). The smoke reads its own timings from
 * `smoke.config.ts`, relative to the start of "finalPuff".
 */

/** Where the knocked-out boss lies, as a percentage of the stage (for impact effects). */
const SEAT_EFFECT = { x: 58, y: 84 }

// --- Scene 1 — Tailwind is down ----------------------------------------------------
const CRASH = 1100
const GLOAT = 1500
const STROLL = 1800
const SIT = 1700

export const tailwindDownChapter = defineChapter({
  id: 'tailwindDown',
  act: 'act5',
  title: 'Tailwind Is Down',
  subtitle: 'An eerie, aura-heavy silence',
  theme: 'aftermath',
  boss: true,
  bossBar: true,
  form: 'brainrot',
  transition: 'cut',
  segments: [
    { move: 'insolentVictory', duration: CRASH, boss: 'crash', label: 'Tailwind crashes down' },
    { move: 'insolentVictory', duration: GLOAT, boss: 'down', label: 'Insolent victory pose' },
    { move: 'strollToSeat', duration: STROLL, boss: 'down', label: 'A casual stroll' },
    { move: 'sitDown', duration: SIT, boss: 'down', label: 'Takes a seat. On Tailwind.' },
  ],
  events: [
    { type: 'comboBreak', at: 0 },
    { type: 'caption', at: 800, duration: 2200, text: 'ACT V\nTHE FINAL PUFF', style: 'title', tone: 'pink' },
    { type: 'effect', at: 650, duration: 600, effect: 'smoke', ...SEAT_EFFECT },
    { type: 'camera', at: 650, duration: 300, shot: 'shake' },
    { type: 'caption', at: CRASH + 300, duration: 1100, text: 'K.O.', style: 'pop', tone: 'cyan', x: 70, y: 64 },
    { type: 'effect', at: CRASH + GLOAT + STROLL + 1100, duration: 500, effect: 'smoke', ...SEAT_EFFECT },
    {
      type: 'caption',
      at: CRASH + GLOAT + STROLL + 900,
      duration: 2200,
      text: 'BRO REALLY PICKED TAILWIND 💀',
      style: 'aside',
      x: 6,
      y: 18,
    },
  ],
})

// --- Scenes 2–4 — the JNR, the dramatic puff, the exhale -----------------------------
const P = PUFF_BEATS

export const finalPuffChapter = defineChapter({
  id: 'finalPuff',
  act: 'act5',
  title: 'The Final Puff',
  subtitle: 'Just. No. Reason.',
  theme: 'lounge',
  boss: true,
  bossBar: false,
  form: 'brainrot',
  transition: 'cut',
  segments: [
    { move: 'pullJnr', duration: P.pull, boss: 'down', label: 'Pulls out the JNR' },
    { move: 'lookAtJnr', duration: P.look, boss: 'down', label: 'Admires it' },
    { move: 'bringToMouth', duration: P.toMouth, boss: 'down', label: 'To the lips' },
    { move: 'inhale', duration: P.inhale, boss: 'down', label: 'The slow pull' },
    { move: 'holdBreath', duration: P.hold, boss: 'down', label: 'Holds it… stares at you' },
    { move: 'exhale', duration: P.exhale, boss: 'down', label: 'THE EXHALE' },
  ],
  events: [
    { type: 'caption', at: 200, duration: 900, text: '*unzips pocket*', style: 'aside', x: 6, y: 70 },
    // Calm before the storm: nothing during the inhale. Then a held breath.
    { type: 'slowmo', at: EXHALE_AT - P.hold, duration: P.hold, rate: 0.6 },
    { type: 'camera', at: EXHALE_AT - P.hold, duration: P.hold + 2600, shot: 'heroLow' },
    { type: 'effect', at: EXHALE_AT + 150, duration: 500, effect: 'shockwave', tone: 'pink', size: 24, x: 58, y: 36 },
    { type: 'camera', at: EXHALE_AT + 100, duration: 420, shot: 'shake' },
  ],
})

// --- Scene 5 — the smoke reveals Panda CSS --------------------------------------------
/** Times in this chapter, converted from smoke-origin times. */
const inReveal = (originTime: number) => originTime - REVEAL_AT

export const smokeRevealChapter = defineChapter({
  id: 'smokeReveal',
  act: 'act5',
  title: 'Smoke Signals',
  subtitle: 'The smoke has something to say',
  theme: 'lounge',
  boss: true,
  bossBar: false,
  form: 'brainrot',
  transition: 'cut',
  segments: [{ move: 'smokeLounge', duration: REVEAL_DURATION, boss: 'down', label: 'Seven arguments + the verdict' }],
  events: [
    // Each argument that condenses out of the smoke adds a little aura.
    ...ARGUMENTS.map((argument): TimelineEvent => ({ type: 'aura', at: inReveal(argument.at) + 600, amount: 6767, ramp: 300 })),
    { type: 'camera', at: inReveal(VERDICT_AT), duration: REVEAL_DURATION - inReveal(VERDICT_AT), shot: 'punchIn' },
    {
      type: 'aura',
      at: inReveal((VERDICT_LINES.find((l) => l.kind === 'hero') ?? VERDICT_LINES[0]!).at),
      amount: 67_000,
      ramp: 800,
    },
  ],
})

// --- Scene 6 — the final shot ----------------------------------------------------------
const CHAD_AT = KING_BEATS.lower + 200

export const auraKingChapter = defineChapter({
  id: 'auraKing',
  act: 'act5',
  title: 'The Aura King',
  subtitle: 'Tung Tung Tung CSSHUR, enthroned',
  theme: 'victory',
  boss: true,
  bossBar: false,
  form: 'brainrot',
  transition: 'cut',
  segments: [
    { move: 'kingLowerAndLook', duration: KING_BEATS.lower, boss: 'down', label: 'Lowers the JNR, looks up' },
    { move: 'auraKingPose', duration: KING_BEATS.pose, boss: 'down', label: 'Giga Tung Chad — dramatic pause' },
  ],
  events: [
    { type: 'slowmo', at: CHAD_AT - 100, duration: 900, rate: 0.4 },
    { type: 'chad', at: CHAD_AT, duration: 700 },
    { type: 'camera', at: CHAD_AT, duration: 900, shot: 'punchIn' },
    { type: 'effect', at: CHAD_AT, duration: 900, effect: 'beams', tone: 'gold' },
    { type: 'effect', at: CARD_DELAY, duration: 260, effect: 'flash', tone: 'white' },
    { type: 'effect', at: CARD_DELAY, duration: 900, effect: 'impactRing', tone: 'gold', size: 30, x: 58, y: 48 },
    { type: 'aura', at: CARD_DELAY, amount: 999_999, ramp: 1600 },
  ],
})

export const FINALE_CHAPTERS = [tailwindDownChapter, finalPuffChapter, smokeRevealChapter, auraKingChapter] as const

/** Chapters during which the smoke layer is mounted. */
export const SMOKE_CHAPTERS = new Set(['finalPuff', 'smokeReveal', 'auraKing'])

// Sanity: the chapter lengths ARE the smoke config's beats.
export const FINALE_DURATIONS = {
  finalPuff: FINAL_PUFF_DURATION,
  smokeReveal: REVEAL_DURATION,
  auraKing: KING_DURATION,
} as const

export { CARD_DELAY, SEAT }
