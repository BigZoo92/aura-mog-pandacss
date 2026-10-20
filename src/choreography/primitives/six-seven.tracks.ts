import { arm } from '../motion/ik'
import { defineTracks, type TrackDefinition } from '../motion/track'

/**
 * SIX SEVEN — both palms up, alternately rising and falling as if weighing two
 * invisible objects. Written once as a parametric primitive, then reused by
 * Six Seven Woah, Griddy 67 (front AND behind the back), 67 Twerky and the
 * ghost arms of the final Dab.
 */
interface SixSevenOptions {
  summary: string
  duration: number
  /** Wrist targets for the high and low positions (left side; right is mirrored). */
  high: { x: number; y: number }
  low: { x: number; y: number }
  /** Absolute hand angle for the left hand (right is mirrored). */
  hand: number
  elbow?: 'out' | 'down' | 'in' | 'up'
  ghost?: boolean
  /** Shoulder shrug amplitude (em) — the shoulders "feel the weight". */
  shrug?: number
  /** Animate head tilt along with the palms. */
  head?: boolean
}

function sixSeven(options: SixSevenOptions): TrackDefinition {
  const { high, low, hand, elbow = 'down', ghost = false, shrug = 0.35, head = true } = options
  const pose = (leftUp: boolean) => {
    const l = leftUp ? high : low
    const r = leftUp ? low : high
    const lift = (up: boolean) => (ghost ? undefined : { y: up ? -shrug : shrug * 0.5 })
    return {
      ...arm('L', { ...l, elbow, hand, shoulder: lift(leftUp) }, { ghost }),
      ...arm('R', { x: -r.x, y: r.y, elbow, hand: -hand, shoulder: lift(!leftUp) }, { ghost }),
      ...(head ? { head: { r: leftUp ? -6 : 6, y: 0.15 } } : {}),
    }
  }
  return {
    summary: options.summary,
    duration: options.duration,
    easing: 'inOut',
    frames: {
      0: pose(true),
      50: pose(false),
      100: pose(true),
    },
  }
}

const FRONT = { high: { x: -7.2, y: -6.6 }, low: { x: -6.4, y: -1.5 }, hand: 104 }

export const sixSevenTracks = defineTracks({
  sixSevenPalms: sixSeven({
    summary: '67: palms up in front, alternating heights like weighing two choices.',
    duration: 600,
    ...FRONT,
  }),
  sixSevenPalmsFast: sixSeven({
    summary: '67 at double speed — the panic of indecision.',
    duration: 300,
    ...FRONT,
    shrug: 0.25,
  }),
  sixSevenPalmsQuiet: sixSeven({
    summary: '67 palms without head motion, for moves whose head is busy elsewhere.',
    duration: 500,
    ...FRONT,
    head: false,
  }),
  sixSevenBehind: sixSeven({
    summary: '67 performed BEHIND the back while facing away — palms peeking out above the hips.',
    duration: 500,
    high: { x: -2.6, y: -4.6 },
    low: { x: -3, y: -2.4 },
    hand: 82,
    elbow: 'out',
    shrug: 0.3,
    head: false,
  }),
  sixSevenTwerk: sixSeven({
    summary: '67 while twerking: elbows tucked at the sides, palms up just outside the hips.',
    duration: 600,
    high: { x: -7.8, y: -4 },
    low: { x: -7.2, y: 0.8 },
    hand: 112,
    elbow: 'in',
    shrug: 0.3,
    head: false,
  }),
  sixSevenWide: sixSeven({
    summary: '67 with the palms held wide at hip height (visible around a twerking body).',
    duration: 500,
    high: { x: -8.6, y: -3.6 },
    low: { x: -8.2, y: -0.6 },
    hand: 120,
    elbow: 'down',
    shrug: 0.3,
    head: false,
  }),
  sixSevenGhost: sixSeven({
    summary: 'Ghost arms sprout from the back and do the 67 by themselves.',
    duration: 400,
    high: { x: -8.4, y: -10.8 },
    low: { x: -8.8, y: -7.4 },
    hand: 120,
    elbow: 'down',
    ghost: true,
    head: false,
  }),
})
