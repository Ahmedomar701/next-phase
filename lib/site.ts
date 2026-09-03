// Everything about "whose site is this" lives here. Edit this file, nothing else.
export const site = {
  name: 'Ahmed Omar',
  shortName: 'A. Omar',
  title: 'Ahmed Omar — Writing',
  tagline: 'Notes on technology, systems, and the machines we are building.',
  description:
    'Long-form notes and field reports on technology. Text only: no images, no trackers, no newsletter popups.',
  // Used for absolute URLs in the RSS feed and metadata. No trailing slash.
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ahmedomar701.github.io',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  language: 'en',
  // Shown in the footer. Set to '' to hide a line.
  links: [{ label: 'github', href: 'https://github.com/Ahmedomar701' }],
  // Words per minute used for reading-time estimates.
  wpm: 225,
} as const;

export function absoluteUrl(path = '/'): string {
  const base = `${site.url}${site.basePath}`.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
