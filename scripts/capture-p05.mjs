import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DIST_DIR = path.resolve('dist')
const OUT_DIR = path.resolve('screenshots/phases/P05')

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

function startStaticServer(port = 5187) {
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
  console.log(`P05 Server running at ${url}`)

  let browser
  const metadata = []
  const pageErrors = []
  const asset404s = []

  try {
    try {
      browser = await chromium.launch({ channel: 'msedge', headless: true })
    } catch {
      browser = await chromium.launch({ headless: true })
    }

    async function createTrackedPage(width, height) {
      const context = await browser.newContext({ viewport: { width, height } })
      const page = await context.newPage()
      page.on('pageerror', (err) => {
        console.error(`Page error: ${err.message}`)
        pageErrors.push(err.message)
      })
      page.on('response', (resp) => {
        if (resp.status() === 404) {
          console.warn(`404 asset: ${resp.url()}`)
          asset404s.push(resp.url())
        }
      })
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene?.isActive('TownScene'))
      await page.waitForTimeout(400)
      return { context, page }
    }

    async function snap(page, filename, scene, description, width, height) {
      const filePath = path.join(OUT_DIR, filename)
      await page.screenshot({ path: filePath })
      console.log(`Saved screenshot: ${filename}`)
      metadata.push({
        filename,
        viewport: `${width}x${height}`,
        scene,
        description,
        timestamp: new Date().toISOString(),
      })
    }

    // 1. Town Daytime (1280x720)
    console.log('--- Testing Town Scene Daytime 1280x720 ---')
    {
      const { context, page } = await createTrackedPage(1280, 720)
      await snap(page, 'p05-town-1280x720.png', 'TownScene', 'Town scene daytime with all 9 location buildings and HUD', 1280, 720)

      // Character Creator Modal
      console.log('--- Testing Character Creator Modal ---')
      await page.locator('#creator-button').click()
      await page.waitForSelector('.creator-modal-sheet', { state: 'visible' })
      await page.waitForTimeout(400)
      await snap(page, 'p05-character-creator-1280x720.png', 'TownScene + Creator', 'Character creator modal with live preview, cancel, and save buttons', 1280, 720)

      await context.close()
    }

    // 2. Town Sunset (1536x990) & Wardrobe Drawer
    console.log('--- Testing Town Scene Sunset 1536x990 ---')
    {
      const { context, page } = await createTrackedPage(1536, 990)
      await page.evaluate(() => {
        const town = window.__PHASER_GAME__?.scene?.getScene('TownScene')
        if (town?.dayNightOverlay) {
          town.dayNightOverlay.setAlpha(0.25)
          town.dayNightOverlay.fillColor = 0xff7b54
        }
      })
      await page.waitForTimeout(300)
      await snap(page, 'p05-town-sunset-1536x990.png', 'TownScene', 'Town scene sunset golden hour palette across wide viewport', 1536, 990)

      // Wardrobe Drawer
      console.log('--- Testing Wardrobe Drawer ---')
      await page.locator('#wardrobe-button').click()
      await page.waitForSelector('#wardrobe-panel:not([hidden])')
      await page.waitForTimeout(400)
      await snap(page, 'p05-wardrobe-drawer-1536x990.png', 'TownScene + Wardrobe', 'Wardrobe drawer opened showing categories and equipped outfit', 1536, 990)

      await context.close()
    }

    // 3. Town Night (1920x1080)
    console.log('--- Testing Town Scene Night 1920x1080 ---')
    {
      const { context, page } = await createTrackedPage(1920, 1080)
      await page.evaluate(() => {
        const town = window.__PHASER_GAME__?.scene?.getScene('TownScene')
        if (town?.dayNightOverlay) {
          town.dayNightOverlay.setAlpha(0.55)
          town.dayNightOverlay.fillColor = 0x1d1841
        }
      })
      await page.waitForTimeout(300)
      await snap(page, 'p05-town-night-1920x1080.png', 'TownScene', 'Town scene nighttime atmospheric lighting at full 1080p', 1920, 1080)
      await context.close()
    }

    // 4. Home Scene - Bedroom (1280x720)
    console.log('--- Testing Home Scene Bedroom ---')
    {
      const { context, page } = await createTrackedPage(1280, 720)
      await page.locator('#home-button').click()
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('HomeScene'))
      await page.waitForTimeout(600)
      await snap(page, 'p05-home-bedroom-1280x720.png', 'HomeScene:Bedroom', 'Home bedroom with double bed, sleeping animation, rug, mirror', 1280, 720)
      await context.close()
    }

    // 5. Home Scene - Living Room (1536x990)
    console.log('--- Testing Home Scene Living Room ---')
    {
      const { context, page } = await createTrackedPage(1536, 990)
      await page.locator('#home-button').click()
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('HomeScene'))
      await page.locator('[data-room="1"]').click()
      await page.waitForTimeout(600)
      await snap(page, 'p05-home-living-1536x990.png', 'HomeScene:LivingRoom', 'Home living room with sofa, retro TV, bookshelf, standing mirror', 1536, 990)
      await context.close()
    }

    // 6. Home Scene - Kitchen (1920x1080)
    console.log('--- Testing Home Scene Kitchen ---')
    {
      const { context, page } = await createTrackedPage(1920, 1080)
      await page.locator('#home-button').click()
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('HomeScene'))
      await page.locator('[data-room="2"]').click()
      await page.waitForTimeout(600)
      await snap(page, 'p05-home-kitchen-1920x1080.png', 'HomeScene:Kitchen', 'Home kitchen with double-door mint fridge, dining table, stove', 1920, 1080)
      await context.close()
    }

    // 7. Cloudberry Boutique (1280x720)
    console.log('--- Testing Boutique Scene ---')
    {
      const { context, page } = await createTrackedPage(1280, 720)
      await page.locator('[data-location="clothing_boutique"]').click()
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('ClothingShopScene'))
      await page.waitForTimeout(600)
      await snap(page, 'p05-boutique-1280x720.png', 'ClothingShopScene', 'Cloudberry Boutique with grounded plant, racks, mirror, and armchair', 1280, 720)
      await context.close()
    }

    // 8. Supermarket (1536x990) & Cart Drawer
    console.log('--- Testing Supermarket Scene ---')
    {
      const { context, page } = await createTrackedPage(1536, 990)
      await page.locator('[data-location="supermarket"]').click()
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('SupermarketScene'))
      await page.waitForTimeout(600)
      await snap(page, 'p05-supermarket-1536x990.png', 'SupermarketScene', 'Oliver Supermarket with grocery shelves, produce stands, cash register', 1536, 990)

      // Open Cart Drawer
      console.log('--- Testing Supermarket Cart & Products ---')
      await page.locator('.world-catalogue-toggle.supermarket-only').click()
      await page.waitForSelector('#market-panel:not(.world-collapsed)')
      await page.waitForTimeout(400)
      await snap(page, 'p05-supermarket-cart-1536x990.png', 'SupermarketScene + Cart', 'Supermarket shopping panel with products list and basket drawer', 1536, 990)
      await context.close()
    }

    // 9. Pet Shop (1920x1080)
    console.log('--- Testing Pet Shop Scene ---')
    {
      const { context, page } = await createTrackedPage(1920, 1080)
      await page.locator('[data-location="pet_shop"]').click()
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('PetShopScene'))
      await page.waitForTimeout(600)
      await snap(page, 'p05-petshop-1920x1080.png', 'PetShopScene', 'Daisy Pet Paradise with interactive pets, sleep cushions, grooming area', 1920, 1080)
      await context.close()
    }

    // 10. School Scene (1280x720)
    console.log('--- Testing School Scene ---')
    {
      const { context, page } = await createTrackedPage(1280, 720)
      await page.locator('[data-location="school"]').click()
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('SchoolScene'))
      await page.waitForTimeout(600)
      await snap(page, 'p05-school-1280x720.png', 'SchoolScene', 'Sunny Valley Academy classroom with interactive math quiz blackboard', 1280, 720)
      await context.close()
    }

    // 11. Blossom Park (1536x990)
    console.log('--- Testing Park Scene ---')
    {
      const { context, page } = await createTrackedPage(1536, 990)
      await page.locator('[data-location="park"]').click()
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('ParkScene'))
      await page.waitForTimeout(600)
      await snap(page, 'p05-park-1536x990.png', 'ParkScene', 'Blossom Park with playground swing, duck pond ripples, sandcastle', 1536, 990)
      await context.close()
    }

    // 12. Cherry Blossom Café (1920x1080)
    console.log('--- Testing Café Scene ---')
    {
      const { context, page } = await createTrackedPage(1920, 1080)
      await page.locator('[data-location="cafe"]').click()
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('CafeScene'))
      await page.waitForTimeout(600)
      await snap(page, 'p05-cafe-1920x1080.png', 'CafeScene', 'Cherry Blossom Café with espresso machine steam and pastry displays', 1920, 1080)
      await context.close()
    }

    // 13. Glow & Glam Salon (1280x720)
    console.log('--- Testing Salon Scene ---')
    {
      const { context, page } = await createTrackedPage(1280, 720)
      await page.locator('[data-location="salon"]').click()
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('SalonScene'))
      await page.waitForTimeout(600)
      await snap(page, 'p05-salon-1280x720.png', 'SalonScene', 'Glow & Glam Salon with vanity mirrors, shampoo basin, stylist station', 1280, 720)
      await context.close()
    }

    // 14. Wonderland Toys (1536x990)
    console.log('--- Testing Toy Shop Scene ---')
    {
      const { context, page } = await createTrackedPage(1536, 990)
      await page.locator('[data-location="toy_shop"]').click()
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('ToyShopScene'))
      await page.waitForTimeout(600)
      await snap(page, 'p05-toyshop-1536x990.png', 'ToyShopScene', 'Wonderland Toys with puzzle mats, toy display shelves, robot sounds', 1536, 990)
      await context.close()
    }

    // 15. Legacy Save Verification (1280x720)
    console.log('--- Testing Legacy Save Loading (Purple Twin Buns) ---')
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
      const page = await context.newPage()
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.evaluate(() => {
        const legacySave = {
          saveVersion: 4,
          layoutVersion: 1,
          starCoins: 999,
          currentLocation: 'town',
          currentRoom: 0,
          character: {
            x: 480,
            y: 380,
            state: 'standing',
            customization: {
              skinColor: 0xffd1b3,
              hairStyle: 'twin_buns',
              hairColor: 0xb57edc, // purple hair
              eyeColor: 0x4a90e2,
              blushColor: 0xff9ec7,
            },
            equipped: {
              top: 'top_strawberry',
              bottom: 'bottom_mint',
              dress: null,
              hat: 'hat_beret',
              shoes: 'shoes_mint',
              accessory: null,
            },
            stats: { happiness: 100, energy: 100, hunger: 100, fun: 100 },
          },
          inventory: { strawberry: 5 },
          ownedClothing: ['top_strawberry', 'bottom_mint', 'hat_beret', 'shoes_mint'],
          unlockedLocations: { home: true, clothing_boutique: true, supermarket: true },
          progress: {},
          roomItems: [],
          furniture: [],
          settings: { soundEnabled: true, musicEnabled: true },
          pets: [],
          minigames: { supermarketScanner: 0, parkSandbox: 0 },
        }
        localStorage.setItem('qian_hui_avatar_city_save_v1', JSON.stringify(legacySave))
      })
      await page.reload({ waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene?.isActive('TownScene'))
      await page.waitForTimeout(600)
      await snap(page, 'p05-legacy-save-avatar-1280x720.png', 'TownScene:LegacySave', 'Town scene rendering legacy save with purple twin buns avatar intact', 1280, 720)
      await context.close()
    }

    // Save capture.json
    const captureData = {
      phase: 'P05',
      captureCount: metadata.length,
      pageErrors,
      asset404s,
      captures: metadata,
      generatedAt: new Date().toISOString(),
    }
    await writeFile(path.join(OUT_DIR, 'capture.json'), JSON.stringify(captureData, null, 2), 'utf-8')
    console.log(`P05 capture complete! Saved ${metadata.length} captures to ${OUT_DIR}`)
  } finally {
    if (browser) await browser.close()
    server.close()
  }
}

run().catch((err) => {
  console.error('Capture failed:', err)
  process.exit(1)
})
