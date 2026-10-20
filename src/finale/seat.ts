import { RIG } from '../character/rig/geometry'
import { rotateVec, type Vec } from '../choreography/motion/ik'

/**
 * Act V staging, in rig units relative to the rig anchor (the point on the
 * ground between Tung Tung's feet at the start of the act).
 *
 * The SAME numbers drive the seated poses (finale tracks), where the knocked
 * out boss lies, and where the smoke leaves his mouth — so the cloud always
 * starts exactly at his lips, at any screen size.
 */
export const SEAT = {
  /** Where Tailwind lies (and where Tung Tung sits down on it). */
  x: 7.5,
  /** How far the pelvis drops when he sits. */
  drop: 5.4,
} as const

/** Mouth centre in head space (just under the long nose). */
const MOUTH_IN_HEAD: Vec = { x: 0, y: -1.5 }

/** Head pose while he exhales: chin up, a little lean back. */
export const EXHALE_POSE = { neck: -5, head: -9, torso: -3 } as const

/**
 * Mouth position (rig units, relative to the rig anchor) when seated with a
 * given torso / neck / head rotation. Pure geometry: same chain as the rig.
 */
export function seatedMouth(pose: { torso: number; neck: number; head: number } = EXHALE_POSE): Vec {
  const pelvis = { x: SEAT.x, y: -RIG.hipHeight + SEAT.drop }
  const neckOffset = rotateVec({ x: 0, y: RIG.neckY }, pose.torso)
  const mouthOffset = rotateVec(MOUTH_IN_HEAD, pose.torso + pose.neck + pose.head)
  return {
    x: pelvis.x + neckOffset.x + mouthOffset.x,
    y: pelvis.y + neckOffset.y + mouthOffset.y,
  }
}

/** Where the exhaled smoke starts. */
export const SMOKE_ORIGIN = seatedMouth()
