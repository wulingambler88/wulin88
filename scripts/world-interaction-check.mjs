import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
const browser = await chromium.launch({ headless: true })
const results = []
try {
  for (const viewport of [{width:1280,height:720},{width:844,height:390},{width:932,height:430},{width:740,height:360}]) {
    const context = await browser.newContext({viewport,hasTouch:true})
    const page = await context.newPage()
    const errors = []; page.on('pageerror', error => errors.push(error.message))
    page.on('dialog', dialog => dialog.accept())
    await page.goto('http://127.0.0.1:5180/',{waitUntil:'networkidle'})
    const scene = key => page.waitForFunction(k => window.__PHASER_GAME__?.scene.isActive(k),key)
    await scene('TownScene')
    await page.locator('#world-today').click()
    const before = Number(await page.locator('#coin-balance').textContent())
    await page.locator('#world-daily-gift').click()
    assert.equal(Number(await page.locator('#coin-balance').textContent()),before+25)
    await page.waitForTimeout(250)
    await page.reload({waitUntil:'networkidle'}); await scene('TownScene')
    await page.locator('#world-today').click()
    assert.equal(await page.locator('#world-daily-gift').isDisabled(),true)
    assert.equal(Number(await page.locator('#coin-balance').textContent()),before+25)
    await page.getByRole('button',{name:'Close daily activities',exact:true}).click()
    await page.waitForTimeout(250)
    // Actual accessible building buttons, not developer teleport.
    for (const [id,key] of [['clothing_boutique','ClothingShopScene'],['supermarket','SupermarketScene'],['pet_shop','PetShopScene'],['school','SchoolScene'],['park','ParkScene'],['cafe','CafeScene'],['salon','SalonScene'],['toy_shop','ToyShopScene'],['home','HomeScene']]) {
      console.log(`  -> Visiting ${id} (${key})...`)
      await page.locator(`[data-location="${id}"]`).click({ force: true })
      await scene(key); await page.waitForTimeout(450)
      if (id === 'clothing_boutique') {
        assert.equal(await page.locator('#shop-panel').isVisible(),false)
        await page.locator('.world-catalogue-toggle.boutique-only').click()
        await page.locator('[data-shop-clothing]').first().click()
        assert.equal(await page.locator('#shop-actions').isVisible(),true)
        await page.locator('#shop-cancel').click()
      }
      if (id === 'supermarket') {
        await page.locator('.world-catalogue-toggle.supermarket-only').click()
        await page.locator('[data-product]').first().click()
        assert.match(await page.locator('#cart-lines').textContent(),/×1/)
      }
      if (id === 'home') {
        for (const room of [0,1,2]) { await page.locator(`[data-room="${room}"]`).click(); await page.waitForTimeout(450) }
        await page.locator('[data-room="0"]').click(); await page.waitForTimeout(450)
        await page.locator('#wardrobe-button').click()
        assert.equal(await page.locator('#wardrobe-panel').isVisible(),true)
        await page.locator('#wardrobe-close').click()
      }
      await page.locator('#map-button').click({ force: true })
      const leaveConfirm = page.locator('[data-confirm-ok]')
      if (await leaveConfirm.isVisible().catch(() => false)) await leaveConfirm.click()
      await scene('TownScene'); await page.waitForTimeout(450)
    }
    assert.deepEqual(errors,[])
    results.push({viewport,passed:['nine building routes and returns','daily gift once after reload','boutique preview/cancel','market basket','three rooms','wardrobe'],errors})
    console.log(`${viewport.width}x${viewport.height}: interaction checks passed`)
    await context.close()
  }
  await mkdir('world-redesign',{recursive:true})
  await writeFile('world-redesign/interaction-checks.json',JSON.stringify(results,null,2))
} finally { await browser.close() }
