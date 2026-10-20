import type { ReactNode } from 'react'
import { css, cx } from '../../../styled-system/css'
import type { HandPose } from '../rig/rig.types'
import { inked } from '../rig/surfaces'
import { Bone } from './Bone'
import { Hand } from './Hand'

const shoulderL = css({ left: 'rig.shoulderXNeg', top: 'rig.shoulderY' })
const shoulderR = css({ left: 'rig.shoulderX', top: 'rig.shoulderY' })
const elbow = css({ top: 'rig.upperArm' })
const wrist = css({ top: 'rig.forearm' })

/** Baggy black onesie sleeve, ending in a white cuff just past the elbow. */
const sleeve = css({
  left: '-1.45em',
  top: '-1.4em',
  width: '2.9em',
  height: 'calc(token(sizes.rig.upperArm) + 2.6em)',
  borderRadius: '1.45em 1.45em 1.1em 1.1em',
  layerStyle: 'fleeceBlack',
})
const cuff = css({
  left: '-1.3em',
  top: 'calc(token(sizes.rig.upperArm) - 0.1em)',
  width: '2.6em',
  height: '1.3em',
  layerStyle: 'fleeceWhite',
  borderWidth: '0.3em',
  borderRadius: '0.7em',
})
/** Tung Tung's real arm: a thin wooden stick. */
const forearmShape = css({
  left: '-0.72em',
  top: '-0.4em',
  width: '1.44em',
  height: 'calc(token(sizes.rig.forearm) + 1.1em)',
  borderRadius: '0.72em',
  layerStyle: 'woodLimb',
  borderWidth: '0.28em',
})
const muscleShape = css({
  left: '-2.3em',
  top: '-1.7em',
  width: '4.6em',
  height: '3.8em',
  borderRadius: '55% 45% 50% 50% / 60% 60% 40% 40%',
  layerStyle: 'fleeceBlack',
})
const muscleJoint = css({
  top: '2.6em',
  _gigaForm: { opacity: 1, scale: '1' },
  _gigaReveal: { animation: 'chadBulkReveal 460ms token(easings.overshoot) 80ms both' },
})

/** Ghost arms are violet, translucent and glowing — clearly "extra". */
const ghostTint = css({
  filter: 'drop-shadow(0 0 0.5em token(colors.violet.400))',
  '& [data-art], & [data-art] > div, & [data-hand-pose] div': {
    backgroundColor: 'violet.300 !important',
    backgroundImage: 'none !important',
  },
})

interface ArmProps {
  side: 'L' | 'R'
  pose: HandPose
  /** Something held in this hand (the JNR). */
  prop?: ReactNode
}

export function Arm({ side, pose, prop }: ArmProps) {
  const left = side === 'L'
  return (
    <Bone joint={left ? 'shoulderL' : 'shoulderR'} className={left ? shoulderL : shoulderR}>
      <Bone joint={left ? 'upperArmL' : 'upperArmR'}>
        <div data-art className={cx(inked, sleeve)} />
        <Bone joint={left ? 'muscleL' : 'muscleR'} className={muscleJoint}>
          <div data-art className={cx(inked, muscleShape)} />
        </Bone>
        {/* Drawn after the sleeve: a folded forearm (Woah, Dab, JNR at the mouth) stays in front. */}
        <Bone joint={left ? 'forearmL' : 'forearmR'} className={elbow}>
          <div data-art className={cx(inked, forearmShape)} />
          <Bone joint={left ? 'handL' : 'handR'} className={wrist}>
            <Hand pose={pose} side={side} prop={prop} />
          </Bone>
        </Bone>
        <div data-art className={cx(inked, cuff)} />
      </Bone>
    </Bone>
  )
}

/** Ghost arms are rubber-hose extras: 35% longer than the real ones, so they reach past the hood. */
const ghostRootL = css({ left: '-3.1em', top: '-7.4em', scale: '1.35' })
const ghostRootR = css({ left: '3.1em', top: '-7.4em', scale: '1.35' })

export function GhostArm({ side, pose }: Omit<ArmProps, 'prop'>) {
  const left = side === 'L'
  return (
    <Bone joint={left ? 'ghostArmL' : 'ghostArmR'} className={cx(left ? ghostRootL : ghostRootR, ghostTint)}>
      <div data-art className={cx(inked, sleeve)} />
      <Bone joint={left ? 'ghostForearmL' : 'ghostForearmR'} className={elbow}>
        <div data-art className={cx(inked, forearmShape)} />
        <Bone joint={left ? 'ghostHandL' : 'ghostHandR'} className={wrist}>
          <Hand pose={pose} side={side} />
        </Bone>
      </Bone>
    </Bone>
  )
}
