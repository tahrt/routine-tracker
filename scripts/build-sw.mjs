/**
 * Stamp the production service worker with a unique build id and the exact
 * hashed assets produced by Vite.
 *
 * Vite copies public/sw.js into dist/ unchanged. This post-build step modifies
 * only dist/sw.js, so source stays clean while every deployment gets a distinct
 * worker and a complete offline shell.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(ROOT, 'dist');
const DIST_SW = resolve(DIST, 'sw.js');
const VERSION_PLACEHOLDER = '__BUILD_VERSION__';
const ASSETS_PLACEHOLDER = '__CORE_ASSETS__';

const git = (args) => {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return 'nogit';
  }
};

const walkFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(dir, entry.name);
    return entry.isDirectory() ? walkFiles(path) : [path];
  });

const sha = git(['rev-parse', '--short=12', 'HEAD']);
const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const buildVersion = `${sha}-${stamp}`;

const viteAssets = walkFiles(resolve(DIST, 'assets'))
  .filter((path) => !path.endsWith('.map'))
  .map((path) => `./${relative(DIST, path).split(sep).join('/')}`)
  .sort();

const coreAssets = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  ...viteAssets,
];

let source = readFileSync(DIST_SW, 'utf8');
if (!source.includes(VERSION_PLACEHOLDER) || !source.includes(ASSETS_PLACEHOLDER)) {
  throw new Error('dist/sw.js is missing build placeholders; refusing to publish an incomplete service worker.');
}

source = source.replaceAll(VERSION_PLACEHOLDER, buildVersion);
source = source.replace(ASSETS_PLACEHOLDER, JSON.stringify(coreAssets));
writeFileSync(DIST_SW, source);

console.log(`service worker build: ${buildVersion} · ${coreAssets.length} precached files`);
