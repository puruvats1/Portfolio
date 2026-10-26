import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crc]);
}

function createPng(width, height, rgbaBuffer) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdr);

  const scanlines = [];
  for (let y = 0; y < height; y++) {
    scanlines.push(Buffer.from([0])); // filter byte None
    scanlines.push(rgbaBuffer.subarray(y * width * 4, (y + 1) * width * 4));
  }
  const rawData = Buffer.concat(scanlines);
  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

function createIco(pngBuffers) {
  // pngBuffers: array of { width, height, data }
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(count, 4); // count

  let offset = 6 + count * 16;
  const dirEntries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry[0] = item.width >= 256 ? 0 : item.width;
    entry[1] = item.height >= 256 ? 0 : item.height;
    entry[2] = 0; // color palette
    entry[3] = 0; // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(item.data.length, 8); // image size in bytes
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);
    offset += item.data.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map(b => b.data)]);
}

// Distance to rounded rectangle
function sdRoundedBox(px, py, bx, by, r) {
  const qx = Math.abs(px) - bx + r;
  const qy = Math.abs(py) - by + r;
  return Math.min(Math.max(qx, qy), 0.0) + Math.hypot(Math.max(qx, 0.0), Math.max(qy, 0.0)) - r;
}

// Render icon at size N with 8x8 supersampling
function renderIcon(size) {
  const buffer = Buffer.alloc(size * size * 4);
  const ssaa = 4; // 4x4 supersampling per pixel
  const invSsaa2 = 1.0 / (ssaa * ssaa);

  // Normalized coordinate space [0, 64] x [0, 64]
  // Squircle parameters in 64x64 space:
  const boxW = 29; // half-width (total width 58)
  const boxH = 29; // half-height (total height 58)
  const boxR = 15; // corner radius

  // Monogram transform in 64x64 space:
  const scale = 1.48;
  const transX = 16.5;
  const transY = 14.5;

  // Geometry in glyph local space:
  // Stem: x in [0, 3.625], y in [0.42, 22.71]
  // Bowl outer: center (7.90, 7.86), R = 7.83
  // Bowl inner: center (7.86, 7.85), Rx = 4.18, Ry = 4.33
  // Dot: center (19.10, 13.80), R = 1.85

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let rAcc = 0, gAcc = 0, bAcc = 0, aAcc = 0;

      for (let sy = 0; sy < ssaa; sy++) {
        for (let sx = 0; sx < ssaa; sx++) {
          const sampleX = ((x + (sx + 0.5) / ssaa) / size) * 64;
          const sampleY = ((y + (sy + 0.5) / ssaa) / size) * 64;

          // Squircle distance (center is at 32, 32)
          const sqDist = sdRoundedBox(sampleX - 32, sampleY - 32, boxW, boxH, boxR);

          if (sqDist > 0.5) {
            // Outside tile
            continue;
          }

          // Squircle fill gradient: top #262624 to bottom #141413
          const t = Math.max(0, Math.min(1, (sampleY - 3) / 58));
          let bgR = 38 * (1 - t) + 20 * t;
          let bgG = 38 * (1 - t) + 20 * t;
          let bgB = 36 * (1 - t) + 19 * t;

          // Subtle squircle border highlight
          if (sqDist > -1.2) {
            const edgeT = (sqDist + 1.2) / 1.2;
            bgR = bgR * (1 - edgeT * 0.4) + 60 * (edgeT * 0.4);
            bgG = bgG * (1 - edgeT * 0.4) + 60 * (edgeT * 0.4);
            bgB = bgB * (1 - edgeT * 0.4) + 55 * (edgeT * 0.4);
          }

          // Squircle alpha antialiasing
          let tileAlpha = 1.0;
          if (sqDist > -0.5) {
            tileAlpha = Math.max(0, Math.min(1, 0.5 - sqDist));
          }

          // Check glyph: transform sample to glyph space
          const gx = (sampleX - transX) / scale;
          const gy = (sampleY - transY) / scale;

          let isP = false;
          let isDot = false;

          // Stem
          if (gx >= 0 && gx <= 3.625 && gy >= 0.42 && gy <= 22.71) {
            isP = true;
          }

          // Bowl
          const bowlDx = gx - 7.90;
          const bowlDy = gy - 7.86;
          const bowlDistSq = bowlDx * bowlDx + bowlDy * bowlDy;
          if (bowlDistSq <= 7.83 * 7.83 && gx >= 3.0) {
            // Check hole
            const holeDx = (gx - 7.86) / 4.18;
            const holeDy = (gy - 7.85) / 4.33;
            if (holeDx * holeDx + holeDy * holeDy > 1.0) {
              isP = true;
            }
          }

          // Dot
          const dotDx = gx - 19.10;
          const dotDy = gy - 13.80;
          if (dotDx * dotDx + dotDy * dotDy <= 1.85 * 1.85) {
            isDot = true;
          }

          let finalR = bgR;
          let finalG = bgG;
          let finalB = bgB;
          let finalA = tileAlpha;

          if (isDot) {
            // Dot color: warm amber/gold (#FCD34D to #F59E0B)
            finalR = 251;
            finalG = 191;
            finalB = 36;
          } else if (isP) {
            // 'p' letter: crisp clean white/off-white (#FFFFFF)
            finalR = 250;
            finalG = 250;
            finalB = 248;
          }

          rAcc += finalR * finalA;
          gAcc += finalG * finalA;
          bAcc += finalB * finalA;
          aAcc += finalA;
        }
      }

      const pixelIdx = (y * size + x) * 4;
      const alphaVal = aAcc * invSsaa2;
      if (alphaVal > 0) {
        buffer[pixelIdx + 0] = Math.round((rAcc * invSsaa2) / (alphaVal > 0.001 ? alphaVal : 1));
        buffer[pixelIdx + 1] = Math.round((gAcc * invSsaa2) / (alphaVal > 0.001 ? alphaVal : 1));
        buffer[pixelIdx + 2] = Math.round((bAcc * invSsaa2) / (alphaVal > 0.001 ? alphaVal : 1));
        buffer[pixelIdx + 3] = Math.round(alphaVal * 255);
      } else {
        buffer[pixelIdx + 0] = 0;
        buffer[pixelIdx + 1] = 0;
        buffer[pixelIdx + 2] = 0;
        buffer[pixelIdx + 3] = 0;
      }
    }
  }

  return buffer;
}

const publicDir = path.resolve('public');

console.log('Generating favicon raster assets in', publicDir);

const png16Buf = renderIcon(16);
const png16 = createPng(16, 16, png16Buf);
fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);
console.log('Created favicon-16x16.png');

const png32Buf = renderIcon(32);
const png32 = createPng(32, 32, png32Buf);
fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
console.log('Created favicon-32x32.png');

const png180Buf = renderIcon(180);
const png180 = createPng(180, 180, png180Buf);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
console.log('Created apple-touch-icon.png');

const ico = createIco([
  { width: 16, height: 16, data: png16 },
  { width: 32, height: 32, data: png32 }
]);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);
console.log('Created favicon.ico');

console.log('All favicon assets generated successfully!');
