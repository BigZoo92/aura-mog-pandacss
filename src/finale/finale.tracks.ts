import { hold } from '../choreography/motion/hold'
import { arm, legs, type ArmTarget } from '../choreography/motion/ik'
import { defineTracks, type TrackFrame } from '../choreography/motion/track'
import { EXHALE_POSE, SEAT } from './seat'

/**
 * ACT V — THE FINAL PUFF. Every gesture is a track like any dance move:
 * the hand really travels to the pocket, the JNR really pops out of it, the
 * mouthpiece really meets the lips (solved with the same arm IK).
 *
 * Hand space points along the fingers; the JNR's mouthpiece sits 6.45 rig
 * units past the wrist along that axis, so `toMouth` places the WRIST such
 * that the tip lands on the mouth.
 */

const WORLD = { world: { x: SEAT.x, y: 0 } }

/** Seated on the knocked-out boss: knees wide, feet planted. */
const SEATED_LEGS = legs({ pelvis: { y: SEAT.drop }, L: { x: -5.4, knee: 'out' }, R: { x: 5.4, knee: 'out' } })
const L_ON_KNEE = arm('L', { x: -7.4, y: 2.6, elbow: 'out', hand: 30 })

const MOUTH = { x: 0.2, y: -11.8 }
const JNR_REACH = 6.45
/** Wrist target that puts the JNR mouthpiece on the lips at hand angle `angle`. */
const toMouth = (angle: number, mouth = MOUTH): ArmTarget => {
  const rad = (angle * Math.PI) / 180
  // A bone at rotation θ points along (-sin θ, cos θ).
  return { x: mouth.x + JNR_REACH * Math.sin(rad), y: mouth.y - JNR_REACH * Math.cos(rad), elbow: 'down', hand: angle }
}
const R_AT_MOUTH = arm('R', toMouth(162))
const R_HOLDING_HIGH = arm('R', { x: 5.6, y: -8.2, elbow: 'down', hand: 168 })
const R_ON_KNEE = arm('R', { x: 7.2, y: 1.8, elbow: 'out', hand: 150 })

const SEATED: TrackFrame = { ...WORLD, ...SEATED_LEGS, ...L_ON_KNEE, torso: 0, neck: 0, head: { r: 0, x: 0, y: 0 } }

export const finaleTracks = defineTracks({
  // --- Scene 1: Tailwind is down ------------------------------------------------
  insolentVictory: hold(
    'Arms crossed, chin up, staring down the knocked-out boss.',
    {
      ...legs({ pelvis: { y: 0.6 }, L: { x: -4 }, R: { x: 4 } }),
      ...arm('L', { x: 2.4, y: -6.3, elbow: 'out', hand: -100 }),
      ...arm('R', { x: -2.4, y: -6.9, elbow: 'out', hand: 100 }),
      shoulderR: { x: 0, y: 0, z: 3 },
      torso: -2,
      neck: 4,
      head: { r: 8, x: 0.5, y: -0.2 },
      eyes: { x: 0.6, y: 0 },
    },
    { duration: 700, tremble: 0.03 },
  ),
  strollToSeat: {
    summary: 'A casual, insolent stroll over to the boss.',
    duration: 1800,
    iterations: 1,
    easing: 'inOut',
    frames: { 0: { world: { x: 0, y: 0 } }, 100: WORLD },
  },
  sitDown: {
    summary: 'Hops and drops onto the boss like it is an armchair.',
    duration: 1700,
    iterations: 1,
    easing: 'inOut',
    frames: {
      0: {
        ...WORLD,
        ...legs({ pelvis: { y: 0.4 }, L: { x: -3 }, R: { x: 3 } }),
        ...arm('L', { x: -6.4, y: 0, hand: 12 }),
        ...arm('R', { x: 6.4, y: 0, hand: -12 }),
        body: { y: 0, sx: 1, sy: 1 },
        head: { r: 6, x: 0.4, y: 0 },
      },
      30: {
        ...legs({ pelvis: { y: 1.8 }, L: { x: -3.6 }, R: { x: 3.6 } }),
        body: { y: 0, sx: 1.05, sy: 0.95 },
        ease: 'out',
      },
      48: {
        ...legs({ pelvis: { y: 2.4 }, L: { x: -3.6, lift: 1.4 }, R: { x: 3.6, lift: 1.4 } }),
        ...arm('L', { x: -8.4, y: -8, elbow: 'down', hand: 150 }),
        ...arm('R', { x: 8.4, y: -8, elbow: 'down', hand: -150 }),
        body: { y: -3.2, sx: 0.96, sy: 1.05 },
        ease: 'in',
      },
      68: {
        ...WORLD,
        ...legs({ pelvis: { y: SEAT.drop + 0.6 }, L: { x: -5.4, knee: 'out' }, R: { x: 5.4, knee: 'out' } }),
        body: { y: 0, sx: 1.1, sy: 0.9 },
        head: { r: 0, x: 0, y: 0.6 },
        ease: 'bounce',
      },
      100: { ...SEATED, ...R_ON_KNEE, body: { y: 0, sx: 1, sy: 1 } },
    },
  },

  // --- Scenes 2–3: the JNR and the dramatic puff --------------------------------
  pullJnr: {
    summary: 'Reaches into the onesie pocket and pulls out the JNR.',
    duration: 1300,
    iterations: 1,
    easing: 'inOut',
    frames: {
      0: { ...SEATED, ...R_ON_KNEE, propR: { o: 0, s: 0.3 } },
      38: { ...arm('R', { x: 1.4, y: -2.6, elbow: 'out', hand: -10 }), head: { r: 8, x: 0, y: 0.6 }, propR: { o: 0, s: 0.3 } },
      52: { ...arm('R', { x: 2.4, y: -4.6, elbow: 'down', hand: 120 }), propR: { o: 1, s: 1.15 } },
      100: { ...SEATED, ...R_HOLDING_HIGH, head: { r: 0, x: 0, y: 0 }, propR: { o: 1, s: 1 } },
    },
  },
  lookAtJnr: {
    summary: 'Raises it to eye level and admires it. Unnecessarily.',
    duration: 1000,
    iterations: 1,
    easing: 'inOut',
    frames: {
      0: { ...SEATED, ...R_HOLDING_HIGH, eyes: { x: 0, y: 0 }, browL: { x: 0, y: 0, r: 0 }, browR: { x: 0, y: 0, r: 0 } },
      40: {
        ...arm('R', { x: 4.8, y: -10.4, elbow: 'down', hand: 176 }),
        neck: 4,
        head: { r: 9, x: 0.3, y: 0 },
        eyes: { x: 0.65, y: -0.15 },
        browL: { x: 0, y: -0.7, r: -6 },
        browR: { x: 0, y: -0.7, r: 6 },
      },
      100: {
        ...arm('R', { x: 4.8, y: -10.4, elbow: 'down', hand: 176 }),
        neck: 4,
        head: { r: 9, x: 0.3, y: 0 },
        eyes: { x: 0.65, y: -0.15 },
        browL: { x: 0, y: -0.7, r: -6 },
        browR: { x: 0, y: -0.7, r: 6 },
      },
    },
  },
  bringToMouth: {
    summary: 'Brings the mouthpiece to his lips — wrist solved so the tip meets the mouth.',
    duration: 900,
    iterations: 1,
    easing: 'inOut',
    frames: {
      0: { ...SEATED, ...arm('R', { x: 4.8, y: -10.4, elbow: 'down', hand: 176 }), neck: 4, head: { r: 9, x: 0.3, y: 0 }, eyes: { x: 0.65, y: -0.15 } },
      100: { ...SEATED, ...R_AT_MOUTH, neck: 0, head: { r: -2, x: 0, y: 0 }, eyes: { x: 0, y: 0 } },
    },
  },
  inhale: {
    summary: 'One long, slow pull: shoulders rise, eyes close, the LED glows.',
    duration: 1700,
    iterations: 1,
    easing: 'inOut',
    frames: {
      0: {
        ...SEATED,
        ...R_AT_MOUTH,
        shoulderL: { x: 0, y: 0 },
        head: { r: -2, x: 0, y: 0 },
        eyes: { sx: 1, sy: 1 },
        propGlow: { o: 0.25 },
        hoodEarL: { r: 0, sy: 1 },
        hoodEarR: { r: 0, sy: 1 },
        body: { sx: 1, sy: 1 },
      },
      20: { propGlow: { o: 1 } },
      100: {
        ...arm('L', { x: -7.4, y: 1.8, elbow: 'out', hand: 30, shoulder: { y: -0.7 } }),
        ...arm('R', { ...toMouth(162), shoulder: { y: -0.7 } }),
        head: { r: -4, x: 0, y: -0.3 },
        eyes: { sx: 1.05, sy: 0.18 },
        propGlow: { o: 1 },
        hoodEarL: { r: 10, sy: 1.15 },
        hoodEarR: { r: -10, sy: 1.15 },
        body: { sx: 0.98, sy: 1.035 },
      },
    },
  },
  holdBreath: hold(
    'Holds it. Looks straight into the camera. Says nothing.',
    {
      ...SEATED,
      ...arm('L', { x: -7.4, y: 1.8, elbow: 'out', hand: 30, shoulder: { y: -0.7 } }),
      ...arm('R', { x: 5.2, y: -7.4, elbow: 'down', hand: 168, shoulder: { y: -0.7 } }),
      head: { r: 0, x: 0, y: -0.3 },
      eyes: { sx: 1.08, sy: 1.08 },
      propGlow: { o: 0.25 },
      hoodEarL: { r: 10, sy: 1.15 },
      hoodEarR: { r: -10, sy: 1.15 },
      body: { sx: 0.98, sy: 1.035 },
    },
    { duration: 900 },
  ),
  exhale: {
    summary: 'Chin up, mouth wide open: the giant exhale. Everything deflates.',
    duration: 2400,
    iterations: 1,
    easing: 'out',
    frames: {
      0: {
        ...SEATED,
        ...arm('L', { x: -7.4, y: 1.8, elbow: 'out', hand: 30, shoulder: { y: -0.7 } }),
        ...arm('R', { x: 5.2, y: -7.4, elbow: 'down', hand: 168, shoulder: { y: -0.7 } }),
        head: { r: 0, x: 0, y: -0.3 },
        body: { sx: 0.98, sy: 1.035 },
      },
      18: {
        torso: EXHALE_POSE.torso,
        neck: EXHALE_POSE.neck,
        head: { r: EXHALE_POSE.head, x: 0, y: 0 },
        body: { sx: 1.02, sy: 0.97 },
      },
      100: {
        ...SEATED,
        ...L_ON_KNEE,
        ...arm('R', { x: 6.2, y: -5.6, elbow: 'down', hand: 160 }),
        torso: EXHALE_POSE.torso,
        neck: EXHALE_POSE.neck,
        head: { r: EXHALE_POSE.head, x: 0, y: 0 },
        body: { sx: 1, sy: 1 },
      },
    },
  },

  // --- Scenes 5–6: lounging in his own smoke, then the final look ------------------
  smokeLounge: {
    summary: 'Leans back on his throne, JNR held casually, watching his smoke write the verdict.',
    duration: 2400,
    easing: 'inOut',
    frames: {
      0: {
        ...SEATED,
        ...arm('R', { x: 6.2, y: -5.6, elbow: 'down', hand: 160 }),
        torso: -3,
        neck: -6,
        head: { r: -6, x: -0.2, y: 0 },
        eyes: { x: -0.4, y: -0.3 },
      },
      50: { torso: -2, neck: -4, head: { r: -3, x: -0.2, y: 0.25 }, eyes: { x: -0.55, y: -0.35 } },
      100: {
        ...SEATED,
        ...arm('R', { x: 6.2, y: -5.6, elbow: 'down', hand: 160 }),
        torso: -3,
        neck: -6,
        head: { r: -6, x: -0.2, y: 0 },
        eyes: { x: -0.4, y: -0.3 },
      },
    },
  },
  kingLowerAndLook: {
    summary: 'Slowly lowers the JNR, then raises his head straight into the camera.',
    duration: 2600,
    iterations: 1,
    easing: 'inOut',
    frames: {
      0: { ...SEATED, ...arm('R', { x: 6.2, y: -5.6, elbow: 'down', hand: 160 }), torso: -3, neck: -6, head: { r: -6, x: -0.2, y: 0 }, eyes: { x: -0.4, y: -0.3 } },
      60: { ...SEATED, ...R_ON_KNEE, torso: -1, neck: 2, head: { r: 4, x: 0, y: 0.5 }, eyes: { x: 0, y: 0.25 } },
      100: { ...SEATED, ...R_ON_KNEE, torso: 0, neck: -3, head: { r: -4, x: 0, y: -0.2 }, eyes: { x: 0, y: 0 } },
    },
  },
  auraKingPose: hold(
    'The Aura King, enthroned on Tailwind. Dramatic pause.',
    { ...SEATED, ...R_ON_KNEE, torso: 0, neck: -3, head: { r: -4, x: 0, y: -0.2 }, eyes: { x: 0, y: 0 } },
    { duration: 800, tremble: 0.035 },
  ),
})
