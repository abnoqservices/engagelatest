/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },

  // 👇 This forces Webpack mode so your webpack rule works
  experimental: {
    webpackBuildWorker: true,
  },

  turbopack: {},
};

export default nextConfig;

