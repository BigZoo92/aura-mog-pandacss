import { defineChapter } from '../../chapter-helpers'

const WINDUP = 600
const HIT = 400
const GHOSTS = 2400
const FLIP = 1300
const FINISH = 3800
const HIT_AT = WINDUP + HIT
const GHOSTS_AT = HIT_AT
const FLIP_AT = GHOSTS_AT + GHOSTS
const FINISH_AT = FLIP_AT + FLIP

export const dabSixSevenChapter = defineChapter({
  id: 'dabSixSeven',
  act: 'act4',
  title: 'Dab + 67 + The Finger',
  subtitle: 'Four arms. Zero restraint.',
  dance: 'dabSixSeven',
  theme: 'domain',
  form: 'auraBeast',
  transition: 'flash',
  segments: [
    { move: 'dabWindup', duration: WINDUP, label: 'Anticipation' },
    { move: 'dabHit', duration: HIT, label: 'A · DAB' },
    { move: 'dabGhosts', duration: GHOSTS, label: 'B · Ghost arms 67' },
    { move: 'dabMiddleFinger', duration: FLIP, label: 'C · The finger' },
    { move: 'dabFinale', duration: FINISH, form: 'gigaPandaChad', label: 'D · Finisher (Giga Chad)' },
  ],
  events: [
    { type: 'effect', at: HIT_AT, duration: 600, effect: 'impactRing', tone: 'violet', size: 22, y: 40 },
    { type: 'camera', at: HIT_AT, duration: 350, shot: 'punchIn' },
    { type: 'caption', at: HIT_AT, duration: 1400, text: 'DAB', style: 'pop', tone: 'violet', x: 10, y: 24 },
    { type: 'aura', at: HIT_AT, amount: 67_000 },
    { type: 'effect', at: GHOSTS_AT + 250, duration: 700, effect: 'smoke', y: 40 },
    { type: 'caption', at: GHOSTS_AT + 500, duration: 1600, text: 'he does not have\nenough arms for this', style: 'aside' },
    { type: 'aura', at: GHOSTS_AT + 900, amount: 167_167, ramp: 800 },
    { type: 'caption', at: GHOSTS_AT + 900, duration: 1100, text: '+167,167 AURA', style: 'pop', tone: 'lime' },
    // C — the finger
    { type: 'effect', at: FLIP_AT + 300, duration: 500, effect: 'burst', tone: 'gold', size: 10, x: 64, y: 12 },
    { type: 'caption', at: FLIP_AT + 250, duration: 1000, text: 'TO TAILWIND,\nWITH LOVE', style: 'pop', tone: 'gold', x: 70, y: 36 },
    // D — the finisher
    { type: 'slowmo', at: FINISH_AT, duration: 600, rate: 0.25 },
    { type: 'effect', at: FINISH_AT, duration: 900, effect: 'invert' },
    { type: 'effect', at: FINISH_AT, duration: 800, effect: 'impactRing', tone: 'gold', size: 20, y: 40 },
    { type: 'effect', at: FINISH_AT + 150, duration: 900, effect: 'impactRing', tone: 'violet', size: 30, y: 40 },
    { type: 'effect', at: FINISH_AT + 300, duration: 1000, effect: 'impactRing', tone: 'cyan', size: 40, y: 40 },
    { type: 'effect', at: FINISH_AT + 200, duration: 1100, effect: 'shockwave', tone: 'violet', size: 34, y: 50 },
    { type: 'effect', at: FINISH_AT, duration: 900, effect: 'silhouette' },
    { type: 'camera', at: FINISH_AT + 600, duration: 600, shot: 'shake' },
    { type: 'gaugeBurst', at: FINISH_AT + 600 },
    { type: 'aura', at: FINISH_AT + 600, amount: 1_337_000, ramp: 1500 },
    { type: 'caption', at: FINISH_AT + 400, duration: 1700, text: 'UNLIMITED CSS TECHNIQUE', style: 'banner', tone: 'gold' },
    { type: 'caption', at: FINISH_AT + 2000, duration: 1800, text: 'DOMAIN EXPANSION:\nTYPE SAFE AURA', style: 'slam', tone: 'violet' },
  ],
})
