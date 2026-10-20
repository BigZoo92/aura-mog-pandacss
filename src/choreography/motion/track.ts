import type { Joint } from '../../character/rig/joints'
import { channelProperties, channelsToCss, normalizeChannels, type CssDeclarations, type JointValue, type Pose } from './channels'
import { EASINGS, type Easing } from './easings'

/**
 * A track is ONE reusable movement primitive over a region of the body
 * ("flossArms", "griddyFootwork", "sixSevenPalms"...). It is authored as a
 * handful of key poses and compiled at build time into one `@keyframes` rule
 * per joint it touches, named `<track>_<joint>` — e.g. `sixSevenPalms_forearmL`.
 *
 * Dances are then assembled by *composing* tracks (see `move.ts`): Griddy feet
 * + 67 palms + smug head bob, each with its own cycle length.
 */
export type TrackFrame = Pose & { ease?: Easing }

export interface TrackDefinition {
  /** One line describing the movement — surfaced by the inspector. */
  summary: string
  /** Length of one cycle in ms of show time. */
  duration: number
  /** Defaults to `infinite`: most dance tracks loop for the segment's length. */
  iterations?: number | 'infinite'
  /** Default easing between key poses (each frame can override with `ease`). */
  easing?: Easing
  /** Key poses by percentage of the cycle (0–100). */
  frames: Record<number, TrackFrame>
}

export type TrackLibrary = Record<string, TrackDefinition>

/** Identity helper that preserves literal track names for type inference. */
export const defineTracks = <const T extends TrackLibrary>(tracks: T): T => tracks

export const keyframeName = (track: string, joint: Joint) => `${track}_${joint}`

export type KeyframeRules = Record<string, Record<string, CssDeclarations>>

export interface CompiledTrack {
  name: string
  joints: Joint[]
  /** CSS properties written per joint, for conflict detection. */
  properties: Partial<Record<Joint, string[]>>
  keyframes: KeyframeRules
}

const percentKeys = (frames: Record<number, TrackFrame>) =>
  Object.keys(frames)
    .map(Number)
    .sort((a, b) => a - b)

/**
 * IK can return the same direction as +179° or −179°. Interpolating between
 * those would spin the limb the long way round (a hand swinging down to the
 * hip on its way across the chin). Each rotation is shifted by ±360° to stay
 * within 180° of the previous keyframe — the shortest path, always.
 */
function unwrapRotation(value: JointValue, previous: number | undefined): JointValue {
  const channels = normalizeChannels(value)
  const key = channels.r !== undefined ? 'r' : channels.ry !== undefined ? 'ry' : null
  if (!key || previous === undefined) return value
  let angle = channels[key] as number
  while (angle - previous > 180) angle -= 360
  while (angle - previous < -180) angle += 360
  return { ...channels, [key]: angle }
}

const rotationOf = (value: JointValue): number | undefined => {
  const channels = normalizeChannels(value)
  return channels.r ?? channels.ry
}

export function compileTrack(name: string, track: TrackDefinition): CompiledTrack {
  const stops = percentKeys(track.frames)
  for (const stop of stops) {
    if (!Number.isFinite(stop) || stop < 0 || stop > 100) {
      throw new Error(`Track "${name}" has an invalid keyframe stop: ${stop}`)
    }
  }

  const perJoint = new Map<Joint, Record<string, CssDeclarations>>()
  const properties: Partial<Record<Joint, Set<string>>> = {}
  const lastRotation = new Map<Joint, number>()

  for (const stop of stops) {
    const frame = track.frames[stop] as TrackFrame
    const { ease, ...pose } = frame
    for (const [joint, raw] of Object.entries(pose) as [Joint, Pose[Joint]][]) {
      if (raw === undefined) continue
      const value = unwrapRotation(raw, lastRotation.get(joint))
      const rotation = rotationOf(value)
      if (rotation !== undefined) lastRotation.set(joint, rotation)
      const rule = perJoint.get(joint) ?? {}
      const declarations: CssDeclarations = { ...channelsToCss(value) }
      if (ease) declarations.animationTimingFunction = EASINGS[ease]
      rule[`${stop}%`] = declarations
      perJoint.set(joint, rule)
      const set = properties[joint] ?? new Set<string>()
      for (const property of channelProperties(value)) set.add(property)
      properties[joint] = set
    }
  }

  const keyframes: KeyframeRules = {}
  for (const [joint, rule] of perJoint) keyframes[keyframeName(name, joint)] = rule

  return {
    name,
    joints: [...perJoint.keys()],
    properties: Object.fromEntries(
      Object.entries(properties).map(([joint, set]) => [joint, [...(set ?? [])]]),
    ) as Partial<Record<Joint, string[]>>,
    keyframes,
  }
}
