import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/GFXTAB',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {},
  webpack: (config) => {
    config.cache = false;
    config.optimization = {
      ...config.optimization,
      minimize: false,
    };
    return config;
  },
};

export default nextConfig;
