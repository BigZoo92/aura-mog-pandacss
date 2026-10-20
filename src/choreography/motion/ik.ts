import { HIP, RIG, SHOULDER } from '../../character/rig/geometry'
import type { Pose } from './channels'

/**
 * Build-time inverse kinematics.
 *
 * Choreography is far easier to author as "put the palm HERE" or "keep the
 * foot planted THERE" than as raw joint angles. These helpers run inside
 * `panda.config.ts` only: they turn targets into plain joint rotations that
 * are emitted as static `@keyframes`. Nothing here ships to the browser.
 */

export interface Vec {
  x: number
  y: number
}

const RAD = 180 / Math.PI
const toDeg = (rad: number) => rad * RAD
const toRad = (deg: number) => deg / RAD

/** Normalise an angle to (-180, 180]. */
export const wrapDeg = (deg: number) => {
  let a = deg % 360
  if (a > 180) a -= 360
  if (a <= -180) a += 360
  return a
}

/** CSS rotation that turns a down-pointing bone (0, 1) toward `v`. */
export const boneAngle = (v: Vec) => toDeg(Math.atan2(-v.x, v.y))

export const rotateVec = (v: Vec, deg: number): Vec => {
  const a = toRad(deg)
  const cos = Math.cos(a)
  const sin = Math.sin(a)
  return { x: v.x * cos - v.y * sin, y: v.x * sin + v.y * cos }
}

export type BendPreference = 'out' | 'in' | 'up' | 'down'
export type Side = 'L' | 'R'

export interface TwoBoneSolution {
  /** Absolute rotation of the first bone (in the chain's parent space). */
  upper: number
  /** Rotation of the second bone relative to the first. */
  lower: number
  /** Absolute rotation of the second bone. */
  lowerAbs: number
  elbow: Vec
}

/**
 * Classic two-bone IK in the plane. Returns the solution whose middle joint
 * (elbow / knee) best matches `bend`. Out-of-reach targets are clamped so the
 * limb simply straightens toward them.
 */
export function solveTwoBone(
  root: Vec,
  target: Vec,
  upperLength: number,
  lowerLength: number,
  side: Side,
  bend: BendPreference,
): TwoBoneSolution {
  const dx = target.x - root.x
  const dy = target.y - root.y
  const rawDistance = Math.hypot(dx, dy)
  const minReach = Math.abs(upperLength - lowerLength) + 1e-3
  const maxReach = upperLength + lowerLength - 1e-3
  const d = Math.min(Math.max(rawDistance, minReach), maxReach)
  const phi = Math.atan2(dy, dx)
  const cosAlpha = (upperLength ** 2 + d ** 2 - lowerLength ** 2) / (2 * upperLength * d)
  const alpha = Math.acos(Math.min(1, Math.max(-1, cosAlpha)))
  const end = { x: root.x + d * Math.cos(phi), y: root.y + d * Math.sin(phi) }

  const candidates = [1, -1].map((sign) => {
    const elbow = {
      x: root.x + upperLength * Math.cos(phi + sign * alpha),
      y: root.y + upperLength * Math.sin(phi + sign * alpha),
    }
    const upper = boneAngle({ x: elbow.x - root.x, y: elbow.y - root.y })
    const lowerAbs = boneAngle({ x: end.x - elbow.x, y: end.y - elbow.y })
    return { upper, lower: wrapDeg(lowerAbs - upper), lowerAbs, elbow }
  })

  const score = (elbow: Vec) => {
    switch (bend) {
      case 'out':
        return side === 'L' ? -elbow.x : elbow.x
      case 'in':
        return side === 'L' ? elbow.x : -elbow.x
      case 'up':
        return -elbow.y
      case 'down':
        return elbow.y
    }
  }
  const [a, b] = candidates as [TwoBoneSolution, TwoBoneSolution]
  return score(a.elbow) >= score(b.elbow) ? a : b
}

export interface ArmTarget {
  /** Wrist position in torso space (em). */
  x: number
  y: number
  elbow?: BendPreference
  /**
   * Absolute hand rotation in torso space. Defaults to continuing the forearm.
   * 0 = fingers down, 90 = fingers pointing screen-left, -90 = screen-right.
   */
  hand?: number
  /** Optional shoulder shrug / shimmy offset (em), emitted on the shoulder joint. */
  shoulder?: Partial<Vec>
}

/** Ghost arms sprout from the upper back, a little inside the real shoulders. */
export const GHOST_SHOULDER = {
  L: { x: -3.1, y: -7.4 },
  R: { x: 3.1, y: -7.4 },
} as const

/** Solve an arm toward a wrist target. Works for the real arms and the ghost arms. */
export function arm(side: Side, target: ArmTarget, options: { ghost?: boolean } = {}): Pose {
  const base = options.ghost ? GHOST_SHOULDER[side] : SHOULDER[side]
  const offset = { x: target.shoulder?.x ?? 0, y: target.shoulder?.y ?? 0 }
  const root = { x: base.x + offset.x, y: base.y + offset.y }
  const solution = solveTwoBone(
    root,
    target,
    RIG.upperArm,
    RIG.forearm,
    side,
    target.elbow ?? 'out',
  )
  const hand = target.hand === undefined ? 0 : wrapDeg(target.hand - solution.lowerAbs)

  if (options.ghost) {
    return side === 'L'
      ? { ghostArmL: solution.upper, ghostForearmL: solution.lower, ghostHandL: hand }
      : { ghostArmR: solution.upper, ghostForearmR: solution.lower, ghostHandR: hand }
  }

  const pose: Pose =
    side === 'L'
      ? { upperArmL: solution.upper, forearmL: solution.lower, handL: hand }
      : { upperArmR: solution.upper, forearmR: solution.lower, handR: hand }
  if (target.shoulder) pose[side === 'L' ? 'shoulderL' : 'shoulderR'] = offset
  return pose
}

export interface FootTarget {
  /** Ankle x position relative to the character's ground centre (em). */
  x: number
  /** How far the ankle is lifted above its flat-footed height (em, up = positive). */
  lift?: number
  /**
   * Toe raise in degrees (positive = toes up, heel down). Sneakers are drawn
   * cartoon-style with toes pointing outward, so this reads clearly even in a
   * front view — essential for Griddy heel taps.
   */
  toes?: number
  knee?: BendPreference
}

export interface PelvisPlacement {
  /** Horizontal hip shift (em). */
  x?: number
  /** Vertical drop (em, down = positive): crouches and bounces. */
  y?: number
  /** Hip tilt (deg). */
  r?: number
}

export interface LegsTarget {
  pelvis?: PelvisPlacement
  L: FootTarget
  R: FootTarget
}

/**
 * Place the pelvis and keep the feet where they are told to be.
 * This is what keeps Tung Tung's feet planted while his hips go wild.
 */
export function legs({ pelvis = {}, L, R }: LegsTarget): Pose {
  const px = pelvis.x ?? 0
  const py = pelvis.y ?? 0
  const pr = pelvis.r ?? 0
  const pelvisWorld = { x: px, y: -RIG.hipHeight + py }

  const solveLeg = (side: Side, foot: FootTarget) => {
    const hipOffset = rotateVec(HIP[side], pr)
    const hipWorld = { x: pelvisWorld.x + hipOffset.x, y: pelvisWorld.y + hipOffset.y }
    const ankleWorld = { x: foot.x, y: -RIG.ankleHeight - (foot.lift ?? 0) }
    const local = rotateVec({ x: ankleWorld.x - hipWorld.x, y: ankleWorld.y - hipWorld.y }, -pr)
    const solution = solveTwoBone(
      { x: 0, y: 0 },
      local,
      RIG.thigh,
      RIG.shin,
      side,
      foot.knee ?? 'out',
    )
    // L toes point screen-left: a clockwise (+) rotation lifts them. R is mirrored.
    const sole = (foot.toes ?? 0) * (side === 'L' ? 1 : -1)
    const footLocal = wrapDeg(sole - (pr + solution.upper + solution.lower))
    return { thigh: solution.upper, shin: solution.lower, foot: footLocal }
  }

  const left = solveLeg('L', L)
  const right = solveLeg('R', R)
  const pose: Pose = {
    thighL: left.thigh,
    shinL: left.shin,
    footL: left.foot,
    thighR: right.thigh,
    shinR: right.shin,
    footR: right.foot,
  }
  pose.pelvis = { x: px, y: py, r: pr }
  return pose
}

/** Default stance: feet a little wider than the hips, knees softly bent. */
export const STANCE = { L: { x: -2.9 }, R: { x: 2.9 } } as const
