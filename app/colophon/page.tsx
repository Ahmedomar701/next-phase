import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts } from '@/lib/posts';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Colophon',
  description: `How ${site.name}'s writing site is built and typeset.`,
  alternates: { canonical: '/colophon/' },
};

export default function Colophon() {
  const posts = getPosts();
  const words = posts.reduce((total, post) => total + post.words, 0);

  return (
    <article>
      <h1 className="page-title">Colophon</h1>

      <div className="prose" style={{ marginTop: 0 }}>
        <p>
          This is a writing site and nothing else. No images, no video, no analytics, no cookie
          banner, no comment section, no newsletter modal. Every page is plain static HTML
          rendered ahead of time; the only JavaScript that ships is a few lines that remember
          whether you prefer the light or dark palette.
        </p>

        <p>
          Each entry is a markdown file in <code>content/</code>. A build reads the frontmatter,
          numbers the entry, counts the words, renders footnotes and figures, and emits a page.
          Adding an essay means adding a file — the index, the feed, the sitemap, and the
          adjacent-entry links follow from that.
        </p>

        <h2>Specification</h2>

        <dl className="spec">
          <dt>Text</dt>
          <dd>DM Sans, 17px / 1.72, measure ≈ 68 characters</dd>
          <dt>Apparatus</dt>
          <dd>DM Mono, 13px, tabular figures</dd>
          <dt>Palette</dt>
          <dd>Warm paper, near-black ink, one accent blue</dd>
          <dt>Stack</dt>
          <dd>Next.js (static export), markdown-it, zero CSS frameworks</dd>
          <dt>Payload</dt>
          <dd>Two fonts, one stylesheet, no third-party requests</dd>
          <dt>Corpus</dt>
          <dd>
            {posts.length} {posts.length === 1 ? 'entry' : 'entries'} ·{' '}
            {words.toLocaleString('en-US')} words
          </dd>
        </dl>

        <h2>Conventions</h2>

        <p>
          Sections are numbered in the margin so a passage can be pointed at precisely. Footnotes
          are collected under <em>Notes</em> at the foot of each entry. Quantitative claims are
          set as monospaced figures with captions rather than charts, because a table of numbers
          survives being copied, quoted, and read aloud in a way that a picture of numbers does
          not. Every entry carries a BibTeX record, in case anyone wants to cite one.
        </p>

        <p>
          The whole thing is designed to be readable in a terminal browser, printable to a clean
          sheet of paper, and legible in ten years.
        </p>
      </div>

      <Link className="back-link" href="/">
        ← back to index
      </Link>
    </article>
  );
}
