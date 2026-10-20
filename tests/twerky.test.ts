import { describe, expect, it } from 'vitest'
import type { MoveDefinition } from '../src/choreography/motion/move'
import { buildMotion } from '../src/choreography/motion/motion-recipe'
import { REST_POSE } from '../src/choreography/motion/rest-pose'
import { compileTrack, type TrackFrame } from '../src/choreography/motion/track'
import { MOVES } from '../src/choreography/moves.registry'
import { AMBIENT_TRACKS, TRACKS } from '../src/choreography/tracks.registry'
import { SHOW_TIMELINE } from '../src/choreography/choreography.config'
import { sceneAt } from '../src/animation/timeline/scene'

const motion = buildMotion({ tracks: TRACKS, moves: MOVES, rest: REST_POSE, ambient: AMBIENT_TRACKS })

/** Which track drives each joint in a move (from the compiled keyframe names). */
function ownersOf(moveId: keyof typeof MOVES) {
  const owners = new Map<string, Set<string>>()
  for (const name of motion.manifest[moveId] ?? []) {
    const at = name.lastIndexOf('_')
    const track = name.slice(0, at)
    const joint = name.slice(at + 1)
    const set = owners.get(joint) ?? new Set()
    set.add(track)
    owners.set(joint, set)
  }
  return owners
}

describe('67 Twerky — a real twerk, not a whole-body bounce', () => {
  const owners = ownersOf('twerkyMain')

  it('faces away from the camera', () => {
    expect((MOVES.twerkyMain as MoveDefinition).orientation).toBe('back')
  })

  it('animates pelvis, torso, hips, cheeks and arms with SEPARATE tracks', () => {
    const pelvis = owners.get('pelvis')
    const torso = owners.get('torso')
    const hips = owners.get('hips')
    const cheek = owners.get('cheekL')
    const arm = owners.get('upperArmL')
    expect(pelvis).toEqual(new Set(['twerkPelvis']))
    expect(torso).toEqual(new Set(['twerkTorso']))
    expect(hips).toEqual(new Set(['twerkHips']))
    expect(cheek).toEqual(new Set(['twerkCheeks']))
    expect(arm).toEqual(new Set(['sixSevenTwerk']))
  })

  it('does not bounce the whole character', () => {
    expect(owners.has('body')).toBe(false)
    expect(owners.has('world')).toBe(false)
  })

  it('flexes the knees through the pelvis track (leg IK)', () => {
    expect(owners.get('shinL')).toEqual(new Set(['twerkPelvis']))
    expect(owners.get('thighR')).toEqual(new Set(['twerkPelvis']))
  })

  it('runs the 67 on a different rhythm from the hips', () => {
    expect(TRACKS.sixSevenTwerk.duration).not.toBe(TRACKS.twerkPelvis.duration)
    expect(TRACKS.sixSevenTwerk.duration % TRACKS.twerkHips.duration).not.toBe(0)
  })

  it('the torso counter-moves: it rises less than the pelvis when the pelvis pops', () => {
    const pelvisFrames = TRACKS.twerkPelvis.frames
    const torsoFrames = TRACKS.twerkTorso.frames
    const pelvisY = (frame: TrackFrame) => (frame.pelvis as { y: number }).y
    const torsoY = (frame: TrackFrame) => (frame.torso as { y: number }).y
    const pelvisRise = pelvisY(pelvisFrames[0]!) - pelvisY(pelvisFrames[38]!)
    const torsoDrop = torsoY(torsoFrames[38]!) - torsoY(torsoFrames[0]!)
    expect(pelvisRise).toBeGreaterThan(0)
    // torso translate is relative to the pelvis: it sinks back by most of the rise
    expect(torsoDrop / pelvisRise).toBeGreaterThan(0.7)
    expect(torsoDrop / pelvisRise).toBeLessThan(1)
  })
})

describe('67 Twerky — the turn and the finale', () => {
  it('turns through front → profile → back', () => {
    const turn = compileTrack('twerkyTurn', TRACKS.twerkyTurn)
    const facing = Object.values(turn.keyframes.twerkyTurn_orient ?? {}).map((d) => d['--facing'])
    expect(facing).toContain(0)
    expect(facing).toContain(0.5)
    expect(facing.at(-1)).toBe(1)
  })

  it('ends with a look over the shoulder and a brief Giga Chad jaw', () => {
    const chapter = SHOW_TIMELINE.chapters.find((c) => c.config.id === 'sixSevenTwerky')!
    const freeze = chapter.segments.find((s) => s.move === 'twerkyFreeze')!
    const flash = sceneAt(SHOW_TIMELINE, freeze.start + 300)
    expect(flash.form).toBe('gigaPandaChad')
    expect(TRACKS.twerkFreeze.frames[0]!.head).toMatchObject({ look: 1 })
    const banner = chapter.config.events.find((e) => e.type === 'caption' && e.style === 'banner')
    expect(banner && 'text' in banner ? banner.text : '').toBe('67 TWERKY — BACK VIEW UNLOCKED')
  })
})
