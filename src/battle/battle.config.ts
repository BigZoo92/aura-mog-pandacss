import type { TimelineEvent } from '../animation/timeline/timeline.types'
import { defineChapter } from '../choreography/chapter-helpers'
import { DODGE_PEAKS } from './battle.tracks'

/**
 * THE FINAL BOSS — Tailwind CSS (a friendly caricature).
 * Boss behaviour is part of the same timeline as everything else: the boss
 * phase comes from the segment, its health from `bossDamage` events.
 */
const ENTER = 2200
const TAUNT = 1800
const DODGE = 3600
const SNIPPET = 700
const BLAST = 1600
const DODGE_AT = ENTER + TAUNT
const COUNTER_AT = DODGE_AT + DODGE
const BLAST_AT = COUNTER_AT + SNIPPET * 5

/** Projectile flight: they cross Tung Tung at 40% of their flight. */
const FLIGHT = 900
const CROSS = 0.4

const VOLLEY: { label: string; lane: number }[] = [
  { label: 'flex', lane: 30 },
  { label: 'items-center', lane: 44 },
  { label: 'justify-center', lane: 82 },
  { label: 'rotate-12', lane: 40 },
  { label: 'md:hover:scale-110', lane: 36 },
]

const projectiles: TimelineEvent[] = VOLLEY.flatMap((shot, i) => {
  const at = DODGE_AT + Math.round((DODGE_PEAKS[i] ?? 0) * DODGE - CROSS * FLIGHT)
  return [
    { type: 'projectile', at, duration: FLIGHT, label: shot.label, lane: shot.lane },
    ...(i === 4
      ? [{ type: 'projectile', at: at + 120, duration: FLIGHT, label: 'animate-bounce', lane: 56 } as const]
      : []),
  ]
})

const SNIPPETS = ['MINI FLOSS', 'GRIDDY STEP', '67', 'CHAD JAWLINE', 'DAB'] as const

const counterHits: TimelineEvent[] = SNIPPETS.flatMap((name, i) => {
  const at = COUNTER_AT + i * SNIPPET + 200
  return [
    { type: 'bossDamage', at, amount: 13 },
    { type: 'effect', at, duration: 500, effect: 'impactRing', tone: 'lime', size: 12, x: 76, y: 44 },
    { type: 'effect', at, duration: 420, effect: 'burst', tone: 'gold', size: 7, x: 76, y: 44 },
    { type: 'caption', at: at - 150, duration: 650, text: name, style: 'pop', tone: 'lime', x: 8, y: 22 + (i % 2) * 8 },
    { type: 'aura', at, amount: 6767, ramp: 200 },
  ]
})

export const bossBattleChapter = defineChapter({
  id: 'bossBattle',
  act: 'finalBoss',
  title: 'Final Boss: Tailwind CSS',
  subtitle: 'Utility class overload',
  theme: 'boss',
  form: 'gigaPandaChad',
  boss: true,
  transition: 'flash',
  segments: [
    { move: 'bossStare', duration: ENTER, form: 'brainrot', boss: 'enter', label: 'A new challenger' },
    { move: 'bossStare', duration: TAUNT, form: 'brainrot', boss: 'taunt', label: 'Utility class overload' },
    { move: 'bossDodge', duration: DODGE, form: 'brainrot', boss: 'attack', label: 'Dodging the barrage' },
    { move: 'flossRight', duration: SNIPPET, form: 'auraBeast', boss: 'hurt', label: 'Counter · mini Floss' },
    { move: 'griddyFront', duration: SNIPPET, form: 'auraBeast', boss: 'hurt', label: 'Counter · Griddy step' },
    { move: 'sixSeven', duration: SNIPPET, form: 'auraBeast', boss: 'hurt', label: 'Counter · 67' },
    { move: 'shhMogged', duration: SNIPPET, boss: 'hurt', label: 'Counter · Chad jawline' },
    { move: 'dabHold', duration: SNIPPET, boss: 'hurt', label: 'Counter · Dab' },
    { move: 'auraBlast', duration: BLAST, boss: 'ko', label: 'AURA BLAST — KO' },
  ],
  events: [
    { type: 'comboBreak', at: 0 },
    { type: 'caption', at: 100, duration: 2100, text: 'A NEW CHALLENGER APPROACHES', style: 'announce', tone: 'orange' },
    { type: 'effect', at: ENTER - 300, duration: 400, effect: 'flash', tone: 'cyan' },
    { type: 'caption', at: ENTER, duration: 1700, text: 'TAILWIND CSS', style: 'slam', tone: 'cyan' },
    { type: 'caption', at: ENTER + 500, duration: 1300, text: 'UTILITY CLASS\nOVERLOAD', style: 'pop', tone: 'cyan', x: 62, y: 16 },
    ...projectiles,
    ...DODGE_PEAKS.map(
      (peak): TimelineEvent => ({ type: 'camera', at: DODGE_AT + Math.round(peak * DODGE), duration: 220, shot: 'shake' }),
    ),
    { type: 'caption', at: COUNTER_AT - 400, duration: 1200, text: 'MY TURN.', style: 'pop', tone: 'gold', x: 22, y: 26 },
    ...counterHits,
    // KO
    { type: 'effect', at: BLAST_AT + 850, duration: 1100, effect: 'shockwave', tone: 'lime', size: 44, x: 64, y: 48 },
    { type: 'effect', at: BLAST_AT + 850, duration: 260, effect: 'flash', tone: 'white' },
    { type: 'effect', at: BLAST_AT + 850, duration: 700, effect: 'speedLines', tone: 'gold' },
    { type: 'camera', at: BLAST_AT + 850, duration: 700, shot: 'shake' },
    { type: 'camera', at: BLAST_AT + 850, duration: 750, shot: 'recoil' },
    { type: 'bossDamage', at: BLAST_AT + 850, amount: 100, ramp: 500 },
    { type: 'caption', at: BLAST_AT + 950, duration: 1500, text: 'AURAMOGGED', style: 'slam', tone: 'lime' },
  ],
})
