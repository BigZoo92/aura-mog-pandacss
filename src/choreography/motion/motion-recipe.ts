import type { CssKeyframes, SlotRecipeConfig } from '@pandacss/types'
import { JOINTS, type Joint } from '../../character/rig/joints'
import { channelsToCss, type CssDeclarations, type Pose } from './channels'
import { EASINGS } from './easings'
import { toTrackRef, type MoveLibrary } from './move'
import { compileTrack, keyframeName, type CompiledTrack, type KeyframeRules, type TrackLibrary } from './track'

/**
 * Build-time compiler: tracks + moves → `@keyframes` + one slot recipe.
 *
 *   slots    = every rig joint
 *   variants = { move: { [moveId]: { [joint]: { animation } } } }
 *   base     = the rest pose, so un-animated joints relax naturally
 *
 * Runs inside `panda.config.ts`. The browser only ever receives the static CSS.
 */

export interface MotionBuild {
  keyframes: CssKeyframes
  recipe: SlotRecipeConfig<Joint>
  /** For tests / docs: which keyframes each move uses. */
  manifest: Record<string, string[]>
}

export interface MotionBuildOptions {
  tracks: TrackLibrary
  moves: MoveLibrary
  rest: Pose
  /** Tracks layered under every move unless the move already drives the same property. */
  ambient?: readonly string[]
}

export function buildMotion({ tracks, moves, rest, ambient = [] }: MotionBuildOptions): MotionBuild {
  const compiled = new Map<string, CompiledTrack>()
  for (const [name, track] of Object.entries(tracks)) compiled.set(name, compileTrack(name, track))

  const keyframes: KeyframeRules = {}
  for (const track of compiled.values()) Object.assign(keyframes, track.keyframes)

  const base: Record<string, CssDeclarations> = {}
  for (const joint of JOINTS) {
    const value = rest[joint]
    base[joint] = value === undefined ? {} : channelsToCss(value)
  }

  const variants: Record<string, Record<string, { animation: string }>> = {}
  const manifest: Record<string, string[]> = {}

  for (const [moveId, move] of Object.entries(moves)) {
    const animations = new Map<Joint, string[]>()
    const owners = new Map<string, string>()
    const used: string[] = []

    const place = (ref: ReturnType<typeof toTrackRef>, optional: boolean) => {
      const track = compiled.get(ref.track)
      const definition = tracks[ref.track]
      if (!track || !definition) throw new Error(`Move "${moveId}" references unknown track "${ref.track}"`)

      // Detect two tracks fighting over the same joint property.
      for (const joint of track.joints) {
        for (const property of track.properties[joint] ?? []) {
          const owner = owners.get(`${joint}.${property}`)
          if (owner) {
            if (optional) return
            throw new Error(
              `Move "${moveId}": tracks "${owner}" and "${ref.track}" both animate ${joint}.${property}`,
            )
          }
        }
      }

      const duration = ref.duration ?? definition.duration
      const iterations = ref.iterations ?? definition.iterations ?? 'infinite'
      const easing = EASINGS[definition.easing ?? 'inOut']
      const delay = ref.delay ?? 0
      for (const joint of track.joints) {
        for (const property of track.properties[joint] ?? []) owners.set(`${joint}.${property}`, ref.track)
        const name = keyframeName(ref.track, joint)
        const list = animations.get(joint) ?? []
        list.push(`${name} ${duration}ms ${easing} ${delay}ms ${iterations} both`)
        animations.set(joint, list)
        used.push(name)
      }
    }

    for (const ref of move.tracks) place(toTrackRef(ref), false)
    for (const name of ambient) place({ track: name as never }, true)

    variants[moveId] = Object.fromEntries(
      [...animations].map(([joint, list]) => [joint, { animation: list.join(', ') }]),
    )
    manifest[moveId] = used
  }

  // Our declarations are plain CSS property/value pairs (individual transform
  // properties, opacity, z-index, custom properties) — valid Panda style objects.
  const recipe: SlotRecipeConfig<Joint> = {
    className: 'rm',
    description: 'Rig motion: one slot per joint, one variant per move.',
    slots: [...JOINTS],
    base: base as SlotRecipeConfig<Joint>['base'],
    variants: { move: variants } as SlotRecipeConfig<Joint>['variants'],
  }
  return { keyframes: keyframes as CssKeyframes, recipe, manifest }
}
