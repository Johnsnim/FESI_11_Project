import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ 프로덕션 최적화
  productionBrowserSourceMaps: false,
  
  experimental: {
    serverActions: { allowedOrigins: ["*"] },
    optimizePackageImports: [
      'lucide-react',
      'react-hook-form',
      '@hookform/resolvers',
      'date-fns',
      '@tanstack/react-query',
      'next-auth',
      'axios',
    ],
  },
  
  images: {
    domains: ["sprint-fe-project.s3.ap-northeast-2.amazonaws.com"],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60,
  },

  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          
          // 큰 라이브러리 분리
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module: any) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )?.[1];
              return `npm.${packageName?.replace('@', '')}`;
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
        },
      };
    }
    
    return config;
  },
};

export default nextConfig;