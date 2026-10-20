import { hold } from '../motion/hold'
import { arm, legs, STANCE } from '../motion/ik'
import { defineTracks } from '../motion/track'

/** Fists planted on the hips, elbows out: the universal "I am magnificent". */
export const HANDS_ON_HIPS = {
  ...arm('L', { x: -4.9, y: -1.4, elbow: 'out', hand: -40 }),
  ...arm('R', { x: 4.9, y: -1.4, elbow: 'out', hand: 40 }),
}

export const HERO_STANCE = legs({ pelvis: { y: 0.9 }, L: { x: -4.6 }, R: { x: 4.6 } })

/**
 * Primitives shared across chapters: turning around, heroic poses and the
 * intro strut. Turning is a cartoon "card flip": the body squashes edge-on
 * (scaleX → 0) and `--facing` flips at that exact frame, so the back
 * surfaces (back of the head, "CSS" stencil, shoe heels) take over.
 */
export const sharedTracks = defineTracks({
  turnToBack: {
    summary: 'Exaggerated 180° spin: squash edge-on, swap to the back surfaces, overshoot.',
    duration: 800,
    iterations: 1,
    easing: 'inOut',
    frames: {
      0: { orient: { sx: 1, facing: 0 }, body: { y: 0 }, head: { r: 0, x: 0 }, ease: 'windup' },
      20: { orient: { sx: 1.08, facing: 0 }, body: { y: 0.6 }, head: { r: -8, x: 0.8 } },
      49: { orient: { sx: 0.04, facing: 0 }, body: { y: -2.4 }, head: { r: 0, x: 0 } },
      51: { orient: { sx: 0.04, facing: 1 }, body: { y: -2.4 } },
      80: { orient: { sx: 1.1, facing: 1 }, body: { y: 0.4 }, ease: 'overshoot' },
      100: { orient: { sx: 1, facing: 1 }, body: { y: 0 }, head: { r: 0, x: 0 } },
    },
  },
  turnLegs: {
    summary: 'Tucked legs mid-spin so the sneakers stay consistent while edge-on.',
    duration: 800,
    iterations: 1,
    easing: 'inOut',
    frames: {
      0: { ...legs({ pelvis: { y: 0.4 }, ...STANCE }), ...arm('L', { x: -5.5, y: -1, hand: 10 }), ...arm('R', { x: 5.5, y: -1, hand: -10 }) },
      20: { ...legs({ pelvis: { y: 1.6 }, L: { x: -3.6 }, R: { x: 3.6 } }) },
      50: {
        ...legs({ pelvis: { y: 0.6 }, L: { x: -1.6, lift: 1.4 }, R: { x: 1.6, lift: 1.4 } }),
        ...arm('L', { x: -2.6, y: -5.5, elbow: 'down', hand: 150 }),
        ...arm('R', { x: 2.6, y: -5.5, elbow: 'down', hand: -150 }),
      },
      80: { ...legs({ pelvis: { y: 1.4 }, L: { x: -3.4 }, R: { x: 3.4 } }) },
      100: { ...legs({ pelvis: { y: 0.6 }, ...STANCE }), ...arm('L', { x: -5.5, y: -1, hand: 10 }), ...arm('R', { x: 5.5, y: -1, hand: -10 }) },
    },
  },

  heroPose: hold(
    'Heroic power stance: fists on hips, chin up, chest out.',
    { ...HERO_STANCE, ...HANDS_ON_HIPS, torso: 0, neck: -4, head: { r: -6, y: -0.3 } },
    { duration: 600, tremble: 0.06 },
  ),

  introStrutLegs: {
    summary: 'Cocky strut: bouncy alternating steps while sliding into frame.',
    duration: 1000,
    easing: 'inOut',
    frames: {
      0: { ...legs({ pelvis: { y: 0.2, r: -3 }, L: { x: -3.2, lift: 0 }, R: { x: 2.4, lift: 1.4, toes: 10 } }), body: { sy: 1.02 } },
      25: { ...legs({ pelvis: { y: 1, r: 0 }, L: { x: -2.6 }, R: { x: 2.8 } }), body: { sy: 0.97 } },
      50: { ...legs({ pelvis: { y: 0.2, r: 3 }, L: { x: -2.4, lift: 1.4, toes: 10 }, R: { x: 3.2 } }), body: { sy: 1.02 } },
      75: { ...legs({ pelvis: { y: 1, r: 0 }, L: { x: -2.8 }, R: { x: 2.6 } }), body: { sy: 0.97 } },
      100: { ...legs({ pelvis: { y: 0.2, r: -3 }, L: { x: -3.2, lift: 0 }, R: { x: 2.4, lift: 1.4, toes: 10 } }), body: { sy: 1.02 } },
    },
  },
  introStrutArms: {
    summary: 'Arms pumping with swagger, opposite to the legs.',
    duration: 1000,
    easing: 'inOut',
    frames: {
      0: { ...arm('L', { x: -4.6, y: -3.4, elbow: 'down', hand: -20 }), ...arm('R', { x: 7, y: 0.8, hand: -20 }), torso: 3 },
      50: { ...arm('L', { x: -7, y: 0.8, hand: 20 }), ...arm('R', { x: 4.6, y: -3.4, elbow: 'down', hand: 20 }), torso: -3 },
      100: { ...arm('L', { x: -4.6, y: -3.4, elbow: 'down', hand: -20 }), ...arm('R', { x: 7, y: 0.8, hand: -20 }), torso: 3 },
    },
  },
  introSlideIn: {
    summary: 'Travels from stage left to centre.',
    duration: 2000,
    iterations: 1,
    easing: 'out',
    frames: {
      0: { world: { x: -26 }, head: { r: 6 } },
      100: { world: { x: 0 }, head: { r: 0 } },
    },
  },
  eyebrowRaise: {
    summary: 'Looks at the camera, raises ONE eyebrow, twice. Unnecessarily dramatic.',
    duration: 2000,
    iterations: 1,
    easing: 'snap',
    frames: {
      0: { browL: { x: 0, y: 0, r: 0 }, head: { r: 0, x: 0 }, eyes: { x: 0, y: 0 } },
      20: { browL: { x: 0, y: 0, r: 0 }, head: { r: -6, x: 0 }, eyes: { x: 0.4, y: 0 } },
      30: { browL: { x: 0, y: -1.2, r: -10 } },
      45: { browL: { x: 0, y: 0, r: 0 } },
      55: { browL: { x: 0, y: -1.4, r: -14 }, head: { r: -9, x: 0 } },
      85: { browL: { x: 0, y: -1.4, r: -14 }, head: { r: -9, x: 0 }, eyes: { x: 0.4, y: 0 } },
      100: { browL: { x: 0, y: -0.6, r: -6 }, head: { r: -4, x: 0 }, eyes: { x: 0, y: 0 } },
    },
  },
  powerPoseBody: hold(
    'Weight settled, chest out, fists on hips.',
    { ...HERO_STANCE, ...HANDS_ON_HIPS, torso: 1 },
    { duration: 800, tremble: 0.04 },
  ),
})
