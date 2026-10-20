import { defineTracks } from '../motion/track'

/**
 * Secondary motion of the panda onesie: the hood ears and the pom-pom tail
 * react a beat late to whatever the body is doing (follow-through).
 */
export const costumeTracks = defineTracks({
  hoodEarsBounce: {
    summary: 'Hood ears flop with a slight lag, out of phase with each other.',
    duration: 250,
    easing: 'inOut',
    frames: {
      0: { hoodEarL: { r: -10, sy: 0.92 }, hoodEarR: { r: 6, sy: 1.04 } },
      50: { hoodEarL: { r: 6, sy: 1.04 }, hoodEarR: { r: -10, sy: 0.92 } },
      100: { hoodEarL: { r: -10, sy: 0.92 }, hoodEarR: { r: 6, sy: 1.04 } },
    },
  },
  hoodEarsPerk: {
    summary: 'Hood ears stand to attention, then settle (impact reaction).',
    duration: 700,
    iterations: 1,
    easing: 'overshoot',
    frames: {
      0: { hoodEarL: { r: 0, sy: 1 }, hoodEarR: { r: 0, sy: 1 } },
      30: { hoodEarL: { r: 14, sy: 1.25 }, hoodEarR: { r: -14, sy: 1.25 } },
      100: { hoodEarL: { r: 0, sy: 1 }, hoodEarR: { r: 0, sy: 1 } },
    },
  },
  tailWag: {
    summary: 'The pom-pom tail wags and bobs behind the hip pops.',
    duration: 250,
    easing: 'inOut',
    frames: {
      0: { tail: { r: -24, y: 0.2 } },
      50: { tail: { r: 24, y: -0.5 } },
      100: { tail: { r: -24, y: 0.2 } },
    },
  },
})
