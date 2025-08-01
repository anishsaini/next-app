import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  },
  api: {
    bodyParser: {
      sizeLimit: false
    },
    responseLimit: false
  }
};

export default nextConfig;
