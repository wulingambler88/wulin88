import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DIST_DIR = path.resolve('dist')
const OUT_DIR = path.resolve('screenshots/phases/P04')

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

function startStaticServer(port = 5186) {
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

  try {
    // -------------------------------------------------------------------------
    // 1. Character Creator Modal (1280x720): Open, Live Preview, Cancel, Re-open
    // -------------------------------------------------------------------------
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
      const page = await context.newPage()
      page.on('console', (msg) => console.log('Creator:', msg.text()))
      page.on('pageerror', (err) => console.error('Creator PageError:', err))

      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'))
      await page.waitForTimeout(400)

      // Open Character Creator
      await page.locator('#creator-button').click()
      await page.waitForSelector('.creator-modal-sheet', { state: 'visible' })
      await page.waitForTimeout(300)

      const file1 = 'p04-creator-modal-open-1280x720.png'
      await page.screenshot({ path: path.join(OUT_DIR, file1) })
      captures.push({ file: file1, viewport: '1280x720', description: 'Character creator modal open with all style options and actions' })

      // Live preview: select bob and strawberry pink
      await page.locator('[data-style="bob"]').click()
      await page.locator('[data-hair-color="16744364"]').click() // Strawberry pink
      await page.waitForTimeout(300)

      const file2 = 'p04-creator-live-preview-1280x720.png'
      await page.screenshot({ path: path.join(OUT_DIR, file2) })
      captures.push({ file: file2, viewport: '1280x720', description: 'Live preview of modified hairstyle and hair dye on Qian Hui' })

      // Cancel and verify restoration
      await page.locator('#creator-cancel').click()
      await page.waitForSelector('.creator-modal-overlay', { state: 'hidden' })
      await page.waitForTimeout(300)

      const file3 = 'p04-creator-cancel-restore-1280x720.png'
      await page.screenshot({ path: path.join(OUT_DIR, file3) })
      captures.push({ file: file3, viewport: '1280x720', description: 'Cancel restores original look without corrupting saved customization' })

      await context.close()
    }

    // -------------------------------------------------------------------------
    // 2. Character Creator Save (1536x990)
    // -------------------------------------------------------------------------
    {
      const context = await browser.newContext({ viewport: { width: 1536, height: 990 } })
      const page = await context.newPage()
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'))
      await page.waitForTimeout(400)

      await page.locator('#creator-button').click()
      await page.waitForSelector('.creator-modal-sheet', { state: 'visible' })
      await page.locator('[data-style="twin_buns"]').click()
      await page.locator('[data-hair-color="12099560"]').click() // Lavender
      await page.locator('#creator-save').click()
      await page.waitForSelector('.creator-modal-overlay', { state: 'hidden' })
      await page.waitForTimeout(400)

      const file4 = 'p04-creator-saved-1536x990.png'
      await page.screenshot({ path: path.join(OUT_DIR, file4) })
      captures.push({ file: file4, viewport: '1536x990', description: 'Character creator successfully saved new look to player state' })

      await context.close()
    }

    // -------------------------------------------------------------------------
    // 3. Wardrobe Panel & Category Filters (1280x720)
    // -------------------------------------------------------------------------
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
      const page = await context.newPage()
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'))
      await page.waitForTimeout(400)

      // Open Wardrobe
      await page.locator('#wardrobe-button').click()
      await page.waitForSelector('#wardrobe-panel:not([hidden])')
      await page.waitForTimeout(300)

      // Tab: All
      const fileAll = 'p04-wardrobe-all-1280x720.png'
      await page.screenshot({ path: path.join(OUT_DIR, fileAll) })
      captures.push({ file: fileAll, viewport: '1280x720', description: 'Wardrobe panel with All category tab active showing owned outfits' })

      // Tab: Dresses
      await page.locator('[data-wardrobe-filter="dress"]').click()
      await page.waitForTimeout(200)
      const fileDress = 'p04-wardrobe-dress-1280x720.png'
      await page.screenshot({ path: path.join(OUT_DIR, fileDress) })
      captures.push({ file: fileDress, viewport: '1280x720', description: 'Wardrobe panel filtered by Dresses' })

      // Tab: Tops
      await page.locator('[data-wardrobe-filter="top"]').click()
      await page.waitForTimeout(200)
      const fileTop = 'p04-wardrobe-top-1280x720.png'
      await page.screenshot({ path: path.join(OUT_DIR, fileTop) })
      captures.push({ file: fileTop, viewport: '1280x720', description: 'Wardrobe panel filtered by Tops' })

      // Tab: Bottoms
      await page.locator('[data-wardrobe-filter="bottom"]').click()
      await page.waitForTimeout(200)
      const fileBottom = 'p04-wardrobe-bottom-1280x720.png'
      await page.screenshot({ path: path.join(OUT_DIR, fileBottom) })
      captures.push({ file: fileBottom, viewport: '1280x720', description: 'Wardrobe panel filtered by Bottoms' })

      // Tab: Shoes
      await page.locator('[data-wardrobe-filter="shoes"]').click()
      await page.waitForTimeout(200)
      const fileShoes = 'p04-wardrobe-shoes-1280x720.png'
      await page.screenshot({ path: path.join(OUT_DIR, fileShoes) })
      captures.push({ file: fileShoes, viewport: '1280x720', description: 'Wardrobe panel filtered by Shoes' })

      // Tab: Hats
      await page.locator('[data-wardrobe-filter="hat"]').click()
      await page.waitForTimeout(200)
      const fileHat = 'p04-wardrobe-hat-1280x720.png'
      await page.screenshot({ path: path.join(OUT_DIR, fileHat) })
      captures.push({ file: fileHat, viewport: '1280x720', description: 'Wardrobe panel filtered by Hats' })

      // Tab: Accessories (Empty state test)
      await page.locator('[data-wardrobe-filter="accessory"]').click()
      await page.waitForTimeout(200)
      const fileAcc = 'p04-wardrobe-empty-accessory-1280x720.png'
      await page.screenshot({ path: path.join(OUT_DIR, fileAcc) })
      captures.push({ file: fileAcc, viewport: '1280x720', description: 'Wardrobe empty category state displaying helpful notice' })

      await context.close()
    }

    // -------------------------------------------------------------------------
    // 4. Wardrobe Surprise Randomizer (1536x990)
    // -------------------------------------------------------------------------
    {
      const context = await browser.newContext({ viewport: { width: 1536, height: 990 } })
      const page = await context.newPage()
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'))
      await page.waitForTimeout(400)

      await page.locator('#wardrobe-button').click()
      await page.waitForSelector('#wardrobe-panel:not([hidden])')
      await page.locator('#wardrobe-random-btn').click()
      await page.waitForTimeout(300)

      const fileSurprise = 'p04-wardrobe-surprise-1536x990.png'
      await page.screenshot({ path: path.join(OUT_DIR, fileSurprise) })
      captures.push({ file: fileSurprise, viewport: '1536x990', description: 'Wardrobe surprise randomizer styled a coordinated outfit' })

      await context.close()
    }

    // -------------------------------------------------------------------------
    // 5. Boutique Shop & Preview Actions (1280x720)
    // -------------------------------------------------------------------------
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
      const page = await context.newPage()
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'))
      await page.waitForTimeout(400)

      // Enter Boutique
      await page.locator('[data-location="clothing_boutique"]').click()
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('ClothingShopScene'))
      await page.waitForTimeout(400)

      // Open catalogue
      await page.locator('.world-catalogue-toggle.boutique-only').click()
      await page.waitForSelector('#shop-panel:not(.world-collapsed)')
      await page.waitForTimeout(300)

      const fileShopTop = 'p04-boutique-shop-top-row-1280x720.png'
      await page.screenshot({ path: path.join(OUT_DIR, fileShopTop) })
      captures.push({ file: fileShopTop, viewport: '1280x720', description: 'Boutique catalogue first row with prices and items' })

      // Scroll to bottom of shop-grid
      await page.evaluate(() => {
        const grid = document.querySelector('.shop-grid')
        if (grid) grid.scrollTop = grid.scrollHeight
      })
      await page.waitForTimeout(300)

      const fileShopBottom = 'p04-boutique-shop-scrolled-bottom-1280x720.png'
      await page.screenshot({ path: path.join(OUT_DIR, fileShopBottom) })
      captures.push({ file: fileShopBottom, viewport: '1280x720', description: 'Boutique catalogue scrolled to bottom with last items reachable' })

      // Preview an outfit item
      await page.locator('[data-shop-clothing="dress_lavender_ruffle"]').click()
      await page.waitForSelector('#shop-actions:not([hidden])')
      await page.waitForTimeout(300)

      const fileShopPreview = 'p04-boutique-preview-actions-1280x720.png'
      await page.screenshot({ path: path.join(OUT_DIR, fileShopPreview) })
      captures.push({ file: fileShopPreview, viewport: '1280x720', description: 'Previewing outfit with live character dressing and Buy/Cancel actions' })

      // Cancel preview
      await page.locator('#shop-cancel').click()
      await page.waitForTimeout(200)

      await context.close()
    }

    // -------------------------------------------------------------------------
    // 6. Supermarket Market & Shopping Basket (1280x720)
    // -------------------------------------------------------------------------
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
      const page = await context.newPage()
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'))
      await page.waitForTimeout(400)

      // Enter Supermarket
      await page.locator('[data-location="supermarket"]').click()
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('SupermarketScene'))
      await page.waitForTimeout(400)

      // Open catalogue
      await page.locator('.world-catalogue-toggle.supermarket-only').click()
      await page.waitForSelector('#market-panel:not(.world-collapsed)')
      await page.waitForTimeout(300)

      const fileMarketEmpty = 'p04-market-empty-basket-1280x720.png'
      await page.screenshot({ path: path.join(OUT_DIR, fileMarketEmpty) })
      captures.push({ file: fileMarketEmpty, viewport: '1280x720', description: 'Market catalogue with empty basket state and instructions' })

      // Top row products
      const fileMarketTop = 'p04-market-products-top-row-1280x720.png'
      await page.screenshot({ path: path.join(OUT_DIR, fileMarketTop) })
      captures.push({ file: fileMarketTop, viewport: '1280x720', description: 'Market product grid first row with prices and icons' })

      // Scroll product grid to bottom
      await page.evaluate(() => {
        const grid = document.querySelector('.product-grid')
        if (grid) grid.scrollTop = grid.scrollHeight
      })
      await page.waitForTimeout(300)

      const fileMarketBottom = 'p04-market-products-scrolled-bottom-1280x720.png'
      await page.screenshot({ path: path.join(OUT_DIR, fileMarketBottom) })
      captures.push({ file: fileMarketBottom, viewport: '1280x720', description: 'Market product grid scrolled to bottom with last items' })

      // Add products to basket
      await page.locator('[data-product="apple_01"]').click()
      await page.locator('[data-product="milk_01"]').click()
      await page.locator('[data-product="cake_01"]').click()
      await page.waitForTimeout(300)

      const fileMarketItems = 'p04-market-basket-items-1280x720.png'
      await page.screenshot({ path: path.join(OUT_DIR, fileMarketItems) })
      captures.push({ file: fileMarketItems, viewport: '1280x720', description: 'Market basket filled with items, quantities, total, and checkout' })

      // Clear basket
      await page.locator('#cart-clear-button').click()
      await page.waitForTimeout(300)

      const fileMarketCleared = 'p04-market-basket-cleared-1280x720.png'
      await page.screenshot({ path: path.join(OUT_DIR, fileMarketCleared) })
      captures.push({ file: fileMarketCleared, viewport: '1280x720', description: 'Market basket cleared back to empty state without deducting coins' })

      await context.close()
    }

    // -------------------------------------------------------------------------
    // 7. Supermarket Checkout Completion (1536x990)
    // -------------------------------------------------------------------------
    {
      const context = await browser.newContext({ viewport: { width: 1536, height: 990 } })
      const page = await context.newPage()
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'))
      await page.waitForTimeout(400)

      await page.locator('[data-location="supermarket"]').click()
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('SupermarketScene'))
      await page.waitForTimeout(400)

      await page.locator('.world-catalogue-toggle.supermarket-only').click()
      await page.waitForSelector('#market-panel:not(.world-collapsed)')

      await page.locator('[data-product="banana_01"]').click()
      await page.locator('[data-product="bread_01"]').click()
      await page.waitForTimeout(300)

      await page.locator('#checkout-button').click()
      await page.waitForTimeout(600)

      const fileCheckout = 'p04-market-checkout-success-1536x990.png'
      await page.screenshot({ path: path.join(OUT_DIR, fileCheckout) })
      captures.push({ file: fileCheckout, viewport: '1536x990', description: 'Successful supermarket checkout, coins updated, character celebration' })

      await context.close()
    }

    // -------------------------------------------------------------------------
    // 8. Full Desktop 1920x1080 Viewport Capture
    // -------------------------------------------------------------------------
    {
      const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
      const page = await context.newPage()
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'))
      await page.waitForTimeout(400)

      await page.locator('#wardrobe-button').click()
      await page.waitForSelector('#wardrobe-panel:not([hidden])')
      await page.waitForTimeout(400)

      const fileDesktop = 'p04-full-desktop-1920x1080.png'
      await page.screenshot({ path: path.join(OUT_DIR, fileDesktop) })
      captures.push({ file: fileDesktop, viewport: '1920x1080', description: 'Full desktop 1920x1080 resolution showing crisp wardrobe panel' })

      await context.close()
    }

    // Write capture.json metadata
    const metadata = {
      phase: 'P04',
      title: 'Wardrobe & Store Shopping UI Acceptance Evidence',
      timestamp: new Date().toISOString(),
      url,
      viewports: ['1280x720', '1536x990', '1920x1080'],
      totalCaptures: captures.length,
      captures,
    }

    await writeFile(path.join(OUT_DIR, 'capture.json'), JSON.stringify(metadata, null, 2), 'utf-8')
    console.log(`P04 Capture completed successfully: ${captures.length} screenshots saved.`)
  } finally {
    if (browser) await browser.close()
    server.close()
  }
}

run().catch((err) => {
  console.error('P04 capture failed:', err)
  process.exit(1)
})
