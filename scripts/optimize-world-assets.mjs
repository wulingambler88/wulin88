// Lossy WebP packaging only; original generated PNG masters are preserved.
import { chromium } from 'playwright'
import { readFile, writeFile } from 'node:fs/promises'
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage()
  for (const name of ['buildings', 'furniture', 'terrain', 'rooms']) {
    const png = await readFile(`public/art/world/${name}-v1.png`)
    const webp = await page.evaluate(async data => {
      const img = new Image(); img.src = 'data:image/png;base64,' + data
      await img.decode()
      const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height
      canvas.getContext('2d').drawImage(img, 0, 0)
      return canvas.toDataURL('image/webp', .9).split(',')[1]
    }, png.toString('base64'))
    const bytes = Buffer.from(webp, 'base64')
    await writeFile(`public/art/world/${name}-v1.webp`, bytes)
    console.log(`${name}: ${png.length} → ${bytes.length} bytes`)
  }
} finally { await browser.close() }
