/**
 * Every animatable node of Tung Tung Tung Sahur's rig (panda onesie edition).
 *
 * A "joint" is a zero-size DOM element placed exactly on its pivot point
 * (`transform-origin: 0 0`). Its artwork hangs off it, and child joints are
 * nested inside it — so rotating the shoulder carries the elbow, wrist and
 * hand along, exactly like a skeleton.
 *
 * Each joint owns its own transform, so animations on different joints never
 * overwrite each other. L / R are SCREEN sides (not anatomical): the rig is
 * never mirrored when Tung Tung turns around, only its surfaces change.
 */
export const JOINTS = [
  // Whole-body wrappers
  'world', // travel across the stage
  'orient', // facing: turn squash, three-quarter rotateY, front/back surface swap
  'body', // bounce / squash-and-stretch, pivots at the feet
  'shadow', // ground shadow, reacts to jumps
  // Spine
  'pelvis',
  'hips', // onesie bottom — the twerk lives here, independent of the torso
  'cheekL',
  'cheekR',
  'tail', // panda pom-pom tail
  'torso',
  'neck',
  'head',
  // Arms
  'shoulderL',
  'upperArmL',
  'forearmL',
  'handL',
  'shoulderR',
  'upperArmR',
  'forearmR',
  'handR',
  // Legs
  'thighL',
  'shinL',
  'footL',
  'thighR',
  'shinR',
  'footR',
  // Costume
  'hoodEarL',
  'hoodEarR',
  // Face
  'eyes',
  'browL',
  'browR',
  'mouth',
  // Form layers
  'shades', // Aura Beast sunglasses
  'jaw', // Giga Chad jaw
  'chadEyes', // tiny, intensely focused eyes
  'bulk', // traps + chest mass
  'muscleL',
  'muscleR',
  'sparkle', // jawline glint
  // Extra cartoon arms (Dab + 67)
  'ghostArmL',
  'ghostForearmL',
  'ghostHandL',
  'ghostArmR',
  'ghostForearmR',
  'ghostHandR',
  // Props
  'propR', // the JNR, held in the right hand
  'propGlow', // its LED, glowing while he inhales
] as const

export type Joint = (typeof JOINTS)[number]

export type BodyRegion = 'body' | 'spine' | 'arms' | 'legs' | 'costume' | 'face' | 'form' | 'ghost' | 'prop'

interface JointInfo {
  label: string
  region: BodyRegion
}

/** Human-readable metadata, used by the "Inspect the Aura" panel. */
export const JOINT_INFO: Record<Joint, JointInfo> = {
  world: { label: 'World position', region: 'body' },
  orient: { label: 'Body orientation', region: 'body' },
  body: { label: 'Body bounce', region: 'body' },
  shadow: { label: 'Ground shadow', region: 'body' },
  pelvis: { label: 'Pelvis', region: 'spine' },
  hips: { label: 'Hips (onesie bottom)', region: 'costume' },
  cheekL: { label: 'Left cheek', region: 'costume' },
  cheekR: { label: 'Right cheek', region: 'costume' },
  tail: { label: 'Pom-pom tail', region: 'costume' },
  hoodEarL: { label: 'Hood ear (left)', region: 'costume' },
  hoodEarR: { label: 'Hood ear (right)', region: 'costume' },
  torso: { label: 'Torso', region: 'spine' },
  neck: { label: 'Neck', region: 'spine' },
  head: { label: 'Head', region: 'spine' },
  shoulderL: { label: 'Left shoulder', region: 'arms' },
  upperArmL: { label: 'Left upper arm', region: 'arms' },
  forearmL: { label: 'Left forearm', region: 'arms' },
  handL: { label: 'Left hand', region: 'arms' },
  shoulderR: { label: 'Right shoulder', region: 'arms' },
  upperArmR: { label: 'Right upper arm', region: 'arms' },
  forearmR: { label: 'Right forearm', region: 'arms' },
  handR: { label: 'Right hand', region: 'arms' },
  thighL: { label: 'Left thigh', region: 'legs' },
  shinL: { label: 'Left shin', region: 'legs' },
  footL: { label: 'Left foot', region: 'legs' },
  thighR: { label: 'Right thigh', region: 'legs' },
  shinR: { label: 'Right shin', region: 'legs' },
  footR: { label: 'Right foot', region: 'legs' },
  eyes: { label: 'Eyes', region: 'face' },
  browL: { label: 'Left eyebrow', region: 'face' },
  browR: { label: 'Right eyebrow', region: 'face' },
  mouth: { label: 'Mouth', region: 'face' },
  shades: { label: 'Aura shades', region: 'form' },
  jaw: { label: 'Chad jaw', region: 'form' },
  chadEyes: { label: 'Chad eyes', region: 'form' },
  bulk: { label: 'Chad bulk', region: 'form' },
  muscleL: { label: 'Left bicep', region: 'form' },
  muscleR: { label: 'Right bicep', region: 'form' },
  sparkle: { label: 'Jaw sparkle', region: 'form' },
  ghostArmL: { label: 'Ghost arm (left)', region: 'ghost' },
  ghostForearmL: { label: 'Ghost forearm (left)', region: 'ghost' },
  ghostHandL: { label: 'Ghost hand (left)', region: 'ghost' },
  ghostArmR: { label: 'Ghost arm (right)', region: 'ghost' },
  ghostForearmR: { label: 'Ghost forearm (right)', region: 'ghost' },
  ghostHandR: { label: 'Ghost hand (right)', region: 'ghost' },
  propR: { label: 'JNR puff', region: 'prop' },
  propGlow: { label: 'JNR LED', region: 'prop' },
}

/** Layers revealed by a form change; their reveal animations use the form's time origin. */
export const FORM_JOINTS: ReadonlySet<Joint> = new Set<Joint>([
  'shades',
  'jaw',
  'chadEyes',
  'bulk',
  'muscleL',
  'muscleR',
  'sparkle',
])
