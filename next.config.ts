import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: { allowedOrigins: ["*"] },
  },
  images: {
    domains: ["sprint-fe-project.s3.ap-northeast-2.amazonaws.com"],
  },
};

export default nextConfig;
