import type { ReactNode } from 'react'
import { css, cx, sva } from '../../../styled-system/css'
import type { HandPose } from '../rig/rig.types'

/**
 * Tung Tung's carved wooden hand. Each finger is its own element pivoting at
 * its knuckle, so a pose is a set of finger rotations + extensions (scaleY).
 * Authored for a left hand with the thumb on the +x side; right hands are
 * mirrored. A held prop (the JNR) slots BETWEEN the palm and the curled
 * fingers, so the hand genuinely wraps around it.
 */
const hand = sva({
  slots: ['art', 'thumb', 'index', 'middle', 'ring', 'pinky', 'pad', 'okRing', 'prop'],
  base: {
    art: { position: 'absolute', left: '0', top: '0' },
    thumb: { rotate: '-55deg' },
    index: { rotate: '-12deg' },
    middle: { rotate: '-3deg' },
    ring: { rotate: '6deg' },
    pinky: { rotate: '15deg' },
    pad: { opacity: 1 },
    okRing: { opacity: 0, scale: '0.4' },
    prop: { position: 'absolute', left: '0', top: '0', zIndex: 3 },
  },
  variants: {
    pose: {
      open: {},
      flat: {
        thumb: { rotate: '-22deg' },
        index: { rotate: '-3deg' },
        middle: { rotate: '-1deg' },
        ring: { rotate: '1deg' },
        pinky: { rotate: '3deg' },
      },
      palmUp: {
        art: { scale: '-1 1' },
        thumb: { rotate: '-48deg' },
        index: { rotate: '-4deg' },
        middle: { rotate: '-1deg' },
        ring: { rotate: '2deg' },
        pinky: { rotate: '5deg' },
      },
      fist: {
        thumb: { rotate: '-95deg', scale: '1 0.7' },
        index: { scale: '1 0.42' },
        middle: { scale: '1 0.42' },
        ring: { scale: '1 0.42' },
        pinky: { scale: '1 0.42' },
        pad: { opacity: 0 },
      },
      point: {
        thumb: { rotate: '-90deg', scale: '1 0.7' },
        index: { rotate: '-2deg', scale: '1 1.15' },
        middle: { scale: '1 0.42' },
        ring: { scale: '1 0.42' },
        pinky: { scale: '1 0.42' },
        pad: { opacity: 0 },
      },
      snap: {
        thumb: { rotate: '-18deg', scale: '1 0.95' },
        index: { rotate: '-20deg', scale: '1 0.55' },
        middle: { rotate: '22deg', scale: '1 0.72' },
        ring: { scale: '1 0.42' },
        pinky: { scale: '1 0.42' },
        pad: { opacity: 0 },
      },
      goggles: {
        thumb: { scale: '0' },
        index: { scale: '0' },
        middle: { rotate: '-14deg' },
        ring: { rotate: '0deg' },
        pinky: { rotate: '14deg' },
        okRing: { opacity: 1, scale: '1' },
      },
      pinch: {
        thumb: { rotate: '-12deg', scale: '1 0.9' },
        index: { rotate: '24deg', scale: '1 0.62' },
        middle: { scale: '1 0.42' },
        ring: { scale: '1 0.42' },
        pinky: { scale: '1 0.42' },
        pad: { opacity: 0 },
      },
      /** Oversized middle finger, the other knuckles folded down on either side. */
      middleFinger: {
        thumb: { rotate: '-96deg', scale: '1 0.66' },
        index: { rotate: '-14deg', scale: '1.05 0.52' },
        middle: { rotate: '0deg', scale: '1.35 1.85' },
        ring: { rotate: '12deg', scale: '1.05 0.52' },
        pinky: { rotate: '22deg', scale: '1 0.46' },
        pad: { opacity: 0 },
      },
      /** Wrapped around an object: fingers curl over its front, thumb across. */
      hold: {
        thumb: { rotate: '-78deg', scale: '1 0.92' },
        index: { rotate: '-4deg', scale: '1 0.66' },
        middle: { rotate: '-1deg', scale: '1 0.68' },
        ring: { rotate: '2deg', scale: '1 0.64' },
        pinky: { rotate: '6deg', scale: '1 0.58' },
        pad: { opacity: 0 },
      },
    },
    side: {
      L: {},
      R: { art: { scale: '-1 1' }, prop: { scale: '-1 1' } },
    },
  },
  compoundVariants: [{ pose: 'palmUp', side: 'R', css: { art: { scale: '1 1' } } }],
})

const wood = {
  position: 'absolute',
  bg: 'wood.mid',
  border: '0.24em solid token(colors.outline)',
} as const

const palm = css({
  ...wood,
  left: '-1.45em',
  top: '0',
  width: '2.9em',
  height: '3em',
  borderRadius: '42% 42% 48% 48%',
  backgroundImage: 'linear-gradient(90deg, rgba(255,236,200,0.3) 0 25%, transparent 25% 70%, rgba(46,22,6,0.25) 70%)',
  zIndex: 1,
})
const pad = css({
  position: 'absolute',
  left: '-0.8em',
  top: '0.9em',
  width: '1.6em',
  height: '1.25em',
  borderRadius: '50%',
  bg: 'wood.light',
  opacity: 0.8,
  zIndex: 2,
})
const knuckle = css({ position: 'absolute', width: '0', height: '0', transformOrigin: '0 0' })
const fingerShape = css({
  ...wood,
  left: '-0.48em',
  top: '-0.45em',
  width: '0.96em',
  height: '2.25em',
  borderRadius: '0.48em',
  backgroundImage: 'linear-gradient(90deg, rgba(255,236,200,0.3) 0 30%, transparent 30%)',
})
const indexPos = css({ left: '0.95em', top: '2.3em', zIndex: 7 })
const middlePos = css({ left: '0.32em', top: '2.55em', zIndex: 6 })
const ringPos = css({ left: '-0.32em', top: '2.5em', zIndex: 5 })
const pinkyPos = css({ left: '-0.95em', top: '2.2em', zIndex: 4 })
const thumbPos = css({ left: '1.15em', top: '1em', zIndex: 8 })
const thumbShape = css({ ...wood, left: '-0.5em', top: '-0.45em', width: '1em', height: '2.05em', borderRadius: '0.5em' })
const okRing = css({
  position: 'absolute',
  left: '0.1em',
  top: '2.2em',
  width: '1.9em',
  height: '1.9em',
  borderRadius: 'full',
  border: '0.6em solid token(colors.wood.mid)',
  boxShadow: '0 0 0 0.24em token(colors.outline), inset 0 0 0 0.24em token(colors.outline)',
  zIndex: 9,
})

export function Hand({ pose, side, prop }: { pose: HandPose; side: 'L' | 'R'; prop?: ReactNode }) {
  const h = hand({ pose, side })
  return (
    <div data-art data-hand-pose={pose} className={h.art}>
      <div className={palm} />
      <div className={cx(pad, h.pad)} />
      {prop && <div className={h.prop}>{prop}</div>}
      <div className={cx(knuckle, pinkyPos, h.pinky)}>
        <div className={fingerShape} />
      </div>
      <div className={cx(knuckle, ringPos, h.ring)}>
        <div className={fingerShape} />
      </div>
      <div className={cx(knuckle, middlePos, h.middle)}>
        <div className={fingerShape} />
      </div>
      <div className={cx(knuckle, indexPos, h.index)}>
        <div className={fingerShape} />
      </div>
      <div className={cx(knuckle, thumbPos, h.thumb)}>
        <div className={thumbShape} />
      </div>
      <div className={cx(okRing, h.okRing)} />
    </div>
  )
}
