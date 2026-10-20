#!/usr/bin/env node
/**
 * Real measurements for TECHNICAL_SHOWCASE.md. Nothing here is estimated.
 *
 *   node scripts/measure.mjs            (needs `pnpm build` output + dev server on :5199)
 *
 * 1. Production asset sizes (raw + gzip) and @keyframes count from dist/.
 * 2. In headless Chrome: DOM / animation counts and frame intervals while
 *    the show plays the heaviest scenes (twerk, smoke reveal).
 *    Headless Chrome has no real display vsync — frame intervals are an
 *    indication of main-thread headroom, not a substitute for profiling on
 *    real hardware.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { chromium } from 'playwright-core'

const kb = (n) => `${(n / 1024).toFixed(1)} kB`
const assets = readdirSync('dist/assets').map((file) => {
  const buffer = readFileSync(`dist/assets/${file}`)
  return { file, raw: buffer.length, gzip: gzipSync(buffer).length }
})
const css = readFileSync(`dist/assets/${assets.find((a) => a.file.endsWith('.css')).file}`, 'utf8')
const keyframes = (css.match(/@keyframes\s/g) ?? []).length

console.log('## Production assets')
for (const a of assets) console.log(`${a.file.padEnd(28)} ${kb(a.raw).padStart(10)}  gzip ${kb(a.gzip).padStart(9)}`)
console.log(`@keyframes in production CSS: ${keyframes}`)

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

async function sample(seek, label) {
  await page.goto(`http://localhost:5199/?seek=${seek}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await page.click('button[aria-label="Resume"]')
  const result = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const intervals = []
        let last = performance.now()
        const start = last
        const step = (now) => {
          intervals.push(now - last)
          last = now
          if (now - start < 3000) requestAnimationFrame(step)
          else {
            const stage = document.querySelector('[data-stage]')
            const sorted = [...intervals].sort((a, b) => a - b)
            resolve({
              frames: intervals.length,
              medianMs: sorted[Math.floor(sorted.length / 2)],
              p95Ms: sorted[Math.floor(sorted.length * 0.95)],
              worstMs: sorted.at(-1),
              stageElements: stage.querySelectorAll('*').length,
              runningAnimations: stage.getAnimations({ subtree: true }).length,
            })
          }
        }
        requestAnimationFrame(step)
      }),
  )
  console.log(
    `${label.padEnd(26)} frames ${String(result.frames).padStart(3)} · median ${result.medianMs.toFixed(1)} ms · p95 ${result.p95Ms.toFixed(1)} ms · worst ${result.worstMs.toFixed(1)} ms · ${result.stageElements} stage elements · ${result.runningAnimations} animations`,
  )
}

console.log('\n## Headless Chrome, 3 s of playback per scene (dev server)')
await sample('floss:0', 'Floss (simple dance)')
await sample('sixSevenTwerky:2100', '67 Twerky (twerk + 67)')
await sample('finalPuff:5800', 'Exhale (smoke stream)')
await sample('smokeReveal:9000', 'Smoke reveal + verdict')
await browser.close()
