import { css, cx } from '../../../styled-system/css'
import { Bone } from '../../character/components/Bone'

/**
 * The JNR — a chunky disposable puff, rebuilt from the reference photo in
 * pure CSS: black mouthpiece cap, red tank with the hawk artwork and the
 * "JNR / JUST NO REASON" logo, flavour label, black chassis with the little
 * red LED screen. Text is real HTML text; the hawk is a clip-path shape.
 *
 * Drawn upright in its own coordinates (mouthpiece on top), ~2.6 × 5.4 rig em.
 */
const device = css({
  position: 'absolute',
  left: '-1.45em',
  top: '-2.6em',
  width: '2.9em',
  height: '5.2em',
})
const cap = css({
  position: 'absolute',
  left: '0.45em',
  top: '-1.05em',
  width: '1.7em',
  height: '1.3em',
  bg: 'jnr.chassis',
  border: '0.2em solid token(colors.outline)',
  borderRadius: '0.75em 0.75em 0.2em 0.2em / 0.9em 0.9em 0.2em 0.2em',
  backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.28) 0 22%, transparent 22%)',
})
const shell = css({
  position: 'absolute',
  inset: '0',
  border: '0.22em solid token(colors.outline)',
  borderRadius: '0.7em',
  overflow: 'hidden',
  bg: 'jnr.chassis',
})
const tank = css({
  position: 'absolute',
  left: '0',
  right: '0',
  top: '0',
  height: '64%',
  backgroundImage:
    'radial-gradient(ellipse 70% 55% at 55% 40%, token(colors.jnr.amber), transparent 70%), linear-gradient(160deg, token(colors.jnr.red) 0 55%, token(colors.jnr.redDeep))',
})
/** Stylised hawk head facing left, with its golden eye. */
const hawk = css({
  position: 'absolute',
  left: '0.35em',
  top: '1.15em',
  width: '1.9em',
  height: '1.7em',
  bg: '#22324D',
  clipPath:
    'polygon(0% 38%, 22% 28%, 38% 8%, 64% 0%, 88% 10%, 100% 34%, 96% 62%, 80% 82%, 60% 100%, 46% 74%, 30% 60%, 14% 56%, 22% 48%)',
  _after: {
    content: '""',
    position: 'absolute',
    left: '0.62em',
    top: '0.42em',
    width: '0.3em',
    height: '0.3em',
    borderRadius: 'full',
    bg: 'yellow.400',
  },
})
const logo = css({
  position: 'absolute',
  left: '0',
  right: '0',
  top: '0.28em',
  textAlign: 'center',
  fontFamily: 'display',
  fontSize: '0.78em',
  lineHeight: '1',
  color: 'cream.50',
  WebkitTextStroke: '0.06em token(colors.jnr.redDeep)',
  paintOrder: 'stroke fill',
  letterSpacing: '0.04em',
})
const tagline = css({
  position: 'absolute',
  left: '0',
  right: '0',
  top: '5.6em',
  textAlign: 'center',
  fontFamily: 'body',
  fontWeight: '700',
  fontSize: '0.2em',
  letterSpacing: '0.08em',
  color: 'cream.100',
  whiteSpace: 'nowrap',
})
const flavour = css({
  position: 'absolute',
  left: '0',
  right: '0',
  top: '11.6em',
  textAlign: 'center',
  fontFamily: 'body',
  fontWeight: '700',
  fontSize: '0.24em',
  lineHeight: '1.05',
  color: 'cream.50',
})
const screen = css({
  position: 'absolute',
  left: '0.62em',
  bottom: '0.42em',
  width: '1.36em',
  height: '0.72em',
  bg: '#0B0B0E',
  border: '0.1em solid token(colors.jnr.steel)',
  borderRadius: '0.18em',
  display: 'grid',
  placeItems: 'center',
})
const digits = css({
  fontFamily: 'mono',
  fontWeight: '700',
  fontSize: '0.42em',
  lineHeight: '1',
  color: 'jnr.led',
  textShadow: '0 0 0.4em token(colors.jnr.led)',
})
const sheen = css({
  position: 'absolute',
  left: '0.3em',
  top: '0.2em',
  width: '0.32em',
  height: '82%',
  borderRadius: 'full',
  bg: 'rgba(255,255,255,0.3)',
})
const glow = css({
  position: 'absolute',
  left: '-0.9em',
  top: '-0.7em',
  width: '1.8em',
  height: '1.4em',
  borderRadius: '50%',
  backgroundImage: 'radial-gradient(ellipse, rgba(255,59,48,0.95), rgba(255,59,48,0.35) 45%, transparent 70%)',
  mixBlendMode: 'screen',
})

/** The JNR on its own (playground, documentation). */
export function Jnr({ className }: { className?: string }) {
  return (
    <div className={cx(device, className)} data-prop="jnr">
      <div className={cap} />
      <div className={shell}>
        <div className={tank}>
          <div className={hawk} />
        </div>
        <div className={logo}>JNR</div>
        <div className={tagline}>JUST NO REASON</div>
        <div className={flavour}>
          WATERMELON
          <br />
          MANGO PEACH
        </div>
        <div className={screen}>
          <span className={digits}>100</span>
        </div>
        <div className={sheen} />
      </div>
      <Bone joint="propGlow" className={css({ left: '1.45em', top: '4.7em' })}>
        <div data-art className={glow} />
      </Bone>
    </div>
  )
}

/**
 * The JNR held in a hand. Hand space points along the fingers (+y), so the
 * device is turned 180° to put the mouthpiece past the curled fingers.
 */
const inHand = css({ top: '2.7em', rotate: '180deg' })

export function JnrInHand() {
  return (
    <Bone joint="propR" className={inHand}>
      <div data-art>
        <Jnr />
      </div>
    </Bone>
  )
}
