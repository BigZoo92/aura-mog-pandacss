#!/usr/bin/env node
/**
 * Evaluate a JS expression in the running app and print the JSON result.
 *   node scripts/inspect.mjs "?lab&move=idle" "getComputedStyle(document.querySelector('[data-joint=jaw]')).opacity"
 */
import { chromium } from 'playwright-core'

const [query = '/', expression = 'document.title', wait = '500'] = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const errors = []
page.on('pageerror', (error) => errors.push(String(error)))
await page.goto(new URL(query, 'http://localhost:5199/').toString(), { waitUntil: 'networkidle' })
await page.waitForTimeout(Number(wait))
const result = await page.evaluate(`(() => (${expression}))()`)
console.log(JSON.stringify(result, null, 2))
if (errors.length) console.log('PAGE ERRORS:\n' + errors.join('\n'))
await browser.close()
