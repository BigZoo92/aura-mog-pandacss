#!/usr/bin/env node
/**
 * Production CSS sanity check (run after `pnpm build`):
 *  - every animation name referenced in the stylesheet has an @keyframes rule
 *    (i.e. `optimize.removeUnusedKeyframes` did not strip anything we use);
 *  - a list of signature keyframes is present;
 *  - prints counts and sizes.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

const dir = 'dist/assets'
const file = readdirSync(dir).find((f) => f.endsWith('.css'))
if (!file) {
  console.error('No CSS in dist/assets — run `pnpm build` first.')
  process.exit(1)
}
const css = readFileSync(`${dir}/${file}`, 'utf8')

const KEYWORDS = new Set([
  'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'step-start', 'step-end', 'infinite',
  'both', 'forwards', 'backwards', 'none', 'normal', 'alternate', 'alternate-reverse', 'reverse',
  'paused', 'running', 'initial', 'inherit', 'unset',
])
/** Split on commas that are not inside parentheses (cubic-bezier, var...). */
const splitTopLevel = (value) => {
  const parts = []
  let depth = 0
  let current = ''
  for (const ch of value) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      parts.push(current)
      current = ''
    } else current += ch
  }
  parts.push(current)
  return parts
}
const stripFunctions = (value) => value.replace(/[\w-]+\([^()]*(\([^()]*\)[^()]*)*\)/g, ' ')

const defined = new Set([...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]))
const referenced = new Set()
for (const m of css.matchAll(/animation(?:-name)?\s*:\s*([^;}]+)/g)) {
  for (const part of splitTopLevel(m[1])) {
    const name = stripFunctions(part)
      .trim()
      .split(/\s+/)
      .find((token) => /^[a-zA-Z_][\w-]*$/.test(token) && !KEYWORDS.has(token))
    if (name) referenced.add(name)
  }
}
const missing = [...referenced].filter((name) => !defined.has(name) && !name.startsWith('var'))

const SIGNATURE = [
  'flossArms_upperArmL',
  'griddyFootwork_footL',
  'twerkPelvis_pelvis',
  'twerkHips_hips',
  'twerkCheeks_cheekL',
  'sixSevenTwerk_forearmL',
  'twerkyTurn_orient',
  'chadMorph_jaw',
  'inhale_propGlow',
  'smokePuffTravel',
  'smokeTextLife',
  'smokeVerdictCloud',
  'chadJawReveal',
  'bossCrashLand',
]
const absent = SIGNATURE.filter((name) => !defined.has(name))

console.log(`stylesheet       ${file}`)
console.log(`size             ${(css.length / 1024).toFixed(1)} kB  (gzip ${(gzipSync(css).length / 1024).toFixed(1)} kB)`)
console.log(`@keyframes       ${defined.size}`)
console.log(`referenced names ${referenced.size}`)
console.log(`missing          ${missing.length ? missing.join(', ') : 'none'}`)
console.log(`signature        ${absent.length ? 'ABSENT: ' + absent.join(', ') : 'all present'}`)
process.exit(missing.length || absent.length ? 1 : 0)
