import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { buildMotion } from '../src/choreography/motion/motion-recipe'
import { REST_POSE } from '../src/choreography/motion/rest-pose'
import { MOVES } from '../src/choreography/moves.registry'
import { AMBIENT_TRACKS, TRACKS } from '../src/choreography/tracks.registry'
import { smokeKeyframes } from '../src/finale/smoke/smoke.keyframes'

/**
 * Runs against `dist/` when a production build exists (`pnpm build` first):
 * every keyframe a move or the smoke can play must survive Panda's
 * `optimize.removeUnusedKeyframes` and reach the shipped stylesheet.
 */
const dir = 'dist/assets'
const cssFile = existsSync(dir) ? readdirSync(dir).find((f) => f.endsWith('.css')) : undefined

describe.skipIf(!cssFile)('production CSS', () => {
  const css = cssFile ? readFileSync(`${dir}/${cssFile}`, 'utf8') : ''
  const defined = new Set([...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]))

  it('contains every keyframe used by every move', () => {
    const motion = buildMotion({ tracks: TRACKS, moves: MOVES, rest: REST_POSE, ambient: AMBIENT_TRACKS })
    const missing = Object.values(motion.manifest)
      .flat()
      .filter((name) => !defined.has(name))
    expect(missing).toEqual([])
  })

  it('contains every smoke keyframe', () => {
    const missing = Object.keys(smokeKeyframes).filter((name) => !defined.has(name))
    expect(missing).toEqual([])
  })
})
