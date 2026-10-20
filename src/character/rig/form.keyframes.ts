import { defineKeyframes } from '@pandacss/dev'

/**
 * Form reveal keyframes. When `data-form` switches, the form layers animate in
 * from the moment the form started (their `data-t0`). Snapping BACK to the
 * silly Brainrot form is intentionally instant — that's the joke.
 */
export const formKeyframes = defineKeyframes({
  chadJawReveal: {
    '0%': { scale: '0.55 0.25', opacity: '0' },
    '45%': { scale: '1.1 1.22', opacity: '1' },
    '70%': { scale: '0.97 0.95' },
    '100%': { scale: '1', opacity: '1' },
  },
  chadEyesReveal: {
    '0%': { opacity: '0', scale: '1.4' },
    '40%': { opacity: '1', scale: '0.94' },
    '100%': { opacity: '1', scale: '1' },
  },
  chadBulkReveal: {
    '0%': { opacity: '0', scale: '0.6' },
    '50%': { opacity: '1', scale: '1.12' },
    '100%': { opacity: '1', scale: '1' },
  },
  chadSparkleSweep: {
    '0%': { translate: '0 0', opacity: '0', scale: '0.3', rotate: '0deg' },
    '15%': { opacity: '1', scale: '1.1' },
    '50%': { translate: '8em 4.4em', scale: '0.9' },
    '85%': { translate: '16em 0', opacity: '1', scale: '1.25' },
    '100%': { translate: '16.4em -0.4em', opacity: '0', scale: '0.2', rotate: '180deg' },
  },
  beastShadesDrop: {
    '0%': { translate: '0 -6em', opacity: '0', rotate: '-14deg' },
    '55%': { translate: '0 0.4em', opacity: '1', rotate: '3deg' },
    '75%': { translate: '0 -0.2em', rotate: '-1deg' },
    '100%': { translate: '0 0', opacity: '1', rotate: '0deg' },
  },
})
