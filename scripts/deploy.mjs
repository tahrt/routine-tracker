/**
 * Publishes dist/ to the gh-pages branch.
 *
 * dist/ is gitignored in the main repo, so it gets its own throwaway repo and a
 * force-push — gh-pages holds only the built site, never source history.
 * Run: npm run deploy
 */

import { execFileSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(ROOT, 'dist');

const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, { cwd, stdio: 'pipe', encoding: 'utf8' }).trim();

if (!existsSync(DIST)) {
  console.error('dist/ is missing — run npm run build first.');
  process.exit(1);
}

const remote = run('git', ['remote', 'get-url', 'origin'], ROOT);
const message = `deploy ${run('git', ['rev-parse', '--short', 'HEAD'], ROOT)}`;

rmSync(resolve(DIST, '.git'), { recursive: true, force: true });
run('git', ['init', '-q', '-b', 'gh-pages'], DIST);
run('git', ['add', '-A'], DIST);
run('git', ['commit', '-q', '-m', message], DIST);
run('git', ['push', '-q', '--force', remote, 'gh-pages:gh-pages'], DIST);
rmSync(resolve(DIST, '.git'), { recursive: true, force: true });

console.log(`published dist/ to gh-pages (${message})`);
