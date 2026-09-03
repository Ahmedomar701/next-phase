import Link from 'next/link';

export default function NotFound() {
  return (
    <article>
      <h1 className="page-title">404 — no such entry</h1>
      <div className="prose" style={{ marginTop: 0 }}>
        <p>That address does not resolve to anything written here.</p>
      </div>
      <Link className="back-link" href="/">
        ← back to index
      </Link>
    </article>
  );
}
