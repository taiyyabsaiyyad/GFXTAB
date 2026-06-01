import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
