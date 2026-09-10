import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0)
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeB = Buffer.from(type, 'ascii')
  const crcData = Buffer.concat([typeB, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(crcData), 0)
  return Buffer.concat([len, typeB, data, crc])
}

function createPNG(width, height) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 2   // color type: truecolor RGB
  ihdr[10] = 0  // compression method
  ihdr[11] = 0  // filter method
  ihdr[12] = 0  // no interlace

  // Draw: pink (#ff8fc4) background, white circle center, gold star overlay
  const rawData = Buffer.alloc(height * (1 + width * 3))
  const cx = width / 2
  const cy = height / 2
  const outerR = width * 0.38
  const innerR = width * 0.18

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 3)
    rawData[rowOffset] = 0 // filter: none
    for (let x = 0; x < width; x++) {
      const px = rowOffset + 1 + x * 3
      const dx = x - cx
      const dy = y - cy
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist <= innerR) {
        // Gold star center (#ffd96f)
        rawData[px] = 0xff; rawData[px + 1] = 0xd9; rawData[px + 2] = 0x6f
      } else if (dist <= outerR) {
        // White ring
        rawData[px] = 0xff; rawData[px + 1] = 0xff; rawData[px + 2] = 0xff
      } else {
        // Pink background (#ff8fc4)
        rawData[px] = 0xff; rawData[px + 1] = 0x8f; rawData[px + 2] = 0xc4
      }
    }
  }

  const compressed = deflateSync(rawData, { level: 9 })
  const ihdrChunk = chunk('IHDR', ihdr)
  const idatChunk = chunk('IDAT', compressed)
  const iendChunk = chunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

writeFileSync(join(publicDir, 'icon-192.png'), createPNG(192, 192))
writeFileSync(join(publicDir, 'icon-512.png'), createPNG(512, 512))
console.log('✅ Generated public/icon-192.png and public/icon-512.png')
