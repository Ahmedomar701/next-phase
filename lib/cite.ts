import type { PostMeta } from './posts';
import { absoluteUrl, site } from './site';

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const STOP_WORDS = new Set(['a', 'an', 'the', 'of', 'on', 'in', 'and', 'for', 'to']);

function citationKey(post: PostMeta): string {
  const surname = site.name.split(/\s+/).pop()?.toLowerCase().replace(/[^a-z]/g, '') || 'author';
  const stem = post.slug
    .split('-')
    .filter((word) => !STOP_WORDS.has(word))
    .slice(0, 2)
    .join('');
  return `${surname}${post.date.slice(0, 4)}${stem}`;
}

export function bibtex(post: PostMeta): string {
  const month = MONTHS[Number(post.date.slice(5, 7)) - 1];
  return [
    `@misc{${citationKey(post)},`,
    `  author = {${site.name}},`,
    `  title  = {${post.title}},`,
    `  year   = {${post.date.slice(0, 4)}},`,
    `  month  = {${month}},`,
    `  url    = {${absoluteUrl(`/writing/${post.slug}/`)}}`,
    '}',
  ].join('\n');
}
