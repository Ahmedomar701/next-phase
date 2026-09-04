import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { countWords, renderMarkdown, type Heading } from './markdown';
import { site } from './site';

export const CONTENT_DIR = path.join(process.cwd(), 'content');

export type PostMeta = {
  /** Filename without extension; also the URL segment. */
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  updated?: string;
  abstract: string;
  tags: string[];
  draft: boolean;
  words: number;
  minutes: number;
  /** Stable serial number: 001 is the oldest entry. */
  serial: number;
};

export type Post = PostMeta & {
  html: string;
  headings: Heading[];
  markdown: string;
};

function toIsoDate(value: unknown, slug: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.valueOf())) return parsed.toISOString().slice(0, 10);
  }
  throw new Error(`content/${slug}.md is missing a valid \`date\` (expected YYYY-MM-DD).`);
}

function toTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((tag) => String(tag).trim()).filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

function readSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
    .map((file) => file.replace(/\.md$/, ''));
}

let cache: Post[] | null = null;

function loadAll(): Post[] {
  if (cache) return cache;

  const parsed = readSlugs().map((slug) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.md`), 'utf8');
    const { data, content } = matter(raw);
    const words = countWords(content);
    const { html, headings } = renderMarkdown(content);

    return {
      slug,
      title: String(data.title ?? slug).trim(),
      date: toIsoDate(data.date, slug),
      updated: data.updated ? toIsoDate(data.updated, slug) : undefined,
      abstract: String(data.abstract ?? '').trim(),
      tags: toTags(data.tags),
      draft: data.draft === true,
      words,
      minutes: Math.max(1, Math.round(words / site.wpm)),
      serial: 0,
      html,
      headings,
      markdown: content,
    } satisfies Post;
  });

  // Oldest first gets serial 001 so numbers never shift when a post is added.
  const chronological = [...parsed].sort((a, b) =>
    a.date === b.date ? a.slug.localeCompare(b.slug) : a.date.localeCompare(b.date),
  );
  cache = chronological.reverse();
  return cache;
}

const isPublished = (post: Post) => !post.draft || process.env.NODE_ENV === 'development';

/** Newest first. Drafts are visible in `next dev` only. Serials skip drafts. */
export function getPosts(): Post[] {
  const posts = loadAll().filter(isPublished);
  const oldestFirst = [...posts].sort((a, b) =>
    a.date === b.date ? a.slug.localeCompare(b.slug) : a.date.localeCompare(b.date),
  );
  oldestFirst.forEach((post, i) => {
    post.serial = i + 1;
  });
  return posts;
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}

export function getNeighbours(slug: string): { newer?: PostMeta; older?: PostMeta } {
  const posts = getPosts();
  const i = posts.findIndex((post) => post.slug === slug);
  if (i === -1) return {};
  return { newer: posts[i - 1], older: posts[i + 1] };
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatSerial(serial: number): string {
  return String(serial).padStart(3, '0');
}
