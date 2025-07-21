import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import withPWA from 'next-pwa';
import withMDX from '@next/mdx';
import path from 'path';

// 基础 Next.js 配置
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  webpack(config) {
    config.resolve.alias = { ...config.resolve.alias, '@': path.join(__dirname, 'src') };
    return config;
  },
  experimental: { mdxRs: true },

  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx']
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
  disable: process.env.NODE_ENV === 'development'
});

// 插件组合 (next-intl 必须是最外层)
export default createNextIntlPlugin('./i18n.ts')(
  withPWAConfig(
    withMDXConfig(nextConfig)
  )
);
