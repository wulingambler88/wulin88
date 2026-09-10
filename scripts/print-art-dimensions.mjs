// Prints the native pixel dimensions of every art asset in public/art.
// Usage: node scripts/print-art-dimensions.mjs   (run from the project root)
import fs from 'node:fs'
import path from 'node:path'

const base = path.join(process.cwd(), 'public', 'art')

function webpDims(buf) {
  let o = 12
  while (o + 8 <= buf.length) {
    const type = buf.toString('latin1', o, o + 4)
    const size = buf.readUInt32LE(o + 4)
    if (type === 'VP8X') {
      const w = 1 + buf.readUInt8(o + 12) + (buf.readUInt8(o + 13) << 8) + (buf.readUInt8(o + 14) << 16)
      const h = 1 + buf.readUInt8(o + 15) + (buf.readUInt8(o + 16) << 8) + (buf.readUInt8(o + 17) << 16)
      return [w, h]
    }
    if (type === 'VP8L') {
      const x = buf.readUInt32LE(o + 9)
      return [(x & 16383) + 1, ((x >>> 14) & 16383) + 1]
    }
    if (type === 'VP8 ') {
      return [buf.readUInt16LE(o + 14) & 16383, buf.readUInt16LE(o + 16) & 16383]
    }
    o += 8 + size + (size & 1)
  }
  return [0, 0]
}

function pngDims(buf) {
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)]
}

for (const sub of ['characters', 'world', 'clothing']) {
  const dir = path.join(base, sub)
  if (!fs.existsSync(dir)) {
    console.log(sub + '/ (missing)')
    continue
  }
  for (const f of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, f)
    const buf = fs.readFileSync(p)
    let dims = null
    if (f.endsWith('.webp')) dims = webpDims(buf)
    else if (f.endsWith('.png')) dims = pngDims(buf)
    if (dims) console.log(sub + '/' + f + ' ' + dims[0] + 'x' + dims[1] + ' (' + buf.length + ' bytes)')
  }
}
