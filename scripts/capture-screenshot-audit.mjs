import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const baseUrl = process.env.AUDIT_URL ?? 'http://127.0.0.1:5180/'
const outDir = path.resolve('screenshots/_audit')
const viewport = { width: 1280, height: 720 }
const targets = [
  ['01_town', 'TownScene'], ['02_bedroom', 'HomeScene', 0], ['03_living_room', 'HomeScene', 1], ['04_kitchen', 'HomeScene', 2],
  ['05_boutique', 'ClothingShopScene'], ['06_market', 'SupermarketScene'], ['07_pet_shop', 'PetShopScene'],
  ['08_park', 'ParkScene'], ['09_cafe', 'CafeScene'], ['10_salon', 'SalonScene'], ['11_toy_shop', 'ToyShopScene'], ['12_school', 'SchoolScene'],
]
const browser = await chromium.launch({ headless: true })
const index = []
try {
  await mkdir(outDir, { recursive: true })
  for (const [name, sceneKey, room] of targets) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1 })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(baseUrl, { waitUntil: 'networkidle' })
    await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'))
    if (sceneKey !== 'TownScene') {
      await page.evaluate(key => window.__PHASER_GAME__.scene.getScenes(true)[0].scene.start(key), sceneKey)
      await page.waitForFunction(key => window.__PHASER_GAME__.scene.isActive(key), sceneKey)
    }
    if (room !== undefined) {
      await page.locator(`[data-room="${room}"]`).click()
      await page.waitForTimeout(450)
    }
    await page.waitForTimeout(700)
    const file = `${name}.png`
    await page.screenshot({ path: path.join(outDir, file) })
    index.push({ name, file, scene: sceneKey, viewport, errors })
    await context.close()
  }

  const panelShots = [
    ['13_brain_games', '#brain-button'], ['14_avatar_creator', '#creator-button'], ['15_daily_activities', '#world-today'],
  ]
  for (const [name, selector] of panelShots) {
    const context = await browser.newContext({ viewport })
    const page = await context.newPage(); const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(baseUrl, { waitUntil: 'networkidle' }); await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'))
    await page.locator(selector).click(); await page.waitForTimeout(500)
    const file = `${name}.png`; await page.screenshot({ path: path.join(outDir, file) })
    index.push({ name, file, scene: 'TownScene', panel: selector, viewport, errors }); await context.close()
  }

  const stateShots = [
    ['16_boutique_catalogue_open', 'ClothingShopScene', '.world-catalogue-toggle.boutique-only'],
    ['17_market_basket_open', 'SupermarketScene', '.world-catalogue-toggle.supermarket-only'],
    ['18_home_wardrobe_open', 'HomeScene', '#wardrobe-button'],
    ['19_home_settings_open', 'HomeScene', '#world-settings-button'],
  ]
  for (const [name, sceneKey, selector] of stateShots) {
    const context = await browser.newContext({ viewport }); const page = await context.newPage(); const errors = []
    page.on('pageerror', error => errors.push(error.message)); await page.goto(baseUrl, { waitUntil: 'networkidle' }); await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'))
    await page.evaluate(key => window.__PHASER_GAME__.scene.getScenes(true)[0].scene.start(key), sceneKey); await page.waitForFunction(key => window.__PHASER_GAME__.scene.isActive(key), sceneKey)
    await page.waitForTimeout(500); await page.locator(selector).click(); await page.waitForTimeout(450)
    const file = `${name}.png`; await page.screenshot({ path: path.join(outDir, file) }); index.push({ name, file, scene: sceneKey, state: selector, viewport, errors }); await context.close()
  }

  const timeShots = [['20_town_sunset', '#time-button'], ['21_town_night', '#time-button']]
  for (const [name, selector] of timeShots) {
    const context = await browser.newContext({ viewport }); const page = await context.newPage(); const errors = []
    page.on('pageerror', error => errors.push(error.message)); await page.goto(baseUrl, { waitUntil: 'networkidle' }); await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'))
    await page.locator(selector).click(); await page.waitForTimeout(650); if (name.endsWith('night')) { await page.locator(selector).click(); await page.waitForTimeout(650) }
    const file = `${name}.png`; await page.screenshot({ path: path.join(outDir, file) }); index.push({ name, file, scene: 'TownScene', state: name.includes('night') ? 'night' : 'sunset', viewport, errors }); await context.close()
  }
  await writeFile(path.join(outDir, 'index.json'), JSON.stringify({ generatedAt: new Date().toISOString(), viewport, count: index.length, screenshots: index }, null, 2))
  console.log(`Captured ${index.length} desktop screenshots in ${outDir}`)
  if (index.some(item => item.errors.length)) process.exitCode = 1
} finally { await browser.close() }
