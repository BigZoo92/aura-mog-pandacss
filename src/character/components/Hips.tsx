import { css, cx } from '../../../styled-system/css'
import { backSurface, frontSurface, inked, profileSurface } from '../rig/surfaces'
import { Bone } from './Bone'

/**
 * The onesie bottom, on its own joint. This is what makes the 67 Twerky a
 * real twerk: the hips pop, tilt and wobble independently of the torso
 * (which counter-moves) and of the legs (which flex through IK).
 * From behind: two fleece cheeks on their own joints and a pom-pom tail.
 */
const shorts = css({
  left: '-5.5em',
  top: '-1.4em',
  width: '11em',
  height: '3.6em',
  layerStyle: 'fleeceBlack',
  borderWidth: 'outlineThick',
  borderRadius: '0.8em 0.8em 2.4em 2.4em / 0.8em 0.8em 1.8em 1.8em',
  _after: {
    content: '""',
    position: 'absolute',
    left: 'calc(50% - 0.14em)',
    top: '1.2em',
    width: '0.28em',
    height: '1.6em',
    borderRadius: 'full',
    bg: 'ink.600',
  },
})
const cheekArt = css({
  left: '-3.4em',
  top: '-2.8em',
  width: '6.8em',
  height: '5.5em',
  layerStyle: 'fleeceBlack',
  borderWidth: 'outlineThick',
  borderRadius: '48% 52% 50% 50% / 45% 45% 55% 55%',
  boxShadow: 'inset 0.6em 0.5em 0 -0.2em rgba(255,255,255,0.12)',
})
const cheekLPos = css({ left: '-3em', top: '0.5em' })
const cheekRPos = css({ left: '3em', top: '0.5em' })
const pom = css({
  left: '-1.5em',
  top: '-1.5em',
  width: '3em',
  height: '3em',
  bg: 'onesie.white',
  borderWidth: '0.34em',
  borderRadius: '46% 54% 50% 50% / 52% 48% 52% 48%',
  backgroundImage:
    'radial-gradient(circle at 35% 30%, #fff 0 25%, transparent 40%), radial-gradient(circle at 70% 75%, rgba(16,16,20,0.12) 0 30%, transparent 45%)',
  boxShadow: '0.5em -0.5em 0 -0.6em token(colors.onesie.white), -0.6em 0.3em 0 -0.7em token(colors.onesie.white)',
})
const tailPos = css({ top: '-1.9em' })
const profileShorts = css({
  left: '-5em',
  top: '-1.4em',
  width: '9.8em',
  height: '3.8em',
  layerStyle: 'fleeceBlack',
  borderWidth: 'outlineThick',
  borderRadius: '2.8em 0.8em 1.6em 3em / 1.8em 0.8em 1.8em 2.2em',
})
const profilePom = css({ left: '-6.8em', top: '-1.8em', width: '2.6em', height: '2.6em' })

export function Hips() {
  return (
    <Bone joint="hips" className={css({ top: '0.4em' })}>
      <div className={frontSurface}>
        <div data-art className={cx(inked, shorts)} />
      </div>
      <div className={profileSurface}>
        <div data-art className={cx(inked, profileShorts)} />
        <div data-art className={cx(inked, pom, profilePom)} />
      </div>
      <div className={backSurface}>
        <Bone joint="cheekL" className={cheekLPos}>
          <div data-art className={cx(inked, cheekArt)} />
        </Bone>
        <Bone joint="cheekR" className={cheekRPos}>
          <div data-art className={cx(inked, cheekArt)} />
        </Bone>
        <Bone joint="tail" className={tailPos}>
          <div data-art className={cx(inked, pom)} />
        </Bone>
      </div>
    </Bone>
  )
}
