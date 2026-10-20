import { buildTimeline } from '../src/animation/timeline/timeline'
import type { ChapterConfig } from '../src/animation/timeline/timeline.types'

/**
 * A small, hand-checkable show:
 *
 *   chapter A  [0, 3000)     segments 0–1000 idle, 1000–3000 flossRight
 *   chapter B  [3000, 6000)  segments 3000–4500 flossLeft (auraBeast), 4500–6000 idle (giga)
 *   chapter C  [6000, 8000)  boss
 */
export const FIXTURE_CHAPTERS: ChapterConfig[] = [
  {
    id: 'intro',
    act: 'prologue',
    title: 'A',
    subtitle: 'first',
    theme: 'dojo',
    segments: [
      { move: 'idle', duration: 1000 },
      { move: 'flossRight', duration: 2000 },
    ],
    events: [
      { type: 'aura', at: 500, amount: 67, ramp: 0 },
      { type: 'aura', at: 1500, amount: 100, ramp: 1000 },
      { type: 'caption', at: 1200, duration: 800, text: '+67 AURA', style: 'pop' },
      { type: 'chad', at: 2000, duration: 500 },
      { type: 'camera', at: 2500, duration: 300, shot: 'shake' },
    ],
  },
  {
    id: 'floss',
    act: 'act1',
    title: 'B',
    subtitle: 'second',
    theme: 'citrus',
    form: 'auraBeast',
    segments: [
      { move: 'flossLeft', duration: 1500 },
      { move: 'idle', duration: 1500, form: 'gigaPandaChad' },
    ],
    events: [
      { type: 'aura', at: 100, amount: 1000, ramp: 0 },
      { type: 'slowmo', at: 1000, duration: 1000, rate: 0.25 },
      { type: 'comboBreak', at: 2900 },
    ],
  },
  {
    id: 'bossBattle',
    act: 'finalBoss',
    title: 'C',
    subtitle: 'boss',
    theme: 'boss',
    boss: true,
    segments: [{ move: 'idle', duration: 2000 }],
    events: [
      { type: 'bossDamage', at: 500, amount: 40, ramp: 0 },
      { type: 'bossDamage', at: 1500, amount: 80, ramp: 0 },
      { type: 'aura', at: 1800, amount: 999_999, ramp: 0 },
      { type: 'gaugeBurst', at: 1900 },
    ],
  },
]

export const fixtureTimeline = () => buildTimeline(FIXTURE_CHAPTERS)
