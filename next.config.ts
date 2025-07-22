import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import withPWA from 'next-pwa';
import withMDX from '@next/mdx';
import path from 'path';

// 基础 Next.js 配置
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  webpack(config) {
    config.resolve.alias = { ...config.resolve.alias, '@': path.join(__dirname, 'src') };
    return config;
  },
  experimental: { mdxRs: true },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/m9ai-sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ]
  },
};

// MDX 插件配置
const withMDXConfig = withMDX({
  options: {}
});

// PWA 插件配置
const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  sw: 'm9ai-sw.js',
  scope: '/',
  // exclude: ['/_next/app-build-manifest.json'] // 使用字符串路径而非正则表达式
});

// 插件组合 (next-intl 必须是最外层)
export default createNextIntlPlugin('./i18n.ts')(
  withPWAConfig(
    withMDXConfig(nextConfig)
  )
);
