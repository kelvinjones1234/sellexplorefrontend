import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // skips ESLint checks during builds
  },
};

export default nextConfig;
