#!/usr/bin/env node
/**
 * Visual QA helper. Drives the locally installed Google Chrome through
 * playwright-core and captures screenshots.
 *
 *   node scripts/shoot.mjs [--base URL] [--size 1280x800] [--scale 2] [--clip x,y,w,h]
 *                          [--actions "click:sel|key:Space|wait:500"] name=query [name=query ...]
 *
 * Example:
 *   node scripts/shoot.mjs floss0="?lab&move=flossFront&t=0" floss1="?lab&move=flossFront&t=250"
 *
 * Images land in ./shots/<name>.png. The page must set `document.body.dataset.ready`
 * (the Lab does) or the script waits 600 ms.
 */
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright-core'

const args = process.argv.slice(2)
let base = 'http://localhost:5199/'
let size = { width: 1280, height: 800 }
let actions = null
let scale = 1
let clip = null
let reduced = false
const shots = []
for (let i = 0; i < args.length; i++) {
  const arg = args[i]
  if (arg === '--base') base = args[++i]
  else if (arg === '--size') {
    const [w, h] = args[++i].split('x').map(Number)
    size = { width: w, height: h }
  } else if (arg === '--actions') actions = args[++i]
  else if (arg === '--scale') scale = Number(args[++i])
  else if (arg === '--reduced') reduced = true
  else if (arg === '--clip') {
    const [x, y, width, height] = args[++i].split(',').map(Number)
    clip = { x, y, width, height }
  }
  else {
    const eq = arg.indexOf('=')
    shots.push({ name: arg.slice(0, eq), query: arg.slice(eq + 1) })
  }
}

mkdirSync('shots', { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: size, deviceScaleFactor: scale })
if (reduced) await page.emulateMedia({ reducedMotion: 'reduce' })
const errors = []
page.on('pageerror', (error) => errors.push(String(error)))
page.on('console', (message) => {
  if (message.type() === 'error' || message.type() === 'warning') errors.push(`[${message.type()}] ${message.text()}`)
})

for (const shot of shots) {
  await page.goto(new URL(shot.query, base).toString(), { waitUntil: 'networkidle' })
  await page
    .waitForFunction(() => document.body.dataset.ready === 'true', null, { timeout: 4000 })
    .catch(() => page.waitForTimeout(600))
  if (actions) {
    // Each action: "click:<selector>" | "key:<key>" | "wait:<ms>" | "eval:<js>"
    for (const action of actions.split('|')) {
      const [kind, ...rest] = action.split(':')
      const value = rest.join(':')
      if (kind === 'click') await page.click(value)
      else if (kind === 'key') await page.keyboard.press(value)
      else if (kind === 'wait') await page.waitForTimeout(Number(value))
      else if (kind === 'eval') await page.evaluate(value)
    }
  }
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: `shots/${shot.name}.png`, ...(clip ? { clip } : {}) })
  console.log(`shots/${shot.name}.png`)
}

if (errors.length) console.log('CONSOLE:\n' + [...new Set(errors)].join('\n'))
await browser.close()
