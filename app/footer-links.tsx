import { site } from '@/lib/site';

type IconName = 'github' | 'x' | 'linkedin';

const icons: Record<IconName, { label: string; path: string; viewBox?: string }> = {
  github: {
    label: 'GitHub',
    viewBox: '0 0 24 24',
    path: 'M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.36 6.84 9.72.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.38-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2z',
  },
  x: {
    label: 'X',
    viewBox: '0 0 24 24',
    path: 'M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.01 4.06H5.04l12.04 15.71z',
  },
  linkedin: {
    label: 'LinkedIn',
    viewBox: '0 0 24 24',
    path: 'M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z',
  },
};

export default function FooterLinks() {
  return (
    <span className="footer-links">
      {site.links.map((link) => {
        const icon = icons[link.icon as IconName];
        return (
          <a
            key={link.href}
            href={link.href}
            className="footer-icon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={icon.label}
            title={icon.label}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={icon.viewBox}
              width="14"
              height="14"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d={icon.path} />
            </svg>
          </a>
        );
      })}
    </span>
  );
}
