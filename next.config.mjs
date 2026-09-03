/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  // Fully static site: `next build` writes plain HTML/CSS into ./out
  output: 'export',
  trailingSlash: true,
  // The build output is committed, so a random build id per build would churn
  // every page on every publish. Chunk filenames are content-hashed already.
  generateBuildId: () => 'site',
  ...(basePath ? { basePath } : {}),
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
