import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
await page.goto('http://127.0.0.1:5180/', { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'), { timeout: 15000 });
await page.evaluate(() => {
  const game = window.__PHASER_GAME__;
  const active = game.scene.getScenes(true)[0];
  active.scene.start('HomeScene');
});
await page.waitForTimeout(1000);
await page.screenshot({ path: 'character-audit/10_bedroom.png' });

await page.click('[data-room="1"]');
await page.waitForTimeout(800);
await page.screenshot({ path: 'character-audit/11_living_room.png' });

await page.click('[data-room="2"]');
await page.waitForTimeout(800);
await page.screenshot({ path: 'character-audit/12_kitchen.png' });

await browser.close();
console.log('Saved room screenshots!');
