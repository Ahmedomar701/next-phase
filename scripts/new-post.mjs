#!/usr/bin/env node
// Usage: npm run new -- "Title Of The Entry"
import fs from 'node:fs';
import path from 'node:path';

const title = process.argv.slice(2).join(' ').trim();

if (!title) {
  console.error('usage: npm run new -- "Title Of The Entry"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/['’]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const file = path.join(process.cwd(), 'content', `${slug}.md`);

if (fs.existsSync(file)) {
  console.error(`content/${slug}.md already exists`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);

fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(
  file,
  `---
title: ${title}
date: ${today}
abstract: >-
  One or two sentences describing the argument. Shown on the index, in the
  feed, and above the entry itself.
tags: []
draft: true
---

Opening paragraph.

## First section

Body text.
`,
);

console.log(`content/${slug}.md\n/writing/${slug}/`);
