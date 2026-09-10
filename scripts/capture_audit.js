import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const mode = process.argv[2] || 'before'; // 'before' or 'after'
const baseUrl = 'http://localhost:5173';

const targets = [
  { id: '01_town', teleport: 'TownScene' },
  { id: '02_home_bedroom', teleport: 'HomeScene', room: 0 },
  { id: '03_home_living', teleport: 'HomeScene', room: 1 },
  { id: '04_home_kitchen', teleport: 'HomeScene', room: 2 },
  { id: '05_clothing_boutique', teleport: 'ClothingShopScene' },
  { id: '06_supermarket', teleport: 'SupermarketScene' },
  { id: '07_pet_shop', teleport: 'PetShopScene' },
  { id: '08_park', teleport: 'ParkScene' },
  { id: '09_cafe', teleport: 'CafeScene' },
  { id: '10_salon', teleport: 'SalonScene' },
  { id: '11_toy_shop', teleport: 'ToyShopScene' },
  { id: '12_school', teleport: 'SchoolScene' },
  { id: '13_ui_inventory', teleport: 'HomeScene', action: 'inventory' },
  { id: '14_ui_wardrobe', teleport: 'HomeScene', action: 'wardrobe' },
  { id: '15_ui_character_creator', teleport: 'HomeScene', action: 'creator' },
  { id: '16_ui_brain_games', teleport: 'TownScene', action: 'brain' },
  { id: '17_ui_clues_journal', teleport: 'TownScene', action: 'clues' },
  { id: '18_ui_supermarket_cart', teleport: 'SupermarketScene', action: 'cart' },
];

const viewports = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'mobile', width: 844, height: 390 },
];

async function capture() {
  const browser = await chromium.launch({ headless: true });

  for (const vp of viewports) {
    console.log(`Starting capture for ${vp.name} (${vp.width}x${vp.height})...`);
    const dir = path.join(process.cwd(), 'art-audit', mode, vp.name);
    fs.mkdirSync(dir, { recursive: true });

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    // Navigate to page
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000); // allow Phaser boot & preload

    for (const target of targets) {
      console.log(`  Capturing [${vp.name}] ${target.id}...`);

      // Ensure dev panel open if needed, or click teleport
      await page.evaluate((teleportKey) => {
        const btn = document.querySelector(`[data-teleport="${teleportKey}"]`);
        if (btn) btn.click();
      }, target.teleport);

      await page.waitForTimeout(600); // transition fade

      // Room navigation if specified
      if (typeof target.room === 'number') {
        await page.evaluate((roomIndex) => {
          const roomBtn = document.querySelector(`[data-room="${roomIndex}"]`);
          if (roomBtn) roomBtn.click();
        }, target.room);
        await page.waitForTimeout(500);
      }

      // Action triggers
      if (target.action === 'inventory') {
        await page.evaluate(() => {
          const btn = document.querySelector('#inventory-button');
          if (btn) btn.click();
        });
        await page.waitForTimeout(400);
      } else if (target.action === 'wardrobe') {
        await page.evaluate(() => {
          const btn = document.querySelector('#wardrobe-button');
          if (btn) btn.click();
        });
        await page.waitForTimeout(400);
      } else if (target.action === 'creator') {
        await page.evaluate(() => {
          const btn = document.querySelector('#creator-button');
          if (btn) btn.click();
        });
        await page.waitForTimeout(400);
      } else if (target.action === 'brain') {
        await page.evaluate(() => {
          const btn = document.querySelector('#brain-button');
          if (btn) btn.click();
        });
        await page.waitForTimeout(400);
      } else if (target.action === 'clues') {
        await page.evaluate(() => {
          const btn = document.querySelector('#clues-button');
          if (btn) btn.click();
        });
        await page.waitForTimeout(400);
      } else if (target.action === 'cart') {
        await page.evaluate(() => {
          const btn = document.querySelector('#cart-toggle');
          if (btn) btn.click();
        });
        await page.waitForTimeout(400);
      }

      const filePath = path.join(dir, `${target.id}.png`);
      await page.screenshot({ path: filePath });

      // Close modal / drawer if opened to avoid obstructing next views
      await page.evaluate(() => {
        const closeModals = document.querySelectorAll('.modal-close, #wardrobe-close, .character-creator-modal .close-btn');
        closeModals.forEach(b => b.click());
        const invPanel = document.querySelector('#inventory-panel');
        if (invPanel && !invPanel.hasAttribute('hidden')) {
          const btn = document.querySelector('#inventory-button');
          if (btn) btn.click();
        }
      });
      await page.waitForTimeout(200);
    }

    await context.close();
  }

  await browser.close();
  console.log(`Captured all ${mode} screenshots successfully!`);
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
