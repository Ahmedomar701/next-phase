import type { Metadata } from 'next';
import { DM_Mono, DM_Sans } from 'next/font/google';
import Link from 'next/link';
import ThemeToggle from './theme-toggle';
import { absoluteUrl, site } from '@/lib/site';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-dm-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl('/')),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name }],
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: 'en_US',
  },
  twitter: { card: 'summary' },
  alternates: {
    types: { 'application/rss+xml': `${site.basePath}/feed.xml` },
  },
};

// Applied before first paint so a stored theme never flashes.
const themeBootstrap = `try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.language} className={`${dmSans.variable} ${dmMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        <div className="shell">
          <header className="masthead">
            <div className="wrap">
              <div className="masthead-row">
                <Link href="/" className="masthead-name">
                  {site.shortName}
                </Link>
                <nav className="nav">
                  <Link href="/">index</Link>
                  <Link href="/colophon/">colophon</Link>
                  <a href={`${site.basePath}/feed.xml`}>rss</a>
                  <ThemeToggle />
                </nav>
              </div>
            </div>
          </header>

          <main className="main">
            <div className="wrap">{children}</div>
          </main>

          <footer className="footer">
            <div className="wrap">
              <div className="footer-row">
                <span>
                  © {new Date().getFullYear()} {site.name} · text only, no trackers
                </span>
                {site.links.length > 0 && (
                  <span className="footer-links">
                    {site.links.map((link) => (
                      <a key={link.href} href={link.href}>
                        {link.label}
                      </a>
                    ))}
                  </span>
                )}
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
