import Link from 'next/link';
import { formatSerial, getPosts } from '@/lib/posts';
import { renderInlineMarkdown } from '@/lib/markdown';
import { site } from '@/lib/site';

export default function Home() {
  const posts = getPosts();

  return (
    <>
      <section className="intro">
        <h1>{site.tagline}</h1>
        <p>{site.description}</p>
      </section>

      <h2 className="rule-label">
        <span>Index</span>
        <span className="line" />
        <span className="count">
          {posts.length} {posts.length === 1 ? 'entry' : 'entries'}
        </span>
      </h2>

      {posts.length === 0 ? (
        <p className="empty">// no entries yet</p>
      ) : (
        <ol className="index-list">
          {posts.map((post) => (
            <li className="entry" key={post.slug}>
              <Link className="entry-link" href={`/writing/${post.slug}/`}>
                <span className="entry-serial">{formatSerial(post.serial)}</span>
                <span>
                  <h3 className="entry-title">
                    {post.title}
                    {post.draft && <span className="draft-flag">draft</span>}
                  </h3>
                  {post.abstract && (
                    <p
                      className="entry-abstract"
                      dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(post.abstract) }}
                    />
                  )}
                  <p className="entry-meta">
                    <span>{post.date}</span>
                    <span className="sep">·</span>
                    <span>{post.words.toLocaleString('en-US')} words</span>
                    <span className="sep">·</span>
                    <span>{post.minutes} min</span>
                    {post.tags.length > 0 && (
                      <>
                        <span className="sep">·</span>
                        <span>{post.tags.join(', ')}</span>
                      </>
                    )}
                  </p>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
