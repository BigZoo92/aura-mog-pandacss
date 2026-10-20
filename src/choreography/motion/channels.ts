import type { Joint } from '../../character/rig/joints'

/**
 * The animatable channels of a joint. Each channel maps to ONE independent CSS
 * property, so channels never fight over a shared `transform` string:
 *
 *  r / ry      → `rotate`  (z-axis, or y-axis for the 3/4 body turn)
 *  x / y       → `translate` (em)
 *  s / sx / sy → `scale`
 *  o           → `opacity`
 *  z           → `z-index` (e.g. Floss arms passing behind the hips)
 *  facing      → `--facing` (0 = front surfaces, 1 = back surfaces)
 *  look        → `--look`   (1 = the face peeks over the shoulder while facing away)
 */
export interface JointChannels {
  r?: number
  ry?: number
  x?: number
  y?: number
  s?: number
  sx?: number
  sy?: number
  o?: number
  z?: number
  facing?: number
  look?: number
}

/** A bare number is shorthand for a rotation in degrees. */
export type JointValue = number | JointChannels

/** A (partial) full-body pose: joint → channel values. */
export type Pose = Partial<Record<Joint, JointValue>>

export type CssDeclarations = Record<string, string | number>

const round = (value: number, digits = 3) => {
  const factor = 10 ** digits
  const rounded = Math.round(value * factor) / factor
  return Object.is(rounded, -0) ? 0 : rounded
}

export const normalizeChannels = (value: JointValue): JointChannels =>
  typeof value === 'number' ? { r: value } : value

/** Convert one joint's channels to CSS declarations (individual transform properties). */
export function channelsToCss(value: JointValue): CssDeclarations {
  const c = normalizeChannels(value)
  const css: CssDeclarations = {}

  if (c.r !== undefined && c.ry !== undefined) {
    throw new Error('A joint cannot animate both `r` and `ry` — they share the `rotate` property.')
  }
  if (c.r !== undefined) css.rotate = `${round(c.r)}deg`
  if (c.ry !== undefined) css.rotate = `y ${round(c.ry)}deg`

  if (c.x !== undefined || c.y !== undefined) {
    css.translate = `${round(c.x ?? 0)}em ${round(c.y ?? 0)}em`
  }

  if (c.s !== undefined && (c.sx !== undefined || c.sy !== undefined)) {
    throw new Error('Use either `s` or `sx`/`sy` on a joint, not both.')
  }
  if (c.s !== undefined) css.scale = `${round(c.s)}`
  if (c.sx !== undefined || c.sy !== undefined) {
    css.scale = `${round(c.sx ?? 1)} ${round(c.sy ?? 1)}`
  }

  if (c.o !== undefined) css.opacity = round(c.o)
  if (c.z !== undefined) css.zIndex = Math.round(c.z)
  if (c.facing !== undefined) css['--facing'] = round(c.facing)
  if (c.look !== undefined) css['--look'] = round(c.look)
  return css
}

/** The CSS properties a channel set writes to — used to detect conflicting tracks. */
export function channelProperties(value: JointValue): string[] {
  return Object.keys(channelsToCss(value))
}
