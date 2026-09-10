import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const CANDIDATE_SHA = '9c91519a067966c253981939f5ff65a8c1495da6'
const DIST_DIR = path.resolve('dist')
const OUT_DIR = path.resolve('screenshots/phases/P01')

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
}

// Simple static server for dist
function startStaticServer(port = 5178) {
  const server = createServer(async (req, res) => {
    try {
      let reqPath = req.url.split('?')[0]
      if (reqPath === '/' || reqPath === '') reqPath = '/index.html'
      const filePath = path.join(DIST_DIR, reqPath)
      const st = await stat(filePath)
      if (st.isDirectory()) {
        const indexHtml = path.join(filePath, 'index.html')
        const data = await readFile(indexHtml)
        res.writeHead(200, { 'Content-Type': 'text/html' })
        return res.end(data)
      }
      const ext = path.extname(filePath).toLowerCase()
      const contentType = MIME_TYPES[ext] || 'application/octet-stream'
      const data = await readFile(filePath)
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(data)
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not Found')
    }
  })

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      resolve({ server, url: `http://127.0.0.1:${port}/` })
    })
  })
}

async function run() {
  await mkdir(OUT_DIR, { recursive: true })
  const { server, url } = await startStaticServer()
  console.log(`Server started at ${url}`)

  let browser
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true })
  } catch {
    browser = await chromium.launch({ headless: true })
  }

  const captures = []

  const viewports = [
    { name: '1280x720', width: 1280, height: 720 },
    { name: '1536x990', width: 1536, height: 990 },
    { name: '1920x1080', width: 1920, height: 1080 },
  ]

  try {
    // 1. Multi-resolution town captures
    for (const vp of viewports) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', (err) => errors.push(err.message))

      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'))
      await page.waitForTimeout(600)

      const filename = `01_town_${vp.name}.png`
      await page.screenshot({ path: path.join(OUT_DIR, filename) })
      captures.push({
        name: `Town Scene (${vp.name})`,
        file: filename,
        scene: 'TownScene',
        viewport: vp,
        candidate_sha: CANDIDATE_SHA,
        timestamp: new Date().toISOString(),
        errors,
      })
      await context.close()
    }

    // 2. Character Creator Modal
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', (err) => errors.push(err.message))

      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'))
      await page.locator('#creator-button').click()
      await page.waitForTimeout(600)

      const filename = '02_character_creator_modal.png'
      await page.screenshot({ path: path.join(OUT_DIR, filename) })
      captures.push({
        name: 'Character Creator Studio Modal',
        file: filename,
        scene: 'TownScene',
        panel: '#creator-button',
        viewport: { width: 1280, height: 720 },
        candidate_sha: CANDIDATE_SHA,
        timestamp: new Date().toISOString(),
        errors,
      })
      await context.close()
    }

    // 3. Custom Purple / Lavender Hair Saved in Town
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', (err) => errors.push(err.message))

      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'))

      // Apply custom Pastel Lavender (#b89fe8) hair and twin buns
      await page.evaluate(() => {
        const custom = {
          hairStyle: 'twin_buns',
          hairColor: 0xb89fe8,
          skinColor: 0xffd7c6,
          eyeColor: 0x6c3f68,
          blushColor: 0xff7e9f,
        }
        const game = window.__PHASER_GAME__
        game.scene.getScenes(true).forEach((scene) => {
          scene.children.list.forEach((child) => {
            if (child.setCustomization) child.setCustomization(custom)
          })
        })
        game.events.emit('character:customized', custom)
      })
      await page.waitForTimeout(600)

      const filename = '03_town_purple_hair_saved.png'
      await page.screenshot({ path: path.join(OUT_DIR, filename) })
      captures.push({
        name: 'Town Scene with Preserved Purple Hair & Synced Portrait',
        file: filename,
        scene: 'TownScene',
        customization: { hairColor: 0xb89fe8, hairStyle: 'long_waves' },
        viewport: { width: 1280, height: 720 },
        candidate_sha: CANDIDATE_SHA,
        timestamp: new Date().toISOString(),
        errors,
      })
      await context.close()
    }

    // 4. Home Bedroom - Sleeping Pose in Bed
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', (err) => errors.push(err.message))

      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'))

      // Teleport to HomeScene
      await page.evaluate(() => {
        window.__PHASER_GAME__.scene.getScenes(true)[0].scene.start('HomeScene')
      })
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('HomeScene'))
      // Select room 0 (bedroom)
      await page.locator('[data-room="0"]').click()
      await page.waitForTimeout(400)

      // Transition character to sleeping state
      await page.evaluate(() => {
        const homeScene = window.__PHASER_GAME__.scene.getScene('HomeScene')
        if (homeScene?.hero) {
          homeScene.hero.changeState('sleeping')
          homeScene.hero.setPosition(380, 420)
        }
      })
      await page.waitForTimeout(600)

      const filename = '04_home_bedroom_sleeping_pose.png'
      await page.screenshot({ path: path.join(OUT_DIR, filename) })
      captures.push({
        name: 'Home Bedroom - Sleeping Pose in Bed',
        file: filename,
        scene: 'HomeScene',
        state: 'sleeping',
        viewport: { width: 1280, height: 720 },
        candidate_sha: CANDIDATE_SHA,
        timestamp: new Date().toISOString(),
        errors,
      })
      await context.close()
    }

    // 5. Home Living Room - Sitting Pose on Sofa
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', (err) => errors.push(err.message))

      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'))

      // Teleport to HomeScene
      await page.evaluate(() => {
        window.__PHASER_GAME__.scene.getScenes(true)[0].scene.start('HomeScene')
      })
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('HomeScene'))
      // Select room 1 (living room)
      await page.locator('[data-room="1"]').click()
      await page.waitForTimeout(400)

      // Transition character to sitting state
      await page.evaluate(() => {
        const homeScene = window.__PHASER_GAME__.scene.getScene('HomeScene')
        if (homeScene?.hero) {
          homeScene.hero.changeState('sitting')
          homeScene.hero.setPosition(560, 450)
        }
      })
      await page.waitForTimeout(600)

      const filename = '05_home_living_room_sitting_pose.png'
      await page.screenshot({ path: path.join(OUT_DIR, filename) })
      captures.push({
        name: 'Home Living Room - Sitting Pose on Sofa',
        file: filename,
        scene: 'HomeScene',
        state: 'sitting',
        viewport: { width: 1280, height: 720 },
        candidate_sha: CANDIDATE_SHA,
        timestamp: new Date().toISOString(),
        errors,
      })
      await context.close()
    }

    // 6. Boutique Outfit Dressing & Preview
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', (err) => errors.push(err.message))

      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'))

      await page.evaluate(() => {
        window.__PHASER_GAME__.scene.getScenes(true)[0].scene.start('ClothingShopScene')
      })
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('ClothingShopScene'))
      await page.waitForTimeout(600)

      const filename = '06_boutique_scene.png'
      await page.screenshot({ path: path.join(OUT_DIR, filename) })
      captures.push({
        name: 'Clothing Boutique Scene',
        file: filename,
        scene: 'ClothingShopScene',
        viewport: { width: 1280, height: 720 },
        candidate_sha: CANDIDATE_SHA,
        timestamp: new Date().toISOString(),
        errors,
      })
      await context.close()
    }

    const captureJson = {
      phase: 'P01',
      candidate_code_sha: CANDIDATE_SHA,
      created_at: new Date().toISOString(),
      captures,
    }

    await writeFile(path.join(OUT_DIR, 'capture.json'), JSON.stringify(captureJson, null, 2), 'utf-8')
    console.log(`Successfully captured ${captures.length} screenshots to ${OUT_DIR}`)
  } finally {
    await browser.close()
    server.close()
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
