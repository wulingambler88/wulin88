import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
await page.goto('http://127.0.0.1:5180/', { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__PHASER_GAME__?.scene.isActive('TownScene'), { timeout: 15000 });

// Switch to HomeScene
await page.evaluate(() => {
  const game = window.__PHASER_GAME__;
  const active = game.scene.getScenes(true)[0];
  active.scene.start('HomeScene');
});
await page.waitForTimeout(1000);

// 1. Toggle Bedroom Lamp
console.log('Testing Lamp interaction...');
await page.evaluate(() => {
  const home = window.__PHASER_GAME__.scene.getScene('HomeScene');
  const lamp = home.furnitureManager.all().find((f) => f.definition.type === 'lamp');
  lamp?.interact();
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'character-audit/13_lamp_on.png' });

// 2. Switch to Living Room and Toggle Retro TV
console.log('Testing TV interaction...');
await page.click('[data-room="1"]');
await page.waitForTimeout(600);
await page.evaluate(() => {
  const home = window.__PHASER_GAME__.scene.getScene('HomeScene');
  const tv = home.furnitureManager.all().find((f) => f.definition.type === 'tv');
  tv?.interact();
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'character-audit/14_tv_channel.png' });

// 3. Switch to Kitchen and Toggle Fridge & Sink
console.log('Testing Fridge and Sink interaction...');
await page.click('[data-room="2"]');
await page.waitForTimeout(600);
await page.evaluate(() => {
  const home = window.__PHASER_GAME__.scene.getScene('HomeScene');
  home.interactiveFridge?.toggleFridge();
  home.interactiveSink?.toggleFaucet();
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'character-audit/15_kitchen_interactive.png' });

// Extra pause to capture water stream frames
await page.waitForTimeout(300);
await page.screenshot({ path: 'character-audit/16_sink_water.png' });

await browser.close();
console.log('Interactive verification complete!');
