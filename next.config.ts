import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable image optimization for photo exports
  images: {
    unoptimized: true,
  },
};

export default nextConfig;