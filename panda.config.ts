import { defineConfig } from '@pandacss/dev'
import { buildMotion } from './src/choreography/motion/motion-recipe'
import { REST_POSE } from './src/choreography/motion/rest-pose'
import { MOVES } from './src/choreography/moves.registry'
import { AMBIENT_TRACKS, TRACKS } from './src/choreography/tracks.registry'
import { conditions } from './src/design-system/conditions'
import { effectKeyframes } from './src/design-system/keyframes'
import { globalCss } from './src/design-system/global-css'
import { layerStyles } from './src/design-system/layer-styles'
import { recipes, slotRecipes } from './src/design-system/recipes'
import { semanticTokens, tokens } from './src/design-system/tokens'

/**
 * Choreography is compiled HERE, at build time: typed tracks and moves become
 * static `@keyframes` plus one slot recipe (`rigMotion`). The browser gets
 * plain CSS; React only picks which `move` variant is active.
 */
const motion = buildMotion({ tracks: TRACKS, moves: MOVES, rest: REST_POSE, ambient: AMBIENT_TRACKS })

export default defineConfig({
  presets: ['@pandacss/preset-base', '@pandacss/preset-panda'],
  preflight: true,
  include: ['./src/**/*.{ts,tsx}'],
  exclude: ['./src/**/*.test.ts'],
  jsxFramework: 'react',
  outdir: 'styled-system',

  conditions: { extend: conditions },
  globalCss,

  theme: {
    extend: {
      tokens,
      semanticTokens,
      layerStyles,
      keyframes: { ...effectKeyframes, ...motion.keyframes },
      recipes,
      slotRecipes: { ...slotRecipes, rigMotion: motion.recipe },
    },
  },

  // The active move is chosen at runtime from the choreography config, so the
  // extractor cannot see which variants are used: generate all of them.
  staticCss: { recipes: { rigMotion: ['*'] } },

  optimize: {
    // Safe: every motion keyframe is referenced by a staticCss recipe variant
    // and every effect keyframe by an extracted style. Verified by
    // `scripts/verify-css.mjs` against the production stylesheet.
    removeUnusedKeyframes: true,
  },
})
