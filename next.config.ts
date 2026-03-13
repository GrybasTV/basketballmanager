import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["next-auth"],
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
