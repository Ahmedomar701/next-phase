#!/usr/bin/env node
/**
 * Builds the site and copies it into the repository root, where GitHub Pages
 * serves it directly from `main`. This exists because Pages is configured as
 * "deploy from a branch", which serves committed files as-is and cannot run a
 * build. `.pages-manifest` records what the previous publish put at the root
 * so it can be cleared out before the next one is written.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'out');
const MANIFEST = path.join(ROOT, '.pages-manifest');

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/next-phase';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ahmedomar701.github.io';

// Source paths the publish step must never delete, whatever the manifest says.
const PROTECTED = new Set([
  '.git',
  '.github',
  '.gitignore',
  '.next',
  '.pages-manifest',
  'app',
  'content',
  'lib',
  'next-env.d.ts',
  'next.config.mjs',
  'node_modules',
  'out',
  'package-lock.json',
  'package.json',
  'public',
  'README.md',
  'scripts',
  'tsconfig.json',
  'types',
]);

execFileSync('npx', ['next', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, NEXT_PUBLIC_BASE_PATH: BASE_PATH, NEXT_PUBLIC_SITE_URL: SITE_URL },
});

if (!fs.existsSync(path.join(OUT, 'index.html'))) {
  console.error('publish: out/index.html is missing — the build did not produce a site.');
  process.exit(1);
}

const previous = fs.existsSync(MANIFEST)
  ? fs.readFileSync(MANIFEST, 'utf8').split('\n').filter(Boolean)
  : [];

for (const entry of previous) {
  if (PROTECTED.has(entry) || entry.includes('/') || entry.startsWith('..')) continue;
  fs.rmSync(path.join(ROOT, entry), { recursive: true, force: true });
}

const published = fs.readdirSync(OUT).sort();

for (const entry of published) {
  if (PROTECTED.has(entry)) {
    console.error(`publish: refusing to overwrite the source path "${entry}".`);
    process.exit(1);
  }
  fs.cpSync(path.join(OUT, entry), path.join(ROOT, entry), { recursive: true });
}

fs.writeFileSync(MANIFEST, `${published.join('\n')}\n`);

console.log(`\npublished ${published.length} entries to the repository root`);
console.log(`base path ${BASE_PATH || '(none)'} · site url ${SITE_URL}`);
