import { css, cva } from '../../../styled-system/css'

/**
 * Shared smoke materials. A smoke "lump" is a radial gradient with a crisp,
 * cartoon edge (70% → 73%) and an off-centre highlight for volume — no blur
 * filters on large surfaces, so dozens of lumps stay cheap to composite.
 */
const SMOKE_GRADIENT =
  'radial-gradient(circle at 38% 34%, token(colors.smoke.core) 0 26%, token(colors.smoke.light) 42%, token(colors.smoke.mid) 58%, token(colors.smoke.shade) 69%, rgba(214,190,219,0) 72.5%)'

/** Anchored on the rig anchor; horizontal offsets scale with --spread. */
export const smokeAnchor = css({
  position: 'absolute',
  left: '50%',
  bottom: '7%',
  width: '0',
  height: '0',
  pointerEvents: 'none',
  '--spread': '1',
  '--text-scale': '1',
  '@container (max-aspect-ratio: 1/1)': { '--spread': '0.44', '--text-scale': '0.66' },
  _calmEffects: { '--spread': '1' },
})

/** Every timed smoke element: driven by --at / --dur relative to the smoke origin. */
export const timed = css({
  animationDelay: 'var(--at)',
  animationDuration: 'var(--dur)',
  animationFillMode: 'both',
  animationIterationCount: '1',
})

export const lump = css({
  position: 'absolute',
  borderRadius: 'full',
  backgroundImage: SMOKE_GRADIENT,
  animationName: 'smokeLumpBreathe',
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
  animationDuration: 'var(--breathe, 2200ms)',
  animationDelay: 'var(--phase, 0ms)',
})

export const puff = css({
  position: 'absolute',
  width: '4em',
  height: '4em',
  borderRadius: 'full',
  backgroundImage: SMOKE_GRADIENT,
  animationName: 'smokePuffTravel',
  animationTimingFunction: 'token(easings.out)',
  _before: {
    content: '""',
    position: 'absolute',
    left: '-38%',
    top: '22%',
    width: '78%',
    height: '78%',
    borderRadius: 'full',
    backgroundImage: SMOKE_GRADIENT,
  },
  _after: {
    content: '""',
    position: 'absolute',
    left: '48%',
    top: '-26%',
    width: '70%',
    height: '70%',
    borderRadius: 'full',
    backgroundImage: SMOKE_GRADIENT,
  },
})

export const massBox = css({
  position: 'absolute',
  animationName: 'smokeMassLife',
  animationTimingFunction: 'token(easings.out)',
})

export const toneVar = cva({
  base: {},
  variants: {
    tone: {
      violet: { '--tone': 'token(colors.violet.400)' },
      lime: { '--tone': 'token(colors.lime.400)' },
      orange: { '--tone': 'token(colors.orange.400)' },
      cyan: { '--tone': 'token(colors.cyan.400)' },
    },
  },
})

/** Text condensing out of smoke: masked reveal sweeping left → right. */
export const smokeText = css({
  maskImage: 'linear-gradient(90deg, #000 44%, transparent 56%)',
  maskSize: '260% 100%',
  maskRepeat: 'no-repeat',
  maskPosition: '0% 0',
})

/** Wide cloud bodies (argument clouds and the verdict) — same material, elliptical. */
export const cloudBody = css({
  position: 'absolute',
  inset: '12% -6% 0',
  borderRadius: '45% 45% 40% 40% / 60% 60% 45% 45%',
  backgroundImage:
    'radial-gradient(ellipse 62% 70% at 42% 38%, token(colors.smoke.core) 0 26%, token(colors.smoke.light) 42%, token(colors.smoke.mid) 58%, token(colors.smoke.shade) 69%, rgba(214,190,219,0) 72.5%)',
})
export const verdictBody = css({
  position: 'absolute',
  inset: '10% -4% 2%',
  borderRadius: '42% 42% 38% 38% / 55% 55% 45% 45%',
  backgroundImage:
    'radial-gradient(ellipse 64% 68% at 46% 40%, token(colors.smoke.core) 0 30%, token(colors.smoke.light) 46%, token(colors.smoke.mid) 60%, token(colors.smoke.shade) 69%, rgba(214,190,219,0) 72.5%)',
})
