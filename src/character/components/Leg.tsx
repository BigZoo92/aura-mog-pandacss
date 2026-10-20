import { css, cx } from '../../../styled-system/css'
import { inked } from '../rig/surfaces'
import { Bone } from './Bone'

const hipL = css({ left: 'rig.hipXNeg', top: 'rig.hipY' })
const hipR = css({ left: 'rig.hipX', top: 'rig.hipY' })
const knee = css({ top: 'rig.thigh' })
const ankle = css({ top: 'rig.shin' })

/** Black onesie pant leg, cuffed white at the knee. */
const pantLeg = css({
  left: '-1.6em',
  top: '-1.2em',
  width: '3.2em',
  height: 'calc(token(sizes.rig.thigh) + 1.9em)',
  borderRadius: '1.4em 1.4em 1.2em 1.2em',
  layerStyle: 'fleeceBlack',
})
const kneeCuff = css({
  left: '-1.45em',
  top: 'calc(token(sizes.rig.thigh) - 0.2em)',
  width: '2.9em',
  height: '1.3em',
  layerStyle: 'fleeceWhite',
  borderWidth: '0.3em',
  borderRadius: '0.7em',
})
/** Tung Tung's real leg: a long, thin wooden stick. */
const shinShape = css({
  left: '-0.78em',
  top: '-0.5em',
  width: '1.56em',
  height: 'calc(token(sizes.rig.shin) + 1em)',
  borderRadius: '0.78em',
  layerStyle: 'woodLimb',
  borderWidth: '0.28em',
})

/** Bare wooden foot, toes pointing outward (L → screen-left), cartoon style. */
const footArt = css({ position: 'absolute', left: '0', top: '0' })
const footMirror = css({ scale: '-1 1' })
const sole = css({
  left: '-4.6em',
  top: '-1.3em',
  width: '5.9em',
  height: '2em',
  layerStyle: 'woodLimb',
  borderWidth: '0.3em',
  borderRadius: '1.2em 1em 0.6em 0.8em / 1.1em 1em 0.6em 0.8em',
})
const toes = css({
  position: 'absolute',
  left: '-4.9em',
  top: '-1.05em',
  width: '2.2em',
  height: '1.6em',
  backgroundImage:
    'radial-gradient(circle at 30% 30%, token(colors.wood.mid) 0 0.38em, token(colors.outline) 0.39em 0.5em, transparent 0.51em), radial-gradient(circle at 62% 18%, token(colors.wood.mid) 0 0.34em, token(colors.outline) 0.35em 0.46em, transparent 0.47em), radial-gradient(circle at 90% 12%, token(colors.wood.mid) 0 0.3em, token(colors.outline) 0.31em 0.42em, transparent 0.43em)',
})
const ankleKnob = css({
  left: '-0.9em',
  top: '-1.9em',
  width: '1.8em',
  height: '1.8em',
  layerStyle: 'woodLimb',
  borderWidth: '0.28em',
  borderRadius: 'full',
})

interface LegProps {
  side: 'L' | 'R'
}

export function Leg({ side }: LegProps) {
  const left = side === 'L'
  return (
    <Bone joint={left ? 'thighL' : 'thighR'} className={left ? hipL : hipR}>
      <div data-art className={cx(inked, pantLeg)} />
      <Bone joint={left ? 'shinL' : 'shinR'} className={knee}>
        <div data-art className={cx(inked, shinShape)} />
        <Bone joint={left ? 'footL' : 'footR'} className={ankle}>
          <div data-art className={cx(footArt, !left && footMirror)}>
            <div className={cx(inked, ankleKnob)} />
            <div className={cx(inked, sole)} />
            <div className={toes} />
          </div>
        </Bone>
      </Bone>
      <div data-art className={cx(inked, kneeCuff)} />
    </Bone>
  )
}
