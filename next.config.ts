import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // 如果部署到 https://<username>.github.io/<repo-name>/，请取消注释并替换为你的仓库名称
  // basePath: process.env.NODE_ENV !== 'development' ? '/m9ai.github.io' : '',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
