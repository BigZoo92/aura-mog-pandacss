import { describe, expect, it } from 'vitest'
import { JOINTS } from '../src/character/rig/joints'
import { SHOW, SHOW_TIMELINE } from '../src/choreography/choreography.config'
import { buildMotion } from '../src/choreography/motion/motion-recipe'
import { toTrackRef, type MoveDefinition } from '../src/choreography/motion/move'
import { REST_POSE } from '../src/choreography/motion/rest-pose'
import { MOVES } from '../src/choreography/moves.registry'
import { AMBIENT_TRACKS, TRACKS } from '../src/choreography/tracks.registry'
import type { DanceId } from '../src/animation/timeline/timeline.types'
import { auraAt, bossHealthAt, totalAura, AURA_CAP } from '../src/animation/timeline/scoring'
import { sceneAt } from '../src/animation/timeline/scene'

const ALL_DANCES: DanceId[] = [
  'floss',
  'fresh',
  'orangeJustice',
  'discoFever',
  'gangnamStyle',
  'westSideStory',
  'scuba',
  'sixSevenWoah',
  'griddySixSeven',
  'sixSevenTwerky',
  'shhJawline',
  'dabSixSeven',
]

describe('the show configuration', () => {
  it('contains every one of the twelve dances, in order, then the boss and Act V', () => {
    const dances = SHOW.flatMap((chapter) => (chapter.dance ? [chapter.dance] : []))
    expect(dances).toEqual(ALL_DANCES)
    expect(SHOW.slice(-5).map((c) => c.id)).toEqual(['bossBattle', 'tailwindDown', 'finalPuff', 'smokeReveal', 'auraKing'])
  })

  it('lasts roughly two and a half minutes including Act V', () => {
    expect(SHOW_TIMELINE.duration).toBeGreaterThanOrEqual(120_000)
    expect(SHOW_TIMELINE.duration).toBeLessThanOrEqual(150_000)
  })

  it('keeps every event inside its chapter', () => {
    for (const chapter of SHOW_TIMELINE.chapters) {
      for (const event of chapter.config.events) {
        expect(event.at, `${chapter.config.id} event at ${event.at}`).toBeGreaterThanOrEqual(0)
        expect(event.at, `${chapter.config.id} event at ${event.at}`).toBeLessThanOrEqual(chapter.duration)
      }
    }
  })

  it('never overlaps cinematic slow-motion windows', () => {
    const windows = SHOW_TIMELINE.rateWindows
    for (let i = 1; i < windows.length; i++) {
      expect(windows[i]!.start).toBeGreaterThanOrEqual(windows[i - 1]!.end)
    }
  })

  it('keeps Giga Chad flashes brief (300–700 ms)', () => {
    for (const event of SHOW_TIMELINE.events) {
      if (event.type === 'chad') {
        expect(event.duration).toBeGreaterThanOrEqual(300)
        expect(event.duration).toBeLessThanOrEqual(700)
      }
    }
  })

  it('has a deterministic, escalating aura curve that overflows the gauge before the finale', () => {
    const atChapterEnd = SHOW_TIMELINE.chapters.map((c) => auraAt(SHOW_TIMELINE, c.end))
    for (let i = 1; i < atChapterEnd.length; i++) expect(atChapterEnd[i]).toBeGreaterThanOrEqual(atChapterEnd[i - 1]!)
    const griddy = SHOW_TIMELINE.chapters.find((c) => c.config.id === 'griddySixSeven')!
    expect(auraAt(SHOW_TIMELINE, griddy.end)).toBeGreaterThan(AURA_CAP)
    expect(auraAt(SHOW_TIMELINE, SHOW_TIMELINE.duration)).toBe(totalAura(SHOW_TIMELINE))
  })

  it('defeats Tailwind: full health at the intro, zero at the end', () => {
    const boss = SHOW_TIMELINE.chapters.find((c) => c.config.id === 'bossBattle')!
    expect(bossHealthAt(SHOW_TIMELINE, boss.start)).toBe(100)
    expect(bossHealthAt(SHOW_TIMELINE, boss.end)).toBe(0)
  })

  it('reconstructs the right scene when seeking into the middle of Griddy Back', () => {
    const griddy = SHOW_TIMELINE.chapters.find((c) => c.config.id === 'griddySixSeven')!
    const back = griddy.segments.find((s) => s.move === 'griddyBack')!
    const scene = sceneAt(SHOW_TIMELINE, back.start + back.duration / 2)
    expect(scene.segment.move).toBe('griddyBack')
    expect((MOVES[scene.segment.move] as MoveDefinition).orientation).toBe('back')
  })

  it('reconstructs the Chad form after the jawline and the previous form before it', () => {
    const shh = SHOW_TIMELINE.chapters.find((c) => c.config.id === 'shhJawline')!
    const trace = shh.segments.find((s) => s.move === 'shhTrace')!
    const mog = shh.segments.find((s) => s.move === 'shhMogged')!
    expect(sceneAt(SHOW_TIMELINE, trace.start + 100).form).toBe('brainrot')
    expect(sceneAt(SHOW_TIMELINE, mog.start + 100).form).toBe('gigaPandaChad')
    expect(sceneAt(SHOW_TIMELINE, mog.start + 100).formEntrance).toBe('instant')
  })
})

describe('the motion library', () => {
  const motion = buildMotion({ tracks: TRACKS, moves: MOVES, rest: REST_POSE, ambient: AMBIENT_TRACKS })

  it('compiles every move without two tracks fighting over a joint property', () => {
    expect(Object.keys(motion.recipe.variants?.move ?? {})).toEqual(Object.keys(MOVES))
  })

  it('only references existing tracks and keyframes', () => {
    for (const [moveId, move] of Object.entries(MOVES)) {
      for (const ref of move.tracks) expect(TRACKS, moveId).toHaveProperty(toTrackRef(ref).track)
    }
    for (const names of Object.values(motion.manifest)) {
      for (const name of names) expect(motion.keyframes).toHaveProperty(name)
    }
  })

  it('animates only real rig joints', () => {
    const joints = new Set<string>(JOINTS)
    for (const name of Object.keys(motion.keyframes)) {
      expect(joints.has(name.split('_').at(-1) ?? '')).toBe(true)
    }
  })

  it('uses only real moves in the show', () => {
    for (const segment of SHOW_TIMELINE.segments) expect(MOVES).toHaveProperty(segment.move)
  })
})
