import { describe, expect, it } from 'vitest'
import { auraAt } from '../src/animation/timeline/scoring'
import { sceneAt } from '../src/animation/timeline/scene'
import { SHOW_TIMELINE } from '../src/choreography/choreography.config'
import { CARD_DELAY, FINALE_DURATIONS } from '../src/finale/finale.config'
import { EXHALE_POSE, SMOKE_ORIGIN, seatedMouth } from '../src/finale/seat'
import {
  ARGUMENT_LIFE,
  ARGUMENTS,
  EXHALE_AT,
  FINAL_PUFF_DURATION,
  KING_AT,
  MASSES,
  REVEAL_AT,
  REVEAL_DURATION,
  STREAM,
  VERDICT_AT,
  VERDICT_END,
  VERDICT_LINES,
} from '../src/finale/smoke/smoke.config'
import { smokeKeyframes } from '../src/finale/smoke/smoke.keyframes'
import {
  argumentPhase,
  currentArgumentAt,
  legibleArgumentsAt,
  verdictLinesAt,
  verdictPhase,
} from '../src/finale/smoke/smoke.state'

const chapter = (id: string) => {
  const found = SHOW_TIMELINE.chapters.find((c) => c.config.id === id)
  if (!found) throw new Error(`missing chapter ${id}`)
  return found
}

describe('Act V — chapter structure', () => {
  it('chapter lengths are exactly the smoke config beats', () => {
    expect(chapter('finalPuff').duration).toBe(FINALE_DURATIONS.finalPuff)
    expect(chapter('smokeReveal').duration).toBe(FINALE_DURATIONS.smokeReveal)
    expect(chapter('auraKing').duration).toBe(FINALE_DURATIONS.auraKing)
  })

  it('the smoke origin (finalPuff start) maps config time onto show time', () => {
    const origin = chapter('finalPuff').start
    expect(chapter('smokeReveal').start - origin).toBe(REVEAL_AT)
    expect(chapter('auraKing').start - origin).toBe(KING_AT)
  })

  it('Tailwind lies knocked out at 0% health for the whole act', () => {
    for (const id of ['tailwindDown', 'finalPuff', 'smokeReveal', 'auraKing']) {
      const c = chapter(id)
      expect(sceneAt(SHOW_TIMELINE, c.start + 1500).segment.boss).toMatch(/crash|down/)
    }
  })

  it('the final +999 999 aura lands when the final card appears', () => {
    const cardAt = chapter('auraKing').start + CARD_DELAY
    const before = auraAt(SHOW_TIMELINE, cardAt - 1)
    expect(auraAt(SHOW_TIMELINE, cardAt + 5000) - before).toBe(999_999)
  })
})

describe('Act V — seeking reconstructs the scene', () => {
  const origin = chapter('finalPuff').start

  it('seeking into the exhale shows the exhale move with the JNR', () => {
    const scene = sceneAt(SHOW_TIMELINE, origin + EXHALE_AT + 400)
    expect(scene.segment.move).toBe('exhale')
    expect(scene.chapter.config.id).toBe('finalPuff')
  })

  it('seeking into the middle of the reveal lands on the right argument', () => {
    const tokens = ARGUMENTS.find((a) => a.id === 'tokens')!
    expect(currentArgumentAt(tokens.at + 1500)?.title).toBe('DESIGN TOKENS')
    // …and seeking backwards gives back the earlier argument.
    const recipes = ARGUMENTS.find((a) => a.id === 'recipes')!
    expect(currentArgumentAt(recipes.at + 1500)?.title).toBe('COMPOSABLE RECIPES')
  })

  it('arguments already revealed disappear again when seeking back before them', () => {
    for (const argument of ARGUMENTS) {
      expect(argumentPhase(argument, argument.at - 1)).toBe('hidden')
      expect(argumentPhase(argument, argument.at + ARGUMENT_LIFE.total + 1)).toBe('gone')
    }
  })
})

describe('Act V — smoke geometry', () => {
  it('the smoke starts at the mouth of the exhale pose', () => {
    expect(SMOKE_ORIGIN).toEqual(seatedMouth(EXHALE_POSE))
    // Seated: the mouth is well below standing height but above the boss.
    expect(SMOKE_ORIGIN.y).toBeLessThan(-15)
    expect(SMOKE_ORIGIN.y).toBeGreaterThan(-25)
  })

  it('the exhale stream starts with the exhale and leaves before the reveal ends', () => {
    expect(STREAM[0]!.at).toBeGreaterThanOrEqual(EXHALE_AT)
    for (const puff of STREAM) expect(puff.at + puff.duration).toBeLessThan(REVEAL_AT + REVEAL_DURATION)
  })

  it('the billows thin out before the verdict cloud forms', () => {
    for (const mass of MASSES) expect(mass.at + mass.duration).toBeLessThanOrEqual(VERDICT_AT + 1000)
  })
})

describe('Act V — the arguments condense out of the smoke, one after another', () => {
  it('there are seven arguments, all inside the reveal chapter', () => {
    expect(ARGUMENTS).toHaveLength(7)
    for (const argument of ARGUMENTS) {
      expect(argument.at).toBeGreaterThanOrEqual(REVEAL_AT)
      expect(argument.at + ARGUMENT_LIFE.total).toBeLessThanOrEqual(REVEAL_AT + REVEAL_DURATION)
    }
  })

  it('walks through forming → emerging → holding → dissipating → gone', () => {
    const first = ARGUMENTS[0]!
    const phases = [0, 350, 1500, 2800, 3400].map((dt) => argumentPhase(first, first.at + dt))
    expect(phases).toEqual(['forming', 'emerging', 'holding', 'dissipating', 'gone'])
  })

  it('each argument is the newest legible one at some point, in order', () => {
    const order: string[] = []
    for (let t = REVEAL_AT; t < REVEAL_AT + REVEAL_DURATION; t += 50) {
      const id = currentArgumentAt(t)?.id
      if (id && order.at(-1) !== id) order.push(id)
    }
    expect(order).toEqual(ARGUMENTS.map((a) => a.id))
  })

  it('never shows more than three arguments at once (readability)', () => {
    for (let t = REVEAL_AT; t < REVEAL_AT + REVEAL_DURATION; t += 50) {
      expect(legibleArgumentsAt(t).length).toBeLessThanOrEqual(3)
    }
  })

  it('keeps the claims honest: no performance superiority, no Tailwind bashing', () => {
    const copy = [...ARGUMENTS.flatMap((a) => [a.title, a.detail]), ...VERDICT_LINES.map((l) => l.text)].join(' ').toLowerCase()
    expect(copy).not.toMatch(/faster than|slower|smaller than|tailwind (is|can'?t|cannot)/)
    expect(copy).toContain('both tools can ship great, performant css')
  })
})

describe('Act V — the verdict', () => {
  it('reveals the question, the four words, the hero line, the burn and the note — in that order', () => {
    const kinds = VERDICT_LINES.map((l) => l.kind)
    expect(kinds).toEqual(['question', 'word', 'word', 'word', 'word', 'hero', 'burn', 'note'])
    const times = VERDICT_LINES.map((l) => l.at)
    expect(times).toEqual([...times].sort((a, b) => a - b))
  })

  it('is complete before the Aura King chapter, then blows away early in it', () => {
    expect(verdictPhase(VERDICT_AT - 1)).toBe('hidden')
    expect(verdictPhase(KING_AT - 1)).toBe('complete')
    expect(VERDICT_END).toBeGreaterThan(KING_AT)
    expect(verdictLinesAt(VERDICT_END)).toEqual([])
    expect(verdictLinesAt(KING_AT - 1)).toHaveLength(VERDICT_LINES.length)
  })
})

describe('Act V — CSS keyframes are generated from the same constants', () => {
  it('the argument keyframe stops sit exactly on the phase boundaries', () => {
    const stops = Object.keys(smokeKeyframes.smokeTextLife!)
    const pct = (ms: number) => `${Math.round((ms / ARGUMENT_LIFE.total) * 1000) / 10}%`
    expect(stops).toEqual(['0%', pct(ARGUMENT_LIFE.emerge[0]), pct(ARGUMENT_LIFE.emerge[1]), pct(ARGUMENT_LIFE.holdUntil), '100%'])
  })

  it('finalPuff ends exactly when the reveal starts', () => {
    expect(FINAL_PUFF_DURATION).toBe(REVEAL_AT)
  })
})
