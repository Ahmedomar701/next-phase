import type { PostMeta } from './posts';
import { absoluteUrl, site } from './site';

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function citationKey(post: PostMeta): string {
  const surname = site.name.split(/\s+/).pop()?.toLowerCase().replace(/[^a-z]/g, '') || 'author';
  const year = post.date.slice(0, 4);
  const stem = post.slug.split('-').slice(0, 2).join('');
  return `${surname}${year}${stem}`;
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
