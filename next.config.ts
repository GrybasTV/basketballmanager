import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["next-auth", "@prisma/client", "bcryptjs"],
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
