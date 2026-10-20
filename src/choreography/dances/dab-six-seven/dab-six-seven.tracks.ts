import { hold } from '../../motion/hold'
import { normalizeChannels, type Pose } from '../../motion/channels'
import { arm, legs, type ArmTarget } from '../../motion/ik'
import { defineTracks } from '../../motion/track'

/**
 * DAB + 67 + MIDDLE FINGER — the final forbidden move. The Dab needs both
 * real arms, the 67 needs two more, so two translucent cartoon ghost arms
 * sprout from Tung Tung's back. On the last beat one ghost hand flips an
 * oversized (entirely CSS) middle finger at the fictional rival.
 */
export const DAB = {
  ...legs({ pelvis: { y: 1.3, x: -0.5, r: -4 }, L: { x: -4.4 }, R: { x: 4 } }),
  // Left arm bent across the face, pointing up-right; the head drops into its elbow.
  ...arm('L', { x: 4.6, y: -15.2, elbow: 'down', hand: -138 }),
  // Right arm fully extended up-right.
  ...arm('R', { x: 11.6, y: -15.4, elbow: 'down', hand: -132 }),
  shoulderL: { x: 0.6, y: -0.4, z: 4 },
  torso: -7,
  neck: 14,
  head: { r: 24, x: 1.3, y: 1 },
}

const WINDUP = {
  ...legs({ pelvis: { y: 2.4, x: 0.6, r: 3 }, L: { x: -3.8 }, R: { x: 3.8 } }),
  ...arm('L', { x: -7.8, y: 1.8, elbow: 'out', hand: 30 }),
  ...arm('R', { x: -4.4, y: 1.4, elbow: 'out', hand: 40 }),
  shoulderL: { x: 0, y: 0, z: 4 },
  torso: 6,
  neck: -4,
  head: { r: -8, x: 0, y: 0.4 },
}

const GHOSTS_HIDDEN = {
  ghostArmL: { o: 0 },
  ghostArmR: { o: 0 },
}

/**
 * A ghost arm reaching a target AND fading: the opacity channel is merged
 * into the IK rotation of the root joint (not written over it).
 */
function ghost(side: 'L' | 'R', target: ArmTarget, opacity: number, handScale?: number): Pose {
  const pose = arm(side, target, { ghost: true })
  const root = side === 'L' ? 'ghostArmL' : 'ghostArmR'
  const hand = side === 'L' ? 'ghostHandL' : 'ghostHandR'
  return {
    ...pose,
    [root]: { ...normalizeChannels(pose[root] ?? 0), o: opacity },
    ...(handScale === undefined ? {} : { [hand]: { ...normalizeChannels(pose[hand] ?? 0), s: handScale } }),
  }
}

export const dabSixSevenTracks = defineTracks({
  dabWindup: {
    summary: 'Anticipation: crouch and load both arms low to the left.',
    duration: 600,
    iterations: 1,
    easing: 'out',
    frames: { 0: { ...WINDUP, torso: 0, head: { r: 0, x: 0, y: 0 } }, 100: WINDUP },
  },
  dabHit: {
    summary: 'DAB: head drops into the left elbow, right arm shoots up diagonally.',
    duration: 400,
    iterations: 1,
    easing: 'snap',
    frames: {
      0: WINDUP,
      60: { ...DAB, torso: -10, head: { r: 30, x: 1.5, y: 1.2 }, ease: 'overshoot' },
      100: DAB,
    },
  },
  dabHold: hold('The Dab, frozen in time.', DAB, { duration: 600, tremble: 0.05 }),
  ghostEmerge: {
    summary: 'Two ghost arms phase out of his back.',
    duration: 600,
    iterations: 1,
    easing: 'overshoot',
    frames: {
      0: { ...GHOSTS_HIDDEN, ghostHandL: { s: 0.2 }, ghostHandR: { s: 0.2 } },
      100: { ghostArmL: { o: 0.92 }, ghostArmR: { o: 0.92 }, ghostHandL: { s: 1 }, ghostHandR: { s: 1 } },
    },
  },
  ghostFlip: {
    summary: 'The right ghost arm thrusts up: comically oversized middle finger.',
    duration: 700,
    iterations: 1,
    easing: 'overshoot',
    frames: {
      0: ghost('R', { x: 9.4, y: -6.4, elbow: 'down', hand: -120 }, 0.92, 1),
      45: ghost('R', { x: 17, y: -7.4, elbow: 'down', hand: 180 }, 1, 1.95),
      100: ghost('R', { x: 16.5, y: -6.6, elbow: 'down', hand: 180 }, 1, 1.75),
    },
  },
  ghostFinale: hold(
    'Freeze frame: ghost 67 palm high, giant ghost middle finger up.',
    {
      ...ghost('L', { x: -8.4, y: -10.8, elbow: 'down', hand: 120 }, 0.95),
      ...ghost('R', { x: 16.5, y: -6.6, elbow: 'down', hand: 180 }, 1, 1.75),
    },
    { duration: 600 },
  ),
  ghostLeftSixSeven: {
    summary: 'The left ghost arm keeps doing the 67 alone, unbothered.',
    duration: 400,
    easing: 'inOut',
    frames: {
      0: ghost('L', { x: -8.4, y: -10.8, elbow: 'down', hand: 120 }, 0.92),
      50: ghost('L', { x: -8.8, y: -7.4, elbow: 'down', hand: 120 }, 0.92),
      100: ghost('L', { x: -8.4, y: -10.8, elbow: 'down', hand: 120 }, 0.92),
    },
  },
})
