import { css, cx } from '../../../styled-system/css'
import type { Expression } from '../rig/rig.types'
import { faceSurface, headBackSurface, inked, profileSurface } from '../rig/surfaces'
import { Bone } from './Bone'
import { FaceFeatures, Nose } from './Face'

/**
 * The head is the top of Tung Tung's log, wearing a panda-onesie hood whose
 * open front frames his carved wooden face. Draw order matters:
 *   ears → log → face → hood ring → Chad jaw → nose & Chad eyes → hood back → profile.
 */

// --- The log -------------------------------------------------------------

const log = css({
  left: '-6.1em',
  top: '-14.4em',
  width: '12.2em',
  height: '15.6em',
  layerStyle: 'wood',
  borderWidth: 'outlineThick',
  borderRadius: '4.4em 4.4em 1.2em 1.2em / 1.8em 1.8em 1.2em 1.2em',
})

// --- The hood --------------------------------------------------------------

const HOOD_RADIUS = '6.2em 6.2em 3.4em 3.4em / 6.6em 6.6em 3em 3em'

const ear = css({
  position: 'absolute',
  left: '-2.2em',
  top: '-3.6em',
  width: '4.4em',
  height: '4.2em',
  borderRadius: '50%',
  layerStyle: 'fleeceBlack',
  border: '0.4em solid token(colors.outline)',
  _after: {
    content: '""',
    position: 'absolute',
    inset: '0.75em',
    borderRadius: '50%',
    bg: 'ink.600',
  },
  transformOrigin: '50% 100%',
  transition: 'translate 200ms, scale 200ms',
  _gigaForm: { translate: '0 -0.9em', scale: '1.15 1.4' },
})
const earLPos = css({ left: '-5em', top: '-14.4em', rotate: '-12deg' })
const earRPos = css({ left: '5em', top: '-14.4em', rotate: '12deg' })

/** A thick white border with a hole: the open face of the costume. */
const hoodRing = css({
  position: 'absolute',
  left: '-6.9em',
  top: '-15.2em',
  width: '13.8em',
  height: '15.8em',
  borderStyle: 'solid',
  borderColor: 'onesie.white',
  borderWidth: '3.3em 1.15em 0.75em 1.15em',
  borderRadius: HOOD_RADIUS,
  boxShadow: '0 0 0 0.44em token(colors.outline), inset 0 0 0 0.34em token(colors.outline), inset 0 0.5em 0 0.34em rgba(16,16,20,0.18)',
})
const hoodSheen = css({
  position: 'absolute',
  left: '-4.8em',
  top: '-14.9em',
  width: '6.4em',
  height: '1.9em',
  borderRadius: '50%',
  backgroundImage: 'radial-gradient(ellipse, rgba(255,255,255,0.95), transparent 70%)',
})
/** The costume's own little panda face, embroidered on the hood brim. */
const brimPatch = css({
  position: 'absolute',
  top: '-14.75em',
  width: '1.7em',
  height: '2.05em',
  bg: 'onesie.black',
  borderRadius: '50% 50% 46% 54% / 62% 62% 38% 38%',
  _after: {
    content: '""',
    position: 'absolute',
    left: '0.5em',
    top: '0.6em',
    width: '0.68em',
    height: '0.68em',
    borderRadius: 'full',
    bg: 'cream.50',
    backgroundImage: 'radial-gradient(circle at 55% 55%, token(colors.outline) 0 0.18em, transparent 0.2em)',
  },
})
const brimPatchL = css({ left: '-3em', rotate: '24deg' })
const brimPatchR = css({ left: '1.3em', rotate: '-24deg' })
const brimNose = css({
  position: 'absolute',
  left: '-0.45em',
  top: '-12.75em',
  width: '0.9em',
  height: '0.6em',
  bg: 'outline',
  borderRadius: '45% 45% 60% 60% / 40% 40% 80% 80%',
})
const cord = css({
  position: 'absolute',
  top: '0.5em',
  width: '0.34em',
  height: '2.6em',
  bg: 'cream.100',
  borderRadius: 'full',
  boxShadow: '0 0 0 0.12em token(colors.outline)',
  _after: {
    content: '""',
    position: 'absolute',
    left: '-0.12em',
    bottom: '-0.3em',
    width: '0.58em',
    height: '0.75em',
    borderRadius: '0.2em',
    bg: 'aura.lime',
    boxShadow: '0 0 0 0.12em token(colors.outline)',
  },
})
const cordL = css({ left: '-4.1em', rotate: '6deg' })
const cordR = css({ left: '3.8em', rotate: '-6deg' })

/** Seen from behind: the full back of the hood. */
const hoodBack = css({
  left: '-6.9em',
  top: '-15.2em',
  width: '13.8em',
  height: '15.8em',
  layerStyle: 'fleeceWhite',
  borderWidth: 'outlineThick',
  borderRadius: HOOD_RADIUS,
  _before: {
    content: '""',
    position: 'absolute',
    left: 'calc(50% - 0.15em)',
    top: '0.4em',
    width: '0.3em',
    height: '78%',
    bg: 'onesie.whiteShade',
    borderRadius: 'full',
  },
})
const hoodLabel = css({
  position: 'absolute',
  left: '-1.6em',
  top: '-3.2em',
  width: '3.2em',
  height: '1.3em',
  bg: 'aura.lime',
  border: '0.18em solid token(colors.outline)',
  borderRadius: '0.25em',
  _after: {
    content: '"CSS"',
    position: 'absolute',
    inset: '0',
    display: 'grid',
    placeItems: 'center',
    fontFamily: 'display',
    fontSize: '0.7em',
    color: 'ink.900',
  },
})

/** Side view of the hood with his carved profile peeking out. */
const hoodSide = css({
  left: '-6.4em',
  top: '-15.2em',
  width: '12.8em',
  height: '15.8em',
  layerStyle: 'fleeceWhite',
  borderWidth: 'outlineThick',
  borderRadius: HOOD_RADIUS,
})
const profileFace = css({
  left: '1.6em',
  top: '-11.8em',
  width: '5em',
  height: '11.4em',
  layerStyle: 'wood',
  borderWidth: '0.34em',
  borderRadius: '1.6em 2.6em 2.6em 1.6em / 2em 3em 3em 2em',
})
const profileEye = css({
  position: 'absolute',
  left: '2.4em',
  top: '-9em',
  width: '2.9em',
  height: '3.2em',
  borderRadius: '50%',
  bg: 'cream.50',
  border: '0.24em solid token(colors.outline)',
  backgroundImage: 'radial-gradient(circle at 70% 55%, token(colors.outline) 0 0.4em, #6B3A16 0.42em 0.8em, transparent 0.82em)',
})
const profileNose = css({
  left: '5em',
  top: '-6.6em',
  width: '3.3em',
  height: '1.9em',
  layerStyle: 'wood',
  borderWidth: '0.3em',
  borderRadius: '0.6em 1.2em 1.2em 0.4em / 0.6em 0.9em 0.9em 0.6em',
})
const profileGrin = css({
  position: 'absolute',
  left: '2.5em',
  top: '-3.4em',
  width: '4em',
  height: '1.9em',
  bg: 'wood.void',
  borderRadius: '0.3em 0.3em 1.6em 0.3em',
  backgroundImage: 'linear-gradient(to bottom, token(colors.cream.50) 0 0.6em, transparent 0.6em)',
})

// --- Form layers -----------------------------------------------------------

/** GIGA TUNG CHAD: a wooden jaw far wider than the hood itself. */
const jawShape = css({
  left: '-8.4em',
  top: '-0.2em',
  width: '16.8em',
  height: '8.6em',
  layerStyle: 'wood',
  borderWidth: 'outlineThick',
  borderTopWidth: '0',
  borderRadius: '0.6em 0.6em 1.4em 1.4em / 0.6em 0.6em 1.2em 1.2em',
  boxShadow: 'inset 0 -1.4em 0 -0.4em rgba(46,22,6,0.35), inset 1.2em 0 0 -0.6em rgba(255,236,200,0.35)',
  _before: {
    // the absurdly confident smirk
    content: '""',
    position: 'absolute',
    left: '4.6em',
    top: '1.3em',
    width: '7em',
    height: '1.3em',
    borderBottom: '0.46em solid token(colors.wood.void)',
    borderRadius: '0 0 30% 75%',
    rotate: '-4deg',
  },
  _after: {
    // chin cleft
    content: '""',
    position: 'absolute',
    left: '7.75em',
    bottom: '0.35em',
    width: '0.5em',
    height: '2em',
    borderRadius: 'full',
    bg: 'wood.void',
  },
})
const jawJoint = css({
  top: '-3em',
  _gigaForm: { opacity: 1, scale: '1' },
  _gigaReveal: { animation: 'chadJawReveal 420ms token(easings.out) both' },
})

const chadSocket = css({
  position: 'absolute',
  top: '-1.9em',
  width: '5em',
  height: '3.9em',
  bg: 'wood.void',
  borderRadius: '35% 35% 50% 50%',
  _after: {
    content: '""',
    position: 'absolute',
    left: '1.3em',
    top: '1.75em',
    width: '2.4em',
    height: '0.55em',
    borderRadius: '50%',
    bg: 'cream.50',
    backgroundImage: 'radial-gradient(circle at 55% 50%, token(colors.outline) 0 0.2em, transparent 0.22em)',
  },
})
const chadSocketL = css({ left: '-5.3em', rotate: '-6deg' })
const chadSocketR = css({ left: '0.3em', rotate: '6deg' })
const chadBrow = css({
  position: 'absolute',
  left: '-6em',
  top: '-3.6em',
  width: '12em',
  height: '2.3em',
  bg: 'wood.deep',
  clipPath: 'polygon(0 10%, 46% 70%, 50% 100%, 54% 70%, 100% 10%, 100% 45%, 54% 100%, 46% 100%, 0 45%)',
  filter: 'drop-shadow(0 0.25em 0 token(colors.wood.void))',
})
const chadShade = css({
  position: 'absolute',
  left: '-5em',
  top: '-3.4em',
  width: '10em',
  height: '6em',
  borderRadius: '50%',
  backgroundImage: 'radial-gradient(ellipse at 50% 35%, rgba(46,22,6,0.45), transparent 65%)',
})
const chadEyesJoint = css({
  top: '-7.6em',
  _gigaForm: { opacity: 1 },
  _gigaReveal: { animation: 'chadEyesReveal 360ms token(easings.out) both' },
})

const shadesArt = css({
  left: '-6.3em',
  top: '-2.1em',
  width: '12.6em',
  height: '4em',
  borderWidth: '0.3em',
  borderRadius: '0.5em 0.5em 2.2em 2.2em / 0.5em 0.5em 1.8em 1.8em',
  backgroundImage:
    'linear-gradient(115deg, transparent 18%, rgba(255,255,255,0.55) 19% 24%, transparent 25% 31%, rgba(255,255,255,0.35) 32% 34%, transparent 35%), linear-gradient(to bottom, token(colors.violet.600), token(colors.ink.900) 70%)',
  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 54% 100%, 50% 62%, 46% 100%, 0 100%)',
})
const shadesJoint = css({
  top: '-7.6em',
  _beastForm: { opacity: 1 },
  _beastReveal: { animation: 'beastShadesDrop 520ms token(easings.out) both' },
})

const sparkleArt = css({
  position: 'absolute',
  left: '-1.3em',
  top: '-1.3em',
  width: '2.6em',
  height: '2.6em',
  bg: 'cream.50',
  clipPath: 'polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%)',
  filter: 'drop-shadow(0 0 0.35em token(colors.yellow.400))',
})
const sparkleJoint = css({
  left: '-8em',
  top: '1.2em',
  _gigaReveal: { animation: 'chadSparkleSweep 900ms token(easings.inOut) 260ms both' },
})

export function Head({ face }: { face: Expression }) {
  return (
    <Bone joint="head">
      <Bone joint="hoodEarL" className={earLPos}>
        <div data-art className={ear} />
      </Bone>
      <Bone joint="hoodEarR" className={earRPos}>
        <div data-art className={ear} />
      </Bone>

      <div data-art className={cx(inked, log)} />

      <div className={faceSurface}>
        <FaceFeatures face={face} />
        <div data-art className={hoodRing} />
        <div data-art className={hoodSheen} />
        <div data-art className={cx(brimPatch, brimPatchL)} />
        <div data-art className={cx(brimPatch, brimPatchR)} />
        <div data-art className={brimNose} />
        <div data-art className={cx(cord, cordL)} />
        <div data-art className={cx(cord, cordR)} />
      </div>

      <Bone joint="jaw" className={jawJoint}>
        <div data-art className={cx(inked, jawShape)} />
      </Bone>

      <div className={faceSurface}>
        <Nose />
        <Bone joint="chadEyes" className={chadEyesJoint}>
          <div data-art className={chadShade} />
          <div data-art className={cx(chadSocket, chadSocketL)} />
          <div data-art className={cx(chadSocket, chadSocketR)} />
          <div data-art className={chadBrow} />
        </Bone>
        <Bone joint="shades" className={shadesJoint}>
          <div data-art className={cx(inked, shadesArt)} />
        </Bone>
      </div>

      <div className={headBackSurface}>
        <div data-art className={cx(inked, hoodBack)} />
        <div data-art className={hoodLabel} />
      </div>

      <div className={profileSurface}>
        <div data-art className={cx(inked, hoodSide)} />
        <div data-art className={cx(inked, profileFace)} />
        <div data-art className={profileGrin} />
        <div data-art className={profileEye} />
        <div data-art className={cx(inked, profileNose)} />
      </div>

      <Bone joint="sparkle" className={sparkleJoint}>
        <div data-art className={sparkleArt} />
      </Bone>
    </Bone>
  )
}
