#!/usr/bin/env node
/**
 * Browser check of playback control over CSS animations, using the real
 * Animation objects (WAAPI) in Chrome:
 *   1. pause during the exhale → every smoke + rig animation is paused and stays put
 *   2. 0.25× → every animation runs at playbackRate 0.25
 *   3. seek backwards → animations rewind; arguments are hidden again
 *   4. all animations under one time origin share the same currentTime
 *
 *   node scripts/verify-playback.mjs   (dev server on :5199)
 */
import { chromium } from 'playwright-core'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 860 } })
const errors = []
page.on('pageerror', (error) => errors.push(String(error)))

const snapshot = (selector) =>
  page.evaluate((sel) => {
    const root = document.querySelector(sel)
    if (!root) return null
    const animations = root.getAnimations({ subtree: true })
    return {
      count: animations.length,
      states: [...new Set(animations.map((a) => a.playState))],
      rates: [...new Set(animations.map((a) => a.playbackRate))],
      times: animations.slice(0, 40).map((a) => Math.round(Number(a.currentTime))),
    }
  }, selector)

const results = []
const check = (name, ok, detail) => {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`)
}

await page.goto('http://localhost:5199/?seek=finalPuff:6000', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)

// 1. play, then pause mid-exhale
await page.click('button[aria-label="Resume"]')
await page.waitForTimeout(700)
await page.click('button[aria-label="Pause"]')
await page.waitForTimeout(50)
const pausedA = await snapshot('[data-smoke]')
await page.waitForTimeout(600)
const pausedB = await snapshot('[data-smoke]')
check('smoke layer mounted with animations', !!pausedA && pausedA.count > 40, `${pausedA?.count} animations`)
check('pause freezes every smoke animation', pausedA?.states.length === 1 && pausedA.states[0] === 'paused', JSON.stringify(pausedA?.states))
check('paused smoke does not move', JSON.stringify(pausedA?.times) === JSON.stringify(pausedB?.times))
const rigPaused = await snapshot('[data-rig]')
check('pause freezes the character too', rigPaused?.states.every((s) => s === 'paused'), JSON.stringify(rigPaused?.states))
const shared = new Set(pausedA?.times ?? [])
check('all smoke animations share the smoke origin (same currentTime)', shared.size === 1, `${shared.size} distinct`)

// 2. speed 0.25×
await page.click('button:has-text("0.25×")')
await page.click('button[aria-label="Resume"]')
await page.waitForTimeout(400)
const slow = await snapshot('[data-smoke]')
check('0.25× propagates to every smoke animation', slow?.rates.length === 1 && slow.rates[0] === 0.25, JSON.stringify(slow?.rates))
const slowRig = await snapshot('[data-rig]')
check('0.25× propagates to the character', slowRig?.rates.every((r) => r === 0.25), JSON.stringify(slowRig?.rates))
await page.click('button[aria-label="Pause"]')
const beforeSeek = await snapshot('[data-smoke]')

// 3. seek forward into the reveal, then back
await page.goto('http://localhost:5199/?seek=smokeReveal:5600', { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
const visibleAt = () =>
  page.evaluate(() =>
    [...document.querySelectorAll('[data-argument]')]
      .filter((el) => Number(getComputedStyle(el.lastElementChild).opacity) > 0.5)
      .map((el) => el.getAttribute('data-argument')),
  )
const forward = await visibleAt()
check('seeking into the reveal shows the right arguments', forward.includes('tokens'), JSON.stringify(forward))
await page.focus('[role=slider]')
await page.keyboard.press('ArrowLeft')
await page.keyboard.press('ArrowLeft')
await page.waitForTimeout(300)
const back = await visibleAt()
check('seeking back 10 s hides later arguments again', !back.includes('tokens'), JSON.stringify(back))

if (beforeSeek) console.log(`(smoke currentTime when paused at 0.25×: ${beforeSeek.times[0]} ms)`)
if (errors.length) console.log('PAGE ERRORS:\n' + errors.join('\n'))
await browser.close()
process.exit(results.every((r) => r.ok) && !errors.length ? 0 : 1)
