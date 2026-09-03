import type { MetadataRoute } from 'next';
import { getPosts } from '@/lib/posts';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();

  return [
    { url: absoluteUrl('/'), lastModified: posts[0]?.date, priority: 1 },
    { url: absoluteUrl('/colophon/'), priority: 0.3 },
    ...posts.map((post) => ({
      url: absoluteUrl(`/writing/${post.slug}/`),
      lastModified: post.updated ?? post.date,
      priority: 0.8,
    })),
  ];
}
