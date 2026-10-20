import type { ReactNode } from 'react'
import { css, cx } from '../../../styled-system/css'
import { backSurface, frontSurface, inked, profileSurface } from '../rig/surfaces'
import { Bone } from './Bone'

/**
 * The body: Tung Tung's log, zipped into a panda onesie. White fleece body,
 * black panda shoulder band, a front zipper, a kangaroo pocket (where the JNR
 * lives) — and his trademark baseball bat strapped across his back.
 */

const ONESIE_RADIUS = '3.4em 3.4em 2.2em 2.2em / 2.4em 2.4em 1.8em 1.8em'

const onesie = css({
  left: '-5.6em',
  top: '-11.4em',
  width: '11.2em',
  height: '12.8em',
  layerStyle: 'fleeceWhite',
  borderWidth: 'outlineThick',
  borderRadius: ONESIE_RADIUS,
})
const yoke = css({
  left: '-6em',
  top: '-11.8em',
  width: '12em',
  height: '3.8em',
  layerStyle: 'fleeceBlack',
  borderWidth: 'outlineThick',
  borderRadius: '3em 3em 1.6em 1.6em / 2.6em 2.6em 2em 2em',
})
const collar = css({
  left: '-3.6em',
  top: '-12em',
  width: '7.2em',
  height: '1.6em',
  layerStyle: 'fleeceWhite',
  borderWidth: '0.32em',
  borderRadius: 'full',
})
const zipper = css({
  position: 'absolute',
  left: '-0.24em',
  top: '-10.2em',
  width: '0.48em',
  height: '6.2em',
  borderRadius: 'full',
  bg: 'ink.600',
  backgroundImage: 'repeating-linear-gradient(to bottom, token(colors.cream.300) 0 0.18em, transparent 0.18em 0.42em)',
  _before: {
    content: '""',
    position: 'absolute',
    left: '-0.4em',
    top: '-0.2em',
    width: '1.28em',
    height: '1.5em',
    borderRadius: '0.35em 0.35em 0.6em 0.6em',
    bg: 'aura.lime',
    border: '0.2em solid token(colors.outline)',
  },
})
const pocket = css({
  left: '-3.7em',
  top: '-4.5em',
  width: '7.4em',
  height: '3.5em',
  layerStyle: 'fleeceWhite',
  borderWidth: '0.3em',
  borderRadius: '0.7em 0.7em 1.8em 1.8em',
  boxShadow: 'inset 0 0 0 0.35em token(colors.onesie.white), inset 0 0 0 0.5em token(colors.onesie.whiteShade)',
})
const pocketTag = css({
  position: 'absolute',
  // In this element's own em (font-size 0.52em): ≈ (1.4, -4.6) rig units.
  left: '2.7em',
  top: '-8.9em',
  padding: '0.12em 0.3em',
  bg: 'aura.lime',
  border: '0.14em solid token(colors.outline)',
  borderRadius: '0.2em',
  fontFamily: 'display',
  fontSize: '0.52em',
  lineHeight: '1',
  whiteSpace: 'nowrap',
  color: 'ink.900',
})
const strain = css({
  position: 'absolute',
  top: '-9.2em',
  width: '4em',
  height: '2.4em',
  borderBottom: '0.3em solid token(colors.onesie.whiteShade)',
  borderRadius: '0 0 50% 50%',
  opacity: 0,
  _gigaForm: { opacity: 1 },
})

// Back print — lengths in this element's own em (font-size 1.9em of the rig unit).
const backPrint = css({
  position: 'absolute',
  left: '-2.2em',
  top: '-3.4em',
  width: '4.4em',
  textAlign: 'center',
  fontFamily: 'display',
  fontSize: '1.9em',
  lineHeight: '0.95',
  color: 'ink.900',
  '& small': { display: 'block', fontSize: '0.62em', color: 'violet.600' },
})
const backSeam = css({
  position: 'absolute',
  left: '-0.15em',
  top: '-11em',
  width: '0.3em',
  height: '11em',
  borderRadius: 'full',
  bg: 'onesie.whiteShade',
})

/** Tung Tung's bat: barrel + handle + knob, as a rotatable group. */
const bat = css({ position: 'absolute', width: '0', height: '0', transformOrigin: '0 0' })
const batBarrel = css({
  left: '-1.2em',
  top: '-8.2em',
  width: '2.4em',
  height: '8.6em',
  layerStyle: 'woodLimb',
  borderWidth: '0.34em',
  borderRadius: '1.2em 1.2em 0.7em 0.7em',
})
const batHandle = css({
  left: '-0.6em',
  top: '0',
  width: '1.2em',
  height: '5.4em',
  layerStyle: 'woodLimb',
  borderWidth: '0.3em',
  borderRadius: '0.6em',
})
const batKnob = css({
  left: '-1em',
  top: '5em',
  width: '2em',
  height: '1em',
  layerStyle: 'woodLimb',
  borderWidth: '0.3em',
  borderRadius: 'full',
})
const batPeek = css({ left: '-4.2em', top: '-7em', rotate: '-32deg' })
const batStrapped = css({ left: '-4.6em', top: '-9.6em', rotate: '-50deg' })
const strap = css({
  position: 'absolute',
  left: '-6em',
  top: '-9.4em',
  width: '12em',
  height: '0.9em',
  layerStyle: 'fleeceBlack',
  border: '0.24em solid token(colors.outline)',
  rotate: '40deg',
})

const profileBody = css({
  left: '-4.6em',
  top: '-11.4em',
  width: '9.6em',
  height: '12.8em',
  layerStyle: 'fleeceWhite',
  borderWidth: 'outlineThick',
  borderRadius: '3em 4em 3em 2em / 2.4em 3em 2.6em 1.8em',
  _before: {
    content: '""',
    position: 'absolute',
    left: '-0.3em',
    top: '-0.3em',
    width: '7em',
    height: '3.4em',
    layerStyle: 'fleeceBlack',
    borderRadius: '2.6em 2.6em 1.4em 0.4em',
  },
})

const bulkShape = css({
  left: '-8.6em',
  top: '-13.4em',
  width: '17.2em',
  height: '8.2em',
  layerStyle: 'fleeceBlack',
  borderWidth: 'outlineThick',
  borderRadius: '40% 40% 30% 30% / 70% 70% 30% 30%',
})
const bulkJoint = css({
  top: '0',
  _gigaForm: { opacity: 1, scale: '1' },
  _gigaReveal: { animation: 'chadBulkReveal 460ms token(easings.overshoot) both' },
})

interface TorsoProps {
  /** Rendered behind the torso (ghost arms). */
  behind?: ReactNode
  /** Neck + head. */
  head: ReactNode
  /** Real arms, in front of the torso unless a track sends them behind. */
  arms: ReactNode
}

export function Torso({ behind, head, arms }: TorsoProps) {
  return (
    <Bone joint="torso">
      {behind}
      <div className={frontSurface}>
        <div className={cx(bat, batPeek)}>
          <div data-art className={cx(inked, batHandle)} />
          <div data-art className={cx(inked, batBarrel)} />
        </div>
      </div>
      <Bone joint="bulk" className={bulkJoint}>
        <div data-art className={cx(inked, bulkShape)} />
      </Bone>
      <div data-art className={cx(inked, onesie)} />
      <div data-art className={cx(inked, yoke)} />
      <div className={frontSurface}>
        <div data-art className={cx(inked, pocket)} />
        <div data-art className={pocketTag}>PANDA CSS</div>
        <div data-art className={zipper} />
        <div className={cx(strain, css({ left: '-4.2em' }))} />
        <div className={cx(strain, css({ left: '0.2em' }))} />
      </div>
      <div className={backSurface}>
        <div className={backSeam} />
        <div className={backPrint}>
          PANDA<small>CSS</small>
        </div>
        <div className={strap} />
        <div className={cx(bat, batStrapped)}>
          <div data-art className={cx(inked, batHandle)} />
          <div data-art className={cx(inked, batKnob)} />
          <div data-art className={cx(inked, batBarrel)} />
        </div>
      </div>
      <div className={profileSurface}>
        <div data-art className={cx(inked, profileBody)} />
      </div>
      <div data-art className={cx(inked, collar)} />
      <Bone joint="neck" className={css({ top: 'rig.neckY' })}>
        {head}
      </Bone>
      {arms}
    </Bone>
  )
}
