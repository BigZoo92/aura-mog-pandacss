import { css, cx, sva } from '../../../styled-system/css'
import type { Expression } from '../rig/rig.types'
import { Bone } from './Bone'

/**
 * Tung Tung Tung Sahur's carved wooden face: huge bulging eyes sunk into dark
 * sockets, heavy brow ridges, a long nose and THE grin — a wide, toothy,
 * slightly unsettling smile.
 *
 * Expressions are one slot recipe: brows, lids, pupils and mouth change
 * together. The brow / eye / mouth JOINTS stay free for animation tracks
 * (blinks, eyebrow raises); the recipe only styles the artwork on them.
 */
const TEETH =
  'repeating-linear-gradient(90deg, transparent 0 0.72em, rgba(78,40,13,0.6) 0.72em 0.82em), linear-gradient(to bottom, token(colors.cream.50) 0 100%)'
const TONGUE = 'radial-gradient(ellipse 1.6em 0.9em at 50% 100%, #C2413B 96%, transparent 100%)'

const expression = sva({
  slots: ['browL', 'browR', 'lidL', 'lidR', 'pupils', 'mouth'],
  base: {
    browL: { rotate: '-10deg', translate: '0 0' },
    browR: { rotate: '10deg', translate: '0 0' },
    lidL: { translate: '0 -100%' },
    lidR: { translate: '0 -100%' },
    pupils: { scale: '1', translate: '0 0' },
    mouth: {
      position: 'absolute',
      left: '-3.2em',
      top: '-0.6em',
      width: '6.4em',
      height: '1.4em',
      borderBottom: '0.42em solid token(colors.wood.void)',
      borderRadius: '0 0 50% 50%',
    },
  },
  variants: {
    expression: {
      neutral: {},
      grin: {
        browL: { rotate: '-14deg', translate: '0 -0.5em' },
        browR: { rotate: '14deg', translate: '0 -0.5em' },
        mouth: {
          left: '-3.8em',
          top: '-1.2em',
          width: '7.6em',
          height: '2.8em',
          bg: 'wood.void',
          border: '0.3em solid token(colors.wood.deep)',
          borderRadius: '0.6em 0.6em 50% 50% / 0.6em 0.6em 100% 100%',
          backgroundImage: `${TEETH}, ${TONGUE}`,
          backgroundSize: '100% 0.85em, 100% 0.85em, 100% 100%',
          backgroundRepeat: 'no-repeat',
        },
      },
      smug: {
        browL: { rotate: '-20deg', translate: '0 -0.9em' },
        browR: { rotate: '8deg', translate: '0 0.2em' },
        lidL: { translate: '0 -64%' },
        lidR: { translate: '0 -52%' },
        mouth: {
          left: '-3.1em',
          top: '-1em',
          width: '6.8em',
          height: '2.3em',
          bg: 'wood.void',
          border: '0.3em solid token(colors.wood.deep)',
          borderRadius: '0.4em 0.4em 70% 35% / 0.4em 0.4em 100% 80%',
          rotate: '-7deg',
          backgroundImage: TEETH,
          backgroundSize: '100% 0.8em',
          backgroundRepeat: 'no-repeat',
        },
      },
      proud: {
        browL: { rotate: '-16deg', translate: '0 -0.9em' },
        browR: { rotate: '16deg', translate: '0 -0.9em' },
        lidL: { translate: '0 -60%' },
        lidR: { translate: '0 -60%' },
        mouth: {
          left: '-4.2em',
          top: '-1.4em',
          width: '8.4em',
          height: '3.2em',
          bg: 'wood.void',
          border: '0.32em solid token(colors.wood.deep)',
          borderRadius: '0.7em 0.7em 50% 50% / 0.7em 0.7em 100% 100%',
          backgroundImage: `${TEETH}, ${TONGUE}`,
          backgroundSize: '100% 0.95em, 100% 0.95em, 100% 100%',
          backgroundRepeat: 'no-repeat',
        },
      },
      shock: {
        browL: { rotate: '-24deg', translate: '0 -1.3em' },
        browR: { rotate: '24deg', translate: '0 -1.3em' },
        pupils: { scale: '0.6' },
        mouth: {
          left: '-1.5em',
          top: '-1.5em',
          width: '3em',
          height: '3.6em',
          bg: 'wood.void',
          border: '0.3em solid token(colors.wood.deep)',
          borderBottom: '0.3em solid token(colors.wood.deep)',
          borderRadius: '50%',
          backgroundImage: TONGUE,
        },
      },
      focus: {
        browL: { rotate: '16deg', translate: '0 0.45em' },
        browR: { rotate: '-16deg', translate: '0 0.45em' },
        lidL: { translate: '0 -48%' },
        lidR: { translate: '0 -48%' },
        mouth: {
          left: '-3em',
          top: '-0.6em',
          width: '6em',
          height: '1.35em',
          border: '0.28em solid token(colors.wood.deep)',
          borderBottom: '0.28em solid token(colors.wood.deep)',
          borderRadius: '0.4em',
          backgroundImage: TEETH,
        },
      },
      cool: {
        browL: { rotate: '4deg', translate: '0 0.3em' },
        browR: { rotate: '-4deg', translate: '0 0' },
        lidL: { translate: '0 -56%' },
        lidR: { translate: '0 -56%' },
        mouth: { left: '-2.2em', width: '4.6em', borderRadius: '0 0 25% 65%', rotate: '6deg' },
      },
      shush: {
        browL: { rotate: '-6deg', translate: '0 -0.4em' },
        browR: { rotate: '16deg', translate: '0 0.25em' },
        lidL: { translate: '0 -42%' },
        lidR: { translate: '0 -42%' },
        mouth: {
          left: '-0.75em',
          top: '-0.6em',
          width: '1.5em',
          height: '1.5em',
          border: '0.4em solid token(colors.wood.void)',
          borderRadius: '50%',
        },
      },
      wobbly: {
        browL: { rotate: '-26deg', translate: '0 -1em' },
        browR: { rotate: '4deg', translate: '0 0.1em' },
        pupils: { scale: '0.7', translate: '0.2em 0' },
        mouth: {
          left: '-2em',
          top: '-0.7em',
          width: '4em',
          height: '1.8em',
          bg: 'wood.void',
          border: '0.3em solid token(colors.wood.deep)',
          borderRadius: '45% 55% 50% 50% / 30% 30% 90% 90%',
          rotate: '-12deg',
          backgroundImage: TEETH,
          backgroundSize: '100% 0.7em',
          backgroundRepeat: 'no-repeat',
        },
      },
    },
  },
})

const socket = css({
  position: 'absolute',
  top: '-2.3em',
  width: '4.6em',
  height: '4.6em',
  borderRadius: 'full',
  backgroundImage: 'radial-gradient(circle, token(colors.wood.void) 0 52%, token(colors.wood.shade) 68%, transparent 72%)',
})
const socketL = css({ left: '-5em' })
const socketR = css({ left: '0.4em' })

const eyeball = css({
  position: 'absolute',
  top: '-1.85em',
  width: '3.7em',
  height: '3.7em',
  borderRadius: 'full',
  bg: 'cream.50',
  border: '0.24em solid token(colors.outline)',
  boxShadow: 'inset -0.3em -0.4em 0 rgba(110,60,23,0.22)',
  overflow: 'hidden',
})
const eyeballL = css({ left: '-4.55em' })
const eyeballR = css({ left: '0.85em' })
const iris = css({
  position: 'absolute',
  left: '0.7em',
  top: '0.72em',
  width: '2em',
  height: '2em',
  borderRadius: 'full',
  bg: '#6B3A16',
  backgroundImage:
    'radial-gradient(circle, token(colors.outline) 0 0.46em, transparent 0.48em), radial-gradient(circle at 50% 50%, #8E5428, #4A250B)',
  _after: {
    content: '""',
    position: 'absolute',
    left: '0.32em',
    top: '0.26em',
    width: '0.5em',
    height: '0.5em',
    borderRadius: 'full',
    bg: 'cream.50',
  },
})
const irisL = css({ translate: '0.18em 0.05em' })
const irisR = css({ translate: '-0.18em 0.05em' })
const lid = css({
  position: 'absolute',
  inset: '0',
  bg: 'wood.light',
  borderBottom: '0.24em solid token(colors.wood.deep)',
  transition: 'translate 120ms',
})

const brow = css({
  position: 'absolute',
  left: '-2.1em',
  top: '-0.65em',
  width: '4.2em',
  height: '1.3em',
  bg: 'wood.dark',
  borderRadius: '60% 60% 30% 30% / 90% 90% 25% 25%',
  boxShadow: 'inset 0 0.28em 0 token(colors.wood.light), 0 0.18em 0 token(colors.wood.void)',
  _gigaForm: { opacity: 0 },
})

/** Carved cheek bulges and the deep smile folds that frame the grin. */
const cheek = css({
  position: 'absolute',
  top: '-5.3em',
  width: '3em',
  height: '2.4em',
  borderRadius: '50%',
  backgroundImage: 'radial-gradient(ellipse at 45% 40%, rgba(255,236,200,0.55), transparent 70%)',
})
const cheekLArt = css({ left: '-5.6em' })
const cheekRArt = css({ left: '2.6em' })
const fold = css({
  position: 'absolute',
  top: '-4.6em',
  width: '2.2em',
  height: '3.4em',
  border: '0.26em solid transparent',
  borderRadius: '50%',
  _gigaForm: { opacity: 0 },
})
const foldL = css({ left: '-4.9em', borderLeftColor: 'wood.dark', rotate: '18deg' })
const foldR = css({ left: '2.7em', borderRightColor: 'wood.dark', rotate: '-18deg' })

const nose = css({
  position: 'absolute',
  left: '-1em',
  top: '-7.6em',
  width: '2em',
  height: '4.4em',
  layerStyle: 'wood',
  border: '0.24em solid token(colors.wood.deep)',
  borderRadius: '0.9em 0.9em 1.15em 1.15em / 1em 1em 1.7em 1.7em',
  boxShadow: '0.2em 0.25em 0 rgba(46,22,6,0.35)',
  _after: {
    content: '""',
    position: 'absolute',
    left: '0.16em',
    bottom: '0.3em',
    width: '1em',
    height: '0.42em',
    backgroundImage:
      'radial-gradient(circle at 20% 50%, token(colors.wood.void) 0 0.17em, transparent 0.19em), radial-gradient(circle at 80% 50%, token(colors.wood.void) 0 0.17em, transparent 0.19em)',
  },
})

const mouthFormFade = css({ _gigaForm: { opacity: 0 } })

export function FaceFeatures({ face }: { face: Expression }) {
  const x = expression({ expression: face })
  return (
    <>
      <div data-art className={cx(cheek, cheekLArt)} />
      <div data-art className={cx(cheek, cheekRArt)} />
      <div data-art className={cx(fold, foldL)} />
      <div data-art className={cx(fold, foldR)} />
      <Bone joint="eyes" className={css({ top: '-7.6em' })}>
        <div data-art className={cx(socket, socketL)} />
        <div data-art className={cx(socket, socketR)} />
        <div data-art className={cx(eyeball, eyeballL)}>
          <div className={cx(iris, irisL, x.pupils)} />
          <div className={cx(lid, x.lidL)} />
        </div>
        <div data-art className={cx(eyeball, eyeballR)}>
          <div className={cx(iris, irisR, x.pupils)} />
          <div className={cx(lid, x.lidR)} />
        </div>
      </Bone>
      <Bone joint="browL" className={css({ left: '-2.75em', top: '-10.7em' })}>
        <div data-art className={cx(brow, x.browL)} />
      </Bone>
      <Bone joint="browR" className={css({ left: '2.75em', top: '-10.7em' })}>
        <div data-art className={cx(brow, x.browR)} />
      </Bone>
      <Bone joint="mouth" className={cx(css({ top: '-1.75em' }), mouthFormFade)}>
        <div data-art className={x.mouth} />
      </Bone>
    </>
  )
}

/** Drawn above the Chad jaw, so the famous nose survives the transformation. */
export function Nose() {
  return <div data-art className={nose} />
}
