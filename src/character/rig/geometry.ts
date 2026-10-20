/**
 * Rig geometry — the single source of truth for Tung Tung's skeleton.
 *
 * Every value is in `em`. The whole character scales from one `font-size`
 * on the rig root, so these numbers are resolution-independent.
 *
 * The same numbers are consumed twice:
 *  - at build time by the IK helpers that turn hand/foot targets into joint
 *    angles (see `ik.ts`), and
 *  - by the CSS shapes, through the `rig.*` spacing/size tokens registered in
 *    `panda.config.ts`.
 *
 * Coordinate convention: CSS screen space. +x is screen-right, +y is DOWN.
 * Rotations are CSS rotations: positive = clockwise on screen.
 * A bone with rotation 0 points straight down.
 */
export const RIG = {
  /** Pelvis bone height above the ground line. */
  hipHeight: 14,
  /** Horizontal offset of each hip joint from the pelvis bone. */
  hipSpread: 2.3,
  /** Vertical offset of the hip joints below the pelvis bone. */
  hipDrop: 0.6,
  thigh: 6.5,
  shin: 6.3,
  /** Ankle height above the ground when the foot is flat. */
  ankleHeight: 0.7,

  /** Shoulder joints, relative to the torso bone (which sits on the pelvis). */
  shoulderX: 4.4,
  shoulderY: -8.4,
  upperArm: 4.5,
  forearm: 4.1,

  /** Neck joint relative to the torso bone. */
  neckY: -10.2,
} as const

export type RigGeometry = typeof RIG

/** Rest positions of the hip joints in pelvis space. */
export const HIP = {
  L: { x: -RIG.hipSpread, y: RIG.hipDrop },
  R: { x: RIG.hipSpread, y: RIG.hipDrop },
} as const

/** Rest positions of the shoulder joints in torso space. */
export const SHOULDER = {
  L: { x: -RIG.shoulderX, y: RIG.shoulderY },
  R: { x: RIG.shoulderX, y: RIG.shoulderY },
} as const
