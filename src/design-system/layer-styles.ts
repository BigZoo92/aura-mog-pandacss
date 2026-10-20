import { defineLayerStyles } from '@pandacss/dev'

/**
 * Materials. A layer style is a named bundle of surface properties, so every
 * wooden part of Tung Tung shares one wood grain and every piece of the
 * costume shares one fabric — `css({ layerStyle: 'wood' })`.
 */
export const layerStyles = defineLayerStyles({
  /** Carved wood: vertical grain + cylindrical shading (a log, lit from the left). */
  wood: {
    description: 'Tung Tung wood with grain and cylindrical shading',
    value: {
      backgroundColor: '{colors.wood}',
      backgroundImage:
        'linear-gradient(90deg, rgba(46,22,6,0.30), transparent 18%, rgba(255,236,200,0.28) 32%, transparent 52%, rgba(46,22,6,0.34) 100%), repeating-linear-gradient(90deg, transparent 0 0.85em, rgba(78,40,13,0.20) 0.85em 0.97em, transparent 0.97em 1.55em, rgba(78,40,13,0.12) 1.55em 1.63em, transparent 1.63em 2.3em)',
    },
  },
  /** Thin wooden limbs: grain along the bone. */
  woodLimb: {
    description: 'Wooden limb with lengthwise grain',
    value: {
      backgroundColor: '{colors.wood.mid}',
      backgroundImage:
        'linear-gradient(90deg, rgba(255,236,200,0.35) 0 22%, transparent 22% 62%, rgba(46,22,6,0.30) 62%), repeating-linear-gradient(0deg, transparent 0 1.1em, rgba(78,40,13,0.18) 1.1em 1.2em)',
    },
  },
  /** Onesie fabric, white panel. */
  fleeceWhite: {
    description: 'White panda onesie fleece',
    value: {
      backgroundColor: '{colors.onesie.white}',
      backgroundImage:
        'radial-gradient(ellipse 60% 45% at 35% 25%, rgba(255,255,255,0.9), transparent 70%), linear-gradient(90deg, rgba(16,16,20,0.10), transparent 25%, transparent 75%, rgba(16,16,20,0.14))',
    },
  },
  /** Onesie fabric, black panel. */
  fleeceBlack: {
    description: 'Black panda onesie fleece',
    value: {
      backgroundColor: '{colors.onesie.black}',
      backgroundImage:
        'radial-gradient(ellipse 50% 40% at 35% 20%, rgba(255,255,255,0.12), transparent 70%), linear-gradient(90deg, rgba(255,255,255,0.06) 0 26%, transparent 26%)',
    },
  },
})
