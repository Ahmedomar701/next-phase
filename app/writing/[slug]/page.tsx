import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { bibtex } from '@/lib/cite';
import { renderInlineMarkdown } from '@/lib/markdown';
import { formatDate, formatSerial, getNeighbours, getPost, getPosts } from '@/lib/posts';
import { site } from '@/lib/site';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const description = post.abstract || site.description;
  return {
    title: post.title,
    description,
    alternates: { canonical: `/writing/${post.slug}/` },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: [...post.tags],
    },
  };
}

export default async function WritingPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { newer, older } = getNeighbours(post.slug);
  const showContents = post.headings.length >= 3;

  return (
    <article>
      <header className="article-header">
        <p className="eyebrow">
          Entry {formatSerial(post.serial)} · {post.date}
        </p>
        <h1 className="article-title">{post.title}</h1>

        {post.abstract && (
          <div className="article-abstract">
            <span className="label">Abstract</span>
            <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(post.abstract) }} />
          </div>
        )}

        <dl className="frontmatter">
          <dt>author</dt>
          <dd>{site.name}</dd>
          <dt>posted</dt>
          <dd>{formatDate(post.date)}</dd>
          {post.updated && (
            <>
              <dt>revised</dt>
              <dd>{formatDate(post.updated)}</dd>
            </>
          )}
          <dt>length</dt>
          <dd>
            {post.words.toLocaleString('en-US')} words · {post.minutes} min read
          </dd>
          <dt>subjects</dt>
          <dd>{post.tags.length > 0 ? post.tags.join(' · ') : '—'}</dd>
        </dl>

        {showContents && (
          <nav className="contents" aria-label="Contents">
            <h2 className="rule-label">
              <span>Contents</span>
              <span className="line" />
            </h2>
            <ol>
              {post.headings.map((heading) => (
                <li key={heading.id}>
                  <a href={`#${heading.id}`}>{heading.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </header>

      <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

      <section aria-label="Citation">
        <h2 className="rule-label">
          <span>Cite</span>
          <span className="line" />
        </h2>
        <pre className="cite-block">{bibtex(post)}</pre>
      </section>

      {(newer || older) && (
        <nav aria-label="More entries">
          <h2 className="rule-label">
            <span>Adjacent</span>
            <span className="line" />
          </h2>
          <div className="pager">
            {older ? (
              <Link className="pager-item" href={`/writing/${older.slug}/`}>
                <span className="pager-dir">← older</span>
                <span className="pager-title">{older.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {newer ? (
              <Link className="pager-item is-next" href={`/writing/${newer.slug}/`}>
                <span className="pager-dir">newer →</span>
                <span className="pager-title">{newer.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </nav>
      )}

      <Link className="back-link" href="/">
        ← back to index
      </Link>
    </article>
  );
}
