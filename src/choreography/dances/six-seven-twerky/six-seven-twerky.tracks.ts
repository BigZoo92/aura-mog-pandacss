import { hold } from '../../motion/hold'
import { arm, legs, type PelvisPlacement } from '../../motion/ik'
import { defineTracks, type TrackFrame } from '../../motion/track'

/**
 * 67 TWERKY — BACK VIEW UNLOCKED.
 *
 * A twerk is NOT a whole-body bounce. Here every region has its own track:
 *
 *   twerkPelvis   pelvis rises and drops, knees flex/extend through leg IK
 *   twerkTorso    the torso COUNTER-moves, so the upper body stays put
 *   twerkHips     the onesie bottom pops up/back and tilts, double-time
 *   twerkCheeks   each cheek jiggles on its own, out of phase
 *   tailWag / hoodEarsBounce — costume follow-through (shared primitives)
 *   sixSevenTwerk the 67 palms, on their own rhythm, hands out past the hips
 *
 * The cycles (500 / 250 / 600 ms) deliberately don't match the 67 — that
 * offset is what makes it read as two dances at once.
 */
const FEET = { L: { x: -4.8, knee: 'out' as const }, R: { x: 4.8, knee: 'out' as const } }
const SQUAT = 3.1
const POP = 1.25

const pelvisAt = (pelvis: PelvisPlacement): TrackFrame => legs({ pelvis, ...FEET })

/** Upper-body compensation: when the pelvis rises by `rise`, the torso sinks back by most of it. */
const torsoAt = (rise: number, r = 0, x = 0): TrackFrame => ({ torso: { r, x, y: 1.5 + rise * 0.85 } })

export const sixSevenTwerkyTracks = defineTracks({
  // --- Phase A: the turn -------------------------------------------------------
  twerkyLookPrep: {
    summary: 'An arrogant look into the camera, one eyebrow up, a little prep dip.',
    duration: 900,
    iterations: 1,
    easing: 'inOut',
    frames: {
      0: {
        ...legs({ pelvis: { y: 0.4 }, L: { x: -2.9 }, R: { x: 2.9 } }),
        ...arm('L', { x: -6.6, y: 0, hand: 12 }),
        ...arm('R', { x: 6.6, y: 0, hand: -12 }),
        head: { r: 0, y: 0 },
        browL: { x: 0, y: 0, r: 0 },
      },
      35: { head: { r: -8, y: -0.2 }, browL: { x: 0, y: -1.3, r: -12 } },
      70: {
        ...legs({ pelvis: { y: 1.5 }, L: { x: -3.4 }, R: { x: 3.4 } }),
        ...arm('L', { x: -4.9, y: -1.4, elbow: 'out', hand: -40 }),
        ...arm('R', { x: 4.9, y: -1.4, elbow: 'out', hand: 40 }),
        head: { r: -8, y: -0.2 },
        browL: { x: 0, y: -1.3, r: -12 },
      },
      100: {
        ...legs({ pelvis: { y: 1.7 }, L: { x: -3.5 }, R: { x: 3.5 } }),
        ...arm('L', { x: -4.9, y: -1.4, elbow: 'out', hand: -40 }),
        ...arm('R', { x: 4.9, y: -1.4, elbow: 'out', hand: 40 }),
        head: { r: 4, y: 0 },
        browL: { x: 0, y: -0.6, r: -6 },
      },
    },
  },

  /**
   * Front → profile → back. `--facing` steps 0 → 0.5 → 1 while a y-rotation
   * (with perspective) sells the spin: the front narrows away, the profile
   * swings through, the back opens up.
   */
  twerkyTurn: {
    summary: 'A progressive 180°: front, clear profile, back — then hips over the back.',
    duration: 1200,
    iterations: 1,
    easing: 'inOut',
    frames: {
      0: { orient: { ry: 0, sx: 1, facing: 0 }, hips: { z: 0 }, body: { y: 0 } },
      26: { orient: { ry: 58, sx: 0.86, facing: 0 }, body: { y: -0.8 } },
      27: { orient: { ry: -26, sx: 0.78, facing: 0.5 } },
      50: { orient: { ry: 0, sx: 0.74, facing: 0.5 }, body: { y: -1.2 } },
      61: { orient: { ry: 26, sx: 0.78, facing: 0.5 }, hips: { z: 0 } },
      62: { orient: { ry: -58, sx: 0.86, facing: 1 }, hips: { z: 2 } },
      100: { orient: { ry: 0, sx: 1, facing: 1 }, hips: { z: 2 }, body: { y: 0 } },
    },
  },
  twerkyTurnBody: {
    summary: 'During the spin the legs step out wide and the arms come to the 67 position.',
    duration: 1200,
    iterations: 1,
    easing: 'inOut',
    frames: {
      0: {
        ...legs({ pelvis: { y: 1.7 }, L: { x: -3.5 }, R: { x: 3.5 } }),
        ...arm('L', { x: -4.9, y: -1.4, elbow: 'out', hand: -40 }),
        ...arm('R', { x: 4.9, y: -1.4, elbow: 'out', hand: 40 }),
        head: { r: 4, x: 0, y: 0, look: 0 },
      },
      50: {
        ...legs({ pelvis: { y: 0.9 }, L: { x: -2.2, lift: 1.2 }, R: { x: 2.6 } }),
        ...arm('L', { x: -5.6, y: -2, elbow: 'in', hand: 40 }),
        ...arm('R', { x: 5.6, y: -2, elbow: 'in', hand: -40 }),
      },
      100: {
        ...pelvisAt({ y: SQUAT - 0.6 }),
        ...arm('L', { x: -7.4, y: -1.8, elbow: 'in', hand: 112 }),
        ...arm('R', { x: 7.4, y: -1.8, elbow: 'in', hand: -112 }),
        head: { r: 0, x: 0, y: 0.6, look: 0 },
      },
    },
  },

  // --- Phase B: the twerk ---------------------------------------------------------
  twerkPelvis: {
    summary: 'Pelvis pops up and drops back down; knees extend and flex with it (leg IK).',
    duration: 500,
    easing: 'inOut',
    frames: {
      0: { ...pelvisAt({ y: SQUAT }), ease: 'snap' },
      38: { ...pelvisAt({ y: SQUAT - POP, r: 0 }), ease: 'in' },
      100: pelvisAt({ y: SQUAT }),
    },
  },
  twerkTorso: {
    summary: 'Torso counter-moves against the pelvis: the upper body barely rises.',
    duration: 500,
    easing: 'inOut',
    frames: {
      0: { ...torsoAt(0), ease: 'snap' },
      38: { ...torsoAt(POP, 1.5), ease: 'in' },
      100: torsoAt(0),
    },
  },
  twerkHips: {
    summary: 'The onesie bottom tilts and pops up-and-back twice per pelvis cycle.',
    duration: 250,
    easing: 'inOut',
    frames: {
      0: { hips: { x: 0, y: 0.3, r: 0, sx: 1.06, sy: 0.9 }, ease: 'snap' },
      35: { hips: { x: 0, y: -1.3, r: -3, sx: 0.96, sy: 1.22 }, ease: 'in' },
      100: { hips: { x: 0, y: 0.3, r: 0, sx: 1.06, sy: 0.9 } },
    },
  },
  twerkCheeks: {
    summary: 'Each cheek jiggles independently — left leads, right follows.',
    duration: 250,
    easing: 'inOut',
    frames: {
      0: { cheekL: { y: 0.3, r: 5 }, cheekR: { y: -0.6, r: 8 } },
      30: { cheekL: { y: -0.9, r: -8 }, cheekR: { y: 0.2, r: -3 } },
      60: { cheekL: { y: 0.4, r: 3 }, cheekR: { y: -0.9, r: -10 } },
      100: { cheekL: { y: 0.3, r: 5 }, cheekR: { y: -0.6, r: 8 } },
    },
  },
  twerkHead: {
    summary: 'Head tipped forward and down, nodding through the bounce.',
    duration: 500,
    easing: 'inOut',
    frames: {
      0: { neck: 0, head: { r: 0, x: 0, y: 1.8, look: 0 } },
      38: { neck: 3, head: { r: 2, x: 0, y: 2.2, look: 0 } },
      100: { neck: 0, head: { r: 0, x: 0, y: 1.8, look: 0 } },
    },
  },

  // --- Tempo variation: slow lateral wind ------------------------------------------
  twerkWind: {
    summary: 'Half-time variation: hips swing side to side, knees still bent.',
    duration: 1000,
    easing: 'inOut',
    frames: {
      0: pelvisAt({ y: SQUAT - 0.3, x: -1.4, r: -8 }),
      25: pelvisAt({ y: SQUAT, x: 0, r: 0 }),
      50: pelvisAt({ y: SQUAT - 0.3, x: 1.4, r: 8 }),
      75: pelvisAt({ y: SQUAT, x: 0, r: 0 }),
      100: pelvisAt({ y: SQUAT - 0.3, x: -1.4, r: -8 }),
    },
  },
  twerkWindTorso: {
    summary: 'The torso leans against the swing so the shoulders stay centred.',
    duration: 1000,
    easing: 'inOut',
    frames: {
      0: torsoAt(0.3, 7, 1.1),
      25: torsoAt(0, 0, 0),
      50: torsoAt(0.3, -7, -1.1),
      75: torsoAt(0, 0, 0),
      100: torsoAt(0.3, 7, 1.1),
    },
  },

  // --- Phase D: the look back and the freeze ---------------------------------------
  twerkLookBack: {
    summary: 'Only the head turns: a smug look over the shoulder, straight into the camera.',
    duration: 500,
    easing: 'inOut',
    frames: {
      0: { neck: -5, head: { r: -12, x: -1.7, y: 0.4, look: 1 } },
      38: { neck: -3, head: { r: -9, x: -1.7, y: 0.7, look: 1 } },
      100: { neck: -5, head: { r: -12, x: -1.7, y: 0.4, look: 1 } },
    },
  },
  twerkFreeze: hold(
    'Freeze frame: hips popped, 67 hands split, smug look over the shoulder.',
    {
      ...pelvisAt({ y: SQUAT - POP }),
      ...torsoAt(POP, 2),
      hips: { x: 0, y: -1.3, r: -4, sx: 0.95, sy: 1.22 },
      cheekL: { y: -0.9, r: -8 },
      cheekR: { y: 0.2, r: -3 },
      tail: { r: 28, y: -0.6 },
      ...arm('L', { x: -7.8, y: -4, elbow: 'in', hand: 112 }),
      ...arm('R', { x: 7.2, y: 0.8, elbow: 'in', hand: -112 }),
      shoulderL: { x: 0, y: -0.4 },
      shoulderR: { x: 0, y: 0.2 },
      neck: -6,
      head: { r: -13, x: -1.8, y: 0.4, look: 1 },
      hoodEarL: { r: 14, sy: 1.25 },
      hoodEarR: { r: -14, sy: 1.25 },
    },
    { duration: 600, tremble: 0.06 },
  ),
})
