import { arm, legs } from '../../motion/ik'
import { defineTracks } from '../../motion/track'

/**
 * FRESH — the 90s sitcom side-step. Step-touch side to side, elbows held high
 * and bent, arms pumping across the body opposite to the hips, shoulders
 * shimmying on the half-beat, head tilting with a huge grin.
 * 0% = weight on the left, 50% = weight on the right.
 */
export const freshTracks = defineTracks({
  freshStepTouch: {
    summary: 'Step-touch: weight shifts side to side, the free foot taps in.',
    duration: 1000,
    easing: 'inOut',
    frames: {
      0: { ...legs({ pelvis: { x: -1.4, y: 0.9, r: -4 }, L: { x: -4.4 }, R: { x: -0.4, lift: 0.3, toes: 14 } }), body: { sy: 0.98 } },
      25: { ...legs({ pelvis: { x: 0, y: 0.3, r: 0 }, L: { x: -3.6, lift: 0.8 }, R: { x: 2.2, lift: 1.2 } }), body: { sy: 1.03 } },
      50: { ...legs({ pelvis: { x: 1.4, y: 0.9, r: 4 }, L: { x: 0.4, lift: 0.3, toes: 14 }, R: { x: 4.4 } }), body: { sy: 0.98 } },
      75: { ...legs({ pelvis: { x: 0, y: 0.3, r: 0 }, L: { x: -2.2, lift: 1.2 }, R: { x: 3.6, lift: 0.8 } }), body: { sy: 1.03 } },
      100: { ...legs({ pelvis: { x: -1.4, y: 0.9, r: -4 }, L: { x: -4.4 }, R: { x: -0.4, lift: 0.3, toes: 14 } }), body: { sy: 0.98 } },
    },
  },
  freshArmPump: {
    summary: 'Bent elbows held high, forearms swinging across the chest opposite to the hips.',
    duration: 1000,
    easing: 'inOut',
    frames: {
      0: {
        ...arm('L', { x: -0.6, y: -5.6, elbow: 'down', hand: -60 }),
        ...arm('R', { x: 8.4, y: -5.2, elbow: 'down', hand: -110 }),
        torso: 6,
      },
      50: {
        ...arm('L', { x: -8.4, y: -5.2, elbow: 'down', hand: 110 }),
        ...arm('R', { x: 0.6, y: -5.6, elbow: 'down', hand: 60 }),
        torso: -6,
      },
      100: {
        ...arm('L', { x: -0.6, y: -5.6, elbow: 'down', hand: -60 }),
        ...arm('R', { x: 8.4, y: -5.2, elbow: 'down', hand: -110 }),
        torso: 6,
      },
    },
  },
  freshShimmy: {
    summary: 'Shoulder shimmy on every half beat.',
    duration: 250,
    easing: 'inOut',
    frames: {
      0: { shoulderL: { x: 0, y: -0.45 }, shoulderR: { x: 0, y: 0.25 } },
      50: { shoulderL: { x: 0, y: 0.25 }, shoulderR: { x: 0, y: -0.45 } },
      100: { shoulderL: { x: 0, y: -0.45 }, shoulderR: { x: 0, y: 0.25 } },
    },
  },
  freshHead: {
    summary: 'Playful head tilts, a beat behind the hips.',
    duration: 1000,
    easing: 'inOut',
    frames: {
      0: { neck: -5, head: { r: 9, y: 0 } },
      25: { head: { r: 0, y: 0.5 } },
      50: { neck: 5, head: { r: -9, y: 0 } },
      75: { head: { r: 0, y: 0.5 } },
      100: { neck: -5, head: { r: 9, y: 0 } },
    },
  },
})
