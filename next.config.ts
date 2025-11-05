import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,

  // ✅ Tell Turbopack your real root directory
  turbopack: {
    root: __dirname, // ensures it uses this folder as root
  },
};

export default nextConfig;

