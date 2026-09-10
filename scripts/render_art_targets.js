import { chromium } from 'playwright';
import path from 'path';
import { pathToFileURL } from 'url';

const files = [
  '01_ART_DIRECTION_BOARD',
  '02_UI_DESIGN_TARGET',
  '03_CHARACTER_STYLE_TARGET',
  '04_ENVIRONMENT_STYLE_TARGET',
  '05_ANIMATION_LANGUAGE',
];

async function render() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 800 },
    deviceScaleFactor: 2, // crisp 2x retina PNG
  });

  const targetDir = path.join(process.cwd(), 'docs', 'art-target');

  for (const name of files) {
    const svgPath = path.join(targetDir, `${name}.svg`);
    const pngPath = path.join(targetDir, `${name}.png`);
    console.log(`Rendering ${name}.svg -> ${name}.png...`);

    const fileUrl = pathToFileURL(svgPath).href;
    await page.goto(fileUrl, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    await page.screenshot({ path: pngPath, clip: { x: 0, y: 0, width: 1200, height: 800 } });
  }

  await browser.close();
  console.log('All 5 art target PNGs rendered successfully!');
}

render().catch(err => {
  console.error('Render error:', err);
  process.exit(1);
});
