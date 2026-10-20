import type { Expression, HandPose, Orientation } from '../../character/rig/rig.types'
import type { TrackName } from '../tracks.registry'

/** A track placed inside a move, optionally retimed. */
export interface TrackRef {
  track: TrackName
  /** Start offset inside the segment (ms of show time). */
  delay?: number
  /** Override the track's cycle duration (ms). */
  duration?: number
  iterations?: number | 'infinite'
}

/**
 * A move is everything Tung Tung's body does during one segment of a dance:
 * the tracks that animate it, plus the static pose details (which way he is
 * facing, his face, his hand shapes). Moves are pure data — React renders
 * them, Panda compiles them into the `rigMotion` slot recipe.
 */
export interface MoveDefinition {
  summary: string
  tracks: readonly (TrackName | TrackRef)[]
  orientation?: Orientation
  face?: Expression
  hands?: { L?: HandPose; R?: HandPose }
  /** Presence of ghost hands makes the extra cartoon arms render. */
  ghostHands?: { L: HandPose; R: HandPose }
  /** A prop held in the right hand (rendered between palm and fingers). */
  prop?: 'jnr'
}

export type MoveLibrary = Record<string, MoveDefinition>

export const defineMoves = <const T extends MoveLibrary>(moves: T): T => moves

export const toTrackRef = (ref: TrackName | TrackRef): TrackRef =>
  typeof ref === 'string' ? { track: ref } : ref
