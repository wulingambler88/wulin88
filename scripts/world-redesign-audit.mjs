import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const phase = process.argv[2] ?? 'before'
const desktopOnly = process.argv[3] === 'desktop'
if (!['before', 'after'].includes(phase)) throw new Error('Expected before or after')
const targets = [
  ['01_town', 'TownScene'], ['02_bedroom', 'HomeScene', 0],
  ['03_living', 'HomeScene', 1], ['04_kitchen', 'HomeScene', 2],
  ['05_boutique', 'ClothingShopScene'], ['06_market', 'SupermarketScene'],
  ['07_pet_shop', 'PetShopScene'], ['08_park', 'ParkScene'],
  ['09_cafe', 'CafeScene'], ['10_salon', 'SalonScene'],
  ['11_toy_shop', 'ToyShopScene'], ['12_school', 'SchoolScene'],
  ['13_brain_games', 'TownScene', undefined, '#brain-button'],
  ['14_makeover', 'HomeScene', 0, '#creator-button'],
]
const browser = await chromium.launch({ headless: true })
const report = []
try {
  for (const viewport of (desktopOnly ? [{width:1280,height:720}] : [{width:1280,height:720}, {width:844,height:390}, ...(phase === 'after' ? [{width:932,height:430},{width:740,height:360}] : [])])) {
    const dir = path.resolve('world-redesign', phase, `${viewport.width}x${viewport.height}`)
    await mkdir(dir, { recursive: true })
    for (const [id, sceneKey, room, selector] of targets) {
      const context = await browser.newContext({ viewport, hasTouch: true, deviceScaleFactor: 1 })
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await page.goto('http://127.0.0.1:5180/', {waitUntil:'networkidle'})
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'))
      await page.evaluate(key => {
        const game = window.__PHASER_GAME__
        const active = game.scene.getScenes(true)[0]
        if (active.scene.key !== key) active.scene.start(key)
      }, sceneKey)
      await page.waitForFunction(key => window.__PHASER_GAME__.scene.isActive(key), sceneKey)
      if (room !== undefined) await page.locator(`[data-room="${room}"]`).click()
      await page.waitForTimeout(750)
      if (selector) { await page.locator(selector).click(); await page.waitForTimeout(300) }
      const evidence = await page.evaluate(() => {
        const active = window.__PHASER_GAME__?.scene.getScenes(true)[0]
        return {
          scene: active ? active.scene.key : 'unknown',
          objects: active ? active.children.length : 0,
          fps: Math.round(window.__PHASER_GAME__?.loop.actualFps ?? 60),
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          controls: [...document.querySelectorAll('button')].filter(b => b.getBoundingClientRect().width > 0).map(b => ({label:b.getAttribute('aria-label') || b.textContent.trim(), width:Math.round(b.getBoundingClientRect().width), height:Math.round(b.getBoundingClientRect().height)})),
        }
      })
      await page.screenshot({ path:path.join(dir, `${id}.png`) })
      report.push({ id, viewport, ...evidence, errors })
      console.log(`${viewport.width}x${viewport.height} ${id}: ${evidence.scene}, errors=${errors.length}`)
      await context.close()
    }
  }
  await writeFile(path.resolve('world-redesign', phase, 'evidence.json'), JSON.stringify(report, null, 2))
} finally { await browser.close() }
