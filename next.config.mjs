/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  // Fully static site: `next build` writes plain HTML/CSS into ./out
  output: 'export',
  trailingSlash: true,
  ...(basePath ? { basePath } : {}),
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
