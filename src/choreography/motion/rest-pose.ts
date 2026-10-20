import { normalizeChannels, type JointChannels, type Pose } from './channels'
import { arm, legs, STANCE } from './ik'
import type { Joint } from '../../character/rig/joints'

const withChannels = (pose: Pose, joint: Joint, extra: JointChannels): JointChannels => ({
  ...normalizeChannels(pose[joint] ?? {}),
  ...extra,
})

const ghosts: Pose = {
  ...arm('L', { x: -5.5, y: -2.5, elbow: 'out' }, { ghost: true }),
  ...arm('R', { x: 5.5, y: -2.5, elbow: 'out' }, { ghost: true }),
}

/**
 * Tung Tung's neutral stance. Emitted as the base styles of every rig joint, so
 * any joint a move does not animate simply relaxes back to this pose.
 * Form layers (shades, jaw, bulk...) rest hidden; `data-form` conditions or
 * transformation tracks reveal them.
 */
export const REST_POSE: Pose = {
  ...legs({ pelvis: { y: 0.35 }, L: STANCE.L, R: STANCE.R }),
  ...arm('L', { x: -6.6, y: 0, elbow: 'out', hand: 12 }),
  ...arm('R', { x: 6.6, y: 0, elbow: 'out', hand: -12 }),
  ...ghosts,
  ghostArmL: withChannels(ghosts, 'ghostArmL', { o: 0 }),
  ghostArmR: withChannels(ghosts, 'ghostArmR', { o: 0 }),
  torso: 0,
  neck: 0,
  head: 0,
  shades: { o: 0 },
  jaw: { o: 0, sx: 0.55, sy: 0.25 },
  chadEyes: { o: 0 },
  bulk: { o: 0, s: 0.6 },
  muscleL: { o: 0, s: 0.3 },
  muscleR: { o: 0, s: 0.3 },
  sparkle: { o: 0 },
  propGlow: { o: 0.25 },
}
