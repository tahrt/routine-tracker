/**
 * Generates the PWA icons with no image dependencies — a small skyline mark
 * matching the Week view. Run: npm run icons
 */

import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../public/icons');

const BG = [0x0b, 0x12, 0x20];
const DIM = [0x4a, 0x3a, 0x1c];
const AMBER = [0xf0, 0xa9, 0x3c];
const TEAL = [0x2f, 0xbf, 0xa0];

const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};

const png = (size, pixels) => {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y += 1) {
    raw[y * (size * 4 + 1)] = 0; // filter: none
    pixels.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
};

const draw = (size, padRatio) => {
  const px = Buffer.alloc(size * size * 4);
  const put = (x, y, [r, g, b]) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    px[i] = r;
    px[i + 1] = g;
    px[i + 2] = b;
    px[i + 3] = 255;
  };
  const rect = (x0, y0, w, h, color, radius = 0) => {
    for (let y = y0; y < y0 + h; y += 1) {
      for (let x = x0; x < x0 + w; x += 1) {
        if (radius > 0) {
          const dx = Math.min(x - x0, x0 + w - 1 - x);
          const dy = Math.min(y - y0, y0 + h - 1 - y);
          if (dx < radius && dy < radius) {
            const d = Math.hypot(radius - dx, radius - dy);
            if (d > radius) continue;
          }
        }
        put(x, y, color);
      }
    }
  };

  rect(0, 0, size, size, BG);

  // Four bars of rising height; the tallest is "done" teal, the shortest dim.
  const pad = Math.round(size * padRatio);
  const inner = size - pad * 2;
  const gap = Math.round(inner * 0.07);
  const barW = Math.round((inner - gap * 3) / 4);
  const heights = [0.42, 0.62, 0.82, 1.0];
  const colors = [DIM, AMBER, AMBER, TEAL];
  const radius = Math.max(2, Math.round(barW * 0.28));

  heights.forEach((hr, i) => {
    const h = Math.round(inner * hr);
    const x = pad + i * (barW + gap);
    rect(x, pad + inner - h, barW, h, colors[i], radius);
  });

  return px;
};

mkdirSync(OUT_DIR, { recursive: true });

const targets = [
  ['icon-192.png', 192, 0.18],
  ['icon-512.png', 512, 0.18],
  ['icon-maskable-512.png', 512, 0.26], // extra padding for the maskable safe zone
];

for (const [name, size, pad] of targets) {
  writeFileSync(resolve(OUT_DIR, name), png(size, draw(size, pad)));
  console.log(`wrote public/icons/${name} (${size}×${size})`);
}
