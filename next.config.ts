import type { NextConfig } from "next";
import createMDX from '@next/mdx'
import withPWA from 'next-pwa'

import path from 'path';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    return config;
  },

  output: 'export',
  // 如果部署到 https://<username>.github.io/<repo-name>/，请取消注释并替换为你的仓库名称
  // basePath: process.env.NODE_ENV !== 'development' ? '/m9ai.github.io' : '',
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    unoptimized: true
  }
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})(withMDX(nextConfig));
