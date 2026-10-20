import { SMOKE_ORIGIN } from '../seat'

/**
 * THE JNR SMOKE OF SUPERIORITY — every timing and position of the finale.
 *
 * All times are milliseconds from the SMOKE ORIGIN: the start of the
 * "finalPuff" chapter. The smoke layer carries that origin as its `data-t0`,
 * so a single number positions every puff, cloud and word on the show
 * timeline — pause, 0.25×, seeking and replay all just work.
 *
 * Positions are rig units (em) relative to the rig anchor. Horizontal
 * offsets are multiplied by `--spread` in CSS so narrow screens keep the
 * composition on stage.
 */

// --- Act V beats ------------------------------------------------------------------

/** Scenes 2–4: the JNR comes out, the slow puff, the exhale. */
export const PUFF_BEATS = { pull: 1300, look: 1000, toMouth: 900, inhale: 1700, hold: 900, exhale: 2400 } as const
export const EXHALE_AT = PUFF_BEATS.pull + PUFF_BEATS.look + PUFF_BEATS.toMouth + PUFF_BEATS.inhale + PUFF_BEATS.hold
export const FINAL_PUFF_DURATION = EXHALE_AT + PUFF_BEATS.exhale

/** Scene 5: the smoke reveals the arguments, then the verdict. */
export const REVEAL_AT = FINAL_PUFF_DURATION
export const REVEAL_DURATION = 15_000

/** Scene 6: the smoke clears, the Aura King looks at the camera. */
export const KING_AT = REVEAL_AT + REVEAL_DURATION
export const KING_BEATS = { lower: 2600, pose: 4400 } as const
export const KING_DURATION = KING_BEATS.lower + KING_BEATS.pose
/** The final card appears this long into the Aura King chapter. */
export const CARD_DELAY = 3400

// --- The exhale stream ---------------------------------------------------------------

export interface StreamPuff {
  at: number
  duration: number
  /** Travel from the mouth (em). */
  dx: number
  dy: number
  /** Final scale of a 4em puff. */
  scale: number
  rotate: number
}

/** 14 puffs leave the mouth in quick succession, fanning up and out toward the camera. */
export const STREAM: readonly StreamPuff[] = Array.from({ length: 14 }, (_, i) => {
  const fan = i / 13
  return {
    at: EXHALE_AT + 60 + i * 95,
    duration: 2500 + (i % 4) * 220,
    dx: -4 - fan * 24 + (i % 3) * 2.2,
    dy: 1.5 - fan * 15 - (i % 2) * 2.5,
    scale: 2.4 + (i % 5) * 0.45,
    rotate: (i % 2 ? 1 : -1) * (20 + i * 4),
  }
})

// --- The big billowing masses ---------------------------------------------------------

export interface SmokeMass {
  at: number
  duration: number
  /** Resting centre (em, x multiplied by --spread). */
  x: number
  y: number
  width: number
  /** Slow drift while resting (em). */
  driftX: number
  driftY: number
}

const MASS_END = REVEAL_AT + 10_300
const mass = (i: number, x: number, y: number, width: number, driftX: number, driftY: number): SmokeMass => ({
  at: EXHALE_AT + 150 + i * 130,
  duration: MASS_END - (EXHALE_AT + 150 + i * 130),
  x,
  y,
  width,
  driftX,
  driftY,
})

export const MASSES: readonly SmokeMass[] = [
  mass(0, -11, -28, 28, -1.5, -1),
  mass(1, -24, -15, 22, -2, 1),
  mass(2, 18, -36, 22, 1.5, -1.5),
  mass(3, -28, -35, 22, -1, -2),
  mass(4, 27, -17, 18, 2, 0.5),
  mass(5, -2, -41, 26, 0.5, -2),
]

// --- The seven arguments ---------------------------------------------------------------

export type SmokeTone = 'violet' | 'lime' | 'orange' | 'cyan'

export interface SmokeArgument {
  id: string
  title: string
  detail: string
  at: number
  x: number
  y: number
  tone: SmokeTone
  /** Where its cloud drifts in from (em, relative to its resting place). */
  fromX: number
  fromY: number
}

/** One argument cloud's life: billow in, text emerges, hold & drift, dissipate. */
export const ARGUMENT_LIFE = { form: 450, emerge: [300, 1100] as const, holdUntil: 2500, total: 3300 } as const
export const ARGUMENT_STAGGER = 1250

const argument = (
  i: number,
  id: string,
  title: string,
  detail: string,
  place: { x: number; y: number; fromX: number; fromY: number },
  tone: SmokeTone,
): SmokeArgument => ({ id, title, detail, at: REVEAL_AT + 300 + i * ARGUMENT_STAGGER, tone, ...place })

/**
 * Deliberately arrogant, technically honest. These describe what THIS
 * project gets from its Panda CSS architecture — not things Tailwind cannot do.
 */
export const ARGUMENTS: readonly SmokeArgument[] = [
  argument(0, 'clean-jsx', 'CLEAN JSX', 'Readable components, no long strings of utility classes.', { x: -24, y: -33, fromX: 8, fromY: 6 }, 'violet'),
  argument(1, 'type-safe', 'TYPE-SAFE STYLES', 'Styles, tokens and variants inside our TypeScript experience.', { x: 23, y: -35, fromX: -8, fromY: 6 }, 'cyan'),
  argument(2, 'recipes', 'COMPOSABLE RECIPES', 'Reusable, explicit, well-organised recipes and variants.', { x: -25, y: -18, fromX: 9, fromY: -3 }, 'lime'),
  argument(3, 'tokens', 'DESIGN TOKENS', 'One source of truth for colours, sizes and styles.', { x: 0, y: -38, fromX: 0, fromY: 8 }, 'orange'),
  argument(4, 'build-time', 'BUILD-TIME CSS', 'CSS generated statically at compile time.', { x: -19, y: -6, fromX: 10, fromY: -6 }, 'violet'),
  argument(5, 'animations', 'MAINTAINABLE ANIMATIONS', 'Named, composable movements, separate from React components.', { x: 25, y: -21, fromX: -9, fromY: 3 }, 'lime'),
  argument(6, 'no-runtime', 'NO RUNTIME CSS-IN-JS ENGINE', 'Static styles need no style-injection engine in the browser.', { x: -5, y: -27, fromX: 6, fromY: 6 }, 'cyan'),
]

// --- The verdict ------------------------------------------------------------------------

export type VerdictLineKind = 'question' | 'word' | 'hero' | 'burn' | 'note'

export interface VerdictLine {
  id: string
  text: string
  kind: VerdictLineKind
  at: number
}

export const VERDICT_AT = REVEAL_AT + 9600
/** The verdict cloud breaks apart as the Aura King chapter begins — gone before he looks up. */
export const VERDICT_END = KING_AT + 400
export const VERDICT_FADE = 1500
export const VERDICT_POSITION = { x: 0, y: -26 }

export const VERDICT_LINES: readonly VerdictLine[] = [
  { id: 'question', text: 'WHY PANDA OVER TAILWIND?', kind: 'question', at: VERDICT_AT + 300 },
  { id: 'readability', text: 'READABILITY.', kind: 'word', at: VERDICT_AT + 1100 },
  { id: 'composition', text: 'COMPOSITION.', kind: 'word', at: VERDICT_AT + 1400 },
  { id: 'type-safety', text: 'TYPE SAFETY.', kind: 'word', at: VERDICT_AT + 1700 },
  { id: 'maintainability', text: 'MAINTAINABILITY.', kind: 'word', at: VERDICT_AT + 2000 },
  { id: 'hero', text: 'PANDA CSS. INFINITE AURA.', kind: 'hero', at: VERDICT_AT + 2800 },
  { id: 'burn', text: 'TAILWIND GOT AURAMOGGED.', kind: 'burn', at: VERDICT_AT + 3600 },
  {
    id: 'note',
    text: 'An opinionated choice for this project. Both tools can ship great, performant CSS.',
    kind: 'note',
    at: VERDICT_AT + 4000,
  },
]
export const VERDICT_LINE_EMERGE = 900

export { SMOKE_ORIGIN }
