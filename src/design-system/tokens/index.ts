import { defineTokens } from '@pandacss/dev'
import { HIP, RIG, SHOULDER } from '../../character/rig/geometry'
import { EASINGS } from '../../choreography/motion/easings'
import { colors, semanticColors } from './colors'

const em = (value: number) => ({ value: `${value}em` })

/**
 * Rig geometry exposed as tokens: the CSS shapes and the build-time IK read
 * the very same numbers from `geometry.ts`, so they can never drift apart.
 */
const rigSpace = {
  hipHeight: em(RIG.hipHeight),
  hipX: em(HIP.R.x),
  hipXNeg: em(HIP.L.x),
  hipY: em(HIP.R.y),
  thigh: em(RIG.thigh),
  shin: em(RIG.shin),
  shoulderX: em(SHOULDER.R.x),
  shoulderXNeg: em(SHOULDER.L.x),
  shoulderY: em(SHOULDER.R.y),
  upperArm: em(RIG.upperArm),
  forearm: em(RIG.forearm),
  neckY: em(RIG.neckY),
  ankle: em(RIG.ankleHeight),
}

export const tokens = defineTokens({
  colors,
  fonts: {
    display: { value: '"Bungee", "Impact", "Arial Black", system-ui, sans-serif' },
    impact: { value: '"Bangers", "Impact", "Arial Black", system-ui, sans-serif' },
    body: { value: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif' },
    mono: { value: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace' },
  },
  easings: Object.fromEntries(
    Object.entries(EASINGS).map(([name, value]) => [name, { value }]),
  ),
  durations: {
    beat: { value: '500ms' },
    halfBeat: { value: '250ms' },
    ui: { value: '160ms' },
  },
  spacing: { rig: rigSpace },
  sizes: { rig: rigSpace },
  borderWidths: {
    outline: { value: '0.34em' },
    outlineThick: { value: '0.44em' },
    ui: { value: '3px' },
  },
  shadows: {
    hard: { value: '4px 4px 0 0 #101014' },
    hardLg: { value: '7px 7px 0 0 #101014' },
  },
})

export const semanticTokens = { colors: semanticColors }
