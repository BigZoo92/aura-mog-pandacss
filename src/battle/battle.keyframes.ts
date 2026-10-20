import { defineKeyframes } from '@pandacss/dev'

export const battleKeyframes = defineKeyframes({
  bossEnter: {
    '0%': { translate: '40em -6em', rotate: '200deg', scale: '0.3', opacity: '0' },
    '60%': { translate: '-1.5em 0', rotate: '-8deg', scale: '1.1', opacity: '1' },
    '80%': { translate: '0.6em 0', rotate: '3deg', scale: '0.97' },
    '100%': { translate: '0 0', rotate: '0deg', scale: '1', opacity: '1' },
  },
  bossTaunt: {
    '0%': { rotate: '-4deg', scale: '1' },
    '100%': { rotate: '4deg', scale: '1.06' },
  },
  bossAttack: {
    '0%': { translate: '0 0', scale: '1' },
    '18%': { translate: '1.4em 0', scale: '0.92 1.08' },
    '40%': { translate: '-1em 0', scale: '1.08 0.94' },
    '100%': { translate: '0 0', scale: '1' },
  },
  bossKnockout: {
    '0%': { translate: '0 0', rotate: '0deg', scale: '1', opacity: '1', filter: 'brightness(1)' },
    '12%': { translate: '-1em 0', filter: 'brightness(3)' },
    '100%': { translate: '60em -24em', rotate: '900deg', scale: '0.15', opacity: '0', filter: 'brightness(1)' },
  },
  bossFloat: {
    '0%, 100%': { translate: '0 -0.6em' },
    '50%': { translate: '0 0.6em' },
  },
  bossHurt: {
    '0%': { translate: '0 0', filter: 'brightness(4) saturate(0)' },
    '20%': { translate: '1.2em -0.4em', filter: 'brightness(4) saturate(0)' },
    '40%': { translate: '-0.8em 0.3em', filter: 'brightness(1)' },
    '60%': { translate: '0.6em 0' },
    '100%': { translate: '0 0', filter: 'brightness(1)' },
  },
  projectileFly: {
    '0%': { translate: '0 0', rotate: '0deg', scale: '0.3', opacity: '0' },
    '8%': { scale: '1', opacity: '1' },
    '85%': { opacity: '1' },
    '100%': { translate: '-92cqw 0', rotate: '-14deg', scale: '1', opacity: '0' },
  },
  bossCrashLand: {
    '0%': { translate: '0 -48em', rotate: '-540deg', scale: '0.5' },
    '70%': { translate: '0 0', rotate: '0deg', scale: '1.1 0.85' },
    '84%': { translate: '0 -1.4em', scale: '0.96 1.04' },
    '100%': { translate: '0 0', rotate: '0deg', scale: '1' },
  },
  bossDizzy: {
    '0%': { rotate: '0deg', scale: '1 0.45' },
    '100%': { rotate: '360deg', scale: '1 0.45' },
  },
  victoryRise: {
    '0%': { translate: '0 2em', scale: '0.6', opacity: '0' },
    '60%': { translate: '0 -0.2em', scale: '1.06', opacity: '1' },
    '100%': { translate: '0 0', scale: '1', opacity: '1' },
  },
})
