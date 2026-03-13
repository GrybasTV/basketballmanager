import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["next-auth", "@prisma/client", "bcryptjs", "jose", "@panva/hkdf", "openid-client"],
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
