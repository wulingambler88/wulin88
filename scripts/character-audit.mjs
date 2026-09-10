import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('character-audit');
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const targets = [
  ['01_town_residents', 'TownScene'],
  ['02_bedroom_hero', 'HomeScene', 0],
  ['03_boutique_clara', 'ClothingShopScene'],
  ['04_market_oliver', 'SupermarketScene'],
  ['05_petshop_daisy', 'PetShopScene'],
  ['06_cafe_leo', 'CafeScene'],
  ['07_salon_maya', 'SalonScene'],
  ['08_toyshop_toby', 'ToyShopScene'],
];

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to game...');
  await page.goto('http://127.0.0.1:5180/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'), { timeout: 15000 });
  console.log('TownScene active!');

  for (const [id, sceneKey, room] of targets) {
    console.log(`Transitioning to ${sceneKey} (${id})...`);
    await page.evaluate(key => {
      const game = window.__PHASER_GAME__;
      const active = game.scene.getScenes(true)[0];
      if (active && active.scene.key !== key) {
        active.scene.start(key);
      }
    }, sceneKey);

    await page.waitForFunction(key => window.__PHASER_GAME__.scene.isActive(key), sceneKey, { timeout: 10000 });
    
    if (room !== undefined) {
      const roomBtn = page.locator(`[data-room="${room}"]`);
      if (await roomBtn.count() > 0) {
        await roomBtn.click();
      }
    }
    
    await page.waitForTimeout(1000);
    const savePath = path.join(outDir, `${id}.png`);
    await page.screenshot({ path: savePath });
    console.log(`Saved screenshot: ${savePath}`);
  }
} catch (err) {
  console.error('Audit failed:', err);
} finally {
  await browser.close();
}
