#!/usr/bin/env node
/**
 * Contact sheet for visual QA: node scripts/montage.mjs out.png cols a.png b.png ...
 * Renders the images in a labelled grid with the local Chrome.
 */
import { readFileSync } from 'node:fs'
import { basename } from 'node:path'
import { chromium } from 'playwright-core'

const [out, colsArg, ...files] = process.argv.slice(2)
const cols = Number(colsArg) || 3
const cells = files
  .map((file) => {
    const data = readFileSync(file).toString('base64')
    return `<figure><img src="data:image/png;base64,${data}"/><figcaption>${basename(file, '.png')}</figcaption></figure>`
  })
  .join('')
const html = `<!doctype html><style>
body{margin:0;background:#111;display:grid;grid-template-columns:repeat(${cols},1fr);gap:4px;padding:4px;font:600 14px monospace;color:#cf0}
figure{margin:0;position:relative}img{width:100%;display:block}figcaption{position:absolute;left:6px;top:4px;background:#000a;padding:2px 6px}
</style>${cells}`
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
await page.setContent(html)
await page.screenshot({ path: out, fullPage: true })
await browser.close()
console.log(out)
