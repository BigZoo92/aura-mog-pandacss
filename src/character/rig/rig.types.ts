/** Which surfaces of the rig face the camera. */
export type Orientation = 'front' | 'back' | 'threeQuarter'

/** The three transformation states. */
export type CharacterForm = 'brainrot' | 'auraBeast' | 'gigaPandaChad'

export const CHARACTER_FORMS = ['brainrot', 'auraBeast', 'gigaPandaChad'] as const satisfies readonly CharacterForm[]

export const FORM_LABEL: Record<CharacterForm, string> = {
  brainrot: 'Brainrot',
  auraBeast: 'Aura Beast',
  gigaPandaChad: 'Giga Tung Chad',
}

/** Facial expressions — mouth, brows and eye shapes as one readable state. */
export type Expression =
  | 'neutral'
  | 'smug'
  | 'grin'
  | 'shock'
  | 'focus'
  | 'cool'
  | 'shush'
  | 'proud'
  | 'wobbly'

/** Glove poses. Each one is a set of finger rotations / extensions in CSS. */
export type HandPose =
  | 'open'
  | 'fist'
  | 'point'
  | 'snap'
  | 'palmUp'
  | 'goggles'
  | 'flat'
  | 'pinch'
  | 'middleFinger'
  | 'hold'

export const HAND_POSES = [
  'open',
  'fist',
  'point',
  'snap',
  'palmUp',
  'goggles',
  'flat',
  'pinch',
  'middleFinger',
  'hold',
] as const satisfies readonly HandPose[]

export const EXPRESSIONS = [
  'neutral',
  'smug',
  'grin',
  'shock',
  'focus',
  'cool',
  'shush',
  'proud',
  'wobbly',
] as const satisfies readonly Expression[]
