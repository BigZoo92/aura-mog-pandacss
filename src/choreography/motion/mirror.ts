import type { Joint } from '../../character/rig/joints'
import { normalizeChannels, type JointChannels, type Pose } from './channels'
import type { TrackDefinition, TrackFrame } from './track'

/**
 * Mirror a pose or a whole track across the vertical axis: L ↔ R joints swap,
 * rotations and horizontal offsets flip sign. Lets a dance "switch sides"
 * without authoring the movement twice.
 */
const swapSide = (joint: Joint): Joint => {
  if (joint.endsWith('L')) return `${joint.slice(0, -1)}R` as Joint
  if (joint.endsWith('R')) return `${joint.slice(0, -1)}L` as Joint
  return joint
}

const mirrorChannels = (value: Pose[Joint]): JointChannels => {
  const c = normalizeChannels(value ?? {})
  const out: JointChannels = { ...c }
  if (c.r !== undefined) out.r = -c.r
  if (c.ry !== undefined) out.ry = -c.ry
  if (c.x !== undefined) out.x = -c.x
  return out
}

export function mirrorPose(pose: Pose): Pose {
  const out: Pose = {}
  for (const [joint, value] of Object.entries(pose) as [Joint, Pose[Joint]][]) {
    if (value === undefined) continue
    out[swapSide(joint)] = mirrorChannels(value)
  }
  return out
}

export function mirrorTrack(track: TrackDefinition, summary = `${track.summary} (mirrored)`): TrackDefinition {
  const frames: Record<number, TrackFrame> = {}
  for (const [stop, frame] of Object.entries(track.frames)) {
    const { ease, ...pose } = frame
    frames[Number(stop)] = { ...mirrorPose(pose), ...(ease ? { ease } : {}) }
  }
  return { ...track, summary, frames }
}
